// src/components/apps/OrkutProfile/ScrapsList.tsx
import React, { useRef, useState } from 'react';
import type { Scrap } from '../../../types/scrap';
import { postScrap, deleteScrap } from '../../../services/scrapsService';
import { ApiError } from '../../../services/api';
import { useLanguage } from '../../../hooks/useLanguage';
import RetroDialog from '../../shared/RetroDialog';
import CharCounter from '../../shared/CharCounter';
import ScrapFeedbackModal from './ScrapFeedbackModal';
import { SCRAP_AUTHOR_NAME_MAX_LENGTH, SCRAP_MESSAGE_MAX_LENGTH } from '../../../utils/constants';

interface ScrapsListProps {
  scraps: Scrap[];
  loading: boolean;
  page: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
  isAdmin: boolean;
  adminKey: string | null;
  onPosted: () => void;
  onDeleted: () => void;
}

const ScrapsList: React.FC<ScrapsListProps> = ({
  scraps,
  loading,
  page,
  hasMore,
  onPageChange,
  isAdmin,
  adminKey,
  onPosted,
  onDeleted,
}) => {
  const [message, setMessage] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [sending, setSending] = useState(false);
  // Trava síncrona contra envio duplo: o estado "sending" só muda no próximo render, então dois submits quase simultâneos passariam por ele.
  const sendingRef = useRef(false);
  // Modal de resultado do envio (sucesso ou erro), no mesmo estilo do modal de depoimento. null = modal fechado.
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // Id do recado que está esperando confirmação (null = diálogo de confirmação fechado).
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  // Mostra o diálogo de erro quando a exclusão falha.
  const [showDeleteError, setShowDeleteError] = useState(false);
  // Os botões dos diálogos de exclusão (Sim, Não, OK) vêm de t.dialog; o título e as mensagens vêm de t.scraps.
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sendingRef.current) return;
    // Campo obrigatório vazio: avisa a pessoa com o modal de erro em vez de ignorar o envio em silêncio.
    if (!message.trim() || !authorName.trim()) {
      setFeedback({ type: 'error', message: t.scraps.requiredFields });
      return;
    }

    sendingRef.current = true;
    setSending(true);
    try {
      await postScrap({ authorName, message });
      setMessage('');
      // Limpa também o nome depois de enviar (antes ele ficava preenchido).
      setAuthorName('');
      onPosted();
      setFeedback({ type: 'success', message: t.scraps.sent });
    } catch (error) {
      // Não mostra o texto vindo do servidor (ele não segue o idioma da interface): só o limite de tentativas tem mensagem própria.
      setFeedback({
        type: 'error',
        message: error instanceof ApiError && error.status === 429 ? t.scraps.rateLimit : t.scraps.saveError,
      });
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  };

  // Depois que a pessoa confirma no diálogo, exclui o recado. Se falhar, abre o diálogo de erro.
  const handleConfirmDelete = async () => {
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    if (!id || !adminKey) return;

    setDeletingId(id);
    try {
      await deleteScrap(id, adminKey);
      onDeleted();
    } catch {
      setShowDeleteError(true);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="scraps-list">
      {loading ? (
        <div className="loading-spinner">{t.orkut.loading}</div>
      ) : (
        <ul>
          {scraps.map((scrap) => (
            <li key={scrap.id} className="scrap-item">
              {scrap.author_avatar && <img src={scrap.author_avatar} alt={scrap.author_name} />}
              <div className="scrap-item-body">
                <strong>{scrap.author_name}</strong>
                <p>{scrap.message}</p>
              </div>
              {isAdmin && (
                <button
                  type="button"
                  className="scrap-delete-btn"
                  onClick={() => setConfirmDeleteId(scrap.id)}
                  disabled={deletingId === scrap.id}
                  aria-label={t.scraps.deleteLabel}
                  title={t.scraps.deleteLabel}
                >
                  🗑
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {(page > 1 || hasMore) && (
        <div className="scraps-pagination">
          <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
            « {t.scraps.prevPage}
          </button>
          <span className="scraps-pagination-page">{page}</span>
          <button type="button" onClick={() => onPageChange(page + 1)} disabled={!hasMore}>
            {t.scraps.nextPage} »
          </button>
        </div>
      )}

      <form className="scrap-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={t.scraps.namePlaceholder}
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          maxLength={SCRAP_AUTHOR_NAME_MAX_LENGTH}
        />
        <CharCounter current={authorName.length} max={SCRAP_AUTHOR_NAME_MAX_LENGTH} />
        <textarea
          placeholder={t.scraps.messagePlaceholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={SCRAP_MESSAGE_MAX_LENGTH}
        />
        <CharCounter current={message.length} max={SCRAP_MESSAGE_MAX_LENGTH} />
        <button type="submit" disabled={sending}>
          {sending ? t.scraps.sending : t.scraps.send}
        </button>
      </form>

      {confirmDeleteId && (
        <RetroDialog
          title={t.scraps.deleteLabel}
          compact
          buttonLabel={t.dialog.yes}
          onConfirm={handleConfirmDelete}
          onClose={() => setConfirmDeleteId(null)}
          cancelLabel={t.dialog.no}
          onCancel={() => setConfirmDeleteId(null)}
        >
          <p>{t.scraps.deleteConfirm}</p>
        </RetroDialog>
      )}

      {feedback && (
        <ScrapFeedbackModal type={feedback.type} message={feedback.message} onClose={() => setFeedback(null)} />
      )}

      {showDeleteError && (
        <RetroDialog
          title={t.scraps.deleteLabel}
          compact
          buttonLabel={t.dialog.ok}
          onConfirm={() => setShowDeleteError(false)}
          onClose={() => setShowDeleteError(false)}
        >
          <p>{t.scraps.deleteError}</p>
        </RetroDialog>
      )}
    </div>
  );
};

export default ScrapsList;