// src/services/visitsService.ts
import { api } from './api';

// Marca guardada no navegador depois que a primeira visita foi registrada.
const VISITED_KEY = 'portfolio:visited';

// Evita enviar duas vezes na mesma carga da página (o React StrictMode roda os efeitos duas vezes em desenvolvimento).
let requestSent = false;

/**
 * Registra a primeira visita deste navegador (POST /api/visits). Nas visitas seguintes não faz nada.
 * Conta navegadores, não pessoas: quem limpa os dados do navegador ou entra de outro aparelho conta de novo.
 * Nunca lança erro: o contador é secundário e não pode atrapalhar o site. Se a API falhar, tenta de novo na próxima visita.
 */
export async function registerFirstVisit(): Promise<void> {
  if (requestSent) return;

  // Sem localStorage (ex.: modo privado) não dá para lembrar da visita, então não conta (senão contaria a cada carregamento).
  try {
    if (window.localStorage.getItem(VISITED_KEY)) return;
  } catch {
    return;
  }

  requestSent = true;
  try {
    await api.post('/visits', {});
    window.localStorage.setItem(VISITED_KEY, '1');
  } catch {
    // Falha de rede, limite de tentativas ou localStorage cheio — ignora em silêncio.
  }
}