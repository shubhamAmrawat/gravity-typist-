import { COLORS, FX, WORLD } from "../config";
import type { GameState } from "../game/state";
import { drawBackground } from "./background";
import { drawEdges, drawFlip } from "./flipView";
import { drawFreeze } from "./freezeView";
import { drawHud, drawLevelBanner } from "./hud";
import { drawParticles } from "./particlesView";
import { drawGameOver, drawPaused } from "./screens";
import { drawStart } from "./startScreen";
import { drawWind } from "./windView";
import { drawWord } from "./wordView";

export class Renderer {
  private readonly ctx: CanvasRenderingContext2D;
  private scale = 1;
  private offsetX = 0;
  private offsetY = 0;

  constructor(private readonly canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D is not available");
    this.ctx = ctx;

    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  render(state: GameState): void {
    const { ctx, canvas, scale, offsetX, offsetY } = this;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = COLORS.letterbox;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, WORLD.width, WORLD.height);
    ctx.clip();

    drawBackground(ctx);

    if (state.phase === "start") {
      drawStart(ctx, state);
    } else {
      this.drawPlayfield(state);
      drawHud(ctx, state);
      if (state.phase === "paused") drawPaused(ctx);
      if (state.phase === "over") drawGameOver(ctx, state);
    }

    ctx.restore();
  }

  // Only the playfield shakes, so the HUD and screens stay readable.
  private drawPlayfield(state: GameState): void {
    const { ctx } = this;

    ctx.save();
    ctx.translate(
      (Math.random() * 2 - 1) * state.shake,
      (Math.random() * 2 - 1) * state.shake,
    );

    drawLevelBanner(ctx, state);
    drawFlip(ctx, state);
    drawWind(ctx, state);
    drawFreeze(ctx, state);
    drawEdges(ctx, state);
    for (const word of state.words) drawWord(ctx, word, word === state.target);
    drawParticles(ctx, state.particles);
    ctx.restore();

    if (state.damageFlash > 0) {
      ctx.globalAlpha = (state.damageFlash / FX.damageFlashTime) * FX.damageFlashAlpha;
      ctx.fillStyle = COLORS.damage;
      ctx.fillRect(0, 0, WORLD.width, WORLD.height);
      ctx.globalAlpha = 1;
    }
  }

  private resize(): void {
    const { canvas } = this;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);

    this.scale = Math.min(canvas.width / WORLD.width, canvas.height / WORLD.height);
    this.offsetX = (canvas.width - WORLD.width * this.scale) / 2;
    this.offsetY = (canvas.height - WORLD.height * this.scale) / 2;
  }
}
