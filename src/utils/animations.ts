// src/utils/animations.ts
// Retorna true quando o usuário pediu "menos movimento" nas configurações do sistema operacional.
function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Aplica um efeito de "sacudir a tela" (estilo MSN) no body por uma duração limitada.
export function shakeScreen(durationMs = 900): void {
  if (prefersReducedMotion()) return;
  document.body.classList.add('screen-vibrate');
  window.setTimeout(() => document.body.classList.remove('screen-vibrate'), durationMs);
}