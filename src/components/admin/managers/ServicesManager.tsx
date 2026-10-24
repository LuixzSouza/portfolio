"use client";

import { listAllServices, createService, updateService, deleteService, reorderServices } from "@/lib/api";
import type { Service, ServiceInput } from "@/lib/schemas/service";
import { EntityManager } from "../EntityManager";
import { Bilingual, Checkbox, Field, ImageField, TagsInput, TextInput } from "../fields";
import { pair } from "../utils";
import type { PreviewData } from "../PreviewCard";
import { Plus, Trash2 } from "lucide-react";

// --- Serviços ---
export function ServicesManager() {
  return (
    <EntityManager<Service, ServiceInput>
      title="Serviços"
      fetchAll={listAllServices}
      create={createService}
      update={updateService}
      remove={deleteService}
      reorder={reorderServices}
      getId={(s) => s.id}
      rowTitle={(s) => pair(s.title).pt || s.slug}
      rowSubtitle={(s) => `/${s.slug} • ${s.tags.join(", ")}`}
      isPublished={(s) => s.publicado}
      previewType="service"
      emptyInput={{
        n: "", image: "", accent: "#6366f1",
        title: { pt: "", en: "" },
        tagline: { pt: "", en: "" },
        intro: { pt: "", en: "" },
        forWho: { pt: "", en: "" },
        process: [],
        includes: [],
        tags: [],
        metaTitle: { pt: "", en: "" },
        metaDescription: { pt: "", en: "" },
        publicado: true,
      }}
      toInput={(s) => ({
        n: s.n ?? "",
        image: s.image ?? "",
        accent: s.accent ?? "#6366f1",
        title: pair(s.title),
        tagline: pair(s.tagline),
        intro: pair(s.intro),
        forWho: pair(s.forWho),
        process: s.process.map((p) => ({ title: pair(p.title), desc: pair(p.desc) })),
        includes: s.includes.map((it) => pair(it)),
        tags: s.tags,
        metaTitle: pair(s.metaTitle),
        metaDescription: pair(s.metaDescription),
        publicado: s.publicado,
      })}
      toPreview={(s): PreviewData => ({
        title: typeof s.title === "string" ? s.title : s.title?.pt || s.title?.en || "Serviço",
        subtitle: typeof s.tagline === "string" ? s.tagline : s.tagline?.pt || s.tagline?.en || "",
        description: typeof s.intro === "string" ? s.intro : s.intro?.pt || s.intro?.en || "",
        image: s.image,
        published: s.publicado,
        tags: s.tags,
        url: `/services/${s.slug}`,
      })}
      renderForm={(input, set) => {
        const process = input.process;
        const includes = input.includes;

        return (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Número (ex.: 01)">
                <TextInput
                  value={input.n ?? ""}
                  onChange={(n) => set({ n })}
                  placeholder="01"
                />
              </Field>
              <Field label="Cor de destaque">
                <TextInput
                  value={input.accent ?? ""}
                  onChange={(accent) => set({ accent })}
                  placeholder="#6366f1"
                />
              </Field>
            </div>

            <ImageField
              label="Imagem do serviço"
              value={input.image ?? ""}
              onChange={(image) => set({ image })}
              helpText="Imagem representativa do serviço"
            />

            <Bilingual
              label="Título do serviço"
              value={input.title}
              onChange={(title) => set({ title })}
              placeholder={{
                pt: "Ex: Criação de Sites",
                en: "Ex: Website Creation"
              }}
            />

            <Bilingual
              label="Tagline / slogan"
              value={input.tagline ?? { pt: "", en: "" }}
              onChange={(tagline) => set({ tagline })}
              placeholder={{
                pt: "Ex: Sites profissionais que convertem",
                en: "Ex: Professional websites that convert"
              }}
            />

            <Bilingual
              label="Introdução"
              value={input.intro ?? { pt: "", en: "" }}
              onChange={(intro) => set({ intro })}
              multiline
              placeholder={{
                pt: "Descreva o serviço e seus benefícios...",
                en: "Describe the service and its benefits..."
              }}
            />

            <Bilingual
              label="Para quem é este serviço"
              value={input.forWho ?? { pt: "", en: "" }}
              onChange={(forWho) => set({ forWho })}
              multiline
              placeholder={{
                pt: "Ex: Ideal para empresas que querem...",
                en: "Ex: Ideal for companies that want..."
              }}
            />

            {/* Processo */}
            <div className="space-y-4 rounded-2xl border border-foreground/10 p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold uppercase tracking-widest text-muted">
                  Processo (etapas do trabalho)
                </h4>
                <button
                  type="button"
                  onClick={() => set({
                    process: [...process, { title: { pt: "", en: "" }, desc: { pt: "", en: "" } }]
                  })}
                  className="flex items-center gap-2 rounded-xl border border-foreground/15 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-foreground/5"
                >
                  <Plus className="h-3 w-3" /> Adicionar etapa
                </button>
              </div>

              <div className="space-y-4">
                {process.map((step, i) => (
                  <div key={i} className="rounded-xl border border-foreground/10 bg-surface p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted">Etapa {i + 1}</span>
                      <button
                        type="button"
                        onClick={() => set({ process: process.filter((_, idx) => idx !== i) })}
                        className="rounded-lg p-1.5 text-muted transition-colors hover:bg-red-500/10 hover:text-red-500"
                        aria-label="Remover etapa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <Bilingual
                      label="Título da etapa"
                      value={step.title}
                      onChange={(title) => set({ process: process.map((p, idx) => (idx === i ? { ...p, title } : p)) })}
                      placeholder={{
                        pt: "Ex: Análise e planejamento",
                        en: "Ex: Analysis and planning"
                      }}
                    />
                    <Bilingual
                      label="Descrição da etapa"
                      value={step.desc}
                      onChange={(desc) => set({ process: process.map((p, idx) => (idx === i ? { ...p, desc } : p)) })}
                      multiline
                      placeholder={{
                        pt: "O que acontece nesta etapa...",
                        en: "What happens in this step..."
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* O que inclui */}
            <div className="space-y-4 rounded-2xl border border-foreground/10 p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold uppercase tracking-widest text-muted">
                  O que inclui
                </h4>
                <button
                  type="button"
                  onClick={() => set({ includes: [...includes, { pt: "", en: "" }] })}
                  className="flex items-center gap-2 rounded-xl border border-foreground/15 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-foreground/5"
                >
                  <Plus className="h-3 w-3" /> Adicionar item
                </button>
              </div>

              <div className="space-y-3">
                {includes.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-foreground/10 bg-surface p-3">
                    <div className="flex-1">
                      <Bilingual
                        label={`Item ${i + 1}`}
                        value={item}
                        onChange={(v) => set({ includes: includes.map((it, idx) => (idx === i ? v : it)) })}
                        placeholder={{
                          pt: "Ex: Design responsivo",
                          en: "Ex: Responsive design"
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => set({ includes: includes.filter((_, idx) => idx !== i) })}
                      className="rounded-lg p-2 text-muted transition-colors hover:bg-red-500/10 hover:text-red-500"
                      aria-label="Remover item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <TagsInput
              label="Tags do serviço"
              value={input.tags}
              onChange={(tags) => set({ tags })}
              placeholder="desenvolvimento, design, e-commerce..."
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Bilingual
                label="Meta título (SEO)"
                value={input.metaTitle ?? { pt: "", en: "" }}
                onChange={(metaTitle) => set({ metaTitle })}
                placeholder={{
                  pt: "Título para aparecer no Google",
                  en: "Title to appear on Google"
                }}
              />
              <Bilingual
                label="Meta descrição (SEO)"
                value={input.metaDescription ?? { pt: "", en: "" }}
                onChange={(metaDescription) => set({ metaDescription })}
                multiline
                placeholder={{
                  pt: "Descrição para aparecer no Google",
                  en: "Description to appear on Google"
                }}
              />
            </div>

            <Checkbox
              label="Serviço publicado"
              checked={input.publicado}
              onChange={(publicado) => set({ publicado })}
              helpText="Serviços publicados aparecerão na página de serviços"
            />
          </>
        );
      }}
    />
  );
}
