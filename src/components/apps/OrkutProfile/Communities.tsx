// src/components/apps/OrkutProfile/Communities.tsx
import React, { useEffect, useState } from 'react';
import { fetchCommunities } from '../../../services/communitiesService';
import type { Community } from '../../../types/community';
import { useLanguage } from '../../../hooks/useLanguage';

// Formata o número de membros de uma comunidade para exibição, usando a localidade atual para formatação.
function formatMembers(n: number, locale: string): string {
  return n.toLocaleString(locale);
}

// Desenho em pixel art (grade 10x10) do ícone de uma comunidade, como as miniaturas de baixa resolução do Orkut.
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

// Descrição de cada comunidade (aparece ao passar o mouse), ligada a projetos, cursos e experiências reais.
// A chave é o nome da comunidade; os textos são traduzidos por tc() (ver contentTranslations.ts).
// Na aba Comunidades a descrição também aparece escrita, abaixo do nome.
const COMMUNITY_DESCRIPTIONS: Record<string, string> = {
  'React.js & Next.js Lovers':
    'Front-end com React.js e Next.js: site institucional da Hub Connect Eventos e projetos como Doe Vida, ATSAdapta e Banco de Trocas.',
  'TypeScript Salvou Meu Código': 'Tipagem estática no front-end e no back-end — este portfólio é feito em TypeScript.',
  'Node.js em Aprendizado Contínuo':
    'APIs com Node.js, Express e Prisma: Banco de Trocas de Conhecimento e as funções serverless deste portfólio.',
  'C# & .NET Não São Só Café':
    'Back-end com C# e .NET, complementando a stack de React e Next.js — além de PHP e SQL no Form Generator.',
  'Scrum Fundamentals Certified': 'Certificação Scrum Fundamentals Certified (SFC™) — SCRUMstudy, jun/2025.',
  'Metodologias Ágeis: Daily Sem Drama':
    'Metodologias ágeis na prática — curso de extensão universitária USP/ESALQ (Acelerando Projetos de Sucesso).',
  'Liderei uma Equipe por 3 Anos e Sobrevivi': 'Três anos liderando a equipe voluntária da Associação Pedra Que Canta.',
  'Inovação Tecnológica e Inclusão':
    'Artigo científico sobre inovação tecnológica e inclusão escolar — Revista Processando o Saber, FATEC PG (2025).',
  'Voluntariado: Fazer o Bem Não Dói':
    'Vice-presidência da Associação Cultural e Comunitária Pedra Que Canta (2022 – dez/2025).',
  'Adaptabilidade & Diversidade Cultural': 'Intercâmbio em Dublin (ISI Dublin, 2025) e trabalho em equipes multidisciplinares.',
};

// Retorna um emoji representando a comunidade com base no nome e na categoria.
// (Atualização: em vez de emoji, devolve o desenho em pixel art da comunidade, no estilo das miniaturas do Orkut.)
function thumbnailFor(name: string, category: Community['category']): PixelArt {
  const normalized = name.toLowerCase();
  if (normalized.includes('react') || normalized.includes('next')) return PIXEL_ART.react;
  if (normalized.includes('typescript')) return PIXEL_ART.typescript;
  if (normalized.includes('c#') || normalized.includes('.net')) return PIXEL_ART.csharp;
  if (normalized.includes('node')) return PIXEL_ART.node;
  if (normalized.includes('scrum')) return PIXEL_ART.scrum;
  if (normalized.includes('ágeis') || normalized.includes('ageis')) return PIXEL_ART.agile;
  if (normalized.includes('lider')) return PIXEL_ART.trophy;
  if (normalized.includes('inova')) return PIXEL_ART.bulb;
  if (normalized.includes('volunt')) return PIXEL_ART.heart;
  if (normalized.includes('adapt')) return PIXEL_ART.globe;
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
interface CommunitiesProps {
  variant?: 'compact' | 'full';
}

// Componente que exibe a seção de comunidades no perfil do Orkut, incluindo título, link "ver todas" e lista de comunidades.
const Communities: React.FC<CommunitiesProps> = ({ variant = 'compact' }) => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, tc } = useLanguage(); // Hook personalizado para obter traduções e funções de tradução de texto.

  // Efeito colateral que busca as comunidades do serviço ao montar o componente.
  useEffect(() => {
    let mounted = true;
    // Chama a função fetchCommunities para buscar os dados das comunidades e atualiza o estado do componente.
    fetchCommunities().then((data) => {
      if (mounted) {
        // Ordem por relevância profissional: mais membros primeiro (garante a ordem mesmo se a API devolver fora de ordem).
        setCommunities([...data].sort((a, b) => b.members_count - a.members_count));
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  return (
    <section className="communities-section">
      <div className="section-heading">
        <h3>
          {t.communities.title}
          {!loading && ` (${communities.length})`}
        </h3>
        <a href="#" className="see-all-link" onClick={(e) => e.preventDefault()}>{t.communities.seeAll}</a>
      </div>
      {loading ? (
        <div className="loading-spinner">{t.orkut.loading}</div>
      ) : (
        <ul className={`communities-list communities-list--${variant}`}>
          {communities.map((c) => (
            <CommunityItem
              key={c.id}
              art={thumbnailFor(c.name, c.category)}
              name={tc(c.name)}
              membersText={`${formatMembers(c.members_count, t.locale)} ${t.communities.members}`}
              description={COMMUNITY_DESCRIPTIONS[c.name] ? tc(COMMUNITY_DESCRIPTIONS[c.name]) : undefined}
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