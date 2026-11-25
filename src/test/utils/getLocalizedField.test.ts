// src/test/utils/getLocalizedField.test.ts
// Internacionalização dos textos que vêm do banco (colunas _pt / _en / _es).
import { describe, expect, it } from 'vitest';
import { getLocalizedField } from '../../utils/getLocalizedField';

describe('getLocalizedField', () => {
  const item = { title_pt: 'Projeto', title_en: 'Project', title_es: 'Proyecto' };

  it('devolve o texto do idioma pedido quando ele existe', () => {
    expect(getLocalizedField(item, 'title', 'pt')).toBe('Projeto');
    expect(getLocalizedField(item, 'title', 'en')).toBe('Project');
    expect(getLocalizedField(item, 'title', 'es')).toBe('Proyecto');
  });

  it('cai para o português quando a tradução não existe (campo ausente)', () => {
    expect(getLocalizedField({ title_pt: 'Projeto' }, 'title', 'en')).toBe('Projeto');
  });

  it('cai para o português quando a tradução é undefined', () => {
    expect(getLocalizedField({ title_pt: 'Projeto', title_en: undefined }, 'title', 'en')).toBe('Projeto');
  });

  it('cai para o português quando a tradução é null (o banco devolve null nas colunas vazias)', () => {
    expect(getLocalizedField({ title_pt: 'Projeto', title_es: null }, 'title', 'es')).toBe('Projeto');
  });

  it('cai para o português quando a tradução é uma string vazia', () => {
    expect(getLocalizedField({ title_pt: 'Projeto', title_en: '' }, 'title', 'en')).toBe('Projeto');
  });

  it('devolve string vazia quando nem o português existe', () => {
    expect(getLocalizedField({}, 'title', 'en')).toBe('');
    expect(getLocalizedField({ title_pt: null }, 'title', 'pt')).toBe('');
  });
});