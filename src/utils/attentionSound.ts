/** Interval between periodic reminders while open maintenance or missing-items work exists. */
export const REMINDER_MS = 3 * 60 * 1000;

let audioContext: AudioContext | null = null;
let unlockListenerAttached = false;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

/**
 * Resumes the AudioContext after a user gesture. Idempotent.
 */
export function unlockAttentionAudio(): void {
  const ctx = getContext();
  if (!ctx) return;
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
}

/**
 * Attach a one-time pointer listener so the first tap unlocks audio (browser autoplay policy).
 */
export function attachAttentionAudioUnlockOnFirstGesture(): void {
  if (typeof window === "undefined" || unlockListenerAttached) return;
  unlockListenerAttached = true;
  window.addEventListener(
    "pointerdown",
    () => {
      unlockAttentionAudio();
    },
    { once: true, passive: true }
  );
}

function playTone(ctx: AudioContext, frequency: number, when: number, duration: number): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(frequency, when);
  osc.connect(gain);
  gain.connect(ctx.destination);
  const peak = 0.12;
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(peak, when + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
  osc.start(when);
  osc.stop(when + duration);
}

function playChime(ctx: AudioContext): void {
  const t = ctx.currentTime;
  playTone(ctx, 880, t, 0.12);
  playTone(ctx, 1174, t + 0.14, 0.14);
}

function playSimpleTone(ctx: AudioContext): void {
  const t = ctx.currentTime;
  playTone(ctx, 660, t, 0.08);
}

/**
 * Simple single-tone notification sound for maintenance reports.
 */
export function playNotificationSound(): void {
  const ctx = getContext();
  if (!ctx) return;

  if (ctx.state === "running") {
    playSimpleTone(ctx);
    return;
  }

  void ctx.resume().then(() => {
    if (ctx.state === "running") {
      playSimpleTone(ctx);
    }
  });
}
