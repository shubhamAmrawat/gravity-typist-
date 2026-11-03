import { COLORS, FX, GRAVITY, RULES, WORD_EFFECTS, WORLD } from "../config";
import type { GameState } from "../game/state";
import { levelSettings } from "../systems/levels";
import { accuracyPercent, comboMultiplier, wordsPerMinute } from "../systems/scoring";
import { clearGlow, setGlow } from "./glow";

const FONT = "22px Consolas, 'Courier New', monospace";
const MARGIN = 24;
const BANNER_FONT = "72px Consolas, 'Courier New', monospace";
const BANNER_FADE = 0.6; // s
const BANNER_ALPHA = 0.7;
const METER = { labelX: 835, barX: 975, barWidth: 130, barHeight: 12 };

// The HUD sits in the band below the ground line, clear of falling words.
export function drawHud(ctx: CanvasRenderingContext2D, state: GameState): void {
  const { stats } = state;
  const y = (WORLD.groundY + WORLD.height) / 2;

  ctx.font = FONT;
  ctx.textBaseline = "middle";

  ctx.textAlign = "left";
  ctx.fillStyle = COLORS.hud;
  ctx.fillText(`SCORE ${state.score}`, MARGIN, y);

  ctx.textAlign = "center";
  ctx.fillText(`LEVEL ${state.level}`, WORLD.width * 0.19, y);
  ctx.fillText(`WPM ${wordsPerMinute(stats)}`, WORLD.width * 0.29, y);
  ctx.fillText(`ACC ${accuracyPercent(stats)}%`, WORLD.width * 0.4, y);

  const multiplier = comboMultiplier(stats);
  ctx.fillStyle = multiplier > 1 ? COLORS.combo : COLORS.hud;
  ctx.fillText(
    multiplier > 1
      ? `COMBO ${stats.streak} x${multiplier}`
      : `COMBO ${stats.streak}/${RULES.comboStreak}`,
    WORLD.width * 0.55,
    y,
  );

  drawGravityMeter(ctx, state.gravityMultiplier, y);

  ctx.textAlign = "right";
  ctx.fillStyle = COLORS.lives;
  const livesText = `LIVES ${"♥".repeat(state.lives)}`;
  ctx.fillText(livesText, WORLD.width - MARGIN, y);
  if (state.hasShield) {
    ctx.fillStyle = WORD_EFFECTS.golden.display;
    ctx.fillText("◆", WORLD.width - MARGIN - ctx.measureText(`${livesText} `).width, y);
  }

  // A thin bar along the bottom edge shows progress through the level.
  const progress = state.levelClears / levelSettings(state.level).clearsNeeded;
  ctx.fillStyle = COLORS.accent;
  ctx.fillRect(0, WORLD.height - 3, WORLD.width * progress, 3);
}

// Drawn behind the words so it never hides what you need to read.
export function drawLevelBanner(ctx: CanvasRenderingContext2D, state: GameState): void {
  if (state.levelBanner <= 0) return;

  ctx.font = BANNER_FONT;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.globalAlpha = Math.min(state.levelBanner / BANNER_FADE, 1) * BANNER_ALPHA;
  ctx.fillStyle = COLORS.accent;
  setGlow(ctx, COLORS.accent, FX.titleGlow);
  ctx.fillText(`LEVEL ${state.level}`, WORLD.width / 2, WORLD.height * 0.4);
  clearGlow(ctx);
  ctx.globalAlpha = 1;
}

function drawGravityMeter(ctx: CanvasRenderingContext2D, multiplier: number, y: number): void {
  const { labelX, barX, barWidth, barHeight } = METER;
  const top = y - barHeight / 2;
  const oneX = barX + meterPosition(1) * barWidth;
  const current = barX + meterPosition(multiplier) * barWidth;

  ctx.textAlign = "left";
  ctx.fillStyle = COLORS.hud;
  ctx.fillText(`GRAV ${multiplier.toFixed(2)}x`, labelX, y);

  ctx.fillStyle = COLORS.meterTrack;
  ctx.fillRect(barX, top, barWidth, barHeight);

  ctx.fillStyle = multiplier > 1 ? WORD_EFFECTS.red.display : WORD_EFFECTS.blue.display;
  ctx.fillRect(Math.min(oneX, current), top, Math.abs(current - oneX), barHeight);

  ctx.fillStyle = COLORS.hud;
  ctx.fillRect(oneX - 1, top - 3, 2, barHeight + 6);
}

// Log scale, so a blue and a red effect move the bar by amounts that match their factors.
function meterPosition(multiplier: number): number {
  const { minMultiplier, maxMultiplier } = GRAVITY;
  return Math.log(multiplier / minMultiplier) / Math.log(maxMultiplier / minMultiplier);
}
