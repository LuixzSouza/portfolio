"use client";

import { listAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, reorderTestimonials } from "@/lib/api";
import type { Testimonial, TestimonialInput } from "@/lib/schemas/testimonial";
import { EntityManager } from "../EntityManager";
import { Bilingual, Checkbox, Field, ImageField, TextInput } from "../fields";
import { pair } from "../utils";
import type { PreviewData } from "../PreviewCard";

// --- Depoimentos ---
export function TestimonialsManager() {
  return (
    <EntityManager<Testimonial, TestimonialInput>
      title="Depoimentos"
      fetchAll={listAllTestimonials}
      create={createTestimonial}
      update={updateTestimonial}
      remove={deleteTestimonial}
      reorder={reorderTestimonials}
      getId={(t) => t.id}
      rowTitle={(t) => t.name}
      rowSubtitle={(t) => typeof t.role === "string" ? t.role : t.role?.pt || t.role?.en || ""}
      isPublished={(t) => t.publicado}
      previewType="testimonial"
      emptyInput={{
        name: "", role: { pt: "", en: "" }, image: "",
        quote: { pt: "", en: "" }, publicado: true,
      }}
      toInput={(t) => ({
        name: t.name,
        role: pair(t.role),
        image: t.image ?? "",
        quote: pair(t.quote),
        publicado: t.publicado,
      })}
      toPreview={(t): PreviewData => ({
        title: t.name,
        subtitle: typeof t.role === "string" ? t.role : t.role?.pt || t.role?.en || "",
        description: typeof t.quote === "string" ? t.quote : t.quote?.pt || t.quote?.en || "",
        image: t.image,
        published: t.publicado,
        tags: ["depoimento"],
      })}
      renderForm={(input, set) => (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome da pessoa">
              <TextInput
                value={input.name}
                onChange={(name) => set({ name })}
                placeholder="Ex: João Silva, Maria Santos..."
              />
            </Field>

            <Bilingual
              label="Cargo/Função"
              value={input.role ?? { pt: "", en: "" }}
              onChange={(role) => set({ role })}
              placeholder={{
                pt: "Ex: CEO da Empresa X, Gerente de TI...",
                en: "Ex: Company X CEO, IT Manager..."
              }}
            />
          </div>

          <ImageField
            label="Foto da pessoa"
            value={input.image ?? ""}
            onChange={(image) => set({ image })}
            helpText="Foto da pessoa que deu o depoimento (opcional)"
          />

          <Bilingual
            label="Depoimento"
            value={input.quote ?? { pt: "", en: "" }}
            onChange={(quote) => set({ quote })}
            multiline
            placeholder={{
              pt: "Escreva o depoimento em português...",
              en: "Write the testimonial in English..."
            }}
          />


          <Checkbox
            label="Depoimento publicado"
            checked={input.publicado}
            onChange={(publicado) => set({ publicado })}
            helpText="Depoimentos publicados aparecerão na seção de feedback"
          />
        </>
      )}
    />
  );
}
