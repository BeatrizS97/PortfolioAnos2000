// src/types/index.ts
// Barrel export: permite importar qualquer tipo de um lugar só, por exemplo import type { Project } from '@/types'.
// O alias "@/types" já funciona pelo "@/*" do tsconfig.json e do vite.config.ts.
export type {
  EducationItem,
  LanguageSkill,
  Certification,
  ExperienceItem,
  PublicationItem,
} from './academic';
export type { ApiResponse } from './apiResponse';
export type { ChatRole, ChatMessage, MsnContactMode, MsnContactStatus, MsnContact } from './chat';
export type { CommunityCategory, Community } from './community';
export type { Friend } from './friend';
export { LANGUAGES, isLanguage } from './language';
export type { Language } from './language';
export type { ProfileData } from './profile';
export { projectSchema } from './project';
export type { Project, ProjectFilters, ProjectsApiResponse } from './project';
export { scrapSchema } from './scrap';
export type { Scrap, ScrapsApiResponse, NewScrapPayload } from './scrap';
export type { WindowType, AppWindow } from './window';