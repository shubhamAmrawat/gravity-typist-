import { WORD_EFFECTS, type WordColor } from "./config";

export interface DevOptions {
  startLevel: number;
  forceColor?: WordColor;
}

// Test shortcuts for `npm run dev`: ?level=N and ?force=green.
// Production builds always use the defaults.
export function readDevOptions(): DevOptions {
  if (!import.meta.env.DEV) return { startLevel: 1 };

  const params = new URLSearchParams(window.location.search);
  const level = Number(params.get("level"));
  const force = params.get("force") ?? "";

  return {
    startLevel: Number.isInteger(level) && level > 1 ? level : 1,
    forceColor: force in WORD_EFFECTS ? (force as WordColor) : undefined,
  };
}
