import confetti from 'canvas-confetti';
import { SpeechRateMode } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled = true;
  public speechRate: SpeechRateMode = 'normal';
  public calmMode = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public stopAll(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
          window.speechSynthesis.cancel();
        }
      } catch {
        // ignore
      }
    }
  }

  public playPop(): void {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(840, ctx.currentTime + 0.11);
      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.11);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.11);
    } catch {
      // ignore
    }
  }

  public playDrop(): void {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(640, ctx.currentTime + 0.14);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.14);
    } catch {
      // ignore
    }
  }

  public playSuccess(): void {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = ctx.currentTime + i * 0.08;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.24);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.24);
      });
    } catch {
      // ignore
    }
  }

  public playLevelUp(): void {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      [440, 554.37, 659.25, 880, 1108.73].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = ctx.currentTime + i * 0.09;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.32);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.32);
      });
    } catch {
      // ignore
    }
  }

  public playRobotBeep(): void {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const notes = [
        { freq: 587.33, offset: 0, dur: 0.08 },
        { freq: 880, offset: 0.075, dur: 0.09 },
        { freq: 1174.66, offset: 0.16, dur: 0.14 },
      ];
      notes.forEach(({ freq, offset, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = ctx.currentTime + offset;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + dur);
      });
    } catch {
      // ignore
    }
  }
}

export const sound = new SoundEngine();

let cachedVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const refreshVoices = () => {
    try {
      cachedVoices = window.speechSynthesis.getVoices();
    } catch {
      cachedVoices = [];
    }
  };
  refreshVoices();
  window.speechSynthesis.addEventListener?.('voiceschanged', refreshVoices);
}

const BASQUE_UNITS = [
  'zero',
  'bat',
  'bi',
  'hiru',
  'lau',
  'bost',
  'sei',
  'zazpi',
  'zortzi',
  'bederatzi',
  'hamar',
  'hamaika',
  'hamabi',
  'hamahiru',
  'hamalau',
  'hamabost',
  'hamasei',
  'hamazazpi',
  'hamazortzi',
  'hemeretzi',
];

function basqueCardinal(n: number): string {
  if (!Number.isFinite(n) || n < 0) return String(n);
  if (n < 20) return BASQUE_UNITS[n];
  if (n === 100) return 'ehun';
  if (n < 100) {
    const twenties = Math.floor(n / 20);
    const rem = n % 20;
    const baseMap: Record<number, string> = {
      1: 'hogei',
      2: 'berrogei',
      3: 'hirurogei',
      4: 'laurogei',
    };
    const base = baseMap[twenties] ?? '';
    if (rem === 0) return base;
    return `${base}ta ${BASQUE_UNITS[rem]}`;
  }
  return String(n);
}

function basqueOrdinal(n: number): string {
  const specials: Record<number, string> = {
    1: 'lehenengo',
    2: 'bigarren',
    3: 'hirugarren',
    4: 'laugarren',
    5: 'bosgarren',
    6: 'seigarren',
    7: 'zazpigarren',
    8: 'zortzigarren',
    9: 'bederatzigarren',
    10: 'hamargarren',
  };
  if (specials[n]) return specials[n];
  const card = basqueCardinal(n);
  if (card.endsWith('bost')) return `${card.slice(0, -1)}garren`;
  return `${card}garren`;
}

function basqueNumberWithSuffix(n: number, suffix: string): string {
  const card = basqueCardinal(n);
  const lowSuffix = suffix.toLowerCase();
  if (lowSuffix === 'etan' || lowSuffix === 'tan') {
    if (n === 1) return 'batean';
    if (n === 2) return 'bietan';
    if (n === 10 || card.endsWith('r')) return `${card}retan`;
    if (card.endsWith('t')) return `${card}etan`;
    return `${card}etan`;
  }
  if (lowSuffix === 'ean' || lowSuffix === 'an') {
    if (n === 1) return 'batean';
    if (card.endsWith('r')) return `${card}rean`;
    return `${card}an`;
  }
  return `${card}${lowSuffix}`;
}

