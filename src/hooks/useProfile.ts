// src/hooks/useProfile.ts
import { useQuery } from '@tanstack/react-query';
import { fetchProfile } from '../services/profileService';

// Hook para buscar o perfil usando React Query.
// O "signal" do React Query cancela a requisição quando o componente sai da tela.
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: ({ signal }) => fetchProfile(signal),
  });
}
