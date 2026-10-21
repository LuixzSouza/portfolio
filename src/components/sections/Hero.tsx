"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform, useReducedMotion, type Variants } from "framer-motion";
import { MousePointer2 } from "lucide-react";
import { Container } from "@/components/ds/Container";
import { Heading } from "@/components/ds/Heading";
import { Text } from "@/components/ds/Text";
import { MagneticButton } from "@/components/ds/MagneticButton";
import { ArrowButton } from "@/components/ds/ArrowButton";
import { AnimatedLink } from "@/components/ds/AnimatedLink";
import { TypingText } from "@/components/ds/TypingText";
import { useTranslations } from "@/content/useTranslations";
import { useLanguage } from "@/components/ds/LanguageProvider";
import { cvHref } from "@/lib/cv";

// Variáveis da animação em cascata dos textos
const textRevealVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

export function Hero() {
  const t = useTranslations();
  const { lang } = useLanguage();

  // Conteúdo nasce visível no SSR; a animação de entrada só dispara após montar
  // (evita ficar preso invisível se o JS demorar/falhar na hidratação).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // --- PARALLAX DE SCROLL DA FOTO ---
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, -90]);

  // --- LÓGICA DO EFEITO 3D DA FOTO ---
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Dica de interatividade: some assim que a pessoa mexe na foto.
  const [interacted, setInteracted] = useState(false);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["100%", "0%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["100%", "0%"]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    if (!interacted) setInteracted(true);
    const rect = ref.current.getBoundingClientRect();
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };
  // ------------------------------------

  return (
    <section ref={heroRef} className="relative flex min-h-screen items-center overflow-hidden pb-16 pt-28 md:pt-32">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          
          {/* COLUNA DE TEXTO - ANIMADA EM CASCATA */}
          <motion.div
            key={mounted ? "on" : "off"}
            initial={mounted ? "hidden" : "visible"}
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
            }}
            className="flex flex-col lg:col-span-7"
          >
            <motion.div variants={textRevealVariants} className="mb-7 flex flex-wrap items-center gap-x-5 gap-y-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-3.5 py-1.5 text-xs font-medium text-muted transition-colors hover:border-foreground/30 hover:bg-foreground/5 cursor-default">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-foreground" />
                </span>
                {t.hero.badge}
              </span>
              <span className="inline-flex items-center gap-2 text-eyebrow font-medium uppercase text-muted">
                {t.hero.role}
                <TypingText words={t.hero.typing} className="text-foreground" />
              </span>
            </motion.div>

            <motion.div variants={textRevealVariants}>
              <Heading as="h1" size="display-xl" className="leading-[0.92]">
                Luiz <span className="font-serif font-normal italic text-foreground/80">Souza</span>
              </Heading>
            </motion.div>

            <motion.div variants={textRevealVariants}>
              <Text size="lg" tone="muted" measure className="mt-7">
                {t.hero.tagline}
              </Text>
            </motion.div>

            <motion.div variants={textRevealVariants} className="mt-10 flex flex-wrap items-center gap-5">
              <MagneticButton href="/work">{t.hero.ctaSecondary}</MagneticButton>
              <ArrowButton
                href={cvHref(lang)}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
              >
                {t.contact.cv}
              </ArrowButton>
            </motion.div>

            <motion.div variants={textRevealVariants} className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
              <AnimatedLink href="/contact" withArrow>
                {t.hero.ctaPrimary}
              </AnimatedLink>
              <AnimatedLink
                href="https://github.com/LuixzSouza"
                target="_blank"
                rel="noopener noreferrer"
                withArrow
              >
                GitHub
              </AnimatedLink>
              <AnimatedLink
                href="https://www.linkedin.com/in/luiz-antonio-souza-5000a226b/"
                target="_blank"
                rel="noopener noreferrer"
                withArrow
              >
                LinkedIn
              </AnimatedLink>
              <span className="text-muted">{t.hero.location}</span>
            </motion.div>
          </motion.div>

          {/* COLUNA DA FOTO - PARALLAX (scroll) + 3D TILT (mouse) */}
          <motion.div style={reduced ? undefined : { y: photoY }} className="lg:col-span-5">
          {/* A classe 'group' e 'cursor-crosshair' ficam aqui fora para ativar a imagem */}
          <div
            className="relative group cursor-crosshair"
            style={{ perspective: "1000px" }}
            ref={ref}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
          >
            <motion.div
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
              // pointer-events-none aqui impede o bug de tremor do mouse
              className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl border border-foreground/10 bg-surface shadow-2xl transition-shadow duration-500 hover:shadow-foreground/5 lg:max-w-none pointer-events-none"
            >
              <Image
                src="/image/fotoformal.webp"
                alt="Luiz Antônio de Souza"
                fill
                priority
                sizes="(max-width: 1024px) 80vw, 40vw"
                className="object-cover object-top grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
              />

              {/* Reflexo de luz */}
              <motion.div
                className="absolute inset-0 z-10 opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-60"
                style={{
                  background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)",
                  left: glareX,
                  top: glareY,
                  width: "150%",
                  height: "150%",
                  transform: "translate(-50%, -50%)",
                }}
              />

              <div className="absolute inset-0 z-20 ring-1 ring-inset ring-foreground/10 rounded-3xl" />

              {/* Dica de interatividade da foto */}
              <AnimatePresence>
                {!reduced && !interacted && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className="absolute bottom-4 left-1/2 z-30 -translate-x-1/2"
                  >
                    <motion.span
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="flex items-center gap-2 whitespace-nowrap rounded-full bg-foreground/80 px-3.5 py-1.5 text-xs font-medium text-background shadow-lg backdrop-blur-md"
                    >
                      <MousePointer2 className="h-3.5 w-3.5" />
                      {t.hero.hint}
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
          </motion.div>

        </div>
      </Container>
    </section>
  );
}