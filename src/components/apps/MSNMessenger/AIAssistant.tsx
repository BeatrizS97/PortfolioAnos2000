// src/components/apps/MSNMessenger/AIAssistant.tsx
import React, { useState } from 'react';
import { useWindowManager } from '../../../hooks/useWindowManager';
import { useSound } from '../../../hooks/useSound';
import { shakeScreen } from '../../../utils/animations';
import { SOUND_PATHS } from '../../../utils/constants';
import {
  FolderMiniIcon,
  NudgeIcon,
  LockIcon,
  SmileyIcon,
  WinkSmileyIcon,
  BackgroundMiniIcon,
  HeartEmblemIcon,
  StarEmblemIcon,
} from './MSNIcons';

interface Message { from: 'bot' | 'user' | 'system'; text: string; }

// Base de conhecimento com palavras-chave e respostas.
const KB: { keywords: string[]; answer: string }[] = [
  { keywords: ['projeto', 'projetos'], answer: 'Você pode ver todos os projetos no perfil dela — já vou te levar lá!' },
  { keywords: ['stack', 'tecnologia', 'tecnologias'], answer: 'Trabalho principalmente com React.js, Next.js, TypeScript, C# e .NET.' },
  { keywords: ['contato', 'email', 'e-mail'], answer: 'Você pode entrar em contato pelo formulário do site ou pelo LinkedIn!' },
  { keywords: ['disponível', 'disponibilidade', 'vaga'], answer: 'A Beatriz está aberta a oportunidades como Desenvolvedora Front-end/Full Stack Júnior!' },
  { keywords: ['idioma', 'idiomas', 'inglês', 'espanhol'], answer: 'Fala português nativo, inglês nível B1 e espanhol nível A2.' },
  { keywords: ['certificação', 'certificado', 'certificações'], answer: 'Tem certificações em Scrum Fundamentals, Formação Web Essencial (BIT) e Crescendo no Trabalho (JobRise), entre outras — veja na aba Perfil!' },
];

// Formata a data/hora igual ao rodapé clássico do MSN: "dd/mm/aaaa às hh:mm". 
function formatLastMessageAt(date: Date): string {
  const dateText = date.toLocaleDateString('pt-BR');
  const timeText = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `Última mensagem recebida em ${dateText} às ${timeText}.`;
}

// Componente principal do assistente virtual no estilo MSN Messenger.
const AIAssistant: React.FC = () => {
  const { openWindow, focusWindow, windows } = useWindowManager();
  const { playSound } = useSound();
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: 'Oi! Eu sou a assistente virtual da Beatriz :) Pergunte sobre projetos, tecnologias ou carreira!' },
  ]);
  // Estado para o rascunho da mensagem que o usuário está digitando e para a data/hora da última mensagem recebida. 
  const [draft, setDraft] = useState('');
  const [lastMessageAt, setLastMessageAt] = useState<Date>(() => new Date());

  // Função que lida com o envio de mensagens pelo usuário.
  // Ela normaliza a pergunta, busca uma resposta na base de conhecimento e atualiza o estado das mensagens.
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault(); // Impede o comportamento padrão do formulário (recarregar a página).
    const question = draft.trim(); // Remove espaços em branco do início e do fim da pergunta.
    if (!question) return;

    const normalized = question.toLowerCase();
    const match = KB.find((entry) => entry.keywords.some((k) => normalized.includes(k)));
    const answer = match?.answer ?? 'Não tenho essa resposta ainda — que tal usar o formulário de contato?';
    
    // Atualiza o estado das mensagens, adicionando a pergunta do usuário e a resposta do bot, e atualiza a data/hora da última mensagem recebida.
    setMessages((prev) => [...prev, { from: 'user', text: question }, { from: 'bot', text: answer }]);
    setLastMessageAt(new Date());
    setDraft('');
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
    setMessages((prev) => [...prev, { from: 'system', text: 'Você acabou de enviar um nudge!' }]);
  };

  return (
    <div className="msn-classic-chat">
      <div className="msn-row msn-row--top">
        <div className="msn-card msn-card--messages">
          <div className="msn-to-line">
            <span>Para:</span> <strong>Suporte IA Beatriz</strong>
          </div>

          <div className="msn-messages">
            <p className="msn-tip">
              <LockIcon /> Nunca informe sua senha ou dados de cartão em uma conversa.
            </p>

            {messages.map((m, i) =>
              m.from === 'system' ? (
                <p key={i} className="msn-message msn-message--system">{m.text}</p>
              ) : (
                <p key={i} className={`msn-message msn-message--${m.from}`}>
                  <strong>
                    {m.from === 'bot' ? <HeartEmblemIcon /> : <StarEmblemIcon />}{' '}
                    {m.from === 'bot' ? 'Suporte IA Beatriz diz:' : 'Você diz:'}
                  </strong>
                  <br />
                  {m.text}
                </p>
              )
            )}
          </div>
        </div>

        <div className="msn-card msn-card--avatar">
          <img src="/assets/images/icons/user.png" alt="Suporte IA Beatriz" />
        </div>
      </div>

      <div className="msn-row msn-row--bottom">
        <div className="msn-card msn-card--compose">
          <div className="msn-toolbar-row">
            <button type="button" onClick={handleShowProjects}>
              <FolderMiniIcon /> Ver Projetos
            </button>
            <span className="msn-toolbar-divider" />
            <button type="button" className="nudge-button" onClick={handleNudge}>
              <NudgeIcon /> Nudge
            </button>
          </div>

          <div className="msn-footer">
            <div className="msn-compose-toolbar" aria-hidden="true">
              <span className="msn-compose-tool" title="Fonte">
                <strong>A</strong> <span className="msn-compose-tool-caret">▾</span>
              </span>
              <span className="msn-compose-tool" title="Emoticons">
                <SmileyIcon /> <span className="msn-compose-tool-caret">▾</span>
              </span>
              <span className="msn-compose-tool" title="Winks">
                <WinkSmileyIcon /> <span className="msn-compose-tool-caret">▾</span>
              </span>
              <span className="msn-compose-tool" title="Planos de fundo">
                <BackgroundMiniIcon /> <span className="msn-compose-tool-caret">▾</span>
              </span>
            </div>

            <form className="msn-compose-row" onSubmit={handleSend}>
              <input
                type="text"
                placeholder="Digite uma pergunta..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <button type="submit">Enviar</button>
            </form>

            <div className="msn-status-bar">
              {formatLastMessageAt(lastMessageAt)}
            </div>
          </div>
        </div>

        <div className="msn-card msn-card--avatar">
          <img src="/assets/images/icons/user-placeholder.png" alt="Você" />
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;