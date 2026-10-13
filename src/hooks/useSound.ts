// src/hooks/useSound.ts
import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

// Um único elemento Audio por arquivo de som, reaproveitado a cada reprodução (evita criar objetos novos o tempo todo).
const audioCache = new Map<string, HTMLAudioElement>();

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

// Toca efeitos sonoros retrô, respeitando a preferência de "mudo" do usuário. 
export function useSound() {
  const [muted, setMuted] = useLocalStorage<boolean>('portfolio:muted', false, isBoolean);

  const playSound = useCallback(
    (src: string) => {
      if (muted) return;
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