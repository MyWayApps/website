#!/usr/bin/env node

/**
 * Pre-generate TTS audio files for all 6 app languages via Azure Neural TTS.
 * Extracts native-script text from each language's data files, hashes it
 * (SHA-256, matching the client-side hash in lib/static-tts.ts), and skips
 * anything already generated — so re-running only fills in new content.
 *
 * Replaces the old Telugu-only, espeak-backed generate-telugu-audio.js.
 *
 * Run: node scripts/generate-audio.js  (or: npm run generate-audio)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');
const Sanscript = require('@indic-transliteration/sanscript');

// Plain `node scripts/generate-audio.js` does NOT read .env.local the way
// `next dev`/`next build` do — that env-loading is Next.js-specific, not a
// Node.js default. Load it explicitly via Next's own loader (@next/env,
// the same package Next uses internally) so AZURE_SPEECH_KEY/REGION are
// actually available here and via `npm run prebuild`, not just inside API
// routes.
const { loadEnvConfig } = require('@next/env');
loadEnvConfig(path.join(__dirname, '..'));

const LIB_DIR = path.join(__dirname, '../lib');
const AUDIO_DIR = path.join(__dirname, '../public/audio');

// Azure voice map — keep in sync with lib/azure-tts-voices.ts. Duplicated
// here (rather than imported) because this script runs as plain CommonJS
// Node with no TypeScript transpile step, same as the app's other scripts.
const AZURE_VOICE_MAP = {
  en: 'en-IN-NeerjaNeural',
  hi: 'hi-IN-MadhurNeural',
  kn: 'kn-IN-GaganNeural',
  ta: 'ta-IN-PallaviNeural',
  ml: 'ml-IN-SobhanaNeural',
  te: 'te-IN-ShrutiNeural',
};

const AZURE_LOCALE_MAP = {
  en: 'en-IN',
  hi: 'hi-IN',
  kn: 'kn-IN',
  ta: 'ta-IN',
  ml: 'ml-IN',
  te: 'te-IN',
};

function escapeSsml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildSsml(text, azureLang) {
  const voice = AZURE_VOICE_MAP[azureLang];
  const locale = AZURE_LOCALE_MAP[azureLang];
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${locale}">
  <voice name="${voice}">
    <prosody rate="-12%" pitch="+5%">${escapeSsml(text)}</prosody>
  </voice>
</speak>`;
}

async function synthesizeWithAzure(text, azureLang, key, region) {
  const endpoint = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': key,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
      'User-Agent': 'mywayapps-tts-generator',
    },
    body: buildSsml(text, azureLang),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Azure TTS failed: ${res.status} ${res.statusText} ${detail}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function hashText(text) {
  return crypto.createHash('sha256').update(text.trim(), 'utf8').digest('hex');
}

function stripGloss(text) {
  // Non-Telugu letters files store word as "नेटिव (English gloss)" — strip
  // the trailing parenthetical so the Indic voice never speaks the gloss.
  return text.replace(/\s*\([^)]*\)\s*$/, '').trim();
}

function extractTextFromFile(filePath, patterns, unicodeRange, transform) {
  const texts = new Set();
  if (!fs.existsSync(filePath)) return texts;

  const content = fs.readFileSync(filePath, 'utf8');
  patterns.forEach((pattern) => {
    const matches = content.matchAll(pattern);
    for (const match of matches) {
      let text = match[1];
      if (!unicodeRange.test(text)) continue;
      if (transform) text = transform(text);
      if (text) texts.add(text);
    }
  });
  return texts;
}

function extractTextFromArrays(filePath, arrayNames, unicodeRange, transform) {
  const texts = new Set();
  if (!fs.existsSync(filePath)) return texts;

  const content = fs.readFileSync(filePath, 'utf8');
  arrayNames.forEach((arrayName) => {
    const arrayRegex = new RegExp(
      `(?:const|export const|let|var)\\s+${arrayName}\\s*=\\s*\\[([^\\]]+)\\]`,
      'gs'
    );
    const match = content.match(arrayRegex);
    if (!match) return;

    const stringMatches = match[1].matchAll(/["']([^"']+)["']/g);
    for (const stringMatch of stringMatches) {
      let text = stringMatch[1];
      if (!unicodeRange.test(text)) continue;
      if (transform) text = transform(text);
      if (text) texts.add(text);
    }
  });
  return texts;
}

// Unlike extractTextFromArrays (one top-level `const name = [...]`), this
// matches a field name that repeats many times throughout the file — e.g.
// `passage: [...]` appears once per lesson, `options: [...]` once per
// question. Each occurrence's strings are spoken individually at runtime
// (no joining), same as any other per-string vocabulary hash.
function extractTextFromRepeatedArrayField(filePath, fieldName, unicodeRange, transform) {
  const texts = new Set();
  if (!fs.existsSync(filePath)) return texts;

  const content = fs.readFileSync(filePath, 'utf8');
  const fieldRegex = new RegExp(`${fieldName}:\\s*\\[([^\\]]+)\\]`, 'g');
  const blocks = content.matchAll(fieldRegex);
  for (const block of blocks) {
    const stringMatches = block[1].matchAll(/["']([^"']+)["']/g);
    for (const stringMatch of stringMatches) {
      let text = stringMatch[1];
      if (!unicodeRange.test(text)) continue;
      if (transform) text = transform(text);
      if (text) texts.add(text);
    }
  }
  return texts;
}

// Fill-in-the-blank runtime text isn't the raw `sentence`/`blank` fields —
// game2/page.tsx computes `sentence.replace(blank, selectedAnswer)` (or
// `.replace(blank, "______")` before any answer is picked), so the literal
// `sentence`/`blank` field values are never what's actually spoken. Parse
// each { sentence, blank, options } object and pre-generate every substituted
// variant that getSentenceWithAnswer() can actually produce.
function extractFillBlankVariants(filePath, unicodeRange, transform) {
  const texts = new Set();
  if (!fs.existsSync(filePath)) return texts;
  const content = fs.readFileSync(filePath, 'utf8');

  const questionObjRegex =
    /\{\s*sentence:\s*["']([^"']+)["'],\s*blank:\s*["']([^"']+)["'],\s*options:\s*\[([^\]]+)\]/g;
  let m;
  while ((m = questionObjRegex.exec(content))) {
    const sentence = m[1];
    const blank = m[2];
    const options = Array.from(m[3].matchAll(/["']([^"']+)["']/g)).map((x) => x[1]);
    const variants = [...options, '______'];
    variants.forEach((v) => {
      let text = sentence.replace(blank, v);
      if (!unicodeRange.test(text)) return;
      if (transform) text = transform(text);
      if (text) texts.add(text);
    });
  }
  return texts;
}

// Spelling Game Suite's practice words live outside lib/ (app/spelling-game-suite/
// spelling-game-suite.tsx's WORD_LISTS object), unlike everything else this
// script covers — kept as its own extractor rather than forcing it through
// the lib/-relative file config shape the other languages use.
function extractSpellingWords() {
  const filePath = path.join(__dirname, '../app/spelling-game-suite/spelling-game-suite.tsx');
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/const WORD_LISTS[^=]*=\s*\{([\s\S]*?)\n\}/);
  if (!match) return [];
  const words = new Set();
  for (const m of match[1].matchAll(/["']([a-zA-Z]+)["']/g)) {
    words.add(m[1].toLowerCase());
  }
  return Array.from(words);
}

// lib/poems-data.ts has one top-level key per language (same keys as
// LANGUAGES below), each an array of { lines: [...] } poems. Runtime speaks
// `poem.lines.join(" ")` as ONE utterance (app/poems/[lang]/page.tsx), so
// this returns one joined string per poem, not per line.
const POEM_LANG_ORDER = ['hindi', 'telugu', 'kannada', 'tamil', 'malayalam', 'sanskrit'];

function extractPoemsForLanguage(langKey) {
  const filePath = path.join(LIB_DIR, 'poems-data.ts');
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');

  const startMarker = `  ${langKey}: [`;
  const startIdx = content.indexOf(startMarker);
  if (startIdx === -1) return [];

  const orderIdx = POEM_LANG_ORDER.indexOf(langKey);
  let endIdx = content.length;
  if (orderIdx !== -1 && orderIdx + 1 < POEM_LANG_ORDER.length) {
    const nextMarker = `  ${POEM_LANG_ORDER[orderIdx + 1]}: [`;
    const found = content.indexOf(nextMarker, startIdx + startMarker.length);
    if (found !== -1) endIdx = found;
  }

  const section = content.slice(startIdx, endIdx);
  const poemTexts = [];
  const linesBlockRegex = /lines:\s*\[([\s\S]*?)\]/g;
  let m;
  while ((m = linesBlockRegex.exec(section))) {
    const lineStrings = Array.from(m[1].matchAll(/["']([^"']+)["']/g)).map((x) => x[1]);
    if (lineStrings.length) {
      poemTexts.push(lineStrings.join(' '));
    }
  }
  return poemTexts;
}

// ─── Per-language config ───────────────────────────────────────────────────
// Each language: output dir, Azure voice lang, the unicode range used to
// filter matches to native-script text, and the { file, patterns, arrayNames }
// list mirroring what generate-telugu-audio.js already extracted for Telugu.

const LANGUAGES = {
  telugu: {
    azureLang: 'te',
    unicodeRange: /[ఀ-౿]/,
    files: [
      {
        file: 'telugu-vocabulary-data.ts',
        patterns: [/telugu:\s*["']([^"']+)["']/g, /nameTelugu:\s*["']([^"']+)["']/g],
      },
      { file: 'telugu-letters-data.ts', patterns: [/letter:\s*["']([^"']+)["']/g, /word:\s*["']([^"']+)["']/g] },
      { file: 'telugu-words-by-length-data.ts', patterns: [/letter:\s*["']([^"']+)["']/g, /word:\s*["']([^"']+)["']/g] },
      { file: 'telugu-riddles-data.ts', patterns: [/podupu:\s*["']([^"']+)["']/g, /vidupu:\s*["']([^"']+)["']/g] },
      {
        file: 'telugu-comprehension-data.ts',
        patterns: [/question:\s*["']([^"']+)["']/g, /correctAnswer:\s*["']([^"']+)["']/g],
        repeatedArrayFields: ['passage', 'options'],
        fillBlank: true,
      },
      {
        file: 'telugu-vottulu-data.ts',
        patterns: [
          /letter:\s*["']([^"']+)["']/g,
          /vottu:\s*["']([^"']+)["']/g,
          /description:\s*["']([^"']+)["']/g,
          /telugu:\s*["']([^"']+)["']/g,
        ],
        arrayNames: ['doubleConsonantWords', 'conjunctWords', 'twoSubscriptsWords'],
      },
    ],
    commonTexts: ['అమ్మ', 'నాన్న', 'చాలా బాగుంది', 'మళ్ళీ ప్రయత్నించు', 'సరైనది', 'తప్పు'],
  },
  hindi: {
    azureLang: 'hi',
    unicodeRange: /[ऀ-ॿ]/,
    files: [
      { file: 'hindi-vocabulary-data.ts', patterns: [/hindi:\s*["']([^"']+)["']/g, /nameHindi:\s*["']([^"']+)["']/g] },
      { file: 'hindi-letters-data.ts', patterns: [/letter:\s*["']([^"']+)["']/g, /word:\s*["']([^"']+)["']/g], stripGloss: true },
      {
        file: 'hindi-comprehension-data.ts',
        patterns: [/question:\s*["']([^"']+)["']/g, /correctAnswer:\s*["']([^"']+)["']/g],
        repeatedArrayFields: ['passage', 'options'],
        fillBlank: true,
      },
    ],
  },
  kannada: {
    azureLang: 'kn',
    unicodeRange: /[ಀ-೿]/,
    files: [
      { file: 'kannada-vocabulary-data.ts', patterns: [/kannada:\s*["']([^"']+)["']/g, /nameKannada:\s*["']([^"']+)["']/g] },
      { file: 'kannada-letters-data.ts', patterns: [/letter:\s*["']([^"']+)["']/g, /word:\s*["']([^"']+)["']/g], stripGloss: true },
      {
        file: 'kannada-comprehension-data.ts',
        patterns: [/question:\s*["']([^"']+)["']/g, /correctAnswer:\s*["']([^"']+)["']/g],
        repeatedArrayFields: ['passage', 'options'],
        fillBlank: true,
      },
    ],
  },
  tamil: {
    azureLang: 'ta',
    unicodeRange: /[஀-௿]/,
    files: [
      { file: 'tamil-vocabulary-data.ts', patterns: [/tamil:\s*["']([^"']+)["']/g, /nameTamil:\s*["']([^"']+)["']/g] },
      { file: 'tamil-letters-data.ts', patterns: [/letter:\s*["']([^"']+)["']/g, /word:\s*["']([^"']+)["']/g], stripGloss: true },
      {
        file: 'tamil-comprehension-data.ts',
        patterns: [/question:\s*["']([^"']+)["']/g, /correctAnswer:\s*["']([^"']+)["']/g],
        repeatedArrayFields: ['passage', 'options'],
        fillBlank: true,
      },
    ],
  },
  malayalam: {
    azureLang: 'ml',
    unicodeRange: /[ഀ-ൿ]/,
    files: [
      { file: 'malayalam-vocabulary-data.ts', patterns: [/malayalam:\s*["']([^"']+)["']/g, /nameMalayalam:\s*["']([^"']+)["']/g] },
      { file: 'malayalam-letters-data.ts', patterns: [/letter:\s*["']([^"']+)["']/g, /word:\s*["']([^"']+)["']/g], stripGloss: true },
      {
        file: 'malayalam-comprehension-data.ts',
        patterns: [/question:\s*["']([^"']+)["']/g, /correctAnswer:\s*["']([^"']+)["']/g],
        repeatedArrayFields: ['passage', 'options'],
        fillBlank: true,
      },
    ],
  },
  sanskrit: {
    // No Sanskrit Azure voice exists — same runtime workaround as
    // lib/sanskrit-tts.ts: transliterate Devanagari to Kannada script and
    // speak it with the Kannada voice. Pre-generate the *post-transliteration*
    // text so the client's hash lookup (which also transliterates before
    // hashing) actually hits these cached files.
    azureLang: 'kn',
    unicodeRange: /[ऀ-ॿ]/,
    transliterateToKannada: true,
    files: [
      { file: 'sanskrit-vocabulary-data.ts', patterns: [/sanskrit:\s*["']([^"']+)["']/g, /nameSanskrit:\s*["']([^"']+)["']/g] },
      { file: 'sanskrit-letters-data.ts', patterns: [/letter:\s*["']([^"']+)["']/g, /word:\s*["']([^"']+)["']/g], stripGloss: true },
      {
        file: 'sanskrit-comprehension-data.ts',
        patterns: [/question:\s*["']([^"']+)["']/g, /correctAnswer:\s*["']([^"']+)["']/g],
        repeatedArrayFields: ['passage', 'options'],
        fillBlank: true,
      },
    ],
  },
  // English spelling-practice words (Spelling Game Suite) — small, bounded
  // vocabulary, unlike the free-text/AI-generated words also used there,
  // which stay on the live /api/tts path since they can't be known ahead of time.
  spelling: {
    azureLang: 'en',
    unicodeRange: /[a-zA-Z]/,
    customExtract: extractSpellingWords,
  },
};

function extractTextsForLanguage(config, langName) {
  if (config.customExtract) {
    return new Set(config.customExtract());
  }

  const texts = new Set();

  config.files.forEach(({ file, patterns, arrayNames, repeatedArrayFields, fillBlank, stripGloss: shouldStripGloss }) => {
    const filePath = path.join(LIB_DIR, file);
    const transform = shouldStripGloss ? stripGloss : undefined;

    if (patterns && patterns.length) {
      extractTextFromFile(filePath, patterns, config.unicodeRange, transform).forEach((t) => texts.add(t));
    }
    if (arrayNames && arrayNames.length) {
      extractTextFromArrays(filePath, arrayNames, config.unicodeRange, transform).forEach((t) => texts.add(t));
    }
    if (repeatedArrayFields && repeatedArrayFields.length) {
      repeatedArrayFields.forEach((fieldName) => {
        extractTextFromRepeatedArrayField(filePath, fieldName, config.unicodeRange, transform).forEach((t) =>
          texts.add(t)
        );
      });
    }
    if (fillBlank) {
      extractFillBlankVariants(filePath, config.unicodeRange, transform).forEach((t) => texts.add(t));
    }
  });

  (config.commonTexts || []).forEach((t) => texts.add(t));

  if (POEM_LANG_ORDER.includes(langName)) {
    extractPoemsForLanguage(langName).forEach((t) => {
      if (config.unicodeRange.test(t)) texts.add(t);
    });
  }

  if (config.transliterateToKannada) {
    return new Set(
      Array.from(texts)
        .map((t) => Sanscript.t(t, 'devanagari', 'kannada'))
        .filter(Boolean)
    );
  }

  return texts;
}

// ─── eSpeak fallback (used only if Azure isn't configured) ────────────────

const ESPEAK_LANG_MAP = { te: 'te', hi: 'hi', kn: 'kn', ta: 'ta', ml: 'ml', en: 'en' };

function synthesizeWithEspeak(text, azureLang, outputPath) {
  const tempWav = outputPath.replace('.mp3', '.wav');
  try {
    execSync('which espeak', { stdio: 'ignore' });
  } catch {
    console.error('✗ espeak not found and Azure not configured. Install espeak or set AZURE_SPEECH_KEY/AZURE_SPEECH_REGION.');
    process.exit(1);
  }

  const voice = ESPEAK_LANG_MAP[azureLang] || azureLang;
  // Default espeak speed (175 wpm) reads too fast for kids — slow it down,
  // matching the same -s 140 used in app/api/tts/route.ts's fallback.
  execSync(`espeak -v ${voice} -s 140 "${text.replace(/"/g, '\\"')}" -w "${tempWav}"`, { stdio: 'ignore' });

  try {
    execSync('which ffmpeg', { stdio: 'ignore' });
  } catch {
    console.error('✗ ffmpeg not found. Install it to convert espeak WAV output to MP3.');
    process.exit(1);
  }

  execSync(`ffmpeg -i "${tempWav}" -codec:a libmp3lame -b:a 64k -ar 22050 "${outputPath}" -y -loglevel quiet`);
  if (fs.existsSync(tempWav)) fs.unlinkSync(tempWav);
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function generateForLanguage(langName, config, azureKey, azureRegion) {
  const outputDir = path.join(AUDIO_DIR, langName);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`✓ Created directory: ${outputDir}`);
  }

  const texts = Array.from(extractTextsForLanguage(config, langName)).sort();
  console.log(`\n[${langName}] Found ${texts.length} unique texts`);

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (let i = 0; i < texts.length; i++) {
    const text = texts[i];
    const hash = hashText(text);
    const outputPath = path.join(outputDir, `${hash}.mp3`);

    if (fs.existsSync(outputPath)) {
      skipCount++;
      continue;
    }

    console.log(`[${langName}] [${i + 1}/${texts.length}] Generating: "${text}"`);
    try {
      if (azureKey && azureRegion) {
        const audioBuffer = await synthesizeWithAzure(text, config.azureLang, azureKey, azureRegion);
        fs.writeFileSync(outputPath, audioBuffer);
      } else {
        synthesizeWithEspeak(text, config.azureLang, outputPath);
      }
      successCount++;
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
      failCount++;
    }
  }

  const manifest = {};
  texts.forEach((text) => {
    manifest[hashText(text)] = text;
  });
  fs.writeFileSync(path.join(outputDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

  console.log(`[${langName}] Done — generated: ${successCount}, skipped: ${skipCount}, failed: ${failCount}`);
  return { successCount, skipCount, failCount, totalChars: texts.reduce((sum, t) => sum + t.length, 0) };
}

async function main() {
  console.log('========================================');
  console.log('Audio Generator — Azure Neural TTS');
  console.log('========================================');

  const azureKey = process.env.AZURE_SPEECH_KEY;
  const azureRegion = process.env.AZURE_SPEECH_REGION;

  if (azureKey && azureRegion) {
    console.log('✓ Azure Speech configured — using neural voices');
  } else {
    console.log('⚠ AZURE_SPEECH_KEY/AZURE_SPEECH_REGION not set — falling back to espeak');
  }

  let totalChars = 0;
  for (const [langName, config] of Object.entries(LANGUAGES)) {
    const result = await generateForLanguage(langName, config, azureKey, azureRegion);
    totalChars += result.totalChars;
  }

  console.log('\n========================================');
  console.log(`Total unique characters across all languages: ${totalChars}`);
  if (azureKey && azureRegion) {
    console.log('(Azure free tier: 500,000 characters/month)');
  }
  console.log('========================================\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
