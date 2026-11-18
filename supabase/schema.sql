-- Tabela de Perfil (dados pessoais exibidos no Orkut)
CREATE TABLE profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  headline VARCHAR(255),
  location VARCHAR(255),
  about_me TEXT,
  photo_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Comunidades (hard/soft skills, estilo Orkut)
CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  members_count INTEGER DEFAULT 0,
  category VARCHAR(20) CHECK (category IN ('hard_skill', 'soft_skill')) DEFAULT 'hard_skill'
);

-- Tabela de Amigos (colaboradores reais de projetos)
CREATE TABLE friends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  role VARCHAR(255),
  order_index INTEGER DEFAULT 0
);

-- Tabela de Projetos
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  tech_stack TEXT[],
  github_url VARCHAR(500),
  live_url VARCHAR(500),
  image_url VARCHAR(500),
  category VARCHAR(100),
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Comentários públicos (Scraps do Orkut)
CREATE TABLE scraps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name VARCHAR(255) NOT NULL,
  author_avatar VARCHAR(500),
  message TEXT NOT NULL,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de pedidos de depoimento (enviados por e-mail, não públicos)
CREATE TABLE testimonial_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_scraps_created ON scraps(created_at DESC);
CREATE INDEX idx_testimonial_requests_created ON testimonial_requests(created_at DESC);
CREATE INDEX idx_communities_category ON communities(category);
CREATE INDEX idx_friends_order ON friends(order_index);

-- ------------------------------------------------------------------
-- Seed: dados reais de Beatriz Silva Santos
-- ------------------------------------------------------------------

INSERT INTO profile (full_name, headline, location, about_me, photo_url) VALUES (
  'Beatriz Silva Santos',
  'Desenvolvedora Full Stack Jr | React.js | Next.js | TypeScript | Node.js',
  'Itanhaém, São Paulo',
  'Oi! Sou a Beatriz, Dev Full Stack Jr formada pela Fatec Praia Grande (2026). Trabalho com React, Next.js e Node.js. Já fiz intercâmbio em Dublin (ISI Dublin) e tenho certificação Scrum Fundamentals. Amo criar interfaces acessíveis e performáticas.',
  '/assets/images/icons/user.png'
);

INSERT INTO communities (name, members_count, category) VALUES
  ('React.js & Next.js Lovers', 1518382, 'hard_skill'),
  ('TypeScript Salvou Meu Código', 674921, 'hard_skill'),
  ('C# & .NET Não São Só Café', 341207, 'hard_skill'),
  ('Node.js em Aprendizado Contínuo', 512883, 'hard_skill'),
  ('Scrum Fundamentals Certified', 156732, 'hard_skill'),
  ('Metodologias Ágeis: Daily Sem Drama', 143310, 'soft_skill'),
  ('Inovação Tecnológica e Inclusão', 98214, 'soft_skill'),
  ('Voluntariado: Fazer o Bem Não Dói', 91337, 'soft_skill'),
  ('Adaptabilidade & Diversidade Cultural', 87654, 'soft_skill'),
  ('Liderei uma Equipe por 3 Anos e Sobrevivi', 112480, 'soft_skill');

INSERT INTO friends (name, avatar_url, role, order_index) VALUES
  ('Marcela Santiago', '/assets/images/icons/user-placeholder.png', 'Banco de Trocas de Conhecimento — Fullstack, Arquitetura', 1),
  ('Tatiana Nunes', '/assets/images/icons/user-placeholder.png', 'Form Generator — Colaboradora', 2),
  ('Patrick Silva', '/assets/images/icons/user-placeholder.png', 'Banco de Trocas de Conhecimento — CRUD Conhecimentos', 3);

