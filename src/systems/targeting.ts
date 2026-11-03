import type { Word } from "../entities/word";
import type { GameState } from "../game/state";

export type LetterResult =
  | { kind: "typo" }
  | { kind: "hit" }
  | { kind: "complete"; word: Word };

export function applyLetter(state: GameState, letter: string): LetterResult {
  if (!state.target) {
    state.target = closestMatch(state.words, letter, state.flipTimer > 0);
    if (!state.target) return { kind: "typo" };
  } else if (state.target.nextLetter !== letter) {
    state.target.hadTypo = true;
    return { kind: "typo" };
  }

  const word = state.target;
  word.typed++;
  if (!word.isComplete) return { kind: "hit" };

  state.words = state.words.filter((other) => other !== word);
  state.target = null;
  return { kind: "complete", word };
}

export function releaseTarget(state: GameState): void {
  if (!state.target) return;

  state.target.typed = 0;
  state.target.hadTypo = false;
  state.target = null;
}

// The match nearest the edge that is lethal right now.
function closestMatch(words: Word[], letter: string, isFlipped: boolean): Word | null {
  let closest: Word | null = null;
  for (const word of words) {
    if (word.nextLetter !== letter) continue;
    if (!closest || (isFlipped ? word.y < closest.y : word.y > closest.y)) closest = word;
  }
  return closest;
}
