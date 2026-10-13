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
    background: '#20232A',
    palette: { c: '#61DAFB' },
    rows: [
      '....cc....',
      '...cccc...',
      '.cc.cc.cc.',
      'c...cc...c',
      'c..cccc..c',
      'c..cccc..c',
      'c...cc...c',
      '.cc.cc.cc.',
      '...cccc...',
      '....cc....',
    ],
  },
  typescript: {
    background: '#3178C6',
    palette: { w: '#FFFFFF' },
    rows: [
      '..........',
      '..........',
      '.www.www..',
      '..w..w....',
      '..w..www..',
      '..w....w..',
      '..w..www..',
      '..........',
      '..........',
      '..........',
    ],
  },
  csharp: {
    background: '#68217A',
    palette: { w: '#FFFFFF' },
    rows: [
      '..........',
      '..........',
      '.www.w.w..',
      '.w...www..',
      '.w...w.w..',
      '.w...www..',
      '.www.w.w..',
      '..........',
      '..........',
      '..........',
    ],
  },
  node: {
    background: '#1E1E1E',
    palette: { g: '#68A063', w: '#FFFFFF' },
    rows: [
      '....gg....',
      '..gggggg..',
      '.gggggggg.',
      'gggggggggg',
      'ggggwwgggg',
      'ggggwwgggg',
      'gggggggggg',
      '.gggggggg.',
      '..gggggg..',
      '....gg....',
    ],
  },
  scrum: {
    background: '#1C2F6B',
    palette: { c: '#FFCC33', w: '#FFFFFF' },
    rows: [
      '..cccccc..',
      '.cc....cc.',
      'cc.www..cc',
      'c..w.....c',
      'c..www...c',
      'c....w...c',
      'cc.www..cc',
      '.cc....cc.',
      '..cccccc..',
      '..........',
    ],
  },
  agile: {
    background: '#DBE8FA',
    palette: { r: '#E2574C', y: '#F5C542', g: '#4CAF50' },
    rows: [
      '..........',
      '.rr.yy.gg.',
      '.rr.yy.gg.',
      '..........',
      '.rr.yy....',
      '.rr.yy....',
      '..........',
      '.rr.......',
      '.rr.......',
      '..........',
    ],
  },
  crown: {
    background: '#7A2A8F',
    palette: { y: '#FFD23F', o: '#C98A00' },
    rows: [
      '..........',
      'y...yy...y',
      'yy..yy..yy',
      'yyy.yy.yyy',
      'yyyyyyyyyy',
      'yyyyyyyyyy',
      'yyyyyyyyyy',
      '.oooooooo.',
      '..........',
      '..........',
    ],
  },
  bulb: {
    background: '#1D3B7A',
    palette: { y: '#FFE55C', g: '#AAAAAA' },
    rows: [
      '...yyyy...',
      '..yyyyyy..',
      '.yyyyyyyy.',
      '.yyyyyyyy.',
      '.yyyyyyyy.',
      '..yyyyyy..',
      '...gggg...',
      '...gggg...',
      '....gg....',
      '..........',
    ],
  },
  heart: {
    background: '#FDE7EF',
    palette: { r: '#E0245E', w: '#FFFFFF' },
    rows: [
      '..........',
      '.rr....rr.',
      'rwrr..rrrr',
      'rrrrrrrrrr',
      'rrrrrrrrrr',
      '.rrrrrrrr.',
      '..rrrrrr..',
      '...rrrr...',
      '....rr....',
      '..........',
    ],
  },
  globe: {
    background: '#CFE8FF',
    palette: { b: '#2F80ED', g: '#3FAE49' },
    rows: [
      '..bbbbbb..',
      '.bbgggbbb.',
      'bbgggbbbbb',
      'bbggbbbggb',
      'bbbbbbgggb',
      'bbbbbgggbb',
      'bbgbbbbbbb',
      '.bbgbbbbb.',
      '..bbbbbb..',
      '..........',
    ],
  },
};

// Descrição de cada comunidade (aparece ao passar o mouse), ligada a projetos, cursos e experiências reais.
// A chave é o nome da comunidade; os textos são traduzidos por tc() (ver contentTranslations.ts).
const COMMUNITY_DESCRIPTIONS: Record<string, string> = {
  'React.js & Next.js Lovers':
    'Front-end com React.js e Next.js: site institucional da Hub Connect Eventos e projetos como Doe Vida e Banco de Trocas.',
  'TypeScript Salvou Meu Código': 'Tipagem estática no front-end e no back-end — este portfólio é feito em TypeScript.',
  'Node.js em Aprendizado Contínuo':
    'APIs com Node.js, Express e Prisma: Banco de Trocas de Conhecimento e as funções serverless deste portfólio.',
  'C# & .NET Não São Só Café': 'Back-end com C# e .NET, complementando a stack de React e Next.js.',
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
  if (normalized.includes('lider')) return PIXEL_ART.crown;
  if (normalized.includes('inova')) return PIXEL_ART.bulb;
  if (normalized.includes('volunt')) return PIXEL_ART.heart;
  if (normalized.includes('adapt')) return PIXEL_ART.globe;
  return category === 'hard_skill' ? PIXEL_ART.bulb : PIXEL_ART.globe;
}

// Desenha a grade de pixels como um SVG (cada pixel é um quadradinho, sem suavização).
const PixelThumb: React.FC<{ art: PixelArt }> = ({ art }) => (
  <svg viewBox="0 0 10 10" shapeRendering="crispEdges" aria-hidden="true">
    <rect width="10" height="10" fill={art.background} />
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
}

// Item da lista de comunidades. O React.memo evita re-render quando as props (todas texto) não mudaram.
const CommunityItem = React.memo(function CommunityItem({ art, name, membersText, description }: CommunityItemProps) {
  return (
    <li className="community-item" title={description}>
      <span className="community-thumb" aria-hidden="true">
        <PixelThumb art={art} />
      </span>
      <span className="community-name">{name}</span>
      <span className="community-members">({membersText})</span>
    </li>
  );
});

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
        <h3>
          {t.communities.title}
          {!loading && ` (${communities.length})`}
        </h3>
        <a href="#" className="see-all-link" onClick={(e) => e.preventDefault()}>{t.communities.seeAll}</a>
      </div>
      {loading ? (
        <div className="loading-spinner">{t.orkut.loading}</div>
      ) : (
        <ul className="communities-list">
          {communities.map((c) => (
            <CommunityItem
              key={c.id}
              art={thumbnailFor(c.name, c.category)}
              name={tc(c.name)}
              membersText={`${formatMembers(c.members_count, t.locale)} ${t.communities.members}`}
              description={COMMUNITY_DESCRIPTIONS[c.name] ? tc(COMMUNITY_DESCRIPTIONS[c.name]) : undefined}
            />
          ))}
        </ul>
      )}
    </section>
  );
};

export default Communities;