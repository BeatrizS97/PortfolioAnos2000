// src/App.tsx
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import BootSequence from './components/desktop/BootSequence';
import ReloadError from './components/shared/ReloadError';
import { useLanguage } from './hooks/useLanguage';
import { fetchProjects } from './services/projectsService';
import { registerFirstVisit } from './services/visitsService';
import { fetchProfile } from './services/profileService';
import { fetchFriends } from './services/friendsService';
import { fetchCommunities } from './services/communitiesService';
import {
  fetchEducation,
  fetchLanguages,
  fetchCertifications,
  fetchExperience,
  fetchExchange,
  fetchPublications,
} from './services/academicService';

// O Desktop é carregado sob demanda: a tela de boot aparece sem esperar o código das janelas e apps.
const loadDesktop = () => import('./components/desktop/Desktop');
const Desktop = lazy(loadDesktop);

type AppStatus = 'booting' | 'loading-data' | 'ready' | 'error';

interface AppState {
  status: AppStatus;
}

// Componente principal do aplicativo, que gerencia a sequência de inicialização e exibe a área de trabalho após o boot.
const App: React.FC = () => {
  const [state, setState] = useState<AppState>({ status: 'booting' });
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  // Começa a buscar os dados do Orkut (projetos, perfil, amigos, comunidades e as seções da aba Perfil) enquanto a animação de boot roda.
  // As chaves são as mesmas dos hooks (useProjects, useProfile...), então, quando o Orkut abrir, os dados já estão no cache.
  // Se uma busca falhar, nada quebra: o hook do Orkut tenta de novo normalmente.
  useEffect(() => {
    void queryClient.prefetchQuery({ queryKey: ['projects'], queryFn: ({ signal }) => fetchProjects(signal) });
    void queryClient.prefetchQuery({ queryKey: ['profile'], queryFn: ({ signal }) => fetchProfile(signal) });
    void queryClient.prefetchQuery({ queryKey: ['friends'], queryFn: ({ signal }) => fetchFriends(signal) });
    void queryClient.prefetchQuery({ queryKey: ['communities'], queryFn: ({ signal }) => fetchCommunities(signal) });
    // Seções da aba Perfil (mesmas chaves de useAcademicInfo.ts): sem isto, cada uma só começava a carregar ao abrir a aba.
    void queryClient.prefetchQuery({ queryKey: ['education'], queryFn: ({ signal }) => fetchEducation(signal) });
    void queryClient.prefetchQuery({ queryKey: ['languageSkills'], queryFn: ({ signal }) => fetchLanguages(signal) });
    void queryClient.prefetchQuery({ queryKey: ['certifications'], queryFn: ({ signal }) => fetchCertifications(signal) });
    void queryClient.prefetchQuery({ queryKey: ['experience'], queryFn: ({ signal }) => fetchExperience(signal) });
    void queryClient.prefetchQuery({ queryKey: ['exchange'], queryFn: ({ signal }) => fetchExchange(signal) });
    void queryClient.prefetchQuery({ queryKey: ['publications'], queryFn: ({ signal }) => fetchPublications(signal) });
  }, [queryClient]);

  // Conta a visita (só na primeira vez que este navegador abre o site). Falhas são ignoradas dentro da função.
  useEffect(() => {
    void registerFirstVisit();
  }, []);

  // Já começa a baixar o Desktop enquanto a animação de boot roda. Se falhar, o erro é tratado ao fim do boot.
  useEffect(() => {
    void loadDesktop().catch(() => undefined);
  }, []);

  // Ao terminar o boot, garante que o Desktop foi carregado antes de mostrá-lo.
  const handleBootFinish = () => {
    setState({ status: 'loading-data' });
    loadDesktop()
      .then(() => setState({ status: 'ready' }))
      .catch(() => setState({ status: 'error' }));
  };

  if (state.status === 'booting') {
    return <BootSequence onFinish={handleBootFinish} />;
  }

  // Textos da tela de erro ao carregar a área de trabalho: t.shell.errors.
  if (state.status === 'error') {
    return <ReloadError message={t.shell.errors.loadDesktop} />;
  }

  // Tela preta (sem texto visível) entre o boot e a área de trabalho: o texto "Carregando..." piscava na tela.
  // O aria-label mantém o aviso para leitores de tela.
  if (state.status === 'loading-data') {
    return <div className="loading-screen loading-screen--boot" role="status" aria-label={t.orkut.loading} />;
  }

  return (
    <Suspense fallback={<div className="loading-screen loading-screen--boot" role="status" aria-label={t.orkut.loading} />}>
      <Desktop />
    </Suspense>
  );
};

export default App;