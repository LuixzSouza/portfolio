import type { LocalizedText } from "@/lib/i18n";

/**
 * Vitrine de stack — tecnologias que o Luiz usa, com "argumento de venda"
 * bilíngue por tecnologia. Data-driven de propósito (espelha o padrão de
 * skills/projects): quando o backend entrar, essa mesma forma vem da API.
 *
 * `match` = aliases usados para cruzar com `projeto.tecnologias` (case-insensitive),
 * assim a vitrine mostra em quantos projetos reais a tech aparece.
 */
export interface StackTech {
  slug: string;
  name: string;
  /** Logo em /public/icons (chip claro). */
  logo: string;
  /** Cor de destaque (glow do painel). rgb sem alpha. */
  accent: string;
  /** Rótulo curto de categoria. */
  kind: LocalizedText;
  /** Frase-título vendedora (uma linha). */
  tagline: LocalizedText;
  /** Parágrafo em linguagem de negócio: o que essa tech entrega ao cliente. */
  pitch: LocalizedText;
  /** Aliases p/ casar com projeto.tecnologias. */
  match: string[];
}

export interface StackShowcaseCopy {
  eyebrow: LocalizedText;
  heading: LocalizedText;
  text: LocalizedText;
  usedInLabel: LocalizedText;
  usedInNone: LocalizedText;
  hint: LocalizedText;
}

export const stackCopy: StackShowcaseCopy = {
  eyebrow: { pt: "Stack", en: "Stack" },
  heading: {
    pt: "As ferramentas por trás de cada entrega",
    en: "The tools behind every delivery",
  },
  text: {
    pt: "Selecione uma tecnologia para ver, em linguagem clara, o que ela agrega ao seu projeto — e onde já a coloquei em produção.",
    en: "Pick a technology to see, in plain language, what it adds to your project — and where I've already shipped it.",
  },
  usedInLabel: { pt: "Aplicada em", en: "Applied in" },
  usedInNone: {
    pt: "Pronta para o seu próximo projeto.",
    en: "Ready for your next project.",
  },
  hint: { pt: "Clique para explorar", en: "Click to explore" },
};

export const stackTechs: StackTech[] = [
  {
    slug: "nextjs",
    name: "Next.js",
    logo: "/icons/next.svg",
    accent: "120 120 120",
    kind: { pt: "Framework web", en: "Web framework" },
    tagline: {
      pt: "Sites rápidos que o Google adora.",
      en: "Fast sites that Google loves.",
    },
    pitch: {
      pt: "Renderização otimizada e páginas que carregam num piscar — melhor posição no Google, mais visitantes virando clientes. É a base dos sites e lojas que entrego.",
      en: "Optimized rendering and pages that load in a blink — better Google ranking, more visitors turning into customers. It's the backbone of the sites and stores I ship.",
    },
    match: ["Next.js", "Next", "NextJS"],
  },
  {
    slug: "react",
    name: "React",
    logo: "/icons/React.svg",
    accent: "97 218 251",
    kind: { pt: "Interface", en: "Interface" },
    tagline: {
      pt: "Interfaces vivas e reutilizáveis.",
      en: "Living, reusable interfaces.",
    },
    pitch: {
      pt: "Telas interativas, componentizadas e fáceis de evoluir. Seu produto cresce sem virar uma colcha de retalhos — cada peça é reaproveitada e testável.",
      en: "Interactive, component-based screens that are easy to evolve. Your product grows without becoming a patchwork — every piece is reusable and testable.",
    },
    match: ["React", "React.js", "ReactJS"],
  },
  {
    slug: "php",
    name: "PHP",
    logo: "/icons/PHP.svg",
    accent: "119 123 179",
    kind: { pt: "Back-end", en: "Back-end" },
    tagline: {
      pt: "Servidor sólido em hospedagem acessível.",
      en: "Solid server on affordable hosting.",
    },
    pitch: {
      pt: "Lógica de servidor e integrações que rodam em qualquer hospedagem compartilhada — custo baixo, sem depender de infraestrutura cara. Ideal para formulários, painéis e APIs.",
      en: "Server logic and integrations that run on any shared hosting — low cost, no pricey infrastructure. Ideal for forms, dashboards and APIs.",
    },
    match: ["PHP"],
  },
  {
    slug: "prisma",
    name: "Prisma",
    logo: "/icons/prisma.svg",
    accent: "45 55 72",
    kind: { pt: "Banco de dados", en: "Database" },
    tagline: {
      pt: "Dados organizados e à prova de erros.",
      en: "Organized, error-proof data.",
    },
    pitch: {
      pt: "Camada de dados tipada: consultas seguras e um modelo claro do seu negócio. Menos bugs em produção e evolução do banco sem dor de cabeça.",
      en: "Typed data layer: safe queries and a clear model of your business. Fewer production bugs and painless database evolution.",
    },
    match: ["Prisma"],
  },
  {
    slug: "nodejs",
    name: "Node.js",
    logo: "/icons/Node.svg",
    accent: "128 187 66",
    kind: { pt: "Runtime", en: "Runtime" },
    tagline: {
      pt: "Um só idioma do front ao back.",
      en: "One language from front to back.",
    },
    pitch: {
      pt: "JavaScript no servidor: automações, integrações e APIs escaláveis com o mesmo ecossistema do front-end. Menos retrabalho, entrega mais rápida.",
      en: "JavaScript on the server: automations, integrations and scalable APIs sharing the front-end ecosystem. Less rework, faster delivery.",
    },
    match: ["Node.js", "Node", "NodeJS", "Express"],
  },
  {
    slug: "mysql",
    name: "MySQL",
    logo: "/icons/mysql.svg",
    accent: "0 117 143",
    kind: { pt: "Banco de dados", en: "Database" },
    tagline: {
      pt: "Onde os dados do seu negócio moram.",
      en: "Where your business data lives.",
    },
    pitch: {
      pt: "Banco relacional confiável e testado por décadas — pedidos, clientes e conteúdo guardados com segurança e consultas rápidas mesmo com volume.",
      en: "A reliable relational database battle-tested for decades — orders, customers and content stored safely, with fast queries even at scale.",
    },
    match: ["MySQL", "SQL", "MariaDB"],
  },
];
