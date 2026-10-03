// src/components/apps/OrkutProfile/Communities.tsx
import React, { useEffect, useState } from 'react';
import { fetchCommunities } from '../../../services/communitiesService';
import type { Community } from '../../../types/community';
import { useLanguage } from '../../../hooks/useLanguage';

// Formata o número de membros de uma comunidade para exibição, usando a localidade atual para formatação.
function formatMembers(n: number, locale: string): string {
  return n.toLocaleString(locale);
}

// Retorna um emoji representando a comunidade com base no nome e na categoria.
function thumbnailFor(name: string, category: Community['category']): string {
  const normalized = name.toLowerCase();
  if (normalized.includes('react') || normalized.includes('next')) return '⚛️';
  if (normalized.includes('typescript')) return '🔷';
  if (normalized.includes('c#') || normalized.includes('.net')) return '🎯';
  if (normalized.includes('node')) return '🟢';
  if (normalized.includes('scrum')) return '🌀';
  return category === 'hard_skill' ? '🎓' : '🌟';
}

// Componente que exibe a seção de comunidades no perfil do Orkut, incluindo título, link "ver todas" e lista de comunidades.
const Communities: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, tc } = useLanguage(); // Hook personalizado para obter traduções e funções de tradução de texto.

  // Efeito colateral que busca as comunidades do serviço ao montar o componente.
  useEffect(() => {
    let mounted = true;
    // Chama a função fetchCommunities para buscar os dados das comunidades e atualiza o estado do componente.
    fetchCommunities().then((data) => {
      if (mounted) {
        setCommunities(data);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  return (
    <section className="communities-section">
      <div className="section-heading">
        <h3>{t.communities.title}</h3>
        <a href="#" className="see-all-link" onClick={(e) => e.preventDefault()}>{t.communities.seeAll}</a>
      </div>
      {loading ? (
        <div className="loading-spinner">{t.orkut.loading}</div>
      ) : (
        <ul className="communities-list">
          {communities.map((c) => (
            <li key={c.id} className="community-item">
              <span className="community-thumb" aria-hidden="true">{thumbnailFor(c.name, c.category)}</span>
              <div className="community-info">
                <span className="community-name">{tc(c.name)}</span>
                <span className="community-members">{formatMembers(c.members_count, t.locale)} {t.communities.members}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Communities;