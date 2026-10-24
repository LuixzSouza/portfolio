"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { Container } from "@/components/ds/Container";
import { Section } from "@/components/ds/Section";
import { Heading } from "@/components/ds/Heading";
import { Text } from "@/components/ds/Text";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Reveal } from "@/components/ds/Reveal";
import { Parallax } from "@/components/ds/Parallax";
import { useLanguage } from "@/components/ds/LanguageProvider";
import { pickText } from "@/lib/i18n";
import { useLocalizedHref } from "@/lib/useLocale";
import { services as allServices, servicesIndexCopy, type ServiceDetailData } from "@/data/services";

/**
 * Vitrine editorial de serviços (venda B2B): linhas assimétricas alternadas,
 * imagem WebP grande com parallax + glow de acento, "o que entrego" e CTA para
 * o detalhe. Data-driven (src/data/services), bilíngue e com reveal no scroll.
 */
export function ServiceShowcase({ services = allServices }: { services?: ServiceDetailData[] }) {
  const { lang } = useLanguage();
  const loc = useLocalizedHref();
  const c = servicesIndexCopy;

  return (
    <Section id="servicos" className="overflow-hidden">
      <Container>
        <Reveal className="mb-16 flex max-w-[46rem] flex-col gap-5 md:mb-24">
          <Eyebrow>{pickText(c.eyebrow, lang)}</Eyebrow>
          <Heading size="display-lg" className="max-w-[16ch]">
            {pickText(c.heading, lang)}
          </Heading>
          <Text tone="muted" size="lg" measure>
            {pickText(c.text, lang)}
          </Text>
        </Reveal>

        <div className="flex flex-col gap-24 md:gap-40">
          {services.map((s, i) => {
            const flipped = i % 2 === 1;
            const href = loc(`/services/${s.slug}`);
            return (
              <div
                key={s.slug}
                className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-14"
              >
                {/* Mídia — WebP grande com parallax e glow de acento */}
                <Reveal
                  className={`md:col-span-7 ${flipped ? "md:order-2 md:col-start-6" : "md:order-1"}`}
                >
                  <Link href={href} className="group relative block" aria-label={pickText(s.title, lang)}>
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] opacity-60 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                      style={{ background: `radial-gradient(60% 60% at 50% 50%, ${s.accent}40, transparent 70%)` }}
                    />
                    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-foreground/10 bg-surface shadow-2xl">
                      <Parallax distance={40} reverse={flipped} className="absolute inset-0">
                        <Image
                          src={s.image}
                          alt={pickText(s.title, lang)}
                          fill
                          sizes="(max-width: 768px) 100vw, 58vw"
                          className="scale-110 object-cover transition-transform duration-700 ease-out group-hover:scale-125"
                        />
                      </Parallax>
                      {/* Selo do acento no canto */}
                      <span
                        className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full font-serif text-lg italic text-white shadow-lg backdrop-blur-sm"
                        style={{ backgroundColor: `${s.accent}E6` }}
                      >
                        {s.n}
                      </span>
                    </div>
                  </Link>
                </Reveal>

                {/* Conteúdo */}
                <div className={`md:col-span-5 ${flipped ? "md:order-1 md:col-start-1 md:row-start-1" : "md:order-2"}`}>
                  <Reveal delay={0.08} className="flex flex-col gap-5">
                    <span
                      className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-eyebrow font-medium uppercase tracking-widest"
                      style={{ color: s.accent, backgroundColor: `${s.accent}1A` }}
                    >
                      {pickText(s.title, lang)}
                    </span>

                    <Heading as="h3" size="display-sm" className="leading-[1.1]">
                      {pickText(s.tagline, lang)}
                    </Heading>

                    <Text tone="muted" measure>
                      {pickText(s.intro, lang)}
                    </Text>

                    <ul className="mt-1 flex flex-col gap-2.5">
                      {s.includes.slice(0, 4).map((item, k) => (
                        <li key={k} className="flex items-start gap-3 text-sm text-foreground/80">
                          <Check
                            className="mt-0.5 h-4 w-4 shrink-0"
                            style={{ color: s.accent }}
                            strokeWidth={2.5}
                            aria-hidden
                          />
                          {pickText(item, lang)}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={href}
                      className="group/cta mt-3 inline-flex w-fit items-center gap-2 text-base font-medium text-foreground"
                    >
                      <span className="relative">
                        {pickText(c.cta, lang)}
                        <span
                          className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/cta:scale-x-100"
                          style={{ backgroundColor: s.accent }}
                        />
                      </span>
                      <motion.span
                        aria-hidden
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/20 transition-colors duration-500 group-hover/cta:border-transparent"
                        style={{ ["--acc" as string]: s.accent }}
                        whileHover={{ backgroundColor: s.accent }}
                      >
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover/cta:rotate-45" strokeWidth={2} />
                      </motion.span>
                    </Link>
                  </Reveal>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
