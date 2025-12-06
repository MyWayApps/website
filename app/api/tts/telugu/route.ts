import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as path from 'path'
import * as fs from 'fs'
import * as os from 'os'
import ffmpeg from 'fluent-ffmpeg'

const execAsync = promisify(exec)

// Array of Telugu voice variants to rotate through
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

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text parameter is required' },
        { status: 400 }
      )
    }

    // Create temp directory for audio files
    const tempDir = path.join(os.tmpdir(), 'telugu-tts')
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    // Generate unique filename
    const filename = `tts_${Date.now()}_${Math.random().toString(36).substring(7)}.mp3`
    const tempWavPath = path.join(tempDir, filename.replace('.mp3', '.wav'))
    const tempMp3Path = path.join(tempDir, filename)

    // Use espeak for TTS (Telugu support)
    // If espeak is not available, fallback to system TTS
    let ttsCommand: string
    
    try {
      // Try espeak first (supports Telugu with rotating voices)
      await execAsync('which espeak')
      const voice = getRandomVoice()
      console.log(`Using Telugu voice: ${voice}`)
      ttsCommand = `espeak -v ${voice} "${text}" -w "${tempWavPath}"`
    } catch {
      // Fallback to festival or other TTS
      try {
        await execAsync('which festival')
        ttsCommand = `echo "${text}" | festival --tts --otype wav -o "${tempWavPath}"`
      } catch {
        // Last resort: use say (macOS) or spd-say (Linux)
        try {
          await execAsync('which say')
          ttsCommand = `say "${text}" -o "${tempWavPath}" --data-format=LEF32@22050`
        } catch {
          throw new Error('No TTS engine found. Please install espeak, festival, or say.')
        }
      }
    }

    // Generate WAV file using TTS
    await execAsync(ttsCommand)

    // Verify WAV file was created
    if (!fs.existsSync(tempWavPath)) {
      throw new Error('TTS failed to generate WAV file')
    }

    // Get and set ffmpeg path
    const ffmpegPath = await getFfmpegPath()
    ffmpeg.setFfmpegPath(ffmpegPath)

    // Convert WAV to MP3 using fluent-ffmpeg
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

    // Read the MP3 file
    const audioBuffer = fs.readFileSync(tempMp3Path)

    // Clean up temp files
    try {
      if (fs.existsSync(tempWavPath)) fs.unlinkSync(tempWavPath)
      if (fs.existsSync(tempMp3Path)) fs.unlinkSync(tempMp3Path)
    } catch (cleanupError) {
      console.warn('Failed to cleanup temp files:', cleanupError)
    }

    // Return audio as base64 or buffer
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment; filename="${filename}"`,
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

