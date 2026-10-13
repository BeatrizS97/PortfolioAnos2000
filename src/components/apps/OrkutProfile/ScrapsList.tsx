// src/components/apps/OrkutProfile/ScrapsList.tsx
import React, { useRef, useState } from 'react';
import type { Scrap } from '../../../types/scrap';
import { postScrap, deleteScrap } from '../../../services/scrapsService';
import { ApiError } from '../../../services/api';
import { useLanguage } from '../../../hooks/useLanguage';

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sendingRef.current) return;
    if (!message.trim() || !authorName.trim()) return;

    sendingRef.current = true;
    setSending(true);
    setErrorMessage(null);
    try {
      await postScrap({ authorName, message });
      setMessage('');
      onPosted();
    } catch (error) {
      setErrorMessage(error instanceof ApiError ? error.message : t.scraps.saveError);
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!adminKey) return;
    if (!window.confirm(t.scraps.deleteConfirm)) return;

    setDeletingId(id);
    try {
      await deleteScrap(id, adminKey);
      onDeleted();
    } catch {
      window.alert(t.scraps.deleteError);
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
                  onClick={() => handleDelete(scrap.id)}
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
        />
        <textarea
          placeholder={t.scraps.messagePlaceholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        {errorMessage && <p className="orkut-compose-error">{errorMessage}</p>}
        <button type="submit" disabled={sending}>
          {sending ? t.scraps.sending : t.scraps.send}
        </button>
      </form>
    </div>
  );
};

export default ScrapsList;