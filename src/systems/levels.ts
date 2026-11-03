import { FX, LEVELS } from "../config";
import type { GameState } from "../game/state";

export interface LevelSettings {
  clearsNeeded: number;
  spawnInterval: number; // s between words
  minLength: number;
  maxLength: number;
}

export function levelSettings(level: number): LevelSettings {
  const steps = Math.min(level, LEVELS.maxDifficultyLevel) - 1;
  const progress = steps / (LEVELS.maxDifficultyLevel - 1);
  const blend = ({ first, last }: { first: number; last: number }) =>
    first + (last - first) * progress;

  return {
    clearsNeeded: LEVELS.baseClears + steps * LEVELS.extraClearsPerLevel,
    spawnInterval: blend(LEVELS.spawnInterval),
    minLength: Math.round(blend(LEVELS.minLength)),
    maxLength: Math.round(blend(LEVELS.maxLength)),
  };
}

// Counts one cleared word and returns true if it finished the level.
export function advanceLevel(state: GameState): boolean {
  state.levelClears++;
  if (state.levelClears < levelSettings(state.level).clearsNeeded) return false;

  state.level++;
  state.levelClears = 0;
  state.levelBanner = FX.levelBannerTime;
  return true;
}
