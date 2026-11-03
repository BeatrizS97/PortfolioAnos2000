// src/components/apps/MSNMessenger/AIAssistant.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useSound } from '../../../hooks/useSound';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { useLanguage } from '../../../hooks/useLanguage';
import { shakeScreen } from '../../../utils/animations';
import { SOUND_PATHS } from '../../../utils/constants';
import { findAnswer, formatLastMessageAt, TYPING_TEXT } from '../../../utils/msnHelpers';
import { formatChatText } from '../../../utils/formatChatText';
import { classifyChatError, sendChatMessage } from '../../../services/geminiChatService';
import type { ChatMessage } from '../../../types/chat';
import {
  BACKGROUNDS,
  COMPOSE_TEXT,
  DEFAULT_TEXT_FORMAT,
  EMOTICONS,
  FONT_FAMILIES,
  FONT_SIZES,
  TEXT_COLORS,
  VOICE_CLIPS,
  WINKS,
  formatToStyle,
  isBackgroundId,
  isTextFormat,
} from '../../../utils/msnCompose';
import type { TextFormat } from '../../../utils/msnCompose';
import {
  LockIcon,
  SmileyIcon,
  WinkSmileyIcon,
  BackgroundMiniIcon,
  VoiceClipMiniIcon,
  HeartEmblemIcon,
  StarEmblemIcon,
  PenMiniIcon,
  GiftMiniIcon,
  ParenSmileyMiniIcon,
} from './MSNIcons';

// A mensagem do usuário guarda a formatação usada (fonte, cor, etc.) para continuar igual depois de recarregar a página.
type SystemKind = 'nudge' | 'voice' | 'wink';
interface Message { from: 'bot' | 'user' | 'system'; text: string; format?: TextFormat; kind?: SystemKind; itemId?: string; }

// Quem pode ser o autor de uma mensagem salva.
const MESSAGE_SENDERS: string[] = ['bot', 'user', 'system'];
const SYSTEM_KINDS: string[] = ['nudge', 'voice', 'wink'];

// Qual menu da faixa de formatação está aberto (só um por vez).
type MenuName = 'font' | 'emoticons' | 'voice' | 'wink' | 'background';

