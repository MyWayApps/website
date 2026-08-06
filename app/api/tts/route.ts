import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as path from 'path'
import * as fs from 'fs'
import * as os from 'os'
import ffmpeg from 'fluent-ffmpeg'
import { synthesizeWithAzure, AzureTTSNotConfiguredError, type AzureTTSLanguage } from '@/lib/azure-tts-voices'

const execAsync = promisify(exec)

// Array of Telugu voice variants to rotate through (eSpeak fallback only —
// Azure uses a single fixed voice per language, see lib/azure-tts-voices.ts)
const teluguVoices = ['te+f3', 'te+f4', 'te+m3', 'te+m4']

// Get a random voice from the array
function getRandomVoice(): string {
  const randomIndex = Math.floor(Math.random() * teluguVoices.length)
  return teluguVoices[randomIndex]
}

// Get ffmpeg path - try ffmpeg-static first, then system ffmpeg
async function getFfmpegPath(): Promise<string> {
  try {
    // Try to import ffmpeg-static dynamically
    const ffmpegStatic = await import('ffmpeg-static')
    const staticPath = ffmpegStatic.default || ffmpegStatic

    if (staticPath && typeof staticPath === 'string' && fs.existsSync(staticPath)) {
      return staticPath
    }
  } catch (error) {
    console.warn('Could not load ffmpeg-static:', error)
  }

  // Fallback to system ffmpeg
  try {
    const { stdout } = await execAsync('which ffmpeg')
    const systemPath = stdout.trim()
    if (systemPath && fs.existsSync(systemPath)) {
      return systemPath
    }
  } catch (error) {
    console.warn('System ffmpeg not found:', error)
  }

  // Last resort: just use 'ffmpeg' and hope it's in PATH
  return 'ffmpeg'
}

// eSpeak/festival/say pipeline — used only when Azure isn't configured, or
// when a live Azure call fails (network error, quota exhausted, outage), so
// a missing key or a transient Azure issue degrades to the old robotic
// voice instead of no audio at all.
async function synthesizeWithEspeak(text: string, lang: string): Promise<Buffer> {
  const tempDir = path.join(os.tmpdir(), 'telugu-tts')
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }

  const filename = `tts_${Date.now()}_${Math.random().toString(36).substring(7)}.mp3`
  const tempWavPath = path.join(tempDir, filename.replace('.mp3', '.wav'))
  const tempMp3Path = path.join(tempDir, filename)

  let ttsCommand: string

  try {
    await execAsync('which espeak')
    const voice = lang === 'te' ? getRandomVoice() : lang
    console.log(`Using voice: ${voice} for text: ${text.substring(0, 50)}...`)
    // Default espeak speed (175 wpm) reads too fast for kids — slow it down.
    ttsCommand = `espeak -v ${voice} -s 140 "${text.replace(/"/g, '\\"')}" -w "${tempWavPath}"`
  } catch {
    try {
      await execAsync('which festival')
      ttsCommand = `echo "${text.replace(/"/g, '\\"')}" | festival --tts --otype wav -o "${tempWavPath}"`
    } catch {
      try {
        await execAsync('which say')
        ttsCommand = `say "${text.replace(/"/g, '\\"')}" -o "${tempWavPath}" --data-format=LEF32@22050`
      } catch {
        throw new Error('No TTS engine found. Please install espeak, festival, or say.')
      }
    }
  }

  await execAsync(ttsCommand)

  if (!fs.existsSync(tempWavPath)) {
    throw new Error('TTS failed to generate WAV file')
  }

  const ffmpegPath = await getFfmpegPath()
  ffmpeg.setFfmpegPath(ffmpegPath)

  await new Promise<void>((resolve, reject) => {
    ffmpeg(tempWavPath)
      .audioCodec('libmp3lame')
      .audioBitrate(64)
      .audioFrequency(22050)
      .output(tempMp3Path)
      .on('end', () => {
        if (!fs.existsSync(tempMp3Path)) {
          reject(new Error('FFmpeg conversion failed - output file not found'))
        } else {
          resolve()
        }
      })
      .on('error', (err) => {
        console.error('FFmpeg error:', err)
        reject(new Error(`FFmpeg conversion failed: ${err.message}`))
      })
      .run()
  })

  const audioBuffer = fs.readFileSync(tempMp3Path)

  try {
    if (fs.existsSync(tempWavPath)) fs.unlinkSync(tempWavPath)
    if (fs.existsSync(tempMp3Path)) fs.unlinkSync(tempMp3Path)
  } catch (cleanupError) {
    console.warn('Failed to cleanup temp files:', cleanupError)
  }

  return audioBuffer
}

/**
 * GET /api/tts?lang=te&text=...
 * Returns MP3 audio with proper headers for browser playback
 */
export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url)
    const lang = searchParams.get('lang') || 'te'
    const text = searchParams.get('text')

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text parameter is required' },
        { status: 400 }
      )
    }

    // Validate language
    const supportedLangs = ['te', 'hi', 'kn', 'ta', 'ml', 'en']
    if (!supportedLangs.includes(lang)) {
      return NextResponse.json(
        { error: `Unsupported language. Use one of: ${supportedLangs.join(', ')}.` },
        { status: 400 }
      )
    }

    let audioBuffer: Buffer

    try {
      audioBuffer = await synthesizeWithAzure(text, lang as AzureTTSLanguage)
    } catch (err) {
      if (err instanceof AzureTTSNotConfiguredError) {
        console.warn('Azure Speech not configured, falling back to eSpeak')
      } else {
        console.warn('Azure TTS request failed, falling back to eSpeak:', err)
      }
      audioBuffer = await synthesizeWithEspeak(text, lang)
    }

    // Return audio with proper headers for browser playback and caching
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Access-Control-Allow-Origin': '*', // Allow CORS
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error: any) {
    console.error('TTS Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate TTS audio' },
      { status: 500 }
    )
  }
}

/**
 * OPTIONS handler for CORS preflight requests
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

