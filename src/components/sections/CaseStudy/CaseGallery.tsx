"use client";

import Image from "next/image";
import { Reveal } from "@/components/ds/Reveal";
import { Parallax } from "@/components/ds/Parallax";
import type { Lang } from "@/components/ds/LanguageProvider";
import { pickText } from "@/lib/i18n";
import type { ProjetoImagem } from "@/data/projects";

/**
 * Galeria do case: imagens WebP com legenda, em grid assimétrico (a 1ª ocupa
 * largura total). Parallax sutil e reveal no scroll.
 */
export function CaseGallery({ images, lang }: { images: ProjetoImagem[]; lang: Lang }) {
  if (!images.length) return null;
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
      {images.map((img, i) => {
        const caption = img.legenda ? pickText(img.legenda, lang) : "";
        const wide = i === 0 && images.length > 1;
        return (
          <Reveal
            key={img.src + i}
            delay={(i % 2) * 0.08}
            className={wide ? "md:col-span-2" : ""}
          >
            <figure className="group flex flex-col gap-3">
              <div
                className={`relative overflow-hidden rounded-2xl border border-foreground/10 bg-surface ${
                  wide ? "aspect-[16/9]" : "aspect-[4/3]"
                }`}
              >
                <Parallax distance={30} reverse={i % 2 === 1} className="absolute inset-0">
                  <Image
                    src={img.src}
                    alt={caption}
                    fill
                    sizes={wide ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
                    className="scale-105 object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </Parallax>
              </div>
              {caption && (
                <figcaption className="text-sm text-muted">{caption}</figcaption>
              )}
            </figure>
          </Reveal>
        );
      })}
    </div>
  );
}
