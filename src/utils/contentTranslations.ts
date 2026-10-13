// src/utils/contentTranslations.ts
import type { Language } from '../types/language';

// Mapeamento de textos do site para suas traduções em inglês e espanhol.
interface ContentTranslation {
  en: string;
  es: string;
}

const CONTENT_TRANSLATIONS: Record<string, ContentTranslation> = {
  // ---- Perfil ----
  'Desenvolvedora Full Stack Jr | React.js | Next.js | TypeScript | Node.js': {
    en: 'Junior Full Stack Developer | React.js | Next.js | TypeScript | Node.js',
    es: 'Desarrolladora Full Stack Jr | React.js | Next.js | TypeScript | Node.js',
  },
  'Desenvolvedora Full Stack Júnior': {
    en: 'Junior Full Stack Developer',
    es: 'Desarrolladora Full Stack Júnior',
  },
  'Oi! Sou a Beatriz, Dev Full Stack Jr formada pela Fatec Praia Grande (2026). Trabalho com React, Next.js e Node.js. Na Hub Connect Eventos, criei um site do zero e melhorei a compreensão do comportamento do usuário em 20% com SEO e GA4. Já fiz intercâmbio em Dublin (ISI Dublin) e tenho certificação Scrum Fundamentals. Amo criar interfaces acessíveis e performáticas. Vamos conversar?': {
    en: "Hi! I'm Beatriz, a Junior Full Stack Dev who graduated from Fatec Praia Grande (2026). I work with React, Next.js and Node.js. At Hub Connect Eventos, I built a website from scratch and improved the understanding of user behavior by 20% with SEO and GA4. I also did an exchange program in Dublin (ISI Dublin) and hold a Scrum Fundamentals certification. I love building accessible, high-performance interfaces. Let's talk?",
    es: '¡Hola! Soy Beatriz, Dev Full Stack Jr graduada en la Fatec Praia Grande (2026). Trabajo con React, Next.js y Node.js. En Hub Connect Eventos, creé un sitio desde cero y mejoré la comprensión del comportamiento del usuario en un 20% con SEO y GA4. También hice un intercambio en Dublín (ISI Dublin) y tengo la certificación Scrum Fundamentals. Me encanta crear interfaces accesibles y de alto rendimiento. ¿Conversamos?',
  },

  // ---- Projetos ----
  'Doe Vida — Incentivo à Doação de Sangue': {
    en: 'Doe Vida — Encouraging Blood Donation',
    es: 'Doe Vida — Incentivo a la Donación de Sangre',
  },
  'SPA responsiva mobile-first que integra a OpenStreetMap API para localizar hemocentros próximos e calcular distância até o usuário.': {
    en: 'Responsive mobile-first SPA that integrates the OpenStreetMap API to locate nearby blood centers and calculate the distance to the user.',
    es: 'SPA responsiva mobile-first que integra la API de OpenStreetMap para ubicar hemocentros cercanos y calcular la distancia hasta el usuario.',
  },
  'Aplicação full stack colaborativa para criação e gerenciamento de formulários com lógica condicional, integrando front-end a back-end em PHP e banco SQL.': {
    en: 'Collaborative full stack application for creating and managing forms with conditional logic, integrating the front end with a PHP back end and a SQL database.',
    es: 'Aplicación full stack colaborativa para la creación y gestión de formularios con lógica condicional, integrando el front-end con un back-end en PHP y una base de datos SQL.',
  },
  'Portfolio Pessoal': {
    en: 'Personal Portfolio',
    es: 'Portafolio Personal',
  },
  'Portfólio pessoal construído do zero com HTML5, SCSS3 e JavaScript puro.': {
    en: 'Personal portfolio built from scratch with HTML5, SCSS3 and vanilla JavaScript.',
    es: 'Portafolio personal construido desde cero con HTML5, SCSS3 y JavaScript puro.',
  },
  'Reescreve currículos no método STAR e os adapta a vagas usando IA, com verificação de compatibilidade ATS e exportação em .txt, PDF e Word.': {
    en: 'Rewrites resumes using the STAR method and tailors them to job openings using AI, with ATS compatibility checking and export to .txt, PDF and Word.',
    es: 'Reescribe currículos con el método STAR y los adapta a vacantes usando IA, con verificación de compatibilidad ATS y exportación en .txt, PDF y Word.',
  },
  'Galeria de fotografias de paisagens com favoritos persistidos, filtros por categoria e design editorial em Vue 3.': {
    en: 'Landscape photography gallery with persisted favorites, category filters and editorial design, built with Vue 3.',
    es: 'Galería de fotografías de paisajes con favoritos persistentes, filtros por categoría y diseño editorial en Vue 3.',
  },
  'Banco de Trocas de Conhecimento': {
    en: 'Knowledge Exchange Bank',
    es: 'Banco de Intercambio de Conocimiento',
  },
  'Plataforma para trocar conhecimentos gratuitamente entre pessoas — API REST em Node/Express/Prisma e SPA em React, com autenticação JWT.': {
    en: 'Platform for people to exchange knowledge for free — REST API in Node/Express/Prisma and a React SPA, with JWT authentication.',
    es: 'Plataforma para intercambiar conocimientos gratuitamente entre personas — API REST en Node/Express/Prisma y SPA en React, con autenticación JWT.',
  },
  'Cinema de Terror': {
    en: 'Horror Cinema',
    es: 'Cine de Terror',
  },
  'Página temática de cinema de terror com animações, efeitos de jumpscare e modal interativo — primeiro projeto com SCSS.': {
    en: 'Horror-cinema themed page with animations, jumpscare effects and an interactive modal — first project with SCSS.',
    es: 'Página temática de cine de terror con animaciones, efectos de jumpscare y modal interactivo — primer proyecto con SCSS.',
  },

  // ---- Amigos (função exibida ao passar o mouse) ----
  'Banco de Trocas de Conhecimento — Fullstack, Arquitetura': {
    en: 'Knowledge Exchange Bank — Fullstack, Architecture',
    es: 'Banco de Intercambio de Conocimiento — Fullstack, Arquitectura',
  },
  'Banco de Trocas de Conhecimento — Fullstack': {
    en: 'Knowledge Exchange Bank — Fullstack',
    es: 'Banco de Intercambio de Conocimiento — Fullstack',
  },
  'Form Generator — Colaboradora': {
    en: 'Form Generator — Collaborator',
    es: 'Form Generator — Colaboradora',
  },
  'Banco de Trocas de Conhecimento — CRUD Conhecimentos': {
    en: 'Knowledge Exchange Bank — Knowledge CRUD',
    es: 'Banco de Intercambio de Conocimiento — CRUD de Conocimientos',
  },

  // ---- Comunidades ----
  'React.js & Next.js Lovers': {
    en: 'React.js & Next.js Lovers',
    es: 'Amantes de React.js y Next.js',
  },
  'TypeScript Salvou Meu Código': {
    en: 'TypeScript Saved My Code',
    es: 'TypeScript Salvó Mi Código',
  },
  'C# & .NET Não São Só Café': {
    en: 'C# & .NET Are Not Just Coffee',
    es: 'C# y .NET No Son Solo Café',
  },
  'Node.js em Aprendizado Contínuo': {
    en: 'Node.js in Continuous Learning',
    es: 'Node.js en Aprendizaje Continuo',
  },
  'Inovação Tecnológica e Inclusão': {
    en: 'Technological Innovation and Inclusion',
    es: 'Innovación Tecnológica e Inclusión',
  },
  'Adaptabilidade & Diversidade Cultural': {
    en: 'Adaptability & Cultural Diversity',
    es: 'Adaptabilidad y Diversidad Cultural',
  },
  'Liderei uma Equipe por 3 Anos e Sobrevivi': {
    en: 'I Led a Team for 3 Years and Survived',
    es: 'Lideré un Equipo por 3 Años y Sobreviví',
  },
  'Metodologias Ágeis: Daily Sem Drama': {
    en: 'Agile Methodologies: Drama-Free Daily',
    es: 'Metodologías Ágiles: Daily Sin Drama',
  },
  'Voluntariado: Fazer o Bem Não Dói': {
    en: "Volunteering: Doing Good Doesn't Hurt",
    es: 'Voluntariado: Hacer el Bien No Duele',
  },

  // ---- Comunidades (descrições exibidas ao passar o mouse) ----
  'Front-end com React.js e Next.js: site institucional da Hub Connect Eventos e projetos como Doe Vida e Banco de Trocas.': {
    en: 'Front end with React.js and Next.js: the Hub Connect Eventos institutional website and projects such as Doe Vida and Banco de Trocas.',
    es: 'Front-end con React.js y Next.js: el sitio institucional de Hub Connect Eventos y proyectos como Doe Vida y Banco de Trocas.',
  },
  'Tipagem estática no front-end e no back-end — este portfólio é feito em TypeScript.': {
    en: 'Static typing on the front end and the back end — this portfolio is built with TypeScript.',
    es: 'Tipado estático en el front-end y en el back-end — este portafolio está hecho con TypeScript.',
  },
  'APIs com Node.js, Express e Prisma: Banco de Trocas de Conhecimento e as funções serverless deste portfólio.': {
    en: "APIs with Node.js, Express and Prisma: the Knowledge Exchange Bank and this portfolio's serverless functions.",
    es: 'APIs con Node.js, Express y Prisma: el Banco de Intercambio de Conocimiento y las funciones serverless de este portafolio.',
  },
  'Back-end com C# e .NET, complementando a stack de React e Next.js.': {
    en: 'Back end with C# and .NET, complementing the React and Next.js stack.',
    es: 'Back-end con C# y .NET, complementando el stack de React y Next.js.',
  },
  'Certificação Scrum Fundamentals Certified (SFC™) — SCRUMstudy, jun/2025.': {
    en: 'Scrum Fundamentals Certified (SFC™) certification — SCRUMstudy, Jun/2025.',
    es: 'Certificación Scrum Fundamentals Certified (SFC™) — SCRUMstudy, jun/2025.',
  },
  'Metodologias ágeis na prática — curso de extensão universitária USP/ESALQ (Acelerando Projetos de Sucesso).': {
    en: 'Agile methodologies in practice — USP/ESALQ university extension course (Accelerating Successful Projects).',
    es: 'Metodologías ágiles en la práctica — curso de extensión universitaria USP/ESALQ (Acelerando Proyectos de Éxito).',
  },
  'Três anos liderando a equipe voluntária da Associação Pedra Que Canta.': {
    en: 'Three years leading the volunteer team at the Pedra Que Canta Association.',
    es: 'Tres años liderando al equipo voluntario de la Asociación Pedra Que Canta.',
  },
  'Artigo científico sobre inovação tecnológica e inclusão escolar — Revista Processando o Saber, FATEC PG (2025).': {
    en: 'Scientific paper on technological innovation and school inclusion — Revista Processando o Saber, FATEC PG (2025).',
    es: 'Artículo científico sobre innovación tecnológica e inclusión escolar — Revista Processando o Saber, FATEC PG (2025).',
  },
  'Vice-presidência da Associação Cultural e Comunitária Pedra Que Canta (2022 – dez/2025).': {
    en: 'Vice presidency of the Pedra Que Canta Cultural and Community Association (2022 – Dec/2025).',
    es: 'Vicepresidencia de la Asociación Cultural y Comunitaria Pedra Que Canta (2022 – dic/2025).',
  },
  'Intercâmbio em Dublin (ISI Dublin, 2025) e trabalho em equipes multidisciplinares.': {
    en: 'Study abroad in Dublin (ISI Dublin, 2025) and work in multidisciplinary teams.',
    es: 'Intercambio en Dublín (ISI Dublin, 2025) y trabajo en equipos multidisciplinarios.',
  },
};

// Função que traduz um texto para o idioma especificado, usando o mapeamento de traduções.
export function translateContent(text: string, language: Language): string {
  if (language === 'pt') return text;
  return CONTENT_TRANSLATIONS[text]?.[language] ?? text;
}