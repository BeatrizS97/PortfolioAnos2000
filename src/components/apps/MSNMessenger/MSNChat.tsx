// src/components/apps/MSNMessenger/MSNChat.tsx
import React, { useEffect } from 'react';
import { useSound } from '../../../hooks/useSound';
import { shakeScreen } from '../../../utils/animations';
import { SOUND_PATHS } from '../../../utils/constants';
import { useLanguage } from '../../../hooks/useLanguage';
import AIAssistant from './AIAssistant';
import { 
  InviteIcon, SendFileIcon, WebcamIcon, 
  AudioIcon, ActivitiesIcon, GamesIcon 
} from './MSNIcons';

// Componente que representa a janela de chat do MSN Messenger, com a barra de ferramentas e o assistente virtual.
const MnemonicLabel: React.FC<{ text: string }> = ({ text }) => (
  <span>
    <span style={{ textDecoration: 'underline' }}>{text.charAt(0)}</span>
    {text.slice(1)}
  </span>
);

// Componente principal da janela de chat do MSN Messenger, incluindo a barra de ferramentas e o assistente virtual.
const MSNChat: React.FC = () => {
  // Hooks personalizados para gerenciar sons e idioma.
  const { playSound } = useSound();
  const { t } = useLanguage();
  const toolbar = t.msn.toolbar;

  // Efeito colateral que toca o som de notificação do MSN e aplica a animação de sacudir a tela quando o componente é montado.
  useEffect(() => {
    playSound(SOUND_PATHS.msnNotification);
    shakeScreen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="msn-classic">
      <div className="msn-toolbar-container">
        <div className="msn-classic-toolbar">
          <button disabled title={toolbar.comingSoon}><InviteIcon /><MnemonicLabel text={toolbar.invite} /></button>
          <button disabled title={toolbar.comingSoon}><SendFileIcon /><MnemonicLabel text={toolbar.sendFile} /></button>
          <button disabled title={toolbar.comingSoon}><WebcamIcon /><MnemonicLabel text={toolbar.webcam} /></button>
          <button disabled title={toolbar.comingSoon}><AudioIcon /><MnemonicLabel text={toolbar.audio} /></button>
          <button disabled title={toolbar.comingSoon}><ActivitiesIcon /><MnemonicLabel text={toolbar.activities} /></button>
          <button disabled title={toolbar.comingSoon}><GamesIcon /><MnemonicLabel text={toolbar.games} /></button>
        </div>
      </div>

      <div className="msn-classic-body">
        <AIAssistant />
      </div>
    </div>
  );
};

export default MSNChat;