"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import type { Projeto } from "@/data/projects";
import { useTranslations } from "@/content/useTranslations";
import { useLanguage } from "@/components/ds/LanguageProvider";
import { pickText } from "@/lib/i18n";
import { EASE } from "./ease";

type Galeria = NonNullable<Projeto["galeria"]>;

/** Visualizador em tela cheia da galeria (usar dentro de <AnimatePresence>). */
export function ProjectLightbox({
  galeria,
  index,
  nome,
  onChange,
  onClose,
}: {
  galeria: Galeria;
  index: number;
  nome: string;
  onChange: (index: number) => void;
  onClose: () => void;
}) {
  const t = useTranslations();
  const { lang } = useLanguage();
  const img = galeria[index];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => onClose()}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-background/95 p-4 backdrop-blur-xl md:p-10"
    >
      {/* Fechar */}
      <button
        type="button"
        onClick={() => onClose()}
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
              onChange((index - 1 + galeria.length) % galeria.length);
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
              onChange((index + 1) % galeria.length);
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
        key={index}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-full max-w-5xl flex-col items-center gap-4"
      >
        <div className="relative aspect-[16/10] w-[92vw] max-w-5xl overflow-hidden rounded-2xl border border-foreground/10 md:aspect-auto md:h-[70vh] md:w-[80vw]">
          <Image
            src={img.src}
            alt={img.legenda ? pickText(img.legenda!, lang) : nome}
            fill
            sizes="90vw"
            className="object-contain"
          />
        </div>
        <figcaption className="flex items-center gap-3 font-roobert text-sm text-muted">
          <span className="font-mono text-foreground">
            {String(index + 1).padStart(2, "0")} / {String(galeria.length).padStart(2, "0")}
          </span>
          {img.legenda && (
            <>
              <span className="text-muted/40">·</span>
              {pickText(img.legenda!, lang)}
            </>
          )}
        </figcaption>
      </motion.figure>
    </motion.div>
  );
}
