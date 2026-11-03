import { COLORS, FX, WORLD } from "../config";
import type { GameState } from "../game/state";
import { accuracyPercent, wordsPerMinute } from "../systems/scoring";
import { clearGlow, setGlow } from "./glow";

const FONT_FAMILY = "Consolas, 'Courier New', monospace";
const CENTER_X = WORLD.width / 2;
const CENTER_Y = WORLD.height / 2;

export function drawPaused(ctx: CanvasRenderingContext2D): void {
  prepare(ctx);
  drawOverlay(ctx);
  title(ctx, "PAUSED", -30, 64, COLORS.accent);
  line(ctx, "Press Esc to resume", 40, 24, COLORS.hud);
}

export function drawGameOver(ctx: CanvasRenderingContext2D, state: GameState): void {
  const { stats } = state;

  prepare(ctx);
  drawOverlay(ctx);
  title(ctx, "GAME OVER", -170, 64, COLORS.lives);
  line(ctx, `Score ${state.score}`, -100, 36, COLORS.hud);
  line(
    ctx,
    state.isNewHighScore ? "NEW HIGH SCORE!" : `High score ${state.highScore}`,
    -55,
    26,
    COLORS.combo,
  );
  line(ctx, `Level  ${state.level}`, -5, 24, COLORS.hud);
  line(ctx, `Words cleared  ${stats.wordsCleared}`, 28, 24, COLORS.hud);
  line(ctx, `WPM  ${wordsPerMinute(stats)}`, 61, 24, COLORS.hud);
  line(ctx, `Accuracy  ${accuracyPercent(stats)}%`, 94, 24, COLORS.hud);
  line(ctx, `Best combo  ${stats.bestStreak}`, 127, 24, COLORS.hud);
  line(ctx, "Press Enter to play again", 180, 24, COLORS.accent);
}

function prepare(ctx: CanvasRenderingContext2D): void {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
}

function drawOverlay(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = COLORS.overlay;
  ctx.fillRect(0, 0, WORLD.width, WORLD.height);
}

function title(
  ctx: CanvasRenderingContext2D,
  text: string,
  offsetY: number,
  size: number,
  color: string,
): void {
  setGlow(ctx, color, FX.titleGlow);
  line(ctx, text, offsetY, size, color);
  clearGlow(ctx);
}

function line(
  ctx: CanvasRenderingContext2D,
  text: string,
  offsetY: number,
  size: number,
  color: string,
): void {
  ctx.font = `${size}px ${FONT_FAMILY}`;
  ctx.fillStyle = color;
  ctx.fillText(text, CENTER_X, CENTER_Y + offsetY);
}
