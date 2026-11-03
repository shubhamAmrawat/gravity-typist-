import { AUDIO } from "./config";

export type SoundName =
  | "key"
  | "typo"
  | "clear"
  | "wind"
  | "flip"
  | "flipEnd"
  | "freeze"
  | "bomb"
  | "shield"
  | "shieldBlock"
  | "bossSplit"
  | "levelUp"
  | "lifeLost"
  | "gameOver";

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;

  // Browsers only allow audio after a user gesture, so call this from a key press.
  unlock(): void {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = AUDIO.masterVolume;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
  }

  play(sound: SoundName): void {
    switch (sound) {
      case "key":
        this.tone("triangle", 880, 880, 0.04, 0.25);
        break;
      case "typo":
        this.tone("sawtooth", 150, 90, 0.14, 0.5);
        break;
      case "clear":
        this.tone("square", 523, 523, 0.07, 0.45);
        this.tone("square", 784, 784, 0.07, 0.45, 0.06);
        this.tone("square", 1047, 1047, 0.12, 0.45, 0.12);
        break;
      case "wind":
        this.noise(0.6, 0.35);
        this.tone("sine", 200, 500, 0.6, 0.3);
        break;
      case "flip":
        this.tone("sine", 900, 180, 0.3, 0.6);
        this.tone("sine", 180, 900, 0.3, 0.6, 0.3);
        break;
      case "flipEnd":
        this.tone("sine", 700, 200, 0.4, 0.6);
        break;
      case "freeze":
        this.tone("sine", 2000, 800, 0.5, 0.5);
        this.tone("triangle", 1500, 3000, 0.4, 0.25, 0.05);
        break;
      case "bomb":
        this.tone("sawtooth", 160, 30, 0.7, 0.9);
        this.noise(0.6, 0.9);
        break;
      case "shield":
        this.tone("triangle", 440, 880, 0.25, 0.6);
        this.tone("sine", 880, 880, 0.3, 0.4, 0.2);
        break;
      case "shieldBlock":
        this.tone("square", 1200, 500, 0.2, 0.5);
        this.noise(0.1, 0.4);
        break;
      case "bossSplit":
        this.tone("sawtooth", 220, 110, 0.3, 0.7);
        this.tone("square", 660, 990, 0.12, 0.3, 0.08);
        this.tone("square", 660, 440, 0.12, 0.3, 0.08);
        this.noise(0.2, 0.5);
        break;
      case "levelUp":
        this.tone("triangle", 523, 523, 0.1, 0.6, 0.2);
        this.tone("triangle", 659, 659, 0.1, 0.6, 0.3);
        this.tone("triangle", 784, 784, 0.1, 0.6, 0.4);
        this.tone("triangle", 1047, 1047, 0.3, 0.6, 0.5);
        break;
      case "lifeLost":
        this.tone("sawtooth", 300, 50, 0.35, 0.8);
        this.noise(0.25, 0.6);
        break;
      case "gameOver":
        this.tone("sawtooth", 392, 370, 0.25, 0.7);
        this.tone("sawtooth", 311, 294, 0.25, 0.7, 0.25);
        this.tone("sawtooth", 196, 60, 0.8, 0.7, 0.5);
        this.noise(0.4, 0.5);
        break;
    }
  }

  private tone(
    type: OscillatorType,
    startHz: number,
    endHz: number,
    duration: number,
    volume: number,
    delay = 0,
  ): void {
    if (!this.ctx || !this.master) return;

    const start = this.ctx.currentTime + delay;
    const oscillator = this.ctx.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(startHz, start);
    oscillator.frequency.exponentialRampToValueAtTime(endHz, start + duration);

    oscillator.connect(this.fadeOut(start, duration, volume));
    oscillator.start(start);
    oscillator.stop(start + duration);
  }

  private noise(duration: number, volume: number): void {
    if (!this.ctx || !this.master) return;

    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * duration, this.ctx.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;

    const start = this.ctx.currentTime;
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.fadeOut(start, duration, volume));
    source.start(start);
  }

  private fadeOut(start: number, duration: number, volume: number): GainNode {
    const gain = this.ctx!.createGain();
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    gain.connect(this.master!);
    return gain;
  }
}
