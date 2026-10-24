/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LocalizedText, LocalizedList } from "@/lib/i18n";

/** Imagem extra da galeria do projeto, com legenda opcional bilíngue. */
export interface ProjetoImagem {
    src: string;
    legenda?: LocalizedText;
}

/** Categorias de projetos */
export type ProjetoCategoria =
    | "websites"
    | "applications"
    | "apis"
    | "games"
    | "tools"
    | "academic"
    | "real-projects"
    | "design"
    | "mobile"
    | "backend";

/** Status do projeto */
export type ProjetoStatus = "active" | "archived" | "in-development" | "prototype";

/** Nível de complexidade */
export type ProjetoComplexidade = "basic" | "intermediate" | "advanced" | "expert";

export interface Projeto {
    id: string; // ID único para facilitar referências
    nome: string;
    imagem?: string;

    // Metadados expandidos
    categoria: ProjetoCategoria;
    status: ProjetoStatus;
    complexidade: ProjetoComplexidade;
    destaque: boolean; // Se deve aparecer nos destaques

    // Tecnologias com categorização
    tecnologias: string[];
    tecnologiasPrincipais: string[]; // Stack principal (max 3)

    // Métricas do projeto
    duracao?: string; // "2 semanas", "1 mês", etc.
    tamanhoEquipe?: number;

    links: {
        linkedin?: string;
        github?: string;
        verProjeto?: string;
        figma?: string;
        video?: string; // Demo em vídeo
        documentacao?: string;
    };

    descricao?: LocalizedText;
    data?: LocalizedText;

    // Conteúdo expandido
    resumo?: LocalizedText;
    conteudo?: LocalizedList;
    galeria?: ProjetoImagem[];

    // Novos campos para melhor organização
    objetivos?: LocalizedList; // Objetivos do projeto
    desafios?: LocalizedList; // Principais desafios enfrentados
    aprendizados?: LocalizedList; // O que foi aprendido
    melhorias?: LocalizedList; // Possíveis melhorias futuras

    // SEO e social
    tags?: string[]; // Tags para busca
    ogImage?: string; // Imagem para compartilhamento social
}

// Helper para completar projetos com campos padrão
function completeProject(project: unknown): Projeto {
    const p = project as Record<string, any>;
    const slugifiedId = p.id || p.nome.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return {
        ...p,
        id: slugifiedId,
        categoria: p.categoria || "websites",
        status: p.status || "active",
        complexidade: p.complexidade || "intermediate",
        destaque: p.destaque || false,
        tecnologiasPrincipais: p.tecnologiasPrincipais || p.tecnologias?.slice(0, 3) || [],
        duracao: p.duracao,
        tamanhoEquipe: p.tamanhoEquipe || 1,
        tags: p.tags || []
    } as Projeto;
}

