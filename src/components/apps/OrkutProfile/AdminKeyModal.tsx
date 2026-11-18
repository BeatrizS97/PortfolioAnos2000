// src/components/apps/OrkutProfile/AdminKeyModal.tsx
import React, { useState } from 'react';
import Modal from '../../shared/Modal';
import Input from '../../shared/Input';
import Button from '../../shared/Button';
import { useLanguage } from '../../../hooks/useLanguage';

interface AdminKeyModalProps {
  /** Recebe a chave digitada. Devolve false se ela for vazia (o campo fica marcado como inválido). */
  onSubmit: (key: string) => boolean;
  /** Chamado ao cancelar, ao clicar no "×" ou ao apertar Escape. */
  onClose: () => void;
}

// Modal que pede a chave de administrador (substitui o window.prompt).
const AdminKeyModal: React.FC<AdminKeyModalProps> = ({ onSubmit, onClose }) => {
  const [value, setValue] = useState('');
  const [hasError, setHasError] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasError(!onSubmit(value));
  };

  return (
    <Modal title={t.scraps.adminLoginLabel} onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label htmlFor="admin-key-input">{t.scraps.adminPromptLabel}</label>
        <Input
          id="admin-key-input"
          type="password"
          autoComplete="off"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          hasError={hasError}
        />
        {hasError && (
          <p role="alert" style={{ margin: 0, color: 'crimson', fontSize: 11 }}>{t.scraps.adminKeyRequired}</p>
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
          <Button type="button" variant="secondary" onClick={onClose}>{t.scraps.adminCancel}</Button>
          <Button type="submit">{t.scraps.adminConfirm}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AdminKeyModal;