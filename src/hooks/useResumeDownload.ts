// src/hooks/useResumeDownload.ts
import { useState } from 'react';
import type { MouseEvent } from 'react';
import { useLanguage } from './useLanguage';
import { RESUME_PATHS } from '../utils/constants';

// Hook que reúne o download do currículo no idioma atual. É usado no Orkut e no menu Iniciar, assim os dois funcionam igual.
export function useResumeDownload() {
  const { language, t } = useLanguage();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  const resumePath = RESUME_PATHS[language];
  // Textos do download (t.resume): baixando, nome acessível do botão e o aviso (com o texto do link) de quando o download automático falha.
  const resumeText = t.resume;

  // Baixa o currículo via fetch para poder mostrar "Baixando..." enquanto o arquivo chega.
  // Se algo falhar, abre o PDF normalmente em outra aba.
  const downloadResume = async (e?: MouseEvent) => {
    e?.preventDefault();
    if (isDownloading) return;

    setDownloadError(false);
    setIsDownloading(true);
    try {
      const response = await fetch(resumePath);
      const blob = await response.blob();
      // Na Vercel, um arquivo que não existe cai no index.html (rewrite); por isso confere se realmente é um PDF.
      if (!response.ok || !blob.type.includes('pdf')) {
        throw new Error('PDF indisponível');
      }

      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = resumePath.split('/').pop() ?? 'curriculo.pdf';
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch {
      setDownloadError(true);
    } finally {
      setIsDownloading(false);
    }
  };

  return { resumePath, resumeText, isDownloading, downloadError, downloadResume };
}