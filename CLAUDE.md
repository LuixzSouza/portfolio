# CLAUDE.md — Portfólio Luiz Souza

Guia de contexto para o Claude Code. Mantenha este arquivo atualizado conforme o projeto evolui.

## Visão geral

Recriação do portfólio pessoal de **Luiz Antônio de Souza** (dev Front-End). O site atual está no ar em https://luixzsouza.com.br e está sendo refeito porque o **design atual não agrada**. O objetivo é um site **profissional, componentizado, bilíngue (PT/EN), com dark/light (dark como principal)** e um **painel admin (CRUD)** para editar praticamente todo o conteúdo do site sem mexer no código.

### Perfis do Luiz (fonte de verdade para links)
- Site: https://luixzsouza.com.br
- GitHub: https://github.com/LuixzSouza
- LinkedIn: https://www.linkedin.com/in/luiz-antonio-souza-5000a226b/
- CodeWars: https://www.codewars.com/users/LuixzSouza
- E-mail de contato: luiz.antoniodesouza004@gmail.com (ola@luixzsouza.com.br foi aposentado)

> Idioma de trabalho: **responder em português (PT-BR)**. Termos técnicos em inglês são bem-vindos.

## Direção de design

- **Estilo: Minimalista / Editorial.** Tipografia grande como protagonista, muito espaço de respiro, pouco ruído, layout tipo "revista/estúdio premium". Mistura de **serif (Playfair Display) + sans (Roobert)**.
- **Dark-first**, com tema light também disponível.
- Animações sutis e sofisticadas (Framer Motion) — movimento a serviço do conteúdo, sem exagero.
- Tudo **componentizado** e dirigido por dados/conteúdo (ver abaixo).

## Arquitetura

Site **estático + API PHP** (hospedagem compartilhada Hostinger):

```
Next.js (output: 'export')  ->  HTML/CSS/JS estático
        │ fetch (client-side)
        ▼
API PHP  (ex.: /api/projects.php?action=list)
        ▼
MySQL (Hostinger)
```

- Frontend é **exportado estaticamente** (`next.config.ts` → `output: 'export'`). Não há SSR/Node em produção.
- Conteúdo dinâmico (projetos, certificados, depoimentos, skills, timeline, serviços e **textos das seções em geral**) vem da **API PHP + MySQL**, consumida via `fetch` no cliente.
- **Rotas dinâmicas via query string** (`?id=`, `?slug=`, `?lang=`) porque o export estático não gera rotas dinâmicas de servidor. Ex.: `/work?id=casa-pronta`.
- **Painel admin**: área protegida por login que faz o CRUD através da mesma API PHP.

### Princípio central: conteúdo separado do código
Como o objetivo final é **editar tudo pelo painel**, nenhum texto/imagem deve ser hardcoded dentro dos componentes de UI. O fluxo é:

1. **Fase atual (design)**: conteúdo vive em arquivos TS tipados em `src/data/` e `src/content/{pt,en}/`, com schemas que espelham 1:1 o formato que a API PHP vai retornar.
2. **Fase backend**: troca-se a origem dos dados (arquivo TS → `fetch` da API PHP) sem reescrever a UI.

Componentes recebem conteúdo por **props/tipos**; nunca embutem copy.

## Stack

- **Next.js 15** (App Router) + **React 19** (estável, 19.2.x).
- **TypeScript 5** (migração `.jsx` → `.tsx` em andamento).
- **Tailwind CSS 3.4** (`tailwind.config.ts`).
- **Framer Motion**, **lucide-react**, **tailwind-merge**. (GSAP, Swiper, react-intersection-observer,
  simplex-noise, is-arrayish, is-number removidos por não uso.)
- **sharp** (devDep) + `scripts/optimize-images.mjs` para gerar WebP/JPG otimizados a partir de `public/`.
- **PHP + PHPMailer** para o backend/contato (`src/php/`). Banco: **MySQL na Hostinger**.

## Comandos

```bash
npm run dev     # ambiente local (http://localhost:3000) — cache em .next-dev
npm run build   # build + export estático (gera /out) — cache em .next
npm run start   # serve o build (uso limitado por ser export)
npm run lint    # ESLint
npm run clean   # apaga .next, .next-dev e out (reset quando algo corromper)
npm run test       # Vitest em watch
npm run test:run   # Vitest uma vez (CI)
npm run test:types # type-check só dos testes (tsconfig.vitest.json)
```

