// src/components/apps/OrkutProfile/ProfileSection.tsx
import React from 'react';
import { useLanguage } from '../../../hooks/useLanguage';

interface ProfileSectionProps {
  // Título da seção (ex.: "Formação acadêmica").
  title: string;
  // Estado da busca no banco (vindo do React Query).
  isLoading: boolean;
  isError: boolean;
  // Conteúdo mostrado quando a busca terminou bem.
  children: React.ReactNode;
}

// Seção da aba Perfil: título + "carregando" / mensagem de erro / conteúdo. Evita repetir esse padrão em cada seção do ProfileDetails.
const ProfileSection: React.FC<ProfileSectionProps> = ({ title, isLoading, isError, children }) => {
  const { t } = useLanguage();

  return (
    <>
      <div className="section-heading"><h4>{title}</h4></div>
      {isLoading ? (
        <div className="loading-spinner">{t.orkut.loading}</div>
      ) : isError ? (
        <p className="empty-state" role="alert">{t.profileDetails.loadError}</p>
      ) : (
        children
      )}
    </>
  );
};

export default ProfileSection;
