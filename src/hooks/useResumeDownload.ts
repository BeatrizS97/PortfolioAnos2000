// src/hooks/useResumeDownload.ts
import { useState } from 'react';
import type { MouseEvent } from 'react';
import type { Language } from '../types/language';
import { useLanguage } from './useLanguage';
import { RESUME_PATHS } from '../utils/constants';

// Textos do download do currículo por idioma (o nome do idioma aparece no próprio idioma).
// Error e openLink são o aviso (e o texto do link) mostrados quando o download automático falha.
export const RESUME_TEXT: Record<Language, { downloading: string; ariaLabel: string; error: string; openLink: string }> = {
  pt: {
    downloading: 'Baixando...',
    ariaLabel: 'Baixar currículo em Português (PDF)',
    error: 'Não foi possível baixar o PDF automaticamente.',
    openLink: 'Abrir o PDF',
  },
  en: {
    downloading: 'Downloading...',
    ariaLabel: 'Download resume in English (PDF)',
    error: "Couldn't download the PDF automatically.",
    openLink: 'Open the PDF',
  },
  es: {
    downloading: 'Descargando...',
    ariaLabel: 'Descargar currículum en Español (PDF)',
    error: 'No se pudo descargar el PDF automáticamente.',
    openLink: 'Abrir el PDF',
  },
};

// Hook que reúne o download do currículo no idioma atual. É usado no Orkut e no menu Iniciar, assim os dois funcionam igual.
export function useResumeDownload() {
  const { language } = useLanguage();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  const resumePath = RESUME_PATHS[language];
  const resumeText = RESUME_TEXT[language];

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