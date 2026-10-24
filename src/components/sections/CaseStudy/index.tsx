"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { Container } from "@/components/ds/Container";
import { Section } from "@/components/ds/Section";
import { Heading } from "@/components/ds/Heading";
import { Text } from "@/components/ds/Text";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Reveal } from "@/components/ds/Reveal";
import { Parallax } from "@/components/ds/Parallax";
import { ArrowButton } from "@/components/ds/ArrowButton";
import { useLanguage } from "@/components/ds/LanguageProvider";
import { useLocalizedHref } from "@/lib/useLocale";
import { pickText, pickList } from "@/lib/i18n";
import { getCaseStudy } from "@/data/projects";
import { CaseNarrative } from "./CaseNarrative";
import { CaseGallery } from "./CaseGallery";
import { caseCopy } from "./copy";

export function CaseStudy({ slug }: { slug: string }) {
  const { lang } = useLanguage();
  const loc = useLocalizedHref();
  const project = getCaseStudy(slug);

  if (!project) {
    return (
      <Section>
        <Container>
          <Heading size="display-sm">404</Heading>
        </Container>
      </Section>
    );
  }

  const c = caseCopy;
  const overview = project.conteudo ? pickList(project.conteudo, lang) : [];
  const goals = project.objetivos ? pickList(project.objetivos, lang) : [];
  const challenges = project.desafios ? pickList(project.desafios, lang) : [];
  const learnings = project.aprendizados ? pickList(project.aprendizados, lang) : [];
  const gallery = project.galeria ?? [];
  const live = project.links?.verProjeto;
  const code = project.links?.github;

  // Numeração contínua só dos blocos presentes.
  let n = 0;
  const nextN = () => (n += 1);

  return (
    <Section className="overflow-hidden">
      <Container>
        {/* Voltar */}
        <Reveal>
          <Link
            href={loc("/work")}
            className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            {pickText(c.backToWork, lang)}
          </Link>
        </Reveal>

        {/* Cabeçalho */}
        <Reveal className="mt-8 flex flex-col gap-5 md:mt-12">
          <Eyebrow>{pickText(c.eyebrow, lang)}</Eyebrow>
          <Heading size="display-lg" className="max-w-[18ch]">
            {project.nome}
          </Heading>
          {project.resumo && (
            <Text tone="muted" size="lg" measure>
              {pickText(project.resumo, lang)}
            </Text>
          )}
        </Reveal>

        {/* Meta + ações */}
        <Reveal delay={0.08} className="mt-10 flex flex-col gap-8 border-y border-foreground/10 py-8 md:flex-row md:items-center md:justify-between">
          <dl className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div className="flex flex-col gap-1">
              <dt className="text-eyebrow uppercase tracking-widest text-muted">{pickText(c.role, lang)}</dt>
              <dd className="text-sm text-foreground">{pickText(c.soloRole, lang)}</dd>
            </div>
            {project.duracao && (
              <div className="flex flex-col gap-1">
                <dt className="text-eyebrow uppercase tracking-widest text-muted">{pickText(c.duration, lang)}</dt>
                <dd className="text-sm text-foreground">{project.duracao}</dd>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <dt className="text-eyebrow uppercase tracking-widest text-muted">{pickText(c.stack, lang)}</dt>
              <dd className="text-sm text-foreground">{project.tecnologiasPrincipais.join(" · ")}</dd>
            </div>
          </dl>

          <div className="flex flex-wrap gap-3">
            {live && (
              <ArrowButton href={live} variant="solid">
                {pickText(c.liveSite, lang)}
              </ArrowButton>
            )}
            {code && (
              <a
                href={code}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-2.5 text-sm font-medium text-foreground transition-colors duration-300 hover:border-foreground/50 hover:bg-foreground/[0.04]"
              >
                <Github className="h-4 w-4" aria-hidden />
                {pickText(c.code, lang)}
              </a>
            )}
          </div>
        </Reveal>

        {/* Capa */}
        {project.imagem && (
          <Reveal delay={0.12} className="mt-12">
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-foreground/10 bg-surface shadow-2xl md:aspect-[21/9]">
              <Parallax distance={50} className="absolute inset-0">
                <Image
                  src={project.imagem}
                  alt={project.nome}
                  fill
                  sizes="100vw"
                  priority
                  className="scale-110 object-cover"
                />
              </Parallax>
            </div>
          </Reveal>
        )}

        {/* Narrativa */}
        <div className="mt-16 md:mt-24">
          <CaseNarrative index={nextN()} label={pickText(c.goals, lang)} items={goals} variant="list" />
          <CaseNarrative index={nextN()} label={pickText(c.challenge, lang)} items={challenges} variant="list" />
          <CaseNarrative index={nextN()} label={pickText(c.solution, lang)} items={overview} variant="prose" />
          {learnings.length > 0 && (
            <CaseNarrative index={nextN()} label={pickText(c.learnings, lang)} items={learnings} variant="list" />
          )}
        </div>

        {/* Galeria */}
        {gallery.length > 0 && (
          <div className="mt-16 md:mt-24">
            <Reveal className="mb-10">
              <Heading as="h2" size="display-sm">{pickText(c.gallery, lang)}</Heading>
            </Reveal>
            <CaseGallery images={gallery} lang={lang} />
          </div>
        )}

        {/* Stack completa */}
        <Reveal className="mt-16 flex flex-col gap-4 border-t border-foreground/10 pt-10">
          <span className="text-eyebrow uppercase tracking-widest text-muted">{pickText(c.stack, lang)}</span>
          <ul className="flex flex-wrap gap-2.5">
            {project.tecnologias.map((tech) => (
              <li key={tech} className="rounded-full border border-foreground/15 px-3.5 py-1.5 text-sm text-muted">
                {tech}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* CTA */}
        <Reveal className="mt-20 flex flex-col items-start gap-6 rounded-3xl border border-foreground/10 bg-surface p-10 sm:flex-row sm:items-center sm:justify-between md:mt-28 md:p-14">
          <Heading as="p" size="display-sm" className="max-w-[16ch]">
            {pickText(c.ctaLead, lang)}
          </Heading>
          <div className="flex items-center gap-2">
            <ArrowButton href="/contact" variant="solid">
              {pickText(c.ctaButton, lang)}
            </ArrowButton>
            <ArrowUpRight className="hidden h-6 w-6 text-muted sm:block" aria-hidden />
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
