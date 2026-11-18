// src/components/apps/OrkutProfile/Communities.tsx
import React from 'react';
import { useCommunities } from '../../../hooks/useCommunities';
import type { Community } from '../../../types/community';
import { useLanguage } from '../../../hooks/useLanguage';
import { getLocalizedField } from '../../../utils/getLocalizedField';

// Formata o número de membros de uma comunidade para exibição, usando a localidade atual para formatação.
function formatMembers(n: number, locale: string): string {
  return n.toLocaleString(locale);
}

// Desenho em pixel art (grade 16x16) do ícone de uma comunidade, como as miniaturas de baixa resolução do Orkut.
// Cada letra da grade é uma cor da paleta e o "." é o fundo.
interface PixelArt {
  background: string;
  palette: Record<string, string>;
  rows: string[];
}

const PIXEL_ART: Record<string, PixelArt> = {
  react: {
    background: '#FFFFFF',
    palette: { p: '#7B3FE4', d: '#3B1A8F' },
    rows: [
      '................',
      '....pp....pp....',
      '...p..p..p..p...',
      '...p...pp...p...',
      '....p.p..p.p....',
      '....p.pppp.p....',
      '...ppp....ppp...',
      '.pp.pp.dd.pp.pp.',
      '.pp.pp.dd.pp.pp.',
      '...ppp....ppp...',
      '....p.pppp.p....',
      '....p.p..p.p....',
      '...p...pp...p...',
      '...p..p..p..p...',
      '....pp....pp....',
      '................',
    ],
  },
  // escudo azul com "TS"
  typescript: {
    background: '#FFFFFF',
    palette: { b: '#3178C6', d: '#1B4F8F', w: '#FFFFFF' },
    rows: [
      '................',
      '..dddddddddddd..',
      '.dbbbbbbbbbbbbd.',
      '.dbbbbbbbbbbbbd.',
      '.dbbwwwbbwwwbbd.',
      '.dbbbwbbbwbbbbd.',
      '.dbbbwbbbwwwbbd.',
      '.dbbbwbbbbbbwbd.',
      '.dbbbwbbbwwwbbd.',
      '.dbbbbbbbbbbbbd.',
      '..dbbbbbbbbbbd..',
      '...dbbbbbbbbd...',
      '....dbbbbbbd....',
      '.....dbbbbd.....',
      '......dbbd......',
      '.......dd.......',
    ],
  },
  // xícara de café marrom com "C" e o "#" roxo saindo como vapor
  csharp: {
    background: '#FFFFFF',
    palette: { n: '#4E2A10', b: '#9C5B2E', w: '#FFFFFF', s: '#B8A89A', v: '#7B2F9E', a: '#D9B77E' },
    rows: [
      '..........v.v...',
      '...s.....vvvvv..',
      '....s..s..v.v...',
      '...s..s..vvvvv..',
      '....s..s..v.v...',
      '................',
      '.nnnnnnnnnnn....',
      '.nbbbwwwbbbnnnn.',
      '.nbbbwbbbbbn..n.',
      '.nbbbwbbbbbn..n.',
      '.nbbbwbbbbbnnnn.',
      '.nbbbwwwbbbn....',
      '..nbbbbbbbn.....',
      '...nnnnnnn......',
      '.aaaaaaaaaaaa...',
      '................',
    ],
  },
  // folha verde (Node.js)
  node: {
    background: '#FFFFFF',
    palette: { g: '#68A063', d: '#2E5E2A', l: '#A8DB9C' },
    rows: [
      '................',
      '..........dddd..',
      '........ddggld..',
      '.......dggglgd..',
      '......dggglggd..',
      '.....dggglggd...',
      '....dggglgggd...',
      '...dggglgggd....',
      '...dgglgggd.....',
      '..dgglgggd......',
      '..dglgggd.......',
      '..dlggdd........',
      '..dddd..........',
      '..d.............',
      '.d..............',
      'd...............',
    ],
  },
  // quadro Scrum/Kanban laranja
  scrum: {
    background: '#FFFFFF',
    palette: { d: '#B85C00', h: '#E8801A', c: '#FF9F3D', y: '#FFD36B' },
    rows: [
      '................',
      '................',
      '.dddddddddddddd.',
      '.dhhhdhhhhdhhhd.',
      '.dcccdyyyydcccd.',
      '.dcccdyyyydcccd.',
      '.d...d....d...d.',
      '.dyyydccccd...d.',
      '.dyyydccccd...d.',
      '.d...d....d...d.',
      '.dcccd....d...d.',
      '.dcccd....d...d.',
      '.d...d....d...d.',
      '.dddddddddddddd.',
      '................',
      '................',
    ],
  },
  // calendário de sprint (azul, tarefas verdes e laranja)
  agile: {
    background: '#FFFFFF',
    palette: { d: '#2B5C9E', b: '#4A90E2', w: '#FFFFFF', g: '#4CAF50', o: '#FF9F3D' },
    rows: [
      '................',
      '...d........d...',
      '.dddddddddddddd.',
      '.dbbbbbbbbbbbbd.',
      '.dbbbbbbbbbbbbd.',
      '.dwwwwwwwwwwwwd.',
      '.dwgwwgwwgwwwwd.',
      '.dwwwwwwwwwwwwd.',
      '.dwgwwgwwowwwwd.',
      '.dwwwwwwwwwwwwd.',
      '.dwgwwowwwwwwwd.',
      '.dwwwwwwwwwwwwd.',
      '.dwwwwwwwwwwwwd.',
      '.dddddddddddddd.',
      '................',
      '................',
    ],
  },
  // troféu dourado
  trophy: {
    background: '#FFFFFF',
    palette: { o: '#B8860B', y: '#FFD23F', w: '#FFFFFF' },
    rows: [
      '................',
      '..oooooooooooo..',
      'oooyywyyyyyyyooo',
      'o.oyywyyyyyyyo.o',
      'o.oyyyyyyyyyyo.o',
      '.oooyyyyyyyyooo.',
      '....oyyyyyyo....',
      '.....oyyyyo.....',
      '......oyyo......',
      '.......oo.......',
      '.......oo.......',
      '.....oooooo.....',
      '....oyyyyyyo....',
      '....oooooooo....',
      '................',
      '................',
    ],
  },
  // lâmpada amarela com coração rosa
  bulb: {
    background: '#FFFFFF',
    palette: { o: '#B8860B', y: '#FFE55C', w: '#FFFFFF', k: '#8C8C8C', p: '#E0245E' },
    rows: [
      '................',
      '....oooooo......',
      '...oyyyyyyo.....',
      '..oyywyyyyyo....',
      '..oyywyyyyyo....',
      '..oyyyyyyyyo....',
      '..oyyyyyyyyo....',
      '...oyyyyyyo.....',
      '....oyyyyo......',
      '.....oyyo.......',
      '....kkkkkk.pp.pp',
      '.....kkkk..ppppp',
      '......kk....ppp.',
      '.............p..',
      '................',
      '................',
    ],
  },
  heart: {
    background: '#FFFFFF',
    palette: { d: '#A01040', r: '#E0245E', w: '#FFFFFF' },
    rows: [
      '................',
      '................',
      '...dddd..dddd...',
      '..drrrrddrrrrd..',
      '.drrwrrrrrrrrrd.',
      '.drwrrrrrrrrrrd.',
      '.drrrrrrrrrrrrd.',
      '.drrrrrrrrrrrrd.',
      '..drrrrrrrrrrd..',
      '...drrrrrrrrd...',
      '....drrrrrrd....',
      '.....drrrrd.....',
      '......drrd......',
      '.......dd.......',
      '................',
      '................',
    ],
  },
  globe: {
    background: '#FFFFFF',
    palette: { d: '#1E4F8F', b: '#4A90E2', g: '#4CAF50', t: '#E0B04A', w: '#FFFFFF' },
    rows: [
      '.....dddddd.....',
      '...ddwwwwwwdd...',
      '..dbbwwwwbbbbd..',
      '.dbgggggbbgggbd.',
      '.dbggggbbbggggd.',
      'dbbgggbbbbggggbd',
      'dbbbgbbbbtttgbbd',
      'dbbbbbbbttttbbbd',
      'dbbbgbbbttttbbbd',
      'dbbgggbbbtttbbbd',
      'dbbggbbbbbbbggbd',
      '.dbbbbbbbbgggbd.',
      '.dbbbbbbbbbbbbd.',
      '..dbbbbbbbbbbd..',
      '...ddbbbbbbdd...',
      '.....dddddd.....',
    ],
  },
};

