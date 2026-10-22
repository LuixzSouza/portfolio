"use client";

import { listAllCertificates, createCertificate, updateCertificate, deleteCertificate, reorderCertificates } from "@/lib/api";
import type { Certificate, CertificateInput } from "@/lib/schemas/certificate";
import { EntityManager } from "../EntityManager";
import { Bilingual, Checkbox, Field, ImageField, TagsInput, TextInput } from "../fields";
import { pair } from "../utils";
import type { PreviewData } from "../PreviewCard";

// --- Certificados ---
export function CertificatesManager() {
  return (
    <EntityManager<Certificate, CertificateInput>
      title="Certificados"
      fetchAll={listAllCertificates}
      create={createCertificate}
      update={updateCertificate}
      remove={deleteCertificate}
      reorder={reorderCertificates}
      getId={(c) => c.id}
      rowTitle={(c) => c.course}
      rowSubtitle={(c) => c.issuer}
      isPublished={(c) => c.publicado}
      previewType="certificate"
      emptyInput={{
        course: "", issuer: "", date: "", file: "", image: "",
        descricao: { pt: "", en: "" }, skills: [], publicado: true,
      }}
      toInput={(c) => ({
        course: c.course,
        issuer: c.issuer,
        date: c.date ?? "",
        file: c.file ?? "",
        image: c.image ?? "",
        descricao: pair(c.description),
        skills: c.skills,
        publicado: c.publicado,
      })}
      toPreview={(c): PreviewData => ({
        title: c.course,
        subtitle: c.issuer,
        description: typeof c.description === "string" ? c.description : c.description?.pt || c.description?.en || "",
        image: c.image,
        published: c.publicado,
        tags: c.skills,
        date: c.date,
      })}
      renderForm={(input, set) => (
        <>
          <Field label="Nome do curso/certificação">
            <TextInput
              value={input.course}
              onChange={(course) => set({ course })}
              placeholder="Ex: AWS Academy Cloud Foundations, React Developer..."
            />
          </Field>

          <Field label="Instituição emissora">
            <TextInput
              value={input.issuer ?? ""}
              onChange={(issuer) => set({ issuer })}
              placeholder="Ex: AWS Academy, Rocketseat, Udemy..."
            />
          </Field>

          <Field label="Data de conclusão">
            <TextInput
              value={input.date ?? ""}
              onChange={(date) => set({ date })}
              placeholder="Ex: Janeiro 2024, 15/03/2024..."
            />
          </Field>

          <ImageField
            label="Imagem do certificado"
            value={input.image ?? ""}
            onChange={(image) => set({ image })}
            helpText="Imagem ou screenshot do certificado"
          />

          <Field label="Arquivo PDF (opcional)">
            <TextInput
              value={input.file ?? ""}
              onChange={(file) => set({ file })}
              placeholder="caminho/para/certificado.pdf ou URL"
            />
          </Field>

          <Bilingual
            label="Descrição"
            value={input.descricao ?? { pt: "", en: "" }}
            onChange={(descricao) => set({ descricao })}
            multiline
            placeholder={{
              pt: "Descreva o que aprendeu, duração do curso, principais tópicos...",
              en: "Describe what you learned, course duration, main topics..."
            }}
          />

          <TagsInput
            label="Habilidades aprendidas"
            value={input.skills}
            onChange={(skills) => set({ skills })}
            placeholder="React, AWS, Cloud Computing, JavaScript..."
          />

          <Checkbox
            label="Certificado publicado"
            checked={input.publicado}
            onChange={(publicado) => set({ publicado })}
            helpText="Certificados publicados aparecerão na seção de certificações"
          />
        </>
      )}
    />
  );
}
