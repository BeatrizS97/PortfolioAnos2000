// tests/api/utils.test.ts
// Testes das funções puras de segurança do back-end (api/_utils.ts).
// Ficam em tests/api (e não em api/) para a Vercel não tratar o arquivo de teste como uma Serverless Function.
import { describe, expect, it } from 'vitest';
import { sanitizeText, escapeHtml } from '../../../api/_utils';

describe('sanitizeText (primeira barreira contra XSS, antes de salvar no banco)', () => {
  it('remove a tag <script> inteira, junto com o código de dentro', () => {
    expect(sanitizeText("<script>alert('xss')</script>")).toBe('');
  });

  it('remove o prefixo "javascript:" e mantém o resto do texto', () => {
    const result = sanitizeText('javascript:void(0)');
    expect(result).not.toMatch(/javascript\s*:/i);
    expect(result).toBe('void(0)');
  });

  it('remove a tag <img> maliciosa com onerror', () => {
    expect(sanitizeText('<img src=x onerror=alert(1)>')).toBe('');
  });

  it('remove atributos de evento (onclick=, onload=...) que sobrarem no texto', () => {
    expect(sanitizeText('clique onclick=alert(1) aqui')).not.toMatch(/onclick\s*=/i);
  });

  it('remove tags HTML comuns e mantém só o texto', () => {
    expect(sanitizeText('Oi <b>mundo</b>!')).toBe('Oi mundo!');
  });

  it('não deixa sobrar "<script" mesmo com a tag escondida dentro de outra (<scr<script>ipt>)', () => {
    expect(sanitizeText('<scr<script>ipt>alert(1)</scr</script>ipt>')).not.toMatch(/<\s*script/i);
  });

  it('mantém emoticons como "<3" e ">.<" (não são tags de verdade)', () => {
    expect(sanitizeText('Adorei <3 seu site >.<')).toBe('Adorei <3 seu site >.<');
  });

  it('tira os espaços das pontas', () => {
    expect(sanitizeText('   oi   ')).toBe('oi');
  });

  it.each([undefined, null, 42, {}, ['a']])('devolve string vazia quando o valor não é texto (%s)', (value) => {
    expect(sanitizeText(value)).toBe('');
  });
});

describe('escapeHtml (segurança na hora de montar o HTML do e-mail)', () => {
  it('troca os caracteres especiais por entidades HTML', () => {
    expect(escapeHtml(`<a href="x">Tom & 'Jerry'</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;Tom &amp; &#39;Jerry&#39;&lt;/a&gt;'
    );
  });

  it('transforma um <script> em texto inofensivo (nada vira tag)', () => {
    const result = escapeHtml("<script>alert('xss')</script>");
    expect(result).toBe('&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;');
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
  });

  it('escapa o "&" primeiro, sem escapar duas vezes as entidades que ele mesmo cria', () => {
    expect(escapeHtml('<')).toBe('&lt;');
  });

  it('juntas (como em api/testimonial.ts), sanitizeText + escapeHtml não deixam passar nenhuma tag', () => {
    const attack = `<img src=x onerror=alert(1)><script>alert('xss')</script>javascript:alert(1)`;
    const safe = escapeHtml(sanitizeText(attack));
    expect(safe).not.toContain('<');
    expect(safe).not.toMatch(/javascript\s*:/i);
  });
});