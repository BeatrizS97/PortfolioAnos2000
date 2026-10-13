// src/hooks/useProfile.ts
import { useQuery } from '@tanstack/react-query';
import { fetchProfile } from '../services/profileService';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: ({ signal }) => fetchProfile(signal),
    staleTime: 5 * 60 * 1000,
  });
}