const rawProjects = [
    {
        id: "sistema-up",
        nome: "Sistema UP",
        imagem: "/mockup/sistema-up.webp",
        categoria: "real-projects",
        status: "active",
        complexidade: "expert",
        destaque: true,
        tecnologias: ["Next.js", "React", "TypeScript", "Supabase", "PostgreSQL", "Zustand", "Zod", "Tailwind CSS", "PWA", "Service Worker", "Web Push", "Leaflet", "TanStack Table"],
        tecnologiasPrincipais: ["Next.js", "Supabase", "TypeScript"],
        duracao: "3 meses",
        tamanhoEquipe: 1,
        links: {
            verProjeto: "https://upinconfidentes.com.br"
        },
        descricao: {
            pt: "Plataforma completa de uma sorveteria: landing com SEO, cardápio digital com pedido e acompanhamento em tempo real, e frente de caixa (PDV) que continua vendendo sem internet.",
            en: "Full platform for an ice-cream shop: SEO landing page, digital menu with real-time order tracking, and a point-of-sale that keeps selling offline."
        },
        data: { pt: "2026", en: "2026" },
        galeria: [
            { src: "/mockup/sistema-up-home.webp", legenda: { pt: "Página inicial", en: "Home page" } },
            { src: "/mockup/sistema-up-home-1.webp", legenda: { pt: "Página inicial — seção 1", en: "Home page — section 1" } },
            { src: "/mockup/sistema-up-home-2.webp", legenda: { pt: "Página inicial — seção 2", en: "Home page — section 2" } },
            { src: "/mockup/sistema-up-home-3.webp", legenda: { pt: "Página inicial — seção 3", en: "Home page — section 3" } }
        ],
        resumo: {
            pt: "Três produtos, um banco só: site público, cardápio/pedidos do cliente e o sistema de caixa da equipe — offline-first.",
            en: "Three products, one database: public site, customer menu/ordering and the staff POS — offline-first."
        },
        conteudo: {
            pt: [
                "A Sorveteria UP, em Inconfidentes/MG, anotava pedidos no papel e no WhatsApp. O objetivo era unificar tudo: o cliente pede pelo celular, o pedido cai no caixa, a equipe acompanha a produção e o dono enxerga vendas e estoque.",
                "Construí três produtos sobre um único banco (Supabase/PostgreSQL): a landing pública com SEO, o cardápio digital mobile-first com página por produto e acompanhamento do pedido em tempo real por link, e o Sistema UP — PDV da equipe com venda no balcão, clientes, histórico, estoque e fechamento de caixa.",
                "O requisito mais duro foi a internet do interior: o caixa não pode parar quando o provedor cai. Um Service Worker pré-carrega as telas do caixa, as vendas vão para uma fila local e sincronizam sozinhas quando a rede volta, e as senhas saem de um bloco reservado enquanto havia conexão.",
                "Há ainda modo demonstração sem banco (o app inteiro roda em memória), notificações push, mapa de entrega com Leaflet e exportação para Excel. Está em produção, com mais de 450 commits."
            ],
            en: [
                "UP, an ice-cream shop in Inconfidentes/MG, took orders on paper and WhatsApp. The goal was to unify everything: customers order from their phone, the order lands at the register, staff follow production and the owner sees sales and stock.",
                "I built three products on a single database (Supabase/PostgreSQL): the public SEO landing page, a mobile-first digital menu with per-product pages and real-time order tracking via link, and Sistema UP — the staff POS with counter sales, customers, history, stock and cash closing.",
                "The hardest requirement was rural internet: the register can't stop when the provider goes down. A Service Worker pre-caches the POS screens, sales go to a local queue and sync automatically when the connection returns, and order numbers come from a block reserved while online.",
                "There is also a database-free demo mode (the whole app runs in memory), push notifications, a Leaflet delivery map and Excel export. It's in production, with 450+ commits."
            ]
        },
        objetivos: {
            pt: [
                "Tirar os pedidos do papel e do WhatsApp para um fluxo único",
                "Dar ao cliente pedido e acompanhamento em tempo real pelo celular",
                "Garantir que o caixa venda mesmo sem internet"
            ],
            en: [
                "Move orders from paper and WhatsApp into a single flow",
                "Give customers real-time ordering and tracking on their phone",
                "Make sure the register sells even without internet"
            ]
        },
        desafios: {
            pt: [
                "Arquitetura offline-first: fila local de vendas com sincronização posterior",
                "Tempo real entre cardápio do cliente e caixa da equipe",
                "Três produtos com permissões diferentes sobre o mesmo banco (RLS)"
            ],
            en: [
                "Offline-first architecture: local sales queue with later sync",
                "Real time between the customer menu and the staff register",
                "Three products with different permissions over one database (RLS)"
            ]
        },
        aprendizados: {
            pt: [
                "Offline não é um detalhe: muda a modelagem (ids, senhas e conflitos) desde o início.",
                "Um modo demonstração em memória acelera o desenvolvimento e as apresentações ao cliente.",
                "Desenhar a tela a partir da operação real (balcão, uma mão, fila) vale mais que qualquer template."
            ],
            en: [
                "Offline isn't a detail: it changes the data model (ids, numbering, conflicts) from day one.",
                "An in-memory demo mode speeds up development and client presentations.",
                "Designing screens from the real operation (counter, one hand, queue) beats any template."
            ]
        },
        tags: ["pdv", "pwa", "offline", "supabase", "next.js", "tempo real"]
    },
    {
        id: "silver-ocean",
        nome: "Silver Ocean",
        imagem: "/mockup/silver-ocean.webp",
        categoria: "real-projects",
        status: "active",
        complexidade: "advanced",
        destaque: true,
        tecnologias: ["Next.js", "React", "TypeScript", "Supabase", "PHP", "Mercado Pago", "Melhor Envio", "Zod", "React Hook Form", "Tailwind CSS", "Playwright", "SEO"],
        tecnologiasPrincipais: ["Next.js", "Supabase", "TypeScript"],
        tamanhoEquipe: 1,
        links: {
            github: "https://github.com/LuixzSouza",
            verProjeto: "https://silverocean925.com.br"
        },
        descricao: {
            pt: "E-commerce completo de joias em prata 925: catálogo por categorias, carrinho, contas de cliente, rastreio de pedidos e checkout com Pix e cartões.",
            en: "Full silver 925 jewelry e-commerce: category catalog, cart, customer accounts, order tracking and checkout with Pix and cards."
        },
        data: { pt: "2026", en: "2026" },
        galeria: [
            { src: "/mockup/silver-ocean-home.webp", legenda: { pt: "Página inicial", en: "Home page" } },
            { src: "/mockup/silver-ocean-home-1.webp", legenda: { pt: "Página inicial — seção 1", en: "Home page — section 1" } },
            { src: "/mockup/silver-ocean-home-2.webp", legenda: { pt: "Página inicial — seção 2", en: "Home page — section 2" } },
            { src: "/mockup/silver-ocean-home-3.webp", legenda: { pt: "Página inicial — seção 3", en: "Home page — section 3" } },
            { src: "/mockup/silver-ocean-home-4.webp", legenda: { pt: "Página inicial — seção 4", en: "Home page — section 4" } },
            { src: "/mockup/silver-ocean-institucional-garantia.webp", legenda: { pt: "Página de garantia vitalícia", en: "Lifetime warranty page" } }
        ],
        resumo: {
            pt: "Loja virtual de joias em prata 925 com design elegante, jornada de compra completa e foco em conversão.",
            en: "Silver 925 jewelry online store with elegant design, a complete purchase journey and a focus on conversion."
        },
        conteudo: {
            pt: [
                "A Silver Ocean é uma marca de joias em prata 925 que precisava de uma loja própria à altura do produto — elegante, rápida e confiável. O desafio era cobrir toda a jornada de compra, do catálogo ao pagamento, sem abrir mão de uma estética minimalista e premium.",
                "Construí um e-commerce completo: navegação por categorias (anéis, colares, brincos, pulseiras, linha masculina e personalizados), carrinho, contas de cliente com lista de favoritos e rastreamento de pedidos. O checkout aceita Pix e os principais cartões, com parcelamento.",
                "No técnico, priorizei performance e SEO: imagens em WebP, carregamento otimizado e estrutura pensada para ranquear no Google. A interface é totalmente responsiva e usa animações sutis para dar sofisticação sem pesar.",
                "O resultado é uma loja que transmite confiança — reforçada por garantia vitalícia, troca facilitada e prova social (mais de 850 avaliações com média 4.9). Hoje está no ar atendendo clientes em todo o Brasil."
            ],
            en: [
                "Silver Ocean is a silver 925 jewelry brand that needed a store worthy of the product — elegant, fast and trustworthy. The challenge was to cover the entire purchase journey, from catalog to payment, without giving up a minimalist, premium aesthetic.",
                "I built a complete e-commerce: category navigation (rings, necklaces, earrings, bracelets, men's line and personalized pieces), cart, customer accounts with a wishlist and order tracking. Checkout accepts Pix and the main credit cards, with installments.",
                "On the technical side, I prioritized performance and SEO: WebP images, optimized loading and a structure built to rank on Google. The interface is fully responsive and uses subtle animations for sophistication without weight.",
                "The result is a store that conveys trust — reinforced by a lifetime warranty, easy returns and social proof (850+ reviews averaging 4.9). It is live today, serving customers across Brazil."
            ]
        },
        objetivos: {
            pt: [
                "Entregar uma experiência de compra premium, do catálogo ao checkout",
                "Suportar pagamento com Pix e cartões com parcelamento",
                "Garantir performance e SEO para ranquear e converter"
            ],
            en: [
                "Deliver a premium shopping experience, from catalog to checkout",
                "Support payment via Pix and credit cards with installments",
                "Ensure performance and SEO to rank and convert"
            ]
        },
        desafios: {
            pt: [
                "Estruturar carrinho, contas de cliente e rastreio de pedidos",
                "Integrar gateway de pagamento (Pix + cartões) de forma segura",
                "Manter a loja rápida mesmo com muitas imagens de produto (WebP)"
            ],
            en: [
                "Structure cart, customer accounts and order tracking",
                "Securely integrate the payment gateway (Pix + cards)",
                "Keep the store fast even with many product images (WebP)"
            ]
        },
        aprendizados: {
            pt: [
                "Integrar pagamentos reais (Pix + cartões) exige cuidado com estados de erro e confirmação assíncrona.",
                "Em e-commerce, performance é conversão: cada imagem otimizada conta.",
                "Uma navegação por categorias bem pensada reduz a fricção até o checkout."
            ],
            en: [
                "Integrating real payments (Pix + cards) requires care with error states and asynchronous confirmation.",
                "In e-commerce, performance is conversion: every optimized image counts.",
                "Well-thought-out category navigation reduces friction all the way to checkout."
            ]
        },
        tags: ["e-commerce", "joias", "loja virtual", "next.js", "react"]
    },
    {
        id: "thai-cross",
        nome: "Thai Cross — Gestão de Academia",
        imagem: "/mockup/thai-cross.webp",
        galeria: [
            { src: "/mockup/thai-cross-chamada.webp", legenda: { pt: "Chamada do dia, feita no celular", en: "Daily attendance, taken on a phone" } },
            { src: "/mockup/thai-cross-mensalidades.webp", legenda: { pt: "Mensalidades e cobrança", en: "Monthly fees and billing" } },
            { src: "/mockup/thai-cross-alunos-lista.webp", legenda: { pt: "Alunos com busca e matrículas", en: "Students with search and enrollments" } }
        ],
        categoria: "real-projects",
        status: "active",
        complexidade: "advanced",
        destaque: true,
        tecnologias: ["Next.js", "TypeScript", "Prisma", "MySQL", "NextAuth", "Tailwind CSS", "Vitest", "GitHub Actions", "PM2", "Zod"],
        tecnologiasPrincipais: ["Next.js", "Prisma", "MySQL"],
        duracao: "2 meses",
        tamanhoEquipe: 1,
        links: {},
        descricao: {
            pt: "Sistema de gestão para uma academia de Muaythai e Cross Training: alunos, presença, mensalidades e inadimplência, com papéis de acesso e deploy automatizado.",
            en: "Management system for a Muay Thai and Cross Training gym: students, attendance, monthly fees and overdue tracking, with role-based access and automated deploys."
        },
        data: { pt: "2026", en: "2026" },
        resumo: {
            pt: "Dois módulos, um sistema só — feito para a rotina real da academia, com a chamada marcada em pé, no celular.",
            en: "Two modules, one system — built around the gym's real routine, with attendance taken standing up, on a phone."
        },
        conteudo: {
            pt: [
                "Uma academia de Muaythai que também administra uma equipe de Cross Training controlava alunos e cobranças em planilhas. Construí um sistema sob medida com painel (caixa do mês, atrasos, presença do dia, quem parou de aparecer), alunos, presença, mensalidades e configurações.",
                "O modelo separa Aluno de Matrícula: quem treina as duas modalidades tem um cadastro e duas matrículas, cada uma com valor e vencimento próprios. Inadimplência não é um status gravado, e sim calculada (pendente e vencida) — assim nunca fica desatualizada na virada do dia. Cada mensalidade guarda o próprio valor, então reajustes não reescrevem o histórico.",
                "Acesso por papel (admin, professor de Muaythai, professora de Cross), cada um com a identidade visual da sua casa. Testes com Vitest nas quatro camadas e deploy contínuo por GitHub Actions para um VPS com PM2."
            ],
            en: [
                "A Muay Thai gym that also runs a Cross Training team managed students and payments in spreadsheets. I built a tailored system with a dashboard (monthly revenue, overdue, today's attendance, who stopped showing up), students, attendance, monthly fees and settings.",
                "The model separates Student from Enrollment: someone training both modalities has one record and two enrollments, each with its own price and due date. Overdue isn't a stored status but computed (pending and past due), so it never goes stale overnight. Each fee stores its own amount, so price changes don't rewrite history.",
                "Role-based access (admin, Muay Thai coach, Cross coach), each with its own branding. Tested with Vitest across four layers and continuously deployed via GitHub Actions to a VPS running PM2."
            ]
        },
        desafios: {
            pt: [
                "Modelagem de dados que suporte aluno em duas modalidades",
                "Geração idempotente de mensalidades e cobrança via WhatsApp",
                "Controle de acesso derivado sempre do papel, nunca da pessoa"
            ],
            en: [
                "A data model supporting one student across two modalities",
                "Idempotent monthly fee generation and WhatsApp billing",
                "Access control always derived from role, never from the person"
            ]
        },
        aprendizados: {
            pt: [
                "Estado derivado é mais confiável que estado gravado quando depende do tempo.",
                "CI/CD com testes desde o início dá segurança para entregar toda semana.",
                "Sistema sob medida ganha de genérico quando parte de como o cliente trabalha."
            ],
            en: [
                "Derived state beats stored state when it depends on time.",
                "CI/CD with tests from the start makes weekly delivery safe.",
                "Tailored beats generic when it starts from how the client actually works."
            ]
        },
        tags: ["gestão", "academia", "prisma", "mysql", "next.js", "ci/cd"]
    },
    {
        id: "turn-io",
        nome: "Turn.io — Webflow → Next.js",
        imagem: "/mockup/turn-io.webp",
        categoria: "real-projects",
        status: "active",
        complexidade: "expert",
        destaque: true,
        tecnologias: ["Next.js", "TypeScript", "GSAP", "Rive", "PurgeCSS", "Lightning CSS", "esbuild", "Playwright", "Lighthouse", "axe", "Vercel"],
        tecnologiasPrincipais: ["Next.js", "TypeScript", "Playwright"],
        tamanhoEquipe: 1,
        links: {
            verProjeto: "https://turn-io.vercel.app"
        },
        descricao: {
            pt: "Migração do site da Turn.io (healthtech de WhatsApp) do Webflow para código: visual idêntico, PageSpeed mobile de 35 para 98.",
            en: "Migration of Turn.io's website (WhatsApp healthtech) from Webflow to code: pixel-identical, mobile PageSpeed from 35 to 98."
        },
        data: { pt: "2026", en: "2026" },
        galeria: [
            { src: "/mockup/turn-io-home.webp", legenda: { pt: "Página inicial", en: "Home page" } },
            { src: "/mockup/turn-io-home-1.webp", legenda: { pt: "Página inicial — seção 1", en: "Home page — section 1" } },
            { src: "/mockup/turn-io-home-2.webp", legenda: { pt: "Página inicial — seção 2", en: "Home page — section 2" } },
            { src: "/mockup/turn-io-home-3.webp", legenda: { pt: "Página inicial — seção 3", en: "Home page — section 3" } }
        ],
        resumo: {
            pt: "Pipeline que converte o site publicado no Webflow em páginas Next.js estáticas, com QA visual e de performance automatizado.",
            en: "A pipeline that converts the published Webflow site into static Next.js pages, with automated visual and performance QA."
        },
        conteudo: {
            pt: [
                "O site da Turn.io rodava no Webflow com PageSpeed mobile de 35 e vários erros de console. A proposta era sair da plataforma mantendo o site idêntico — layout, conteúdo, imagens e animações — e ganhar controle total de código, performance e hospedagem.",
                "Em vez de reescrever à mão, criei um pipeline que converte o HTML publicado em páginas Next.js: HTML estático sem React no navegador, CSS reduzido e embutido por página, imagens no tamanho exibido e scripts carregados só na primeira interação. Coleções do CMS viram templates.",
                "A qualidade é garantida por ferramentas: comparação visual original × local em 1440 e 375 px com Playwright, Lighthouse, axe para acessibilidade e uma auditoria que varre links quebrados e rolagem horizontal.",
                "Resultado: PageSpeed mobile de 35 para 98 na home (média 95 em 15 páginas), desktop 98–100, SEO e boas práticas 100 e zero erros de console. Entreguei também um relatório em PDF para a diretoria."
            ],
            en: [
                "Turn.io's website ran on Webflow with a mobile PageSpeed of 35 and several console errors. The goal was to leave the platform while keeping the site identical — layout, content, images and animations — and gain full control over code, performance and hosting.",
                "Instead of rewriting by hand, I built a pipeline that converts the published HTML into Next.js pages: static HTML with no React in the browser, per-page purged and inlined CSS, images at display size and scripts loaded on first interaction. CMS collections become templates.",
                "Quality is enforced by tooling: original vs. local visual diffs at 1440 and 375 px with Playwright, Lighthouse, axe for accessibility and an audit that scans for broken links and horizontal scroll.",
                "Result: mobile PageSpeed from 35 to 98 on the home page (95 average across 15 pages), desktop 98–100, SEO and best practices 100 and zero console errors. I also delivered a PDF report for the leadership."
            ]
        },
        aprendizados: {
            pt: [
                "Automatizar a conversão é mais seguro e repetível do que reescrever página a página.",
                "QA visual automatizado transforma 'idêntico ao original' em algo verificável.",
                "A maior parte do ganho de performance vem de enviar menos: CSS, JS e bytes de imagem."
            ],
            en: [
                "Automating the conversion is safer and more repeatable than rewriting page by page.",
                "Automated visual QA turns 'identical to the original' into something verifiable.",
                "Most performance gains come from shipping less: CSS, JS and image bytes."
            ]
        },
        tags: ["performance", "webflow", "migração", "next.js", "core web vitals"]
    },
    {
        id: "berilo-cafe",
        nome: "Berilo Café",
        imagem: "/mockup/berilo-cafe.webp",
        categoria: "real-projects",
        status: "active",
        complexidade: "advanced",
        destaque: true,
        tecnologias: ["Next.js", "React", "TypeScript", "Supabase", "PHP", "Mercado Pago", "Melhor Envio", "Correios API", "Zustand", "Zod", "Tailwind CSS", "SEO"],
        tecnologiasPrincipais: ["Next.js", "Supabase", "TypeScript"],
        tamanhoEquipe: 1,
        links: {
            github: "https://github.com/LuixzSouza",
            verProjeto: "https://berilocafe.com.br"
        },
        descricao: {
            pt: "E-commerce de cafés especiais de uma torrefação artesanal de Minas Gerais: catálogo de cafés, contas de cliente, página institucional e FAQ.",
            en: "Specialty coffee e-commerce for an artisanal roastery from Minas Gerais: coffee catalog, customer accounts, brand story and FAQ."
        },
        data: { pt: "2026", en: "2026" },
        galeria: [
            { src: "/mockup/berilo-cafe-home.webp", legenda: { pt: "Página inicial", en: "Home page" } },
            { src: "/mockup/berilo-cafe-home-1.webp", legenda: { pt: "Página inicial — seção 1", en: "Home page — section 1" } },
            { src: "/mockup/berilo-cafe-home-2.webp", legenda: { pt: "Página inicial — seção 2", en: "Home page — section 2" } },
            { src: "/mockup/berilo-cafe-home-3.webp", legenda: { pt: "Página inicial — seção 3", en: "Home page — section 3" } }
        ],
        resumo: {
            pt: "Loja de cafés especiais com narrativa de marca, catálogo de produtos e experiência de compra limpa e responsiva.",
            en: "Specialty coffee store with brand storytelling, a product catalog and a clean, responsive buying experience."
        },
        conteudo: {
            pt: [
                "O Berilo é uma torrefação artesanal do Campo das Vertentes, em Minas Gerais, que queria levar seus cafés especiais para todo o Brasil. Mais do que vender, o site precisava contar a história do produto — origem rastreável e torra em micro-lotes — para sustentar o posicionamento premium.",
                "Desenvolvi uma loja com forte narrativa de marca: home editorial, catálogo de cafés ('Nossos Cafés'), página 'Sobre Nós' com a história da torrefação, contato dedicado e um FAQ que antecipa as principais dúvidas. Há também autenticação de clientes.",
                "A prioridade técnica foi equilibrar storytelling com a usabilidade de um e-commerce, mantendo tudo rápido (imagens em WebP) e responsivo, com SEO desde a base.",
                "O projeto entrega uma experiência limpa e sofisticada, reforçada por prova social (4.9 no Google) e garantia de devolução incondicional — a confiança necessária para a compra online de um produto sensorial como café."
            ],
            en: [
                "Berilo is an artisanal roastery from the Campo das Vertentes region in Minas Gerais that wanted to take its specialty coffees to all of Brazil. More than selling, the site had to tell the product's story — traceable origin and micro-batch roasting — to support the premium positioning.",
                "I built a store with strong brand storytelling: an editorial home, a coffee catalog ('Nossos Cafés'), an 'About Us' page with the roastery's history, a dedicated contact page and a FAQ that anticipates the main questions. It also includes customer authentication.",
                "The technical priority was to balance storytelling with e-commerce usability, keeping everything fast (WebP images) and responsive, with SEO from the ground up.",
                "The project delivers a clean, sophisticated experience, reinforced by social proof (4.9 on Google) and an unconditional return guarantee — the trust needed to buy a sensory product like coffee online."
            ]
        },
        objetivos: {
            pt: [
                "Contar a história da marca e da origem dos grãos (Campo das Vertentes)",
                "Apresentar o catálogo de cafés e levar o cliente à compra",
                "Transmitir confiança com prova social, FAQ e garantia"
            ],
            en: [
                "Tell the brand and bean-origin story (Campo das Vertentes)",
                "Showcase the coffee catalog and guide the customer to purchase",
                "Build trust with social proof, FAQ and a guarantee"
            ]
        },
        desafios: {
            pt: [
                "Equilibrar narrativa editorial com a usabilidade de uma loja",
                "Implementar autenticação de clientes",
                "Otimizar imagens (WebP) e SEO para performance"
            ],
            en: [
                "Balance editorial storytelling with store usability",
                "Implement customer authentication",
                "Optimize images (WebP) and SEO for performance"
            ]
        },
        aprendizados: {
            pt: [
                "Storytelling e usabilidade não competem — uma home editorial pode converter tanto quanto uma loja 'seca'.",
                "Conteúdo bem estruturado (FAQ, 'Sobre Nós') reduz dúvidas e objeções de compra.",
                "Otimização de imagens e SEO desde o início evita retrabalho depois."
            ],
            en: [
                "Storytelling and usability don't compete — an editorial home can convert as well as a plain store.",
                "Well-structured content (FAQ, 'About Us') reduces doubts and purchase objections.",
                "Optimizing images and SEO from the start avoids rework later."
            ]
        },
        tags: ["e-commerce", "café", "loja virtual", "next.js", "react"]
    },
    {
        id: "estetica-ana-clara",
        nome: "Estética Ana Clara",
        imagem: "/mockup/estetica-ana-clara.webp",
        categoria: "real-projects",
        status: "active",
        complexidade: "advanced",
        destaque: true,
        tecnologias: ["Next.js", "React", "TypeScript", "Prisma", "PostgreSQL", "Auth.js", "Tailwind CSS", "FullCalendar", "Resend", "Cloudinary", "Zod"],
        tecnologiasPrincipais: ["Next.js", "Prisma", "PostgreSQL"],
        tamanhoEquipe: 1,
        links: {
            verProjeto: "https://esteticaanaclara.com.br"
        },
        descricao: {
            pt: "Site e painel de gestão de uma clínica de estética: landing com SEO local e blog, agenda de atendimentos, clientes e financeiro.",
            en: "Website and management dashboard for an aesthetics clinic: local-SEO landing page and blog, appointment calendar, clients and finances."
        },
        data: { pt: "2025 — 2026", en: "2025 — 2026" },
        galeria: [
            { src: "/mockup/estetica-ana-clara-home.webp", legenda: { pt: "Página inicial", en: "Home page" } },
            { src: "/mockup/estetica-ana-clara-home-1.webp", legenda: { pt: "Página inicial — seção 1", en: "Home page — section 1" } },
            { src: "/mockup/estetica-ana-clara-home-2.webp", legenda: { pt: "Página inicial — seção 2", en: "Home page — section 2" } },
            { src: "/mockup/estetica-ana-clara-home-3.webp", legenda: { pt: "Página inicial — seção 3", en: "Home page — section 3" } }
        ],
        resumo: {
            pt: "Do site que traz a cliente ao painel que organiza a agenda e o caixa da clínica.",
            en: "From the site that brings in clients to the dashboard that runs the clinic's schedule and finances."
        },
        conteudo: {
            pt: [
                "Uma esteticista e massoterapeuta de Inconfidentes/MG precisava ser encontrada no Google e parar de controlar a agenda no caderno. Desenvolvi o site público (serviços, sobre, blog e contato via WhatsApp) com SEO local, e um painel administrativo protegido por login.",
                "No painel: agenda com FullCalendar, cadastro de clientes, controle financeiro com relatórios em PDF, upload de imagens via Cloudinary e e-mails transacionais com Resend. Dados em PostgreSQL com Prisma e autenticação com Auth.js."
            ],
            en: [
                "An esthetician and massage therapist in Inconfidentes/MG needed to be found on Google and stop managing her schedule on paper. I built the public site (services, about, blog and WhatsApp contact) with local SEO, plus a login-protected admin dashboard.",
                "The dashboard includes a FullCalendar schedule, client records, financial control with PDF reports, image uploads via Cloudinary and transactional e-mail with Resend. Data lives in PostgreSQL with Prisma, authentication with Auth.js."
            ]
        },
        tags: ["clínica", "agenda", "painel", "prisma", "seo local"]
    },
    {
        id: "prefeitura-inconfidentes",
        nome: "Portal da Prefeitura de Inconfidentes",
        imagem: "/mockup/prefeitura-inconfidentes-home.webp",
        categoria: "real-projects",
        status: "archived",
        complexidade: "advanced",
        destaque: false,
        tecnologias: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "NextAuth", "Tailwind CSS", "Zod", "React Hook Form"],
        tecnologiasPrincipais: ["Next.js", "Prisma", "PostgreSQL"],
        duracao: "3 meses",
        tamanhoEquipe: 1,
        links: {},
        descricao: {
            pt: "Portal oficial do município com painel administrativo (CMS) para a equipe publicar notícias e conteúdo sem código. Desenvolvido no estágio (jun–ago/2025).",
            en: "Official city portal with an admin panel (CMS) so staff can publish news and content without code. Built during my internship (Jun–Aug 2025)."
        },
        data: { pt: "2025", en: "2025" },
        galeria: [
            { src: "/mockup/prefeitura-inconfidentes-home.webp", legenda: { pt: "Página inicial", en: "Home page" } },
            { src: "/mockup/prefeitura-inconfidentes-departamentos.webp", legenda: { pt: "Departamentos municipais", en: "Municipal departments" } },
            { src: "/mockup/prefeitura-inconfidentes-home-1.webp", legenda: { pt: "Página inicial — seção 1", en: "Home page — section 1" } },
            { src: "/mockup/prefeitura-inconfidentes-municipio-turismo-e-lazer.webp", legenda: { pt: "Turismo e lazer", en: "Tourism and leisure" } },
            { src: "/mockup/prefeitura-inconfidentes-ouvidoria.webp", legenda: { pt: "Ouvidoria municipal", en: "Ombudsman office" } }
        ],
        resumo: {
            pt: "Site público informativo para o cidadão + CMS completo para a prefeitura.",
            en: "Public information site for citizens + a full CMS for city hall."
        },
        tags: ["governo", "cms", "full-stack", "prisma", "next.js"]
    },
    {
        id: "zapscribe",
        nome: "Zapscribe",
        imagem: "/mockup/zapscribe-home.webp",
        categoria: "tools",
        status: "active",
        complexidade: "advanced",
        tecnologias: ["Python", "faster-whisper", "SQLite", "IA local", "Text-to-Speech"],
        tecnologiasPrincipais: ["Python", "faster-whisper", "SQLite"],
        links: { github: "https://github.com/LuixzSouza/zapscribe" },
        descricao: {
            pt: "Transcreve áudios do WhatsApp 100% no computador (sem enviar nada à internet) e monta o prompt para a IA. Fila, histórico, clientes e texto→áudio.",
            en: "Transcribes WhatsApp audio 100% locally (nothing leaves the machine) and builds the prompt for the AI. Queue, history, clients and text-to-speech."
        },
        data: { pt: "2026", en: "2026" },
        galeria: [
            { src: "/mockup/zapscribe-home.webp", legenda: { pt: "Página inicial", en: "Home page" } }
        ],
        tags: ["ia", "whisper", "python", "produtividade"]
    },
    {
        id: "garimpo",
        nome: "Garimpo — Oportunidades de Revenda",
        imagem: "/mockup/garimpo-home.webp",
        categoria: "tools",
        status: "active",
        complexidade: "advanced",
        tecnologias: ["Python", "Web Scraping", "CLI", "Banco de dados", "Automação"],
        tecnologiasPrincipais: ["Python", "Web Scraping", "Automação"],
        links: {},
        descricao: {
            pt: "Varre promoções de ~16 lojas, cruza o mesmo código de barras entre elas e mostra só o que dá lucro de verdade na revenda, com painel no navegador.",
            en: "Scans deals from ~16 stores, matches the same barcode across them and shows only what is actually profitable to resell, with a browser dashboard."
        },
        data: { pt: "2026", en: "2026" },
        galeria: [
            { src: "/mockup/garimpo-home.webp", legenda: { pt: "Página inicial", en: "Home page" } },
            { src: "/mockup/garimpo-home-1.webp", legenda: { pt: "Página inicial — seção 1", en: "Home page — section 1" } }
        ],
        tags: ["python", "scraping", "automação", "dados"]
    },
    {
        id: "agilify",
        nome: "Agilify — Landing SaaS",
        imagem: "/mockup/agilify-home.webp",
        categoria: "real-projects",
        status: "active",
        complexidade: "intermediate",
        tecnologias: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Framer Motion", "React Hook Form", "Zod", "Resend", "next-intl"],
        tecnologiasPrincipais: ["Next.js", "shadcn/ui", "Resend"],
        links: {},
        descricao: {
            pt: "Landing e funil de captura de uma plataforma de emissão fiscal: todo CTA abre um modal de lead que notifica por e-mail (Resend) e leva ao WhatsApp com a origem do clique.",
            en: "Landing page and lead funnel for a tax-invoicing SaaS: every CTA opens a lead modal that notifies via e-mail (Resend) and hands off to WhatsApp with the click source."
        },
        data: { pt: "2026", en: "2026" },
        galeria: [
            { src: "/mockup/agilify-home.webp", legenda: { pt: "Página inicial", en: "Home page" } },
            { src: "/mockup/agilify-home-1.webp", legenda: { pt: "Página inicial — seção 1", en: "Home page — section 1" } },
            { src: "/mockup/agilify-home-2.webp", legenda: { pt: "Página inicial — seção 2", en: "Home page — section 2" } },
            { src: "/mockup/agilify-home-3.webp", legenda: { pt: "Página inicial — seção 3", en: "Home page — section 3" } }
        ],
        tags: ["landing page", "saas", "conversão", "next.js"]
    },
    {
        id: "prevencao-pep",
        nome: "App Prevenção de PEP",
        imagem: "/mockup/prevencao-pep.webp",
        categoria: "mobile",
        status: "active",
        complexidade: "intermediate",
        tecnologias: ["React Native", "Expo", "TypeScript", "Zustand", "React Navigation"],
        tecnologiasPrincipais: ["React Native", "Expo", "Zustand"],
        links: { github: "https://github.com/LuixzSouza/prevencao-pep-app" },
        descricao: {
            pt: "Aplicativo mobile de apoio clínico para estratificar o risco de pancreatite pós-CPRE e orientar a prevenção.",
            en: "Clinical-support mobile app to stratify the risk of post-ERCP pancreatitis and guide prevention."
        },
        data: { pt: "2026", en: "2026" },
        galeria: [
            { src: "/mockup/prevencao-pep.webp", legenda: { pt: "Boas-vindas, login e avaliação", en: "Welcome, login and assessment" } },
            { src: "/mockup/prevencao-pep-fluxo.webp", legenda: { pt: "Avaliação e resultado com conduta recomendada", en: "Assessment and result with recommended protocol" } }
        ],
        tags: ["mobile", "saúde", "react native", "expo"]
    },
    {
        id: "h4rdgame-manager",
        nome: "H4RD G4ME Manager",
        imagem: "/mockup/h4rdgame-manager-home.webp",
        categoria: "applications",
        status: "in-development",
        complexidade: "advanced",
        tecnologias: ["Next.js", "TypeScript", "NextAuth", "Radix UI", "Tailwind CSS", "API Clash of Clans"],
        tecnologiasPrincipais: ["Next.js", "NextAuth", "Radix UI"],
        links: { github: "https://github.com/LuixzSouza/clash-of-clans-dashboard" },
        descricao: {
            pt: "Painel de gestão de um clã de Clash of Clans: sincronização com a API oficial, hierarquia de cargos, detector de inatividade e tesouraria com eventos.",
            en: "Management dashboard for a Clash of Clans clan: sync with the official API, role hierarchy, inactivity detection and an events treasury."
        },
        data: { pt: "2025 — 2026", en: "2025 — 2026" },
        galeria: [
            { src: "/mockup/h4rdgame-manager-home.webp", legenda: { pt: "Página inicial", en: "Home page" } },
            { src: "/mockup/h4rdgame-manager-home-1.webp", legenda: { pt: "Página inicial — seção 1", en: "Home page — section 1" } },
            { src: "/mockup/h4rdgame-manager-login.webp", legenda: { pt: "Tela de acesso", en: "Login screen" } }
        ],
        tags: ["dashboard", "api", "next.js", "games"]
    },
    {
        id: "sistema-atendimento",
        nome: "Sistema de Atendimento Inteligente",
        imagem: "/mockup/sistema-atendimento-home.webp",
        categoria: "applications",
        status: "prototype",
        complexidade: "intermediate",
        tecnologias: ["Next.js", "TypeScript", "Supabase", "shadcn/ui", "React Hook Form", "Zod"],
        tecnologiasPrincipais: ["Next.js", "Supabase", "shadcn/ui"],
        links: {},
        descricao: {
            pt: "MVP que organiza o atendimento ao cliente: FAQs com palavras-chave, sugestão automática de respostas, histórico e métricas, com Supabase Auth.",
            en: "MVP that organizes customer support: keyword FAQs, automatic reply suggestions, history and metrics, with Supabase Auth."
        },
        data: { pt: "2026", en: "2026" },
        galeria: [
            { src: "/mockup/sistema-atendimento-home.webp", legenda: { pt: "Página inicial", en: "Home page" } },
            { src: "/mockup/sistema-atendimento-home-1.webp", legenda: { pt: "Página inicial — seção 1", en: "Home page — section 1" } },
            { src: "/mockup/sistema-atendimento-login.webp", legenda: { pt: "Tela de acesso", en: "Login screen" } }
        ],
        tags: ["atendimento", "supabase", "mvp"]
    },
    {
        id: "aromas-noma",
        nome: "Aromas Noma",
        imagem: "/mockup/aromas-noma-home.webp",
        categoria: "real-projects",
        status: "active",
        complexidade: "intermediate",
        tecnologias: ["Next.js", "React", "PHP", "MySQL", "Recharts", "Framer Motion"],
        tecnologiasPrincipais: ["Next.js", "PHP", "MySQL"],
        links: {},
        descricao: {
            pt: "ERP minimalista mobile-first + vitrine digital para uma marca de velas aromáticas: estoque, fluxo de caixa e relatórios pelo celular, com API PHP na Hostinger.",
            en: "Mobile-first minimalist ERP + digital storefront for a scented-candle brand: stock, cash flow and reports from a phone, with a PHP API on Hostinger."
        },
        data: { pt: "2026", en: "2026" },
        galeria: [
            { src: "/mockup/aromas-noma-home.webp", legenda: { pt: "Página inicial", en: "Home page" } },
            { src: "/mockup/aromas-noma-home-2.webp", legenda: { pt: "Página inicial — seção 2", en: "Home page — section 2" } },
            { src: "/mockup/aromas-noma-login.webp", legenda: { pt: "Tela de acesso", en: "Login screen" } }
        ],
        tags: ["erp", "vitrine", "php", "mobile-first"]
    },
    {
        id: "eduardo-souza-portfolio",
        nome: "Portfólio Eduardo Souza",
        imagem: "/mockup/eduardo-souza-portfolio-pt.webp",
        categoria: "websites",
        status: "active",
        complexidade: "intermediate",
        tecnologias: ["Next.js", "GSAP", "Lenis", "next-intl"],
        tecnologiasPrincipais: ["Next.js", "GSAP", "Lenis"],
        links: { github: "https://github.com/LuixzSouza/eduardo-design-portfolio" },
        descricao: {
            pt: "Portfólio de um designer com 10+ anos de carreira, com animações de scroll em GSAP e rolagem suave — desenvolvido a partir do design dele.",
            en: "Portfolio for a designer with 10+ years of experience, with GSAP scroll animations and smooth scrolling — built from his design."
        },
        data: { pt: "2025", en: "2025" },
        galeria: [
            { src: "/mockup/eduardo-souza-portfolio-pt.webp", legenda: { pt: "Página inicial", en: "Home page" } },
            { src: "/mockup/eduardo-souza-portfolio-pt-2.webp", legenda: { pt: "Página inicial — seção 2", en: "Home page — section 2" } },
            { src: "/mockup/eduardo-souza-portfolio-pt-3.webp", legenda: { pt: "Página inicial — seção 3", en: "Home page — section 3" } }
        ],
        tags: ["portfólio", "gsap", "animação", "next.js"]
    },
    {
        id: "formula-idiomas",
        nome: "Formula Idiomas",
        imagem: "/mockup/m-banconeon.webp",
        categoria: "real-projects",
        status: "active",
        complexidade: "intermediate",
        destaque: true,
        tecnologias: ["HTML5", "CSS3", "JavaScript", "PHP", "PHPMailer", "AOS", "MySQL", "Responsive Design"],
        tecnologiasPrincipais: ["JavaScript", "PHP", "MySQL"],
        duracao: "3 semanas",
        tamanhoEquipe: 1,
        links: {
            linkedin: "https://www.linkedin.com/posts/luiz-antonio-souza-5000a226b_webdevelopment-frontenddevelopment-edutech-activity-7199815632731684864-gagJ?utm_source=share&utm_medium=member_desktop",
            github: "https://github.com/LuixzSouza",
            verProjeto: "https://www.formulaidiomas.com.br"
        },
        descricao: {
            pt: "Site institucional completo para escola de idiomas com sistema de contato integrado",
            en: "Complete institutional website for language school with integrated contact system",
            es: "Sitio institucional completo para escuela de idiomas con sistema de contacto integrado",
            fr: "Site institutionnel complet pour école de langues avec système de contact intégré",
            de: "Vollständige Unternehmenswebsite für Sprachschule mit integriertem Kontaktsystem",
            it: "Sito istituzionale completo per scuola di lingue con sistema di contatto integrato",
            zh: "为语言学校提供的完整机构网站，具有集成联系系统",
            ja: "言語学校向けの統合型コンタクトシステムを備えた完全な機関向けウェブサイト",
            ru: "Полный корпоративный веб-сайт языковой школы с интегрированной системой контактов",
            ar: "موقع مؤسسي كامل لمدرسة لغات مع نظام اتصال متكامل",
            hi: "भाषा स्कूल के लिए एकीकृत संपर्क प्रणाली के साथ पूर्ण संस्थागत वेबसाइट",
            ko: "통합된 연락 시스템이 있는 언어 학교를 위한 완벽한 기관 웹사이트",
            id: "Situs institusional lengkap untuk sekolah bahasa dengan sistem kontak terintegrasi"
        },
        data: { pt: "16 de Setembro 2024", en: "September 16, 2024" },
        galeria: [
            { src: "/mockup/formula-idiomas-home.webp", legenda: { pt: "Página inicial", en: "Home page" } },
            { src: "/mockup/formula-idiomas-home-1.webp", legenda: { pt: "Página inicial — seção 1", en: "Home page — section 1" } },
            { src: "/mockup/formula-idiomas-home-2.webp", legenda: { pt: "Página inicial — seção 2", en: "Home page — section 2" } },
            { src: "/mockup/formula-idiomas-home-3.webp", legenda: { pt: "Página inicial — seção 3", en: "Home page — section 3" } }
        ],
        resumo: {
            pt: "Website profissional para escola de idiomas focado em conversão e experiência do usuário",
            en: "Professional website for language school focused on conversion and user experience",
            es: "Sitio web profesional para escuela de idiomas enfocado en conversión y experiencia del usuario",
            fr: "Site web professionnel pour école de langues axé sur la conversion et l'expérience utilisateur",
            de: "Professionelle Website für Sprachschule mit Fokus auf Konversion und Benutzererlebnis",
            it: "Sito web professionale per scuola di lingue focalizzato sulla conversione e l'esperienza utente",
            zh: "针对语言学校的专业网站，专注于转化和用户体验",
            ja: "コンバージョンとユーザーエクスペリエンスに焦点を当てた言語学校向けの専門的なウェブサイト",
            ru: "Профессиональный веб-сайт языковой школы с акцентом на конверсию и пользовательский опыт",
            ar: "موقع ويب احترافي لمدرسة لغات يركز على التحويل وتجربة المستخدم",
            hi: "भाषा स्कूल के लिए पेशेवर वेबसाइट जो रूपांतरण और उपयोगकर्ता अनुभव पर केंद्रित है",
            ko: "전환 및 사용자 경험에 초점을 맞춘 언어 학교를 위한 전문 웹사이트",
            id: "Situs web profesional untuk sekolah bahasa yang berfokus pada konversi dan pengalaman pengguna"
        },
        objetivos: {
            pt: [
                "Criar presença digital profissional para a escola",
                "Aumentar captação de alunos através do site",
                "Facilitar contato entre interessados e a instituição"
            ],
            en: [
                "Create professional digital presence for the school",
                "Increase student acquisition through the website",
                "Facilitate contact between prospects and institution"
            ],
            es: [
                "Crear una presencia digital profesional para la escuela",
                "Aumentar la adquisición de estudiantes a través del sitio web",
                "Facilitar el contacto entre prospectos e institución"
            ],
            fr: [
                "Créer une présence numérique professionnelle pour l'école",
                "Augmenter l'acquisition d'étudiants via le site web",
                "Faciliter le contact entre les prospects et l'établissement"
            ],
            de: [
                "Professionelle digitale Präsenz für die Schule schaffen",
                "Studentengewinnung durch die Website erhöhen",
                "Kontakt zwischen Interessenten und Institution erleichtern"
            ],
            it: [
                "Creare una presenza digitale professionale per la scuola",
                "Aumentare l'acquisizione di studenti tramite il sito web",
                "Facilitare il contatto tra potenziali clienti e istituzione"
            ],
            zh: [
                "为学校创建专业的数字形象",
                "通过网站增加学生招募",
                "促进潜在客户与机构之间的联系"
            ],
            ja: [
                "学校のための専門的なデジタルプレゼンスを作成する",
                "ウェブサイトを通じて学生獲得を増加させる",
                "見込み客と機関間のコンタクトを促進する"
            ],
            ru: [
                "Создать профессиональное цифровое присутствие для школы",
                "Увеличить приобретение студентов через веб-сайт",
                "Облегчить контакт между потенциальными клиентами и учреждением"
            ],
            ar: [
                "إنشاء حضور رقمي احترافي للمدرسة",
                "زيادة اكتساب الطلاب من خلال الموقع",
                "تسهيل التواصل بين المتوقعين والمؤسسة"
            ],
            hi: [
                "स्कूल के लिए व्यावसायिक डिजिटल उपस्थिति बनाएं",
                "वेबसाइट के माध्यम से छात्र अधिग्रहण बढ़ाएं",
                "संभावित ग्राहकों और संस्थान के बीच संपर्क सुविधाजनक बनाएं"
            ],
            ko: [
                "학교를 위한 전문적인 디지털 존재감 구축",
                "웹사이트를 통한 학생 확보 증가",
                "잠재 고객과 기관 간의 접촉 촉진"
            ],
            id: [
                "Ciptakan kehadiran digital profesional untuk sekolah",
                "Tingkatkan perolehan siswa melalui situs web",
                "Memfasilitasi kontak antara prospek dan institusi"
            ]
        },
        desafios: {
            pt: [
                "Criar design que transmitisse confiança e profissionalismo",
                "Implementar sistema de contato confiável",
                "Otimizar para conversão sem ser invasivo"
            ],
            en: [
                "Create design that conveyed trust and professionalism",
                "Implement reliable contact system",
                "Optimize for conversion without being intrusive"
            ],
            es: [
                "Crear un diseño que transmitiera confianza y profesionalismo",
                "Implementar un sistema de contacto confiable",
                "Optimizar para conversión sin ser invasivo"
            ],
            fr: [
                "Créer un design qui transmettait confiance et professionnalisme",
                "Mettre en œuvre un système de contact fiable",
                "Optimiser pour la conversion sans être intrusif"
            ],
            de: [
                "Ein Design schaffen, das Vertrauen und Professionalität vermittelte",
                "Zuverlässiges Kontaktsystem implementieren",
                "Für Konversion optimieren, ohne aufdringlich zu sein"
            ],
            it: [
                "Creare un design che trasmettesse fiducia e professionalità",
                "Implementare un sistema di contatto affidabile",
                "Ottimizzare per la conversione senza essere invadente"
            ],
            zh: [
                "创建传达信任和专业性的设计",
                "实施可靠的联系系统",
                "优化转化而不显得过于推销"
            ],
            ja: [
                "信頼と専門性を伝えるデザインを作成する",
                "信頼できるコンタクトシステムを実装する",
                "押し付けがましくなく、コンバージョンのために最適化する"
            ],
            ru: [
                "Создать дизайн, который передавал доверие и профессионализм",
                "Реализовать надежную систему контактов",
                "Оптимизировать для конверсии, не будучи навязчивым"
            ],
            ar: [
                "إنشاء تصميم ينقل الثقة والمهنية",
                "تنفيذ نظام اتصال موثوق",
                "التحسين من أجل التحويل دون أن يكون مزعجًا"
            ],
            hi: [
                "विश्वास और व्यावसायिकता प्रदान करने वाली डिज़ाइन बनाएं",
                "विश्वसनीय संपर्क प्रणाली लागू करें",
                "आक्रामक हुए बिना रूपांतरण के लिए अनुकूलित करें"
            ],
            ko: [
                "신뢰와 전문성을 전달하는 디자인 만들기",
                "신뢰할 수 있는 연락 시스템 구현",
                "방해적이지 않으면서 전환을 위해 최적화"
            ],
            id: [
                "Ciptakan desain yang mengkomunikasikan kepercayaan dan profesionalisme",
                "Implementasikan sistem kontak yang dapat diandalkan",
                "Optimalkan untuk konversi tanpa bersikap mengganggu"
            ]
        },
        aprendizados: {
            pt: [
                "Importância do UX em sites institucionais",
                "Configuração avançada do PHPMailer",
                "Otimização de performance em hospedagem compartilhada"
            ],
            en: [
                "Importance of UX in institutional websites",
                "Advanced PHPMailer configuration",
                "Performance optimization on shared hosting"
            ],
            es: [
                "Importancia de la UX en sitios web institucionales",
                "Configuración avanzada de PHPMailer",
                "Optimización de rendimiento en alojamiento compartido"
            ],
            fr: [
                "Importance de l'UX dans les sites institutionnels",
                "Configuration avancée de PHPMailer",
                "Optimisation des performances sur un hébergement partagé"
            ],
            de: [
                "Bedeutung der UX auf institutionellen Websites",
                "Fortgeschrittene PHPMailer-Konfiguration",
                "Performance-Optimierung auf gemeinsamen Hosting-Servern"
            ],
            it: [
                "Importanza dell'UX nei siti istituzionali",
                "Configurazione avanzata di PHPMailer",
                "Ottimizzazione delle prestazioni su hosting condiviso"
            ],
            zh: [
                "机构网站中UX的重要性",
                "PHPMailer高级配置",
                "共享托管上的性能优化"
            ],
            ja: [
                "機関向けウェブサイトにおけるUXの重要性",
                "PHPMailerの高度な設定",
                "共有ホスティング上のパフォーマンス最適化"
            ],
            ru: [
                "Важность UX на корпоративных веб-сайтах",
                "Расширенная конфигурация PHPMailer",
                "Оптимизация производительности на общем хостинге"
            ],
            ar: [
                "أهمية تجربة المستخدم في المواقع المؤسسية",
                "تكوين PHPMailer المتقدم",
                "تحسين الأداء على الاستضافة المشتركة"
            ],
            hi: [
                "संस्थागत वेबसाइटों में UX की महत्ता",
                "PHPMailer कॉन्फ़िगरेशन उन्नत",
                "साझा होस्टिंग पर प्रदर्शन अनुकूलन"
            ],
            ko: [
                "기관 웹사이트에서 UX의 중요성",
                "PHPMailer 고급 구성",
                "공유 호스팅에서의 성능 최적화"
            ],
            id: [
                "Pentingnya UX di situs web institusional",
                "Konfigurasi PHPMailer tingkat lanjut",
                "Optimasi kinerja di hosting bersama"
            ]
        },
        tags: ["institucional", "educação", "conversão", "php", "javascript"],
        ogImage: "/mockup/m-banconeon.webp"
    },
    {
        id: "casa-pronta",
        nome: "Casa Pronta",
        imagem: "/mockup/m-barberweb.webp",
        categoria: "real-projects",
        status: "active",
        complexidade: "advanced",
        destaque: true,
        tecnologias: ["HTML5", "CSS3", "JavaScript", "Next.js", "React", "PHP", "PHPMailer", "GSAP", "TypeScript", "Tailwind CSS"],
        tecnologiasPrincipais: ["Next.js", "React", "GSAP"],
        duracao: "4 semanas",
        tamanhoEquipe: 1,
        links: {
            linkedin: "https://www.linkedin.com/in/luiz-antonio-souza-5000a226b/",
            github: "https://github.com/LuixzSouza",
            verProjeto: "https://casaprontaconstrusilva.com.br"
        },
        descricao: {
            pt: "Site institucional moderno para construtora com animações avançadas e foco em conversão",
            en: "Modern institutional website for construction company with advanced animations and conversion focus",
            es: "Sitio web institucional moderno para constructora con animaciones avanzadas y enfoque en conversión",
            fr: "Site institutionnel moderne pour entreprise de construction avec animations avancées et focus sur la conversion",
            de: "Modernes Unternehmenswebsite für Bauunternehmen mit erweiterten Animationen und Konversionsfokus",
            it: "Sito istituzionale moderno per azienda di costruzioni con animazioni avanzate e focus sulla conversione",
            zh: "建筑公司的现代机构网站，具有高级动画和转换焦点",
            ja: "高度なアニメーション和转换焦点を備えた建設会社向けの現代的な機関向けウェブサイト",
            ru: "Современный корпоративный веб-сайт строительной компании с расширенной анимацией и фокусом на конверсию",
            ar: "موقع مؤسسي حديث لشركة إنشاءات مع رسوم متحركة متقدمة وتركيز على التحويل",
            hi: "निर्माण कंपनी के लिए उन्नत एनिमेशन और रूपांतरण फोकस के साथ आधुनिक संस्थागत वेबसाइट",
            ko: "고급 애니메이션과 전환 초점이 있는 건설 회사를 위한 현대적인 기관 웹사이트",
            id: "Situs web institusional modern untuk perusahaan konstruksi dengan animasi canggih dan fokus konversi"
        },
        data: { pt: "20 de Janeiro 2025", en: "January 20, 2025" },
        // EXEMPLO de conteúdo rico — troque os textos e os prints pelos reais.
        resumo: {
            pt: "Site institucional para uma construtora, focado em apresentar serviços e gerar contato.",
            en: "Institutional website for a construction company, focused on showcasing services and generating leads.",
            es: "Sitio web institucional para una empresa constructora, enfocado en mostrar servicios y generar contactos.",
            fr: "Site institutionnel pour une entreprise de construction, axé sur la présentation des services et la génération de leads.",
            de: "Unternehmenswebsite für ein Bauunternehmen, fokussiert auf die Präsentation von Dienstleistungen und Lead-Generierung.",
            it: "Sito istituzionale per un'azienda costruttrice, focalizzato sulla presentazione dei servizi e sulla generazione di lead.",
            zh: "建筑公司的机构网站，专注于展示服务和生成潜在客户。",
            ja: "建設会社の機関向けウェブサイト、サービスの展示とリード生成に焦点を当てています。",
            ru: "Корпоративный веб-сайт для строительной компании, сосредоточенный на демонстрации услуг и генерировании лидов.",
            ar: "موقع مؤسسي لشركة بناء، يركز على عرض الخدمات وتوليد العملاء المحتملين.",
            hi: "एक निर्माण कंपनी के लिए संस्थागत वेबसाइट, सेवाओं को प्रदर्शित करने और लीड उत्पन्न करने पर केंद्रित।",
            ko: "건설 회사를 위한 기관 웹사이트로 서비스 선보이기 및 리드 생성에 중점을 두고 있습니다.",
            id: "Situs web institusional untuk perusahaan konstruksi, berfokus pada menampilkan layanan dan menghasilkan prospek."
        },
        conteudo: {
            pt: [
                "A Casa Pronta precisava de uma presença digital que transmitisse solidez e confiança, apresentando os serviços da construtora de forma clara e convidando o visitante a entrar em contato.",
                "Desenvolvi a interface em Next.js e React, com animações sutis (GSAP) que dão ritmo à navegação sem pesar no carregamento. O layout é totalmente responsivo, do desktop ao celular.",
                "O formulário de contato roda em PHP com PHPMailer, entregando as mensagens direto no e-mail da empresa — simples de manter e sem depender de serviços externos.",
            ],
            en: [
                "Casa Pronta needed a digital presence that conveyed solidity and trust, presenting the company's services clearly and inviting visitors to get in touch.",
                "I built the interface with Next.js and React, with subtle GSAP animations that give the navigation rhythm without slowing it down. The layout is fully responsive, from desktop to mobile.",
                "The contact form runs on PHP with PHPMailer, delivering messages straight to the company's inbox — easy to maintain and free of external services.",
            ],
            es: [
                "Casa Pronta necesitaba una presencia digital que transmitiera solidez y confianza, presentando los servicios de la constructora de forma clara e invitando a los visitantes a contactar.",
                "Construí la interfaz con Next.js y React, con animaciones sutiles (GSAP) que dan ritmo a la navegación sin ralentizar. El diseño es totalmente responsivo, desde escritorio a móvil.",
                "El formulario de contacto funciona en PHP con PHPMailer, entregando mensajes directamente a la bandeja de entrada de la empresa — fácil de mantener y sin depender de servicios externos.",
            ],
            fr: [
                "Casa Pronta avait besoin d'une présence numérique qui transmettait solidité et confiance, présentant les services de l'entreprise clairement et invitant les visiteurs à se mettre en contact.",
                "J'ai construit l'interface avec Next.js et React, avec des animations subtiles (GSAP) qui donnent du rythme à la navigation sans la ralentir. La mise en page est entièrement réactive, du bureau au mobile.",
                "Le formulaire de contact fonctionne en PHP avec PHPMailer, livrant les messages directement à la boîte de réception de l'entreprise — facile à maintenir et sans dépendre de services externes.",
            ],
            de: [
                "Casa Pronta brauchte eine digitale Präsenz, die Solidität und Vertrauen vermittelte, die Dienstleistungen des Unternehmens klar darstellte und Besucher einlud, Kontakt aufzunehmen.",
                "Ich baute die Schnittstelle mit Next.js und React mit subtilen GSAP-Animationen, die der Navigation Rhythmus geben, ohne sie zu verlangsamen. Das Layout ist vollständig responsiv, vom Desktop zum Mobilgerät.",
                "Das Kontaktformular läuft auf PHP mit PHPMailer und liefert Nachrichten direkt in den Posteingang des Unternehmens — einfach zu warten und frei von externen Diensten.",
            ],
            it: [
                "Casa Pronta aveva bisogno di una presenza digitale che trasmettesse solidità e fiducia, presentando i servizi dell'azienda in modo chiaro e invitando i visitatori a mettersi in contatto.",
                "Ho costruito l'interfaccia con Next.js e React, con animazioni sottili (GSAP) che danno ritmo alla navigazione senza rallentarla. Il layout è completamente responsivo, da desktop a mobile.",
                "Il modulo di contatto gira su PHP con PHPMailer, fornendo i messaggi direttamente alla posta in arrivo dell'azienda — facile da mantenere e senza dipendere da servizi esterni.",
            ],
            zh: [
                "Casa Pronta需要一个传达稳定性和信任的数字形象，清晰地展示承包商的服务，并邀请访客联系。",
                "我用Next.js和React构建了界面，带有微妙的GSAP动画，为导航增添节奏而不会降低速度。布局从桌面到移动设备都完全响应。",
                "联系表单在PHP和PHPMailer上运行，将消息直接发送到公司收件箱 — 易于维护，无需依赖外部服务。",
            ],
            ja: [
                "Casa Prontaは、堅牢性と信頼を伝えるデジタルプレゼンス、請負業者のサービスを明確に提示し、訪問者に連絡を促すことが必要でした。",
                "Next.jsとReactでインターフェースを構築し、微妙なGSAPアニメーションがナビゲーションにリズムを与え、速度を低下させません。レイアウトはデスクトップからモバイルまで完全にレスポンシブです。",
                "連絡フォームはPHPとPHPMailerで実行され、メッセージを会社の受信トレイに直接配信 — 保守が簡単で外部サービスに依存しません。",
            ],
            ru: [
                "Casa Pronta нуждалась в цифровом присутствии, которое передавало бы надежность и доверие, четко представляло услуги компании и приглашало посетителей связаться.",
                "Я создал интерфейс с помощью Next.js и React с тонкой анимацией GSAP, которая добавляет ритм навигации без замедления. Макет полностью отзывчив от рабочего стола к мобильному устройству.",
                "Форма контакта работает на PHP с PHPMailer, доставляя сообщения прямо на почту компании — легко поддерживать и без зависимости от внешних сервисов.",
            ],
            ar: [
                "كانت Casa Pronta بحاجة إلى حضور رقمي ينقل الاستقرار والثقة، يقدم خدمات الشركة بوضوح ويدعو الزوار للتواصل.",
                "قمت ببناء الواجهة باستخدام Next.js و React، مع رسوم متحركة GSAP دقيقة تعطي الملاحة إيقاعًا دون إبطاء. التخطيط سريع الاستجابة بالكامل من سطح المكتب إلى الجوال.",
                "نموذج الاتصال يعمل على PHP مع PHPMailer، يوصل الرسائل مباشرة إلى بريد الشركة — سهل الصيانة وخالي من الخدمات الخارجية.",
            ],
            hi: [
                "Casa Pronta को एक डिजिटल उपस्थिति की आवश्यकता थी जो स्थिरता और विश्वास प्रदान करे, कंपनी की सेवाओं को स्पष्ट रूप से प्रस्तुत करे और आगंतुकों को संपर्क करने के लिए आमंत्रित करे।",
                "मैंने Next.js और React के साथ इंटरफेस बनाया, सूक्ष्म GSAP एनिमेशन के साथ जो नेविगेशन को गति दिए बिना लय प्रदान करता है। लेआउट डेस्कटॉप से मोबाइल तक पूरी तरह से प्रतिक्रिया करता है।",
                "संपर्क फॉर्म PHP और PHPMailer पर चलता है, संदेशों को सीधे कंपनी के इनबॉक्स में पहुंचाता है — रखरखाव में आसान और बाहरी सेवाओं पर निर्भरता से मुक्त।",
            ],
            ko: [
                "Casa Pronta는 안정성과 신뢰를 전달하는 디지털 현존, 회사의 서비스를 명확하게 제시하고 방문자를 연락으로 초대하는 것이 필요했습니다.",
                "Next.js 및 React로 인터페이스를 구축했으며 미묘한 GSAP 애니메이션이 속도를 늦추지 않으면서 네비게이션에 리듬을 제공합니다. 레이아웃은 데스크톱에서 모바일까지 완전히 반응형입니다.",
                "연락처 양식은 PHP 및 PHPMailer에서 실행되며 메시지를 회사 받은 편지함으로 직접 전달 — 유지 관리가 쉽고 외부 서비스에 독립적입니다.",
            ],
            id: [
                "Casa Pronta membutuhkan kehadiran digital yang menyampaikan soliditas dan kepercayaan, menyajikan layanan perusahaan dengan jelas dan mengundang pengunjung untuk menghubungi.",
                "Saya membangun antarmuka dengan Next.js dan React, dengan animasi GSAP halus yang memberikan ritme pada navigasi tanpa memperlambatnya. Tata letak sepenuhnya responsif dari desktop ke mobile.",
                "Formulir kontak berjalan di PHP dengan PHPMailer, memberikan pesan langsung ke kotak masuk perusahaan — mudah dipertahankan dan bebas dari layanan eksternal.",
            ]
        },
        galeria: [
            { src: "/mockup/m-barberweb.webp", legenda: { pt: "Página inicial", en: "Home page" } },
            { src: "/mockup/m-blizzard.webp", legenda: { pt: "Seção de serviços", en: "Services section" } },,
            { src: "/mockup/casa-pronta-home.webp", legenda: { pt: "Página inicial", en: "Home page" } },
            { src: "/mockup/casa-pronta-home-1.webp", legenda: { pt: "Página inicial — seção 1", en: "Home page — section 1" } },
            { src: "/mockup/casa-pronta-home-2.webp", legenda: { pt: "Página inicial — seção 2", en: "Home page — section 2" } }
        ],
    },
    {
        id: "wireframes",
        nome: "WireFrimes",
        imagem: "/mockup/m-wirefrimes.webp",
        categoria: "design",
        status: "active",
        complexidade: "intermediate",
        destaque: false,
        tecnologias: ["UI/UX", "HTML5", "CSS3", "JavaScript", "Sass", "Gulp", "Netlify"],
        tecnologiasPrincipais: ["HTML5", "Sass", "JavaScript"],
        duracao: "2 semanas",
        tamanhoEquipe: 1,
        links: {
            linkedin: "https://www.linkedin.com/posts/luiz-antonio-souza-5000a226b_webdevelopment-frontenddevelopment-wireframetowebsite-activity-7286881599680376832-zmt7?utm_source=share&utm_medium=member_desktop",
            github: "https://github.com/LuixzSouza/WireFrames-Sites",
            verProjeto: "https://wireframe-training-luiz.netlify.app"
        },
        descricao: {
            pt: "Página interativa para navegar entre diferentes wireframes com menu dinâmico e práticas de desenvolvimento web.",
            en: "Interactive page to navigate between different wireframes with dynamic menu and web development best practices.",
            es: "Página interactiva para navegar entre diferentes wireframes con menú dinámico y mejores prácticas de desarrollo web.",
            fr: "Page interactive pour naviguer entre différents wireframes avec menu dynamique et meilleures pratiques de développement web.",
            de: "Interaktive Seite zum Navigieren zwischen verschiedenen Wireframes mit dynamischem Menü und Best Practices der Webentwicklung.",
            it: "Pagina interattiva per navigare tra diversi wireframe con menu dinamico e migliori pratiche di sviluppo web.",
            zh: "用于在不同的线框之间导航的交互式页面，具有动态菜单和网络开发最佳实践。",
            ja: "動的メニューおよびウェブ開発のベストプラクティスを備えた異なるワイヤーフレーム間をナビゲートするためのインタラクティブページ。",
            ru: "Интерактивная страница для навигации между различными макетами с динамическим меню и лучшими практиками веб-разработки.",
            ar: "صفحة تفاعلية للتنقل بين الأسلاك المختلفة مع قائمة ديناميكية وأفضل ممارسات تطوير الويب.",
            hi: "विभिन्न वायरफ्रेम के बीच नेविगेट करने के लिए एक इंटरैक्टिव पृष्ठ, गतिशील मेनू और वेब विकास सर्वोत्तम प्रथाओं के साथ।",
            ko: "동적 메뉴 및 웹 개발 모범 사례를 포함한 다양한 와이어프레임 간 탐색을 위한 대화형 페이지입니다.",
            id: "Halaman interaktif untuk menavigasi antara wireframe berbeda dengan menu dinamis dan praktik terbaik pengembangan web."
        },
        data: { pt: "12 de janeiro 2024", en: "January 12, 2024" },
        galeria: [
            { src: "/mockup/wireframes-home.webp", legenda: { pt: "Página inicial", en: "Home page" } },
            { src: "/mockup/wireframes-home-1.webp", legenda: { pt: "Página inicial — seção 1", en: "Home page — section 1" } },
            { src: "/mockup/wireframes-home-2.webp", legenda: { pt: "Página inicial — seção 2", en: "Home page — section 2" } }
        ],
        resumo: {
            pt: "Projeto de estudo focado na conversão de wireframes para interfaces funcionais",
            en: "Study project focused on converting wireframes to functional interfaces",
            es: "Proyecto de estudio enfocado en la conversión de wireframes a interfaces funcionales",
            fr: "Projet d'étude axé sur la conversion de wireframes en interfaces fonctionnelles",
            de: "Studienprojekt, das auf die Umwandlung von Wireframes in funktionale Schnittstellen konzentriert ist",
            it: "Progetto di studio incentrato sulla conversione di wireframe in interfacce funzionali",
            zh: "专注于将线框转换为功能界面的学习项目",
            ja: "ワイヤーフレームを機能的なインターフェースに変換することに焦点を当てた学習プロジェクト",
            ru: "Учебный проект, сосредоточенный на преобразовании макетов в функциональные интерфейсы",
            ar: "مشروع دراسي يركز على تحويل الأسلاك إلى واجهات وظيفية",
            hi: "वायरफ्रेम को कार्यात्मक इंटरफेस में परिवर्तित करने पर केंद्रित अध्ययन परियोजना",
            ko: "와이어프레임을 기능적 인터페이스로 변환하는 데 중점을 두는 학습 프로젝트",
            id: "Proyek studi yang berfokus pada konversi wireframe ke antarmuka fungsional"
        },
        objetivos: {
            pt: [
                "Praticar conversão de wireframes para código",
                "Implementar menu dinâmico e navegação fluida",
                "Aplicar boas práticas de desenvolvimento frontend"
            ],
            en: [
                "Practice wireframe to code conversion",
                "Implement dynamic menu and smooth navigation",
                "Apply frontend development best practices"
            ],
            es: [
                "Practicar conversión de wireframes a código",
                "Implementar menú dinámico y navegación fluida",
                "Aplicar mejores prácticas de desarrollo frontend"
            ],
            fr: [
                "Pratiquer la conversion de wireframes en code",
                "Implémenter un menu dynamique et une navigation fluide",
                "Appliquer les meilleures pratiques du développement frontend"
            ],
            de: [
                "Konvertierung von Wireframes in Code üben",
                "Dynamisches Menü und flüssige Navigation implementieren",
                "Best Practices der Frontend-Entwicklung anwenden"
            ],
            it: [
                "Praticare la conversione da wireframe a codice",
                "Implementare menu dinamico e navigazione fluida",
                "Applicare le migliori pratiche di sviluppo frontend"
            ],
            zh: [
                "练习线框到代码的转换",
                "实现动态菜单和流畅导航",
                "应用前端开发最佳实践"
            ],
            ja: [
                "ワイヤーフレームからコードへの変換を練習する",
                "動的メニューとスムーズなナビゲーションを実装する",
                "フロントエンド開発のベストプラクティスを適用する"
            ],
            ru: [
                "Практиковать преобразование макетов в код",
                "Реализовать динамическое меню и плавную навигацию",
                "Применить лучшие практики разработки фронтенда"
            ],
            ar: [
                "ممارسة تحويل الأسلاك إلى الكود",
                "تنفيذ القائمة الديناميكية والملاحة السلسة",
                "تطبيق أفضل ممارسات تطوير الواجهة الأمامية"
            ],
            hi: [
                "वायरफ्रेम से कोड रूपांतरण का अभ्यास करें",
                "गतिशील मेनू और सुचारू नेविगेशन लागू करें",
                "फ्रंटएंड विकास सर्वोत्तम प्रथाएं लागू करें"
            ],
            ko: [
                "와이어프레임에서 코드로의 변환을 연습하세요",
                "동적 메뉴 및 부드러운 탐색 구현",
                "프런트엔드 개발 모범 사례 적용"
            ],
            id: [
                "Praktik konversi wireframe ke kode",
                "Implementasikan menu dinamis dan navigasi yang halus",
                "Terapkan praktik terbaik pengembangan frontend"
            ]
        },
        aprendizados: {
            pt: [
                "Importância do planejamento visual antes da codificação",
                "Técnicas de menu dinâmico com JavaScript",
                "Organização de projeto com Sass e Gulp"
            ],
            en: [
                "Importance of visual planning before coding",
                "Dynamic menu techniques with JavaScript",
                "Project organization with Sass and Gulp"
            ],
            es: [
                "Importancia de la planificación visual antes de la codificación",
                "Técnicas de menú dinámico con JavaScript",
                "Organización de proyectos con Sass y Gulp"
            ],
            fr: [
                "Importance de la planification visuelle avant le codage",
                "Techniques de menu dynamique avec JavaScript",
                "Organisation du projet avec Sass et Gulp"
            ],
            de: [
                "Bedeutung der visuellen Planung vor dem Codieren",
                "Dynamische Menütechniken mit JavaScript",
                "Projektorganisation mit Sass und Gulp"
            ],
            it: [
                "Importanza della pianificazione visiva prima della codifica",
                "Tecniche di menu dinamico con JavaScript",
                "Organizzazione del progetto con Sass e Gulp"
            ],
            zh: [
                "编码前进行视觉规划的重要性",
                "使用JavaScript的动态菜单技术",
                "使用Sass和Gulp进行项目组织"
            ],
            ja: [
                "コーディング前のビジュアル計画の重要性",
                "JavaScriptでの動的メニュー技術",
                "SassとGulpを使用したプロジェクト組織"
            ],
            ru: [
                "Важность визуального планирования перед кодированием",
                "Методы динамического меню с JavaScript",
                "Организация проекта с Sass и Gulp"
            ],
            ar: [
                "أهمية التخطيط البصري قبل الترميز",
                "تقنيات القائمة الديناميكية مع JavaScript",
                "تنظيم المشروع باستخدام Sass و Gulp"
            ],
            hi: [
                "कोडिंग से पहले दृश्य योजना का महत्व",
                "JavaScript के साथ गतिशील मेनू तकनीकें",
                "Sass और Gulp के साथ प्रोजेक्ट संगठन"
            ],
            ko: [
                "코딩 전 시각적 계획의 중요성",
                "JavaScript를 사용한 동적 메뉴 기술",
                "Sass 및 Gulp를 사용한 프로젝트 조직"
            ],
            id: [
                "Pentingnya perencanaan visual sebelum pengkodean",
                "Teknik menu dinamis dengan JavaScript",
                "Organisasi proyek dengan Sass dan Gulp"
            ]
        },
        tags: ["wireframes", "ui-ux", "frontend", "sass", "gulp"],
        ogImage: "/mockup/m-wirefrimes.webp"
    },
    {
        id: "api-cep",
        nome: "API-CEP",
        imagem: "/mockup/m-apicep.webp",
        categoria: "apis",
        status: "active",
        complexidade: "basic",
        destaque: false,
        tecnologias: ["HTML5", "CSS3", "JavaScript", "API", "UI/UX"],
        tecnologiasPrincipais: ["JavaScript", "API", "HTML5"],
        duracao: "1 semana",
        tamanhoEquipe: 1,
        links: {
            linkedin: "https://www.linkedin.com/posts/luiz-antonio-souza-5000a226b_projeto-de-front-end-lan%C3%A7ado-buscar-cep-activity-7197338952368820224-wtLX?utm_source=share&utm_medium=member_desktop",
            github: "https://github.com/LuixzSouza/API_BuscarCep",
            verProjeto: "https://buscarcepluiz.netlify.app"
        },
        descricao: {
            pt: "Ferramenta para busca de CEPs no Brasil com informações detalhadas sobre endereços",
            en: "Tool to look up Brazilian postal codes with detailed address information",
        },
        data: { pt: "20 de Maio 2024", en: "May 20, 2024" },
        galeria: [
            { src: "/mockup/api-cep-home.webp", legenda: { pt: "Página inicial", en: "Home page" } }
        ],
        tags: ["api", "cep", "javascript", "brasil"],
    },
    {
        nome: "API-Pokemon",
        imagem: "/mockup/m-apipokemon.webp",
        tecnologias: ["HTML5", "CSS3", "JavaScript", "API"],
        links: {
            linkedin: "https://www.linkedin.com/posts/luiz-antonio-souza-5000a226b_projeto-de-front-end-pokemon-sobre-activity-7197338670616498178-FYUo?utm_source=share&utm_medium=member_desktop",
            github: "https://github.com/LuixzSouza/Pokemon",
            verProjeto: "https://pokemonluiz.netlify.app"
        },
        descricao: {
            pt: "Este site foi desenvolvido para oferecer um guia completo de Pokémons, ideal para fãs que querem explorar e caçar Pokémons pelo mundo, integrando dados de uma API para exibir informações detalhadas sobre cada Pokémon.",
            en: "This site was built to offer a complete Pokémon guide, ideal for fans who want to explore and hunt Pokémon around the world, integrating data from an API to display detailed information about each Pokémon.",
        },
        data: { pt: "20 de Maio 2024", en: "May 20, 2024" },
        galeria: [
            { src: "/mockup/api-pokemon-home.webp", legenda: { pt: "Página inicial", en: "Home page" } },
            { src: "/mockup/api-pokemon-home-1.webp", legenda: { pt: "Página inicial — seção 1", en: "Home page — section 1" } },
            { src: "/mockup/api-pokemon-home-2.webp", legenda: { pt: "Página inicial — seção 2", en: "Home page — section 2" } }
        ],
    },
    {
        nome: "BarberWeb",
        imagem: "/mockup/m-uiboost.webp",
        tecnologias: ["HTML5", "CSS", "Sass", "JavaScript", "UX/UI"],
        links: {
            linkedin: "https://www.linkedin.com/posts/luiz-antonio-souza-5000a226b_desenvolvimentoweb-frontend-educaaexaeto-activity-7199779916848975872-c5vG?utm_source=share&utm_medium=member_desktop",
            github: "https://github.com/LuixzSouza/CabeleireiroPratic",
            verProjeto: "https://cabeleireiroluiz.netlify.app"
        },
        descricao: {
            pt: "Este projeto foi desenvolvido com o objetivo de criar um site funcional e atraente para um salão de barbearia, oferecendo serviços de corte de cabelo e barba. Além de ser um projeto acadêmico integrador, que uniu estudantes do 4º e 2º período da faculdade, foi também uma oportunidade de praticar e aprimorar habilidades individuais em design e codificação, após a necessidade de reconstruir o projeto sem dados pessoais de terceiros, OBS: essas imagem foram criada com Inteligência Artificial.",
            en: "This project aimed to create a functional and appealing website for a barbershop, offering haircut and beard services. Besides being an integrative academic project that brought together 4th- and 2nd-semester college students, it was also a chance to practice and improve individual design and coding skills, after the need to rebuild it without third parties' personal data. NOTE: these images were created with Artificial Intelligence.",
        },
        data: { pt: "14 de Outubro 2024", en: "October 14, 2024" },
        galeria: [
            { src: "/mockup/barberweb-home.webp", legenda: { pt: "Página inicial", en: "Home page" } },
            { src: "/mockup/barberweb-home-1.webp", legenda: { pt: "Página inicial — seção 1", en: "Home page — section 1" } },
            { src: "/mockup/barberweb-home-2.webp", legenda: { pt: "Página inicial — seção 2", en: "Home page — section 2" } }
        ],
    },
    {
        nome: "Blizzard",
        imagem: "/mockup/m-blizzard.webp",
        tecnologias: ["HTML5", "CSS3", "Sass", "JavaScript"],
        links: {
            linkedin: "https://www.linkedin.com/posts/luiz-antonio-souza-5000a226b_projeto-de-front-end-blizzard-sobre-activity-7197338443922726912-bST3?utm_source=share&utm_medium=member_desktop",
            github: "https://github.com/LuixzSouza/Blizzard",
            verProjeto: "https://blizzardluiz.netlify.app"
        },
        descricao: {
            pt: "Este site foi desenvolvido para exibir uma série de jogos populares da Blizzard.",
            en: "This site was built to showcase a series of popular Blizzard games.",
        },
        data: { pt: "20 de Maio 2024", en: "May 20, 2024" },
        galeria: [
            { src: "/mockup/blizzard-home.webp", legenda: { pt: "Página inicial", en: "Home page" } },
            { src: "/mockup/blizzard-home-1.webp", legenda: { pt: "Página inicial — seção 1", en: "Home page — section 1" } },
            { src: "/mockup/blizzard-home-2.webp", legenda: { pt: "Página inicial — seção 2", en: "Home page — section 2" } }
        ],
    },
    {
        nome: "Calculadora",
        imagem: "/mockup/m-calculadora.webp",
        tecnologias: ["HTML5", "CSS3", "Sass", "JavaScript", "Faculdade"],
        links: {
            linkedin: "https://www.linkedin.com/in/luiz-antonio-souza-5000a226b/",
            github: "https://github.com/LuixzSouza/Calculadora-Web",
            verProjeto: "https://calculadora-pmbok.netlify.app"
        },
        descricao: {
            pt: "Calculadora Front-End Desenvolvida para apresentação de trabalho",
            en: "A front-end calculator built for a class presentation.",
        },
        data: { pt: "12 de janeiro 2024", en: "January 12, 2024" },
        galeria: [
            { src: "/mockup/calculadora-home.webp", legenda: { pt: "Página inicial", en: "Home page" } }
        ],
    },
    {
        nome: "CloudBoost",
        imagem: "/mockup/m-cloudboost.webp",
        tecnologias: ["HTML5", "CSS3", "Sass", "JavaScript"],
        links: {
            linkedin: "https://www.linkedin.com/posts/luiz-antonio-souza-5000a226b_projeto-cloudboost-sobre-o-projeto-activity-7197337712696184832-48T-?utm_source=share&utm_medium=member_desktop",
            github: "https://github.com/LuixzSouza/CloudBoost",
            verProjeto: "https://cloudboostluiz.netlify.app"
        },
        descricao: {
            pt: "CloudBoost é uma ferramenta de e-mail marketing projetada para ajudar empresas a aumentar suas vendas e fortalecer o relacionamento com clientes, focando em uma interface intuitiva e responsiva.",
            en: "CloudBoost is an email marketing tool designed to help companies boost sales and strengthen customer relationships, focusing on an intuitive and responsive interface.",
        },
        data: { pt: "20 de Maio 2024", en: "May 20, 2024" },
        galeria: [
            { src: "/mockup/cloudboost-home.webp", legenda: { pt: "Página inicial", en: "Home page" } },
            { src: "/mockup/cloudboost-home-1.webp", legenda: { pt: "Página inicial — seção 1", en: "Home page — section 1" } },
            { src: "/mockup/cloudboost-home-2.webp", legenda: { pt: "Página inicial — seção 2", en: "Home page — section 2" } }
        ],
    },
    {
        nome: "Primeiro Site",
        imagem: "/mockup/m-primeirosite.webp",
        tecnologias: ["HTML5", "CSS3", "JavaScript"],
        links: {
            linkedin: "https://www.linkedin.com/posts/luiz-antonio-souza-5000a226b_este-foi-meu-primeiro-site-de-front-end-activity-7197336365104037888-qZ7l?utm_source=share&utm_medium=member_desktop",
            github: "https://github.com/LuixzSouza/PrimeiroSite",
            verProjeto: "https://primeirositeold.netlify.app"
        },
        descricao: {
            pt: "Este site foi criado para demonstrar meus conhecimentos essenciais de desenvolvimento Front-End básico.",
            en: "This site was created to showcase my essential basic front-end development skills.",
        },
        data: { pt: "01 de janeiro 2024", en: "January 1, 2024" },
        galeria: [
            { src: "/mockup/primeiro-site-home.webp", legenda: { pt: "Página inicial", en: "Home page" } },
            { src: "/mockup/primeiro-site-home-1.webp", legenda: { pt: "Página inicial — seção 1", en: "Home page — section 1" } },
            { src: "/mockup/primeiro-site-home-2.webp", legenda: { pt: "Página inicial — seção 2", en: "Home page — section 2" } }
        ],
    },
    {
        nome: "Primeiro Site - Reform",
        imagem: "/mockup/m-primeirositereform.webp",
        tecnologias: ["HTML5", "CSS3", "JavaScript"],
        links: {
            linkedin: "https://www.linkedin.com/posts/luiz-antonio-souza-5000a226b_este-site-foi-uma-reformula%C3%A7%C3%A3o-do-primeiro-activity-7197337018165530624-wNUl?utm_source=share&utm_medium=member_desktop",
            github: "https://github.com/LuixzSouza/PrimeiroSiteReformula",
            verProjeto: "https://primeirositenew.netlify.app"
        },
        descricao: {
            pt: "Desenvolvi este site com intuito de aumentar o que foi criado no meu primeiro.",
            en: "I built this site to expand on what I created in my first one.",
        },
        data: { pt: "01 de janeiro 2024", en: "January 1, 2024" },
        galeria: [
            { src: "/mockup/primeiro-site-reform-home.webp", legenda: { pt: "Página inicial", en: "Home page" } },
            { src: "/mockup/primeiro-site-reform-home-1.webp", legenda: { pt: "Página inicial — seção 1", en: "Home page — section 1" } },
            { src: "/mockup/primeiro-site-reform-home-2.webp", legenda: { pt: "Página inicial — seção 2", en: "Home page — section 2" } }
        ],
    },
    {
        nome: "God of War Ragnarok",
        imagem: "/mockup/m-godofwarragarok.webp",
        tecnologias: ["HTML5", "CSS3", "Sass", "JavaScript"],
        links: {
            linkedin: "https://www.linkedin.com/posts/luiz-antonio-souza-5000a226b_projeto-de-front-end-god-of-war-ragnar%C3%B6k-activity-7197339199480455168-C8qH?utm_source=share&utm_medium=member_desktop",
            github: "https://github.com/LuixzSouza/GodOfWarRagnarok",
            verProjeto: "https://godofwarluiz.netlify.app"
        },
        descricao: {
            pt: "Desenvolvi um site promocional para o lançamento do jogo God of War Ragnarök.",
            en: "I built a promotional site for the launch of the game God of War Ragnarök.",
        },
        data: { pt: "20 de Maio 2024", en: "May 20, 2024" },
        galeria: [
            { src: "/mockup/god-of-war-ragnarok-home.webp", legenda: { pt: "Página inicial", en: "Home page" } },
            { src: "/mockup/god-of-war-ragnarok-home-1.webp", legenda: { pt: "Página inicial — seção 1", en: "Home page — section 1" } },
            { src: "/mockup/god-of-war-ragnarok-home-2.webp", legenda: { pt: "Página inicial — seção 2", en: "Home page — section 2" } }
        ],
    },
    {
        nome: "KingHost",
        imagem: "/mockup/m-kinghost.webp",
        tecnologias: ["HTML5", "CSS3", "Sass", "JavaScript"],
        links: {
            linkedin: "https://www.linkedin.com/posts/luiz-antonio-souza-5000a226b_projeto-kinghost-sobre-o-projeto-activity-7197337439034597376-97nr?utm_source=share&utm_medium=member_desktop",
            github: "https://github.com/LuixzSouza/KingHost",
            verProjeto: "https://kinghostluiz.netlify.app"
        },
        descricao: {
            pt: "KingHost é uma ferramenta de e-mail marketing projetada para ajudar empresas a aumentar vendas e fortalecer o relacionamento com clientes, focando em uma interface intuitiva e responsiva.",
            en: "KingHost is an email marketing tool designed to help companies increase sales and strengthen customer relationships, focusing on an intuitive and responsive interface.",
        },
        data: { pt: "12 de janeiro 2024", en: "January 12, 2024" },
        galeria: [
            { src: "/mockup/kinghost-home.webp", legenda: { pt: "Página inicial", en: "Home page" } },
            { src: "/mockup/kinghost-home-1.webp", legenda: { pt: "Página inicial — seção 1", en: "Home page — section 1" } },
            { src: "/mockup/kinghost-home-2.webp", legenda: { pt: "Página inicial — seção 2", en: "Home page — section 2" } }
        ],
    },
    {
        nome: "Banco Neon",
        imagem: "/mockup/m-itau.webp",
        tecnologias: ["HTML5", "CSS3", "WordPress", "JavaScript"],
        links: {
            linkedin: "https://www.linkedin.com/posts/luiz-antonio-souza-5000a226b_projeto-de-front-end-ip-neon-sobre-activity-7197338134496325632-1QSn?utm_source=share&utm_medium=member_desktop",
            github: "https://github.com/LuixzSouza/IpNeon",
            verProjeto: "https://ipneonluiz.netlify.app"
        },
        descricao: {
            pt: "Desenvolvi este redesign de página inicial para um banco digital.",
            en: "I built this homepage redesign for a digital bank.",
        },
        data: { pt: "20 de Maio 2024", en: "May 20, 2024" },
        galeria: [
            { src: "/mockup/banco-neon-home.webp", legenda: { pt: "Página inicial", en: "Home page" } },
            { src: "/mockup/banco-neon-home-1.webp", legenda: { pt: "Página inicial — seção 1", en: "Home page — section 1" } },
            { src: "/mockup/banco-neon-home-2.webp", legenda: { pt: "Página inicial — seção 2", en: "Home page — section 2" } }
        ],
    },
    {
        nome: "SI - Faculdade",
        imagem: "/mockup/m-sifaculdade.webp",
        tecnologias: ["HTML5", "CSS3", "Sass", "JavaScript"],
        links: {
            linkedin: "https://www.linkedin.com/in/luiz-antonio-souza-5000a226b/",
            github: "https://github.com/LuixzSouza",
            verProjeto: "https://github.com/LuixzSouza"
        },
        descricao: {
            pt: "Sistema de Informação é uma plataforma web desenvolvida para facilitar a gestão de informações, oferecendo uma solução intuitiva. Apresentando a Turma",
            en: "Information System is a web platform built to streamline information management, offering an intuitive solution. Introducing the class.",
        },
        data: { pt: "12 de janeiro 2024", en: "January 12, 2024" }
    },
    {
        nome: "UiBoost",
        imagem: "/mockup/m-tecsany.webp",
        tecnologias: ["Webflow"],
        links: {
            linkedin: "https://www.linkedin.com/posts/luiz-antonio-souza-5000a226b_projeto-de-front-end-uiboost-sobre-activity-7197662895793430528-nfR0?utm_source=share&utm_medium=member_desktop",
            github: "https://github.com/LuixzSouza",
            verProjeto: "https://uiboost-desafio.webflow.io"
        },
        descricao: {
            pt: "Este projeto foi desenvolvido como parte de um desafio de design Desenvolvimento web, ele destaca inovações em interfaces de usuário.",
            en: "This project was built as part of a web design and development challenge; it highlights innovations in user interfaces.",
        },
        data: { pt: "22 de janeiro 2024", en: "January 22, 2024" },
        galeria: [
            { src: "/mockup/uiboost-home.webp", legenda: { pt: "Página inicial", en: "Home page" } },
            { src: "/mockup/uiboost-home-2.webp", legenda: { pt: "Página inicial — seção 2", en: "Home page — section 2" } }
        ],
    },
    {
        nome: "SuperGet",
        imagem: "/mockup/m-superget.webp",
        tecnologias: ["HTML5", "CSS3", "Sass", "JavaScript", "React"],
        links: {
            linkedin: "https://www.linkedin.com/posts/luiz-antonio-souza-5000a226b_react-frontenddevelopment-webdevelopment-activity-7199046285767651328--fJN?utm_source=share&utm_medium=member_desktop",
            github: "https://github.com/LuixzSouza/SuperGetReact",
            verProjeto: "https://supergetluiz.netlify.app"
        },
        descricao: {
            pt: "Este projeto foi desenvolvido como parte de um exercício pessoal em React para aprimorar minhas habilidades de codificação e entender melhor os padrões de desenvolvimento web em React. Ele apresenta uma interface do produto SuperGet.",
            en: "This project was built as a personal React exercise to sharpen my coding skills and better understand React web development patterns. It presents an interface for the SuperGet product.",
        },
        data: { pt: "14 de Outubro 2024", en: "October 14, 2024" },
        galeria: [
            { src: "/mockup/superget-home.webp", legenda: { pt: "Página inicial", en: "Home page" } }
        ],
    },
    {
        nome: "Rede",
        imagem: "/mockup/m-rede.webp",
        tecnologias: ["HTML5", "CSS3", "Sass", "JavaScript", "React", "Next.js", "Tailwind", "Swiper"],
        links: {
            linkedin: "https://www.linkedin.com/in/luiz-antonio-souza-5000a226b/",
            github: "https://github.com/LuixzSouza/REDE-Site",
            verProjeto: "https://redeluiz.netlify.app"
        },
        descricao: {
            pt: "Este projeto é uma interface moderna e funcional, inspirada em plataformas de redes e serviços financeiros, com foco na performance e experiência do usuário. Desenvolvido com Next.js, Tailwind CSS, e Swiper, ele oferece navegação fluida e design responsivo.",
            en: "This project is a modern, functional interface inspired by network and financial service platforms, focused on performance and user experience. Built with Next.js, Tailwind CSS and Swiper, it offers smooth navigation and a responsive design.",
        },
        data: { pt: "12 de janeiro 2024", en: "January 12, 2024" },
        galeria: [
            { src: "/mockup/rede-home.webp", legenda: { pt: "Página inicial", en: "Home page" } },
            { src: "/mockup/rede-home-1.webp", legenda: { pt: "Página inicial — seção 1", en: "Home page — section 1" } },
            { src: "/mockup/rede-home-2.webp", legenda: { pt: "Página inicial — seção 2", en: "Home page — section 2" } }
        ],
    },
    {
        nome: "Itau",
        imagem: "/mockup/m-java-ong-trabalho.webp",
        tecnologias: ["HTML5", "CSS3", "Sass", "JavaScript", "React", "Next.js", "Tailwind", "Swiper"],
        links: {
            linkedin: "https://www.linkedin.com/in/luiz-antonio-souza-5000a226b/",
            github: "https://github.com/LuixzSouza/Itau-Site",
            verProjeto: "https://itauluiz.netlify.app"
        },
        descricao: {
            pt: "Este projeto foi inspirado no site de uma instituição financeira, buscando recriar uma interface moderna e responsiva, com foco na experiência do usuário e na performance. Ele foi desenvolvido com Next.js e Tailwind CSS, aproveitando o melhor dessas tecnologias para entregar um design elegante e funcional",
            en: "This project was inspired by a financial institution's website, aiming to recreate a modern, responsive interface focused on user experience and performance. It was built with Next.js and Tailwind CSS, leveraging the best of these technologies to deliver an elegant, functional design.",
        },
        data: { pt: "12 de janeiro 2024", en: "January 12, 2024" },
        galeria: [
            { src: "/mockup/itau-home.webp", legenda: { pt: "Página inicial", en: "Home page" } },
            { src: "/mockup/itau-home-1.webp", legenda: { pt: "Página inicial — seção 1", en: "Home page — section 1" } }
        ],
    },
    {
        nome: "More | Talent",
        imagem: "/mockup/m-moretalent.webp",
        tecnologias: ["HTML5", "CSS3", "Sass", "JavaScript", "React", "Next.js", "Tailwind", "Swiper"],
        links: {
            linkedin: "https://www.linkedin.com/posts/luiz-antonio-souza-5000a226b_m%C3%B4re-talent-tech-descri%C3%A7%C3%A3o-do-projeto-activity-7212050959210860545-mhiu?utm_source=share&utm_medium=member_desktop",
            github: "https://moretalentsluiz.netlify.app",
            verProjeto: "https://moretalentsluiz.netlify.app"
        },
        descricao: {
            pt: "Este projeto, desenvolvido com Next.js e Tailwind CSS, foi criado com o objetivo de aprimorar minhas habilidades no desenvolvimento web. Ele simula uma página inicial de um curso completo em design de produto digital, focado no processo de Design Centrado no Usuário. A página inclui uma seção de pré-cadastro, destaca parcerias com grandes empresas e apresenta um layout moderno e responsivo",
            en: "This project, built with Next.js and Tailwind CSS, was created to improve my web development skills. It simulates a homepage for a complete digital product design course, focused on the User-Centered Design process. The page includes a pre-registration section, highlights partnerships with major companies, and features a modern, responsive layout.",
        },
        data: { pt: "08 de Outubro 2024", en: "October 8, 2024" },
        galeria: [
            { src: "/mockup/more-talent-home.webp", legenda: { pt: "Página inicial", en: "Home page" } },
            { src: "/mockup/more-talent-home-1.webp", legenda: { pt: "Página inicial — seção 1", en: "Home page — section 1" } }
        ],
    },
    {
        nome: "Lanistar",
        imagem: "/mockup/m-lanistar.webp",
        tecnologias: ["HTML5", "CSS3", "Sass", "JavaScript", "React", "Next.js", "Tailwind", "Swiper"],
        links: {
            linkedin: "https://www.linkedin.com/in/luiz-antonio-souza-5000a226b/",
            github: "https://github.com/LuixzSouza/lanistarluiz",
            verProjeto: "https://lanistarluiz.netlify.app"
        },
        descricao: {
            pt: "Este projeto foi desenvolvido para simular a interface de uma plataforma financeira moderna e inovadora. Ele combina design minimalista e responsividade para oferecer uma experiência de usuário intuitiva e envolvente.",
            en: "This project was built to simulate the interface of a modern, innovative financial platform. It combines minimalist design and responsiveness to deliver an intuitive, engaging user experience.",
        },
        data: { pt: "12 de janeiro 2024", en: "January 12, 2024" },
        galeria: [
            { src: "/mockup/lanistar-home.webp", legenda: { pt: "Página inicial", en: "Home page" } },
            { src: "/mockup/lanistar-home-1.webp", legenda: { pt: "Página inicial — seção 1", en: "Home page — section 1" } },
            { src: "/mockup/lanistar-home-2.webp", legenda: { pt: "Página inicial — seção 2", en: "Home page — section 2" } }
        ],
    },
    {
        nome: "Tecsany",
        imagem: "/mockup/m-spiderman2.webp",
        tecnologias: ["HTML5", "CSS3", "Sass", "JavaScript", "React", "Next.js", "Tailwind", "Swiper"],
        links: {
            linkedin: "https://www.linkedin.com/in/luiz-antonio-souza-5000a226b/",
            github: "https://github.com/LuixzSouza/tecsanyluiz",
            verProjeto: "https://tecsanyluiz.netlify.app"
        },
        descricao: {
            pt: "Este projeto foi desenvolvido para apresentar uma plataforma focada em tecnologia, com design moderno e responsivo. O objetivo foi criar uma interface amigável que combina funcionalidade com uma navegação intuitiva e eficiente.",
            en: "This project was built to present a technology-focused platform with a modern, responsive design. The goal was to create a friendly interface that combines functionality with intuitive, efficient navigation.",
        },
        data: { pt: "12 de janeiro 2024", en: "January 12, 2024" },
        galeria: [
            { src: "/mockup/tecsany-home.webp", legenda: { pt: "Página inicial", en: "Home page" } },
            { src: "/mockup/tecsany-home-1.webp", legenda: { pt: "Página inicial — seção 1", en: "Home page — section 1" } }
        ],
    },
    {
        nome: "Latam Airlines",
        imagem: "/mockup/m-latamairlines.webp",
        tecnologias: ["HTML5", "CSS3", "Sass", "JavaScript", "React", "Next.js", "Tailwind", "Swiper"],
        links: {
            linkedin: "https://www.linkedin.com/in/luiz-antonio-souza-5000a226b/",
            github: "https://github.com/LuixzSouza/LatamAirLanes",
            verProjeto: "https://latamairlinesluiz.netlify.app"
        },
        descricao: {
            pt: "Este projeto foi desenvolvido para simular a interface de uma plataforma de reservas de voo, inspirada na identidade visual da Latam Airlines. A ideia foi criar uma aplicação moderna e intuitiva, com foco em usabilidade e design responsivo, proporcionando uma experiência agradável aos usuários.",
            en: "This project was built to simulate a flight booking platform interface, inspired by Latam Airlines' visual identity. The idea was to create a modern, intuitive application focused on usability and responsive design, providing a pleasant user experience.",
        },
        data: { pt: "12 de janeiro 2024", en: "January 12, 2024" },
        galeria: [
            { src: "/mockup/latam-airlines-home.webp", legenda: { pt: "Página inicial", en: "Home page" } },
            { src: "/mockup/latam-airlines-home-1.webp", legenda: { pt: "Página inicial — seção 1", en: "Home page — section 1" } }
        ],
    },
    {
        nome: "Spider Man 2",
        imagem: "/mockup/m-java-poo.webp",
        tecnologias: ["HTML5", "CSS3", "Sass", "JavaScript", "React", "Next.js", "Tailwind", "Swiper"],
        links: {
            linkedin: "https://www.linkedin.com/in/luiz-antonio-souza-5000a226b/",
            github: "https://github.com/LuixzSouza/spidermanluiz",
            verProjeto: "https://spidermanluiz.netlify.app"
        },
        descricao: {
            pt: "Este projeto foi desenvolvido para criar uma landing page dinâmica e envolvente, inspirada no universo do Spider Man. O foco foi na criação de uma experiência visual impactante e interativa, utilizando técnicas modernas de desenvolvimento web.",
            en: "This project was built to create a dynamic, engaging landing page inspired by the Spider-Man universe. The focus was on crafting a striking, interactive visual experience using modern web development techniques.",
        },
        data: { pt: "12 de janeiro 2024", en: "January 12, 2024" },
        galeria: [
            { src: "/mockup/spider-man-2-home.webp", legenda: { pt: "Página inicial", en: "Home page" } },
            { src: "/mockup/spider-man-2-home-1.webp", legenda: { pt: "Página inicial — seção 1", en: "Home page — section 1" } },
            { src: "/mockup/spider-man-2-home-2.webp", legenda: { pt: "Página inicial — seção 2", en: "Home page — section 2" } }
        ],
    },
    {
        nome: "JAVA | SQL",
        imagem: "/mockup/m-javasql.webp",
        tecnologias: ["Faculdade", "JAVA", "SQL"],
        links: {
            linkedin: "https://www.linkedin.com/in/luiz-antonio-souza-5000a226b/",
            github: "https://github.com/LuixzSouza/JAVA-SQL",
            verProjeto: "https://github.com/LuixzSouza/JAVA-SQL"
        },
        descricao: {
            pt: "Este projeto desenvolve uma aplicação Java com Maven, Hibernate e MySQL, estruturando a classe Veículo e implementando operações de CRUD (inserção, consulta, remoção e atualização). Ele permite armazenar e gerenciar dados de veículos de forma eficiente em um banco de dados relacional.",
            en: "This project builds a Java application with Maven, Hibernate and MySQL, structuring the Vehicle class and implementing CRUD operations (insert, query, delete and update). It allows storing and managing vehicle data efficiently in a relational database.",
        },
        data: { pt: "12 de janeiro 2024", en: "January 12, 2024" },
        galeria: [
            { src: "/mockup/java-sql-github-1.webp", legenda: { pt: "README e estrutura do código", en: "README and code structure" } },
            { src: "/mockup/java-sql-github.webp", legenda: { pt: "Repositório no GitHub", en: "GitHub repository" } }
        ],
    },
    {
        nome: "Python BotNotepad Test",
        imagem: "/mockup/m-pythonbotnotepad.webp",
        tecnologias: ["Python"],
        links: {
            linkedin: "https://www.linkedin.com/in/luiz-antonio-souza-5000a226b/",
            github: "https://github.com/LuixzSouza/Python-BotNotepad-Test",
            verProjeto: "https://github.com/LuixzSouza/Python-BotNotepad-Test"
        },
        descricao: {
            pt: "Este projeto contém um bot simples em Python que utiliza a biblioteca PyAutoGUI para automatizar tarefas no computador. Especificamente, este bot abre o Bloco de Notas (Notepad) no Windows, escreve uma mensagem predefinida e simula a digitação no programa. O bot é útil para demonstração de automação de interface gráfica e interação com aplicativos desktop.",
            en: "This project contains a simple Python bot that uses the PyAutoGUI library to automate tasks on the computer. Specifically, the bot opens Notepad on Windows, writes a predefined message and simulates typing in the program. It's useful for demonstrating GUI automation and interaction with desktop applications.",
        },
        data: { pt: "12 de janeiro 2024", en: "January 12, 2024" },
        galeria: [
            { src: "/mockup/python-botnotepad-test-github-1.webp", legenda: { pt: "README e estrutura do código", en: "README and code structure" } },
            { src: "/mockup/python-botnotepad-test-github.webp", legenda: { pt: "Repositório no GitHub", en: "GitHub repository" } }
        ],
    },
    {
        nome: "Exercicios JavaScript",
        imagem: "/mockup/m-exerciciosjs.webp",
        tecnologias: ["Node.js", "JavaScript"],
        links: {
            linkedin: "https://www.linkedin.com/in/luiz-antonio-souza-5000a226b/",
            github: "https://github.com/LuixzSouza/Exercicio_JavaScript-Node.js",
            verProjeto: "https://github.com/LuixzSouza/Exercicio_JavaScript-Node.js"
        },
        descricao: {
            pt: "Varios exercicos para treinar o desenvolvimento em JavaScript e Node.js",
            en: "Several exercises to practice development in JavaScript and Node.js.",
        },
        data: { pt: "12 de janeiro 2024", en: "January 12, 2024" },
        galeria: [
            { src: "/mockup/exercicios-javascript-github-1.webp", legenda: { pt: "README e estrutura do código", en: "README and code structure" } },
            { src: "/mockup/exercicios-javascript-github.webp", legenda: { pt: "Repositório no GitHub", en: "GitHub repository" } }
        ],
    },
    {
        nome: "JAVA | ONG | Trabalho Facul",
        imagem: "/projects/Trabalho-Java-ONG.webp",
        tecnologias: ["Faculdade", "JAVA", ],
        links: {
            linkedin: "https://www.linkedin.com/in/luiz-antonio-souza-5000a226b/",
            github: "https://github.com/LuixzSouza/Sistema-de-Gerenciamento-de-ONG",
            verProjeto: "https://github.com/LuixzSouza/Sistema-de-Gerenciamento-de-ONG"
        },
        descricao: {
            pt: "Este sistema foi desenvolvido para facilitar o processo de agendamento de doações para Organizações Não Governamentais (ONGs). O objetivo é permitir que os doadores registrem suas informações, cadastrem itens que irão doar (como roupas, alimentos, etc.), e agendem a data para a entrega ou retirada das doações. O sistema também valida as entradas de dados, como CPF e data, garantindo maior precisão nas informações fornecidas.",
            en: "This system was built to streamline the donation scheduling process for Non-Governmental Organizations (NGOs). The goal is to let donors register their information, list the items they'll donate (such as clothing, food, etc.), and schedule a date for delivery or pickup. The system also validates data entries, such as CPF and date, ensuring greater accuracy in the information provided.",
        },
        data: { pt: "12 de janeiro 2024", en: "January 12, 2024" },
        galeria: [
            { src: "/mockup/java-ong-trabalho-facul-github-1.webp", legenda: { pt: "README e estrutura do código", en: "README and code structure" } },
            { src: "/mockup/java-ong-trabalho-facul-github.webp", legenda: { pt: "Repositório no GitHub", en: "GitHub repository" } }
        ],
    },
    {
        nome: "JAVA | POO | Trabalho Facul",
        imagem: "/projects/Trabalho-POO-Java.webp",
        tecnologias: ["JAVA", "Atividade"],
        links: {
            linkedin: "https://www.linkedin.com/in/luiz-antonio-souza-5000a226b/",
            github: "https://github.com/LuixzSouza/LISTA_EXERCICIOS_POO-4p---Luiz-Ant-nio-de-Souza-",
            verProjeto: "https://github.com/LuixzSouza/LISTA_EXERCICIOS_POO-4p---Luiz-Ant-nio-de-Souza-"
        },
        descricao: {
            pt: "Atividades feita para entregar ao professor",
            en: "Assignments made to submit to the professor.",
        },
        data: { pt: "12 de janeiro 2024", en: "January 12, 2024" },
        galeria: [
            { src: "/mockup/java-poo-trabalho-facul-github.webp", legenda: { pt: "Repositório no GitHub", en: "GitHub repository" } }
        ],
    },
    {
        nome: "Modulo JavaScript",
        imagem: "/projects/Modulo-JavaScript.webp",
        tecnologias: ["JavaScript", "Ajuda"],
        links: {
            linkedin: "https://www.linkedin.com/posts/luiz-antonio-souza-5000a226b_javascript-webdevelopment-codingjourney-activity-7200155836277542912-faey?utm_source=share&utm_medium=member_desktop",
            github: "https://github.com/LuixzSouza/ModuloJavaScript",
            verProjeto: "https://github.com/LuixzSouza/ModuloJavaScript"
        },
        descricao: {
            pt: "Criei um repositório com módulos dedicados a diferentes tópicos de JavaScript, começando com uma introdução simples e avançando para manipulações complexas do DOM e armazenamento local. ",
            en: "I created a repository with modules dedicated to different JavaScript topics, starting with a simple introduction and advancing to complex DOM manipulation and local storage.",
        },
        data: { pt: "24 de Maio 2024", en: "May 24, 2024" },
        galeria: [
            { src: "/mockup/modulo-javascript-github-1.webp", legenda: { pt: "README e estrutura do código", en: "README and code structure" } },
            { src: "/mockup/modulo-javascript-github.webp", legenda: { pt: "Repositório no GitHub", en: "GitHub repository" } }
        ],
    },
];

// Aplicar campos padrão a todos os projetos
export const projetos: Projeto[] = rawProjects.map(completeProject);

/** Busca um projeto pelo id. */
export function getProjeto(id: string): Projeto | undefined {
    return projetos.find((p) => p.id === id);
}

/**
 * Projetos com narrativa profunda o suficiente para virarem estudo de caso
 * dedicado (têm "desafios" descritos). Usado pela rota /work/case/[slug].
 */
export const caseStudySlugs: string[] = projetos
    .filter((p) => Array.isArray(p.desafios) || (p.desafios && typeof p.desafios === "object"))
    .map((p) => p.id);

export function getCaseStudy(slug: string): Projeto | undefined {
    const p = getProjeto(slug);
    return p && p.desafios ? p : undefined;
}
