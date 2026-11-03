import { WORD_STYLE, type Power, type WordColor } from "../config";

export function textHalfWidth(text: string): number {
  return (text.length * WORD_STYLE.charWidth) / 2;
}

export class Word {
  vx = 0;
  vy = 0;
  typed = 0;
  hadTypo = false;
  hasEntered = false; // fully on screen at least once; only then can an edge cost a life

  // x is the word's horizontal center; y is its text baseline.
  constructor(
    readonly text: string,
    public x: number,
    public y: number,
    readonly color: WordColor,
    readonly power?: Power, // golden words only
  ) {}

  get nextLetter(): string {
    return this.text[this.typed];
  }

  get isComplete(): boolean {
    return this.typed >= this.text.length;
  }
}
