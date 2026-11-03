import { FLIP, FREEZE, FX, WIND, WORD_EFFECTS, type Power } from "../config";
import type { Word } from "../entities/word";
import type { GameState } from "../game/state";
import { addShake, burstWord } from "./fx";
import { clampGravity } from "./physics";
import { scoreWord } from "./scoring";

export function applyWordEffect(state: GameState, word: Word): void {
  const { gravityFactor } = WORD_EFFECTS[word.color];
  state.gravityMultiplier = clampGravity(state.gravityMultiplier * gravityFactor);

  if (word.color === "green") startWind(state);
  if (word.color === "purple") state.flipTimer = FLIP.duration;
}

// Returns the number of extra words cleared, which only a bomb produces.
export function applyPower(state: GameState, power: Power): number {
  switch (power) {
    case "freeze":
      state.freezeTimer = FREEZE.duration;
      return 0;
    case "shield":
      state.hasShield = true;
      return 0;
    case "bomb":
      return detonate(state);
  }
}

// Bombed words score, but trigger no color effects and don't extend the combo.
function detonate(state: GameState): number {
  const destroyed = state.words;
  for (const word of destroyed) {
    scoreWord(state, word);
    burstWord(state, word);
  }
  addShake(state, FX.bombShake);
  state.words = [];
  state.target = null;
  return destroyed.length;
}

// A green word during wind restarts the timer and turns the wind around.
function startWind(state: GameState): void {
  if (state.windTimer > 0) state.windDirection = -state.windDirection;
  else state.windDirection = Math.random() < 0.5 ? -1 : 1;

  state.windTimer = WIND.duration;
}
