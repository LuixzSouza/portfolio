import type { Metadata } from "next";
import { ServiceShowcase } from "@/components/sections/ServiceShowcase";
import { SectionFooter } from "@/components/sections/Footer";
import { JsonLd, Breadcrumbs } from "@/components/seo/JsonLd";
import { services, servicesIndexCopy } from "@/data/services";
import { pickText } from "@/lib/i18n";
import { pageMetadata, SITE, localizedPath } from "@/lib/seo";
import type { Lang } from "@/lib/locales";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale as Lang;
  return pageMetadata({
    title: pickText(servicesIndexCopy.metaTitle, lang),
    description: pickText(servicesIndexCopy.metaDescription, lang),
    path: "/services",
    locale: lang,
  });
}

export default async function ServicesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lang = locale as Lang;

  // ItemList → ajuda o Google a entender o catálogo de serviços.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE.url}${localizedPath("/services", lang)}#services`,
    name: pickText(servicesIndexCopy.heading, lang),
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: pickText(s.title, lang),
        description: pickText(s.tagline, lang),
        url: `${SITE.url}${localizedPath(`/services/${s.slug}`, lang)}`,
        image: `${SITE.url}${s.image}`,
      },
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={[{ name: pickText(servicesIndexCopy.eyebrow, lang), path: "/services" }]} locale={lang} />
      <main id="conteudo">
        <ServiceShowcase />
      </main>
      <SectionFooter />
    </>
  );
}
