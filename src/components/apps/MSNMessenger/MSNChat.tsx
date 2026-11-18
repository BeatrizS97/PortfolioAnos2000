// src/components/apps/MSNMessenger/MSNChat.tsx
import React, { useEffect } from 'react';
import { useSound } from '../../../hooks/useSound';
import { shakeScreen } from '../../../utils/animations';
import { SOUND_PATHS } from '../../../utils/constants';
import { normalizeText } from '../../../utils/msnHelpers';
import { useLanguage } from '../../../hooks/useLanguage';
import { useWindowManager } from '../../../hooks/useWindowManager';
import AIAssistant from './AIAssistant';
import { 
  InviteIcon, SendFileIcon, WebcamIcon, 
  AudioIcon, ActivitiesIcon, GamesIcon 
} from './MSNIcons';

// Componente que representa a janela de chat do MSN Messenger, com a barra de ferramentas e o assistente virtual.
// O "index" é a posição da letra sublinhada (tecla de atalho); sem ele, sublinha a primeira letra.
const MnemonicLabel: React.FC<{ text: string; index?: number }> = ({ text, index = 0 }) => (
  <span>
    {text.slice(0, index)}
    <span style={{ textDecoration: 'underline' }}>{text.charAt(index)}</span>
    {text.slice(index + 1)}
  </span>
);

// Para cada rótulo, escolhe a primeira letra que ainda não foi usada por outro rótulo (assim nenhuma tecla de atalho se repete).
function pickMnemonicIndexes(labels: string[]): number[] {
  const used = new Set<string>();
  return labels.map((label) => {
    let index = label.split('').findIndex((char) => /\p{L}/u.test(char) && !used.has(normalizeText(char)));
    if (index === -1) index = 0;
    used.add(normalizeText(label.charAt(index)));
    return index;
  });
}

// Os itens da barra de menu decorativa do topo da janela (como no MSN 7.0: File, Edit, Actions, Tools, Help) vêm de t.msn.menu,
// no idioma atual. Não têm função, só estética.

// Componente principal da janela de chat do MSN Messenger, incluindo a barra de ferramentas e o assistente virtual.
const MSNChat: React.FC = () => {
  // Hooks personalizados para gerenciar sons e idioma.
  const { playSound } = useSound();
  const { t } = useLanguage();
  const { openWindow, focusWindow, windows } = useWindowManager();
  const toolbar = t.msn.toolbar;
  // Letra sublinhada de cada rótulo da barra de ícones (na ordem em que aparecem).
  const mnemonic = pickMnemonicIndexes([
    toolbar.invite,
    toolbar.sendFile,
    toolbar.webcam,
    toolbar.audio,
    t.msn.viewProjects,
    toolbar.games,
  ]);

  // Clique em "Ver Projetos": se a janela do Orkut já está aberta, foca nela; senão abre uma nova.
  const handleShowProjects = () => {
    const orkutWindow = windows.find((w) => w.type === 'orkut');
    if (orkutWindow) {
      focusWindow(orkutWindow.id);
    } else {
      openWindow('orkut');
    }
  };

  // Efeito colateral que toca o som de notificação do MSN e aplica a animação de sacudir a tela quando o componente é montado.
  useEffect(() => {
    playSound(SOUND_PATHS.msnNotification);
    shakeScreen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="msn-classic">
      <div>
        <div className="msn-menubar" aria-hidden="true">
          {t.msn.menu.map((item) => (
            <span key={item}><MnemonicLabel text={item} /></span>
          ))}
        </div>
        <div className="msn-classic-toolbar">
          <button disabled title={toolbar.comingSoon}><InviteIcon /><MnemonicLabel text={toolbar.invite} index={mnemonic[0]} /></button>
          <button disabled title={toolbar.comingSoon}><SendFileIcon /><MnemonicLabel text={toolbar.sendFile} index={mnemonic[1]} /></button>
          <button disabled title={toolbar.comingSoon}><WebcamIcon /><MnemonicLabel text={toolbar.webcam} index={mnemonic[2]} /></button>
          <button disabled title={toolbar.comingSoon}><AudioIcon /><MnemonicLabel text={toolbar.audio} index={mnemonic[3]} /></button>
          <button type="button" title={t.msn.viewProjects} onClick={handleShowProjects}><ActivitiesIcon /><MnemonicLabel text={t.msn.viewProjects} index={mnemonic[4]} /></button>
          <button disabled title={toolbar.comingSoon}><GamesIcon /><MnemonicLabel text={toolbar.games} index={mnemonic[5]} /></button>
          <div className="msn-brand" aria-hidden="true">
            <img src="/assets/images/msn-icon.png" alt="" width={46} height={46} />
          </div>
        </div>
      </div>

      <div className="msn-classic-body">
        <AIAssistant />
      </div>
    </div>
  );
};

export default MSNChat;