// src/services/geminiChatService.ts
import { api } from './api';
import type { ChatMessage } from '../types/chat';
import type { Language } from '../types/language';

interface GeminiChatResponse {
  success: boolean;
  reply: string;
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
  const response = await api.post<GeminiChatResponse>('/gemini-chat', { message, history, language }, signal);
  return response.reply;
}