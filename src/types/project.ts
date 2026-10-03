// src/types/project.ts
export interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  github_url?: string;
  live_url?: string;
  image_url?: string;
  category: 'frontend' | 'fullstack' | 'ai' | 'mobile' | 'other';
  featured: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectFilters {
  category?: Project['category'];
  featured?: boolean;
}

export interface ProjectsApiResponse {
  success: boolean;
  data: Project[];
  total: number;
}