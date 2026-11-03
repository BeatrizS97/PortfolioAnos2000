// src/components/apps/OrkutProfile/TestimonialForm.tsx
import React, { useRef, useState } from 'react';
import { api, ApiError } from '../../../services/api';
import { useLanguage } from '../../../hooks/useLanguage';
import type { Language } from '../../../types/language';

interface TestimonialFormProps {
  onClose: () => void;
}

// Textos da barra de formatação (rótulos e dicas), por idioma.
const TOOLBAR_TEXT: Record<
  Language,
  {
    toolbar: string;
    bold: string;
    italic: string;
    underline: string;
    emoji: string;
    insertEmoji: string;
    comingSoon: string;
    textColor: string;
    insertImage: string;
    insertLocation: string;
    shortcutsHint: string;
  }
> = {
  pt: {
    toolbar: 'Formatação do texto',
    bold: 'Negrito (Ctrl+B)',
    italic: 'Itálico (Ctrl+I)',
    underline: 'Sublinhado (Ctrl+U)',
    emoji: 'Emoji',
    insertEmoji: 'Inserir emoji',
    comingSoon: 'Em breve',
    textColor: 'Cor do texto (em breve)',
    insertImage: 'Inserir imagem (em breve)',
    insertLocation: 'Inserir localização (em breve)',
    shortcutsHint: 'Atalhos: Ctrl+B negrito, Ctrl+I itálico, Ctrl+U sublinhado.',
  },
  en: {
    toolbar: 'Text formatting',
    bold: 'Bold (Ctrl+B)',
    italic: 'Italic (Ctrl+I)',
    underline: 'Underline (Ctrl+U)',
    emoji: 'Emoji',
    insertEmoji: 'Insert emoji',
    comingSoon: 'Coming soon',
    textColor: 'Text color (coming soon)',
    insertImage: 'Insert image (coming soon)',
    insertLocation: 'Insert location (coming soon)',
    shortcutsHint: 'Shortcuts: Ctrl+B bold, Ctrl+I italic, Ctrl+U underline.',
  },
  es: {
    toolbar: 'Formato del texto',
    bold: 'Negrita (Ctrl+B)',
    italic: 'Cursiva (Ctrl+I)',
    underline: 'Subrayado (Ctrl+U)',
    emoji: 'Emoji',
    insertEmoji: 'Insertar emoji',
    comingSoon: 'Próximamente',
    textColor: 'Color del texto (próximamente)',
    insertImage: 'Insertar imagen (próximamente)',
    insertLocation: 'Insertar ubicación (próximamente)',
    shortcutsHint: 'Atajos: Ctrl+B negrita, Ctrl+I cursiva, Ctrl+U subrayado.',
  },
};

const TestimonialForm: React.FC<TestimonialFormProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { language, t } = useLanguage();
  const toolbarText = TOOLBAR_TEXT[language];
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Função que insere o texto fornecido no cursor atual do textarea, mantendo o foco e a posição do cursor.
  const insertAtCursor = (text: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const { selectionStart, selectionEnd, value } = el;
    const nextValue = value.slice(0, selectionStart) + text + value.slice(selectionEnd);
    setMessage(nextValue);

    // Calcula a nova posição do cursor após a inserção do texto e mantém o foco no textarea.
    const cursor = selectionStart + text.length;
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(cursor, cursor);
    });
  };

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
    setStatus('sending');
    try {
      await api.post('/testimonial', { name, email, message });
      setStatus('sent');
    } catch (error) {
      setErrorMessage(error instanceof ApiError ? error.message : null);
      setStatus('error');
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={t.testimonialForm.ariaLabel}>
      <div className={`orkut-compose-box ${status === 'sent' ? 'orkut-compose-box--sent' : ''}`}>
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
                className="orkut-compose-input"
                placeholder={t.testimonialForm.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                className="orkut-compose-input"
                type="email"
                placeholder={t.testimonialForm.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                required
              />
              <p id="testimonial-shortcuts-hint" className="orkut-compose-hint">{toolbarText.shortcutsHint}</p>

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