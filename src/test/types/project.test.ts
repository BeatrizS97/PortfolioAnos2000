// src/test/types/project.test.ts
// O schema Zod é o "contrato" entre a API e a tela: se o banco mudar o formato, estes testes avisam.
import { describe, expect, it } from 'vitest';
import { projectSchema } from '../../types/project';

// Projeto completo e válido, igual ao que /api/projects devolve.
const validProject = {
  id: 'abc-123',
  title_pt: 'Doe Vida',
  title_en: 'Give Life',
  title_es: 'Dona Vida',
  description_pt: 'Descrição em português',
  description_en: 'Description in English',
  description_es: 'Descripción en español',
  tech_stack: ['React.js', 'Vite'],
  github_url: 'https://github.com/BeatrizS97/Projeto-Doe-Vida',
  live_url: 'https://projeto-doe-vida.vercel.app/',
  image_url: '/assets/images/projects/doe-vida.png',
  category: 'frontend',
  featured: true,
  order_index: 1,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-02T00:00:00Z',
};

describe('projectSchema', () => {
  describe('caso feliz', () => {
    it('aceita um projeto completo e válido, sem alterar os valores', () => {
      const result = projectSchema.safeParse(validProject);
      expect(result.success).toBe(true);
      if (result.success) expect(result.data).toEqual(validProject);
    });

    it.each(['frontend', 'fullstack', 'ai', 'mobile', 'other'])('aceita a categoria "%s"', (category) => {
      expect(projectSchema.safeParse({ ...validProject, category }).success).toBe(true);
    });
  });

  describe('transformação de null (o banco devolve null nas colunas vazias)', () => {
    const withNulls = {
      ...validProject,
      title_en: null,
      title_es: null,
      description_pt: null,
      description_en: null,
      description_es: null,
      tech_stack: null,
      github_url: null,
      live_url: null,
      image_url: null,
    };

    it('converte null em undefined nos textos e links opcionais', () => {
      const data = projectSchema.parse(withNulls);
      expect(data.title_en).toBeUndefined();
      expect(data.title_es).toBeUndefined();
      expect(data.description_en).toBeUndefined();
      expect(data.description_es).toBeUndefined();
      expect(data.github_url).toBeUndefined();
      expect(data.live_url).toBeUndefined();
      expect(data.image_url).toBeUndefined();
    });

    it('converte description_pt null em texto vazio e tech_stack null em lista vazia', () => {
      const data = projectSchema.parse(withNulls);
      expect(data.description_pt).toBe('');
      expect(data.tech_stack).toEqual([]);
    });

    it('também aceita os campos opcionais ausentes (undefined)', () => {
      const { title_en, github_url, ...withoutOptional } = validProject;
      void title_en;
      void github_url;
      const data = projectSchema.parse(withoutOptional);
      expect(data.title_en).toBeUndefined();
      expect(data.github_url).toBeUndefined();
    });
  });

  describe('falhas esperadas', () => {
    it('recusa quando falta um campo obrigatório (title_pt) e aponta qual', () => {
      const { title_pt, ...withoutTitle } = validProject;
      void title_pt;
      const result = projectSchema.safeParse(withoutTitle);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['title_pt']);
        expect(result.error.issues[0].code).toBe('invalid_type');
      }
    });

    it('recusa uma categoria que não existe na lista', () => {
      const result = projectSchema.safeParse({ ...validProject, category: 'desenho' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['category']);
        expect(result.error.issues[0].code).toBe('invalid_enum_value');
      }
    });

    it('recusa tipo errado (featured como texto, order_index como texto)', () => {
      const result = projectSchema.safeParse({ ...validProject, featured: 'sim', order_index: '1' });
      expect(result.success).toBe(false);
      if (!result.success) {
        const paths = result.error.issues.map((issue) => issue.path[0]);
        expect(paths).toContain('featured');
        expect(paths).toContain('order_index');
      }
    });

    it('recusa tech_stack com itens que não são texto', () => {
      expect(projectSchema.safeParse({ ...validProject, tech_stack: ['React', 42] }).success).toBe(false);
    });

    it('lança erro com .parse() quando o objeto é inválido', () => {
      expect(() => projectSchema.parse({})).toThrow();
    });
  });
});