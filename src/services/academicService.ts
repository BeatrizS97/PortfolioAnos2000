// src/services/academicService.ts
import { api } from './api';
import type { EducationItem, LanguageSkill, Certification, ExperienceItem, PublicationItem } from '../types/academic';
import type { ApiResponse } from '../types/apiResponse';

// Função genérica para buscar listas acadêmicas (educação, idiomas, certificações, experiências, publicações).
async function fetchAcademicList<T>(path: string, signal?: AbortSignal): Promise<T[]> {
  const response = await api.get<ApiResponse<T[]>>(path, signal);
  return response.data;
}

/**
 * Busca a formação acadêmica (GET /api/education).
 * @param signal Opcional: AbortSignal para cancelar a requisição.
 * @returns Lista de formações. Em dev, usa dados de exemplo se a API falhar ou vier vazia.
 */
export async function fetchEducation(signal?: AbortSignal): Promise<EducationItem[]> {
  return fetchAcademicList<EducationItem>('/education', signal);
}

/**
 * Busca os idiomas (GET /api/languages).
 * @param signal Opcional: AbortSignal para cancelar a requisição.
 * @returns Lista de idiomas. Em dev, usa dados de exemplo se a API falhar ou vier vazia.
 */
export async function fetchLanguages(signal?: AbortSignal): Promise<LanguageSkill[]> {
  return fetchAcademicList<LanguageSkill>('/languages', signal);
}

/**
 * Busca as certificações (GET /api/certifications).
 * @param signal Opcional: AbortSignal para cancelar a requisição.
 * @returns Lista de certificações. Em dev, usa dados de exemplo se a API falhar ou vier vazia.
 */
export async function fetchCertifications(signal?: AbortSignal): Promise<Certification[]> {
  return fetchAcademicList<Certification>('/certifications', signal);
}

/**
 * Busca as experiências e o voluntariado (GET /api/experience).
 * @param signal Opcional: AbortSignal para cancelar a requisição.
 * @returns Lista de experiências. Em dev, usa dados de exemplo se a API falhar ou vier vazia.
 */
export async function fetchExperience(signal?: AbortSignal): Promise<ExperienceItem[]> {
  return fetchAcademicList<ExperienceItem>('/experience', signal);
}

/**
 * Busca as publicações científicas (GET /api/publications).
 * @param signal Opcional: AbortSignal para cancelar a requisição.
 * @returns Lista de publicações. O erro sobe (o React Query decide se tenta de novo) e uma lista vazia continua vazia.
 */
export async function fetchPublications(signal?: AbortSignal): Promise<PublicationItem[]> {
  return fetchAcademicList<PublicationItem>('/publications', signal);
}