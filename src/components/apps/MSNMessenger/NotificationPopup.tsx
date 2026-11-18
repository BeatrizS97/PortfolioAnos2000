// src/components/apps/MSNMessenger/NotificationPopup.tsx
import React, { useEffect } from 'react';
import { shakeScreen } from '../../../utils/animations';
import { useLanguage } from '../../../hooks/useLanguage';

// Componente que representa o popup de notificação do MSN Messenger, exibido quando um contato envia uma mensagem.
interface NotificationPopupProps {
  contactName: string;
  onOpen: () => void;
  onDismiss: () => void;
}

// Componente que representa o popup de notificação do MSN Messenger, exibido quando um contato envia uma mensagem.
const NotificationPopup: React.FC<NotificationPopupProps> = ({ contactName, onOpen, onDismiss }) => {
  const { t } = useLanguage();

  // Efeito colateral que aplica a animação de sacudir a tela quando o componente é montado.
  useEffect(() => {
    shakeScreen(500);
  }, []);

  return (
    <div className="wlm-toast" role="alert">
      <div className="wlm-toast-header">
        <span className="wlm-toast-app-icon" aria-hidden="true">
          <img src="/assets/images/msn-icon.png" alt="" width={16} height={16} />
        </span>
        <span>Windows Live Messenger</span>
        <button aria-label={t.msn.notification.close} onClick={onDismiss}>×</button>
      </div>

      <button className="wlm-toast-body" onClick={onOpen}>
        <img
          src="/assets/images/icons/user.png"
          alt={contactName}
          width={64}
          height={64}
          decoding="async"
        />
        <span className="wlm-toast-text">
          <strong>{contactName}</strong>
          <span>{t.msn.notification.text}</span>
        </span>
      </button>

      <div className="wlm-toast-footer">
        <span>{t.msn.notification.options}</span>
      </div>
    </div>
  );
};

export default NotificationPopup;