-- github_url preenchido para ATSAdapta, InspireFoto, Banco de Trocas de
-- Conhecimento e Cinema de Terror (item "c" do pedido) — antes ficavam NULL
-- e por isso o card desses projetos não mostrava o link "GitHub".
INSERT INTO projects (title, description, tech_stack, github_url, live_url, image_url, category, featured, order_index) VALUES
  (
    'Doe Vida — Incentivo à Doação de Sangue',
    'SPA responsiva mobile-first que integra a OpenStreetMap API para localizar hemocentros próximos e calcular distância até o usuário.',
    ARRAY['React.js', 'Vite', 'Tailwind CSS', 'OpenStreetMap API'],
    'https://github.com/BeatrizS97/Projeto-Doe-Vida', 'https://projeto-doe-vida.vercel.app/', '/assets/images/projects/doe-vida.png',
    'frontend', true, 1
  ),
  (
    'Form Generator',
    'Aplicação full stack colaborativa para criação e gerenciamento de formulários com lógica condicional, integrando front-end a back-end em PHP e banco SQL.',
    ARRAY['HTML', 'CSS', 'JavaScript', 'PHP', 'SQL'],
    'https://github.com/tatcom23/Form-Generator', '', '/assets/images/projects/form-generator.png',
    'fullstack', true, 2
  ),
  (
    'Portfolio Pessoal',
    'Portfólio pessoal construído do zero com HTML5, SCSS3 e JavaScript puro.',
    ARRAY['HTML5', 'SCSS3', 'JavaScript'],
    'https://github.com/BeatrizS97', 'https://beatrizs97.github.io/Portfolio/', '/assets/images/projects/portfolio-pessoal.png',
    'frontend', true, 3
  ),
  (
    'ATSAdapta',
    'Reescreve currículos no método STAR e os adapta a vagas usando IA, com verificação de compatibilidade ATS e exportação em .txt, PDF e Word.',
    ARRAY['React', 'Vite', 'Gemini API', 'pdfkit', 'docx'],
    'https://github.com/BeatrizS97/ATSAdapta', '', '/assets/images/projects/ats-adapta.png',
    'ai', true, 4
  ),
  (
    'InspireFoto',
    'Galeria de fotografias de paisagens com favoritos persistidos, filtros por categoria e design editorial em Vue 3.',
    ARRAY['Vue 3', 'Vite', 'SCSS'],
    'https://github.com/BeatrizS97/Projeto-Inspire-Foto', 'https://projeto-inspire-foto.vercel.app/', '/assets/images/projects/inspire-foto.png',
    'frontend', true, 5
  ),
  (
    'Banco de Trocas de Conhecimento',
    'Plataforma para trocar conhecimentos gratuitamente entre pessoas — API REST em Node/Express/Prisma e SPA em React, com autenticação JWT.',
    ARRAY['Node.js', 'Express', 'Prisma', 'PostgreSQL', 'React'],
    'https://github.com/BeatrizS97/Projeto-Banco-Troca-de-Conhecimento', 'https://projeto-banco-troca-de-conhecimento.vercel.app/', '/assets/images/projects/banco-trocas.png',
    'fullstack', true, 6
  ),
  (
    'Cinema de Terror',
    'Página temática de cinema de terror com animações, efeitos de jumpscare e modal interativo — primeiro projeto com SCSS.',
    ARRAY['HTML', 'SCSS', 'JavaScript'],
    'https://github.com/BeatrizS97/Cinema', '', '/assets/images/projects/cinema-terror.png',
    'frontend', true, 7
  );

-- Tabela de Formação Acadêmica
CREATE TABLE education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_pt VARCHAR(500) NOT NULL,
  course_en VARCHAR(500),
  course_es VARCHAR(500),
  order_index INTEGER DEFAULT 0
);

-- Tabela de Idiomas
CREATE TABLE languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language_pt VARCHAR(255) NOT NULL,
  language_en VARCHAR(255),
  language_es VARCHAR(255),
  order_index INTEGER DEFAULT 0
);

-- Tabela de Certificações
CREATE TABLE certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_pt VARCHAR(500) NOT NULL,
  title_en VARCHAR(500),
  title_es VARCHAR(500),
  order_index INTEGER DEFAULT 0
);

-- Tabela de Experiência & Voluntariado
CREATE TABLE experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_pt VARCHAR(500) NOT NULL,
  title_en VARCHAR(500),
  title_es VARCHAR(500),
  period_pt VARCHAR(255),
  period_en VARCHAR(255),
  period_es VARCHAR(255),
  description_pt TEXT,
  description_en TEXT,
  description_es TEXT,
  order_index INTEGER DEFAULT 0
);

CREATE INDEX idx_education_order ON education(order_index);
CREATE INDEX idx_languages_order ON languages(order_index);
CREATE INDEX idx_certifications_order ON certifications(order_index);
CREATE INDEX idx_experience_order ON experience(order_index);

-- ------------------------------------------------------------------
-- Seed: dados reais atuais (migrados de translations.ts)
-- ------------------------------------------------------------------

INSERT INTO education (course_pt, course_en, course_es, order_index) VALUES
  ('Análise e Desenvolvimento de Sistemas — Fatec Praia Grande (fev/2023 – jul/2026)',
   'Systems Analysis and Development — Fatec Praia Grande (Feb/2023 – Jul/2026)',
   'Análisis y Desarrollo de Sistemas — Fatec Praia Grande (feb/2023 – jul/2026)', 1),
  ('Licenciatura em Letras (Português e Inglês) — Universidade Cruzeiro do Sul (2015 – 2018)',
   'Teaching Degree in Languages and Literature (Portuguese and English) — Universidade Cruzeiro do Sul (2015 – 2018)',
   'Licenciatura en Letras (Portugués e Inglés) — Universidade Cruzeiro do Sul (2015 – 2018)', 2);

INSERT INTO languages (language_pt, language_en, language_es, order_index) VALUES
  ('Português — Nativo', 'Portuguese — Native', 'Portugués — Nativo', 1),
  ('Inglês — B1, em evolução (nível profissional de trabalho)', 'English — B1, in progress (professional working level)', 'Inglés — B1, en progreso (nivel profesional de trabajo)', 2),
  ('Espanhol — A2, em evolução', 'Spanish — A2, in progress', 'Español — A2, en progreso', 3);

