// src/services/projectsService.ts
import { api } from './api';
import type { Project, ProjectFilters, ProjectsApiResponse } from '../types/project';

const now = () => new Date().toISOString();

// Mock de projetos para fallback quando a API não estiver disponível (ex.: em dev local sem backend).
const MOCK_PROJECTS: Project[] = [
  {
    id: '1', title: 'Doe Vida — Incentivo à Doação de Sangue',
    description: 'SPA responsiva mobile-first que integra a OpenStreetMap API para localizar hemocentros próximos e calcular distância até o usuário.',
    tech_stack: ['React.js', 'Vite', 'Tailwind CSS', 'OpenStreetMap API'],
    github_url: 'https://github.com/BeatrizS97/Projeto-Doe-Vida', live_url: '',
    image_url: '/assets/images/projects/doe-vida.png',
    category: 'frontend', featured: true, order_index: 1, created_at: now(), updated_at: now(),
  },
  {
    id: '2', title: 'Form Generator',
    description: 'Aplicação full stack colaborativa para criação e gerenciamento de formulários com lógica condicional, integrando front-end a back-end em PHP e banco SQL.',
    tech_stack: ['HTML', 'CSS', 'JavaScript', 'PHP', 'SQL'],
    github_url: 'https://github.com/tatcom23/Form-Generator', live_url: '',
    image_url: '/assets/images/projects/form-generator.png',
    category: 'fullstack', featured: true, order_index: 2, created_at: now(), updated_at: now(),
  },
  {
    id: '3', title: 'Portfolio Pessoal',
    description: 'Portfólio pessoal construído do zero com HTML5, SCSS3 e JavaScript puro.',
    tech_stack: ['HTML5', 'SCSS3', 'JavaScript'],
    github_url: 'https://github.com/BeatrizS97', live_url: 'https://beatrizs97.github.io/Portfolio/',
    image_url: '/assets/images/projects/portfolio-pessoal.png',
    category: 'frontend', featured: true, order_index: 3, created_at: now(), updated_at: now(),
  },
  {
    id: '4', title: 'ATSAdapta',
    description: 'Reescreve currículos no método STAR e os adapta a vagas usando IA, com verificação de compatibilidade ATS e exportação em .txt, PDF e Word.',
    tech_stack: ['React', 'Vite', 'Gemini API', 'pdfkit', 'docx'],
    github_url: 'https://github.com/BeatrizS97/ATSAdapta', live_url: '',
    image_url: '/assets/images/projects/ats-adapta.png',
    category: 'ai', featured: true, order_index: 4, created_at: now(), updated_at: now(),
  },
  {
    id: '5', title: 'InspireFoto',
    description: 'Galeria de fotografias de paisagens com favoritos persistidos, filtros por categoria e design editorial em Vue 3.',
    tech_stack: ['Vue 3', 'Vite', 'SCSS'],
    github_url: 'https://github.com/BeatrizS97/Projeto-Inspire-Foto', live_url: 'https://projeto-inspire-foto.vercel.app/',
    image_url: '/assets/images/projects/inspire-foto.png',
    category: 'frontend', featured: true, order_index: 5, created_at: now(), updated_at: now(),
  },
  {
    id: '6', title: 'Banco de Trocas de Conhecimento',
    description: 'Plataforma para trocar conhecimentos gratuitamente entre pessoas — API REST em Node/Express/Prisma e SPA em React, com autenticação JWT.',
    tech_stack: ['Node.js', 'Express', 'Prisma', 'PostgreSQL', 'React'],
    github_url: 'https://github.com/BeatrizS97/Projeto-Banco-Troca-de-Conhecimento', live_url: 'https://projeto-banco-troca-de-conhecimento.vercel.app/',
    image_url: '/assets/images/projects/banco-trocas.png',
    category: 'fullstack', featured: true, order_index: 6, created_at: now(), updated_at: now(),
  },
  {
    id: '7', title: 'Cinema de Terror',
    description: 'Página temática de cinema de terror com animações, efeitos de jumpscare e modal interativo — primeiro projeto com SCSS.',
    tech_stack: ['HTML', 'SCSS', 'JavaScript'],
    github_url: 'https://github.com/BeatrizS97/Cinema', live_url: '',
    image_url: '/assets/images/projects/cinema-terror.png',
    category: 'frontend', featured: true, order_index: 7, created_at: now(), updated_at: now(),
  },
];

// Aplica filtros de categoria e destaque a uma lista de projetos, retornando apenas os que correspondem aos critérios.
function applyFilters(projects: Project[], filters?: ProjectFilters): Project[] {
  let result = projects;
  if (filters?.category) result = result.filter((p) => p.category === filters.category);
  if (filters?.featured !== undefined) result = result.filter((p) => p.featured === filters.featured);
  return result;
}

// Busca projetos da API, aplicando filtros de categoria e destaque. Se a API falhar, retorna dados mock.
export async function fetchProjects(filters?: ProjectFilters): Promise<Project[]> {
  const params = new URLSearchParams();
  if (filters?.category) params.set('category', filters.category);
  if (filters?.featured !== undefined) params.set('featured', String(filters.featured));

  try {
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get<ProjectsApiResponse>(`/projects${query}`);
    return response.data;
  } catch {
    return applyFilters(MOCK_PROJECTS, filters);
  }
}