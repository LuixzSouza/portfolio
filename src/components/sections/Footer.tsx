"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
// 1. Importando o type Variants do framer-motion
import { motion, type Variants } from "framer-motion";
import { Container } from "@/components/ds/Container";
import { Section } from "@/components/ds/Section";
import { Heading } from "@/components/ds/Heading";
import { Text } from "@/components/ds/Text";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { AnimatedLink } from "@/components/ds/AnimatedLink";
import { ArrowButton } from "@/components/ds/ArrowButton";
import { useTranslations } from "@/content/useTranslations";
import { localeFromPath, localizeHref } from "@/lib/locales";

const NAV = [
  { key: "work", href: "/work" },
  { key: "services", href: "/services" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
] as const;

const SOCIAL = [
  { label: "GitHub", href: "https://github.com/LuixzSouza" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/luiz-antonio-souza-5000a226b/" },
  { label: "CodeWars", href: "https://www.codewars.com/users/LuixzSouza" },
];

const EMAIL = "luiz.antoniodesouza004@gmail.com";

export function SectionFooter({ className = "" }: { className?: string }) {
  const t = useTranslations();
  const pathname = usePathname();

  // Estado para ano e tempo - inicializado no useEffect para evitar mismatch de hidratação
  const [year, setYear] = useState<number | null>(null);
  const [time, setTime] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  const locale = localeFromPath(pathname);
  const href = (path: string) => localizeHref(path, locale);
  const isActive = (path: string) => {
    const target = href(path);
    return pathname === target || pathname.startsWith(`${target}/`);
  };

  useEffect(() => {
    // Inicializar ano e tempo no cliente para evitar hidratação mismatch
    setYear(new Date().getFullYear());
    setMounted(true);

    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString("pt-BR", {
          timeZone: "America/Sao_Paulo",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    // Atualizar tempo imediatamente
    updateTime();

    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Tipando explicitamente as variáveis para o TypeScript parar de reclamar
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  return (
    <Section as="footer" id="footer" className={`overflow-hidden border-t border-foreground/10 pb-10 md:pb-12 lg:pb-16 ${className}`}>
      <Container>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="flex flex-col gap-8 md:gap-10"
        >
          <Eyebrow>{t.footer.eyebrow}</Eyebrow>
          <Heading size="display-lg" className="max-w-[15ch]">
            {t.footer.headingLead}{" "}
            <span className="font-serif font-normal italic text-foreground/80">{t.footer.headingEmphasis}</span>
          </Heading>
          <div>
            <ArrowButton href={href("/contact")} variant="solid" size="lg">
              {t.footer.ctaButton}
            </ArrowButton>
          </div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mt-20 grid gap-10 border-t border-foreground/10 pt-12 sm:grid-cols-2 md:mt-28 md:grid-cols-3"
        >
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <span className="text-eyebrow font-medium uppercase text-muted">{t.footer.navLabel}</span>
            <nav className="flex flex-col items-start gap-2.5">
              {NAV.map((item) => (
                <AnimatedLink key={item.href} href={href(item.href)} active={isActive(item.href)}>
                  {t.nav[item.key]}
                </AnimatedLink>
              ))}
            </nav>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <span className="text-eyebrow font-medium uppercase text-muted">{t.footer.socialLabel}</span>
            <nav className="flex flex-col items-start gap-2.5">
              {SOCIAL.map((item) => (
                <AnimatedLink
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  withArrow
                >
                  {item.label}
                </AnimatedLink>
              ))}
            </nav>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <span className="text-eyebrow font-medium uppercase text-muted">{t.footer.contactLabel}</span>
            <AnimatedLink href={`mailto:${EMAIL}`} withArrow>
              {EMAIL}
            </AnimatedLink>
            <Text size="sm" tone="muted" className="max-w-[28ch]">
              {t.footer.availability}
            </Text>
            
            {/* 3. Relógio Local com paleta corrigida (tons de foreground/muted) */}
            <div className="mt-2 flex w-fit items-center gap-2.5 rounded-full border border-foreground/10 bg-surface px-3.5 py-1.5 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground/30" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-foreground/70" />
              </span>
              <span className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
                {mounted && time ? `BRT ${time}` : "BRT --:--"}
              </span>
            </div>
          </motion.div>
        </motion.div>

        <div className="mt-20 flex items-center gap-5 md:mt-28 md:gap-10">
          <div aria-hidden className="min-w-0 flex-1 select-none overflow-hidden">
            <motion.div
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "50px" }}
              transition={{ type: "spring", stiffness: 70, damping: 20 }}
            >
              <span className="block whitespace-nowrap font-roobert text-[clamp(2.5rem,13vw,11rem)] font-medium leading-[0.8] tracking-tighter text-foreground/[0.05] transition-colors duration-500 hover:text-foreground/[0.12]">
                LUIZ SOUZA
              </span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "50px" }}
            transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.15 }}
            className="group relative aspect-square w-[clamp(72px,12vw,168px)] shrink-0 overflow-hidden rounded-full border border-foreground/15 bg-surface"
          >
            <Image
              src="/image/foto-perfil-2026.webp"
              alt="Luiz Souza"
              fill
              sizes="168px"
              className="object-cover object-top grayscale transition-[filter,transform] duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
            />
            <div aria-hidden className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-foreground/10" />
          </motion.div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-foreground/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Text size="sm" tone="muted">
              © 2021 — {mounted ? year : "2025"} Luiz Antônio de Souza
            </Text>
            <AnimatedLink href={href("/styleguide")} className="text-xs text-muted">
              Styleguide
            </AnimatedLink>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted">{t.footer.madeIn}</span>
            <span aria-hidden className="text-muted/40">·</span>
            <motion.a
              href={href("/")}
              aria-label="Luiz Souza"
              initial="rest"
              animate="rest"
              whileHover="hover"
              whileFocus="hover"
              className="group inline-flex items-center font-mono font-medium uppercase tracking-tight text-foreground"
            >
              <motion.span
                aria-hidden
                variants={{ rest: { opacity: 0.35, x: 0 }, hover: { opacity: 0.9, x: -3 } }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
              >
                &lt;
              </motion.span>
              <span className="transition-colors duration-300 group-hover:text-foreground">LUIZ&nbsp;SOUZA</span>
              <motion.span
                aria-hidden
                variants={{ rest: { opacity: 0.35, x: 0 }, hover: { opacity: 0.9, x: 3 } }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
              >
                /&gt;
              </motion.span>
            </motion.a>
          </div>
        </div>
      </Container>
    </Section>
  );
}