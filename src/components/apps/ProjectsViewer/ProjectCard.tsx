// src/components/apps/ProjectsViewer/ProjectCard.tsx
import React from 'react';
import type { Project } from '../../../types/project';
import { useLanguage } from '../../../hooks/useLanguage';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { t, tc } = useLanguage();

  return (
    <div className="project-card">
      {project.image_url && <img src={project.image_url} alt={tc(project.title)} />}
      <div className="project-card-body">
        <h4>{tc(project.title)}</h4>
        <p>{tc(project.description)}</p>
        <ul className="tech-stack">
          {project.tech_stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
        <div className="project-links">
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noreferrer">{t.projects.github}</a>
          )}
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noreferrer">{t.projects.viewOnline}</a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
