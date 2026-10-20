// src/components/apps/MSNMessenger/AIAssistant.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useWindowManager } from '../../../hooks/useWindowManager';
import { useSound } from '../../../hooks/useSound';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { useLanguage } from '../../../hooks/useLanguage';
import { shakeScreen } from '../../../utils/animations';
import { SOUND_PATHS } from '../../../utils/constants';
import { findAnswer, formatLastMessageAt, TYPING_TEXT } from '../../../utils/msnHelpers';
import { classifyChatError, sendChatMessage } from '../../../services/geminiChatService';
import type { ChatMessage } from '../../../types/chat';
import {
  FolderMiniIcon,
  NudgeIcon,
  LockIcon,
  SmileyIcon,
  WinkSmileyIcon,
  BackgroundMiniIcon,
  VoiceClipMiniIcon,
  HeartEmblemIcon,
  StarEmblemIcon,
} from './MSNIcons';

interface Message { from: 'bot' | 'user' | 'system'; text: string; }

// Quem pode ser o autor de uma mensagem salva.
const MESSAGE_SENDERS: string[] = ['bot', 'user', 'system'];

// Confere se o valor salvo no localStorage é uma lista de mensagens válidas ({ from, text }).
// Se não for (ex.: editado à mão ou corrompido), o histórico começa vazio em vez de quebrar o chat.
function isMessageList(value: unknown): value is Message[] {
  return (
    Array.isArray(value) &&
    value.every((item) => {
      if (typeof item !== 'object' || item === null) return false;
      const { from, text } = item as Record<string, unknown>;
      return typeof from === 'string' && MESSAGE_SENDERS.includes(from) && typeof text === 'string';
    })
  );
}

// Quantas mensagens recentes são enviadas para a API como contexto da conversa.
const MAX_HISTORY_MESSAGES = 10;

// Quantas mensagens ficam salvas no localStorage. Passou disso, as mais antigas são descartadas (evita lentidão com o tempo).
const MAX_SAVED_MESSAGES = 50;

// Mantém só as últimas MAX_SAVED_MESSAGES mensagens da lista.
function limitHistory(list: Message[]): Message[] {
  return list.length > MAX_SAVED_MESSAGES ? list.slice(-MAX_SAVED_MESSAGES) : list;
}

// Converte as mensagens da tela para o formato esperado pela API (ignora mensagens de sistema, como o nudge).
function toChatHistory(messages: Message[]): ChatMessage[] {
  const history = messages
    .filter((m) => m.from !== 'system')
    .map((m): ChatMessage => ({ role: m.from === 'bot' ? 'model' : 'user', text: m.text }))
    .slice(-MAX_HISTORY_MESSAGES);

  // O Gemini espera que o histórico comece com uma mensagem do usuário.
  while (history.length > 0 && history[0].role === 'model') {
    history.shift();
  }
  return history;
}

