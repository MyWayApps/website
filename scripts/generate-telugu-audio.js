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
 * Extract all Telugu text from vocabulary data
 */
function extractTeluguText() {
  const texts = new Set();
  
  // Read vocabulary data
  const vocabPath = path.join(__dirname, '../lib/telugu-vocabulary-data.ts');
  if (fs.existsSync(vocabPath)) {
    const content = fs.readFileSync(vocabPath, 'utf8');
    
    // Extract telugu: "..." patterns
    const matches = content.matchAll(/telugu:\s*["']([^"']+)["']/g);
    for (const match of matches) {
      texts.add(match[1]);
    }
    
    // Extract nameTelugu: "..." patterns
    const nameMatches = content.matchAll(/nameTelugu:\s*["']([^"']+)["']/g);
    for (const match of nameMatches) {
      texts.add(match[1]);
    }
  }
  
  // Read letters data
  const lettersPath = path.join(__dirname, '../lib/telugu-letters-data.ts');
  if (fs.existsSync(lettersPath)) {
    const content = fs.readFileSync(lettersPath, 'utf8');
    
    // Extract letter: "..." patterns
    const letterMatches = content.matchAll(/letter:\s*["']([^"']+)["']/g);
    for (const match of letterMatches) {
      texts.add(match[1]);
    }
    
    // Extract word: "..." patterns
    const wordMatches = content.matchAll(/word:\s*["']([^"']+)["']/g);
    for (const match of wordMatches) {
      texts.add(match[1]);
    }
  }
  
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

