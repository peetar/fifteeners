// Web Audio API synthesizer + SpeechSynthesis + HTML5 Audio/Video helper
class SoundEngine {
  private ctx: AudioContext | null = null;
  private activeAudio: HTMLAudioElement | null = null;

  private getCtx(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public stopAll() {
    if (this.activeAudio) {
      this.activeAudio.pause();
      this.activeAudio.currentTime = 0;
      this.activeAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Starfleet Warp Jump Whoosh
  public playWarp() {
    try {
      const ctx = this.getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(980, now + 0.45);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.65);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.68);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.7);
    } catch {
      // Ignore audio errors if blocked
    }
  }

  // Phaser Beam Pew!
  public playPhaser() {
    try {
      const ctx = this.getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.22);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }

  // Red Alert Klaxon!
  public playRedAlert() {
    try {
      const ctx = this.getCtx();
      const now = ctx.currentTime;
      for (let i = 0; i < 2; i++) {
        const start = now + i * 0.55;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, start);
        osc.frequency.exponentialRampToValueAtTime(880, start + 0.38);

        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.005, start + 0.48);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.5);
      }
    } catch {}
  }

  // Starfleet Tricorder / LCARS Chirp
  public playTricorderChirp() {
    try {
      const ctx = this.getCtx();
      const now = ctx.currentTime;
      const notes = [1046.5, 1318.5, 1567.98];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.12, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.09);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.1);
      });
    } catch {}
  }

  // Victory Fanfare!
  public playVictory() {
    try {
      const ctx = this.getCtx();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const t = now + idx * 0.11;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.36);
      });
    } catch {}
  }

  // Play real audio file if present, otherwise speak the famous quote + chime
  public playMemeClip(audioSrc: string | undefined, quoteToSpeak: string) {
    this.stopAll();
    if (audioSrc) {
      const audio = new Audio(audioSrc);
      this.activeAudio = audio;
      audio.play().catch(() => {
        this.speakQuote(quoteToSpeak);
      });
    } else {
      this.speakQuote(quoteToSpeak);
    }
  }

  private speakQuote(text: string) {
    this.playTricorderChirp();
    if ('speechSynthesis' in window) {
      const clean = text.replace(/["*~_]/g, '');
      const utter = new SpeechSynthesisUtterance(clean);
      utter.rate = 1.02;
      utter.pitch = 1.05;
      window.speechSynthesis.speak(utter);
    }
  }
}

export const soundEngine = new SoundEngine();
