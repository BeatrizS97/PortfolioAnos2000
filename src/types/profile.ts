// src/types/profile.ts
import type { LocalizedField } from './academic';

// Título e "sobre mim" seguem o padrão _pt / _en / _es. E-mail, LinkedIn e GitHub vêm do banco (null quando não preenchidos).
// about_extra e about_hub_connect são os parágrafos que aparecem depois do "sobre mim" na aba Perfil.
// location e photo_url também aceitam null no banco, por isso o tipo reflete isso (os componentes usam um valor padrão).
export type ProfileData = {
  id: string;
  full_name: string;
  location: string | null;
  photo_url: string | null;
  email: string | null;
  linkedin_url: string | null;
  github_url: string | null;
} & LocalizedField<'headline'> &
  LocalizedField<'about_me'> &
  LocalizedField<'about_extra'> &
  LocalizedField<'about_hub_connect'>;
