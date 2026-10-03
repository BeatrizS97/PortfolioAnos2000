// src/types/chat.ts
export type ChatRole = 'user' | 'model';

export interface ChatMessage {
  role: ChatRole;
  text: string;
}

export type MsnContactMode = 'ai' | 'static';
export type MsnContactStatus = 'online' | 'busy';

export interface MsnContact {
  id: string;
  name: string;
  // Texto exibido como "recado" abaixo do nome, na lista de contatos. 
  personalMessage: string;
  status: MsnContactStatus;
  // 'ai' conversa de verdade via /api/gemini-chat; 'static' só responde uma frase fixa.
  mode: MsnContactMode;
  // Primeira mensagem exibida ao abrir a conversa.
  greeting: string;
  // Usado apenas quando mode === 'static'.
  staticReply?: string;
}
