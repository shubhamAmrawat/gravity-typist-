export interface KeyHandlers {
  onLetter: (letter: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  onEscape: () => void;
}

export function listenForKeys(handlers: KeyHandlers): void {
  window.addEventListener("keydown", (event) => {
    if (event.repeat || event.ctrlKey || event.altKey || event.metaKey) return;

    if (event.key === "Backspace") {
      event.preventDefault();
      handlers.onBackspace();
    } else if (event.key === "Enter") {
      event.preventDefault();
      handlers.onEnter();
    } else if (event.key === "Escape") {
      event.preventDefault();
      handlers.onEscape();
    } else if (/^[a-z]$/i.test(event.key)) {
      event.preventDefault();
      handlers.onLetter(event.key.toLowerCase());
    }
  });
}

export function listenForFocusLoss(onLost: () => void): void {
  window.addEventListener("blur", onLost);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) onLost();
  });
}
