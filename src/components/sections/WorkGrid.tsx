"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Github, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { WorkCursor } from "@/components/sections/WorkCursor";
import { useCursorFollow } from "@/hooks/useCursorFollow";
import { useCmsList } from "@/hooks/useCmsList";
import { WorkCardMedia } from "@/components/sections/WorkCardMedia";
import { Container } from "@/components/ds/Container";
import { Section } from "@/components/ds/Section";
import { Heading } from "@/components/ds/Heading";
import { Text } from "@/components/ds/Text";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Reveal } from "@/components/ds/Reveal";
import { projetos, type Projeto } from "@/data/projects";
import { listProjects } from "@/lib/api";
import { withLocalProjects } from "@/lib/mergeProjects";
import { useGithubRepos } from "@/hooks/useGithubRepos";
import { slugify } from "@/lib/slug";
import { screenshotUrl } from "@/lib/screenshot";
import { useTranslations } from "@/content/useTranslations";
import { useLanguage } from "@/components/ds/LanguageProvider";
import { useLocalizedHref } from "@/lib/useLocale";
import { pickText } from "@/lib/i18n";

const ALL = "all";
type Source = "all" | "curated" | "github";
// Quantos cards por vez (paginação) — evita carregar tudo/screenshots de uma vez.
const PAGE = 9;
// Quantas opções de filtro mostrar (as techs mais comuns).
const MAX_FILTERS = 12;

/** Formato unificado dos cards (projeto curado OU repo do GitHub). */
interface GridItem {
  key: string;
  nome: string;
  image?: string;
  hoverSrc?: string;
  desc?: string;
  techs: string[];
  href: string;
  external: boolean;
  isGithub: boolean;
  live: boolean;
}

