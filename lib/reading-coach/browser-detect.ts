/**
 * Detects Safari specifically (not just any WebKit-based browser) so
 * Reading Coach can route it to a different interaction model — Safari's
 * SpeechRecognition requires `.start()` to happen synchronously within a
 * user gesture and doesn't reliably support unattended `continuous: true`
 * sessions the way Chrome/Edge do, so background auto-restarts (which
 * necessarily happen outside any click handler) are structurally doomed
 * there regardless of retry/backoff tuning.
 *
 * There's no capability-based way to detect "this browser's continuous
 * mode is unreliable" — UA/vendor sniffing is the standard, if slightly
 * fragile, approach for this specific class of problem. Chrome and Edge on
 * iOS/macOS also expose "Safari" in the vendor string but include "CriOS"/
 * "EdgiOS"/"Chrome" in the user agent, so excluding those keeps this to
 * actual Safari.
 */
export function isSafari(): boolean {
  if (typeof navigator === "undefined") return false
  const ua = navigator.userAgent
  const isAppleWebKit = /^((?!chrome|android|crios|fxios|edgios).)*safari/i.test(ua)
  return isAppleWebKit
}
