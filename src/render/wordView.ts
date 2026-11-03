import { COLORS, FX, WORD_EFFECTS, WORD_STYLE } from "../config";
import type { Word } from "../entities/word";
import { clearGlow, setGlow } from "./glow";

const TAG_FONT = "18px Consolas, 'Courier New', monospace";
const TAG_OFFSET_Y = 28;
const BOSS_TAG_OFFSET_Y = 36;
const BOSS_FRAME = { paddingX: 10, top: 28, bottom: 9 };

export function drawWord(ctx: CanvasRenderingContext2D, word: Word, isTarget: boolean): void {
  const isBoss = word.color === "boss";

  ctx.font = isBoss ? WORD_STYLE.bossFont : WORD_STYLE.font;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  const color = WORD_EFFECTS[word.color].display;
  const typed = word.text.slice(0, word.typed);
  const rest = word.text.slice(word.typed);
  const width = ctx.measureText(word.text).width;
  const startX = word.x - width / 2;

  setGlow(ctx, color, isTarget ? FX.targetGlow : FX.wordGlow);
  ctx.fillStyle = COLORS.typed;
  ctx.fillText(typed, startX, word.y);
  ctx.fillStyle = color;
  ctx.fillText(rest, startX + ctx.measureText(typed).width, word.y);

  if (isBoss) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(
      startX - BOSS_FRAME.paddingX,
      word.y - BOSS_FRAME.top,
      width + BOSS_FRAME.paddingX * 2,
      BOSS_FRAME.top + BOSS_FRAME.bottom,
    );
  }

  // Golden words say which power they hold, so choosing one is a real decision.
  const tag = isBoss ? "BOSS" : word.power?.toUpperCase();
  if (tag) {
    ctx.font = TAG_FONT;
    ctx.textAlign = "center";
    ctx.fillText(tag, word.x, word.y - (isBoss ? BOSS_TAG_OFFSET_Y : TAG_OFFSET_Y));
  }
  clearGlow(ctx);
}
