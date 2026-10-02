# Portfólio Retrô — Windows XP / Orkut / MSN Messenger

Portfólio interativo com UI nostálgica dos anos 2000 (Windows XP, Orkut, MSN
Messenger), construído como SPA moderna: React + Vite + TypeScript no
frontend, e Vercel Serverless Functions + Supabase (PostgreSQL) no backend.

## Stack

- **Frontend:** React 18 + Vite + TypeScript, CSS puro (sem framework de UI pesado)
- **Backend:** Node.js via Vercel Serverless Functions (`/api`)
- **Banco de dados:** Supabase (PostgreSQL)
- **Cache/estado remoto:** TanStack Query
- **Hospedagem:** Vercel (frontend + funções serverless)

## Estrutura de pastas

```
portfolio-retro/
├── api/                  # Vercel Serverless Functions (projects, scraps, contact)
├── public/assets/        # imagens, sons e fontes retrô
├── src/
│   ├── components/
│   │   ├── desktop/      # Desktop, Taskbar, StartMenu, DesktopIcon
│   │   ├── windows/      # WindowManager, Window, WindowHeader, WindowContent
│   │   ├── apps/
│   │   │   ├── OrkutProfile/
│   │   │   ├── MSNMessenger/
│   │   │   └── ProjectsViewer/
│   │   └── shared/       # Button, Input, Modal
│   ├── hooks/            # useWindowManager, useSound, useLocalStorage
│   ├── services/         # api.ts, projectsService.ts, scrapsService.ts
│   ├── types/
│   ├── utils/
│   └── styles/           # global.css, windows-theme.css, orkut-theme.css, msn-theme.css
└── supabase/schema.sql   # schema do banco (projects, scraps, visitor_log)
```

## Como rodar localmente

```bash
npm install
npm run dev
```

O app abre em `http://localhost:3000`. **Sem configurar o Supabase**, os
services (`projectsService.ts`, `scrapsService.ts`) caem automaticamente em
dados mock, então a interface funciona de ponta a ponta mesmo sem backend —
ótimo para desenvolver a UI isoladamente.

Para testar as funções serverless localmente com a Vercel CLI:

```bash
npm i -g vercel
vercel dev
```

## Configurando o Supabase (produção)

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Rode o script `supabase/schema.sql` no SQL Editor do projeto.
3. Copie `.env.example` para `.env.local` e preencha:
   ```
   SUPABASE_URL=...
   SUPABASE_KEY=...
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
4. Popule a tabela `projects` com seus projetos reais (ou insira via painel do Supabase).

## Deploy na Vercel

```bash
vercel --prod
```

Configure as mesmas variáveis de ambiente (`SUPABASE_URL`, `SUPABASE_KEY`) no
painel da Vercel antes do deploy.

## Fluxo de navegação da UI

1. **Desktop estilo Windows XP** com ícones: Meu Computador, Orkut, MSN Messenger, Lixeira.
2. **Orkut** → perfil completo (foto, depoimentos, amigos, recados) + projetos como álbum de fotos, com "Ver mais" para expandir o grid.
3. **~3 segundos depois de abrir o Orkut**, uma janela do MSN abre sozinha (com som e efeito de vibração), listando os projetos em destaque como "contatos" — clicar em um abre um chat com detalhes do projeto.
4. **Lixeira** → easter egg.

## Assets pendentes

Os arquivos de som (`public/assets/sounds/`) e a fonte Tahoma
(`public/assets/fonts/tahoma.ttf`) continuam sendo placeholders — a Tahoma é
proprietária da Microsoft, então para produção prefira uma fonte livre
parecida (Verdana já está embutida como fallback, ou DejaVu Sans/Bitstream
Vera Sans).

Os ícones de janela (fechar/minimizar), setas de scrollbar e a textura da
scrollbar em `public/assets/icons/xp-controls/` vêm do projeto
[XP.css](https://github.com/botoxparty/XP.css) (MIT license — ver
`LICENSE-XPCSS.txt` na mesma pasta).

Os ícones de desktop (Meu Computador, Documentos, Lixeira, avatar genérico,
badges do Orkut/MSN) em `public/assets/images/icons/` foram desenhados do
zero para este projeto (pixel art simples com bisel/sombra) — de propósito,
para não depender de ícones originais do Windows 98/XP, que continuam sendo
propriedade da Microsoft mesmo quando espalhados por sites de terceiros.

O wallpaper (`windows-xp-bg.jpg`) também é uma composição própria, inspirada
no clássico "Bliss" (colina verde + céu azul), sem usar a fotografia
original.

## Detalhes implementados nesta rodada de fidelidade visual

- Scrollbar estilo XP (setas triangulares + thumb) via `::-webkit-scrollbar`
  (Chrome/Edge/Safari); fallback com `scrollbar-color` para Firefox.
- Boot sequence opcional: tela preta + barra de progresso verde segmentada ao
  entrar no site (mostra uma vez por sessão, com botão "pular »"). Usa um selo
  genérico próprio, não o logo da Microsoft.
- Efeito "ghost/outline" ao arrastar janelas: a janela fica parada e um
  contorno tracejado segue o mouse, aplicando a posição só ao soltar — como o
  XP com "mostrar conteúdo ao arrastar" desligado.
- Botões de janela (fechar/minimizar) com os ícones reais do Luna Theme.

## Otimizações já aplicadas

- Lazy loading dos componentes `OrkutProfile` e `MSNChat` (`React.lazy` + `Suspense`)
- `React.memo` implícito via componentes pequenos e desacoplados
- Cache de dados remotos com TanStack Query (`staleTime`/`gcTime` configuráveis)
- `manualChunks` no Vite para separar vendor bundle
- Fallback para dados mock quando a API não está disponível (dev sem backend)
