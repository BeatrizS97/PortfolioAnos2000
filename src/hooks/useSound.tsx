// src/hooks/useSound.tsx
import React, { createContext, useCallback, useContext } from 'react';
import { useLocalStorage } from './useLocalStorage';

// Um único elemento Audio por arquivo de som, reaproveitado a cada reprodução (evita criar objetos novos o tempo todo).
const audioCache = new Map<string, HTMLAudioElement>();

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

// Contexto do "mudo": o estado fica num único lugar (o SoundProvider), então silenciar na Taskbar vale também para o MSN e para o boot.
// (Antes cada useSound() tinha o seu próprio estado e eles não se sincronizavam.)
interface SoundContextType {
  muted: boolean;
  setMuted: (next: boolean | ((prev: boolean) => boolean)) => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

// Provedor que guarda a preferência de "mudo" (salva no localStorage) e a entrega a todos os useSound() do app.
export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [muted, setMuted] = useLocalStorage<boolean>('portfolio:muted', false, isBoolean);

  return <SoundContext.Provider value={{ muted, setMuted }}>{children}</SoundContext.Provider>;
};

// Toca efeitos sonoros retrô, respeitando a preferência de "mudo" do usuário. 
// playSound devolve true quando o som realmente começou e false quando não tocou (mudo ou autoplay bloqueado pelo navegador).
export function useSound() {
  const context = useContext(SoundContext);
  if (!context) throw new Error('useSound deve ser usado dentro de um SoundProvider');
  const { muted, setMuted } = context;

  const playSound = useCallback(
    async (src: string): Promise<boolean> => {
      if (muted) return false;
      try {
        let audio = audioCache.get(src);
        if (!audio) {
          audio = new Audio(src);
          audioCache.set(src, audio);
        } else {
          // Se o mesmo som ainda estiver tocando, para e volta ao início antes de tocar de novo.
          audio.pause();
          audio.currentTime = 0;
        }
        // Ignora falhas (ex.: navegador bloqueando autoplay antes de interação do usuário): elas viram "false", sem erro.
        await audio.play();
        return true;
      } catch {
        // Web Audio API indisponível ou som bloqueado — degrada graciosamente sem som.
        return false;
      }
    },
    [muted]
  );

  // Para o som e volta ao início. Se o som nunca foi tocado, não faz nada.
  const stopSound = useCallback((src: string): void => {
    const audio = audioCache.get(src);
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  }, []);

  return { playSound, stopSound, muted, setMuted };
}
