// src/types/academic.ts
export interface EducationItem {
  id: string;
  course_pt: string;
  course_en?: string;
  course_es?: string;
  order_index: number;
}

export interface LanguageSkill {
  id: string;
  language_pt: string;
  language_en?: string;
  language_es?: string;
  order_index: number;
}

export interface Certification {
  id: string;
  title_pt: string;
  title_en?: string;
  title_es?: string;
  order_index: number;
}

export interface ExperienceItem {
  id: string;
  title_pt: string;
  title_en?: string;
  title_es?: string;
  period_pt: string;
  period_en?: string;
  period_es?: string;
  description_pt: string;
  description_en?: string;
  description_es?: string;
  order_index: number;
}