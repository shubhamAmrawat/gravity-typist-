import { COLORS, FX, WORD_EFFECTS, WORD_STYLE } from "../config";
import { textHalfWidth, type Word } from "../entities/word";
import type { GameState } from "../game/state";

export function updateFx(state: GameState, dt: number): void {
  state.particles.update(dt, state.flipTimer > 0 ? -FX.particleGravity : FX.particleGravity);
  state.shake *= Math.exp(-dt / FX.shakeDecayTime);
  state.damageFlash = Math.max(state.damageFlash - dt, 0);
  state.levelBanner = Math.max(state.levelBanner - dt, 0);
}

export function addShake(state: GameState, amount: number): void {
  state.shake = Math.min(state.shake + amount, FX.maxShake);
}

export function explodeWord(state: GameState, word: Word): void {
  burstAcrossWord(state, word, WORD_EFFECTS[word.color].display);
  addShake(state, FX.clearShake);
}

export function crashWord(state: GameState, word: Word): void {
  burstAcrossWord(state, word, COLORS.damage);
  addShake(state, FX.missShake);
  state.damageFlash = FX.damageFlashTime;
}

export function blockWord(state: GameState, word: Word): void {
  burstAcrossWord(state, word, WORD_EFFECTS.golden.display);
  addShake(state, FX.clearShake);
}

export function burstWord(state: GameState, word: Word): void {
  burstAcrossWord(state, word, WORD_EFFECTS[word.color].display);
}

function burstAcrossWord(state: GameState, word: Word, color: string): void {
  const count = word.text.length * FX.particlesPerLetter;
  const halfWidth = textHalfWidth(word.text);
  const centerY = word.y - WORD_STYLE.fontSize / 3;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = FX.particleSpeed * (0.3 + Math.random() * 0.7);
    const life = FX.particleLife * (0.5 + Math.random() * 0.5);
    const size = FX.particleSize * (0.5 + Math.random() * 0.5);
    state.particles.emit(
      word.x + (Math.random() * 2 - 1) * halfWidth,
      centerY,
      Math.cos(angle) * speed,
      Math.sin(angle) * speed,
      life,
      size,
      color,
    );
  }
}
