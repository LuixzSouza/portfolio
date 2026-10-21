import { describe, expect, it } from "vitest";
import { withLocalProjects } from "./mergeProjects";

describe("withLocalProjects", () => {
  it("mantém a versão da API e adiciona só os locais ausentes, na frente", () => {
    const api = [{ nome: "Silver Ocean", from: "api" }];
    const local = [
      { nome: "Silver Ocean", from: "local" },
      { nome: "Sistema UP", from: "local" },
    ];
    expect(withLocalProjects(api, local)).toEqual([
      { nome: "Sistema UP", from: "local" },
      { nome: "Silver Ocean", from: "api" },
    ]);
  });
});
