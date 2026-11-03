import { RULES, WORD_EFFECTS } from "../config";
import type { Word } from "../entities/word";
import type { GameState, RunStats } from "../game/state";

export function comboMultiplier(stats: RunStats): number {
  return stats.streak >= RULES.comboStreak ? RULES.comboMultiplier : 1;
}

export function recordHit(stats: RunStats): void {
  stats.keystrokes++;
  stats.correctLetters++;
}

export function recordTypo(stats: RunStats): void {
  stats.keystrokes++;
  stats.streak = 0;
}

// The multiplier applies from the word after the streak is reached.
export function recordClear(state: GameState, word: Word): void {
  const { stats } = state;
  scoreWord(state, word);

  if (word.hadTypo) return;
  stats.streak++;
  stats.bestStreak = Math.max(stats.bestStreak, stats.streak);
}

// Points only, with no effect on the combo: also used for words a bomb destroys.
export function scoreWord(state: GameState, word: Word): void {
  state.score +=
    word.text.length *
    RULES.pointsPerLetter *
    WORD_EFFECTS[word.color].pointsMultiplier *
    comboMultiplier(state.stats);
  state.stats.wordsCleared++;
}

export function wordsPerMinute(stats: RunStats): number {
  const minutes = Math.max(stats.activeTime, RULES.minWpmSeconds) / 60;
  return Math.round(stats.correctLetters / 5 / minutes);
}

export function accuracyPercent(stats: RunStats): number {
  if (stats.keystrokes === 0) return 100;
  return Math.round((stats.correctLetters / stats.keystrokes) * 100);
}
