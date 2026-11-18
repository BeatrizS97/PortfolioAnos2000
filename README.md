# 🖥️ Portfólio Retrô — Windows XP · Orkut · MSN Messenger

> Um portfólio interativo que parece um computador dos anos 2000. Por dentro, é uma aplicação full stack moderna, em TypeScript, com dados reais vindos de um banco, assistente de IA e interface em três idiomas.

<!-- Adicione aqui o link do deploy, por exemplo: **🔗 Demo:** https://seu-portfolio.vercel.app -->

**Feito por [Beatriz Silva Santos](https://github.com/BeatrizS97)** · Desenvolvedora Full Stack Jr · [LinkedIn](https://www.linkedin.com/in/beatrizsilvasantos-dev)

---

## ✨ O que você encontra aqui

### 🪟 Área de trabalho estilo Windows XP
- Tela de boot com barra de progresso e botão **pular »** (aparece a cada carregamento da página).
- Janelas que arrastam (com contorno "fantasma", como no XP), minimizam, maximizam e voltam ao lugar em que foram deixadas.
- Barra de tarefas com menu Iniciar, relógio, botão de som e troca de idioma.
- Ícones que podem ser arrastados; as posições ficam salvas no navegador.

### 👥 Orkut: o portfólio em si
- Abas **Início**, **Perfil** e **Comunidades**, com busca.
- Projetos em formato de "álbum de fotos", com tecnologias, link do código e link da versão online.
- **Recados** (scraps) públicos, com paginação, e modo administradora para excluir (exclusão lógica, o recado continua no banco).
- **Depoimentos** por e-mail (Resend), com barra de formatação e pré-visualização.
- Download do currículo em PDF no idioma escolhido.

### 💬 MSN Messenger: o Jarvis
- Chat com um assistente de IA (Gemini API) que responde sobre a Beatriz usando **somente dados reais**: o banco de dados e os READMEs dos repositórios do GitHub, para não inventar nada.
- Se a IA estiver fora do ar, o chat responde por uma base local de palavras-chave.
- Barra de formatação (fonte, cor, emoticons, winks, planos de fundo), "chamar a atenção" (a tela treme) e histórico salvo no navegador.

### 🌎 Três idiomas
Português, inglês e espanhol: textos fixos em `translations.ts` e conteúdo do banco nas colunas `_pt`, `_en` e `_es`.

---

## 🧰 Stack

| Camada | Tecnologias |
| --- | --- |
| Front-end | React 18 · Vite 5 · TypeScript (strict) · CSS puro |
| Dados no front | TanStack Query (cache, prefetch e cancelamento de requisições) · Zod |
| Back-end | Vercel Serverless Functions (Node.js) em `/api` |
| Banco de dados | Supabase (PostgreSQL) com RLS |
| IA | Gemini API |
| E-mail | Resend |
| Hospedagem | Vercel |

## 🏗️ Decisões de projeto

- **Sem dados mockados:** tudo que aparece vem do banco, via `/api`. Se a API falhar, as listas ficam vazias e a interface não quebra.
- **Segurança básica na API:** validação com Zod, limpeza de HTML/JS nos textos, limite de requisições por IP, chave de administrador só no header e RLS nas tabelas.
- **Desempenho:** os dados do Orkut começam a ser buscados durante o boot, os apps abrem por *lazy loading*, as respostas da API usam cache de 5 minutos e o bundle separa o `vendor`.
- **Acessibilidade:** foco preso em modais, navegação por teclado, `aria-*` nos controles e respeito a `prefers-reduced-motion`.
- **Limite de funções da Vercel (plano Hobby, 12):** as seções acadêmicas (formação, idiomas, certificações, experiência, intercâmbio e publicações) usam uma única função, `/api/academic?section=...`.
- **Visual 100% próprio:** ícones e wallpaper desenhados do zero, sem usar imagens da Microsoft. Os controles de janela e a scrollbar vêm do [XP.css](https://github.com/botoxparty/XP.css) (licença MIT).

## 📁 Estrutura de pastas

```
portfolio-retro/
├── api/                  # Vercel Serverless Functions
│   ├── academic.ts       #   formação, idiomas, certificações, experiência, intercâmbio, publicações
│   ├── communities.ts    #   comunidades
│   ├── friends.ts        #   amigos
│   ├── gemini-chat.ts    #   chat com IA (Jarvis)
│   ├── profile.ts        #   perfil
│   ├── projects.ts       #   projetos
│   ├── scraps.ts         #   recados (GET, POST e DELETE)
│   ├── testimonial.ts    #   depoimentos por e-mail
│   └── _*.ts             #   utilitários compartilhados (não viram rotas)
├── public/assets/        # imagens, sons, fontes e currículos
├── src/
│   ├── components/
│   │   ├── desktop/      #   Desktop, Taskbar, StartMenu, BootSequence
│   │   ├── windows/      #   WindowManager, Window, WindowHeader, WindowContent
│   │   ├── apps/         #   OrkutProfile, MSNMessenger, ProjectsViewer
│   │   └── shared/       #   Button, Input, Modal, RetroDialog, CharCounter...
│   ├── hooks/            #   estado e regras reutilizáveis (janelas, idioma, som, dados)
│   ├── services/         #   chamadas à API
│   ├── types/            #   tipos e schemas Zod
│   ├── utils/            #   constantes, traduções e funções auxiliares
│   └── styles/           #   temas Windows XP, Orkut e MSN
└── supabase/schema.sql   # tabelas, seeds, RLS e ajustes
```

## 🚀 Como rodar localmente

Pré-requisitos: Node.js 20+, uma conta no Supabase e a [Vercel CLI](https://vercel.com/docs/cli).

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Crie o banco: no **SQL Editor** do Supabase, rode o `supabase/schema.sql`.
3. Crie o arquivo `.env.local` na raiz do projeto:
   ```
   SUPABASE_URL=...
   SUPABASE_KEY=...            # chave service_role (fica só no servidor, nunca no front)
   ADMIN_KEY=...               # chave para excluir recados
   RESEND_API_KEY=...          # e-mails de depoimento
   CONTACT_TO_EMAIL=...        # quem recebe os depoimentos
   CONTACT_FROM_EMAIL=...      # opcional (padrão: onboarding@resend.dev)
   GEMINI_API_KEY=...          # chat com IA
   GEMINI_MODEL=...            # opcional
   GITHUB_TOKEN=...            # opcional: aumenta o limite da API do GitHub
   ```
4. Em um terminal, suba a API:
   ```bash
   vercel dev --listen 3001
   ```
5. Em outro terminal, suba o front:
   ```bash
   npm run dev
   ```
   O site abre em `http://localhost:3000` (o Vite repassa `/api` para a porta 3001).

> **Windows:** se o `vercel dev` falhar com `EPERM ... symlink`, ative o **Modo de Desenvolvedor** (Configurações → Sistema → Para desenvolvedores).

Sem a API rodando, o site abre, mas as listas aparecem vazias.

## ☁️ Deploy

```bash
vercel --prod
```

Configure as mesmas variáveis de ambiente do passo 3 no painel da Vercel antes do deploy.

## 🗄️ Banco de dados

Tabelas: `profile`, `projects`, `communities`, `friends`, `scraps`, `testimonial_requests`, `education`, `languages`, `certifications`, `experience`, `exchange` e `publications`.

Os textos que mudam de idioma ficam em colunas `_pt`, `_en` e `_es`. Para mudar um texto do site, basta editar a linha no Supabase.

## 📌 Pendências de assets

Os arquivos de som em `public/assets/sounds/` e a fonte Tahoma (`public/assets/fonts/tahoma.ttf`) são placeholders. A Tahoma é proprietária da Microsoft, então, em produção, prefira uma fonte livre parecida (a Verdana já está embutida como alternativa).