// src/services/academicService.ts
import { api } from './api';
import type { EducationItem, LanguageSkill, Certification, ExperienceItem, ExchangeItem, PublicationItem } from '../types/academic';
import type { ApiResponse } from '../types/apiResponse';

// Função genérica para buscar listas acadêmicas (educação, idiomas, certificações, experiências, intercâmbio, publicações).
// Todas passam pela mesma rota, GET /api/academic?section=<nome>: o plano Hobby da Vercel aceita no máximo 12 Serverless Functions por deploy,
// então uma única função (api/academic.ts) atende todas as seções.
async function fetchAcademicList<T>(section: string, signal?: AbortSignal): Promise<T[]> {
  const response = await api.get<ApiResponse<T[]>>(`/academic?section=${section}`, signal);
  return response.data;
}

/**
 * Busca a formação acadêmica (GET /api/academic?section=education).
 * @param signal Opcional: AbortSignal para cancelar a requisição.
 * @returns Lista de formações. Se a API falhar, o erro sobe (o React Query decide se tenta de novo).
 */
export async function fetchEducation(signal?: AbortSignal): Promise<EducationItem[]> {
  return fetchAcademicList<EducationItem>('education', signal);
}

/**
 * Busca os idiomas (GET /api/academic?section=languages).
 * @param signal Opcional: AbortSignal para cancelar a requisição.
 * @returns Lista de idiomas. Se a API falhar, o erro sobe (o React Query decide se tenta de novo).
 */
export async function fetchLanguages(signal?: AbortSignal): Promise<LanguageSkill[]> {
  return fetchAcademicList<LanguageSkill>('languages', signal);
}

/**
 * Busca as certificações (GET /api/academic?section=certifications).
 * @param signal Opcional: AbortSignal para cancelar a requisição.
 * @returns Lista de certificações. Se a API falhar, o erro sobe (o React Query decide se tenta de novo).
 */
export async function fetchCertifications(signal?: AbortSignal): Promise<Certification[]> {
  return fetchAcademicList<Certification>('certifications', signal);
}

/**
 * Busca as experiências e o voluntariado (GET /api/academic?section=experience).
 * @param signal Opcional: AbortSignal para cancelar a requisição.
 * @returns Lista de experiências. Se a API falhar, o erro sobe (o React Query decide se tenta de novo).
 */
export async function fetchExperience(signal?: AbortSignal): Promise<ExperienceItem[]> {
  return fetchAcademicList<ExperienceItem>('experience', signal);
}

/**
 * Busca o intercâmbio (GET /api/academic?section=exchange).
 * @param signal Opcional: AbortSignal para cancelar a requisição.
 * @returns Lista de intercâmbios. O erro sobe (o React Query decide se tenta de novo) e uma lista vazia continua vazia.
 */
export async function fetchExchange(signal?: AbortSignal): Promise<ExchangeItem[]> {
  return fetchAcademicList<ExchangeItem>('exchange', signal);
}

/**
 * Busca as publicações científicas (GET /api/academic?section=publications).
 * @param signal Opcional: AbortSignal para cancelar a requisição.
 * @returns Lista de publicações. O erro sobe (o React Query decide se tenta de novo) e uma lista vazia continua vazia.
 */
export async function fetchPublications(signal?: AbortSignal): Promise<PublicationItem[]> {
  return fetchAcademicList<PublicationItem>('publications', signal);
}