export function WorkGrid() {
  const t = useTranslations();
  const { lang } = useLanguage();
  const loc = useLocalizedHref();
  const [filter, setFilter] = useState(ALL);
  const [source, setSource] = useState<Source>("all");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE);
  // Fallback estático (dados de @/data); substituído pela API quando ela responder.
  const items = useCmsList(
    listProjects,
    (data) => withLocalProjects(data as unknown as Projeto[], projetos),
    projetos,
  );
  const githubRepos = useGithubRepos();
  const { x, y, follow } = useCursorFollow();
  const [hovering, setHovering] = useState(false);

  // Junta projetos curados + repos do GitHub num só formato de card.
  const cards = useMemo<GridItem[]>(() => {
    const local: GridItem[] = items.map((p) => {
      // resumo é o texto curto do card; cai para descricao (único campo que a
      // API fornece, e o que muitos projetos estáticos usam) p/ não ficar vazio.
      const desc = p.resumo ?? p.descricao;
      return {
      key: p.nome,
      nome: p.nome,
      image: p.imagem,
      hoverSrc: p.links.verProjeto ? screenshotUrl(p.links.verProjeto) : undefined,
      desc: desc ? pickText(desc, lang) : undefined,
      techs: p.tecnologias,
      href: `/project?id=${slugify(p.nome)}`,
      external: false,
      isGithub: false,
      live: Boolean(p.links.verProjeto),
      };
    });
    const github: GridItem[] = githubRepos.map((r) => ({
      key: `gh-${r.name}`,
      nome: r.name,
      image: undefined,
      hoverSrc: r.homepage ? screenshotUrl(r.homepage) : undefined,
      desc: r.description,
      techs: r.techs,
      href: r.homepage ?? r.htmlUrl,
      external: true,
      isGithub: true,
      live: Boolean(r.homepage),
    }));
    return [...local, ...github];
  }, [items, githubRepos, lang]);

  const stats = useMemo(
    () => ({
      total: cards.length,
      github: cards.filter((c) => c.isGithub).length,
      live: cards.filter((c) => c.live).length,
    }),
    [cards],
  );

  // Filtra por origem antes de tudo — base p/ os filtros de tech e contagens.
  const bySource = useMemo(() => {
    if (source === "all") return cards;
    if (source === "github") return cards.filter((c) => c.isGithub);
    return cards.filter((c) => !c.isGithub);
  }, [source, cards]);

  // Filtros dinâmicos: techs reais dos cards da origem atual, agrupadas
  // (case-insensitive), ordenadas por frequência, com contagem.
  const techFilters = useMemo(() => {
    const meta = new Map<string, { label: string; count: number }>();
    bySource.forEach((c) =>
      c.techs.forEach((tech) => {
        const k = tech.toLowerCase();
        const cur = meta.get(k);
        if (cur) cur.count += 1;
        else meta.set(k, { label: tech, count: 1 });
      }),
    );
    return [...meta.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, MAX_FILTERS)
      .map(([key, v]) => ({ key, label: v.label, count: v.count }));
  }, [bySource]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bySource.filter((c) => {
      const matchTech = filter === ALL || c.techs.some((tech) => tech.toLowerCase() === filter);
      const matchQuery =
        !q ||
        c.nome.toLowerCase().includes(q) ||
        c.techs.some((tech) => tech.toLowerCase().includes(q));
      return matchTech && matchQuery;
    });
  }, [filter, bySource, query]);

  // Volta para o início da paginação quando qualquer filtro muda.
  useEffect(() => setVisible(PAGE), [filter, source, query]);

  const shown = filtered.slice(0, visible);

  const SOURCES: { key: Source; label: string; icon?: typeof Github }[] = [
    { key: "all", label: t.work.filterAll },
    { key: "curated", label: t.work.sourceCurated },
    { key: "github", label: t.work.sourceGithub, icon: Github },
  ];

  return (
    <Section className="min-h-screen pt-28 md:pt-36">
      <Container>
        <Reveal className="flex flex-col gap-5">
          <Eyebrow>{t.work.eyebrow}</Eyebrow>
          <Heading as="h1" size="display-lg" className="max-w-[14ch]">
            {t.work.headingLead}{" "}
            <span className="font-serif font-normal italic text-foreground/80">{t.work.headingEmphasis}</span>
          </Heading>
          <Text tone="muted" size="lg" measure>
            {t.work.text}
          </Text>

          {/* Stats: total · GitHub · no ar */}
          <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-sm text-muted">
            <span><span className="text-foreground">{stats.total}</span> {t.work.metaProjects}</span>
            <span className="text-muted/40">·</span>
            <span><span className="text-foreground">{stats.github}</span> {t.work.metaGithub}</span>
            <span className="text-muted/40">·</span>
            <span><span className="text-foreground">{stats.live}</span> {t.work.metaLive}</span>
          </div>
        </Reveal>

        {/* CONTROLES: busca + filtro de origem */}
        <div className="mt-10 flex flex-col gap-4 md:mt-14 md:flex-row md:items-center md:justify-between">
          <div className="relative flex w-full max-w-sm items-center">
            <Search className="pointer-events-none absolute left-4 h-4 w-4 text-muted" strokeWidth={1.75} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={t.work.searchPlaceholder}
              placeholder={t.work.searchPlaceholder}
              className="w-full rounded-full border border-foreground/15 bg-transparent py-2.5 pl-11 pr-10 text-sm text-foreground placeholder:text-muted/70 transition-colors focus-visible:border-foreground/40 focus-visible:outline-none"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  onClick={() => setQuery("")}
                  aria-label={t.a11y.clearSearch}
                  className="absolute right-3 flex h-6 w-6 items-center justify-center rounded-full text-muted transition-colors hover:bg-foreground/10 hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Segmented control de origem (Sliding Pill) */}
          <div
            role="group"
            aria-label={t.a11y.source}
            className="inline-flex shrink-0 items-center self-start rounded-full border border-foreground/15 p-1 text-sm font-medium md:self-auto"
          >
            {SOURCES.map((s) => {
              const active = source === s.key;
              const Icon = s.icon;
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => {
                    setSource(s.key);
                    setFilter(ALL);
                  }}
                  aria-pressed={active}
                  className={`relative flex items-center gap-1.5 rounded-full px-4 py-1.5 tracking-wide transition-colors duration-300 active:scale-95 ${
                    active ? "text-background" : "text-muted hover:text-foreground"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="active-source-pill"
                      className="absolute inset-0 rounded-full bg-foreground"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {Icon && <Icon className="relative z-10 h-3.5 w-3.5" />}
                  <span className="relative z-10">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FILTROS POR TECNOLOGIA (Sliding Pill) com contagem */}
        <div className="mt-6 flex flex-wrap gap-2.5">
          {[{ key: ALL, label: t.work.filterAll, count: bySource.length }, ...techFilters].map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                aria-pressed={active}
                className={`relative flex items-center gap-1.5 rounded-full border border-foreground/15 px-5 py-2 text-sm font-medium tracking-wide transition-colors duration-300 active:scale-95 ${
                  active ? "border-transparent text-background" : "text-muted hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="active-filter-pill"
                    className="absolute inset-0 rounded-full bg-foreground"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{f.label}</span>
                <span className={`relative z-10 text-xs ${active ? "text-background/60" : "text-muted/60"}`}>
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* GRADE DE PROJETOS ANIMADA (Isotope Effect) */}
        <motion.div
          layout
          onMouseMove={follow}
          className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 md:mt-16 md:gap-12"
        >
          <AnimatePresence mode="popLayout">
            {shown.map((c, i) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                key={c.key}
              >
                <motion.a
                  href={c.external ? c.href : loc(c.href)}
                  {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  onMouseEnter={() => setHovering(true)}
                  onMouseLeave={() => setHovering(false)}
                  className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                  initial="rest"
                  whileHover="hover"
                  whileFocus="hover"
                  whileTap={{ scale: 0.96 }}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-foreground/10 bg-surface-2">
                    <WorkCardMedia
                      image={c.image}
                      hoverSrc={c.hoverSrc}
                      alt={c.nome}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    {/* Marca de origem GitHub (decorativa) */}
                    {c.isGithub && (
                      <span className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                        <Github className="h-3.5 w-3.5" /> GitHub
                      </span>
                    )}

                    {/* Badge "Ao vivo" para projetos com site no ar */}
                    {c.live && (
                      <span className="pointer-events-none absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                        </span>
                        {t.work.live}
                      </span>
                    )}

                    {/* Overlay escuro (decorativo) */}
                    <motion.div
                      className="pointer-events-none absolute inset-0 bg-black/30"
                      variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Badge central (mobile/toque): no desktop quem aparece é o cursor "Visualizar" */}
                    <motion.div
                      className="pointer-events-none absolute inset-0 flex items-center justify-center lg:hidden"
                      variants={{
                        rest: { opacity: 0, scale: 0.8 },
                        hover: { opacity: 1, scale: 1 },
                      }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white shadow-2xl backdrop-blur-md">
                        <ArrowUpRight className="h-6 w-6" strokeWidth={1.5} />
                      </div>
                    </motion.div>
                  </div>

                  {/* Informações do projeto */}
                  <motion.div
                    className="mt-5 flex flex-col gap-3 px-2"
                    variants={{ rest: { x: 0 }, hover: { x: 6 } }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <Heading as="h2" size="display-sm" className="text-xl">
                        {c.nome}
                      </Heading>
                      <span className="shrink-0 font-mono text-xs text-muted/50">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {c.desc && (
                      <Text size="sm" tone="muted" className="-mt-1 line-clamp-2">
                        {c.desc}
                      </Text>
                    )}

                    <ul className="flex flex-wrap gap-2">
                      {c.techs.slice(0, 4).map((tech) => (
                        <li
                          key={tech}
                          className="rounded-full border border-foreground/15 px-3 py-1 text-xs font-medium text-muted transition-colors group-hover:border-foreground/30 group-hover:text-foreground/80"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </motion.a>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Paginação: carrega mais sob demanda */}
        {visible < filtered.length && (
          <div className="mt-14 flex justify-center md:mt-20">
            <button
              type="button"
              onClick={() => setVisible((v) => v + PAGE)}
              className="rounded-full border border-foreground/20 px-7 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5 active:scale-95"
            >
              {t.work.loadMore} ({filtered.length - visible})
            </button>
          </div>
        )}

        {/* Estado vazio (filtro/busca sem resultados) */}
        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-20 flex flex-col items-center justify-center gap-4"
            >
              <Text tone="muted" className="text-center text-lg">
                {query ? t.work.searchEmpty : t.work.empty}
              </Text>
              {(query || filter !== ALL || source !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setFilter(ALL);
                    setSource("all");
                  }}
                  className="rounded-full border border-foreground/20 px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5 active:scale-95"
                >
                  {t.work.filterAll}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Container>

      <WorkCursor x={x} y={y} active={hovering} label={t.work.viewLabel} />
    </Section>
  );
}
