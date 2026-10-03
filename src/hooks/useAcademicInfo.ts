// src/hooks/useAcademicInfo.ts
import { useQuery } from '@tanstack/react-query';
import { fetchEducation, fetchLanguages, fetchCertifications, fetchExperience } from '../services/academicService';

// Hook para buscar informações acadêmicas (educação, habilidades linguísticas, certificações e experiência) usando React Query.
export function useEducation() {
  return useQuery({
    queryKey: ['education'],
    queryFn: fetchEducation,
    staleTime: 5 * 60 * 1000,
  });
}

// Nome diferente de useLanguage (hook de idioma da UI) para não colidir.
export function useLanguageSkills() {
  return useQuery({
    queryKey: ['languageSkills'],
    queryFn: fetchLanguages,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para buscar certificações acadêmicas usando React Query.
export function useCertifications() {
  return useQuery({
    queryKey: ['certifications'],
    queryFn: fetchCertifications,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para buscar experiência acadêmica usando React Query.
export function useExperience() {
  return useQuery({
    queryKey: ['experience'],
    queryFn: fetchExperience,
    staleTime: 5 * 60 * 1000,
  });
}