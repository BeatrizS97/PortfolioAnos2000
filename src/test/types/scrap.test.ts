// src/test/types/scrap.test.ts
// Contrato dos recados (scraps) que chegam de /api/scraps.
import { describe, expect, it } from 'vitest';
import { scrapSchema } from '../../types/scrap';

const validScrap = {
  id: '1',
  author_name: 'Maria',
  author_avatar: 'https://exemplo.com/maria.png',
  message: 'Parabéns pelo portfólio!',
  is_public: true,
  created_at: '2026-01-01T00:00:00Z',
};

describe('scrapSchema', () => {
  it('caso feliz: aceita um recado completo e válido', () => {
    const result = scrapSchema.safeParse(validScrap);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual(validScrap);
  });

  it('transformação: author_avatar null (recado criado pelo formulário) vira undefined', () => {
    expect(scrapSchema.parse({ ...validScrap, author_avatar: null }).author_avatar).toBeUndefined();
  });

  it('transformação: author_avatar ausente também vira undefined', () => {
    const { author_avatar, ...withoutAvatar } = validScrap;
    void author_avatar;
    expect(scrapSchema.parse(withoutAvatar).author_avatar).toBeUndefined();
  });

  it('falha: sem a mensagem, o recado é recusado e o erro aponta o campo "message"', () => {
    const { message, ...withoutMessage } = validScrap;
    void message;
    const result = scrapSchema.safeParse(withoutMessage);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].path).toEqual(['message']);
  });

  it('falha: is_public como texto é recusado', () => {
    const result = scrapSchema.safeParse({ ...validScrap, is_public: 'true' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].path).toEqual(['is_public']);
  });
});