// src/hooks/useSound.ts
import { useCallback, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';

// Toca efeitos sonoros retrô, respeitando a preferência de "mudo" do usuário. 
export function useSound() {
  const [muted, setMuted] = useLocalStorage<boolean>('portfolio:muted', false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback(
    (src: string) => {
      if (muted) return;
      try {
        const audio = new Audio(src);
        audioRef.current = audio;
        // Ignora falhas (ex.: navegador bloqueando autoplay antes de interação do usuário).
        void audio.play().catch(() => undefined);
      } catch {
        // Web Audio API indisponível — degrada graciosamente sem som.
      }
    },
    [muted]
  );

  return { playSound, muted, setMuted };
}
