"use client";

import { listSkillGroups, createSkillGroup, updateSkillGroup, deleteSkillGroup, reorderSkillGroups } from "@/lib/api";
import type { SkillGroup, SkillGroupInput } from "@/lib/schemas/skill";
import { EntityManager } from "../EntityManager";
import { Bilingual, Select, TextInput } from "../fields";
import { pair } from "../utils";
import type { PreviewData } from "../PreviewCard";
import { Plus, Trash2 } from "lucide-react";

// --- Skills ---
export function SkillsManager() {
  return (
    <EntityManager<SkillGroup, SkillGroupInput>
      title="Skills"
      fetchAll={listSkillGroups}
      create={createSkillGroup}
      update={updateSkillGroup}
      remove={deleteSkillGroup}
      reorder={reorderSkillGroups}
      getId={(g) => g.id}
      rowTitle={(g) => pair(g.category).pt || "(sem categoria)"}
      rowSubtitle={(g) => g.skills.map((s) => `${s.name} (${s.level}/5)`).join(", ")}
      previewType="generic"
      emptyInput={{
        category: { pt: "", en: "" },
        skills: [{ name: "", level: 3 }]
      }}
      toInput={(g) => ({
        category: pair(g.category),
        skills: g.skills.map((s) => ({ name: s.name, level: s.level })),
      })}
      toPreview={(g): PreviewData => ({
        title: typeof g.category === "string" ? g.category : g.category?.pt || g.category?.en || "Skills",
        subtitle: `${g.skills.length} habilidades`,
        description: g.skills
          .slice(0, 3)
          .map(s => `${s.name} (${"★".repeat(s.level)}${"☆".repeat(5 - s.level)})`)
          .join(" • "),
        published: true,
        tags: ["skills", ...g.skills.map(s => s.name)],
      })}
      renderForm={(input, set) => {
        const skills = input.skills;
        const updateSkill = (i: number, patch: Partial<(typeof skills)[number]>) =>
          set({ skills: skills.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) });

        return (
          <>
            <Bilingual
              label="Categoria das skills"
              value={input.category}
              onChange={(category) => set({ category })}
              placeholder={{
                pt: "Ex: Frontend, Backend, Design...",
                en: "Ex: Frontend, Backend, Design..."
              }}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold uppercase tracking-widest text-muted">
                  Skills (nível 1–5)
                </label>
                <button
                  type="button"
                  onClick={() => set({ skills: [...skills, { name: "", level: 3 }] })}
                  className="flex items-center gap-2 rounded-xl border border-foreground/15 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-foreground/5"
                >
                  <Plus className="h-3 w-3" /> Adicionar skill
                </button>
              </div>

              <div className="space-y-3">
                {skills.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-foreground/10 bg-surface p-3">
                    <div className="flex-1">
                      <TextInput
                        value={s.name}
                        onChange={(name) => updateSkill(i, { name })}
                        placeholder="Nome da skill"
                      />
                    </div>
                    <div className="w-32">
                      <Select
                        value={s.level}
                        onChange={(level) => updateSkill(i, { level })}
                        options={[
                          { value: 1, label: "1 - Básico" },
                          { value: 2, label: "2 - Iniciante" },
                          { value: 3, label: "3 - Intermediário" },
                          { value: 4, label: "4 - Avançado" },
                          { value: 5, label: "5 - Expert" },
                        ]}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => set({ skills: skills.filter((_, idx) => idx !== i) })}
                      className="rounded-lg p-2 text-muted transition-colors hover:bg-red-500/10 hover:text-red-500"
                      aria-label="Remover skill"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {skills.length === 0 && (
                <div className="text-center py-6 text-muted">
                  <p className="text-sm">Nenhuma skill adicionada ainda.</p>
                  <button
                    type="button"
                    onClick={() => set({ skills: [{ name: "", level: 3 }] })}
                    className="mt-2 text-sm text-foreground hover:underline"
                  >
                    Adicionar a primeira skill
                  </button>
                </div>
              )}
            </div>
          </>
        );
      }}
    />
  );
}
