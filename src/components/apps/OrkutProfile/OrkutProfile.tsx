// src/components/apps/OrkutProfile/OrkutProfile.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { fetchProjects } from '../../../services/projectsService';
import { fetchScraps } from '../../../services/scrapsService';
import { fetchProfile } from '../../../services/profileService';
import type { Project } from '../../../types/project';
import type { Scrap } from '../../../types/scrap';
import type { ProfileData } from '../../../types/profile';
import ProfileHeader from './ProfileHeader';
import type { OrkutTab } from './ProfileHeader';
import ScrapsList from './ScrapsList';
import FriendsGrid from './FriendsGrid';
import Testimonials from './Testimonials';
import Communities from './Communities';
import LuckyMessage from './LuckyMessage';
import ProjectsGrid from '../ProjectsViewer/ProjectsGrid';
import ProfileDetails from './ProfileDetails';
import TestimonialForm from './TestimonialForm';
import { useLanguage } from '../../../hooks/useLanguage';
import { useAdminKey } from '../../../hooks/useAdminKey';
import { RESUME_PATHS, SCRAPS_PAGE_SIZE } from '../../../utils/constants';

// Acima desse número de projetos, o botão "Ver mais" passa a aparecer.
const PROJECTS_VISIBLE_LIMIT = 8;