INSERT INTO certifications (title_pt, title_en, title_es, order_index) VALUES
  ('Scrum Fundamentals Certified (SFC™) — SCRUMstudy, jun/2025',
   'Scrum Fundamentals Certified (SFC™) — SCRUMstudy, Jun/2025',
   'Scrum Fundamentals Certified (SFC™) — SCRUMstudy, jun/2025', 1),
  ('Formação Web Essencial (BIT) — Instituto Precisa Ser / Vai na Web / L''Oréal Brasil, 86,5h, concluído mar/2026',
   'Formação Web Essencial (BIT) — Instituto Precisa Ser / Vai na Web / L''Oréal Brasil, 86.5h, completed Mar/2026',
   'Formação Web Essencial (BIT) — Instituto Precisa Ser / Vai na Web / L''Oréal Brasil, 86,5h, concluido mar/2026', 2),
  ('Crescendo no Trabalho – JobRise — Wadhwani Foundation, via Escola Atlântico Avanti, 78h, concluído jun/2026',
   'Crescendo no Trabalho – JobRise — Wadhwani Foundation, via Escola Atlântico Avanti, 78h, completed Jun/2026',
   'Crescendo no Trabalho – JobRise — Wadhwani Foundation, vía Escola Atlântico Avanti, 78h, concluido jun/2026', 3),
  ('Curso de Extensão Universitária: Acelerando Projetos de Sucesso — USP/ESALQ (Metodologias Ágeis)',
   'University Extension Course: Accelerating Successful Projects — USP/ESALQ (Agile Methodologies)',
   'Curso de Extensión Universitaria: Acelerando Proyectos de Éxito — USP/ESALQ (Metodologías Ágiles)', 4),
  ('Trilha de Inteligência Artificial com React — Santander Open Academy, Bootcamp 2026 (em andamento)',
   'Artificial Intelligence with React Track — Santander Open Academy, Bootcamp 2026 (in progress)',
   'Ruta de Inteligencia Artificial con React — Santander Open Academy, Bootcamp 2026 (en curso)', 5),
  ('AWS AI Practitioner: fundamentos de IA na AWS — EDN (60h) | Em andamento, término previsto em nov/2026',
   'AWS AI Practitioner: AI fundamentals on AWS — EDN (60h) | In progress, expected completion Nov/2026',
   'AWS AI Practitioner: fundamentos de IA en AWS — EDN (60h) | En curso, finalización prevista en nov/2026', 6);

INSERT INTO experience (title_pt, title_en, title_es, period_pt, period_en, period_es, description_pt, description_en, description_es, order_index) VALUES
  ('Estagiária Full Stack — Hub Connect Eventos',
   'Full Stack Intern — Hub Connect Eventos',
   'Pasante Full Stack — Hub Connect Eventos',
   'fev/2026 – ago/2026', 'Feb/2026 – Aug/2026', 'feb/2026 – ago/2026',
   'site institucional construído do zero, otimização de SEO, GA4/GTM, padronização de componentes reutilizáveis em React/Next.js.',
   'institutional website built from scratch, SEO optimization, GA4/GTM, standardization of reusable components in React/Next.js.',
   'sitio institucional construido desde cero, optimización de SEO, GA4/GTM, estandarización de componentes reutilizables en React/Next.js.',
   1),
  ('Vice-Presidente — Associação Cultural e Comunitária Pedra Que Canta',
   'Vice President — Pedra Que Canta Cultural and Community Association',
   'Vicepresidenta — Asociación Cultural y Comunitaria Pedra Que Canta',
   '2022 – dez/2025', '2022 – Dec/2025', '2022 – dic/2025',
   'liderança de equipe voluntária por 3 anos, participação em decisões estratégicas de alocação de recursos junto à diretoria.',
   'led a volunteer team for 3 years and took part in strategic resource-allocation decisions alongside the board.',
   'liderazgo de un equipo voluntario durante 3 años y participación en decisiones estratégicas de asignación de recursos junto a la directiva.',
   2);

-- ------------------------------------------------------------------
-- 1) Soft delete em scraps: em vez de apagar a linha, marca a data da exclusão.
--    (Só scraps, que é a única tabela com exclusão pelo painel admin.)
-- ------------------------------------------------------------------
ALTER TABLE scraps ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;

-- ------------------------------------------------------------------
-- 2) Trigger genérico: atualiza updated_at sozinho a cada UPDATE.
--    Só a tabela projects tem a coluna updated_at, então só ela recebe o trigger.
--    O SET search_path = '' é uma boa prática do Supabase (NOW() é nativo e continua funcionando).
-- ------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------
-- 3) CHECK de URLs. Aceita vazio/NULL porque o seed tem live_url = ''.
--    Na foto do perfil também aceita caminho local (/assets/...), pois o seed usa /assets/images/icons/user.png.
-- ------------------------------------------------------------------
ALTER TABLE projects ADD CONSTRAINT chk_projects_github_url
  CHECK (github_url IS NULL OR github_url = '' OR github_url LIKE 'https://%');

ALTER TABLE projects ADD CONSTRAINT chk_projects_live_url
  CHECK (live_url IS NULL OR live_url = '' OR live_url LIKE 'https://%');

ALTER TABLE profile ADD CONSTRAINT chk_profile_photo_url
  CHECK (photo_url IS NULL OR photo_url LIKE 'https://%' OR photo_url LIKE '/assets/%');

-- ------------------------------------------------------------------
-- 4) ENUM de categoria de projeto (mesmos valores do tipo Project['category'] no TypeScript).
--    Obs.: com ENUM, /api/projects?category=valor-invalido passa a dar erro 500 em vez de lista vazia.
-- ------------------------------------------------------------------
CREATE TYPE project_category AS ENUM ('frontend', 'fullstack', 'ai', 'mobile', 'other');

ALTER TABLE projects
  ALTER COLUMN category TYPE project_category USING category::project_category;

-- ------------------------------------------------------------------
-- 5) UNIQUE: impede comunidade e idioma repetidos.
-- ------------------------------------------------------------------
ALTER TABLE communities ADD CONSTRAINT uq_communities_name UNIQUE (name);
ALTER TABLE languages ADD CONSTRAINT uq_languages_language_pt UNIQUE (language_pt);

