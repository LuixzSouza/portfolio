"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useLanguage, type Lang } from "./LanguageProvider";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Check } from "lucide-react";
import { LOCALES, localeFromPath } from "@/lib/locales";
import { useTranslations } from "@/content/useTranslations";

// Config dos idiomas derivada de LOCALES (fonte única). Adicionar idioma lá
// reflete aqui automaticamente.
const LANGUAGES: Record<Lang, { flag: string; label: string; nativeName: string }> =
  Object.fromEntries(
    LOCALES.map((l) => [l.code, { flag: l.flag, label: l.label, nativeName: l.native }]),
  ) as Record<Lang, { flag: string; label: string; nativeName: string }>;

const OPTIONS: Lang[] = LOCALES.map((l) => l.code);

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguage();
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [textWidth, setTextWidth] = useState(0);
  const reduceMotion = useReducedMotion();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fecha dropdown no Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Mede o width necessário para evitar layout shift
  useEffect(() => {
    if (!measureRef.current) return;

    const measurements = OPTIONS.map(langKey => {
      const text = LANGUAGES[langKey].nativeName;
      measureRef.current!.textContent = text;
      return measureRef.current!.getBoundingClientRect().width;
    });

    // Margem extra para respiro do texto
    const maxWidth = Math.max(...measurements) + 12;
    setTextWidth(maxWidth);
  }, []);

  const handleLanguageChange = (newLang: Lang) => {
    if (newLang === lang) return;

    setIsOpen(false);

    // Navega para a mesma página no novo idioma (URLs por idioma). O layout do
    // segmento destino semeia o LanguageProvider, então o conteúdo acompanha.
    // O reflow dos textos é mascarado pelo LocaleFlash (blink global) disparado
    // pela mudança de `lang` no provider.
    const current = localeFromPath(pathname);
    const newPath = pathname.startsWith(`/${current}`)
      ? pathname.replace(`/${current}`, `/${newLang}`)
      : `/${newLang}${pathname === "/" ? "" : pathname}`;

    setLang(newLang);
    // scroll:false preserva a posição — é a "mesma" página em outro idioma.
    router.push(newPath, { scroll: false });
  };


  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Botão principal */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={t.a11y.selectLanguage}
        className="flex cursor-pointer items-center gap-2 rounded-lg border border-foreground/15 bg-background px-3 py-2 text-sm font-medium text-foreground transition-all duration-200 hover:border-foreground/30 hover:bg-surface/50 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-foreground/20"
        whileTap={!reduceMotion ? { scale: 0.98 } : undefined}
      >
        {/* Bandeira do idioma atual */}
        <motion.span
          key={lang}
          initial={!reduceMotion ? { scale: 0.8, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="text-base leading-none"
        >
          {LANGUAGES[lang].flag}
        </motion.span>

        {/* Nome nativo — width fixo previne layout shift entre idiomas */}
        <div
          className="flex items-center text-left"
          style={{
            width: textWidth > 0 ? `${textWidth}px` : "70px",
            minWidth: "70px",
          }}
        >
          <span className="font-medium">{LANGUAGES[lang].nativeName}</span>
        </div>

        {/* Seta dropdown */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-3.5 w-3.5 text-muted" />
        </motion.div>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={!reduceMotion ? {
              opacity: 0,
              scale: 0.95,
              y: -8
            } : { opacity: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }}
            exit={!reduceMotion ? {
              opacity: 0,
              scale: 0.95,
              y: -8
            } : { opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full z-50 mt-2 min-w-[8rem] overflow-hidden rounded-lg border border-foreground/15 bg-background shadow-lg backdrop-blur-sm"
          >
            {OPTIONS.map((option, index) => {
              const isActive = option === lang;
              const langData = LANGUAGES[option];

              return (
                <motion.button
                  key={option}
                  type="button"
                  onClick={() => handleLanguageChange(option)}
                  initial={!reduceMotion ? {
                    opacity: 0,
                    x: -8
                  } : false}
                  animate={{
                    opacity: 1,
                    x: 0
                  }}
                  transition={{
                    duration: 0.15,
                    delay: index * 0.03
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors duration-150 ${
                    isActive
                      ? "bg-surface/80 text-foreground"
                      : "text-muted hover:bg-surface/50 hover:text-foreground"
                  }`}
                >
                  {/* Bandeira */}
                  <span className="text-base leading-none">
                    {langData.flag}
                  </span>

                  {/* Nome do idioma */}
                  <span className="flex-1 font-medium">
                    {langData.nativeName}
                  </span>

                  {/* Indicador ativo */}
                  {isActive && (
                    <motion.div
                      initial={!reduceMotion ? { scale: 0 } : false}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Check className="h-3.5 w-3.5 text-foreground" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elemento invisível para medir textos */}
      <span
        ref={measureRef}
        className="absolute invisible font-medium text-sm"
        style={{ top: -9999, left: -9999 }}
        aria-hidden="true"
      />
    </div>
  );
}