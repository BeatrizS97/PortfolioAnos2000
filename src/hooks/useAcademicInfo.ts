// src/hooks/useAcademicInfo.ts
import { useQuery } from '@tanstack/react-query';
import { fetchEducation, fetchLanguages, fetchCertifications, fetchExperience, fetchExchange, fetchPublications } from '../services/academicService';

// Tentativas extras quando a busca falha: mais insistente para o que é central no perfil (formação, experiência)
// e nenhuma para certificações, que são complementares e podem falhar em silêncio.
const RETRY_CRITICAL = 1;
const RETRY_SILENT = 0;

// Hook para buscar informações acadêmicas (educação, habilidades linguísticas, certificações e experiência) usando React Query.
// O "signal" do React Query cancela a requisição quando o componente sai da tela.
export function useEducation() {
  return useQuery({
    queryKey: ['education'],
    queryFn: ({ signal }) => fetchEducation(signal),
    retry: RETRY_CRITICAL,
  });
}

// Nome diferente de useLanguage (hook de idioma da UI) para não colidir.
export function useLanguageSkills() {
  return useQuery({
    queryKey: ['languageSkills'],
    queryFn: ({ signal }) => fetchLanguages(signal),
  });
}

// Hook para buscar certificações acadêmicas usando React Query.
export function useCertifications() {
  return useQuery({
    queryKey: ['certifications'],
    queryFn: ({ signal }) => fetchCertifications(signal),
    retry: RETRY_SILENT,
  });
}

// Hook para buscar experiência acadêmica usando React Query.
export function useExperience() {
  return useQuery({
    queryKey: ['experience'],
    queryFn: ({ signal }) => fetchExperience(signal),
    retry: RETRY_CRITICAL,
  });
}

// Hook para buscar o intercâmbio usando React Query.
// É complementar (como as certificações), então não tenta de novo em silêncio.
export function useExchange() {
  return useQuery({
    queryKey: ['exchange'],
    queryFn: ({ signal }) => fetchExchange(signal),
    retry: RETRY_SILENT,
  });
}

// Hook para buscar as publicações científicas usando React Query.
// É complementar (como as certificações), então não tenta de novo em silêncio.
export function usePublications() {
  return useQuery({
    queryKey: ['publications'],
    queryFn: ({ signal }) => fetchPublications(signal),
    retry: RETRY_SILENT,
  });
}