-- ------------------------------------------------------------------
-- 7) RLS (Row Level Security)
--    Estas policies valem para a chave "anon". A chave "service_role" ignora o RLS.
-- ------------------------------------------------------------------

-- profile: leitura pública.
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profile_select_public" ON profile
  FOR SELECT TO anon
  USING (true);

-- scraps: lê só recado público e não excluído; cria só recado público.
-- Não há policy de UPDATE/DELETE para anon: a exclusão (soft delete) exige a chave service_role no servidor.
ALTER TABLE scraps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "scraps_select_public" ON scraps
  FOR SELECT TO anon
  USING (is_public = true AND deleted_at IS NULL);

CREATE POLICY "scraps_insert_public" ON scraps
  FOR INSERT TO anon
  WITH CHECK (is_public = true AND deleted_at IS NULL);

-- testimonial_requests: só aceita INSERT. Sem policy de SELECT, ninguém lê os e-mails pela chave anon.
ALTER TABLE testimonial_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "testimonial_requests_insert_public" ON testimonial_requests
  FOR INSERT TO anon
  WITH CHECK (true);

-- ------------------------------------------------------------------
-- 8) Comunidades: ordem por relevância profissional (a API ordena por members_count, do maior para o menor).
--    Serve para quem JÁ rodou o seed antigo: ajusta as contagens e acrescenta as 2 comunidades novas.
--    Pode ser rodado mais de uma vez (UPDATE repete o mesmo valor; ON CONFLICT ignora nomes que já existem).
-- ------------------------------------------------------------------
UPDATE communities SET members_count = 112480 WHERE name = 'Liderei uma Equipe por 3 Anos e Sobrevivi';
UPDATE communities SET members_count = 87654 WHERE name = 'Adaptabilidade & Diversidade Cultural';

INSERT INTO communities (name, members_count, category) VALUES
  ('Metodologias Ágeis: Daily Sem Drama', 143310, 'soft_skill'),
  ('Voluntariado: Fazer o Bem Não Dói', 91337, 'soft_skill')
ON CONFLICT (name) DO NOTHING;

-- ------------------------------------------------------------------
-- 9) Publicações científicas: antes o texto ficava fixo no ProfileDetails.tsx (só em português).
--    Autores, ano, revista e DOI não mudam com o idioma; só o título tem versões _pt / _en / _es.
--    O doi é UNIQUE para este bloco poder ser rodado mais de uma vez (ON CONFLICT ignora o que já existe).
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  authors VARCHAR(500) NOT NULL,
  year INTEGER NOT NULL,
  title_pt VARCHAR(500) NOT NULL,
  title_en VARCHAR(500),
  title_es VARCHAR(500),
  venue VARCHAR(500) NOT NULL,
  doi VARCHAR(255) NOT NULL UNIQUE,
  order_index INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_publications_order ON publications(order_index);

INSERT INTO publications (authors, year, title_pt, title_en, title_es, venue, doi, order_index) VALUES
  ('Santos, B. S. et al.', 2025,
   'Inovação tecnológica e a inclusão escolar: o caminho para a equidade',
   'Technological innovation and school inclusion: the path to equity',
   'Innovación tecnológica y la inclusión escolar: el camino hacia la equidad',
   'Revista Processando o Saber – FATEC PG', '10.5281/zenodo.15477654', 1)
ON CONFLICT (doi) DO NOTHING;

ALTER TABLE projects       ENABLE ROW LEVEL SECURITY;
ALTER TABLE friends        ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities    ENABLE ROW LEVEL SECURITY;
ALTER TABLE education      ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages      ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience     ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects_select_public"       ON projects       FOR SELECT TO anon USING (true);
CREATE POLICY "friends_select_public"        ON friends        FOR SELECT TO anon USING (true);
CREATE POLICY "communities_select_public"    ON communities    FOR SELECT TO anon USING (true);
CREATE POLICY "education_select_public"      ON education      FOR SELECT TO anon USING (true);
CREATE POLICY "languages_select_public"      ON languages      FOR SELECT TO anon USING (true);
CREATE POLICY "certifications_select_public" ON certifications FOR SELECT TO anon USING (true);
CREATE POLICY "experience_select_public"     ON experience     FOR SELECT TO anon USING (true);
CREATE POLICY "publications_select_public"   ON publications   FOR SELECT TO anon USING (true);
-- ------------------------------------------------------------------
-- 10) Conteúdo traduzido e dados de contato no banco (padrão _pt / _en / _es, o mesmo de education, certifications etc.).
--     Antes, as traduções de projetos, comunidades, amigos e perfil ficavam no dicionário contentTranslations.ts, chaveado
--     pelo texto em português: editar o texto no banco fazia a tradução sumir em silêncio.
-- ------------------------------------------------------------------

-- 10.1) projects: título e descrição nos 3 idiomas (title e description viram title_pt e description_pt).
ALTER TABLE projects RENAME COLUMN title TO title_pt;
ALTER TABLE projects RENAME COLUMN description TO description_pt;
ALTER TABLE projects
  ADD COLUMN title_en VARCHAR(255),
  ADD COLUMN title_es VARCHAR(255),
  ADD COLUMN description_en TEXT,
  ADD COLUMN description_es TEXT;

