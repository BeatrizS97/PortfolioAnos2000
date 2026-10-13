// src/types/academic.ts

// Campo traduzido: o português é obrigatório; inglês e espanhol são opcionais.
// Ex.: LocalizedField<'course'> => { course_pt: string; course_en?: string; course_es?: string }
export type LocalizedField<Base extends string> = {
  [K in `${Base}_pt`]: string;
} & {
  [K in `${Base}_en` | `${Base}_es`]?: string;
};

// Item acadêmico genérico: id, ordem e um campo traduzido (cujo nome-base é o parâmetro Base).
export type AcademicItem<Base extends string> = {
  id: string;
  order_index: number;
} & LocalizedField<Base>;

export type EducationItem = AcademicItem<'course'>;

export type LanguageSkill = AcademicItem<'language'>;

export type Certification = AcademicItem<'title'>;

// Experiência tem três campos traduzidos: título (via AcademicItem), período e descrição.
export type ExperienceItem = AcademicItem<'title'> &
  LocalizedField<'period'> &
  LocalizedField<'description'>;