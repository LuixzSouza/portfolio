"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Maximize2 } from "lucide-react";
import type { Projeto } from "@/data/projects";
import { useLanguage } from "@/components/ds/LanguageProvider";
import { pickText } from "@/lib/i18n";
import { EASE } from "./ease";

type Galeria = NonNullable<Projeto["galeria"]>;

/** Grade de imagens do projeto; clicar abre o lightbox no índice. */
export function ProjectGallery({
  galeria,
  nome,
  onOpen,
}: {
  galeria: Galeria;
  nome: string;
  onOpen: (index: number) => void;
}) {
  const { lang } = useLanguage();
  return (
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
              onClick={() => onOpen(i)}
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
  );
}