// Confere se o valor salvo no localStorage é uma lista de mensagens válidas ({ from, text }).
// Se não for (ex.: editado à mão ou corrompido), o histórico começa vazio em vez de quebrar o chat.
function isMessageList(value: unknown): value is Message[] {
  return (
    Array.isArray(value) &&
    value.every((item) => {
      if (typeof item !== 'object' || item === null) return false;
      const { from, text, format, kind } = item as Record<string, unknown>;
      return (
        typeof from === 'string' &&
        MESSAGE_SENDERS.includes(from) &&
        typeof text === 'string' &&
        (format === undefined || isTextFormat(format)) &&
        (kind === undefined || (typeof kind === 'string' && SYSTEM_KINDS.includes(kind)))
      );
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

// Frame de foto do MSN: a foto preenche o quadro, a setinha ▾ fica abaixo (fora da foto) e a aba ◂ sai pela lateral direita.
const AvatarFrame: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <div className="msn-card msn-card--avatar">
    <div className="msn-avatar-frame">
      <img src={src} alt={alt} loading="eager" />
      <span className="msn-avatar-tab" aria-hidden="true">◂</span>
    </div>
    <span className="msn-avatar-arrow" aria-hidden="true">▾</span>
  </div>
);

// Componente principal do assistente virtual no estilo MSN Messenger.
const AIAssistant: React.FC = () => {
  const { playSound } = useSound();
  const { language, t } = useLanguage();
  const compose = COMPOSE_TEXT[language];
  // O histórico fica salvo no localStorage para não se perder ao recarregar a página.
  // A saudação não é salva: ela é exibida a cada render, já no idioma atual.
  const [messages, setMessages] = useLocalStorage<Message[]>('portfolio:msnHistory', [], isMessageList);
  const [format, setFormat] = useLocalStorage<TextFormat>('portfolio:msnFormat', DEFAULT_TEXT_FORMAT, isTextFormat);
  const [backgroundId, setBackgroundId] = useLocalStorage<string>('portfolio:msnBackground', 'default', isBackgroundId);
  // Estado para o rascunho da mensagem que o usuário está digitando e para a data/hora da última mensagem recebida. 
  const [draft, setDraft] = useState('');
  const [lastMessageAt, setLastMessageAt] = useState<Date>(() => new Date());
  // Indica que estamos aguardando a resposta da API ("Beatriz está digitando...").
  const [isTyping, setIsTyping] = useState(false);
  // Controla qual menu da faixa de formatação está aberto (fonte, emoticons, voice clip, wink ou fundo).
  const [openMenu, setOpenMenu] = useState<MenuName | null>(null);
  // Elemento vazio no fim da lista de mensagens: é para ele que a rolagem automática desce.
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Referência do campo de digitação, para devolver o foco a ele depois de escolher um emoticon.
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Caixa de digitação inteira (faixa de ícones + campo + faixa de baixo); clicar fora dela fecha o menu aberto.
  const footerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll: quando chega uma mensagem nova (ou o "digitando..." aparece/some), rola suavemente até o fim.
  // block: 'nearest' rola só a caixa do chat, sem mexer na página inteira.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, isTyping]);

  // Fecha o menu aberto ao clicar fora da caixa de digitação ou ao apertar Escape.
  useEffect(() => {
    if (!openMenu) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (!footerRef.current?.contains(e.target as Node)) setOpenMenu(null);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null);
    };
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openMenu]);

  // Função que lida com o envio de mensagens pelo usuário.
  // Ela normaliza a pergunta, busca uma resposta na base de conhecimento e atualiza o estado das mensagens.
  // Se não houver palavra-chave local, consulta a API /api/gemini-chat (com fallback local se ela falhar).
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede o comportamento padrão do formulário (recarregar a página).
    const question = draft.trim(); // Remove espaços em branco do início e do fim da pergunta.
    if (!question || isTyping) return;

    // Atualiza o estado das mensagens, adicionando a pergunta do usuário (com a formatação escolhida) e a resposta do bot, e atualiza a data/hora da última mensagem recebida.
    setMessages((prev) => limitHistory([...prev, { from: 'user', text: question, format }]));
    setDraft('');
    setOpenMenu(null);

    // A IA responde primeiro (ela conhece os dados pelo prompt do servidor), então perguntas livres como
    // "quais frameworks ela usa no Cinema de Terror?" são respondidas de verdade, e não por uma palavra-chave.
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

  // No campo de texto de 2 linhas, Enter envia a mensagem (como antes) e Shift+Enter quebra a linha.
  const handleDraftKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  // Função que lida com o clique no botão "Nudge". Ela aplica uma animação de sacudir a tela, toca um som de notificação e adiciona uma mensagem do sistema informando que o usuário enviou um nudge.
  const handleNudge = () => {
    shakeScreen();
    playSound(SOUND_PATHS.msnNotification);
    setMessages((prev) => limitHistory([...prev, { from: 'system', text: '', kind: 'nudge' }]));
  };

  // Abre o menu escolhido (ou fecha, se ele já estava aberto).
  const toggleMenu = (menu: MenuName) => {
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  // Insere o texto (emoticon, presente) na posição do cursor, fecha o menu e devolve o foco ao campo de digitação.
  const insertAtCursor = (text: string) => {
    setOpenMenu(null);
    const el = textareaRef.current;
    if (!el) {
      setDraft((prev) => prev + text);
      return;
    }
    const { selectionStart, selectionEnd, value } = el;
    setDraft(value.slice(0, selectionStart) + text + value.slice(selectionEnd));
    const cursor = selectionStart + text.length;
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(cursor, cursor);
    });
  };

  // Muda só os campos informados da formatação do texto (ex.: { bold: true }).
  const updateFormat = (patch: Partial<TextFormat>) => {
    setFormat((prev) => ({ ...prev, ...patch }));
  };

  // "Envia" um wink: o emoji aparece animado no histórico.
  const handleWink = (winkId: string) => {
    setMessages((prev) => limitHistory([...prev, { from: 'system', text: '', kind: 'wink', itemId: winkId }]));
    setOpenMenu(null);
  };

  // Texto exibido numa mensagem de sistema, sempre no idioma atual (inclusive em históricos salvos antes da troca de idioma).
  const getSystemText = (m: Message): string => {
    if (m.kind === 'voice') {
      const clip = VOICE_CLIPS.find((item) => item.id === m.itemId);
      return `${compose.voiceSent} ${clip?.label[language] ?? ''}`;
    }
    if (m.kind === 'wink') {
      const wink = WINKS.find((item) => item.id === m.itemId);
      return `${compose.winkSent} ${wink?.label[language] ?? ''}`;
    }
    return t.msn.nudgeSent;
  };

  // Saudação sempre na frente da conversa salva, traduzida pelo idioma atual.
  const displayMessages: Message[] = [{ from: 'bot', text: t.msn.greeting }, ...messages];
  const backgroundCss = BACKGROUNDS.find((item) => item.id === backgroundId)?.css ?? '#FFFFFF';
  return (
    <div className="msn-classic-chat">
      <div className="msn-row msn-row--top">
        <div className="msn-card msn-card--messages">
          <div className="msn-card-inner">
            <div className="msn-to-line">
              <span>{t.msn.to}</span> <strong>{t.msn.contactName}</strong>
            </div>

            <div className="msn-messages" style={{ background: backgroundCss }}>
              <p className="msn-tip">
                <LockIcon /> {t.msn.securityTip}
              </p>

              {displayMessages.map((m, i) => {
                if (m.from === 'system') {
                  const wink = m.kind === 'wink' ? WINKS.find((item) => item.id === m.itemId) : undefined;
                  return (
                    <p key={i} className="msn-message msn-message--system">
                      {wink && <span className="msn-wink-emoji" aria-hidden="true">{wink.emoji}</span>} {getSystemText(m)}
                    </p>
                  );
                }
                return (
                  <p key={i} className={`msn-message msn-message--${m.from}`}>
                    <strong>
                      {m.from === 'bot' ? <HeartEmblemIcon /> : <StarEmblemIcon />}{' '}
                      {m.from === 'bot' ? t.msn.botSays : t.msn.userSays}
                    </strong>
                    <br />
                    <span style={m.format ? formatToStyle(m.format) : undefined}>
                      {m.from === 'bot' ? formatChatText(m.text) : m.text}
                    </span>
                  </p>
                );
              })}

              {isTyping && (
                <p className="msn-message" role="status" style={{ fontStyle: 'italic', color: '#666' }}>
                  {TYPING_TEXT[language]}
                </p>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        <AvatarFrame src="/assets/images/icons/user.png" alt={t.msn.contactName} />
      </div>

      <div className="msn-row msn-row--bottom">
        <div className="msn-card msn-card--compose">
          <div className="msn-footer" ref={footerRef}>
            <div className="msn-compose-toolbar">
              <span className="msn-tool-wrap">
                <button
                  type="button"
                  className="msn-compose-tool msn-compose-tool--active"
                  aria-label={t.msn.tools.font}
                  aria-expanded={openMenu === 'font'}
                  title={t.msn.tools.font}
                  onClick={() => toggleMenu('font')}
                >
                  <strong>A</strong> <span className="msn-compose-tool-caret" role="presentation">▾</span>
                </button>
                {openMenu === 'font' && (
                  <div className="msn-menu msn-menu--font" role="group" aria-label={compose.fontPanel}>
                    <label className="msn-menu-field">
                      <span>{compose.fontFamily}</span>
                      <select value={format.fontFamily} onChange={(e) => updateFormat({ fontFamily: e.target.value })}>
                        {FONT_FAMILIES.map((family) => (
                          <option key={family} value={family}>{family}</option>
                        ))}
                      </select>
                    </label>
                    <label className="msn-menu-field">
                      <span>{compose.fontSize}</span>
                      <select value={format.fontSize} onChange={(e) => updateFormat({ fontSize: Number(e.target.value) })}>
                        {FONT_SIZES.map((size) => (
                          <option key={size} value={size}>{size}px</option>
                        ))}
                      </select>
                    </label>
                    <div className="msn-menu-styles">
                      <button
                        type="button"
                        aria-pressed={format.bold}
                        aria-label={compose.bold}
                        title={compose.bold}
                        onClick={() => updateFormat({ bold: !format.bold })}
                      >
                        <strong>B</strong>
                      </button>
                      <button
                        type="button"
                        aria-pressed={format.italic}
                        aria-label={compose.italic}
                        title={compose.italic}
                        onClick={() => updateFormat({ italic: !format.italic })}
                      >
                        <em>I</em>
                      </button>
                      <button
                        type="button"
                        aria-pressed={format.underline}
                        aria-label={compose.underline}
                        title={compose.underline}
                        onClick={() => updateFormat({ underline: !format.underline })}
                      >
                        <span style={{ textDecoration: 'underline' }}>U</span>
                      </button>
                    </div>
                    <div className="msn-menu-colors" role="group" aria-label={compose.textColor}>
                      {TEXT_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className="msn-color-swatch"
                          style={{ background: color }}
                          aria-pressed={format.color === color}
                          aria-label={`${compose.textColor}: ${color}`}
                          title={color}
                          onClick={() => updateFormat({ color })}
                        />
                      ))}
                    </div>
                    <button type="button" className="msn-menu-reset" onClick={() => setFormat(DEFAULT_TEXT_FORMAT)}>
                      {compose.reset}
                    </button>
                  </div>
                )}
              </span>

              <span className="msn-tool-wrap">
                <button
                  type="button"
                  className="msn-compose-tool msn-compose-tool--active"
                  aria-label={t.msn.tools.emoticons}
                  aria-expanded={openMenu === 'emoticons'}
                  title={t.msn.tools.emoticons}
                  onClick={() => toggleMenu('emoticons')}
                >
                  <SmileyIcon /> <span className="msn-compose-tool-caret" role="presentation">▾</span>
                </button>
                {openMenu === 'emoticons' && (
                  <div className="msn-menu msn-menu--grid" role="menu">
                    {EMOTICONS.map((emoticon) => (
                      <button
                        key={emoticon.emoji}
                        type="button"
                        role="menuitem"
                        aria-label={emoticon.label[language]}
                        title={emoticon.label[language]}
                        onClick={() => insertAtCursor(emoticon.emoji)}
                      >
                        {emoticon.emoji}
                      </button>
                    ))}
                  </div>
                )}
              </span>

              <button
                type="button"
                className="msn-compose-tool msn-compose-tool--active"
                disabled
                aria-label={t.msn.tools.voiceClip}
                title={t.msn.toolbar.comingSoon}
              >
                <VoiceClipMiniIcon /> <span className="msn-compose-tool-label">{t.msn.tools.voiceClip}</span> <span className="msn-compose-tool-caret" role="presentation">▾</span>
              </button>

              <span className="msn-tool-wrap">
                <button
                  type="button"
                  className="msn-compose-tool msn-compose-tool--active"
                  aria-label={t.msn.tools.winks}
                  aria-expanded={openMenu === 'wink'}
                  title={t.msn.tools.winks}
                  onClick={() => toggleMenu('wink')}
                >
                  <WinkSmileyIcon /> <span className="msn-compose-tool-caret" role="presentation">▾</span>
                </button>
                {openMenu === 'wink' && (
                  <div className="msn-menu msn-menu--list" role="menu">
                    {WINKS.map((wink) => (
                      <button key={wink.id} type="button" role="menuitem" onClick={() => handleWink(wink.id)}>
                        <span aria-hidden="true">{wink.emoji}</span> {wink.label[language]}
                      </button>
                    ))}
                  </div>
                )}
              </span>

              <span className="msn-tool-wrap">
                <button
                  type="button"
                  className="msn-compose-tool msn-compose-tool--active"
                  aria-label={t.msn.tools.backgrounds}
                  aria-expanded={openMenu === 'background'}
                  title={t.msn.tools.backgrounds}
                  onClick={() => toggleMenu('background')}
                >
                  <BackgroundMiniIcon /> <span className="msn-compose-tool-caret" role="presentation">▾</span>
                </button>
                {openMenu === 'background' && (
                  <div className="msn-menu msn-menu--list" role="menu">
                    {BACKGROUNDS.map((background) => (
                      <button
                        key={background.id}
                        type="button"
                        role="menuitemradio"
                        aria-checked={backgroundId === background.id}
                        onClick={() => {
                          setBackgroundId(background.id);
                          setOpenMenu(null);
                        }}
                      >
                        <span className="msn-menu-bg-swatch" style={{ background: background.css }} aria-hidden="true" /> {background.label[language]}
                      </button>
                    ))}
                  </div>
                )}
              </span>

              <button
                type="button"
                className="msn-compose-tool msn-compose-tool--active"
                aria-label={compose.gift}
                title={compose.gift}
                onClick={() => insertAtCursor('🎁')}
              >
                <GiftMiniIcon /> <span className="msn-compose-tool-caret" role="presentation">▾</span>
              </button>

              <button
                type="button"
                className="msn-compose-tool msn-compose-tool--active"
                aria-label={t.msn.nudge}
                title={t.msn.nudge}
                onClick={handleNudge}
              >
                <ParenSmileyMiniIcon /> <span className="msn-compose-tool-caret" role="presentation">▾</span>
              </button>
            </div>

            <form className="msn-compose-row" onSubmit={handleSend}>
              <textarea
                ref={textareaRef}
                rows={2}
                placeholder={t.msn.inputPlaceholder}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleDraftKeyDown}
                onFocus={() => setOpenMenu(null)}
                style={formatToStyle(format)}
              />
              <div className="msn-compose-buttons">
                <button type="submit" disabled={isTyping}>{t.msn.send}</button>
                <button type="button" disabled title={t.msn.toolbar.comingSoon}>{t.msn.search}</button>
              </div>
            </form>

            <div className="msn-toolbar-row">
              <span className="msn-toolbar-row-right">
                <button
                  type="button"
                  className="msn-compose-tool msn-compose-tool--active"
                  disabled
                  aria-label={t.msn.toolbar.comingSoon}
                  title={t.msn.toolbar.comingSoon}
                >
                  <PenMiniIcon />
                </button>
                <button
                  type="button"
                  className="msn-compose-tool msn-compose-tool--active"
                  aria-label={t.msn.tools.font}
                  aria-expanded={openMenu === 'font'}
                  title={t.msn.tools.font}
                  onClick={() => toggleMenu('font')}
                >
                  <strong>A</strong>
                </button>
              </span>
            </div>
          </div>
        </div>

        <AvatarFrame src="/assets/images/icons/image.png" alt={t.msn.you} />
      </div>

      <div className="msn-status-bar">
        {formatLastMessageAt(lastMessageAt, t.locale, t.msn.lastMessage)}
      </div>
    </div>
  );
};

export default AIAssistant;