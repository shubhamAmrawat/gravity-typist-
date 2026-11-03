import { FX, RULES } from "../config";
import { ParticlePool } from "../entities/particle";
import type { Word } from "../entities/word";
import { createAttractWords } from "../systems/attract";

export type Phase = "start" | "playing" | "paused" | "over";

export interface RunStats {
  correctLetters: number;
  keystrokes: number;
  activeTime: number; // s spent playing, excluding pauses
  streak: number; // clean words since the last typo
  bestStreak: number;
  wordsCleared: number;
}

export interface GameState {
  phase: Phase;
  attractWords: Word[]; // decorative words falling behind the start screen
  attractTime: number; // s since the start screen appeared
  startTyped: number; // letters of the start word typed so far
  words: Word[];
  target: Word | null;
  score: number;
  lives: number;
  level: number;
  levelClears: number; // words cleared on the current level
  levelBanner: number; // s of "LEVEL N" announcement remaining
  gravityMultiplier: number;
  windTimer: number; // s of wind remaining
  windDirection: number; // -1 is left, 1 is right
  flipTimer: number; // s of flipped gravity remaining
  freezeTimer: number; // s of frozen words remaining
  hasShield: boolean;
  particles: ParticlePool;
  shake: number; // px of screen shake right now
  damageFlash: number; // s of red flash remaining
  stats: RunStats;
  highScore: number;
  isNewHighScore: boolean;
}

export function createState(phase: Phase, highScore: number, level = 1): GameState {
  return {
    phase,
    attractWords: phase === "start" ? createAttractWords() : [],
    attractTime: 0,
    startTyped: 0,
    words: [],
    target: null,
    score: 0,
    lives: RULES.startLives,
    level,
    levelClears: 0,
    levelBanner: FX.levelBannerTime,
    gravityMultiplier: 1,
    windTimer: 0,
    windDirection: 1,
    flipTimer: 0,
    freezeTimer: 0,
    hasShield: false,
    particles: new ParticlePool(FX.particleCap),
    shake: 0,
    damageFlash: 0,
    stats: {
      correctLetters: 0,
      keystrokes: 0,
      activeTime: 0,
      streak: 0,
      bestStreak: 0,
      wordsCleared: 0,
    },
    highScore,
    isNewHighScore: false,
  };
}