UPDATE projects SET
  title_en = 'Doe Vida — Encouraging Blood Donation',
  title_es = 'Doe Vida — Incentivo a la Donación de Sangre',
  description_en = 'Responsive mobile-first SPA that integrates the OpenStreetMap API to locate nearby blood centers and calculate the distance to the user.',
  description_es = 'SPA responsiva mobile-first que integra la API de OpenStreetMap para ubicar hemocentros cercanos y calcular la distancia hasta el usuario.'
WHERE title_pt = 'Doe Vida — Incentivo à Doação de Sangue';

UPDATE projects SET
  title_en = 'Form Generator',
  title_es = 'Form Generator',
  description_en = 'Collaborative full stack application for creating and managing forms with conditional logic, integrating the front end with a PHP back end and a SQL database.',
  description_es = 'Aplicación full stack colaborativa para la creación y gestión de formularios con lógica condicional, integrando el front-end con un back-end en PHP y una base de datos SQL.'
WHERE title_pt = 'Form Generator';

UPDATE projects SET
  title_en = 'Personal Portfolio',
  title_es = 'Portafolio Personal',
  description_en = 'Personal portfolio built from scratch with HTML5, SCSS3 and vanilla JavaScript.',
  description_es = 'Portafolio personal construido desde cero con HTML5, SCSS3 y JavaScript puro.'
WHERE title_pt = 'Portfolio Pessoal';

UPDATE projects SET
  title_en = 'ATSAdapta',
  title_es = 'ATSAdapta',
  description_en = 'Rewrites resumes using the STAR method and tailors them to job openings using AI, with ATS compatibility checking and export to .txt, PDF and Word.',
  description_es = 'Reescribe currículos con el método STAR y los adapta a vacantes usando IA, con verificación de compatibilidad ATS y exportación en .txt, PDF y Word.'
WHERE title_pt = 'ATSAdapta';

UPDATE projects SET
  title_en = 'InspireFoto',
  title_es = 'InspireFoto',
  description_en = 'Landscape photography gallery with persisted favorites, category filters and editorial design, built with Vue 3.',
  description_es = 'Galería de fotografías de paisajes con favoritos persistentes, filtros por categoría y diseño editorial en Vue 3.'
WHERE title_pt = 'InspireFoto';

UPDATE projects SET
  title_en = 'Knowledge Exchange Bank',
  title_es = 'Banco de Intercambio de Conocimiento',
  description_en = 'Platform for people to exchange knowledge for free — REST API in Node/Express/Prisma and a React SPA, with JWT authentication.',
  description_es = 'Plataforma para intercambiar conocimientos gratuitamente entre personas — API REST en Node/Express/Prisma y SPA en React, con autenticación JWT.'
WHERE title_pt = 'Banco de Trocas de Conhecimento';

UPDATE projects SET
  title_en = 'Horror Cinema',
  title_es = 'Cine de Terror',
  description_en = 'Horror-cinema themed page with animations, jumpscare effects and an interactive modal — first project with SCSS.',
  description_es = 'Página temática de cine de terror con animaciones, efectos de jumpscare y modal interactivo — primer proyecto con SCSS.'
WHERE title_pt = 'Cinema de Terror';

-- 10.2) communities: nome e descrição nos 3 idiomas (name vira name_pt; a descrição antes ficava fixa no Communities.tsx).
ALTER TABLE communities RENAME COLUMN name TO name_pt;
ALTER TABLE communities
  ADD COLUMN name_en VARCHAR(255),
  ADD COLUMN name_es VARCHAR(255),
  ADD COLUMN description_pt TEXT,
  ADD COLUMN description_en TEXT,
  ADD COLUMN description_es TEXT;

UPDATE communities SET
  name_en = 'React.js & Next.js Lovers',
  name_es = 'Amantes de React.js y Next.js',
  description_pt = 'Front-end com React.js e Next.js: site institucional da Hub Connect Eventos e projetos como Doe Vida, ATSAdapta e Banco de Trocas.',
  description_en = 'Front end with React.js and Next.js: the Hub Connect Eventos institutional website and projects such as Doe Vida, ATSAdapta and Banco de Trocas.',
  description_es = 'Front-end con React.js y Next.js: el sitio institucional de Hub Connect Eventos y proyectos como Doe Vida, ATSAdapta y Banco de Trocas.'
WHERE name_pt = 'React.js & Next.js Lovers';

UPDATE communities SET
  name_en = 'TypeScript Saved My Code',
  name_es = 'TypeScript Salvó Mi Código',
  description_pt = 'Tipagem estática no front-end e no back-end — este portfólio é feito em TypeScript.',
  description_en = 'Static typing on the front end and the back end — this portfolio is built with TypeScript.',
  description_es = 'Tipado estático en el front-end y en el back-end — este portafolio está hecho con TypeScript.'
WHERE name_pt = 'TypeScript Salvou Meu Código';

UPDATE communities SET
  name_en = 'C# & .NET Are Not Just Coffee',
  name_es = 'C# y .NET No Son Solo Café',
  description_pt = 'Back-end com C# e .NET, complementando a stack de React e Next.js — além de PHP e SQL no Form Generator.',
  description_en = 'Back end with C# and .NET, complementing the React and Next.js stack — plus PHP and SQL in Form Generator.',
  description_es = 'Back-end con C# y .NET, complementando el stack de React y Next.js — además de PHP y SQL en Form Generator.'
WHERE name_pt = 'C# & .NET Não São Só Café';

