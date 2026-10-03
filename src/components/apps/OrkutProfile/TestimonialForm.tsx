// src/components/apps/OrkutProfile/TestimonialForm.tsx
import React, { useRef, useState } from 'react';
import { api, ApiError } from '../../../services/api';
import { useLanguage } from '../../../hooks/useLanguage';

interface TestimonialFormProps {
  onClose: () => void;
}

const TestimonialForm: React.FC<TestimonialFormProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useLanguage();
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
      <div className="orkut-compose-box">
        <div className="orkut-compose-header">
          <span className="orkut-compose-title">{t.testimonialForm.title}</span>
          <button className="orkut-compose-close" onClick={onClose} aria-label={t.testimonialForm.close}>×</button>
        </div>

        {status === 'sent' ? (
          <div className="orkut-compose-body">
            <p>{t.testimonialForm.sent}</p>
            <div className="orkut-compose-footer">
              <button type="button" className="orkut-cancel-btn" onClick={onClose}>{t.testimonialForm.closeButton}</button>
            </div>
          </div>
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

              <div className="orkut-compose-toolbar">
                <button type="button" onClick={() => wrapSelection('**')} title="Negrito">
                  <strong>B</strong>
                </button>
                <button type="button" onClick={() => wrapSelection('_')} title="Itálico">
                  <em>I</em>
                </button>
                <button
                  type="button"
                  className="orkut-toolbar-u"
                  onClick={() => wrapSelection('__')}
                  title="Sublinhado"
                >
                  U
                </button>
                <button type="button" onClick={() => insertAtCursor('😊')} title="Emoji">😊</button>
                <button type="button" disabled title="Em breve">A</button>
                <button type="button" disabled title="Em breve">🖼️</button>
                <button type="button" disabled title="Em breve">📍</button>
              </div>

              <textarea
                ref={textareaRef}
                className="orkut-compose-textarea"
                placeholder={t.testimonialForm.messagePlaceholder}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />

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