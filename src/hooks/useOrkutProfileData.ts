// src/hooks/useOrkutProfileData.ts
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useProfile } from './useProfile';
import { useProjects } from './useProjects';
import { useScraps } from './useScraps';

// Hook que reúne a busca de dados do perfil do Orkut: perfil, projetos e recados (com paginação).
// Os três vêm do React Query: ele guarda o resultado em cache, cancela a busca se a tela fechar e
// descarta sozinho a resposta de uma busca antiga que chegou fora de ordem (antes isso era feito à mão, com o scrapsRequestId).
// Se a API falhar, as listas ficam vazias (profile fica null).
export function useOrkutProfileData() {
  const queryClient = useQueryClient();
  const { data: profile = null } = useProfile();
  const { data: projects = [], isLoading: loading } = useProjects();
  const [scrapsPage, setScrapsPage] = useState(1);
  const { data: scrapsResult, isLoading: scrapsLoading } = useScraps(scrapsPage);

  const scraps = scrapsResult?.data ?? [];
  const scrapsHasMore = scrapsResult?.hasMore ?? false; // Indica se há mais recados para carregar (para paginação).
  const scrapsTotal = scrapsResult?.total ?? 0; // Número total de recados disponíveis (para exibição no título da seção).

  // Se a página atual ficou vazia (ex.: excluiu o último recado de uma
  // página que não é a primeira), volta uma página em vez de mostrar uma
  // lista vazia no meio da paginação.
  useEffect(() => {
    if (scrapsResult && scrapsResult.data.length === 0 && scrapsPage > 1) {
      setScrapsPage((prev) => prev - 1);
    }
  }, [scrapsResult, scrapsPage]);

  // Função que é chamada ao trocar de página nos recados: atualiza a página atual (o useScraps busca os recados dela).
  const handlePageChange = (page: number) => {
    setScrapsPage(page);
  };

  // Função que é chamada quando um recado é postado, reiniciando a página de recados para a primeira e buscando os recados de novo.
  const handleScrapPosted = () => {
    setScrapsPage(1);
    void queryClient.invalidateQueries({ queryKey: ['scraps'] });
  };

  // Função que é chamada quando um recado é excluído, buscando de novo os recados da página atual.
  const handleScrapDeleted = () => {
    void queryClient.invalidateQueries({ queryKey: ['scraps'] });
  };

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
