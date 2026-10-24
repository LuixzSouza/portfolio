"use client";

import Image from "next/image";
import { Container } from "@/components/ds/Container";
import { Section } from "@/components/ds/Section";
import { Heading } from "@/components/ds/Heading";
import { Text } from "@/components/ds/Text";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Reveal } from "@/components/ds/Reveal";
import { MaskReveal } from "@/components/ds/MaskReveal";
import { Parallax } from "@/components/ds/Parallax";
import { RotatingText } from "@/components/ds/RotatingText";
import { CircularBadge } from "@/components/ds/CircularBadge";
import { ArrowButton } from "@/components/ds/ArrowButton";
import { aboutBio, aboutFacts } from "@/data/about";
import { useSectionContent } from "@/hooks/useSectionContent";
import { getFacts, getText } from "@/lib/schemas/content";
import { useTranslations } from "@/content/useTranslations";
import { useLanguage } from "@/components/ds/LanguageProvider";
import { cvHref } from "@/lib/cv";
import { pickText } from "@/lib/i18n";

export function AboutHero() {
  const t = useTranslations();
  const { lang } = useLanguage();
  const content = useSectionContent();
  const bio = (content && getText(content, "about.bio")) ?? aboutBio;
  const facts = (content && getFacts(content, "about.facts")) ?? aboutFacts;

  return (
    <Section className="pt-28 md:pt-36">
      <Container>
        {/* Abertura: eyebrow + nome gigante + papel rotativo */}
        <div className="flex flex-col gap-6">
          <Reveal>
            <Eyebrow index="01">{t.about.eyebrow}</Eyebrow>
          </Reveal>

          <Heading as="h1" size="display-xl" className="leading-[0.9]">
            <MaskReveal>
              Luiz <span className="font-serif font-normal italic">Souza</span>
            </MaskReveal>
          </Heading>

          <Reveal delay={0.1} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-roobert text-2xl text-muted md:text-3xl">
            <span>{t.about.roleLead}</span>
            <RotatingText words={t.about.roles} className="font-medium text-foreground" />
          </Reveal>
        </div>

        {/* Faixa marquee de palavras-chave (decorativa) */}
        <div aria-hidden className="mt-12 overflow-hidden border-y border-foreground/10 py-4 md:mt-14">
          <div className="flex w-max animate-marquee">
            {[...t.about.marquee, ...t.about.marquee].map((word, i) => (
              <span
                key={i}
                className="flex items-center whitespace-nowrap text-sm uppercase tracking-[0.2em] text-muted"
              >
                {word}
                <span className="mx-6 h-1 w-1 rounded-full bg-foreground/30" />
              </span>
            ))}
          </div>
        </div>

        {/* Conteúdo: bio + fatos / retrato com selo */}
        <div className="mt-16 grid items-start gap-12 md:mt-20 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col gap-10 lg:col-span-6">
            <Reveal>
              <Text size="lg" tone="muted" measure>
                {pickText(bio, lang)}
              </Text>
            </Reveal>

            <Reveal delay={0.1}>
              <dl className="grid grid-cols-2 border-t border-foreground/10">
                {facts.map((fact, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-1.5 border-b border-foreground/10 py-5 transition-colors duration-300 odd:pr-6 even:border-l even:border-foreground/10 even:pl-6 hover:bg-foreground/[0.02]"
                  >
                    <dt className="text-eyebrow font-medium uppercase text-muted">
                      {pickText(fact.label, lang)}
                    </dt>
                    <dd className="font-roobert text-base text-foreground">
                      {pickText(fact.value, lang)}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.15} className="flex flex-col gap-6">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-foreground/15 px-3.5 py-1.5 text-xs font-medium text-muted">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground/40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-foreground" />
                </span>
                {t.hero.badge}
              </span>
              <div className="flex flex-wrap items-center gap-4">
                <ArrowButton href="/contact" variant="solid">
                  {t.hero.ctaPrimary}
                </ArrowButton>
                <ArrowButton
                  href={cvHref(lang)}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                >
                  {t.contact.cv}
                </ArrowButton>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="lg:col-span-6">
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-foreground/10 bg-surface">
                <Parallax distance={48} className="absolute inset-x-0 -inset-y-[12%]">
                  <div className="relative h-full w-full">
                    <Image
                      src="/image/fotosobre.webp"
                      alt="Luiz Antônio de Souza"
                      fill
                      priority
                      sizes="(max-width: 1024px) 90vw, 45vw"
                      className="object-cover object-top grayscale transition-[filter,transform] duration-700 ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
                    />
                  </div>
                </Parallax>
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-foreground/10" />
              </div>

              <CircularBadge
                text={t.about.badge}
                className="absolute -bottom-6 -left-6 w-24 md:-bottom-8 md:-left-8 md:w-32 lg:w-36"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
