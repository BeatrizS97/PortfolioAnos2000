// src/utils/sanitizeText.ts

// Sanitização básica de texto exibido: remove <script>, qualquer tag HTML, "javascript:" e atributos on*= (ex.: onclick=).
// Observação: o React já escapa texto automaticamente; isto é uma camada extra caso algum dia o texto seja usado como HTML.
export function sanitizeDisplayText(value: string): string {
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/\bon\w+\s*=/gi, '');
}