import type { Metadata } from "next";
import { MainSection } from "@/components/sections/MainSection";
import { SectionFooter } from "@/components/sections/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE, sameAs, pageMetadata, localizedPath } from "@/lib/seo";
import { localeMeta, type Lang } from "@/lib/locales";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    title: "Luiz Antônio de Souza | Desenvolvedor Front-End | Portfólio",
    description:
      "Conheça o portfólio de Luiz Antônio de Souza, desenvolvedor front-end especializado em criar soluções modernas e eficientes para a web com Next.js e React.",
    path: "/",
    locale: locale as Lang,
    ogTitle: "Luiz Antônio de Souza | Portfólio Profissional",
    ogDescription:
      "Explore projetos, habilidades e a trajetória de Luiz Souza no desenvolvimento web.",
  });
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lang = locale as Lang;
  const homeUrl = `${SITE.url}${localizedPath("/", lang)}`;
  const htmlLang = localeMeta(lang).html;
  // @graph: relaciona Person + WebSite + ProfilePage para um Knowledge Panel rico.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE.url}/#person`,
        name: SITE.fullName,
        alternateName: SITE.name,
        url: SITE.url,
        jobTitle: SITE.jobTitle,
        image: `${SITE.url}/image/foto-perfil-2026.webp`,
        email: `mailto:${SITE.email}`,
        sameAs,
        nationality: "Brazil",
        knowsAbout: [
          "Front-End Development",
          "React",
          "Next.js",
          "TypeScript",
          "Tailwind CSS",
          "UI Design",
          "Web Performance",
          "SEO",
        ],
        description:
          "Desenvolvedor Front-End especializado em React, Next.js e UI Design.",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: homeUrl,
        name: `Portfólio ${SITE.name}`,
        description: SITE.description,
        inLanguage: htmlLang,
        publisher: { "@id": `${SITE.url}/#person` },
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE.url}/#profilepage`,
        url: homeUrl,
        name: `${SITE.fullName} | ${SITE.jobTitle}`,
        isPartOf: { "@id": `${SITE.url}/#website` },
        about: { "@id": `${SITE.url}/#person` },
        inLanguage: htmlLang,
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <main id="conteudo" className="relative bg-background text-foreground">
        <MainSection />
      </main>
      <SectionFooter />
    </>
  );
}