// Retorna o desenho (pixel art) da comunidade pela coluna "icon" do banco (uma das chaves de PIXEL_ART).
// Sem icon (ou com um nome desconhecido), usa um desenho padrão pela categoria.
function thumbnailFor(icon: string | null, category: Community['category']): PixelArt {
  const art = icon ? PIXEL_ART[icon] : undefined;
  if (art) return art;
  return category === 'hard_skill' ? PIXEL_ART.bulb : PIXEL_ART.globe;
}

// Desenha a grade de pixels como um SVG (cada pixel é um quadradinho, sem suavização).
const PixelThumb: React.FC<{ art: PixelArt }> = ({ art }) => (
  <svg viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
    <rect width="16" height="16" fill={art.background} />
    {art.rows.flatMap((row, y) =>
      row.split('').map((cell, x) =>
        cell === '.' ? null : (
          <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={art.palette[cell]} />
        )
      )
    )}
  </svg>
);

interface CommunityItemProps {
  art: PixelArt;
  name: string;
  membersText: string;
  description?: string;
  categoryText?: string;
  variant: 'compact' | 'full';
}

// Item da lista de comunidades. O React.memo evita re-render quando as props (todas texto) não mudaram.
const CommunityItem = React.memo(function CommunityItem({ art, name, membersText, description, categoryText, variant }: CommunityItemProps) {
  return (
    <li className="community-item" title={description}>
      <span className="community-thumb" aria-hidden="true">
        <PixelThumb art={art} />
      </span>
      <span className="community-info">
        <span className="community-name">{name}</span>
        <span className="community-members">({membersText})</span>
        {variant === 'full' && description && <span className="community-description">{description}</span>}
        {variant === 'full' && categoryText && <span className="community-category">{categoryText}</span>}
      </span>
    </li>
  );
});

