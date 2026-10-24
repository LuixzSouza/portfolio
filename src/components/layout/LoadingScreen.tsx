"use client";

import { BrandMark } from "@/components/layout/BrandMark";
import { useTranslations } from "@/content/useTranslations";

/**
 * Tela de carregamento (fallback de navegação). Client component para que o
 * aria-label venha do dicionário do idioma ativo — `loading.tsx` é server
 * component e, no export estático, não tem acesso ao locale.
 */
export function LoadingScreen() {
  const t = useTranslations();
  return (
    <div
      role="status"
      aria-label={t.a11y.loading}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-background"
    >
      <BrandMark className="text-4xl text-foreground motion-safe:[animation:blink_2.4s_ease-in-out_infinite] md:text-5xl" />

      {/* Barra indeterminada: trilho sutil + banda que varre seguindo o tema. */}
      <div className="h-px w-40 overflow-hidden rounded-full bg-foreground/15">
        <div className="h-full w-full origin-left bg-foreground motion-safe:animate-loadbar" />
      </div>
    </div>
  );
}
