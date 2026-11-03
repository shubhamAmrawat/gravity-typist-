import { COLORS, FLIP, FX, WORD_EFFECTS, WORLD } from "../config";
import type { GameState } from "../game/state";
import { drawCountdown } from "./countdown";
import { clearGlow, setGlow } from "./glow";

const LABEL_Y = 90;
const TINT_ALPHA = 0.07;
const SAFE_EDGE_ALPHA = 0.2;
const CEILING_HEIGHT = 4;

// The lethal edge glows at full strength, and the safe one is dimmed.
export function drawEdges(ctx: CanvasRenderingContext2D, state: GameState): void {
  const isFlipped = state.flipTimer > 0;
  // A held shield turns the lethal edge gold, because the next hit there is blocked.
  const shieldColor = state.hasShield ? WORD_EFFECTS.golden.display : undefined;
  const groundColor = (!isFlipped && shieldColor) || COLORS.ground;

  ctx.globalAlpha = isFlipped ? groundAlphaDuringFlip(state.flipTimer) : 1;
  setGlow(ctx, groundColor, FX.groundGlow);
  ctx.fillStyle = groundColor;
  ctx.fillRect(0, WORLD.groundY, WORLD.width, 2);
  ctx.globalAlpha = 1;

  if (isFlipped) {
    const ceilingColor = shieldColor ?? COLORS.damage;
    setGlow(ctx, ceilingColor, FX.titleGlow);
    ctx.fillStyle = ceilingColor;
    ctx.fillRect(0, 0, WORLD.width, CEILING_HEIGHT);
  }
  clearGlow(ctx);
}

// Drawn behind the words: a tint over the field and a labelled countdown.
export function drawFlip(ctx: CanvasRenderingContext2D, state: GameState): void {
  if (state.flipTimer <= 0) return;

  const color = WORD_EFFECTS.purple.display;
  ctx.globalAlpha = TINT_ALPHA;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, WORLD.width, WORLD.height);
  ctx.globalAlpha = 1;

  drawCountdown(ctx, "▲ GRAVITY FLIPPED ▲", color, LABEL_Y, state.flipTimer / FLIP.duration);
}

// The ground lights back up just before it becomes lethal again.
function groundAlphaDuringFlip(flipTimer: number): number {
  if (flipTimer > FLIP.warningTime) return SAFE_EDGE_ALPHA;
  return 1 - (flipTimer / FLIP.warningTime) * (1 - SAFE_EDGE_ALPHA);
}
