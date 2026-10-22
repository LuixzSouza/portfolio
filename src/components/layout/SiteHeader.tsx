"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { User, FolderOpen, MessageCircle, ArrowRight, Layers } from "lucide-react";
import { Container } from "@/components/ds/Container";
import { ArrowButton } from "@/components/ds/ArrowButton";
import { AnimatedLink } from "@/components/ds/AnimatedLink";
import { ThemeToggle } from "@/components/ds/ThemeToggle";
import { LanguageToggle } from "@/components/ds/LanguageToggle";
import { useTranslations } from "@/content/useTranslations";
import { useAdmin } from "@/components/admin/AdminProvider";
import { localeFromPath, localizeHref } from "@/lib/locales";

const NAV = [
  {
    key: "work",
    href: "/work",
    icon: FolderOpen
  },
  {
    key: "services",
    href: "/services",
    icon: Layers
  },
  {
    key: "about",
    href: "/about",
    icon: User
  },
  {
    key: "contact",
    href: "/contact",
    icon: MessageCircle
  },
] as const;

function Logo({ onClick, href = "/" }: { onClick?: () => void; href?: string }) {
  const SPRING_EASE = "ease-[cubic-bezier(0.34,1.56,0.64,1)]";

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-label="Luiz Souza"
      className="group relative inline-flex items-center font-roobert text-base font-semibold uppercase text-foreground transition-transform active:scale-95 md:text-lg"
    >
      {/* Símbolo de abertura: desliza para a esquerda */}
      <span
        className={`mr-1 text-muted transition-all duration-500 ${SPRING_EASE} group-hover:-translate-x-1.5 group-hover:text-foreground`}
      >
        &lt;
      </span>
      
      {/* Nome: O tracking (espaçamento) aumenta suavemente acompanhando as tags */}
      <span 
        className={`tracking-tight transition-all duration-500 ${SPRING_EASE} group-hover:tracking-wide`}
      >
        LUIZ SOUZA
      </span>

      {/* Símbolo de fechamento: desliza para a direita */}
      <span
        className={`ml-1 text-muted transition-all duration-500 ${SPRING_EASE} group-hover:translate-x-1.5 group-hover:text-foreground`}
      >
        /&gt;
      </span>
    </Link>
  );
}

// Hook para feedback haptic
function useHaptic() {
  const vibrate = (pattern: number | number[]) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  };
  return { vibrate };
}

