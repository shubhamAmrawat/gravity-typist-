import { AudioEngine } from "./audio";
import { readDevOptions } from "./devFlags";
import { Game } from "./game/game";
import { startLoop } from "./game/loop";
import { Renderer } from "./render/renderer";
import { listenForFocusLoss, listenForKeys } from "./systems/input";

const canvas = document.querySelector<HTMLCanvasElement>("#game");
if (!canvas) throw new Error("Missing #game canvas");

const audio = new AudioEngine();
const game = new Game((sound) => audio.play(sound), readDevOptions());
const renderer = new Renderer(canvas);

// Registered before the game's keys so the first key press can already make sound.
window.addEventListener("keydown", () => audio.unlock());
listenForKeys({
  onLetter: (letter) => game.handleLetter(letter),
  onBackspace: () => game.handleBackspace(),
  onEnter: () => game.handleEnter(),
  onEscape: () => game.handleEscape(),
});
listenForFocusLoss(() => game.handleFocusLost());

startLoop(
  (dt) => game.update(dt),
  () => renderer.render(game.state),
);
