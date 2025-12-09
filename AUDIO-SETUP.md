# 🔊 Telugu Audio Setup Guide

## Quick Start (3 Steps)

### Step 1: Install Dependencies

```bash
# Ubuntu/Debian
sudo apt-get update && sudo apt-get install -y espeak ffmpeg

# macOS
brew install espeak ffmpeg
```

### Step 2: Generate Audio Files

```bash
npm run generate-audio
```

Expected output:
```
========================================
Telugu Audio Generator
========================================

📝 Extracting Telugu text from source files...
✓ Found 167 unique Telugu texts

🔊 Generating audio files...

[1/167] 🎵 Generating: "అ"...
    ✓ Created: abc123...def.mp3 (8532 bytes)
[2/167] 🎵 Generating: "అక్క"...
    ✓ Created: 789xyz...456.mp3 (9124 bytes)
...

========================================
Summary:
  Total texts: 167
  Generated: 167
  Skipped: 0
  Failed: 0
========================================

✓ Created manifest: public/audio/telugu/manifest.json

✅ Audio generation complete!
```

### Step 3: Test It

```bash
npm run dev
```

Visit any page with Telugu audio. Open DevTools Console and look for:

```
[TTS] ========================================
[TTS] playTeluguTTS called with text: అమ్మ
[TTS] ========================================
[TTS] Text hash: abc123...def
[TTS] Checking for pre-generated audio: /audio/telugu/abc123...def.mp3
[TTS] ✓ Using pre-generated static audio (fast!)
[TTS] Starting playback from URL: /audio/telugu/abc123...def.mp3
[TTS] Fetching audio blob from: /audio/telugu/abc123...def.mp3
[TTS] ✓ Audio blob received, size: 8532 bytes, type: audio/mpeg
[TTS] ✓ Audio is now playing!
[TTS] ✓ Audio playback completed
[TTS] ✓ TTS completed successfully (static)
```

## How It Works

### Architecture

```
┌─────────────────────────────────────────────────┐
│  User clicks Telugu word/letter                 │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  playTeluguTTS("అమ్మ")                          │
│  1. Calculate SHA-256 hash of text              │
│  2. Check /audio/telugu/{hash}.mp3              │
└─────────────────┬───────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
   ┌─────────┐        ┌──────────┐
   │  Found  │        │ Not Found│
   └────┬────┘        └─────┬────┘
        │                   │
        ▼                   ▼
 ┌──────────────┐   ┌────────────────┐
 │ Play static  │   │ Call server    │
 │ MP3 (fast!)  │   │ /api/tts?...   │
 └──────────────┘   └────────────────┘
```

### File Naming

- Text: `అమ్మ`
- Hash: SHA-256 → `abc123...def` (64 chars)
- File: `public/audio/telugu/abc123...def.mp3`
- URL: `/audio/telugu/abc123...def.mp3`

Same hash calculation on client (browser) and server (build script).

## Deployment

### Option 1: Commit to Git (Easiest)

```bash
# Generate audio
npm run generate-audio

# Commit files
git add public/audio/telugu/
git commit -m "Add pre-generated Telugu audio files"
git push

# Vercel will deploy automatically
```

**Pros**: Simple, version controlled, works everywhere
**Cons**: Larger repo size (~1-3 MB for all audio)

### Option 2: Upload to CDN (Advanced)

1. Generate audio locally
2. Upload `public/audio/telugu/*.mp3` to AWS S3 / Cloudflare R2 / etc.
3. Update client to check CDN URL first
4. Add CDN domain to Next.js config

**Pros**: Smaller repo, faster CDN delivery
**Cons**: More complex setup, requires CDN account

## Adding New Telugu Text

### Vocabulary Data

Add to `lib/telugu-vocabulary-data.ts`:

```typescript
{
  english: "Grandpa",
  telugu: "తాతయ్య"  // ← New text
}
```

### Letters Data

Add to `lib/telugu-letters-data.ts`:

```typescript
{
  letter: "న",
  word: "నవ్వు"  // ← New text
}
```

### Regenerate

```bash
npm run generate-audio
```

The script only generates missing files (skips existing ones).

## Troubleshooting

### No Audio in Browser

**Check Console Logs:**
```
[TTS] ⚠ Pre-generated audio not found, using server fallback
```
→ Audio file missing, run `npm run generate-audio`

**Check Network Tab:**
- Request to `/audio/telugu/{hash}.mp3` → 404
- Request to `/api/tts?lang=te&text=...` → 200

### Audio Quality Issues

**Improve Quality:**

Edit `scripts/generate-telugu-audio.js`:

```javascript
// Higher bitrate (better quality, larger files)
const ffmpegCmd = `ffmpeg -i "${tempWav}" -codec:a libmp3lame -b:a 128k -ar 44100 "${outputPath}" -y -loglevel quiet`;
//                                                              ^^^^     ^^^^^
//                                                              64k→128k  22050→44100
```

Regenerate:
```bash
rm -rf public/audio/telugu/*.mp3
npm run generate-audio
```

### Different Voices

The script rotates through 4 Telugu voices:
- `te+f3` - Female voice 3
- `te+f4` - Female voice 4
- `te+m3` - Male voice 3
- `te+m4` - Male voice 4

To use only one voice, edit `scripts/generate-telugu-audio.js`:

```javascript
// const voices = ['te+f3', 'te+f4', 'te+m3', 'te+m4'];
// const voice = voices[Math.floor(Math.random() * voices.length)];
const voice = 'te+f3'; // Always use female voice 3
```

## Testing Checklist

- [ ] Install espeak & ffmpeg
- [ ] Run `npm run generate-audio` successfully
- [ ] Check `public/audio/telugu/` has MP3 files
- [ ] Start dev server `npm run dev`
- [ ] Open Telugu vocabulary page
- [ ] Click a word/letter
- [ ] Hear audio immediately
- [ ] Check console shows "Using pre-generated static audio"
- [ ] Test in Chrome, Safari, Firefox
- [ ] Verify audio works in all browsers

## Performance Comparison

| Method | First Play | Subsequent | Reliability | Browser Support |
|--------|-----------|------------|-------------|-----------------|
| **Pre-generated (NEW)** | 50-100ms | 10-20ms | 100% | All browsers ✅ |
| Server TTS (fallback) | 500-1000ms | 500-1000ms | 95% | All browsers ✅ |
| Browser TTS (OLD) | 100-500ms | 100-500ms | 30% | Partial ❌ |

## Cost Analysis

### Pre-generated Audio
- Build time: ~1 min for 200 files (one-time)
- Storage: ~1-3 MB
- Bandwidth: ~10 KB per audio play
- Monthly cost: **$0** (included in Vercel free tier)

### Server TTS (Fallback)
- Processing: ~500ms per request
- Bandwidth: ~10 KB per play
- Monthly cost: **$0** (espeak is free, or use free tier of cloud TTS)

### Cloud TTS (Optional Upgrade)
- Google Cloud TTS: $4 per 1M characters
- 200 texts × 10 chars avg = 2,000 chars
- One-time cost: **$0.008** (~1 cent!)

## Next Steps

1. ✅ You've set up pre-generated audio!
2. Test on all your Telugu pages
3. Monitor console logs for any missing audio
4. Consider upgrading to Google Cloud TTS for better quality (optional)
5. Deploy to Vercel and test in production

## Questions?

Common issues are covered in `scripts/README.md`. If you hit problems:

1. Check console logs (look for `[TTS]` prefix)
2. Verify audio files exist in `public/audio/telugu/`
3. Check Network tab in DevTools
4. Ensure espeak & ffmpeg are installed

