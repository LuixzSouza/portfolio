import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";
import { projetos, caseStudySlugs } from "@/data/projects";
import { slugify } from "@/lib/slug";
import { serviceSlugs } from "@/data/services";
import { certificateSlugs } from "@/data/certificates";
import { LOCALES } from "@/lib/locales";

export const dynamic = "force-static";

interface RouteDef {
  path: string; // sem prefixo de idioma, ex.: "/about" ou "/"
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}

const ROUTES: RouteDef[] = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/work", changeFrequency: "monthly", priority: 0.9 },
  { path: "/about", changeFrequency: "yearly", priority: 0.8 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.7 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  ...serviceSlugs.map((slug) => ({ path: `/services/${slug}`, changeFrequency: "monthly" as const, priority: 0.85 })),
  ...caseStudySlugs.map((slug) => ({ path: `/work/case/${slug}`, changeFrequency: "yearly" as const, priority: 0.7 })),
  ...certificateSlugs.map((slug) => ({ path: `/certificates/${slug}`, changeFrequency: "yearly" as const, priority: 0.5 })),
  ...projetos.map((p) => ({ path: `/project?id=${slugify(p.nome)}`, changeFrequency: "yearly" as const, priority: 0.6 })),
];

/** Monta a URL com prefixo de idioma. ("/about","en") → ".../en/about" */
function url(path: string, code: string): string {
  const clean = path === "/" ? "" : path;
  return `${SITE.url}/${code}${clean}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Uma entrada por (rota × idioma), cada uma listando os hreflang alternates.
  return ROUTES.flatMap((route) => {
    const languages = Object.fromEntries(
      LOCALES.map((l) => [l.html, url(route.path, l.code)]),
    );
    return LOCALES.map((l) => ({
      url: url(route.path, l.code),
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: { languages },
    }));
  });
}