> **Testes/validação**: Vitest + Testing Library; tipos e validação de dados com **Zod**
> (schemas em `src/lib/schemas/` são a fonte de verdade — `z.infer` gera os tipos e os
> mesmos schemas validam as respostas da API). Arquivos `*.test.ts(x)` ficam fora do
> `tsconfig` de build (não afetam `next build`); têm type-check próprio via `test:types`.

> **Dev e build têm caches separados** (`distDir` por `NODE_ENV` em `next.config.ts`):
> dev usa `.next-dev`, build usa `.next`. Isso evita o erro "Cannot find module
> './XYZ.js'" que acontecia quando `next build` sobrescrevia o `.next` do `next dev`.
> Mesmo assim, **durante o dev prefira validar com `tsc --noEmit` + `npm run lint`**
> (não tocam no cache); só rode `npm run build` quando for de fato gerar o export.

> ⚠️ Há `package-lock.json` **e** `yarn.lock` no repo. Padronizar um gerenciador (ver checklist).
> Sempre rodar o Build e o Teste depois de modificar algo para garantir que nada vai quebrar e caso quebre corrija para garantir a funcionalidade correta do sistema

## Estrutura

```
src/
  app/                 # rotas (App Router): page, layout, about, work, contact
  components/
    animations/  buttons/  headers/  layout/  menus/
    sections/    sliders/  typrography/  ui/  widgets/
  data/                # dados tipados (ex.: projects.tsx) -> futuro: API PHP
  content/{pt,en}/     # (a criar) textos das seções por idioma
  font/                # Roobert + Playfair Display (.woff2)
  php/                 # backend PHP (sendEmail.php, PHPMailer)
public/                # imagens, backgrounds, ícones
```

## Convenções

- Componentes em **`.tsx`** com tipagem explícita das props. Finalizar a migração dos `.jsx` restantes.
- Imports via alias **`@/*`** (configurado em `tsconfig.json`).
- Estilização com **Tailwind**; tokens de design (cores, tipografia, espaçamento) centralizados em `tailwind.config.ts` + CSS vars de tema em `globals.css`.
- Nada de copy hardcoded em componentes — sempre via dados/i18n.
- Tema (dark/light) e idioma (pt/en) controlados por contexto/provider no client.

## Pontos de atenção conhecidos (ver checklist do roadmap)

1. **SEGURANÇA**: `src/php/sendEmail.php` tem **senha SMTP em texto puro** commitada em repo público. Rotacionar a senha e mover para variável de ambiente / `.env` fora do versionamento.
2. **Bug de fonte**: `layout.tsx` define `--font-roobert`, mas `globals.css` e `tailwind.config.ts` usam `--font-robeert` (typo). Resultado: a fonte Roobert não está sendo aplicada de fato. Unificar para `--font-roobert`.
3. **`next.config.ts`**: `typescript.ignoreBuildErrors` e `ignoreDuringBuilds` estão mascarando erros por causa da migração. Remover quando a migração TS terminar.
4. **JSON-LD** em `app/page.tsx` tem URLs placeholder (`SeuUsuarioNoGithub` etc.) — preencher com os links reais acima.
5. ~~**React em RC**~~ — resolvido: migrado para React 19 estável (não precisa mais de --legacy-peer-deps).
6. **Tailwind config** acumulou muitos tokens legados (gradientes/cores de botões de tecnologia) que provavelmente não combinam com o novo design editorial — limpar na fase de design system.

## Prioridade atual

