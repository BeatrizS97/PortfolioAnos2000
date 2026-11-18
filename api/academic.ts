// api/academic.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendPaginatedList } from './_utils.js';

// Seções acadêmicas atendidas por esta rota: GET /api/academic?section=<nome>.
// Elas ficam juntas numa única função porque o plano Hobby da Vercel aceita no máximo 12 Serverless Functions por deploy
// (uma função por tabela estourava o limite). Para criar uma seção nova, basta acrescentar uma linha aqui (e a tabela no banco).
// Todas as tabelas têm a coluna order_index, que define a ordem da lista.
const SECTIONS = new Map<string, { table: string; fields: string }>([
  ['education', { table: 'education', fields: 'id, course_pt, course_en, course_es, order_index' }],
  ['languages', { table: 'languages', fields: 'id, language_pt, language_en, language_es, order_index' }],
  ['certifications', { table: 'certifications', fields: 'id, title_pt, title_en, title_es, order_index' }],
  [
    'experience',
    {
      table: 'experience',
      fields:
        'id, title_pt, title_en, title_es, period_pt, period_en, period_es, description_pt, description_en, description_es, order_index',
    },
  ],
  ['exchange', { table: 'exchange', fields: 'id, description_pt, description_en, description_es, order_index' }],
  ['publications', { table: 'publications', fields: 'id, authors, year, title_pt, title_en, title_es, venue, doi, order_index' }],
]);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // A seção vem na query string. Se não existir na lista acima, a requisição é recusada.
  const section = req.query.section;
  const config = typeof section === 'string' ? SECTIONS.get(section) : undefined;
  if (!config) {
    return res.status(400).json({ success: false, error: 'Invalid section' });
  }

  return sendPaginatedList(req, res, {
    table: config.table,
    fields: config.fields,
    orderBy: 'order_index',
    ascending: true,
    logContext: `academic:${String(section)}`,
    errorLabel: String(section),
  });
}
