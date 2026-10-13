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

-- Tabela de Log de Visitantes
CREATE TABLE visitor_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address INET,
  user_agent TEXT,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  pages_visited TEXT[]
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
  'Oi! Sou a Beatriz, Dev Full Stack Jr formada pela Fatec Praia Grande (2026). Trabalho com React, Next.js e Node.js. Na Hub Connect Eventos, criei um site do zero e melhorei a compreensão do comportamento do usuário em 20% com SEO e GA4. Já fiz intercâmbio em Dublin (ISI Dublin) e tenho certificação Scrum Fundamentals. Amo criar interfaces acessíveis e performáticas. Vamos conversar?',
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
    'https://github.com/BeatrizS97/Projeto-Doe-Vida', '', '/assets/images/projects/doe-vida.png',
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
   'Ruta de Inteligencia Artificial con React — Santander Open Academy, Bootcamp 2026 (en curso)', 5);

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
-- 6) visitor_log: guarda o hash (sha256) do IP em vez do IP puro.
--    Atenção: sha256 puro de IP ainda pode ser descoberto por força bruta (há poucos IPs possíveis).
--    Serve como camada básica de privacidade, não como anonimização forte.
-- ------------------------------------------------------------------
ALTER TABLE visitor_log ADD COLUMN ip_hash TEXT;

UPDATE visitor_log
  SET ip_hash = encode(sha256(host(ip_address)::bytea), 'hex')
  WHERE ip_address IS NOT NULL;

ALTER TABLE visitor_log DROP COLUMN ip_address;

-- Retenção de 90 dias: sem pg_cron, rode este comando manualmente de vez em quando
-- (a tabela visitor_log nem é usada pelo site hoje):
-- DELETE FROM visitor_log WHERE visited_at < NOW() - INTERVAL '90 days';

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