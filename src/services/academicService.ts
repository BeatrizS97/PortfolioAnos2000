// src/services/academicService.ts
import { api } from './api';
import type { EducationItem, LanguageSkill, Certification, ExperienceItem } from '../types/academic';

// Fallback usado em dev sem Supabase configurado — mesmos dados do seed.
const MOCK_EDUCATION: EducationItem[] = [
  {
    id: '1',
    course_pt: 'Análise e Desenvolvimento de Sistemas — Fatec Praia Grande (fev/2023 – jul/2026)',
    course_en: 'Systems Analysis and Development — Fatec Praia Grande (Feb/2023 – Jul/2026)',
    course_es: 'Análisis y Desarrollo de Sistemas — Fatec Praia Grande (feb/2023 – jul/2026)',
    order_index: 1,
  },
  {
    id: '2',
    course_pt: 'Licenciatura em Letras (Português e Inglês) — Universidade Cruzeiro do Sul (2015 – 2018)',
    course_en: 'Teaching Degree in Languages and Literature (Portuguese and English) — Universidade Cruzeiro do Sul (2015 – 2018)',
    course_es: 'Licenciatura en Letras (Portugués e Inglés) — Universidade Cruzeiro do Sul (2015 – 2018)',
    order_index: 2,
  },
];

const MOCK_LANGUAGES: LanguageSkill[] = [
  { id: '1', language_pt: 'Português — Nativo', language_en: 'Portuguese — Native', language_es: 'Portugués — Nativo', order_index: 1 },
  { id: '2', language_pt: 'Inglês — B1, em evolução (nível profissional de trabalho)', language_en: 'English — B1, in progress (professional working level)', language_es: 'Inglés — B1, en progreso (nivel profesional de trabajo)', order_index: 2 },
  { id: '3', language_pt: 'Espanhol — A2, em evolução', language_en: 'Spanish — A2, in progress', language_es: 'Español — A2, en progreso', order_index: 3 },
];

const MOCK_CERTIFICATIONS: Certification[] = [
  { id: '1', title_pt: 'Scrum Fundamentals Certified (SFC™) — SCRUMstudy, jun/2025', title_en: 'Scrum Fundamentals Certified (SFC™) — SCRUMstudy, Jun/2025', title_es: 'Scrum Fundamentals Certified (SFC™) — SCRUMstudy, jun/2025', order_index: 1 },
  { id: '2', title_pt: "Formação Web Essencial (BIT) — Instituto Precisa Ser / Vai na Web / L'Oréal Brasil, 86,5h, concluído mar/2026", title_en: "Formação Web Essencial (BIT) — Instituto Precisa Ser / Vai na Web / L'Oréal Brasil, 86.5h, completed Mar/2026", title_es: "Formação Web Essencial (BIT) — Instituto Precisa Ser / Vai na Web / L'Oréal Brasil, 86,5h, concluido mar/2026", order_index: 2 },
  { id: '3', title_pt: 'Crescendo no Trabalho – JobRise — Wadhwani Foundation, via Escola Atlântico Avanti, 78h, concluído jun/2026', title_en: 'Crescendo no Trabalho – JobRise — Wadhwani Foundation, via Escola Atlântico Avanti, 78h, completed Jun/2026', title_es: 'Crescendo no Trabalho – JobRise — Wadhwani Foundation, vía Escola Atlântico Avanti, 78h, concluido jun/2026', order_index: 3 },
  { id: '4', title_pt: 'Curso de Extensão Universitária: Acelerando Projetos de Sucesso — USP/ESALQ (Metodologias Ágeis)', title_en: 'University Extension Course: Accelerating Successful Projects — USP/ESALQ (Agile Methodologies)', title_es: 'Curso de Extensión Universitaria: Acelerando Proyectos de Éxito — USP/ESALQ (Metodologías Ágiles)', order_index: 4 },
  { id: '5', title_pt: 'Trilha de Inteligência Artificial com React — Santander Open Academy, Bootcamp 2026 (em andamento)', title_en: 'Artificial Intelligence with React Track — Santander Open Academy, Bootcamp 2026 (in progress)', title_es: 'Ruta de Inteligencia Artificial con React — Santander Open Academy, Bootcamp 2026 (en curso)', order_index: 5 },
];

const MOCK_EXPERIENCE: ExperienceItem[] = [
  {
    id: '1',
    title_pt: 'Estagiária Full Stack — Hub Connect Eventos',
    title_en: 'Full Stack Intern — Hub Connect Eventos',
    title_es: 'Pasante Full Stack — Hub Connect Eventos',
    period_pt: 'fev/2026 – ago/2026',
    period_en: 'Feb/2026 – Aug/2026',
    period_es: 'feb/2026 – ago/2026',
    description_pt: 'site institucional construído do zero, otimização de SEO, GA4/GTM, padronização de componentes reutilizáveis em React/Next.js.',
    description_en: 'institutional website built from scratch, SEO optimization, GA4/GTM, standardization of reusable components in React/Next.js.',
    description_es: 'sitio institucional construido desde cero, optimización de SEO, GA4/GTM, estandarización de componentes reutilizables en React/Next.js.',
    order_index: 1,
  },
  {
    id: '2',
    title_pt: 'Vice-Presidente — Associação Cultural e Comunitária Pedra Que Canta',
    title_en: 'Vice President — Pedra Que Canta Cultural and Community Association',
    title_es: 'Vicepresidenta — Asociación Cultural y Comunitaria Pedra Que Canta',
    period_pt: '2022 – dez/2025',
    period_en: '2022 – Dec/2025',
    period_es: '2022 – dic/2025',
    description_pt: 'liderança de equipe voluntária por 3 anos, participação em decisões estratégicas de alocação de recursos junto à diretoria.',
    description_en: 'led a volunteer team for 3 years and took part in strategic resource-allocation decisions alongside the board.',
    description_es: 'liderazgo de un equipo voluntario durante 3 años y participación en decisiones estratégicas de asignación de recursos junto a la directiva.',
    order_index: 2,
  },
];

export async function fetchEducation(): Promise<EducationItem[]> {
  try {
    const response = await api.get<{ success: boolean; data: EducationItem[] }>('/education');
    return response.data.length > 0 ? response.data : MOCK_EDUCATION;
  } catch {
    return MOCK_EDUCATION;
  }
}

export async function fetchLanguages(): Promise<LanguageSkill[]> {
  try {
    const response = await api.get<{ success: boolean; data: LanguageSkill[] }>('/languages');
    return response.data.length > 0 ? response.data : MOCK_LANGUAGES;
  } catch {
    return MOCK_LANGUAGES;
  }
}

export async function fetchCertifications(): Promise<Certification[]> {
  try {
    const response = await api.get<{ success: boolean; data: Certification[] }>('/certifications');
    return response.data.length > 0 ? response.data : MOCK_CERTIFICATIONS;
  } catch {
    return MOCK_CERTIFICATIONS;
  }
}

export async function fetchExperience(): Promise<ExperienceItem[]> {
  try {
    const response = await api.get<{ success: boolean; data: ExperienceItem[] }>('/experience');
    return response.data.length > 0 ? response.data : MOCK_EXPERIENCE;
  } catch {
    return MOCK_EXPERIENCE;
  }
}