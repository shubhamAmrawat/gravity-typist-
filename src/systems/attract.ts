import { START_SCREEN, WORD_STYLE, WORLD } from "../config";
import { textHalfWidth, Word } from "../entities/word";
import type { GameState } from "../game/state";
import { burstWord } from "./fx";
import { hasHitLethalEdge, moveWord } from "./physics";
import { chooseColor, powerFor } from "./spawner";
import { randomWord } from "./wordBank";

// Each side's words are spaced evenly in time along one fall path, already at the speed
// they'd have reached there. Sharing a path means none can catch up and overlap another.
export function createAttractWords(): Word[] {
  const { fieldWords, fieldGravity } = START_SCREEN;
  const fallDistance = WORLD.groundY - WORD_STYLE.spawnY;
  const fallTime = Math.sqrt((2 * fallDistance) / fieldGravity);

  return Array.from({ length: fieldWords }, (_, index) => {
    const sideCount = index % 2 === 0 ? Math.ceil(fieldWords / 2) : Math.floor(fieldWords / 2);
    const elapsed = (fallTime * Math.floor(index / 2)) / sideCount;

    const word = createAttractWord(index);
    word.y = WORD_STYLE.spawnY + 0.5 * fieldGravity * elapsed * elapsed;
    word.vy = fieldGravity * elapsed;
    return word;
  });
}

export function updateAttract(state: GameState, dt: number): void {
  state.attractTime += dt;

  state.attractWords = state.attractWords.map((word, index) => {
    moveWord(word, START_SCREEN.fieldGravity, 0, dt);
    if (!hasHitLethalEdge(word, false)) return word;

    burstWord(state, word);
    return createAttractWord(index);
  });
}

// Even and odd slots use opposite sides, so both stay populated.
function createAttractWord(index: number): Word {
  const text = randomWord(START_SCREEN.fieldMinLength, START_SCREEN.fieldMaxLength, new Set());
  const color = chooseColor(START_SCREEN.fieldLevel);
  const halfWidth = textHalfWidth(text);
  const minX = WORD_STYLE.sideMargin + halfWidth;
  const maxX = START_SCREEN.gutterWidth - halfWidth;
  const x = minX + Math.random() * (maxX - minX);

  return new Word(
    text,
    index % 2 === 0 ? x : WORLD.width - x,
    WORD_STYLE.spawnY,
    color,
    powerFor(color),
  );
}
