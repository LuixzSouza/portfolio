"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useSpring,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { Container } from "@/components/ds/Container";
import { Section } from "@/components/ds/Section";
import { Heading } from "@/components/ds/Heading";
import { Text } from "@/components/ds/Text";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Reveal } from "@/components/ds/Reveal";
import { milestones, type Milestone } from "@/data/timeline";
import { useMilestones } from "@/hooks/useMilestones";
import { useTranslations } from "@/content/useTranslations";
import { useLanguage } from "@/components/ds/LanguageProvider";
import { pickText } from "@/lib/i18n";

export function Timeline({ items: initial = milestones }: { items?: Milestone[] }) {
  const t = useTranslations();
  const { lang } = useLanguage();
  const items = useMilestones(initial);
  const trackRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start center", "end center"],
  });

  const lineScale = useSpring(scrollYProgress, { stiffness: 70, damping: 26, mass: 0.35 });

  // Descobre qual marco está no centro da tela (getBoundingClientRect = preciso)
  // e trava no último cujo topo já cruzou a linha de gatilho. Dirigido pelo scroll
  // do usuário — roda sempre (não é autoplay), então não é gated por reduced-motion.
  const computeActive = useCallback(() => {
    if (typeof window === "undefined") return;
    const triggerLine = window.innerHeight * 0.5;
    let idx = 0;
    nodeRefs.current.forEach((el, i) => {
      if (el && el.getBoundingClientRect().top <= triggerLine) idx = i;
    });
    setActive((prev) => (prev === idx ? prev : idx));
  }, []);

  // Recalcula no MESMO sinal de scroll que anima a linha — nunca dessincroniza.
  useMotionValueEvent(scrollYProgress, "change", computeActive);

  // Estado inicial após montar + recálculo no resize.
  useEffect(() => {
    if (!mounted) return;
    computeActive();
    window.addEventListener("resize", computeActive, { passive: true });
    return () => window.removeEventListener("resize", computeActive);
  }, [mounted, computeActive]);

  const currentImage = items[active]?.image;

  return (
    <Section id="trajetoria" className="border-t border-foreground/10 overflow-x-clip">
      <Container>
        <Reveal className="mb-16 flex flex-col gap-5 md:mb-24">
          <Eyebrow>{t.timeline.eyebrow}</Eyebrow>
          <Heading size="display-md" className="max-w-[18ch]">
            {t.timeline.headingLead}{" "}
            <span className="font-serif font-normal italic">{t.timeline.headingCode}</span>{" "}
            {t.timeline.headingTail}
          </Heading>
          <Text tone="muted" size="lg" measure>
            {t.timeline.text}
          </Text>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          {/* COLUNA ESQUERDA: roleta de ano/título + imagem que troca por marco */}
          <div className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-1/4 flex flex-col gap-4">
              <span className="font-mono text-sm font-medium tracking-widest text-muted uppercase">
                {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>

              {/* ANO: entra de baixo, sai por cima (position absolute cruza as transições) */}
              <div className="relative h-[130px] w-full overflow-hidden">
                <AnimatePresence>
                  <motion.div
                    key={`year-${active}`}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute inset-0 flex items-center font-roobert text-[7.5rem] font-medium leading-none tracking-tighter text-foreground"
                  >
                    {pickText(items[active].year, lang)}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* TÍTULO: mesma técnica do ano, com leve atraso */}
              <div className="relative h-12 w-full overflow-hidden">
                <AnimatePresence>
                  <motion.div
                    key={`title-${active}`}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -40, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.05 }}
                    className="absolute inset-0 flex items-center max-w-[14ch] font-serif text-xl italic text-muted"
                  >
                    {pickText(items[active].title, lang)}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* IMAGEM: crossfade + zoom suave a cada marco ativo */}
              {currentImage && (
                <div className="relative mt-3 aspect-[3/2] w-full overflow-hidden rounded-2xl border border-foreground/10 bg-surface">
                  <AnimatePresence>
                    <motion.div
                      key={`img-${active}`}
                      initial={{ opacity: 0, scale: 1.08 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={currentImage}
                        alt={pickText(items[active].title, lang)}
                        fill
                        sizes="(min-width: 1024px) 33vw, 100vw"
                        className="object-contain"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* COLUNA DIREITA: Trilho + Marcos */}
          <div ref={trackRef} className="relative lg:col-span-8">
            <div className="absolute bottom-2 left-3 top-2 w-px bg-foreground/10" />

            {mounted ? (
              <motion.div
                style={{ scaleY: lineScale }}
                className="absolute bottom-2 left-3 top-2 w-px origin-top bg-foreground shadow-[0_0_10px_rgba(255,255,255,0.3)]"
              />
            ) : (
              <div
                className="absolute bottom-2 left-3 top-2 w-px origin-top bg-foreground"
                style={{ transform: "scaleY(0)" }}
              />
            )}

            <div className="flex flex-col gap-16 md:gap-24">
              {items.map((m, i) => {
                const on = i <= active;
                const isCurrent = i === active;

                return (
                  <div
                    key={i}
                    ref={(el) => {
                      nodeRefs.current[i] = el;
                    }}
                    className="group relative pl-12 md:pl-16"
                  >
                    <span className="absolute left-3 top-1.5 z-10 flex -translate-x-1/2 items-center justify-center">
                      {/* Halo que VIAJA entre os pontos conforme o marco ativo muda */}
                      {isCurrent && (
                        <>
                          <motion.span
                            layoutId="timeline-halo"
                            className="absolute h-10 w-10 rounded-full bg-foreground/10 ring-1 ring-foreground/20"
                            transition={{ type: "spring", stiffness: 280, damping: 30 }}
                          />
                          <span className="absolute h-8 w-8 animate-ping rounded-full bg-foreground/20" />
                        </>
                      )}
                      <motion.span
                        initial={false}
                        animate={{ scale: on ? 1 : 0.6 }}
                        transition={{ type: "spring", stiffness: 320, damping: 18 }}
                        className={`block h-4 w-4 rounded-full border-[3px] transition-colors duration-500 ${
                          on
                            ? "border-background bg-foreground shadow-[0_0_14px_rgb(var(--foreground)/0.45)]"
                            : "border-foreground/25 bg-background group-hover:border-foreground/50"
                        }`}
                      />
                    </span>

                    <div
                      className={`flex flex-col gap-3 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        on ? "translate-y-0" : "translate-y-4"
                      }`}
                    >
                      <span className="font-mono text-sm font-medium text-muted lg:hidden">
                        {`// ${pickText(m.year, lang)}`}
                      </span>
                      <Heading as="h3" size="display-sm" className="text-2xl md:text-3xl">
                        {pickText(m.title, lang)}
                      </Heading>
                      <Text tone="muted" measure>
                        {pickText(m.desc, lang)}
                      </Text>

                      {/* Imagem do marco também no mobile (a coluna esquerda é só desktop) */}
                      {m.image && (
                        <div className="relative mt-2 aspect-[3/2] w-full overflow-hidden rounded-xl border border-foreground/10 bg-surface lg:hidden">
                          <Image
                            src={m.image}
                            alt={pickText(m.title, lang)}
                            fill
                            sizes="100vw"
                            className="object-contain"
                          />
                        </div>
                      )}

                      <ul className="flex flex-wrap gap-2 pt-3">
                        {m.techs.map((tech, techIndex) => (
                          <motion.li
                            key={tech}
                            initial={false}
                            animate={{
                              opacity: on ? 1 : 0,
                              y: on ? 0 : 10,
                              scale: on ? 1 : 0.9,
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 200,
                              damping: 20,
                              delay: on ? techIndex * 0.05 : 0,
                            }}
                            className="rounded-full border border-foreground/15 px-3 py-1 text-xs font-medium text-muted transition-colors hover:border-foreground/40 hover:text-foreground"
                          >
                            {tech}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
