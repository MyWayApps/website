#!/usr/bin/env node

/**
 * Pre-generate Telugu TTS audio files
 * This script extracts all Telugu text from the app and generates MP3 files
 * Run: node scripts/generate-telugu-audio.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

// Output directory for audio files
const OUTPUT_DIR = path.join(__dirname, '../public/audio/telugu');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log('✓ Created directory:', OUTPUT_DIR);
}

/**
 * Generate SHA-256 hash of text (matches client-side hash)
 */
function hashText(text) {
  return crypto.createHash('sha256').update(text.trim(), 'utf8').digest('hex');
}

/**
 * Generate MP3 audio file using espeak
 */
function generateAudio(text, outputPath) {
  const tempWav = outputPath.replace('.mp3', '.wav');
  
  try {
    // Check if espeak is available
    try {
      execSync('which espeak', { stdio: 'ignore' });
    } catch {
      console.error('✗ espeak not found. Install it:');
      console.error('  Ubuntu/Debian: sudo apt-get install espeak');
      console.error('  macOS: brew install espeak');
      process.exit(1);
    }
    
    // Generate WAV using espeak with Telugu voice
    const voices = ['te+f3', 'te+f4', 'te+m3', 'te+m4'];
    const voice = voices[Math.floor(Math.random() * voices.length)];
    
    const espeakCmd = `espeak -v ${voice} "${text.replace(/"/g, '\\"')}" -w "${tempWav}"`;
    execSync(espeakCmd, { stdio: 'ignore' });
    
    // Convert WAV to MP3 using ffmpeg
    try {
      execSync('which ffmpeg', { stdio: 'ignore' });
    } catch {
      console.error('✗ ffmpeg not found. Install it:');
      console.error('  Ubuntu/Debian: sudo apt-get install ffmpeg');
      console.error('  macOS: brew install ffmpeg');
      process.exit(1);
    }
    
    const ffmpegCmd = `ffmpeg -i "${tempWav}" -codec:a libmp3lame -b:a 64k -ar 22050 "${outputPath}" -y -loglevel quiet`;
    execSync(ffmpegCmd);
    
    // Clean up temp WAV file
    if (fs.existsSync(tempWav)) {
      fs.unlinkSync(tempWav);
    }
    
    return true;
  } catch (error) {
    console.error('✗ Failed to generate audio for:', text);
    console.error('  Error:', error.message);
    return false;
  }
}

/**
 * Generic function to extract Telugu text from a file using regex patterns
 * @param {string} filePath - Path to the file
 * @param {Array<RegExp>} patterns - Array of regex patterns to match Telugu text
 * @returns {Set<string>} Set of extracted Telugu texts
 */
