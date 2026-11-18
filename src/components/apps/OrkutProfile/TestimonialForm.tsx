// src/components/apps/OrkutProfile/TestimonialForm.tsx
import React, { useRef, useState } from 'react';
import { api, ApiError } from '../../../services/api';
import { useLanguage } from '../../../hooks/useLanguage';
import { useModalBehavior } from '../../../hooks/useModalBehavior';
import { useInsertAtCursor } from '../../../hooks/useInsertAtCursor';
import CharCounter from '../../shared/CharCounter';
import {
  TESTIMONIAL_NAME_MIN_LENGTH,
  TESTIMONIAL_NAME_MAX_LENGTH,
  TESTIMONIAL_EMAIL_MAX_LENGTH,
  TESTIMONIAL_MESSAGE_MIN_LENGTH,
  TESTIMONIAL_MESSAGE_MAX_LENGTH,
} from '../../../utils/constants';
import { formatTestimonialText } from '../../../utils/formatTestimonialText';

interface TestimonialFormProps {
  onClose: () => void;
}

// Estilo da caixa de pré-visualização (inline, no mesmo padrão dos estilos do ErrorBoundary).
const previewStyle: React.CSSProperties = {
  background: '#F0F4FA',
  border: '1px solid #D6E4F5',
  borderRadius: 3,
  padding: 8,
  fontSize: 12,
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
  maxHeight: 120,
  overflowY: 'auto',
};

