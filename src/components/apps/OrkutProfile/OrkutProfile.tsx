// src/components/apps/OrkutProfile/OrkutProfile.tsx
import React, { useState } from 'react';
import '../../../styles/orkut-theme.css';
import type { Language } from '../../../types/language';
import ProfileHeader from './ProfileHeader';
import type { OrkutTab } from './ProfileHeader';
import ScrapsList from './ScrapsList';
import ProfileSidebar from './ProfileSidebar';
import FriendsGrid from './FriendsGrid';
import Testimonials from './Testimonials';
import Communities from './Communities';
import LuckyMessage from './LuckyMessage';
import ProjectsGrid from '../ProjectsViewer/ProjectsGrid';
import ProfileDetails from './ProfileDetails';
import TestimonialForm from './TestimonialForm';
import AdminKeyModal from './AdminKeyModal';
import { useLanguage } from '../../../hooks/useLanguage';
import { useAdminKey } from '../../../hooks/useAdminKey';
import { useOrkutProfileData } from '../../../hooks/useOrkutProfileData';
import { RESUME_PATHS } from '../../../utils/constants';

// Acima desse número de projetos, o botão "Ver mais" passa a aparecer.
const PROJECTS_VISIBLE_LIMIT = 8;

// Textos do download do currículo por idioma (o nome do idioma aparece no próprio idioma).
// Error e openLink são o aviso (e o texto do link) mostrados quando o download automático falha.
const RESUME_TEXT: Record<Language, { downloading: string; ariaLabel: string; error: string; openLink: string }> = {
  pt: {
    downloading: 'Baixando...',
    ariaLabel: 'Baixar currículo em Português (PDF)',
    error: 'Não foi possível baixar o PDF automaticamente.',
    openLink: 'Abrir o PDF',
  },
  en: {
    downloading: 'Downloading...',
    ariaLabel: 'Download resume in English (PDF)',
    error: "Couldn't download the PDF automatically.",
    openLink: 'Open the PDF',
  },
  es: {
    downloading: 'Descargando...',
    ariaLabel: 'Descargar currículum en Español (PDF)',
    error: 'No se pudo descargar el PDF automáticamente.',
    openLink: 'Abrir el PDF',
  },
};

