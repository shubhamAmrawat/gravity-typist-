const HIGH_SCORE_KEY = "gravity-typist:high-score";

// Storage can be blocked or unavailable, which should never stop the game.
export function loadHighScore(): number {
  try {
    const score = Number(localStorage.getItem(HIGH_SCORE_KEY));
    return Number.isFinite(score) && score > 0 ? score : 0;
  } catch {
    return 0;
  }
}

export function saveHighScore(score: number): void {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, String(score));
  } catch {
    // The score still shows for this session.
  }
}
