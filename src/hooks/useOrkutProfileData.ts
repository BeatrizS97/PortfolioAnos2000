// src/hooks/useOrkutProfileData.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchProjects } from '../services/projectsService';
import { fetchScraps } from '../services/scrapsService';
import { fetchProfile } from '../services/profileService';
import type { Project } from '../types/project';
import type { Scrap } from '../types/scrap';
import type { ProfileData } from '../types/profile';
import { SCRAPS_PAGE_SIZE } from '../utils/constants';

// Hook que reúne a busca de dados do perfil do Orkut: perfil, projetos e recados (com paginação).
export function useOrkutProfileData() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
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

  return {
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
  };
}