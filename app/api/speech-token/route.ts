import { NextResponse } from 'next/server'

/**
 * GET /api/speech-token
 *
 * Issues a short-lived (~10 min) Azure Speech auth token so the browser can
 * open a recognition session directly against Azure (needed for continuous,
 * low-latency pronunciation assessment) without ever seeing AZURE_SPEECH_KEY.
 */
export async function GET() {
  const key = process.env.AZURE_SPEECH_KEY
  const region = process.env.AZURE_SPEECH_REGION

  if (!key || !region) {
    return NextResponse.json(
      { error: 'AZURE_SPEECH_KEY / AZURE_SPEECH_REGION not configured' },
      { status: 503 }
    )
  }

  const res = await fetch(
    `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
    {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': '0',
      },
    }
  )

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    return NextResponse.json(
      { error: `Azure token request failed: ${res.status} ${res.statusText} ${detail}` },
      { status: 502 }
    )
  }

  const token = await res.text()
  return NextResponse.json({ token, region })
}