function extractTextFromFile(filePath, patterns) {
  const texts = new Set();
  
  if (!fs.existsSync(filePath)) {
    return texts;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  patterns.forEach(pattern => {
    const matches = content.matchAll(pattern);
    for (const match of matches) {
      const text = match[1];
      // Only add if it contains Telugu characters (Unicode range: 0C00-0C7F)
      if (/[\u0C00-\u0C7F]/.test(text)) {
        texts.add(text);
      }
    }
  });
  
  return texts;
}

/**
 * Extract Telugu text from array literals (e.g., ["word1", "word2"])
 * @param {string} filePath - Path to the file
 * @param {Array<string>} arrayNames - Array of variable/const names to look for
 * @returns {Set<string>} Set of extracted Telugu texts
 */
function extractTextFromArrays(filePath, arrayNames) {
  const texts = new Set();
  
  if (!fs.existsSync(filePath)) {
    return texts;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  arrayNames.forEach(arrayName => {
    // Match array declarations like: const arrayName = ["word1", "word2", ...]
    const arrayRegex = new RegExp(
      `(?:const|export const|let|var)\\s+${arrayName}\\s*=\\s*\\[([^\\]]+)\\]`,
      'gs'
    );
    const match = content.match(arrayRegex);
    
    if (match) {
      // Extract all quoted strings from the array
      const stringMatches = match[1].matchAll(/["']([^"']+)["']/g);
      for (const stringMatch of stringMatches) {
        const text = stringMatch[1];
        // Only add if it contains Telugu characters
        if (/[\u0C00-\u0C7F]/.test(text)) {
          texts.add(text);
        }
      }
    }
  });
  
  return texts;
}

/**
 * Extract all Telugu text from all data files
 */
function extractTeluguText() {
  const texts = new Set();
  const libDir = path.join(__dirname, '../lib');
  
  // Define file patterns: { filePath, patterns, arrayNames }
  const fileConfigs = [
    {
      file: 'telugu-vocabulary-data.ts',
      patterns: [
        /telugu:\s*["']([^"']+)["']/g,
        /nameTelugu:\s*["']([^"']+)["']/g,
      ],
      arrayNames: []
    },
    {
      file: 'telugu-letters-data.ts',
      patterns: [
        /letter:\s*["']([^"']+)["']/g,
        /word:\s*["']([^"']+)["']/g,
      ],
      arrayNames: []
    },
    {
      file: 'telugu-vottulu-data.ts',
      patterns: [
        /letter:\s*["']([^"']+)["']/g,
        /vottu:\s*["']([^"']+)["']/g,
        /description:\s*["']([^"']+)["']/g,
        /telugu:\s*["']([^"']+)["']/g,
      ],
      arrayNames: [
        'doubleConsonantWords',
        'conjunctWords',
        'twoSubscriptsWords'
      ]
    }
  ];
  
  // Process each file configuration
  fileConfigs.forEach(config => {
    const filePath = path.join(libDir, config.file);
    
    // Extract using regex patterns
    if (config.patterns && config.patterns.length > 0) {
      const extracted = extractTextFromFile(filePath, config.patterns);
      extracted.forEach(text => texts.add(text));
    }
    
    // Extract from array literals
    if (config.arrayNames && config.arrayNames.length > 0) {
      const extracted = extractTextFromArrays(filePath, config.arrayNames);
      extracted.forEach(text => texts.add(text));
    }
  });
  
  // Add common UI texts (you can expand this list)
  const commonTexts = [
    'అమ్మ',
    'నాన్న',
    'చాలా బాగుంది',
    'మళ్ళీ ప్రయత్నించు',
    'సరైనది',
    'తప్పు',
  ];
  
  commonTexts.forEach(t => texts.add(t));
  
  return Array.from(texts).sort();
}

/**
 * Main function
 */
function main() {
  console.log('========================================');
  console.log('Telugu Audio Generator');
  console.log('========================================\n');
  
  // Extract all Telugu text
  console.log('📝 Extracting Telugu text from source files...');
  const teluguTexts = extractTeluguText();
  console.log(`✓ Found ${teluguTexts.length} unique Telugu texts\n`);
  
  // Generate audio files
  console.log('🔊 Generating audio files...\n');
  let successCount = 0;
  let skipCount = 0;
  
  teluguTexts.forEach((text, index) => {
    const hash = hashText(text);
    const filename = `${hash}.mp3`;
    const outputPath = path.join(OUTPUT_DIR, filename);
    
    // Skip if file already exists
    if (fs.existsSync(outputPath)) {
      console.log(`[${index + 1}/${teluguTexts.length}] ⏭  Skipped: "${text}" (already exists)`);
      skipCount++;
      return;
    }
    
    console.log(`[${index + 1}/${teluguTexts.length}] 🎵 Generating: "${text}"...`);
    
    if (generateAudio(text, outputPath)) {
      const stats = fs.statSync(outputPath);
      console.log(`    ✓ Created: ${filename} (${stats.size} bytes)`);
      successCount++;
    }
  });
  
  // Summary
  console.log('\n========================================');
  console.log('Summary:');
  console.log(`  Total texts: ${teluguTexts.length}`);
  console.log(`  Generated: ${successCount}`);
  console.log(`  Skipped: ${skipCount}`);
  console.log(`  Failed: ${teluguTexts.length - successCount - skipCount}`);
  console.log('========================================\n');
  
  // Create a manifest file
  const manifest = {};
  teluguTexts.forEach(text => {
    const hash = hashText(text);
    manifest[hash] = text;
  });
  
  const manifestPath = path.join(OUTPUT_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('✓ Created manifest:', manifestPath);
  console.log('\n✅ Audio generation complete!\n');
}

// Run the script
main();

