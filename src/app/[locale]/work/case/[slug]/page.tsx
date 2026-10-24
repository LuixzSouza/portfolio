import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/sections/CaseStudy";
import { SectionFooter } from "@/components/sections/Footer";
import { JsonLd, Breadcrumbs } from "@/components/seo/JsonLd";
import { getCaseStudy, caseStudySlugs } from "@/data/projects";
import { pickText } from "@/lib/i18n";
import { pageMetadata, SITE, localizedPath } from "@/lib/seo";
import type { Lang } from "@/lib/locales";

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const lang = locale as Lang;
  const project = getCaseStudy(slug);
  if (!project) return {};
  const desc = project.resumo
    ? pickText(project.resumo, lang)
    : project.descricao
      ? pickText(project.descricao, lang)
      : "";
  return pageMetadata({
    title: `${project.nome} — ${lang === "pt" ? "Estudo de caso" : "Case study"} | ${SITE.name}`,
    description: desc,
    path: `/work/case/${slug}`,
    locale: lang,
    image: project.ogImage ?? project.imagem,
    imageAlt: project.nome,
  });
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const lang = locale as Lang;
  const project = getCaseStudy(slug);
  if (!project) notFound();

  const url = `${SITE.url}${localizedPath(`/work/case/${slug}`, lang)}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${url}#casestudy`,
    name: project.nome,
    headline: project.nome,
    description: project.resumo ? pickText(project.resumo, lang) : "",
    url,
    ...(project.imagem ? { image: `${SITE.url}${project.imagem}` } : {}),
    keywords: project.tecnologias.join(", "),
    author: {
      "@type": "Person",
      name: SITE.fullName,
      url: SITE.url,
      jobTitle: SITE.jobTitle,
    },
    ...(project.links?.verProjeto ? { sameAs: project.links.verProjeto } : {}),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Breadcrumbs
        items={[
          { name: lang === "pt" ? "Projetos" : "Work", path: "/work" },
          { name: project.nome, path: `/work/case/${slug}` },
        ]}
        locale={lang}
      />
      <main id="conteudo">
        <CaseStudy slug={slug} />
      </main>
      <SectionFooter />
    </>
  );
}