export function SiteHeader() {
  const t = useTranslations();
  const pathname = usePathname();
  const { user } = useAdmin();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { vibrate } = useHaptic();

  const locale = localeFromPath(pathname);
  const href = (path: string) => localizeHref(path, locale);
  const isActive = (path: string) => {
    const target = href(path);
    return pathname === target || pathname.startsWith(`${target}/`);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fecha o menu mobile ao trocar de rota (a navegação pode ser interceptada
  // pela transição de página, então não dá pra confiar só no onClick do link).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled || open
          ? "border-b border-foreground/10 bg-background/70 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <Container className="flex h-16 items-center justify-between md:h-20">
        <Logo onClick={() => setOpen(false)} href={href("/")} />

        <nav className="hidden items-center gap-9 md:flex">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <span key={item.href} className="relative flex items-center">
                <AnimatedLink
                  href={href(item.href)}
                  effect="roll"
                  className="text-sm"
                  aria-current={active ? "page" : undefined}
                >
                  {t.nav[item.key]}
                </AnimatedLink>
                {active && (
                  <motion.span
                    layoutId="nav-active-underline"
                    aria-hidden
                    className="absolute -bottom-1.5 left-0 right-0 h-[1.5px] rounded-full bg-foreground"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </span>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5 md:gap-3">
          <LanguageToggle />
          <ThemeToggle />

          {/* Admin indicator */}
          {user && (
            <motion.a
              href="/admin"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-green-500/30 bg-green-500/10 text-green-600 transition-all duration-300 hover:border-green-500/50 hover:bg-green-500/20"
              title="Painel Admin"
            >
              <User className="h-4 w-4" />
              <motion.div
                className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-500"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.a>
          )}

          <div className="hidden md:block">
            <ArrowButton href={href("/contact")} variant="solid" size="md">
              {t.nav.cta}
            </ArrowButton>
          </div>
          <motion.button
            type="button"
            aria-label={open ? t.a11y.closeMenu : t.a11y.openMenu}
            aria-expanded={open}
            onClick={() => {
              setOpen((v) => !v);
              vibrate(open ? [50] : [30, 10, 30]); // Padrão diferente para abrir/fechar
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative inline-flex h-10 w-10 items-center justify-center rounded-lg border text-foreground transition-all duration-300 md:hidden ${
              open
                ? "border-foreground/30 bg-foreground/5"
                : "border-foreground/15 hover:border-foreground/30 hover:bg-foreground/5"
            }`}
          >
            {/* Background pulse quando aberto */}
            {open && (
              <motion.div
                className="absolute inset-0 rounded-2xl bg-foreground/5"
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}

            {/* Menu hamburger animado */}
            <div className="relative flex h-6 w-6 flex-col items-center justify-center">
              {/* Linha superior */}
              <motion.span
                className="absolute h-0.5 w-5 bg-current origin-center"
                animate={{
                  rotate: open ? 45 : 0,
                  y: open ? 0 : -4,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />

              {/* Linha do meio */}
              <motion.span
                className="absolute h-0.5 w-5 bg-current"
                animate={{
                  opacity: open ? 0 : 1,
                  x: open ? -10 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />

              {/* Linha inferior */}
              <motion.span
                className="absolute h-0.5 w-5 bg-current origin-center"
                animate={{
                  rotate: open ? -45 : 0,
                  y: open ? 0 : 4,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </div>

          </motion.button>
        </div>
      </Container>
    </header>

    {/* Overlay mobile — Design completamente novo */}
    <motion.div
      initial={false}
      animate={open ? "open" : "closed"}
      variants={{
        open: {
          opacity: 1,
          pointerEvents: "auto" as const,
          scale: 1,
          filter: "blur(0px)",
        },
        closed: {
          opacity: 0,
          pointerEvents: "none" as const,
          scale: 0.95,
          filter: "blur(4px)",
          transition: {
            duration: 0.4,
            ease: "easeInOut",
            scale: { duration: 0.3 },
            filter: { duration: 0.2 }
          }
        }
      }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.05
      }}
      inert={!open}
      aria-hidden={!open}
      className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden"
    >
      {/* Ripple effect quando abre */}
      {open && (
        <>
          <motion.div
            className="absolute top-16 right-6 h-8 w-8 rounded-full border border-foreground/20"
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 15, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          <motion.div
            className="absolute top-16 right-6 h-8 w-8 rounded-full border border-foreground/10"
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 25, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          />
        </>
      )}
      {/* Background sutil */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/10 via-transparent to-foreground/10" />
      </div>

      <Container className="relative flex flex-col justify-center min-h-screen py-24">
        {/* Menu principal com cards */}
        <motion.div
          variants={{
            open: {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              transition: { duration: 0.4, delay: 0.1 }
            },
            closed: {
              opacity: 0,
              y: -15,
              scale: 0.9,
              filter: "blur(2px)",
              transition: {
                duration: 0.3,
                ease: "easeIn",
                y: { duration: 0.2 }
              }
            }
          }}
          className="space-y-4 mb-12"
        >
          {NAV.map((item, idx) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <motion.div
                key={item.href}
                variants={{
                  open: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotateX: 0,
                    filter: "blur(0px)",
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      delay: 0.2 + idx * 0.1,
                    }
                  },
                  closed: {
                    opacity: 0,
                    y: 20,
                    scale: 0.8,
                    rotateX: -15,
                    filter: "blur(1px)",
                    transition: {
                      duration: 0.25,
                      ease: "easeIn",
                      delay: (NAV.length - idx - 1) * 0.05, // Reverse stagger na saída
                    }
                  }
                }}
                whileHover={{
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                whileTap={{
                  scale: 0.98,
                  transition: { type: "spring", stiffness: 500, damping: 25 }
                }}
                className="relative"
              >
                <Link
                  href={href(item.href)}
                  onClick={() => {
                    vibrate([40]); // Haptic feedback no card
                    setTimeout(() => setOpen(false), 300);
                  }}
                  aria-current={active ? "page" : undefined}
                  className="group relative block"
                >
                  {/* Card principal */}
                  <div className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                    active
                      ? "border-foreground/30 bg-foreground/5 shadow-sm"
                      : "border-foreground/10 bg-surface/50 hover:border-foreground/20 hover:bg-surface/80"
                  }`}>
                    {/* Shimmer effect no hover */}
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-foreground/5 to-transparent group-hover:translate-x-full transition-transform duration-500 ease-out" />

                    <div className="relative p-6 flex items-center gap-4">
                      {/* Ícone com animação */}
                      <div className={`relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${
                        active
                          ? "bg-foreground text-background"
                          : "bg-foreground/10 text-muted group-hover:bg-foreground/20 group-hover:text-foreground"
                      }`}>
                        <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                      </div>

                      {/* Conteúdo */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-roobert text-2xl font-semibold tracking-tight transition-colors duration-300 ${
                          active ? "text-foreground" : "text-foreground group-hover:text-foreground"
                        }`}>
                          {t.nav[item.key]}
                        </h3>
                        <p className={`text-sm transition-colors duration-300 ${
                          active ? "text-foreground/70" : "text-muted group-hover:text-foreground/70"
                        }`}>
                          {t.nav.descriptions[item.key]}
                        </p>
                      </div>

                      {/* Arrow indicator */}
                      <div className={`transition-all duration-500 ${
                        active ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                      }`}>
                        <ArrowRight className={`h-5 w-5 ${
                          active ? "text-foreground" : "text-muted"
                        }`} />
                      </div>

                      {/* Active indicator pulse */}
                      {active && (
                        <motion.div
                          className="absolute top-6 right-6 h-2 w-2 rounded-full bg-foreground"
                          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          variants={{
            open: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 200,
                damping: 25,
                delay: 0.5
              }
            },
            closed: {
              opacity: 0,
              y: 15,
              scale: 0.9,
              transition: {
                duration: 0.2,
                ease: "easeIn"
              }
            }
          }}
          className="pt-4"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl bg-foreground text-background px-6 py-3 text-center"
          >
            <span className="font-roobert font-medium">
              {t.nav.cta}
            </span>
          </motion.div>
        </motion.div>

        {/* Footer info */}
        <motion.div
          variants={{
            open: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.4,
                delay: 0.7,
                ease: "easeOut"
              }
            },
            closed: {
              opacity: 0,
              y: 10,
              transition: {
                duration: 0.15,
                ease: "easeIn"
              }
            }
          }}
          className="mt-auto pt-8 text-center"
        >
          <p className="text-xs text-muted/70">
            {t.nav.madeBy} Luiz Souza
          </p>
        </motion.div>
      </Container>
    </motion.div>
    </>
  );
}