// Componente principal do perfil do Orkut, que exibe informações do usuário, projetos, recados, amigos e comunidades.
const OrkutProfile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [activeTab, setActiveTab] = useState<OrkutTab>('home');
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const { language, t, tc } = useLanguage();
  const { adminKey, isAdmin, login, logout } = useAdminKey();
  const [scraps, setScraps] = useState<Scrap[]>([]);
  const [scrapsPage, setScrapsPage] = useState(1);
  const [scrapsHasMore, setScrapsHasMore] = useState(false);
  const [scrapsTotal, setScrapsTotal] = useState(0);
  const [scrapsLoading, setScrapsLoading] = useState(true);

  // Função que carrega os recados da página especificada, atualizando o estado do componente.
  const loadScraps = useCallback(async (page: number) => {
    setScrapsLoading(true);
    const { data, hasMore, total } = await fetchScraps(page, SCRAPS_PAGE_SIZE);
    // Se a página atual ficou vazia (ex.: excluiu o último recado de uma
    // página que não é a primeira), volta uma página em vez de mostrar uma
    // lista vazia no meio da paginação.
    if (data.length === 0 && page > 1) {
      setScrapsPage(page - 1);
      return;
    }
    setScraps(data); // Atualiza a lista de recados com os dados recebidos do serviço. 
    setScrapsHasMore(hasMore); // Atualiza o estado indicando se há mais recados para carregar (para paginação).
    setScrapsTotal(total); // Atualiza o estado com o número total de recados disponíveis (para exibição no título da seção).
    setScrapsLoading(false); 
  }, []);

  useEffect(() => {
    void loadScraps(scrapsPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrapsPage]);

  // Função que é chamada quando um recado é postado, reiniciando a página de recados para a primeira e recarregando os recados.
  const handleScrapPosted = () => {
    setScrapsPage(1);
    void loadScraps(1);
  };

  // Função que é chamada quando um recado é excluído, recarregando os recados da página atual.
  const handleScrapDeleted = () => {
    void loadScraps(scrapsPage);
  };

  useEffect(() => {
    let mounted = true;

    // Função assíncrona que carrega os dados do perfil e dos projetos, atualizando o estado do componente.
    async function load() {
      const [profileData, projectsData] = await Promise.all([
        fetchProfile(),
        fetchProjects(),
      ]);
      if (!mounted) return; // Se o componente foi desmontado antes da conclusão da requisição, não atualiza o estado.
      setProfile(profileData);
      setProjects(projectsData);
      setLoading(false);
    }

    void load();
    return () => {
      mounted = false;
    };
  }, []);

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

  // Função que lida com o envio do formulário de busca, aplicando o valor da busca e mudando para a aba "home".
  const handleSearchSubmit = () => {
    setAppliedSearch(searchValue.trim().toLowerCase());
    setActiveTab('home');
  };

  // Função que lida com o clique no link "Ver todos os recados", mudando para a aba "home" e rolando suavemente até a seção de recados.
  const handleOpenComments = () => {
    setActiveTab('home');
    window.setTimeout(() => {
      document.getElementById('scraps')?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  return (
    <div className="orkut-profile">
      <ProfileHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onSearchSubmit={handleSearchSubmit}
      />

      {activeTab === 'perfil' && <ProfileDetails />}

      {activeTab === 'comunidades' && (
        <div className="orkut-columns" style={{ gridTemplateColumns: '1fr' }}>
          <Communities />
        </div>
      )}

      {activeTab === 'home' && (
        <>
          <div className="orkut-columns">
            <aside className="orkut-col orkut-col-left">
              <img
                src={profile?.photo_url ?? '/assets/images/icons/user.png'}
                alt={profile?.full_name ?? 'Beatriz'}
                className="profile-photo"
              />
              <h2 className="profile-name">{profile?.full_name ?? 'Beatriz Silva Santos'}</h2>
              <span className="profile-status profile-status--online">{t.orkut.online}</span>

              <ul className="quick-links">
                <li><button onClick={() => setActiveTab('perfil')}>👤 {t.orkut.quickLinks.fullProfile}</button></li>
                <li><button onClick={handleOpenComments}>📝 {t.orkut.commentsTitle(scrapsTotal)}</button></li>
                <li><button onClick={() => setActiveTab('comunidades')}>👥 {t.orkut.tabs.comunidades}</button></li>
                <li className="quick-link-with-info info-tooltip-wrapper">
                  <button onClick={() => setShowTestimonialModal(true)}>💌 {t.orkut.quickLinks.writeTestimonial}</button>
                  <span className="info-icon" aria-hidden="true">ℹ️</span>
                  <span className="info-tooltip-text" role="tooltip">
                    {t.orkut.quickLinks.testimonialTooltip}
                  </span>
                </li>
                <li>
                  <a className="resume-download-link" href={RESUME_PATHS[language]} download>
                    📄 {t.orkut.quickLinks.downloadResume}
                  </a>
                </li>
              </ul>
            </aside>

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
                {loading ? (
                  <div className="loading-spinner">{t.orkut.loading}</div>
                ) : (
                  <>
                    <ProjectsGrid projects={visibleProjects} />
                    {filteredProjects.length > PROJECTS_VISIBLE_LIMIT && (
                      <button className="see-more" onClick={() => setShowAllProjects((prev) => !prev)}>
                        {showAllProjects ? t.orkut.seeLess : t.orkut.seeMore}
                      </button>
                    )}
                  </>
                )}
              </section>

              <Testimonials />
            </main>

            <aside className="orkut-col orkut-col-right">
              <FriendsGrid />
              <Communities />
            </aside>
          </div>

          <section className="scraps-section">
            <div className="scraps-section-inner" id="scraps">
              <div className="section-heading">
                <h4>{t.orkut.commentsTitle(scrapsTotal)}</h4>
                <button
                  type="button"
                  className="scraps-admin-toggle"
                  onClick={isAdmin ? logout : () => login(t.scraps.adminPromptLabel)}
                >
                  {isAdmin ? `🔓 ${t.scraps.adminLogoutLabel}` : `🔒 ${t.scraps.adminLoginLabel}`}
                </button>
              </div>
              <ScrapsList
                scraps={scraps}
                loading={scrapsLoading}
                page={scrapsPage}
                hasMore={scrapsHasMore}
                onPageChange={setScrapsPage}
                isAdmin={isAdmin}
                adminKey={adminKey}
                onPosted={handleScrapPosted}
                onDeleted={handleScrapDeleted}
              />
            </div>
          </section>
        </>
      )}

      {showTestimonialModal && <TestimonialForm onClose={() => setShowTestimonialModal(false)} />}
    </div>
  );
};

export default OrkutProfile;