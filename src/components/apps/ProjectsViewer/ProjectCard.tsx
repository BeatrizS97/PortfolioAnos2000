// src/components/apps/ProjectsViewer/ProjectCard.tsx
import React, { useState } from 'react';
import type { Project } from '../../../types/project';
import type { Language } from '../../../types/language';
import { useLanguage } from '../../../hooks/useLanguage';
import ExternalLink from '../../shared/ExternalLink';

interface ProjectCardProps {
  project: Project;
}

// Nome acessível da lista de tecnologias, por idioma.
const TECH_STACK_LABEL: Record<Language, string> = {
  pt: 'Tecnologias utilizadas',
  en: 'Technologies used',
  es: 'Tecnologías utilizadas',
};

// Placeholder local (SVG embutido) usado quando a imagem do projeto não carrega.
const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='160' height='80' viewBox='0 0 160 80'>" +
      "<rect width='160' height='80' fill='#eeeeee'/>" +
      "<path d='M50 60l22-26 16 18 12-12 20 20z' fill='#cccccc'/>" +
      '</svg>'
  );

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { language, t, tc } = useLanguage();
  const [imageFailed, setImageFailed] = useState(false);
  const title = tc(project.title);

  return (
    <div className="project-card">
      {project.image_url && (
        <img
          src={imageFailed ? PLACEHOLDER_IMAGE : project.image_url}
          alt={title}
          width={160}
          height={80}
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
        />
      )}
      <div className="project-card-body">
        <h4>{title}</h4>
        <p>{tc(project.description)}</p>
        <ul className="tech-stack" aria-label={TECH_STACK_LABEL[language]}>
          {project.tech_stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
        <div className="project-links">
          {project.github_url && (
            <ExternalLink href={project.github_url}>{t.projects.github}</ExternalLink>
          )}
          {project.live_url && (
            <ExternalLink href={project.live_url}>{t.projects.viewOnline}</ExternalLink>
          )}
        </div>
      </div>
    </div>
  );
};

// React.memo: o card só re-renderiza se o projeto mudar.
export default React.memo(ProjectCard);