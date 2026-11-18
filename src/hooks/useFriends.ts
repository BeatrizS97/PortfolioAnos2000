// src/hooks/useFriends.ts
import { useQuery } from '@tanstack/react-query';
import { fetchFriends } from '../services/friendsService';

// Hook para buscar os amigos (colaboradores dos projetos) usando React Query.
// O "signal" do React Query cancela a requisição quando o componente sai da tela.
export function useFriends() {
  return useQuery({
    queryKey: ['friends'],
    queryFn: ({ signal }) => fetchFriends(signal),
  });
}
