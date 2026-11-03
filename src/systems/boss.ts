import { BOSS, WORLD } from "../config";
import { textHalfWidth, Word } from "../entities/word";
import type { GameState } from "../game/state";
import { chooseColor, powerFor } from "./spawner";
import { randomWord } from "./wordBank";

// A finished boss breaks into two short words that pop away from the lethal edge,
// so finishing one close to that edge never costs a life straight away.
export function splitBoss(state: GameState, boss: Word): void {
  const usedLetters = new Set(state.words.map((word) => word.text[0]));
  const awayFromEdge = state.flipTimer > 0 ? 1 : -1;
  const y = Math.min(
    Math.max(boss.y, WORLD.ceilingY + BOSS.edgeMargin),
    WORLD.groundY - BOSS.edgeMargin,
  );

  for (const side of [-1, 1]) {
    const text = randomWord(BOSS.childMinLength, BOSS.childMaxLength, usedLetters);
    usedLetters.add(text[0]);

    const color = chooseColor(state.level);
    const x = boss.x + side * (textHalfWidth(text) + BOSS.childGap);
    const child = new Word(text, x, y, color, powerFor(color));
    child.vx = side * BOSS.popSideSpeed;
    child.vy = awayFromEdge * BOSS.popUpSpeed;
    child.hasEntered = true;
    state.words.push(child);
  }
}
