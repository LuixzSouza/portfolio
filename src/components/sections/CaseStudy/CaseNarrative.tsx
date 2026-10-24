"use client";

import { Heading } from "@/components/ds/Heading";
import { Text } from "@/components/ds/Text";
import { Reveal } from "@/components/ds/Reveal";

/**
 * Bloco narrativo editorial: rótulo numerado + título + lista de parágrafos ou
 * itens. Reutilizado para Objetivos / Desafio / Solução / Aprendizados.
 */
export function CaseNarrative({
  index,
  label,
  items,
  variant = "prose",
}: {
  index: number;
  label: string;
  items: string[];
  variant?: "prose" | "list";
}) {
  if (!items.length) return null;
  return (
    <Reveal className="grid grid-cols-1 gap-6 border-t border-foreground/10 py-12 md:grid-cols-12 md:gap-10 md:py-16">
      <div className="md:col-span-4">
        <span className="flex items-baseline gap-3 text-eyebrow font-medium uppercase tracking-widest text-muted">
          <span className="text-foreground/40">{String(index).padStart(2, "0")}</span>
          <span className="h-px w-8 bg-foreground/20" aria-hidden />
        </span>
        <Heading as="h2" size="display-sm" className="mt-3">
          {label}
        </Heading>
      </div>

      <div className="md:col-span-8 md:col-start-5">
        {variant === "list" ? (
          <ul className="flex flex-col gap-4">
            {items.map((it, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" aria-hidden />
                <Text tone="muted" size="lg">{it}</Text>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col gap-5">
            {items.map((it, i) => (
              <Text key={i} tone="muted" size="lg">{it}</Text>
            ))}
          </div>
        )}
      </div>
    </Reveal>
  );
}