UPDATE communities SET
  name_en = 'Node.js in Continuous Learning',
  name_es = 'Node.js en Aprendizaje Continuo',
  description_pt = 'APIs com Node.js, Express e Prisma: Banco de Trocas de Conhecimento e as funções serverless deste portfólio.',
  description_en = 'APIs with Node.js, Express and Prisma: the Knowledge Exchange Bank and this portfolio''s serverless functions.',
  description_es = 'APIs con Node.js, Express y Prisma: el Banco de Intercambio de Conocimiento y las funciones serverless de este portafolio.'
WHERE name_pt = 'Node.js em Aprendizado Contínuo';

UPDATE communities SET
  name_en = 'Scrum Fundamentals Certified',
  name_es = 'Scrum Fundamentals Certified',
  description_pt = 'Certificação Scrum Fundamentals Certified (SFC™) — SCRUMstudy, jun/2025.',
  description_en = 'Scrum Fundamentals Certified (SFC™) certification — SCRUMstudy, Jun/2025.',
  description_es = 'Certificación Scrum Fundamentals Certified (SFC™) — SCRUMstudy, jun/2025.'
WHERE name_pt = 'Scrum Fundamentals Certified';

UPDATE communities SET
  name_en = 'Agile Methodologies: Drama-Free Daily',
  name_es = 'Metodologías Ágiles: Daily Sin Drama',
  description_pt = 'Metodologias ágeis na prática — curso de extensão universitária USP/ESALQ (Acelerando Projetos de Sucesso).',
  description_en = 'Agile methodologies in practice — USP/ESALQ university extension course (Accelerating Successful Projects).',
  description_es = 'Metodologías ágiles en la práctica — curso de extensión universitaria USP/ESALQ (Acelerando Proyectos de Éxito).'
WHERE name_pt = 'Metodologias Ágeis: Daily Sem Drama';

UPDATE communities SET
  name_en = 'Technological Innovation and Inclusion',
  name_es = 'Innovación Tecnológica e Inclusión',
  description_pt = 'Artigo científico sobre inovação tecnológica e inclusão escolar — Revista Processando o Saber, FATEC PG (2025).',
  description_en = 'Scientific paper on technological innovation and school inclusion — Revista Processando o Saber, FATEC PG (2025).',
  description_es = 'Artículo científico sobre innovación tecnológica e inclusión escolar — Revista Processando o Saber, FATEC PG (2025).'
WHERE name_pt = 'Inovação Tecnológica e Inclusão';

UPDATE communities SET
  name_en = 'Volunteering: Doing Good Doesn''t Hurt',
  name_es = 'Voluntariado: Hacer el Bien No Duele',
  description_pt = 'Vice-presidência da Associação Cultural e Comunitária Pedra Que Canta (2022 – dez/2025).',
  description_en = 'Vice presidency of the Pedra Que Canta Cultural and Community Association (2022 – Dec/2025).',
  description_es = 'Vicepresidencia de la Asociación Cultural y Comunitaria Pedra Que Canta (2022 – dic/2025).'
WHERE name_pt = 'Voluntariado: Fazer o Bem Não Dói';

UPDATE communities SET
  name_en = 'Adaptability & Cultural Diversity',
  name_es = 'Adaptabilidad y Diversidad Cultural',
  description_pt = 'Intercâmbio em Dublin (ISI Dublin, 2025) e trabalho em equipes multidisciplinares.',
  description_en = 'Study abroad in Dublin (ISI Dublin, 2025) and work in multidisciplinary teams.',
  description_es = 'Intercambio en Dublín (ISI Dublin, 2025) y trabajo en equipos multidisciplinarios.'
WHERE name_pt = 'Adaptabilidade & Diversidade Cultural';

UPDATE communities SET
  name_en = 'I Led a Team for 3 Years and Survived',
  name_es = 'Lideré un Equipo por 3 Años y Sobreviví',
  description_pt = 'Três anos liderando a equipe voluntária da Associação Pedra Que Canta.',
  description_en = 'Three years leading the volunteer team at the Pedra Que Canta Association.',
  description_es = 'Tres años liderando al equipo voluntario de la Asociación Pedra Que Canta.'
WHERE name_pt = 'Liderei uma Equipe por 3 Anos e Sobrevivi';

-- 10.3) friends: a função exibida ao passar o mouse nos 3 idiomas (role vira role_pt). O nome da pessoa não é traduzido.
ALTER TABLE friends RENAME COLUMN role TO role_pt;
ALTER TABLE friends
  ADD COLUMN role_en VARCHAR(255),
  ADD COLUMN role_es VARCHAR(255);

UPDATE friends SET
  role_en = 'Knowledge Exchange Bank — Fullstack, Architecture',
  role_es = 'Banco de Intercambio de Conocimiento — Fullstack, Arquitectura'
WHERE name = 'Marcela Santiago';

UPDATE friends SET
  role_en = 'Form Generator — Collaborator',
  role_es = 'Form Generator — Colaboradora'
WHERE name = 'Tatiana Nunes';

UPDATE friends SET
  role_en = 'Knowledge Exchange Bank — Knowledge CRUD',
  role_es = 'Banco de Intercambio de Conocimiento — CRUD de Conocimientos'
WHERE name = 'Patrick Silva';

