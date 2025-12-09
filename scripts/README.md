# Telugu Audio Generation

This directory contains scripts for pre-generating Telugu TTS audio files.

## Overview

Instead of relying on browser-based TTS (which is unreliable for Telugu), we pre-generate MP3 files for all Telugu text in the app. This provides:

- ✅ **100% Reliability**: Works on ALL browsers (Chrome, Safari, Firefox, Edge)
- ✅ **Fast Playback**: No server processing, instant audio
- ✅ **Consistent Quality**: Same voice across all devices
- ✅ **Free/Cheap**: Static files, no runtime costs
- ✅ **Cacheable**: Browser caches audio files

## Prerequisites

Install these tools on your system:

### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install espeak ffmpeg
```

### macOS
```bash
brew install espeak ffmpeg
```

### Windows (WSL recommended)
Use WSL (Windows Subsystem for Linux) and follow Ubuntu instructions.

## Usage

### 1. Generate Audio Files

```bash
npm run generate-audio
```

This script will:
1. Extract all Telugu text from `lib/telugu-vocabulary-data.ts` and `lib/telugu-letters-data.ts`
2. Generate a SHA-256 hash for each unique text
3. Create MP3 files in `public/audio/telugu/`
4. Create a manifest file for reference

### 2. Build & Deploy

Audio files are automatically generated before build:

```bash
npm run build
```

The `prebuild` script runs `generate-audio` automatically.

### 3. Manual Generation (Optional)

You can also run the script directly:

```bash
node scripts/generate-telugu-audio.js
```

## How It Works

### Client-Side (Browser)
1. User triggers TTS with Telugu text
2. Client calculates SHA-256 hash of text
3. Client checks for `/audio/telugu/{hash}.mp3`
4. If exists → plays static file (fast!)
5. If not exists → falls back to server TTS

### Server-Side (Build Time)
1. Script extracts all Telugu text from source
2. For each text, generates `{hash}.mp3` using espeak
3. Files are committed to repo or uploaded to CDN
4. Static files served by Vercel/Next.js

## File Structure

```
public/audio/telugu/
├── {hash1}.mp3  # అమ్మ
├── {hash2}.mp3  # నాన్న
├── {hash3}.mp3  # తల్లి
├── ...
└── manifest.json  # Maps hash → text (for reference)
```

## Adding New Telugu Text

1. Add Telugu text to your data files (`lib/telugu-vocabulary-data.ts`, etc.)
2. Run `npm run generate-audio`
3. Commit the new MP3 files
4. Deploy

## Troubleshooting

### "espeak not found"
Install espeak: `sudo apt-get install espeak` or `brew install espeak`

### "ffmpeg not found"
Install ffmpeg: `sudo apt-get install ffmpeg` or `brew install ffmpeg`

### Audio quality issues
Adjust espeak/ffmpeg parameters in `generate-telugu-audio.js`:
- Change voice: `te+f3`, `te+f4`, `te+m3`, `te+m4`
- Change bitrate: `-b:a 64k` (higher = better quality, larger files)
- Change sample rate: `-ar 22050` (44100 for higher quality)

### Disk space concerns
- Each MP3 is ~5-15 KB
- 200 texts = ~1-3 MB total
- Very reasonable for static hosting

## Advanced Options

### Use Cloud TTS (Better Quality)

For production, you might want to use Google Cloud TTS or Azure:

```javascript
// Example with Google Cloud TTS
const textToSpeech = require('@google-cloud/text-to-speech');
const client = new textToSpeech.TextToSpeechClient();

const [response] = await client.synthesizeSpeech({
  input: { text: teluguText },
  voice: { languageCode: 'te-IN', name: 'te-IN-Standard-A' },
  audioConfig: { audioEncoding: 'MP3' },
});

fs.writeFileSync(outputPath, response.audioContent, 'binary');
```

This provides higher quality but requires API credentials and costs money (though still cheap).

## Performance

- **Pre-generated (recommended)**: 0ms server time, instant playback
- **Server TTS (fallback)**: ~500-1000ms generation + network latency
- **Browser TTS (old approach)**: Unreliable, wrong voices

## License

Same as parent project.

