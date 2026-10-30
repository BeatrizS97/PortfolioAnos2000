// src/services/academicService.ts
import { api, isAbortError } from './api';
import type { EducationItem, LanguageSkill, Certification, ExperienceItem } from '../types/academic';
import type { ApiResponse } from '../types/apiResponse';

// Tipo do módulo de dados de exemplo (que só existe em desenvolvimento).
type AcademicMocks = typeof import('./__mocks__/academic.mocks');

// Carrega os dados de exemplo sob demanda. O import fica dentro do "if (import.meta.env.DEV)", então o Vite remove
// esse módulo do build de produção. Em produção devolve null.
async function loadAcademicMocks(): Promise<AcademicMocks | null> {
  if (import.meta.env.DEV) {
    return import('./__mocks__/academic.mocks');
  }
  return null;
}

// Busca uma lista da API. Em desenvolvimento, se a API falhar ou vier vazia, usa os dados de exemplo.
// Em produção o erro sobe (o React Query decide se tenta de novo) e uma lista vazia continua vazia.
async function fetchAcademicList<T>(
  path: string,
  pickMock: (mocks: AcademicMocks) => T[],
  signal?: AbortSignal
): Promise<T[]> {
  try {
    const response = await api.get<ApiResponse<T[]>>(path, signal);
    if (response.data.length > 0) return response.data;
  } catch (error) {
    // Requisição cancelada (componente saiu da tela): não é falha, então não usa mock.
    if (isAbortError(error)) throw error;
    if (!import.meta.env.DEV) throw error;
  }
  const mocks = await loadAcademicMocks();
  return mocks ? pickMock(mocks) : [];
}

/**
 * Busca a formação acadêmica (GET /api/education).
 * @param signal Opcional: AbortSignal para cancelar a requisição.
 * @returns Lista de formações. Em dev, usa dados de exemplo se a API falhar ou vier vazia.
 */
export async function fetchEducation(signal?: AbortSignal): Promise<EducationItem[]> {
  return fetchAcademicList<EducationItem>('/education', (mocks) => mocks.MOCK_EDUCATION, signal);
}

/**
 * Busca os idiomas (GET /api/languages).
 * @param signal Opcional: AbortSignal para cancelar a requisição.
 * @returns Lista de idiomas. Em dev, usa dados de exemplo se a API falhar ou vier vazia.
 */
export async function fetchLanguages(signal?: AbortSignal): Promise<LanguageSkill[]> {
  return fetchAcademicList<LanguageSkill>('/languages', (mocks) => mocks.MOCK_LANGUAGES, signal);
}

/**
 * Busca as certificações (GET /api/certifications).
 * @param signal Opcional: AbortSignal para cancelar a requisição.
 * @returns Lista de certificações. Em dev, usa dados de exemplo se a API falhar ou vier vazia.
 */
export async function fetchCertifications(signal?: AbortSignal): Promise<Certification[]> {
  return fetchAcademicList<Certification>('/certifications', (mocks) => mocks.MOCK_CERTIFICATIONS, signal);
}

/**
 * Busca as experiências e o voluntariado (GET /api/experience).
 * @param signal Opcional: AbortSignal para cancelar a requisição.
 * @returns Lista de experiências. Em dev, usa dados de exemplo se a API falhar ou vier vazia.
 */
export async function fetchExperience(signal?: AbortSignal): Promise<ExperienceItem[]> {
  return fetchAcademicList<ExperienceItem>('/experience', (mocks) => mocks.MOCK_EXPERIENCE, signal);
}