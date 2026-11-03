import { COLORS, FREEZE, WORLD } from "../config";
import type { GameState } from "../game/state";
import { drawCountdown } from "./countdown";

const LABEL_Y = 136;
const TINT_ALPHA = 0.1;

// Drawn behind the words: an icy tint over the field and a labelled countdown.
export function drawFreeze(ctx: CanvasRenderingContext2D, state: GameState): void {
  if (state.freezeTimer <= 0) return;

  ctx.globalAlpha = TINT_ALPHA;
  ctx.fillStyle = COLORS.freeze;
  ctx.fillRect(0, 0, WORLD.width, WORLD.height);
  ctx.globalAlpha = 1;

  drawCountdown(ctx, "FROZEN", COLORS.freeze, LABEL_Y, state.freezeTimer / FREEZE.duration);
}