// Componente principal do assistente virtual no estilo MSN Messenger.
const AIAssistant: React.FC = () => {
  const { openWindow, focusWindow, windows } = useWindowManager();
  const { playSound } = useSound();
  const { language, t } = useLanguage();
  // O histórico fica salvo no localStorage para não se perder ao recarregar a página.
  // A saudação não é salva: ela é exibida a cada render, já no idioma atual.
  const [messages, setMessages] = useLocalStorage<Message[]>('portfolio:msnHistory', [], isMessageList);
  // Estado para o rascunho da mensagem que o usuário está digitando e para a data/hora da última mensagem recebida. 
  const [draft, setDraft] = useState('');
  const [lastMessageAt, setLastMessageAt] = useState<Date>(() => new Date());
  // Indica que estamos aguardando a resposta da API ("Beatriz está digitando...").
  const [isTyping, setIsTyping] = useState(false);
  // Elemento vazio no fim da lista de mensagens: é para ele que a rolagem automática desce.
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll: quando chega uma mensagem nova (ou o "digitando..." aparece/some), rola suavemente até o fim.
  // block: 'nearest' rola só a caixa do chat, sem mexer na página inteira.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, isTyping]);

  // Função que lida com o envio de mensagens pelo usuário.
  // Ela normaliza a pergunta, busca uma resposta na base de conhecimento e atualiza o estado das mensagens.
  // Se não houver palavra-chave local, consulta a API /api/gemini-chat (com fallback local se ela falhar).
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede o comportamento padrão do formulário (recarregar a página).
    const question = draft.trim(); // Remove espaços em branco do início e do fim da pergunta.
    if (!question || isTyping) return;

    // Atualiza o estado das mensagens, adicionando a pergunta do usuário e a resposta do bot, e atualiza a data/hora da última mensagem recebida.
    setMessages((prev) => limitHistory([...prev, { from: 'user', text: question }]));
    setDraft('');

    setIsTyping(true);
    let answer: string;
    try {
      // `messages` ainda não contém a pergunta atual, que é enviada separadamente.
      answer = await sendChatMessage(question, toChatHistory(messages), language);
    } catch (error) {
      // API indisponível ou offline: usa a resposta padrão local (no idioma atual).
      // Antes de cair nela, tenta a base local por palavra-chave (t.msn.kb).
      // Sem resposta local, a mensagem depende do tipo do erro (conexão, limite de requisições ou genérico).
      const kind = classifyChatError(error);
      const errorText = kind === 'network' ? t.msn.errors.network : kind === 'rate-limit' ? t.msn.errors.rateLimit : t.msn.fallbackAnswer;
      answer = findAnswer(question, t.msn.kb) ?? errorText;
    } finally {
      setIsTyping(false);
    }

    setMessages((prev) => limitHistory([...prev, { from: 'bot', text: answer }]));
    setLastMessageAt(new Date());
  };

  // Função que lida com o clique no botão "Ver Projetos". Ela verifica se a janela do Orkut já está aberta; se estiver, foca nela, caso contrário, abre uma nova janela do Orkut.
  const handleShowProjects = () => {
    const orkutWindow = windows.find((w) => w.type === 'orkut');
    if (orkutWindow) {
      focusWindow(orkutWindow.id);
    } else {
      openWindow('orkut');
    }
  };

  // Função que lida com o clique no botão "Nudge". Ela aplica uma animação de sacudir a tela, toca um som de notificação e adiciona uma mensagem do sistema informando que o usuário enviou um nudge.
  const handleNudge = () => {
    shakeScreen();
    playSound(SOUND_PATHS.msnNotification);
    setMessages((prev) => limitHistory([...prev, { from: 'system', text: t.msn.nudgeSent }]));
  };

  // Saudação sempre na frente da conversa salva, traduzida pelo idioma atual.
  const displayMessages: Message[] = [{ from: 'bot', text: t.msn.greeting }, ...messages];

  return (
    <div className="msn-classic-chat">
      <div className="msn-row msn-row--top">
        <div className="msn-card msn-card--messages">
          <div className="msn-to-line">
            <span>{t.msn.to}</span> <strong>{t.msn.contactName}</strong>
          </div>

          <div className="msn-messages">
            <p className="msn-tip">
              <LockIcon /> {t.msn.securityTip}
            </p>

            {displayMessages.map((m, i) =>
              m.from === 'system' ? (
                // O texto do nudge é sempre exibido no idioma atual, mesmo em históricos salvos antes da troca de idioma.
                <p key={i} className="msn-message msn-message--system">{t.msn.nudgeSent}</p>
              ) : (
                <p key={i} className={`msn-message msn-message--${m.from}`}>
                  <strong>
                    {m.from === 'bot' ? <HeartEmblemIcon /> : <StarEmblemIcon />}{' '}
                    {m.from === 'bot' ? t.msn.botSays : t.msn.userSays}
                  </strong>
                  <br />
                  {m.text}
                </p>
              )
            )}

            {isTyping && (
              <p className="msn-message" role="status" style={{ fontStyle: 'italic', color: '#666' }}>
                {TYPING_TEXT[language]}
              </p>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="msn-card msn-card--avatar">
          <img src="/assets/images/icons/user.png" alt={t.msn.contactName} />
        </div>
      </div>

      <div className="msn-row msn-row--bottom">
        <div className="msn-card msn-card--compose">
          <div className="msn-toolbar-row">
            <button type="button" onClick={handleShowProjects}>
              <FolderMiniIcon /> {t.msn.viewProjects}
            </button>
            <span className="msn-toolbar-divider" />
            <button type="button" className="nudge-button" onClick={handleNudge}>
              <NudgeIcon /> {t.msn.nudge}
            </button>
          </div>

          <div className="msn-footer">
            <div className="msn-compose-toolbar">
              <span className="msn-compose-tool" role="button" aria-disabled="true" aria-label={t.msn.tools.font} title={t.msn.tools.font}>
                <strong>A</strong> <span className="msn-compose-tool-caret" role="presentation">▾</span>
              </span>
              <span className="msn-compose-tool" role="button" aria-disabled="true" aria-label={t.msn.tools.emoticons} title={t.msn.tools.emoticons}>
                <SmileyIcon /> <span className="msn-compose-tool-caret" role="presentation">▾</span>
              </span>
              <span className="msn-compose-tool" role="button" aria-disabled="true" aria-label={t.msn.tools.voiceClip} title={t.msn.tools.voiceClip}>
                <VoiceClipMiniIcon /> <span className="msn-compose-tool-label">{t.msn.tools.voiceClip}</span> <span className="msn-compose-tool-caret" role="presentation">▾</span>
              </span>
              <span className="msn-compose-tool" role="button" aria-disabled="true" aria-label={t.msn.tools.winks} title={t.msn.tools.winks}>
                <WinkSmileyIcon /> <span className="msn-compose-tool-caret" role="presentation">▾</span>
              </span>
              <span className="msn-compose-tool" role="button" aria-disabled="true" aria-label={t.msn.tools.backgrounds} title={t.msn.tools.backgrounds}>
                <BackgroundMiniIcon /> <span className="msn-compose-tool-caret" role="presentation">▾</span>
              </span>
            </div>

            <form className="msn-compose-row" onSubmit={handleSend}>
              <input
                type="text"
                placeholder={t.msn.inputPlaceholder}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <button type="submit" disabled={isTyping}>{t.msn.send}</button>
            </form>

            <div className="msn-status-bar">
              {formatLastMessageAt(lastMessageAt, t.locale, t.msn.lastMessage)}
            </div>
          </div>
        </div>

        <div className="msn-card msn-card--avatar">
          <img src="/assets/images/icons/user-placeholder.png" alt={t.msn.you} />
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;