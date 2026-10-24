import { slugify } from "@/lib/slug";

/** API (editável no painel) + projetos locais que ainda não existem no banco. */
export function withLocalProjects<T extends { nome: string }>(api: T[], local: T[]): T[] {
  const known = new Set(api.map((p) => slugify(p.nome)));
  const missing = local.filter((p) => !known.has(slugify(p.nome)));
  return [...missing, ...api];
}
