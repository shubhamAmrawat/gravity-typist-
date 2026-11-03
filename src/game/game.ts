import type { SoundName } from "../audio";
import { FX, PHYSICS, START_SCREEN, WORLD } from "../config";
import type { DevOptions } from "../devFlags";
import { Word } from "../entities/word";
import { updateAttract } from "../systems/attract";
import { loadHighScore, saveHighScore } from "../storage";
import { splitBoss } from "../systems/boss";
import { applyPower, applyWordEffect } from "../systems/effects";
import { addShake, blockWord, burstWord, crashWord, explodeWord, updateFx } from "../systems/fx";
import { advanceLevel } from "../systems/levels";
import { driftGravity, hasHitLethalEdge, moveWord, windAcceleration } from "../systems/physics";
import { recordClear, recordHit, recordTypo } from "../systems/scoring";
import { Spawner } from "../systems/spawner";
import { applyLetter, releaseTarget } from "../systems/targeting";
import { createState, type GameState } from "./state";

export class Game {
  state: GameState = createState("start", loadHighScore());
  private spawner: Spawner;

  constructor(
    private readonly play: (sound: SoundName) => void = () => {},
    private readonly dev: DevOptions = { startLevel: 1 },
  ) {
    this.spawner = new Spawner(dev.forceColor);
  }

  update(dt: number): void {
    const { state } = this;
    // Effects finish playing out behind the game-over screen.
    if (state.phase === "over") updateFx(state, dt);
    if (state.phase === "start") {
      updateFx(state, dt);
      updateAttract(state, dt);
    }
    if (state.phase !== "playing") return;

    updateFx(state, dt);
    state.stats.activeTime += dt;
    state.gravityMultiplier = driftGravity(state.gravityMultiplier, dt);
    state.windTimer = Math.max(state.windTimer - dt, 0);

    // A freeze also holds the flip timer. If a flip could end mid-freeze, words that
    // had no chance to rise would be lost to the ground the moment the freeze ended.
    const wasFrozen = state.freezeTimer > 0;
    state.freezeTimer = Math.max(state.freezeTimer - dt, 0);
    if (wasFrozen) return;

    this.updateFlip(dt);
    this.spawner.update(dt, state);

    const isFlipped = state.flipTimer > 0;
    const direction = isFlipped ? -1 : 1;
    const gravity = PHYSICS.baseGravity * state.gravityMultiplier * direction;
    const wind = windAcceleration(state.windTimer, state.windDirection);
    for (const word of state.words) {
      moveWord(word, gravity, wind, dt);
    }

    const missed = state.words.filter((word) => hasHitLethalEdge(word, isFlipped));
    if (missed.length === 0) return;

    state.words = state.words.filter((word) => !missed.includes(word));
    if (state.target && missed.includes(state.target)) state.target = null;

    let livesLost = 0;
    for (const word of missed) {
      if (state.hasShield) {
        state.hasShield = false;
        blockWord(state, word);
        this.play("shieldBlock");
      } else {
        crashWord(state, word);
        livesLost++;
      }
    }
    if (livesLost === 0) return;

    state.lives = Math.max(state.lives - livesLost, 0);
    if (state.lives === 0) this.endRun();
    else this.play("lifeLost");
  }

  handleLetter(letter: string): void {
    const { state } = this;
    if (state.phase === "start") this.handleStartLetter(letter);
    if (state.phase !== "playing") return;

    const result = applyLetter(state, letter);
    if (result.kind === "typo") {
      recordTypo(state.stats);
      addShake(state, FX.typoShake);
      this.play("typo");
      return;
    }

    recordHit(state.stats);
    if (result.kind === "hit") {
      this.play("key");
      return;
    }

    recordClear(state, result.word);
    applyWordEffect(state, result.word);
    explodeWord(state, result.word);
    this.play("clear");
    if (result.word.color === "green") this.play("wind");
    if (result.word.color === "purple") this.play("flip");
    if (result.word.color === "boss") {
      splitBoss(state, result.word);
      addShake(state, FX.bossShake);
      this.play("bossSplit");
    }

    let cleared = 1;
    if (result.word.power) {
      cleared += applyPower(state, result.word.power);
      this.play(result.word.power);
    }

    let leveledUp = false;
    for (let i = 0; i < cleared; i++) {
      if (advanceLevel(state)) leveledUp = true;
    }
    if (leveledUp) this.play("levelUp");
  }

  handleBackspace(): void {
    if (this.state.phase === "playing") releaseTarget(this.state);
    if (this.state.phase === "start") this.state.startTyped = 0;
  }

  handleEnter(): void {
    const { phase } = this.state;
    if (phase === "start") this.launchFromStartScreen();
    if (phase === "over") this.startRun();
  }

  handleEscape(): void {
    const { state } = this;
    if (state.phase === "playing") state.phase = "paused";
    else if (state.phase === "paused") state.phase = "playing";
  }

  handleFocusLost(): void {
    if (this.state.phase === "playing") this.state.phase = "paused";
  }

  // A wrong key starts the word again, and counts as its first letter if it matches.
  private handleStartLetter(letter: string): void {
    const { state } = this;
    const { word } = START_SCREEN;

    if (letter === word[state.startTyped]) {
      state.startTyped++;
      if (state.startTyped === word.length) this.launchFromStartScreen();
      else this.play("key");
      return;
    }

    state.startTyped = letter === word[0] ? 1 : 0;
    addShake(state, FX.typoShake);
    this.play("typo");
  }

  private startRun(): void {
    this.state = createState("playing", this.state.highScore, this.dev.startLevel);
    this.spawner = new Spawner(this.dev.forceColor);
  }

  private launchFromStartScreen(): void {
    this.startRun();
    const { word, wordY } = START_SCREEN;
    burstWord(this.state, new Word(word, WORLD.width / 2, wordY, "golden"));
    addShake(this.state, FX.startShake);
    this.play("clear");
  }

  private updateFlip(dt: number): void {
    const { state } = this;
    if (state.flipTimer <= 0) return;

    state.flipTimer = Math.max(state.flipTimer - dt, 0);
    if (state.flipTimer === 0) this.play("flipEnd");
  }

  private endRun(): void {
    const { state } = this;
    state.phase = "over";
    addShake(state, FX.gameOverShake);
    this.play("gameOver");
    // Runs using a dev shortcut don't count.
    const isDevRun = this.dev.startLevel > 1 || this.dev.forceColor !== undefined;
    if (isDevRun || state.score <= state.highScore) return;

    state.highScore = state.score;
    state.isNewHighScore = true;
    saveHighScore(state.score);
  }
}