const TestimonialForm: React.FC<TestimonialFormProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useLanguage();
  // Rótulos e dicas da barra de formatação (t.testimonialForm.format).
  const toolbarText = t.testimonialForm.format;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Caixa do formulário e campo "nome": o hook fecha com Escape, mantém o foco preso na caixa e leva o foco inicial ao campo nome.
  const boxRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  useModalBehavior(boxRef, onClose, nameInputRef);

  // Função que envolve o texto selecionado no textarea com os caracteres fornecidos (por exemplo, para negrito ou itálico).
  const wrapSelection = (before: string, after: string = before) => {
    const el = textareaRef.current;
    if (!el) return;
    const { selectionStart, selectionEnd, value } = el;
    const selected = value.slice(selectionStart, selectionEnd);
    const nextValue = value.slice(0, selectionStart) + before + selected + after + value.slice(selectionEnd);
    setMessage(nextValue);

    // Calcula a nova posição do cursor após a inserção do texto envolvente e mantém o foco no textarea.  
    const cursor = selectionStart + before.length + selected.length + after.length;
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(cursor, cursor);
    });
  };

  // Insere o texto fornecido no cursor atual do textarea, mantendo o foco e a posição do cursor (lógica compartilhada com o chat do MSN).
  const insertAtCursor = useInsertAtCursor(textareaRef, setMessage);

  // Atalhos de teclado da toolbar: Ctrl+B (negrito), Ctrl+I (itálico) e Ctrl+U (sublinhado). No Mac, funciona com Cmd.
  // O preventDefault evita que o navegador execute o atalho dele (ex.: Ctrl+U abrir o código-fonte).
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!e.ctrlKey && !e.metaKey) return;

    const key = e.key.toLowerCase();
    if (key === 'b') {
      e.preventDefault();
      wrapSelection('**');
    } else if (key === 'i') {
      e.preventDefault();
      wrapSelection('_');
    } else if (key === 'u') {
      e.preventDefault();
      wrapSelection('__');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Nome, e-mail e mensagem só com espaços passam pela validação do navegador (required), mas o servidor recusa.
    // Por isso confere o texto sem espaços nas pontas antes de enviar e mostra o aviso no próprio formulário.
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();
    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setErrorMessage(t.testimonialForm.requiredFields);
      setStatus('error');
      return;
    }
    if (trimmedName.length < TESTIMONIAL_NAME_MIN_LENGTH || trimmedMessage.length < TESTIMONIAL_MESSAGE_MIN_LENGTH) {
      setErrorMessage(t.testimonialForm.tooShort);
      setStatus('error');
      return;
    }

    setStatus('sending');
    try {
      await api.post('/testimonial', { name, email, message });
      setStatus('sent');
    } catch (error) {
      // Não mostra o texto vindo do servidor (ele não segue o idioma da interface): só o limite de tentativas tem mensagem própria.
      setErrorMessage(error instanceof ApiError && error.status === 429 ? t.testimonialForm.rateLimit : null);
      setStatus('error');
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={t.testimonialForm.ariaLabel}>
      <div ref={boxRef} tabIndex={-1} className={`orkut-compose-box ${status === 'sent' ? 'orkut-compose-box--sent' : ''}`}>
        <div className="orkut-compose-header">
          <span className="orkut-compose-title">{t.testimonialForm.title}</span>
          <button className="orkut-compose-close" onClick={onClose} aria-label={t.testimonialForm.close}>×</button>
        </div>

        {status === 'sent' ? (
          <>
            <div className="orkut-compose-body orkut-compose-body--sent">
              <span className="orkut-sent-icon" aria-hidden="true">✓</span>
              <p role="status">{t.testimonialForm.sent}</p>
            </div>
            <div className="orkut-compose-footer orkut-compose-footer--sent">
              <button type="button" className="orkut-post-btn" onClick={onClose}>{t.testimonialForm.closeButton}</button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="orkut-compose-body">
              <div className="orkut-compose-row">
                <span className="orkut-compose-label">{t.testimonialForm.to}</span>
                <span className="orkut-compose-to">Beatriz Silva Santos</span>
              </div>

              <input
                ref={nameInputRef}
                className="orkut-compose-input"
                placeholder={t.testimonialForm.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                minLength={TESTIMONIAL_NAME_MIN_LENGTH}
                maxLength={TESTIMONIAL_NAME_MAX_LENGTH}
                required
              />
              <CharCounter current={name.length} max={TESTIMONIAL_NAME_MAX_LENGTH} />
              <input
                className="orkut-compose-input"
                type="email"
                placeholder={t.testimonialForm.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={TESTIMONIAL_EMAIL_MAX_LENGTH}
                required
              />

              <div className="orkut-compose-toolbar" role="toolbar" aria-label={toolbarText.toolbar}>
                <button
                  type="button"
                  onClick={() => wrapSelection('**')}
                  title={toolbarText.bold}
                  aria-label={toolbarText.bold}
                  aria-keyshortcuts="Control+B"
                >
                  <strong>B</strong>
                </button>
                <button
                  type="button"
                  onClick={() => wrapSelection('_')}
                  title={toolbarText.italic}
                  aria-label={toolbarText.italic}
                  aria-keyshortcuts="Control+I"
                >
                  <em>I</em>
                </button>
                <button
                  type="button"
                  className="orkut-toolbar-u"
                  onClick={() => wrapSelection('__')}
                  title={toolbarText.underline}
                  aria-label={toolbarText.underline}
                  aria-keyshortcuts="Control+U"
                >
                  U
                </button>
                <button type="button" onClick={() => insertAtCursor('😊')} title={toolbarText.emoji} aria-label={toolbarText.insertEmoji}>😊</button>
                <button type="button" disabled title={toolbarText.comingSoon} aria-label={toolbarText.textColor}>A</button>
                <button type="button" disabled title={toolbarText.comingSoon} aria-label={toolbarText.insertImage}>🖼️</button>
                <button type="button" disabled title={toolbarText.comingSoon} aria-label={toolbarText.insertLocation}>📍</button>
              </div>

              <textarea
                ref={textareaRef}
                className="orkut-compose-textarea"
                placeholder={t.testimonialForm.messagePlaceholder}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-describedby="testimonial-shortcuts-hint"
                minLength={TESTIMONIAL_MESSAGE_MIN_LENGTH}
                maxLength={TESTIMONIAL_MESSAGE_MAX_LENGTH}
                required
              />
              <CharCounter current={message.length} max={TESTIMONIAL_MESSAGE_MAX_LENGTH} />
              <p id="testimonial-shortcuts-hint" className="orkut-compose-hint">{toolbarText.shortcutsHint}</p>

              {message.trim() && (
                <>
                  <p className="orkut-compose-hint">{toolbarText.preview}</p>
                  <div style={previewStyle}>{formatTestimonialText(message)}</div>
                </>
              )}

              {status === 'error' && (
                <p className="orkut-compose-error">{errorMessage ?? t.testimonialForm.error}</p>
              )}
            </div>

            <div className="orkut-compose-footer">
              <button type="submit" className="orkut-post-btn" disabled={status === 'sending'}>
                {status === 'sending' ? t.testimonialForm.sending : t.testimonialForm.post}
              </button>
              <button type="button" className="orkut-cancel-btn" onClick={onClose}>{t.testimonialForm.cancel}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TestimonialForm;