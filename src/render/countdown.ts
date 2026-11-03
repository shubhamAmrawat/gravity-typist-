import { COLORS, WORLD } from "../config";

const LABEL_FONT = "22px Consolas, 'Courier New', monospace";
const BAR = { width: 160, height: 4, offsetY: 18 };

// A centered label with a shrinking bar, used for timed effects.
export function drawCountdown(
  ctx: CanvasRenderingContext2D,
  label: string,
  color: string,
  y: number,
  fraction: number,
): void {
  const left = WORLD.width / 2 - BAR.width / 2;
  const top = y + BAR.offsetY;

  ctx.font = LABEL_FONT;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.fillText(label, WORLD.width / 2, y);

  ctx.fillStyle = COLORS.meterTrack;
  ctx.fillRect(left, top, BAR.width, BAR.height);
  ctx.fillStyle = color;
  ctx.fillRect(left, top, BAR.width * fraction, BAR.height);
}
