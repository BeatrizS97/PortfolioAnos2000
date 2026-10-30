// src/components/apps/OrkutProfile/ProfileSidebar.tsx
import React from 'react';
import type { ProfileData } from '../../../types/profile';
import type { OrkutTab } from './ProfileHeader';
import { useLanguage } from '../../../hooks/useLanguage';
import ExternalLink from '../../shared/ExternalLink';

interface ProfileSidebarProps {
  profile: ProfileData | null;
  scrapsTotal: number;
  onTabChange: (tab: OrkutTab) => void;
  onOpenComments: () => void;
  onWriteTestimonial: () => void;
  resumeHref: string;
  resumeLabel: string;
  resumeAriaLabel: string;
  isDownloading: boolean;
  hasDownloadError: boolean;
  resumeErrorText: string;
  resumeOpenLinkText: string;
  onDownloadResume: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

// Sidebar esquerda do perfil (foto, nome, status e links rápidos). Fica igual nas páginas Home, Perfil e Comunidades, como no Orkut original.
const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  profile,
  scrapsTotal,
  onTabChange,
  onOpenComments,
  onWriteTestimonial,
  resumeHref,
  resumeLabel,
  resumeAriaLabel,
  isDownloading,
  hasDownloadError,
  resumeErrorText,
  resumeOpenLinkText,
  onDownloadResume,
}) => {
  const { t } = useLanguage();

  return (
    <aside className="orkut-col orkut-col-left">
      <img
        src={profile?.photo_url ?? '/assets/images/icons/user.png'}
        alt={profile?.full_name ?? 'Beatriz'}
        className="profile-photo"
      />
      <h2 className="profile-name">{profile?.full_name ?? 'Beatriz Silva Santos'}</h2>
      <span className="profile-status profile-status--online">{t.orkut.online}</span>

      <ul className="quick-links">
        <li><button onClick={() => onTabChange('perfil')}>👤 {t.orkut.quickLinks.fullProfile}</button></li>
        <li><button onClick={onOpenComments}>📝 {t.orkut.commentsTitle(scrapsTotal)}</button></li>
        <li><button onClick={() => onTabChange('comunidades')}>👥 {t.orkut.tabs.comunidades}</button></li>
        <li className="quick-link-with-info info-tooltip-wrapper">
          <button onClick={onWriteTestimonial}>💌 {t.orkut.quickLinks.writeTestimonial}</button>
          <span className="info-icon" aria-hidden="true">ℹ️</span>
          <span className="info-tooltip-text" role="tooltip">
            {t.orkut.quickLinks.testimonialTooltip}
          </span>
        </li>
        <li>
          <a
            className="resume-download-link"
            href={resumeHref}
            download
            aria-label={resumeAriaLabel}
            aria-busy={isDownloading}
            onClick={onDownloadResume}
          >
            📄 {isDownloading ? resumeLabel : t.orkut.quickLinks.downloadResume}
          </a>
        </li>
        {hasDownloadError && (
          <li className="resume-download-error" role="alert">
            {resumeErrorText} <ExternalLink href={resumeHref}>{resumeOpenLinkText}</ExternalLink>
          </li>
        )}
      </ul>
    </aside>
  );
};

export default ProfileSidebar;