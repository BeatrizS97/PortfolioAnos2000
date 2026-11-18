// src/types/community.ts
import type { LocalizedField } from './academic';

export type CommunityCategory = 'hard_skill' | 'soft_skill';

// Nome e descrição seguem o padrão _pt / _en / _es (use getLocalizedField para ler no idioma atual).
// icon é a chave do desenho em pixel art da comunidade (ver PIXEL_ART em Communities.tsx); null quando não preenchido.
export type Community = {
  id: string;
  icon: string | null;
  members_count: number;
  category: CommunityCategory;
} & LocalizedField<'name'> &
  LocalizedField<'description'>;
