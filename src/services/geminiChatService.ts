// src/services/geminiChatService.ts
import { api, ApiError, NetworkError } from './api';
import type { ChatMessage } from '../types/chat';
import type { Language } from '../types/language';

interface GeminiChatResponse {
  success: boolean;
  reply: string;
}

// Tipos de falha que a tela diferencia para mostrar uma mensagem amigável ao usuário.
export type ChatErrorKind = 'network' | 'rate-limit' | 'other';

// Descobre o tipo da falha: sem conexão/timeout (network), limite de requisições do Gemini (HTTP 429) ou qualquer outra.
export function classifyChatError(error: unknown): ChatErrorKind {
  if (error instanceof NetworkError) return 'network';
  if (error instanceof ApiError && error.status === 429) return 'rate-limit';
  return 'other';
}

/**
 * Envia uma pergunta para a IA (POST /api/gemini-chat) e devolve a resposta.
 * @param message Pergunta atual do usuário.
 * @param history Mensagens anteriores da conversa (contexto).
 * @param language Idioma atual da interface; a IA responde nele.
 * @param signal Opcional: AbortSignal para cancelar a requisição.
 * @returns O texto da resposta. Lança um erro se a API falhar (quem chama usa o fallback local).
 */
// Envia uma mensagem para o serviço Gemini Chat e retorna a resposta do chat.
// O idioma atual vai junto para a IA responder na mesma língua da interface.
export async function sendChatMessage(
  message: string,
  history: ChatMessage[],
  language: Language,
  signal?: AbortSignal
): Promise<string> {
  try {
    const response = await api.post<GeminiChatResponse>('/gemini-chat', { message, history, language }, signal);
    return response.reply;
  } catch (error) {
    // Log para depuração: status HTTP e mensagem. O detalhe completo fica no terminal do `vercel dev`.
    if (error instanceof ApiError) {
      console.error('[gemini-chat] A API respondeu com erro. Status:', error.status, '| Mensagem:', error.message);
    } else if (error instanceof NetworkError) {
      console.error('[gemini-chat] Falha de rede, tempo esgotado ou resposta que não é JSON:', error.message);
    } else {
      console.error('[gemini-chat] Erro inesperado:', error);
    }
    throw error;
  }
}