// Componente principal do perfil do Orkut, que exibe informações do usuário, projetos, recados, amigos e comunidades.
const OrkutProfile: React.FC = () => {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [activeTab, setActiveTab] = useState<OrkutTab>('home');
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  const { language, t, tc } = useLanguage();
  const { adminKey, isAdmin, isLoginOpen, openLogin, closeLogin, submitKey, logout } = useAdminKey();
  // Perfil, projetos e recados (com paginação) agora vêm do hook useOrkutProfileData.
  // A lógica de busca e a proteção contra resposta fora de ordem (scrapsRequestId) foram para lá.
  const {
    profile,
    projects,
    loading,
    scraps,
    scrapsPage,
    scrapsHasMore,
    scrapsTotal,
    scrapsLoading,
    handlePageChange,
    handleScrapPosted,
    handleScrapDeleted,
  } = useOrkutProfileData();

  // Busca simples por título, descrição ou tecnologia do projeto.
  const filteredProjects = appliedSearch
    ? projects.filter((project) => {
        const haystack = `${tc(project.title)} ${tc(project.description)} ${project.tech_stack.join(' ')}`.toLowerCase();
        return haystack.includes(appliedSearch);
      })
    : projects;

  // Determina quais projetos serão visíveis na grade, dependendo se o usuário clicou em "Ver mais" ou não.  
  const visibleProjects = showAllProjects ? filteredProjects : filteredProjects.slice(0, PROJECTS_VISIBLE_LIMIT);
  const firstName = profile?.full_name.split(' ')[0] ?? 'Beatriz'; // Extrai o primeiro nome do perfil para exibição na mensagem de boas-vindas.

  // Função que lida com o envio do formulário de busca, aplicando o valor da busca na aba atual (a aba não muda).
  // Home filtra os projetos, Perfil filtra as seções do perfil e Comunidades filtra as comunidades.
  const handleSearchSubmit = () => {
    setAppliedSearch(searchValue.trim().toLowerCase());
  };

  // Função que lida com o clique no link "Ver todos os recados", mudando para a aba "home" e rolando suavemente até a seção de recados.
  const handleOpenComments = () => {
    setActiveTab('home');
    window.setTimeout(() => {
      document.getElementById('scraps')?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  // Baixa o currículo via fetch para poder mostrar "Baixando..." enquanto o arquivo chega.
  // Se algo falhar, abre o PDF normalmente em outra aba.
  const handleDownloadResume = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isDownloading) return;

    const resumePath = RESUME_PATHS[language];
    setDownloadError(false);
    setIsDownloading(true);
    try {
      const response = await fetch(resumePath);
      const blob = await response.blob();
      // Na Vercel, um arquivo que não existe cai no index.html (rewrite); por isso confere se realmente é um PDF.
      if (!response.ok || !blob.type.includes('pdf')) {
        throw new Error('PDF indisponível');
      }

      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = resumePath.split('/').pop() ?? 'curriculo.pdf';
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch {
      setDownloadError(true);
    } finally {
      setIsDownloading(false);
    }
  };

  // Sidebar esquerda reaproveitada nas abas Home, Perfil e Comunidades (só uma delas aparece por vez).
  const sidebar = (
    <ProfileSidebar
      profile={profile}
      scrapsTotal={scrapsTotal}
      onTabChange={setActiveTab}
      onOpenComments={handleOpenComments}
      onWriteTestimonial={() => setShowTestimonialModal(true)}
      resumeHref={RESUME_PATHS[language]}
      resumeLabel={RESUME_TEXT[language].downloading}
      resumeAriaLabel={RESUME_TEXT[language].ariaLabel}
      isDownloading={isDownloading}
      hasDownloadError={downloadError}
      resumeErrorText={RESUME_TEXT[language].error}
      resumeOpenLinkText={RESUME_TEXT[language].openLink}
      onDownloadResume={handleDownloadResume}
    />
  );

  return (
    <div className="orkut-profile">
      <ProfileHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onSearchSubmit={handleSearchSubmit}
      />

      {activeTab === 'perfil' && (
        <div className="orkut-columns orkut-columns--two">
          {sidebar}
          <ProfileDetails searchTerm={appliedSearch} />
        </div>
      )}

      {activeTab === 'comunidades' && (
        <div className="orkut-columns orkut-columns--two">
          {sidebar}
          <main className="orkut-col orkut-col-center">
            <Communities variant="full" searchTerm={appliedSearch} />
          </main>
        </div>
      )}

      {activeTab === 'home' && (
        <div className="orkut-columns">
          {sidebar}

          <div className="orkut-col">
            <main className="orkut-col orkut-col-center">
              <h3 className="welcome-msg">{t.orkut.welcome(firstName)}</h3>
              <p className="profile-role">
                {tc(profile?.headline ?? 'Desenvolvedora Full Stack Júnior')} — {profile?.location ?? 'Itanhaém, SP'}
              </p>

              <div className="profile-stats">
                <span>📝 {t.orkut.commentsCount(scrapsTotal)}</span>
                <span>🖼️ {t.orkut.projectsCount(projects.length)}</span>
              </div>

              <LuckyMessage />

              <section className="projects-section">
                <div className="section-heading">
                  <h4>{t.orkut.projectsTitle}</h4>
                </div>
                <ProjectsGrid projects={visibleProjects} isLoading={loading} />
                {!loading && filteredProjects.length > PROJECTS_VISIBLE_LIMIT && (
                  <button className="see-more" onClick={() => setShowAllProjects((prev) => !prev)}>
                    {showAllProjects ? t.orkut.seeLess : t.orkut.seeMore}
                  </button>
                )}
              </section>

              <Testimonials />
            </main>

            <section className="scraps-section">
              <div className="scraps-section-inner" id="scraps">
                <div className="section-heading">
                  <h4>{t.orkut.commentsTitle(scrapsTotal)}</h4>
                  <button
                    type="button"
                    className="scraps-admin-toggle"
                    onClick={isAdmin ? logout : openLogin}
                  >
                    {isAdmin ? `🔓 ${t.scraps.adminLogoutLabel}` : `🔒 ${t.scraps.adminLoginLabel}`}
                  </button>
                </div>
                <ScrapsList
                  scraps={scraps}
                  loading={scrapsLoading}
                  page={scrapsPage}
                  hasMore={scrapsHasMore}
                  onPageChange={handlePageChange}
                  isAdmin={isAdmin}
                  adminKey={adminKey}
                  onPosted={handleScrapPosted}
                  onDeleted={handleScrapDeleted}
                />
              </div>
            </section>
          </div>

          <aside className="orkut-col orkut-col-right">
            <FriendsGrid />
            <Communities variant="compact" />
          </aside>
        </div>
      )}

      {showTestimonialModal && <TestimonialForm onClose={() => setShowTestimonialModal(false)} />}

      {isLoginOpen && <AdminKeyModal onSubmit={submitKey} onClose={closeLogin} />}
    </div>
  );
};

export default OrkutProfile;