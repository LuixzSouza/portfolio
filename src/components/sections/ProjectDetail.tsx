"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Github, Linkedin, Maximize2, X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { WorkCursor } from "@/components/sections/WorkCursor";
import { useCursorFollow } from "@/hooks/useCursorFollow";
import { Container } from "@/components/ds/Container";
import { Section } from "@/components/ds/Section";
import { Heading } from "@/components/ds/Heading";
import { Text } from "@/components/ds/Text";
import { AnimatedLink } from "@/components/ds/AnimatedLink";
import { LiveProjectButton } from "@/components/ds/LiveProjectButton";
import { type Projeto } from "@/data/projects";
import { projetos, caseStudySlugs } from "@/data/projects";
import { listProjects } from "@/lib/api";
import { withLocalProjects } from "@/lib/mergeProjects";
import { useCmsList } from "@/hooks/useCmsList";
import { slugify } from "@/lib/slug";
import { useLocalizedHref } from "@/lib/useLocale";
import { useTranslations } from "@/content/useTranslations";
import { useLanguage } from "@/components/ds/LanguageProvider";
import { pickText, pickList } from "@/lib/i18n";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE, localizedPath } from "@/lib/seo";

const EASE = [0.76, 0, 0.24, 1] as const;

export function ProjectDetail() {
  const t = useTranslations();
  const { lang } = useLanguage();
  const loc = useLocalizedHref();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const id = useSearchParams().get("id");

  // Fallback estático (@/data); substituído pela API quando ela responder. Mescla
  // o conteúdo rico do @/data (resumo/conteúdo/galeria) sobre a base da API por
  // slug — enquanto a API ainda não carrega esses campos.
  const items = useCmsList(
    listProjects,
    (data) =>
      withLocalProjects(
        data.map((p) => {
          const local = projetos.find(
            (lp) => slugify(lp.nome) === p.slug || lp.nome === p.nome,
          );
          return local
            ? { ...p, resumo: local.resumo, conteudo: local.conteudo, galeria: local.galeria }
            : p;
        }) as unknown as Projeto[],
        projetos,
      ),
    projetos,
  );
  // Lightbox da galeria (índice da imagem aberta) + cursor "Visualizar" do hero.
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [heroHover, setHeroHover] = useState(false);
  const { x: cx, y: cy, follow: heroFollow } = useCursorFollow();

  const index = id ? items.findIndex((p) => slugify(p.nome) === id) : -1;
  const project = index >= 0 ? items[index] : undefined;

  // Voltar inteligente: se há histórico interno, volta (preserva scroll/filtro
  // do /work); senão navega direto. Também responde à tecla Esc.
  const goBack = useCallback(() => {
    if (typeof window === "undefined") return;
    const idx = window.history.state?.idx as number | undefined;
    const canGoBack = typeof idx === "number" ? idx > 0 : window.history.length > 1;
    if (canGoBack) router.back();
    else router.push("/work");
  }, [router]);

  const galleryLen = project?.galeria?.length ?? 0;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Com o lightbox aberto, o teclado controla a galeria (e o Esc fecha ela).
      if (lightbox !== null) {
        if (e.key === "Escape") setLightbox(null);
        else if (e.key === "ArrowRight") setLightbox((i) => ((i ?? 0) + 1) % galleryLen);
        else if (e.key === "ArrowLeft") setLightbox((i) => ((i ?? 0) - 1 + galleryLen) % galleryLen);
        return;
      }
      if (e.key === "Escape") goBack();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goBack, lightbox, galleryLen]);

  // Trava o scroll do body enquanto o lightbox está aberto.
  useEffect(() => {
    if (lightbox === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [lightbox]);

  // Ao trocar de projeto (prev/próximo), volta ao topo.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], reduceMotion ? ["0%", "0%"] : ["0%", "15%"]);

  if (!project) {
    return (
      <Section className="flex min-h-[70vh] items-center pt-28 md:pt-36">
        <Container>
          <div className="flex flex-col items-center gap-6 text-center">
            <Heading size="display-md">{t.project.notFoundTitle}</Heading>
            <Text tone="muted" measure>
              {t.project.notFoundText}
            </Text>
            <AnimatedLink href="/work" withArrow>
              {t.project.notFoundBack}
            </AnimatedLink>
          </div>
        </Container>
      </Section>
    );
  }

  const { nome, imagem, tecnologias, descricao, data, links, resumo, conteudo, galeria, objetivos, desafios, aprendizados } = project;
  const slug = slugify(nome);
  const projectUrl = `${SITE.url}${localizedPath(`/project?id=${slug}`, lang)}`;
  const prevProject = items[(index - 1 + items.length) % items.length];
  const nextProject = items[(index + 1) % items.length];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${projectUrl}#work`,
        name: nome,
        url: links.verProjeto ?? projectUrl,
        ...(imagem ? { image: `${SITE.url}${imagem}` } : {}),
        ...(descricao ? { description: pickText(descricao, lang) } : {}),
        ...(data ? { dateCreated: pickText(data, lang) } : {}),
        keywords: tecnologias.join(", "),
        inLanguage: lang === "pt" ? "pt-BR" : "en",
        author: { "@type": "Person", name: SITE.fullName, url: SITE.url },
        creator: { "@type": "Person", name: SITE.fullName, url: SITE.url },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: `${SITE.url}${localizedPath("/", lang)}` },
          { "@type": "ListItem", position: 2, name: "Trabalhos", item: `${SITE.url}${localizedPath("/work", lang)}` },
          { "@type": "ListItem", position: 3, name: nome, item: projectUrl },
        ],
      },
    ],
  };

  return (
    <div ref={containerRef} className="relative pb-24">
      <JsonLd data={jsonLd} />

      {/* Barra de progresso de leitura */}
      <motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-foreground"
        style={{ scaleX: scrollYProgress }}
      />

      <Section className="pt-32 md:pt-40">
        <Container>
          <div className="flex flex-col gap-10">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="flex items-center justify-between gap-4"
            >
              <button
                type="button"
                onClick={goBack}
                className="group flex w-fit items-center gap-3 text-sm font-semibold uppercase tracking-widest text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15 transition-colors duration-300 group-hover:border-foreground/40 group-hover:bg-foreground/5">
                  <ArrowLeft className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1" />
                </span>
                {t.project.back}
              </button>

              <div className="flex items-center gap-4">
                {links.verProjeto && (
                  <span className="hidden items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted sm:flex">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground/40" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-foreground/70" />
                    </span>
                    {t.work.live}
                  </span>
                )}
                <span className="font-mono text-sm text-muted">
                  <span className="text-foreground">{String(index + 1).padStart(2, "0")}</span>
                  <span className="mx-1 text-muted/40">—</span>
                  {String(items.length).padStart(2, "0")}
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 0.1 }}
            >
              <Heading as="h1" className="text-[clamp(3.5rem,8vw,8rem)] leading-[0.9] tracking-tighter">
                {nome}
              </Heading>
            </motion.div>

            {resumo && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: EASE, delay: 0.2 }}
                className="max-w-[52ch] text-pretty font-roobert text-xl text-muted md:text-2xl md:leading-relaxed"
              >
                {pickText(resumo, lang)}
              </motion.p>
            )}

            {/* Metadados */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-foreground/15 pt-8 md:mt-16 md:grid-cols-4"
            >
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted">
                  {t.project.metaDate}
                </span>
                <span className="font-roobert text-lg">{data ? pickText(data, lang) : "—"}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted">
                  {t.project.metaFocus}
                </span>
                <span className="font-roobert text-lg">{tecnologias[0] ?? "—"}</span>
              </div>
              <div className="col-span-2 flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted">
                  {t.project.metaStack}
                </span>
                <ul className="flex flex-wrap gap-x-4 gap-y-1">
                  {tecnologias.map((tech) => (
                    <li key={tech} className="font-roobert text-lg text-foreground/80">
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Imagem com cortina (clip-path) + parallax */}
          {imagem && (
            <motion.div
              initial={{ clipPath: "inset(100% 0 0 0)", opacity: 0 }}
              animate={{ clipPath: "inset(0% 0 0 0)", opacity: 1 }}
              transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
              className="group relative mt-16 h-[60vh] w-full overflow-hidden rounded-3xl bg-surface-2 md:mt-24 md:h-[80vh]"
            >
              <motion.div
                style={{ y: imageY }}
                animate={{ scale: heroHover ? 1.04 : 1 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="absolute inset-x-0 -inset-y-[20%]"
              >
                <Image src={imagem} alt={nome} fill priority className="object-cover" />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent mix-blend-overlay" />

              {/* Hero clicável → site ao vivo (cursor "Visualizar" no desktop). */}
              {links.verProjeto && (
                <>
                  <motion.div
                    className="pointer-events-none absolute inset-0 bg-black/20"
                    initial={false}
                    animate={{ opacity: heroHover ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                  />
                  <a
                    href={links.verProjeto}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t.project.view}
                    onMouseMove={heroFollow}
                    onMouseEnter={() => setHeroHover(true)}
                    onMouseLeave={() => setHeroHover(false)}
                    className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-foreground/40"
                  />

                  {/* Badge melhorado para mobile */}
                  <div className="absolute bottom-5 right-5 lg:opacity-0">
                    <LiveProjectButton
                      href={links.verProjeto}
                      variant="hero"
                    />
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* Descrição + links sticky */}
          <div className="mt-20 grid gap-16 md:mt-32 lg:grid-cols-12 lg:gap-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: EASE }}
              className="lg:col-span-8"
            >
              {descricao && (
                <Text className="text-pretty font-roobert text-xl leading-relaxed text-foreground/80 md:text-3xl md:leading-[1.6]">
                  {pickText(descricao, lang)}
                </Text>
              )}

              {conteudo && (
                <div className="mt-10 flex flex-col gap-6 md:mt-14">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted">
                    {t.project.aboutLabel}
                  </span>
                  {pickList(conteudo, lang).map((paragraph, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.06 }}
                      className="max-w-[60ch] text-pretty font-roobert text-lg leading-relaxed text-foreground/70 md:text-xl"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>
              )}

              {/* Caso de estudo: objetivos / desafios / aprendizados (quando existem) */}
              {(objetivos || desafios || aprendizados) && (
                <div className="mt-12 flex flex-col gap-10 md:mt-16">
                  {[
                    { label: t.project.objectivesLabel ?? "Objectives", list: objetivos },
                    { label: t.project.challengesLabel ?? "Challenges", list: desafios },
                    { label: t.project.learningsLabel ?? "What I learned", list: aprendizados },
                  ]
                    .filter((b) => b.list)
                    .map((b) => (
                      <div key={b.label} className="flex flex-col gap-4">
                        <span className="text-xs font-semibold uppercase tracking-widest text-muted">
                          {b.label}
                        </span>
                        <ul className="flex flex-col gap-3">
                          {pickList(b.list!, lang).map((item, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, y: 16 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, margin: "-80px" }}
                              transition={{ duration: 0.6, ease: EASE, delay: (i % 4) * 0.05 }}
                              className="flex gap-3 text-pretty font-roobert text-lg leading-relaxed text-foreground/70 md:text-xl"
                            >
                              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" aria-hidden />
                              <span className="max-w-[58ch]">{item}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              )}

              {project.id && caseStudySlugs.includes(project.id) && (
                <Link
                  href={loc(`/work/case/${project.id}`)}
                  className="group mt-12 inline-flex items-center gap-3 self-start rounded-full border border-foreground/20 py-3 pl-6 pr-3 text-base font-medium text-foreground transition-colors duration-500 hover:border-foreground/50 hover:bg-foreground/[0.04] md:mt-16"
                >
                  {pickText({ pt: "Ver estudo de caso completo", en: "View full case study" }, lang)}
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-500 group-hover:rotate-45">
                    <ArrowRight className="h-4 w-4 -rotate-45" strokeWidth={2} />
                  </span>
                </Link>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
              className="lg:col-span-4"
            >
              <div className="sticky top-32 flex flex-col gap-8">
                <span className="h-px w-full bg-foreground/15" />
                <div className="flex flex-col gap-5">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted">
                    {t.project.linksLabel}
                  </span>
                  {links.verProjeto && (
                    <LiveProjectButton
                      href={links.verProjeto}
                      variant="link"
                    >
                      {t.project.liveLink}
                    </LiveProjectButton>
                  )}
                  {links.github && (
                    <a
                      href={links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between font-roobert text-xl transition-colors hover:text-muted"
                    >
                      {t.project.githubLink}
                      <Github className="h-5 w-5 transition-transform group-hover:scale-110" />
                    </a>
                  )}
                  {links.linkedin && (
                    <a
                      href={links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between font-roobert text-xl transition-colors hover:text-muted"
                    >
                      {t.project.linkedinLink}
                      <Linkedin className="h-5 w-5 transition-transform group-hover:scale-110" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Galeria de imagens do projeto */}
      {galeria && galeria.length > 0 && (
        <Container>
          <div className="mt-20 md:mt-32">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted">
              {t.project.galleryLabel}
            </span>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 md:gap-6">
              {galeria.map((img, i) => (
                <motion.figure
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.9, ease: EASE, delay: (i % 2) * 0.08 }}
                  className="group flex flex-col gap-3"
                >
                  <button
                    type="button"
                    onClick={() => setLightbox(i)}
                    aria-label={img.legenda ? pickText(img.legenda, lang) : nome}
                    className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-foreground/10 bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <Image
                      src={img.src}
                      alt={img.legenda ? pickText(img.legenda, lang) : nome}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/25">
                      <span className="flex h-12 w-12 scale-75 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                        <Maximize2 className="h-5 w-5" strokeWidth={1.5} />
                      </span>
                    </span>
                  </button>
                  {img.legenda && (
                    <figcaption className="font-roobert text-sm text-muted">
                      {pickText(img.legenda, lang)}
                    </figcaption>
                  )}
                </motion.figure>
              ))}
            </div>
          </div>
        </Container>
      )}

      {/* Banner de ação: projeto ao vivo */}
      {links.verProjeto && (
        <Container>
          <div className="mt-20 md:mt-32">
            <LiveProjectButton
              href={links.verProjeto}
              variant="banner"
            />
          </div>
        </Container>
      )}

      {/* Navegação entre projetos */}
      <Container>
        <div className="mt-20 border-t border-foreground/15 pt-8 md:mt-32">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted">
            {t.project.moreLabel}
          </span>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <ProjectNavCard project={prevProject} direction="prev" label={t.project.prev} />
            <ProjectNavCard project={nextProject} direction="next" label={t.project.next} />
          </div>
        </div>
      </Container>

      {/* Cursor "Visualizar" do hero (desktop) */}
      {links.verProjeto && <WorkCursor x={cx} y={cy} active={heroHover} label={t.project.view} />}

      {/* Lightbox da galeria */}
      <AnimatePresence>
        {lightbox !== null && galeria && galeria[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-background/95 p-4 backdrop-blur-xl md:p-10"
          >
            {/* Fechar */}
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label={t.a11y.close}
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-foreground/15 text-foreground transition-colors hover:bg-foreground/10 md:right-8 md:top-8"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Navegação (só se houver mais de uma imagem) */}
            {galeria.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightbox((i) => ((i ?? 0) - 1 + galeria.length) % galeria.length);
                  }}
                  aria-label={t.project.prev}
                  className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-foreground/15 text-foreground transition-colors hover:bg-foreground/10 md:left-8"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightbox((i) => ((i ?? 0) + 1) % galeria.length);
                  }}
                  aria-label={t.project.next}
                  className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-foreground/15 text-foreground transition-colors hover:bg-foreground/10 md:right-8"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Imagem + legenda */}
            <motion.figure
              key={lightbox}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-full max-w-5xl flex-col items-center gap-4"
            >
              <div className="relative h-[70vh] w-[88vw] max-w-5xl overflow-hidden rounded-2xl border border-foreground/10 md:w-[80vw]">
                <Image
                  src={galeria[lightbox].src}
                  alt={galeria[lightbox].legenda ? pickText(galeria[lightbox].legenda!, lang) : nome}
                  fill
                  sizes="90vw"
                  className="object-contain"
                />
              </div>
              <figcaption className="flex items-center gap-3 font-roobert text-sm text-muted">
                <span className="font-mono text-foreground">
                  {String(lightbox + 1).padStart(2, "0")} / {String(galeria.length).padStart(2, "0")}
                </span>
                {galeria[lightbox].legenda && (
                  <>
                    <span className="text-muted/40">·</span>
                    {pickText(galeria[lightbox].legenda!, lang)}
                  </>
                )}
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectNavCard({
  project,
  direction,
  label,
}: {
  project: (typeof projetos)[number];
  direction: "prev" | "next";
  label: string;
}) {
  const isPrev = direction === "prev";
  const loc = useLocalizedHref();
  return (
    <Link
      href={loc(`/project?id=${slugify(project.nome)}`)}
      className={`group flex items-center gap-5 rounded-2xl border border-foreground/10 p-5 transition-colors duration-300 hover:border-foreground/30 hover:bg-foreground/[0.03] ${
        isPrev ? "" : "sm:flex-row-reverse sm:text-right"
      }`}
    >
      {project.imagem && (
        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-2">
          <Image
            src={project.imagem}
            alt={project.nome}
            fill
            sizes="80px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className={`flex flex-1 flex-col gap-1 ${isPrev ? "" : "sm:items-end"}`}>
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted">
          {isPrev && <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />}
          {label}
          {!isPrev && <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />}
        </span>
        <span className="font-roobert text-lg font-medium">{project.nome}</span>
      </div>
    </Link>
  );
}