// 'compact' = lista vertical da sidebar direita; 'full' = cartões com descrição na aba Comunidades.
// onSeeAll (opcional): quando informado, aparece o link "Ver todas" no cabeçalho (ex.: a sidebar leva à aba Comunidades).
interface CommunitiesProps {
  variant?: 'compact' | 'full';
  searchTerm?: string;
  onSeeAll?: () => void;
}

// Componente que exibe a seção de comunidades no perfil do Orkut, incluindo título, link "ver todas" e lista de comunidades.
const Communities: React.FC<CommunitiesProps> = ({ variant = 'compact', searchTerm = '', onSeeAll }) => {
  // As comunidades vêm do React Query (useCommunities), que guarda o resultado em cache e cancela a busca se o componente sair da tela.
  const { data = [], isLoading: loading } = useCommunities();
  const { language, t } = useLanguage(); // Hook personalizado para obter o idioma atual e as traduções dos textos fixos.

  // Ordem por relevância profissional: mais membros primeiro (garante a ordem mesmo se a API devolver fora de ordem).
  const communities = [...data].sort((a, b) => b.members_count - a.members_count);

  // Filtra pelo texto da busca (nome ou descrição, no idioma atual); sem busca, mostra todas.
  const filteredCommunities = communities.filter((c) =>
    `${getLocalizedField(c, 'name', language)} ${getLocalizedField(c, 'description', language)}`.toLowerCase().includes(searchTerm)
  );

  return (
    <section className="communities-section">
      <div className="section-heading">
        <h3>
          {t.communities.title}
          {!loading && ` (${filteredCommunities.length})`}
        </h3>
        {onSeeAll && (
          <a
            href="#"
            className="see-all-link"
            onClick={(e) => {
              e.preventDefault();
              onSeeAll();
            }}
          >
            {t.communities.seeAll}
          </a>
        )}
      </div>
      {loading ? (
        <div className="loading-spinner">{t.orkut.loading}</div>
      ) : filteredCommunities.length === 0 ? (
        <p className="empty-state">{t.orkut.noResults}</p>
      ) : (
        <ul className={`communities-list communities-list--${variant}`}>
          {filteredCommunities.map((c) => (
            <CommunityItem
              key={c.id}
              art={thumbnailFor(c.icon, c.category)}
              name={getLocalizedField(c, 'name', language)}
              membersText={`${formatMembers(c.members_count, t.locale)} ${t.communities.members}`}
              description={getLocalizedField(c, 'description', language) || undefined}
              categoryText={`${t.communities.categoryLabel} ${c.category === 'hard_skill' ? t.communities.hardSkill : t.communities.softSkill}`}
              variant={variant}
            />
          ))}
        </ul>
      )}
    </section>
  );
};

export default Communities;
