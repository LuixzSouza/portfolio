import { describe, it, expect } from "vitest";
import { projectsForTech } from "./matchProjects";
import type { StackTech } from "@/data/stack";
import type { Projeto } from "@/data/projects";

const tech = (match: string[]): StackTech =>
  ({ slug: "x", name: "X", logo: "", accent: "0 0 0", kind: "", tagline: "", pitch: "", match }) as StackTech;

const proj = (id: string, tecnologias: string[]): Projeto =>
  ({ id, nome: id, tecnologias } as Projeto);

describe("projectsForTech", () => {
  const all = [
    proj("a", ["Next.js", "React"]),
    proj("b", ["react", "Node"]),
    proj("c", ["PHP", "MySQL"]),
  ];

  it("casa aliases case-insensitive", () => {
    const out = projectsForTech(tech(["React", "React.js"]), all);
    expect(out.map((p) => p.id)).toEqual(["a", "b"]);
  });

  it("respeita o limite", () => {
    const many = Array.from({ length: 10 }, (_, i) => proj(String(i), ["React"]));
    expect(projectsForTech(tech(["React"]), many, 3)).toHaveLength(3);
  });

  it("retorna vazio quando nenhuma tech casa", () => {
    expect(projectsForTech(tech(["Rust"]), all)).toEqual([]);
  });

  it("tolera projeto sem tecnologias", () => {
    const out = projectsForTech(tech(["React"]), [proj("z", undefined as unknown as string[])]);
    expect(out).toEqual([]);
  });
});
