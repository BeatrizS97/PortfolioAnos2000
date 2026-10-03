// src/components/apps/ProjectsViewer/ProjectsGrid.tsx
import React from 'react';
import type { Project } from '../../../types/project';
import ProjectCard from './ProjectCard';
import { useLanguage } from '../../../hooks/useLanguage';

interface ProjectsGridProps {
  projects: Project[];
}

const ProjectsGrid: React.FC<ProjectsGridProps> = ({ projects }) => {
  const { t } = useLanguage();

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
