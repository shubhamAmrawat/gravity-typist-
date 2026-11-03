export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // s remaining; 0 means unused
  maxLife: number;
  size: number;
  color: string;
}

// A fixed ring of particles: no per-frame allocation, and the oldest is reused when full.
export class ParticlePool {
  readonly items: Particle[];
  private next = 0;

  constructor(capacity: number) {
    this.items = Array.from({ length: capacity }, () => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 1,
      size: 1,
      color: "",
    }));
  }

  emit(x: number, y: number, vx: number, vy: number, life: number, size: number, color: string): void {
    const particle = this.items[this.next];
    Object.assign(particle, { x, y, vx, vy, life, maxLife: life, size, color });
    this.next = (this.next + 1) % this.items.length;
  }

  update(dt: number, gravity: number): void {
    for (const particle of this.items) {
      if (particle.life <= 0) continue;

      particle.life = Math.max(particle.life - dt, 0);
      particle.vy += gravity * dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
    }
  }
}