-- 10.4) profile: título e "sobre mim" nos 3 idiomas (headline e about_me viram headline_pt e about_me_pt)
--       e os dados de contato (antes repetidos no ProfileDetails.tsx e no prompt do chat).
ALTER TABLE profile RENAME COLUMN headline TO headline_pt;
ALTER TABLE profile RENAME COLUMN about_me TO about_me_pt;
ALTER TABLE profile
  ADD COLUMN headline_en VARCHAR(255),
  ADD COLUMN headline_es VARCHAR(255),
  ADD COLUMN about_me_en TEXT,
  ADD COLUMN about_me_es TEXT,
  ADD COLUMN email VARCHAR(255),
  ADD COLUMN linkedin_url VARCHAR(500),
  ADD COLUMN github_url VARCHAR(500);

ALTER TABLE profile ADD CONSTRAINT chk_profile_linkedin_url
  CHECK (linkedin_url IS NULL OR linkedin_url LIKE 'https://%');

ALTER TABLE profile ADD CONSTRAINT chk_profile_github_url
  CHECK (github_url IS NULL OR github_url LIKE 'https://%');

UPDATE profile SET
  headline_en = 'Junior Full Stack Developer | React.js | Next.js | TypeScript | Node.js',
  headline_es = 'Desarrolladora Full Stack Jr | React.js | Next.js | TypeScript | Node.js',
  about_me_en = 'Hi! I''m Beatriz, a Junior Full Stack Dev who graduated from Fatec Praia Grande (2026). I work with React, Next.js and Node.js. I also did an exchange program in Dublin (ISI Dublin) and hold a Scrum Fundamentals certification. I love building accessible, high-performance interfaces.',
  about_me_es = '¡Hola! Soy Beatriz, Dev Full Stack Jr graduada en la Fatec Praia Grande (2026). Trabajo con React, Next.js y Node.js. También hice un intercambio en Dublín (ISI Dublin) y tengo la certificación Scrum Fundamentals. Me encanta crear interfaces accesibles y de alto rendimiento.',
  email = 'beatriz.santos.ads97@gmail.com',
  linkedin_url = 'https://www.linkedin.com/in/beatrizsilvasantos-dev',
  github_url = 'https://github.com/BeatrizS97'
WHERE full_name = 'Beatriz Silva Santos';

-- 10.5) exchange: a seção "Intercâmbio" do Perfil (antes fixa em translations.ts e repetida no prompt do chat).
CREATE TABLE exchange (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description_pt TEXT NOT NULL,
  description_en TEXT,
  description_es TEXT,
  order_index INTEGER DEFAULT 0
);

CREATE INDEX idx_exchange_order ON exchange(order_index);

INSERT INTO exchange (description_pt, description_en, description_es, order_index) VALUES
  ('Um mês de imersão em Dublin, Irlanda, na ISI Dublin – English Language School (jul–ago/2025), curso de inglês geral nível A2. A vivência reforçou autonomia, comunicação intercultural e adaptabilidade em um ambiente totalmente novo.',
   'One month of immersion in Dublin, Ireland, at ISI Dublin – English Language School (Jul–Aug/2025), general English course at A2 level. The experience strengthened autonomy, intercultural communication and adaptability in a completely new environment.',
   'Un mes de inmersión en Dublín, Irlanda, en ISI Dublin – English Language School (jul–ago/2025), curso de inglés general nivel A2. La vivencia reforzó la autonomía, la comunicación intercultural y la adaptabilidad en un entorno totalmente nuevo.',
   1);

ALTER TABLE exchange ENABLE ROW LEVEL SECURITY;

CREATE POLICY "exchange_select_public" ON exchange FOR SELECT TO anon USING (true);

-- -------------------------------------------------------------------- ------------------------------------------------------------------
UPDATE profile SET
  about_me_pt = 'Oi! Sou a Beatriz, Dev Full Stack Jr formada pela Fatec Praia Grande (2026). Trabalho com React, Next.js e Node.js. Já fiz intercâmbio em Dublin (ISI Dublin) e tenho certificação Scrum Fundamentals. Amo criar interfaces acessíveis e performáticas.',
  about_me_en = 'Hi! I''m Beatriz, a Junior Full Stack Dev who graduated from Fatec Praia Grande (2026). I work with React, Next.js and Node.js. I also did an exchange program in Dublin (ISI Dublin) and hold a Scrum Fundamentals certification. I love building accessible, high-performance interfaces.',
  about_me_es = '¡Hola! Soy Beatriz, Dev Full Stack Jr graduada en la Fatec Praia Grande (2026). Trabajo con React, Next.js y Node.js. También hice un intercambio en Dublín (ISI Dublin) y tengo la certificación Scrum Fundamentals. Me encanta crear interfaces accesibles y de alto rendimiento.'
WHERE full_name = 'Beatriz Silva Santos';

-- ------------------------------------------------------------------
-- 12) Limpeza e dados que antes ficavam no código.
-- ------------------------------------------------------------------

-- 12.1) A tabela visitor_log nunca foi escrita por nenhuma rota da API, então foi removida.
DROP TABLE IF EXISTS visitor_log;

-- 12.2) O projeto Doe Vida também tem versão online.
UPDATE projects SET live_url = 'https://projeto-doe-vida.vercel.app/'
WHERE title_pt = 'Doe Vida — Incentivo à Doação de Sangue';

-- 12.3) communities.icon: o desenho em pixel art de cada comunidade. Antes o Communities.tsx escolhia o desenho pelo texto do nome,
--       e renomear a comunidade no banco trocava o ícone sem avisar. Os valores válidos são as chaves de PIXEL_ART no Communities.tsx.
ALTER TABLE communities ADD COLUMN IF NOT EXISTS icon VARCHAR(30);

