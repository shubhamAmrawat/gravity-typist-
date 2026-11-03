import { PHYSICS } from "../config";

export function startLoop(update: (dt: number) => void, render: () => void): void {
  let last = performance.now();

  const frame = (now: number) => {
    // The cap stops a long pause, such as a hidden tab, from becoming one huge step.
    const dt = Math.min(Math.max(now - last, 0) / 1000, PHYSICS.maxDelta);
    last = now;
    update(dt);
    render();
    requestAnimationFrame(frame);
  };

  requestAnimationFrame(frame);
}
