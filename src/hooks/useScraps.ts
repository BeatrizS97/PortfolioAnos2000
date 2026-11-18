// src/hooks/useScraps.ts
import { useQuery } from '@tanstack/react-query';
import { fetchScraps } from '../services/scrapsService';
import { SCRAPS_PAGE_SIZE } from '../utils/constants';

// Hook para buscar uma página de recados usando React Query. Cada página tem a sua chave: ['scraps', página].
// O React Query descarta sozinho a resposta de uma busca antiga que chegou fora de ordem, e cancela a busca se o componente sair da tela.
// staleTime 0: o livro de recados é público e outras pessoas escrevem nele, então ele busca de novo sempre que a tela abre.
export function useScraps(page: number) {
  return useQuery({
    queryKey: ['scraps', page],
    queryFn: ({ signal }) => fetchScraps(page, SCRAPS_PAGE_SIZE, signal),
    staleTime: 0,
  });
}