function capitalizeWord(word: string): string {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function normalizeBasqueForSpeech(text: string, isNativeBasque: boolean): string {
  let result = text;

  // Replace visual separators with natural speech pauses
  result = result.replace(/\s*\/\/\s*/g, ', ').replace(/\s*[·•]\s*/g, ', ');

  // Common educational abbreviations
  result = result.replace(/\bLH\s*1\b/gi, 'Lehen Hezkuntzako lehenengo maila');
  result = result.replace(/\bLH\b/gi, 'Lehen Hezkuntza');

  // Decimals like 4.2 -> lau puntu bi
  result = result.replace(/(\d+)\.(\d+)/g, (_, a: string, b: string) => {
    return `${basqueCardinal(Number(a))} puntu ${basqueCardinal(Number(b))}`;
  });

  // Percentages like 25% -> ehuneko hogeita bost
  result = result.replace(/(\d{1,3})\s*%/g, (_, num: string) => {
    return `ehuneko ${basqueCardinal(Number(num))}`;
  });

  // Fractions / progress like 1/4 or 2/6 -> lautik bat, seitik bi
  result = result.replace(/(\d{1,2})\s*\/\s*(\d{1,2})/g, (_, a: string, b: string) => {
    const total = basqueCardinal(Number(b));
    const part = basqueCardinal(Number(a));
    const abl = total.endsWith('i') || total.endsWith('u') || total.endsWith('o') || total.endsWith('a') || total.endsWith('e')
      ? `${total}tik`
      : `${total}etik`;
    return `${abl} ${part}`;
  });

  // Numbers with Basque suffixes like 7etan -> zazpietan
  result = result.replace(/\b(\d{1,2})(etan|tan|ean|an|tik|ra|ko)\b/gi, (_, num: string, suf: string) => {
    return basqueNumberWithSuffix(Number(num), suf);
  });

  // Ordinals like "2. misioa" or "1. egoera" -> "Bigarren misioa", "lehenengo egoera"
  result = result.replace(
    /(^|[\s(«"']|[.!?]\s+)(\d{1,2})\.(?=\s|$)/g,
    (full, prefix: string, num: string, offset: number) => {
      const ord = basqueOrdinal(Number(num));
      const atSentenceStart = offset === 0 || /[.!?]\s+$/.test(prefix);
      return `${prefix}${atSentenceStart ? capitalizeWord(ord) : ord}`;
    }
  );

  // Any remaining standalone numbers 0..100 -> Basque cardinals
  result = result.replace(/\b(\d{1,3})\b/g, (_, num: string) => {
    return basqueCardinal(Number(num));
  });

  // Clean spacing around punctuation
  result = result.replace(/([.!?])\s+/g, '$1 ').replace(/\s+/g, ' ').trim();

  // If the OS/browser has no Basque TTS voice and uses a Spanish voice fallback,
  // gently adapt uniquely Basque digraphs/letters that Spanish TTS misreads
  if (!isNativeBasque) {
    result = result
      .replace(/\bTx/g, 'Ch')
      .replace(/\btx/g, 'ch')
      .replace(/tx/g, 'ch')
      .replace(/Tx/g, 'Ch')
      .replace(/\bKaixo\b/g, 'Kaisho')
      .replace(/\bkaixo\b/g, 'kaisho')
      .replace(/\bPixi/g, 'Pishi')
      .replace(/\bpixi/g, 'pishi');
  }

  return result;
}

function isBasqueVoice(v: SpeechSynthesisVoice): boolean {
  const lang = v.lang.toLowerCase().replace('_', '-');
  const name = v.name.toLowerCase();
  return (
    lang === 'eu' ||
    lang.startsWith('eu-') ||
    /\b(basque|euskara|euskera|vasco|ander|ainhoa)\b/i.test(name)
  );
}

function pickBasqueVoice(): { voice: SpeechSynthesisVoice | null; isNativeBasque: boolean } {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return { voice: null, isNativeBasque: false };
  }
  const liveVoices = window.speechSynthesis.getVoices();
  const voices = liveVoices.length > 0 ? liveVoices : cachedVoices;
  if (!voices.length) return { voice: null, isNativeBasque: false };

  const basqueExact = voices.filter(isBasqueVoice);
  if (basqueExact.length > 0) {
    const preferred = basqueExact.find((v) => /natural|neural|online|google|microsoft/i.test(v.name));
    return { voice: preferred || basqueExact[0], isNativeBasque: true };
  }

  // Fallback to a clear Spanish voice if eu-ES is unavailable on the OS
  const fallbackEs = voices.filter((v) => v.lang.toLowerCase().replace('_', '-').startsWith('es-es'));
  if (fallbackEs.length > 0) {
    const preferredEs = fallbackEs.find((v) => /natural|neural|online|google|microsoft/i.test(v.name));
    return { voice: preferredEs || fallbackEs[0], isNativeBasque: false };
  }

  const anyEs = voices.filter((v) => v.lang.toLowerCase().startsWith('es'));
  if (anyEs.length > 0) return { voice: anyEs[0], isNativeBasque: false };

  return { voice: null, isNativeBasque: false };
}

export function speakBasque(
  text: string,
  options?: { onStart?: () => void; onEnd?: () => void; playChime?: boolean }
): void {
  if (!sound.enabled) {
    options?.onEnd?.();
    return;
  }
  if (options?.playChime) {
    sound.playPop();
  }
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    options?.onEnd?.();
    return;
  }

  try {
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const { voice, isNativeBasque } = pickBasqueVoice();
    const spokenText = normalizeBasqueForSpeech(text, isNativeBasque);
    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = voice ? voice.lang : 'eu-ES';

    if (voice) {
      utterance.voice = voice;
    }

    const rateMap: Record<SpeechRateMode, number> = {
      slow: 0.82,
      normal: 0.95,
      fast: 1.12,
    };
    utterance.rate = rateMap[sound.speechRate] ?? 0.95;
    utterance.pitch = 1.03;

    utterance.onstart = () => options?.onStart?.();
    utterance.onend = () => options?.onEnd?.();
    utterance.onerror = () => options?.onEnd?.();

    window.speechSynthesis.speak(utterance);
  } catch {
    options?.onEnd?.();
  }
}

export function triggerSparkles(originTarget?: EventTarget | null): void {
  if (sound.calmMode) return;
  try {
    let x = 0.5;
    let y = 0.5;
    if (originTarget && originTarget instanceof HTMLElement && window.innerWidth > 0) {
      const rect = originTarget.getBoundingClientRect();
      x = Math.max(0.05, Math.min(0.95, (rect.left + rect.width / 2) / window.innerWidth));
      y = Math.max(0.05, Math.min(0.95, (rect.top + rect.height / 2) / window.innerHeight));
    }
    confetti({
      particleCount: 16,
      spread: 55,
      startVelocity: 16,
      ticks: 40,
      gravity: 0.65,
      origin: { x, y },
      colors: ['#fbbf24', '#38bdf8', '#f43f5e', '#a855f7', '#34d399'],
      shapes: ['star'],
      scalar: 0.9,
      disableForReducedMotion: true,
    });
  } catch {
    // ignore
  }
}

export function triggerCelebration(particleCount = 100): void {
  if (sound.calmMode) return;
  try {
    confetti({
      particleCount,
      spread: 75,
      origin: { y: 0.6 },
      disableForReducedMotion: true,
    });
  } catch {
    // ignore
  }
}
