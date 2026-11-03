import type { ParticlePool } from "../entities/particle";

export function drawParticles(ctx: CanvasRenderingContext2D, particles: ParticlePool): void {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  for (const particle of particles.items) {
    if (particle.life <= 0) continue;

    const { x, y, size } = particle;
    ctx.globalAlpha = particle.life / particle.maxLife;
    ctx.fillStyle = particle.color;
    ctx.fillRect(x - size / 2, y - size / 2, size, size);
  }

  ctx.restore();
}
