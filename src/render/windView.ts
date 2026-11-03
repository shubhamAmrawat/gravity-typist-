import { WIND, WORD_EFFECTS, WORLD } from "../config";
import type { GameState } from "../game/state";
import { drawCountdown } from "./countdown";

const STREAK_ROWS = 7;
const STREAKS_PER_ROW = 4;
const STREAK_LENGTH = 90;
const STREAK_SPEED = 520; // px/s
const LABEL_Y = 44;

// Drawn behind the words: moving streaks across the field and a labelled countdown.
export function drawWind(ctx: CanvasRenderingContext2D, state: GameState): void {
  if (state.windTimer <= 0) return;

  const color = WORD_EFFECTS.green.display;
  drawStreaks(ctx, state, color);
  drawCountdown(
    ctx,
    state.windDirection > 0 ? "WIND >>>" : "<<< WIND",
    color,
    LABEL_Y,
    state.windTimer / WIND.duration,
  );
}

function drawStreaks(ctx: CanvasRenderingContext2D, state: GameState, color: string): void {
  const span = WORLD.width + STREAK_LENGTH;
  const travel = state.stats.activeTime * STREAK_SPEED * state.windDirection;
  const rowHeight = WORLD.groundY / STREAK_ROWS;

  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = color;
  for (let row = 0; row < STREAK_ROWS; row++) {
    const y = (row + 0.5) * rowHeight;
    for (let i = 0; i < STREAKS_PER_ROW; i++) {
      // Each row is offset differently so the streaks don't line up in columns.
      const start = (i * span) / STREAKS_PER_ROW + row * 137 + travel;
      const x = ((start % span) + span) % span;
      ctx.fillRect(x - STREAK_LENGTH, y, STREAK_LENGTH, 2);
    }
  }
  ctx.restore();
}
