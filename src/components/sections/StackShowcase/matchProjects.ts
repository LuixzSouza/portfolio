import type { Projeto } from "@/data/projects";
import type { StackTech } from "@/data/stack";

/** Referência enxuta de projeto p/ os chips da vitrine. */
export interface TechProjectRef {
  id: string;
  nome: string;
}

/**
 * Cruza uma tecnologia com os projetos reais (case-insensitive via `tech.match`).
 * Pura e testável — não depende de React nem da origem dos dados.
 */
export function projectsForTech(
  tech: StackTech,
  all: Projeto[],
  limit = 6,
): TechProjectRef[] {
  const aliases = new Set(tech.match.map((m) => m.toLowerCase()));
  return all
    .filter((p) => p.tecnologias?.some((t) => aliases.has(t.toLowerCase())))
    .slice(0, limit)
    .map((p) => ({ id: p.id, nome: p.nome }));
}
