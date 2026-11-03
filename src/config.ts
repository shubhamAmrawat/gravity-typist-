export const WORLD = {
  width: 1280,
  height: 720,
  groundY: 680,
  ceilingY: 24, // baseline at which a word's top touches the screen edge
};

export const PHYSICS = {
  baseGravity: 25, // px/s^2
  terminalVelocity: 180, // px/s
  turnAcceleration: 180, // px/s^2 of extra pull while moving against gravity, so flips read clearly
  maxDelta: 0.05, // s; longest step a single frame may simulate
};

export const WORD_STYLE = {
  fontSize: 30,
  font: "30px Consolas, 'Courier New', monospace",
  bossFont: "32px Consolas, 'Courier New', monospace",
  charWidth: 18, // estimate used to keep words on screen when spawning
  sideMargin: 24,
  spawnY: -8, // baseline just above the top edge
};

export const GRAVITY = {
  minMultiplier: 0.4,
  maxMultiplier: 2.5,
  driftTime: 12, // s for the multiplier to close about 63% of the gap back to 1x
};

export const WORD_EFFECTS = {
  blue: { display: "#5aa9ff", gravityFactor: 0.8, pointsMultiplier: 1 },
  red: { display: "#ff4d6d", gravityFactor: 1.3, pointsMultiplier: 2 },
  green: { display: "#3dffa2", gravityFactor: 1, pointsMultiplier: 1 },
  purple: { display: "#c77dff", gravityFactor: 1, pointsMultiplier: 1 },
  golden: { display: "#ffd700", gravityFactor: 1, pointsMultiplier: 1 },
  boss: { display: "#ff9f1c", gravityFactor: 1, pointsMultiplier: 3 },
};

export const BOSS = {
  unlockLevel: 7,
  chance: 0.06, // of spawns, with only one boss on screen at a time
  minLength: 12,
  maxLength: 16,
  childMinLength: 3,
  childMaxLength: 5,
  childGap: 12, // px between each child and the spot where the boss was
  edgeMargin: 60, // px children start from the lethal edge, however close the boss got
  popUpSpeed: 120, // px/s away from the lethal edge
  popSideSpeed: 120, // px/s outwards
};

export const POWERS = ["freeze", "bomb", "shield"] as const;

export type Power = (typeof POWERS)[number];

export const FREEZE = {
  duration: 3, // s
};

export const FLIP = {
  unlockLevel: 7,
  duration: 5, // s
  spawnPause: 2, // s before the flip ends with no new words, so bottom spawns aren't caught out
  warningTime: 1, // s before the flip ends that the ground lights back up
};

export const WIND = {
  unlockLevel: 4,
  duration: 5, // s
  acceleration: 60, // px/s^2
  maxSpeed: 90, // px/s
  dragTime: 0.5, // s for sideways speed to fade by about 63% once the wind stops
};

export type WordColor = keyof typeof WORD_EFFECTS;

export const SPAWN = {
  goldenChance: 0.04,
  purpleChance: 0.07, // once unlocked, of the words that aren't golden
  greenChance: 0.14, // once unlocked, of the words that aren't golden or purple
  redChance: 0.4, // of the remaining words; the rest are blue
  placementTries: 12, // attempts to find an x clear of words near the top
  clearHeight: 70, // px below the spawn line where words count as in the way
  clearGap: 16, // px kept between a new word and those words
};

// Each setting moves evenly from level 1 to maxDifficultyLevel, then holds.
export const LEVELS = {
  maxDifficultyLevel: 12,
  baseClears: 10,
  extraClearsPerLevel: 1,
  spawnInterval: { first: 2.6, last: 1.2 }, // s between words
  minLength: { first: 3, last: 6 },
  maxLength: { first: 5, last: 11 },
};

export const START_SCREEN = {
  word: "start", // typing this begins a run
  wordY: 470,
  fieldWords: 7, // words falling behind the title
  fieldGravity: 12, // px/s^2
  fieldMinLength: 4,
  fieldMaxLength: 9,
  gutterWidth: 260, // px at each side where those words fall, clear of the title
  fieldLevel: 12, // the level whose color mix those words use
};

export const RULES = {
  startLives: 3,
  pointsPerLetter: 10,
  comboStreak: 5, // clean words needed to earn the multiplier
  comboMultiplier: 2,
  minWpmSeconds: 5, // stops WPM spiking in the first moments of a run
};

export const FX = {
  particleCap: 400,
  particlesPerLetter: 8,
  particleGravity: 420, // px/s^2
  particleSpeed: 260, // px/s
  particleLife: 0.7, // s
  particleSize: 4,
  shakeDecayTime: 0.12, // s for shake to fade by about 63%
  maxShake: 26, // px
  typoShake: 2,
  startShake: 8,
  clearShake: 4,
  missShake: 14,
  bombShake: 18,
  bossShake: 10,
  gameOverShake: 22,
  damageFlashTime: 0.3, // s
  damageFlashAlpha: 0.25,
  wordGlow: 12,
  targetGlow: 26,
  titleGlow: 22,
  groundGlow: 16,
  levelBannerTime: 1.6, // s
};

export const AUDIO = {
  masterVolume: 0.3,
};

export const COLORS = {
  letterbox: "#05060d",
  background: "#0b0d1a",
  backgroundTop: "#141033",
  grid: "rgba(45, 226, 230, 0.05)",
  damage: "#ff2a4d",
  freeze: "#9be7ff",
  ground: "#2de2e6",
  accent: "#2de2e6",
  typed: "#ffffff",
  hud: "#e8ecff",
  lives: "#ff4d6d",
  combo: "#ffd166",
  muted: "#8a90b0",
  meterTrack: "#22263f",
  overlay: "rgba(5, 6, 13, 0.88)",
};
