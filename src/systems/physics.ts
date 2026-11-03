import { GRAVITY, PHYSICS, WIND, WORD_STYLE, WORLD } from "../config";
import { textHalfWidth, type Word } from "../entities/word";

// Semi-implicit Euler: velocity first, then position using the new velocity.
// A negative gravity means gravity is flipped.
export function moveWord(word: Word, gravity: number, wind: number, dt: number): void {
  const isMovingAgainstGravity = word.vy * gravity < 0;
  const turn = isMovingAgainstGravity ? Math.sign(gravity) * PHYSICS.turnAcceleration : 0;
  word.vy = clamp(word.vy + (gravity + turn) * dt, PHYSICS.terminalVelocity);
  word.y += word.vy * dt;
  if (word.y >= WORLD.ceilingY) word.hasEntered = true;
  stopAtSafeEdge(word, gravity < 0);

  if (wind !== 0) {
    word.vx = clamp(word.vx + wind * dt, WIND.maxSpeed);
  } else {
    word.vx *= Math.exp(-dt / WIND.dragTime);
  }
  word.x += word.vx * dt;
  stopAtWalls(word);
}

export function windAcceleration(windTimer: number, windDirection: number): number {
  return windTimer > 0 ? windDirection * WIND.acceleration : 0;
}

export function hasHitLethalEdge(word: Word, isFlipped: boolean): boolean {
  return isFlipped ? word.hasEntered && word.y <= WORLD.ceilingY : word.y >= WORLD.groundY;
}

export function clampGravity(multiplier: number): number {
  return Math.min(Math.max(multiplier, GRAVITY.minMultiplier), GRAVITY.maxMultiplier);
}

// Exponential decay towards 1x, which stays the same at any frame rate.
export function driftGravity(multiplier: number, dt: number): number {
  return 1 + (multiplier - 1) * Math.exp(-dt / GRAVITY.driftTime);
}

function clamp(value: number, limit: number): number {
  return Math.min(Math.max(value, -limit), limit);
}

// The edge that isn't lethal right now simply stops a word. A word still above the
// screen waits there during a flip, because it could otherwise rise out of reach.
function stopAtSafeEdge(word: Word, isFlipped: boolean): void {
  const top = word.hasEntered ? WORLD.ceilingY : WORD_STYLE.spawnY;

  if (isFlipped && word.y > WORLD.groundY) {
    word.y = WORLD.groundY;
    word.vy = 0;
  } else if (word.y < top && (!isFlipped || !word.hasEntered)) {
    word.y = top;
    word.vy = 0;
  }
}

// Keeps the whole word readable: it rests against the side instead of leaving the screen.
function stopAtWalls(word: Word): void {
  const inset = WORD_STYLE.sideMargin + textHalfWidth(word.text);
  const minX = inset;
  const maxX = WORLD.width - inset;

  if (word.x < minX || word.x > maxX) {
    word.x = Math.min(Math.max(word.x, minX), maxX);
    word.vx = 0;
  }
}
