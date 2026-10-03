// src/types/community.ts
export type CommunityCategory = 'hard_skill' | 'soft_skill';

export interface Community {
  id: string;
  name: string;
  members_count: number;
  category: CommunityCategory;
}
