import {
  BOSS,
  FLIP,
  POWERS,
  SPAWN,
  WIND,
  WORD_STYLE,
  WORLD,
  type Power,
  type WordColor,
} from "../config";
import { textHalfWidth, Word } from "../entities/word";
import type { GameState } from "../game/state";
import { levelSettings } from "./levels";
import { randomWord } from "./wordBank";

export class Spawner {
  private timer = 0;
  private lastText: string | undefined;

  constructor(private readonly forceColor?: WordColor) {}

  update(dt: number, state: GameState): void {
    this.timer -= dt;
    if (state.flipTimer > 0 && state.flipTimer <= FLIP.spawnPause) return;
    // An empty screen spawns right away so fast typists never wait.
    if (this.timer > 0 && state.words.length > 0) return;

    this.timer = levelSettings(state.level).spawnInterval;
    state.words.push(this.createWord(state));
  }

  private createWord(state: GameState): Word {
    const color = this.forceColor ?? (shouldSpawnBoss(state) ? "boss" : chooseColor(state.level));
    const { minLength, maxLength } = color === "boss" ? BOSS : levelSettings(state.level);
    const usedLetters = new Set(state.words.map((word) => word.text[0]));
    const text = randomWord(minLength, maxLength, usedLetters, this.lastText);
    this.lastText = text;

    // During a flip words rise from the ground instead.
    const y = state.flipTimer > 0 ? WORLD.groundY : WORD_STYLE.spawnY;

    return new Word(text, chooseX(text, state.words, y), y, color, powerFor(color));
  }
}

function shouldSpawnBoss(state: GameState): boolean {
  return (
    state.level >= BOSS.unlockLevel &&
    !state.words.some((word) => word.color === "boss") &&
    Math.random() < BOSS.chance
  );
}

export function powerFor(color: WordColor): Power | undefined {
  if (color !== "golden") return undefined;
  return POWERS[Math.floor(Math.random() * POWERS.length)];
}

export function chooseColor(level: number): WordColor {
  if (Math.random() < SPAWN.goldenChance) return "golden";
  if (level >= FLIP.unlockLevel && Math.random() < SPAWN.purpleChance) return "purple";
  if (level >= WIND.unlockLevel && Math.random() < SPAWN.greenChance) return "green";
  return Math.random() < SPAWN.redChance ? "red" : "blue";
}

// Fast spawning leaves words close together vertically, so avoid landing on top of one.
function chooseX(text: string, onScreen: Word[], y: number): number {
  const halfWidth = textHalfWidth(text);
  const minX = WORD_STYLE.sideMargin + halfWidth;
  const maxX = WORLD.width - WORD_STYLE.sideMargin - halfWidth;
  const nearSpawn = onScreen.filter((word) => Math.abs(word.y - y) < SPAWN.clearHeight);

  let x = minX;
  for (let attempt = 0; attempt < SPAWN.placementTries; attempt++) {
    x = minX + Math.random() * (maxX - minX);
    const isClear = nearSpawn.every(
      (word) => Math.abs(word.x - x) >= halfWidth + textHalfWidth(word.text) + SPAWN.clearGap,
    );
    if (isClear) break;
  }
  return x;
}
