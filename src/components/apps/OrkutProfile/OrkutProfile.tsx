// src/components/apps/OrkutProfile/OrkutProfile.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../../../styles/orkut-theme.css';
import { fetchProjects } from '../../../services/projectsService';
import { fetchScraps } from '../../../services/scrapsService';
import { fetchProfile } from '../../../services/profileService';
import type { Project } from '../../../types/project';
import type { Scrap } from '../../../types/scrap';
import type { ProfileData } from '../../../types/profile';
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
import { RESUME_PATHS, SCRAPS_PAGE_SIZE } from '../../../utils/constants';

// Acima desse número de projetos, o botão "Ver mais" passa a aparecer.
const PROJECTS_VISIBLE_LIMIT = 8;

// Textos do download do currículo por idioma (o nome do idioma aparece no próprio idioma).
const RESUME_TEXT: Record<Language, { downloading: string; ariaLabel: string }> = {
  pt: { downloading: 'Baixando...', ariaLabel: 'Baixar currículo em Português (PDF)' },
  en: { downloading: 'Downloading...', ariaLabel: 'Download resume in English (PDF)' },
  es: { downloading: 'Descargando...', ariaLabel: 'Descargar currículum en Español (PDF)' },
};

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
  const [isDownloading, setIsDownloading] = useState(false);
  const { language, t, tc } = useLanguage();
  const { adminKey, isAdmin, isLoginOpen, openLogin, closeLogin, submitKey, logout } = useAdminKey();
  const [scraps, setScraps] = useState<Scrap[]>([]);
  const [scrapsPage, setScrapsPage] = useState(1);
  const [scrapsHasMore, setScrapsHasMore] = useState(false);
  const [scrapsTotal, setScrapsTotal] = useState(0);
  const [scrapsLoading, setScrapsLoading] = useState(true);
  // Número da última busca de recados. Respostas de buscas antigas (que chegaram fora de ordem) são descartadas.
  const scrapsRequestId = useRef(0);

  // Função que carrega os recados da página especificada, atualizando o estado do componente.
  const loadScraps = useCallback(async (page: number) => {
    // Cada chamada recebe um número; só a mais recente pode atualizar a tela.
    const requestId = ++scrapsRequestId.current;
    setScrapsLoading(true);
    let currentPage = page;
    let result = await fetchScraps(currentPage, SCRAPS_PAGE_SIZE);
    if (requestId !== scrapsRequestId.current) return;
    // Se a página atual ficou vazia (ex.: excluiu o último recado de uma
    // página que não é a primeira), volta uma página em vez de mostrar uma
    // lista vazia no meio da paginação.
    if (result.data.length === 0 && currentPage > 1) {
      currentPage -= 1;
      setScrapsPage(currentPage);
      result = await fetchScraps(currentPage, SCRAPS_PAGE_SIZE);
      if (requestId !== scrapsRequestId.current) return;
    }
    setScraps(result.data); // Atualiza a lista de recados com os dados recebidos do serviço. 
    setScrapsHasMore(result.hasMore); // Atualiza o estado indicando se há mais recados para carregar (para paginação).
    setScrapsTotal(result.total); // Atualiza o estado com o número total de recados disponíveis (para exibição no título da seção).
    setScrapsLoading(false); 
  }, []);

  // Função que é chamada ao trocar de página nos recados: atualiza a página atual e carrega os recados dela.
  const handlePageChange = (page: number) => {
    setScrapsPage(page);
    void loadScraps(page);
  };

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

    // Função assíncrona que carrega os dados do perfil, dos projetos e dos recados (página 1), atualizando o estado do componente.
    // Tudo é buscado junto, então os spinners somem ao mesmo tempo.
    async function load() {
      const [profileData, projectsData, scrapsData] = await Promise.all([
        fetchProfile(),
        fetchProjects(),
        fetchScraps(1, SCRAPS_PAGE_SIZE),
      ]);
      if (!mounted) return; // Se o componente foi desmontado antes da conclusão da requisição, não atualiza o estado.
      setProfile(profileData);
      setProjects(projectsData);
      setScraps(scrapsData.data);
      setScrapsHasMore(scrapsData.hasMore);
      setScrapsTotal(scrapsData.total);
      setScrapsLoading(false);
      setLoading(false);
    }

    void load();
    return () => {
      mounted = false;
      // Invalida qualquer busca de recados ainda em andamento (o componente saiu da tela).
      scrapsRequestId.current += 1;
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

  // Baixa o currículo via fetch para poder mostrar "Baixando..." enquanto o arquivo chega.
  // Se algo falhar, abre o PDF normalmente em outra aba.
  const handleDownloadResume = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isDownloading) return;

    const resumePath = RESUME_PATHS[language];
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
      window.open(resumePath, '_blank', 'noopener');
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
          <ProfileDetails />
        </div>
      )}

      {activeTab === 'comunidades' && (
        <div className="orkut-columns orkut-columns--two">
          {sidebar}
          <main className="orkut-col orkut-col-center">
            <Communities variant="full" />
          </main>
        </div>
      )}

      {activeTab === 'home' && (
        <>
          <div className="orkut-columns">
            {sidebar}

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

            <aside className="orkut-col orkut-col-right">
              <FriendsGrid />
              <Communities variant="compact" />
            </aside>
          </div>

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
        </>
      )}

      {showTestimonialModal && <TestimonialForm onClose={() => setShowTestimonialModal(false)} />}

      {isLoginOpen && <AdminKeyModal onSubmit={submitKey} onClose={closeLogin} />}
    </div>
  );
};

export default OrkutProfile;