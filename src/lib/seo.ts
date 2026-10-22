import type { Metadata } from "next";
import { DEFAULT_LOCALE, LOCALES, localeMeta, type Lang } from "@/lib/locales";

/**
 * Fonte única de verdade para SEO. Espelha os perfis oficiais do Luiz.
 * Toda metadata de página deriva daqui — evita links/copy divergentes.
 */
export const SITE = {
  url: "https://luixzsouza.com.br",
  name: "Luiz Souza",
  fullName: "Luiz Antônio de Souza",
  jobTitle: "Desenvolvedor Front-End",
  description:
    "Portfólio de Luiz Antônio de Souza — desenvolvedor front-end especializado em criar sites e interfaces modernas, rápidas e responsivas com Next.js, React e TypeScript.",
  locale: "pt_BR",
  altLocale: "en_US",
  ogImage: "/MetaTag.webp",
  ogImageAlt: "Luiz Antônio de Souza — Desenvolvedor Front-End",
  email: "luiz.antoniodesouza004@gmail.com",
  social: {
    github: "https://github.com/LuixzSouza",
    linkedin: "https://www.linkedin.com/in/luiz-antonio-souza-5000a226b/",
    codewars: "https://www.codewars.com/users/LuixzSouza",
  },
  keywords: [
    "Luiz Souza",
    "Luiz Antônio de Souza",
    "Desenvolvedor Front-End",
    "Front-End Developer",
    "Desenvolvedor Web",
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "UI Design",
    "Portfólio",
    "Brasil",
  ],
} as const;

export const sameAs = [SITE.social.github, SITE.social.linkedin, SITE.social.codewars];

interface PageMetaInput {
  title: string;
  description: string;
  /** Caminho a partir da raiz SEM o prefixo de idioma, ex.: "/about" ou "/". */
  path: string;
  /** Idioma da página. Se ausente, gera URLs sem prefixo (compat). */
  locale?: Lang;
  ogTitle?: string;
  ogDescription?: string;
  image?: string;
  imageAlt?: string;
}

/** Monta o caminho com prefixo de idioma: ("/about","en") → "/en/about". */
export function localizedPath(path: string, locale: Lang): string {
  const clean = path === "/" ? "" : path;
  return `/${locale}${clean}` || "/";
}

/**
 * Gera Metadata coerente por página (canonical + OG + Twitter). Quando `locale`
 * é informado, o canonical ganha o prefixo de idioma e são emitidos os
 * `hreflang` alternates de todos os idiomas + x-default.
 */
export function pageMetadata({
  title,
  description,
  path,
  locale,
  ogTitle,
  ogDescription,
  image = SITE.ogImage,
  imageAlt = SITE.ogImageAlt,
}: PageMetaInput): Metadata {
  const canonical = locale ? localizedPath(path, locale) : path === "/" ? "/" : path;

  const languages = locale
    ? Object.fromEntries([
        ...LOCALES.map((l) => [l.html, localizedPath(path, l.code)]),
        ["x-default", localizedPath(path, DEFAULT_LOCALE)],
      ])
    : undefined;

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      title: ogTitle ?? title,
      description: ogDescription ?? description,
      url: canonical,
      type: "website",
      siteName: `Portfólio ${SITE.name}`,
      locale: locale ? localeMeta(locale).og : SITE.locale,
      images: [{ url: image, width: 1200, height: 630, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle ?? title,
      description: ogDescription ?? description,
      images: [image],
    },
  };
}
