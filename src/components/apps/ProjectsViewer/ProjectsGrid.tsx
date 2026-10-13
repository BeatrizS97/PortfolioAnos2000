// src/components/apps/ProjectsViewer/ProjectsGrid.tsx
import React from 'react';
import type { Project } from '../../../types/project';
import ProjectCard from './ProjectCard';
import { useLanguage } from '../../../hooks/useLanguage';

interface ProjectsGridProps {
  projects: Project[];
  isLoading?: boolean;
}

// Quantos cards "esqueleto" aparecem enquanto os projetos carregam.
const SKELETON_COUNT = 4;

const ProjectsGrid: React.FC<ProjectsGridProps> = ({ projects, isLoading = false }) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="projects-grid" role="status" aria-busy="true" aria-label={t.orkut.loading}>
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <div key={index} className="project-card skeleton-card" aria-hidden="true">
            <div className="skeleton-block skeleton-image" />
            <div className="project-card-body">
              <div className="skeleton-block skeleton-line" />
              <div className="skeleton-block skeleton-line skeleton-line--short" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return <p className="empty-state">{t.projects.empty}</p>;
  }
  return (
    <div className="projects-grid">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectsGrid;