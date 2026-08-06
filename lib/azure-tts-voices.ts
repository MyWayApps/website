// Azure Neural TTS — shared REST helper used by both the live /api/tts route
// and the offline pre-generator (scripts/generate-audio.js).
//
// Uses the plain HTTPS synthesis endpoint (fetch + SSML) rather than the
// microsoft-cognitiveservices-speech-sdk package: the SDK is a
// websocket/native-binding client built for streaming scenarios and has
// known Next.js serverless-bundling friction. None of that is needed for a
// one-string-in/one-MP3-out request, and the REST endpoint returns MP3
// bytes directly — no WAV/ffmpeg conversion step required.
//
// Voice short-names below are verified against Microsoft's official
// language-support docs (github.com/MicrosoftDocs/azure-ai-docs) — do not
// substitute guessed names, several Indic-language voice names differ from
// what pattern-matching on other locales would suggest.

export type AzureTTSLanguage = "en" | "hi" | "kn" | "ta" | "ml" | "te"

// Voice picked per language (mix of male/female per the app owner's choice).
// To change a language's voice, swap the short-name below for its verified
// alternative — Sanskrit has no voice of its own and rides on "kn" via
// transliteration (lib/sanskrit-tts.ts), so changing "kn" changes Sanskrit too.
//   en: en-IN-NeerjaNeural (F) / en-IN-PrabhatNeural (M)
//   hi: hi-IN-SwaraNeural (F) / hi-IN-MadhurNeural (M)
//   kn: kn-IN-SapnaNeural (F) / kn-IN-GaganNeural (M)
//   ta: ta-IN-PallaviNeural (F) / ta-IN-ValluvarNeural (M)
//   ml: ml-IN-SobhanaNeural (F) / ml-IN-MidhunNeural (M)
//   te: te-IN-ShrutiNeural (F) / te-IN-MohanNeural (M)
export const AZURE_VOICE_MAP: Record<AzureTTSLanguage, string> = {
  en: "en-IN-NeerjaNeural",
  hi: "hi-IN-MadhurNeural",
  kn: "kn-IN-GaganNeural",
  ta: "ta-IN-PallaviNeural",
  ml: "ml-IN-SobhanaNeural",
  te: "te-IN-ShrutiNeural",
}

// BCP-47 xml:lang required by SSML — voice short-name locale prefix, minus
// the voice/gender suffix.
const LOCALE_MAP: Record<AzureTTSLanguage, string> = {
  en: "en-IN",
  hi: "hi-IN",
  kn: "kn-IN",
  ta: "ta-IN",
  ml: "ml-IN",
  te: "te-IN",
}

function escapeSsml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

// Mirrors the rate/pitch tuning already used for browser voices in
// hooks/use-tts.ts (rate: 0.88, pitch: 1.05) so a line split between a
// browser voice and an Azure voice doesn't sound jarringly different in
// pacing — slightly slower, slightly warmer, kid-friendly.
export function buildSsml(text: string, lang: AzureTTSLanguage): string {
  const voice = AZURE_VOICE_MAP[lang]
  const locale = LOCALE_MAP[lang]
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${locale}">
  <voice name="${voice}">
    <prosody rate="-12%" pitch="+5%">${escapeSsml(text)}</prosody>
  </voice>
</speak>`
}

export class AzureTTSNotConfiguredError extends Error {
  constructor() {
    super("AZURE_SPEECH_KEY / AZURE_SPEECH_REGION not configured")
    this.name = "AzureTTSNotConfiguredError"
  }
}

/**
 * Synthesizes text via the Azure Speech REST endpoint and returns raw MP3
 * bytes. Throws AzureTTSNotConfiguredError if the env vars are missing, or
 * a plain Error if the Azure request itself fails — callers should catch
 * both and fall back to a local TTS engine.
 */
export async function synthesizeWithAzure(
  text: string,
  lang: AzureTTSLanguage
): Promise<Buffer> {
  const key = process.env.AZURE_SPEECH_KEY
  const region = process.env.AZURE_SPEECH_REGION

  if (!key || !region) {
    throw new AzureTTSNotConfiguredError()
  }

  const endpoint = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`
  const ssml = buildSsml(text, lang)

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
      "User-Agent": "mywayapps-tts",
    },
    body: ssml,
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => "")
    throw new Error(`Azure TTS request failed: ${res.status} ${res.statusText} ${detail}`)
  }

  const arrayBuffer = await res.arrayBuffer()
  return Buffer.from(arrayBuffer)
}