**Design system + UI primeiro.** Definir paleta, tipografia, tokens, temas e refazer componentes/seções no estilo editorial — depois backend PHP/MySQL + painel + i18n completo.


 Roadmap — Portfólio Luiz Souza

  ✅ Concluído

  - [x] CLAUDE.md com contexto, arquitetura e direção
   de design
  - [x] Design system base: tokens dark/light
  (monocromático), fonte corrigida, tipografia
  editorial
  - [x] Tema dark/light (provider + toggle +
  anti-flash)
  - [x] Primitivos: Container, Section, Heading,
  Text, Eyebrow
  - [x] Botões/links animados: ArrowButton,
  MagneticButton, Button, AnimatedLink, RollText,
  Reveal
  - [x] Página /styleguide (aprovada) + correções de
  hydration

  Fase 0 — Urgente (segurança)

  - [~] 🔴 Credenciais SMTP: código já lê de config.php (gitignored)
  com fallback p/ env vars; config.example.php criado. FALTA você
  rotacionar a senha real no painel da Hostinger.
  - [x] JSON-LD da home preenchido com links reais (GitHub/LinkedIn/CodeWars)

  Fase 1 — Aplicar o design system nas seções reais ✅ concluída

  - [x] Header + navegação (menu desktop e mobile) — SiteHeader.tsx
  - [x] Hero da home (ponto de partida recomendado) — Hero.tsx
  - [x] Seção "O que eu faço" (serviços, linguagem p/
   leigos) — Services.tsx + ServicesInteractive.tsx
  - [x] Trabalhos selecionados (puxando de
  src/data/projects) — FeaturedWork.tsx
  - [x] Sobre / trajetória — AboutHero.tsx + Story.tsx
  - [x] Skills + Timeline — Skills.tsx + Timeline.tsx
  - [x] Depoimentos — Testimonials.tsx
  - [x] Contato (form, reaproveitando o PHP) — ContactForm.tsx
  - [x] Footer — Footer.tsx
  - [x] Página de detalhe de projeto via ?id= — project/page.tsx + ProjectDetail.tsx

  Fase 2 — Conteúdo & i18n ← próximo

  - [x] Estrutura de conteúdo tipada bilíngue
  (content/dictionaries.ts + lib/i18n.ts) — espelha a futura API
  - [x] Provider de idioma + toggle PT/EN (LanguageProvider + LanguageToggle)
  - [x] Migrar texto hardcoded p/ essa camada — seções via useTranslations
  e data/* (about, timeline, skills, testimonials, projects, FeaturedWork)
  todos bilíngues PT/EN. Exceção proposital: nomes oficiais de certificados.
  - [x] Migração .jsx → .tsx concluída (0 .jsx em src/)
  - [x] next.config limpo (ignore* removidos — build completo passa)
  - [x] Gerenciador padronizado em npm (yarn.lock removido)
  - [x] Arquivo solto tmp_layout.css removido
  - [x] Limpar tokens legados do Tailwind (btn-*/bg-*/cores/keyframes não usados removidos)
  - [x] Páginas de estado do App Router: not-found.tsx (404), loading.tsx,
  error.tsx e global-error.tsx — bilíngues, estilo editorial; gera 404.html no export
  - [x] Páginas de serviço /services/[slug] (sites, sistemas, lojas): rotas SSG estáticas
  (generateStaticParams) com conteúdo server-rendered bilíngue (data/services.ts), SEO próprio
  (canonical/OG + JSON-LD Service), linkadas pela seção "O que eu faço" e no sitemap
  - [x] Páginas de certificado /certificates/[slug] (SSG): imagem do certificado, detalhes
  bilíngues + skills (data/certificates.tsx), botão abrir PDF, JSON-LD
  EducationalOccupationalCredential, sitemap. Seção Certificações com preview de imagem
  no hover (cursor-follow) e cards linkando para o detalhe
  - [x] Fix de hidratação: Hero nasce visível no SSR (animação re-disparada após mount via key);
  ThemeToggle renderiza o ícone direto (sem placeholder) — corrige "conteúdo some até recarregar"

  Fase 3 — Backend PHP + MySQL

  - [x] Modelar o banco (src/php/sql/schema.sql): admin_users, projects, certificates,
  testimonials, skill_groups+skills, milestones, services, section_content (chave/valor
  bilíngue). Colunas _pt/_en espelham LocalizedText; arrays/estruturas aninhadas em JSON.
  - [x] API PHP com rotas ?action= (CRUD) — src/php/api/: auth (login/logout/me),
  projects, certificates, testimonials, skills, milestones, services, content. Padrão:
  list/get públicos (só publicado=1), all/create/update/delete exigem auth + CSRF.
  Helpers compartilhados em lib.php (slugify_php, unique_slug, str_or_null, json_strings).
  - [x] Seed do conteúdo atual: scripts/generate-seed.mts (npx tsx) lê src/data/* e gera
  src/php/sql/seed.sql — mantém o seed em sincronia sem transcrição manual.
  - [x] Conectar o front via fetch (?id= / ?slug=):
    - [x] Camada de dados pronta p/ todas as entidades — schemas Zod + mappers
    (src/lib/schemas/: shared, project, certificate, testimonial, milestone, skill,
    service, content) + cliente em src/lib/api.ts (list/get públicos + CRUD admin)
    + testes de contrato (entities-contract.test.ts) guardando o formato do PHP.
    - [x] Componentes client plugados na API com FALLBACK ESTÁTICO. Hooks em
    src/hooks/: useTestimonials, useSkillGroups, useMilestones, useCertificates,
    useServices, useSectionContent (+ listProjects inline em WorkGrid/ProjectDetail).
    Seções: Testimonials, Skills, Timeline, WorkGrid, Certificates, AboutHero, Story.
    Detalhes: ProjectDetail (?id=), CertificateDetail e ServiceDetail (via [slug]).
    Padrão: renderiza @/data no SSR/export e só substitui quando a API responde com
    itens; se a API falhar/estiver fora, mantém o estático (= comportamento atual
    enquanto o backend não está no ar).
    - [x] Boundary do export: páginas server [slug] (generateStaticParams/
    generateMetadata/JsonLd) e sitemap.ts seguem lendo @/data — necessário, pois o
    export estático não faz fetch em build. Só os componentes client refrescam.
    - A seção "O que eu faço" (Services/ServicesInteractive) é curada/tradução
    própria de propósito — não vem do banco.
    - FeaturedWork (Home) mostra os projetos CURADOS (destaque:true, só os com
    verProjeto) SEMPRE primeiro; as vagas restantes (COUNT=4) são preenchidas
    aleatoriamente no cliente após mount p/ dar variedade (SSR mostra destaques +
    início do resto p/ não quebrar hidratação).
  - [x] Trabalhos com cursor + screenshot ao vivo + GitHub:
    - WorkCursor.tsx: disco "Visualizar" (blur, translúcido) que segue o cursor sobre
    os cards (desktop/lg; no toque fica o badge central). Reaproveita o padrão de
    cursor-follow das Certificações. Rótulo bilíngue (featuredWork.viewLabel/work.viewLabel).
    - WorkCardMedia.tsx: fundo = a PRÓPRIA imagem do projeto (a que já existia; projeto sem
    imagem → placeholder neutro, não inventamos imagem). No hover revela `hoverSrc` por cima =
    PRINT AO VIVO do site via mShots (lib/screenshot.ts → s.wordpress.com/mshots, grátis, sem
    chave e SEM limite diário). mShots exige header Referer (senão 403), então o <img> usa
    referrerPolicy="origin". (thum.io foi testado e descartado: tier grátis virou pago.) O
    hoverSrc só baixa após o 1º hover (lazy on-demand) — não dispara N screenshots de cara.
    Importante: o overlay/badges decorativos são pointer-events-none, senão roubam o
    onMouseEnter que "arma" o screenshot.
    - WorkGrid mescla TODOS os repos públicos de github.com/LuixzSouza (useGithubRepos.ts,
    fetch client-side sem token, per_page=100, ~60 req/h por IP; descarta forks/arquivados)
    com os projetos curados, marcando origem "GitHub". Paginação ("Ver mais", PAGE=9) para
    não carregar tudo. Filtro DINÂMICO: techs reais dos cards agrupadas (case-insensitive),
    por frequência, top 12, com contagem por filtro.

  Fase 4 — Painel Admin (em /admin, noindex, overlay full-screen)

  - [x] Login protegido (AdminProvider → me/login/logout via api.ts; sessão por
  cookie + CSRF). src/components/admin/: AdminApp, AdminProvider, LoginForm,
  AdminShell (nav + sair), EntityManager (CRUD genérico: lista, modal de
  criar/editar, excluir com confirmação), fields.tsx (primitivos PT/EN), utils.ts.
  - [x] CRUD com suporte PT/EN de TODAS as entidades:
    - Flat (managers.tsx, via EntityManager): Projetos, Certificados, Depoimentos,
    Trajetória.
    - Aninhadas (managers.tsx): Skills (grupo + lista de {name,level} com nível 1–5),
    Serviços (editores de process/includes/tags + SEO).
    - Conteúdo "Sobre" (ContentManager.tsx, bespoke chave/valor): bio, citação,
    parágrafos (um por linha) e fatos — cada bloco com Salvar próprio (setContent).
    - Upload de imagem real (ImageField em fields.tsx → uploadImage/upload.php, com
    preview) plugado em Projetos, Certificados, Depoimentos e Serviços; o campo ainda
    aceita caminho/URL manual (ex.: imagens versionadas em /public).
  - Obs.: criar o usuário admin uma vez via php/api/setup-admin.php (e remover depois).
  Não validado em browser ainda — testar com `npm run dev` em /admin.

  Fase 5 — Deploy & polish

  - [x] NO AR (luixzsouza.com.br): API PHP + MySQL verificada em produção (PHP 8.2,
  9 tabelas seedadas; leituras 200, auth rejeita credencial errada 401, escrita exige
  login 401; /admin loga). config.php real criado em public_html/php (NÃO versionar).
  - [~] Export estático → Hostinger (.htaccess pronto em public/: URLs limpas,
  HTTPS, gzip/brotli, cache imutável, headers de segurança, 404). O backend PHP NÃO
  faz parte do export — usar `npm run build:deploy` (= next build + scripts/copy-php.mjs)
  que copia src/php → out/php SEM config.php nem sql/. No servidor: o backend fica em
  public_html/php (mesma origem, pois api.ts usa API_BASE="/php"); criar
  public_html/php/config.php real (a partir do .example) e importar schema.sql + seed.sql
  via phpMyAdmin. O rewrite do .htaccess não intercepta /php/*.php (cond !-f).
  - [x] Migrar React RC → 19 estável (react/react-dom 19.2.x, @types/react@19;
  sem --legacy-peer-deps)
  - [x] Performance: deps não usadas removidas, assets órfãos limpos (public 30MB→8.7MB),
  imagens → WebP/JPG (-86%, out 32MB→11MB), next.config (optimizePackageImports,
  removeConsole), Next 15.0.1→15.5.18 (patch de segurança), 2 imagens quebradas corrigidas
  - [x] Acessibilidade: skip-link bilíngue + foco visível global (:focus-visible) em
  globals.css; <main id="conteudo"> único por página (home/about/work/contact/project/
  services/certificates/404/500/styleguide); menu mobile com inert quando fechado + fecha
  no Escape; foco-visível em ClimUp, cards (FeaturedWork/WorkGrid) e inputs do contato;
  região aria-live nas mensagens do formulário. (lang já sincroniza via LanguageProvider)
  - [x] SEO completo: config central (lib/seo.ts), metadata global (metadataBase,
  OG/Twitter, robots max-image-preview), canonical por página (corrigido /sobre→/about),
  robots.txt + sitemap.xml (rotas + projetos) + manifest.webmanifest, JSON-LD
  (@graph Person/WebSite/ProfilePage, BreadcrumbList, CreativeWork por projeto)
  - [x] /styleguide com noindex (robots index:false em styleguide/page.tsx)
  - [x] Reordenar por drag-and-drop no painel: ação ?action=reorder (auth+CSRF) em
  projects/certificates/testimonials/milestones/services/skills (reordena skill_groups),
  via reorder_table() em lib.php (grava ordem 0,1,2… numa allowlist de tabelas). Cliente:
  reorder*(ids) em api.ts. UI: prop reorder no EntityManager → handle GripVertical + HTML5
  drag nativo (otimista, recarrega no erro); desabilitado enquanto há busca ativa. Skills
  dentro do grupo já reordenam pela ordem do array no update. ⚠️ exige rebuild/upload do
  php/ no servidor para ativar.
  - [x] Animações estilo Exoape (só frontend): Preloader (intro com contador 0→100 +
  marca <LS/>, cortina sobe; uma vez por sessão via sessionStorage, pula com
  reduced-motion), PageTransition (intercepta cliques em links internos na fase de
  captura → painel sobe de baixo cobrindo, troca a rota atrás, revela), template.tsx
  (conteúdo da nova página sobe/aparece) e indicador ativo no header que desliza
  lateralmente (motion layoutId). Marca compartilhada em components/layout/BrandMark.
  SiteHeader fecha o menu mobile no change de pathname (a navegação é interceptada).