ALTER TABLE communities DROP CONSTRAINT IF EXISTS chk_communities_icon;
ALTER TABLE communities ADD CONSTRAINT chk_communities_icon
  CHECK (icon IS NULL OR icon IN ('react', 'typescript', 'csharp', 'node', 'scrum', 'agile', 'trophy', 'bulb', 'heart', 'globe'));

UPDATE communities SET icon = 'react'      WHERE name_pt = 'React.js & Next.js Lovers';
UPDATE communities SET icon = 'typescript' WHERE name_pt = 'TypeScript Salvou Meu Código';
UPDATE communities SET icon = 'csharp'     WHERE name_pt = 'C# & .NET Não São Só Café';
UPDATE communities SET icon = 'node'       WHERE name_pt = 'Node.js em Aprendizado Contínuo';
UPDATE communities SET icon = 'scrum'      WHERE name_pt = 'Scrum Fundamentals Certified';
UPDATE communities SET icon = 'agile'      WHERE name_pt = 'Metodologias Ágeis: Daily Sem Drama';
UPDATE communities SET icon = 'bulb'       WHERE name_pt = 'Inovação Tecnológica e Inclusão';
UPDATE communities SET icon = 'heart'      WHERE name_pt = 'Voluntariado: Fazer o Bem Não Dói';
UPDATE communities SET icon = 'globe'      WHERE name_pt = 'Adaptabilidade & Diversidade Cultural';
UPDATE communities SET icon = 'trophy'     WHERE name_pt = 'Liderei uma Equipe por 3 Anos e Sobrevivi';

-- 12.4) profile: os dois parágrafos que aparecem depois do "sobre mim" na aba Perfil (antes ficavam no translations.ts).
--       about_extra = formação em Letras e abertura a vagas; about_hub_connect = o que ela fez na Hub Connect Eventos.
ALTER TABLE profile
  ADD COLUMN IF NOT EXISTS about_extra_pt TEXT,
  ADD COLUMN IF NOT EXISTS about_extra_en TEXT,
  ADD COLUMN IF NOT EXISTS about_extra_es TEXT,
  ADD COLUMN IF NOT EXISTS about_hub_connect_pt TEXT,
  ADD COLUMN IF NOT EXISTS about_hub_connect_en TEXT,
  ADD COLUMN IF NOT EXISTS about_hub_connect_es TEXT;

UPDATE profile SET
  about_extra_pt = 'Minha formação em Letras reforça minha comunicação e trabalho em equipes multidisciplinares (design, produto, QA). Estou aberta a oportunidades como Desenvolvedora Front-End ou Full Stack Júnior — vamos conversar?',
  about_extra_en = 'My background in Languages and Literature strengthens my communication and my work in multidisciplinary teams (design, product, QA). I am open to opportunities as a Junior Front-End or Full Stack Developer — shall we talk?',
  about_extra_es = 'Mi formación en Letras refuerza mi comunicación y mi trabajo en equipos multidisciplinarios (diseño, producto, QA). Estoy abierta a oportunidades como Desarrolladora Front-End o Full Stack Júnior — ¿conversamos?',
  about_hub_connect_pt = 'Na Hub Connect Eventos, onde estagiei como Full Stack, criei o site institucional do zero e melhorei em 20% a compreensão do comportamento do usuário com SEO e GA4/GTM, além de padronizar componentes reutilizáveis em React/Next.js.',
  about_hub_connect_en = 'At Hub Connect Eventos, where I interned as a Full Stack developer, I built the institutional website from scratch and improved the understanding of user behavior by 20% with SEO and GA4/GTM, as well as standardizing reusable components in React/Next.js.',
  about_hub_connect_es = 'En Hub Connect Eventos, donde hice una pasantía Full Stack, creé el sitio institucional desde cero y mejoré en un 20% la comprensión del comportamiento del usuario con SEO y GA4/GTM, además de estandarizar componentes reutilizables en React/Next.js.'
WHERE full_name = 'Beatriz Silva Santos';

-- ------------------------------------------------------------------
-- 13) Contador de visitas. Cada linha é a PRIMEIRA visita de um navegador: o site marca o navegador (localStorage)
--     e só avisa a rota /api/visits uma vez. Não guarda IP nem dado pessoal, só o momento da visita.
--     Pode ser rodado mais de uma vez (IF NOT EXISTS / DROP POLICY IF EXISTS). Só o INSERT é liberado para anon (policy abaixo); a leitura é só da service_role (a API).
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_visits_visited ON site_visits(visited_at DESC);

ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;

-- Só aceita INSERT (mesmo padrão de testimonial_requests). Sem policy de SELECT, ninguém lê as visitas pela chave anon.
-- Sem esta policy, o INSERT feito pela API falhava com "new row violates row-level security policy" quando a SUPABASE_KEY não era a service_role.
DROP POLICY IF EXISTS "site_visits_insert_public" ON site_visits;
CREATE POLICY "site_visits_insert_public" ON site_visits
  FOR INSERT TO anon
  WITH CHECK (true);

-- Para ver os números, rode no SQL Editor do Supabase:
--   Total de visitas:   SELECT count(*) FROM site_visits;
--   Visitas por dia:    SELECT (visited_at AT TIME ZONE 'America/Sao_Paulo')::date AS dia, count(*) AS visitas
--                       FROM site_visits GROUP BY dia ORDER BY dia DESC;