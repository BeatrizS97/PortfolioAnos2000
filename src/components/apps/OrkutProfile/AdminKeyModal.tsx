// src/components/apps/OrkutProfile/AdminKeyModal.tsx
import React, { useState } from 'react';
import Modal from '../../shared/Modal';
import Input from '../../shared/Input';
import Button from '../../shared/Button';
import { useLanguage } from '../../../hooks/useLanguage';
import type { Language } from '../../../types/language';

interface AdminKeyModalProps {
  /** Recebe a chave digitada. Devolve false se ela for vazia (o campo fica marcado como inválido). */
  onSubmit: (key: string) => boolean;
  /** Chamado ao cancelar, ao clicar no "×" ou ao apertar Escape. */
  onClose: () => void;
}

// Textos dos botões por idioma (o título e o rótulo do campo vêm de t.scraps).
const ADMIN_MODAL_TEXT: Record<Language, { confirm: string; cancel: string }> = {
  pt: { confirm: 'Entrar', cancel: 'Cancelar' },
  en: { confirm: 'Sign in', cancel: 'Cancel' },
  es: { confirm: 'Entrar', cancel: 'Cancelar' },
};

// Modal que pede a chave de administrador (substitui o window.prompt).
const AdminKeyModal: React.FC<AdminKeyModalProps> = ({ onSubmit, onClose }) => {
  const [value, setValue] = useState('');
  const [hasError, setHasError] = useState(false);
  const { language, t } = useLanguage();
  const text = ADMIN_MODAL_TEXT[language];

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
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
          <Button type="button" variant="secondary" onClick={onClose}>{text.cancel}</Button>
          <Button type="submit">{text.confirm}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AdminKeyModal;