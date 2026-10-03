// src/services/geminiChatService.ts
import { api } from './api';
import type { ChatMessage } from '../types/chat';

interface GeminiChatResponse {
  success: boolean;
  reply: string;
}

// Envia uma mensagem para o serviço Gemini Chat e retorna a resposta do chat.
export async function sendChatMessage(message: string, history: ChatMessage[]): Promise<string> {
  const response = await api.post<GeminiChatResponse>('/gemini-chat', { message, history });
  return response.reply;
}
