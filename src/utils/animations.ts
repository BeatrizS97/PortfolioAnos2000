// src/utils/animations.ts
// Aplica um efeito de "vibração" (estilo MSN) num elemento por uma duração limitada. 
export function vibrate(el: HTMLElement | null, durationMs = 2000): void {
  if (!el) return;
  el.classList.add('vibrate');
  window.setTimeout(() => el.classList.remove('vibrate'), durationMs);
}

// Aplica um efeito de "sacudir a tela" (estilo MSN) no body por uma duração limitada.
export function shakeScreen(durationMs = 900): void {
  document.body.classList.add('screen-vibrate');
  window.setTimeout(() => document.body.classList.remove('screen-vibrate'), durationMs);
}

// Retorna uma Promise que resolve após um atraso especificado em milissegundos.
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}