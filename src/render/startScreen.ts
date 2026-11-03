import { COLORS, FX, START_SCREEN, WORD_STYLE, WORLD } from "../config";
import type { GameState } from "../game/state";
import { drawEdges } from "./flipView";
import { clearGlow, setGlow } from "./glow";
import { drawParticles } from "./particlesView";
import { drawWord } from "./wordView";

const FONT_FAMILY = "Consolas, 'Courier New', monospace";
const TITLE_Y = 186;
const TITLE_LETTERS = [
  { letter: "G", sag: 0, tilt: 0 },
  { letter: "R", sag: 0, tilt: 0 },
  { letter: "A", sag: 5, tilt: 0 },
  { letter: "V", sag: 14, tilt: 3 },
  { letter: "I", sag: 32, tilt: -5 },
  { letter: "T", sag: 66, tilt: 9 },
  { letter: "Y", sag: 128, tilt: -16 },
];
const TITLE_DROP = { height: 300, duration: 0.8, stagger: 0.09 };
const SUBTITLE = { text: "TYPIST", x: 270, y: 293, spacing: 14, cursorGap: 8, typeStart: 0.9, lettersPerSecond: 12 };
const PROMPT_FADE_START = 1.4;
const PROMPT_FADE_TIME = 0.5;
// Words further back are fainter.
const FIELD_ALPHAS = [0.5, 0.8, 0.45, 0.75, 0.55, 0.85, 0.6];

export function drawStart(ctx: CanvasRenderingContext2D, state: GameState): void {
  state.attractWords.forEach((word, index) => {
    ctx.globalAlpha = FIELD_ALPHAS[index % FIELD_ALPHAS.length];
    drawWord(ctx, word, false);
  });
  ctx.globalAlpha = 1;

  drawParticles(ctx, state.particles);
  drawEdges(ctx, state);
  drawTitle(ctx, state.attractTime);
  drawSubtitle(ctx, state.attractTime);
  drawPrompt(ctx, state);
  drawFooter(ctx, state.highScore);
}

// The letters drop in one after another, land out of line, then keep sagging gently.
function drawTitle(ctx: CanvasRenderingContext2D, time: number): void {
  ctx.font = `bold 148px ${FONT_FAMILY}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = COLORS.accent;
  setGlow(ctx, COLORS.accent, FX.titleGlow);

  const letterWidth = ctx.measureText("G").width + 6;
  const startX = WORLD.width / 2 - (letterWidth * (TITLE_LETTERS.length - 1)) / 2;

  TITLE_LETTERS.forEach(({ letter, sag, tilt }, index) => {
    const landed = bounceOut((time - index * TITLE_DROP.stagger) / TITLE_DROP.duration);
    const sway = Math.sin(time * 1.2 + index) * (1 + sag * 0.03);
    const y = TITLE_Y + sag + sway - TITLE_DROP.height * (1 - landed);

    ctx.save();
    ctx.translate(startX + index * letterWidth, y);
    ctx.rotate((tilt * landed * Math.PI) / 180);
    ctx.fillText(letter, 0, 0);
    ctx.restore();
  });
  clearGlow(ctx);
}

function drawSubtitle(ctx: CanvasRenderingContext2D, time: number): void {
  const { text, x, y, spacing, cursorGap, typeStart, lettersPerSecond } = SUBTITLE;
  const shown = Math.floor((time - typeStart) * lettersPerSecond);
  const visible = text.slice(0, Math.max(shown, 0));

  ctx.font = `54px ${FONT_FAMILY}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = COLORS.typed;

  let cursorX = x;
  for (const letter of visible) {
    ctx.fillText(letter, cursorX, y);
    cursorX += ctx.measureText(letter).width + spacing;
  }

  const isTyping = visible.length < text.length;
  if (isTyping || Math.floor(time * 2) % 2 === 0) {
    setGlow(ctx, COLORS.accent, FX.wordGlow);
    ctx.fillStyle = COLORS.accent;
    ctx.fillRect(cursorX + cursorGap, y - 25, 26, 50);
    clearGlow(ctx);
  }
}

function drawPrompt(ctx: CanvasRenderingContext2D, state: GameState): void {
  const { word, wordY } = START_SCREEN;
  const centerX = WORLD.width / 2;
  // Only a wrong key moves the word, so the shake reads as a nudge.
  const nudge = (Math.random() * 2 - 1) * state.shake * 3;
  const typed = word.slice(0, state.startTyped);
  const rest = word.slice(state.startTyped);

  ctx.save();
  ctx.globalAlpha = Math.min(Math.max((state.attractTime - PROMPT_FADE_START) / PROMPT_FADE_TIME, 0), 1);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `16px ${FONT_FAMILY}`;
  ctx.fillStyle = COLORS.muted;
  ctx.fillText("T Y P E   T H I S   W O R D   T O   P L A Y", centerX, wordY - 54);
  ctx.fillText("or press Enter", centerX, wordY + 54);

  ctx.font = `76px ${FONT_FAMILY}`;
  ctx.textAlign = "left";
  const startX = centerX - ctx.measureText(word).width / 2 + nudge;
  setGlow(ctx, COLORS.combo, FX.titleGlow);
  ctx.fillStyle = COLORS.typed;
  ctx.fillText(typed, startX, wordY);
  ctx.fillStyle = COLORS.combo;
  ctx.fillText(rest, startX + ctx.measureText(typed).width, wordY);
  clearGlow(ctx);

  ctx.restore();
}

function drawFooter(ctx: CanvasRenderingContext2D, highScore: number): void {
  const y = (WORLD.groundY + WORLD.height) / 2;

  ctx.font = `20px ${FONT_FAMILY}`;
  ctx.textBaseline = "middle";

  ctx.textAlign = "left";
  ctx.fillStyle = COLORS.combo;
  ctx.fillText(`HIGH SCORE ${highScore.toLocaleString("en-US")}`, WORD_STYLE.sideMargin, y);

  ctx.textAlign = "right";
  ctx.fillStyle = COLORS.muted;
  ctx.fillText("Esc pause    Backspace release word", WORLD.width - WORD_STYLE.sideMargin, y);
}

// Falls, then settles with two small bounces.
function bounceOut(progress: number): number {
  const t = Math.min(Math.max(progress, 0), 1);
  if (t < 1 / 2.75) return 7.5625 * t * t;
  if (t < 2 / 2.75) return 7.5625 * (t - 1.5 / 2.75) ** 2 + 0.75;
  if (t < 2.5 / 2.75) return 7.5625 * (t - 2.25 / 2.75) ** 2 + 0.9375;
  return 7.5625 * (t - 2.625 / 2.75) ** 2 + 0.984375;
}
