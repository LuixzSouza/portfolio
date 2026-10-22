"use client";

import { listAllMilestones, createMilestone, updateMilestone, deleteMilestone, reorderMilestones } from "@/lib/api";
import type { Milestone, MilestoneInput } from "@/lib/schemas/milestone";
import { EntityManager } from "../EntityManager";
import { Bilingual, Checkbox, TagsInput } from "../fields";
import { pair } from "../utils";
import type { PreviewData } from "../PreviewCard";

// --- Trajetória ---
export function MilestonesManager() {
  return (
    <EntityManager<Milestone, MilestoneInput>
      title="Trajetória"
      fetchAll={listAllMilestones}
      create={createMilestone}
      update={updateMilestone}
      remove={deleteMilestone}
      reorder={reorderMilestones}
      getId={(m) => m.id}
      rowTitle={(m) => pair(m.year).pt || "(sem ano)"}
      rowSubtitle={(m) => pair(m.title).pt}
      isPublished={(m) => m.publicado}
      previewType="generic"
      emptyInput={{
        year: { pt: "", en: "" },
        title: { pt: "", en: "" },
        desc: { pt: "", en: "" },
        techs: [],
        publicado: true,
      }}
      toInput={(m) => ({
        year: pair(m.year),
        title: pair(m.title),
        desc: pair(m.desc),
        techs: m.techs,
        publicado: m.publicado,
      })}
      toPreview={(m): PreviewData => ({
        title: typeof m.title === "string" ? m.title : m.title?.pt || m.title?.en || "Sem título",
        subtitle: typeof m.year === "string" ? m.year : m.year?.pt || m.year?.en || "",
        description: typeof m.desc === "string" ? m.desc : m.desc?.pt || m.desc?.en || "",
        published: m.publicado,
        tags: ["timeline", ...m.techs],
        date: typeof m.year === "string" ? m.year : m.year?.pt || m.year?.en || "",
      })}
      renderForm={(input, set) => (
        <>
          <Bilingual
            label="Ano / marco"
            value={input.year}
            onChange={(year) => set({ year })}
            placeholder={{
              pt: "Ex: 2020, 2020-2021, Presente...",
              en: "Ex: 2020, 2020-2021, Present..."
            }}
          />

          <Bilingual
            label="Título / evento"
            value={input.title ?? { pt: "", en: "" }}
            onChange={(title) => set({ title })}
            placeholder={{
              pt: "Ex: Primeiro emprego, Formatura...",
              en: "Ex: First job, Graduation..."
            }}
          />

          <Bilingual
            label="Descrição"
            value={input.desc ?? { pt: "", en: "" }}
            onChange={(desc) => set({ desc })}
            multiline
            placeholder={{
              pt: "Conte mais sobre este momento da sua trajetória...",
              en: "Tell more about this moment in your journey..."
            }}
          />

          <TagsInput
            label="Tecnologias / habilidades"
            value={input.techs}
            onChange={(techs) => set({ techs })}
            placeholder="React, JavaScript, Design..."
          />

          <Checkbox
            label="Marco publicado"
            checked={input.publicado}
            onChange={(publicado) => set({ publicado })}
            helpText="Marcos publicados aparecerão na timeline do site"
          />
        </>
      )}
    />
  );
}
