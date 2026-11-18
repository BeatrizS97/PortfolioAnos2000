// src/types/friend.ts
import type { LocalizedField } from './academic';

// A função (role) segue o padrão _pt / _en / _es; o nome da pessoa não é traduzido.
// avatar_url aceita null no banco (FriendsGrid usa uma imagem padrão nesse caso).
export type Friend = {
  id: string;
  name: string;
  avatar_url: string | null;
} & LocalizedField<'role'>;
