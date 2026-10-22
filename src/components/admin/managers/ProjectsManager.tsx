"use client";

import { listAllProjects, createProject, updateProject, deleteProject, reorderProjects } from "@/lib/api";
import type { Project, ProjectInput } from "@/lib/schemas/project";
import { EntityManager } from "../EntityManager";
import { Bilingual, Checkbox, Field, ImageField, TagsInput, TextInput } from "../fields";
import { pair } from "../utils";
import type { PreviewData } from "../PreviewCard";

// --- Projetos ---
export function ProjectsManager() {
  return (
    <EntityManager<Project, ProjectInput>
      title="Projetos"
      fetchAll={listAllProjects}
      create={createProject}
      update={updateProject}
      remove={deleteProject}
      reorder={reorderProjects}
      getId={(p) => p.id}
      rowTitle={(p) => p.nome}
      rowSubtitle={(p) => p.tecnologias.join(", ")}
      isPublished={(p) => p.publicado}
      previewType="project"
      emptyInput={{
        nome: "", imagem: "", tecnologias: [],
        links: { linkedin: "", github: "", verProjeto: "" },
        descricao: { pt: "", en: "" }, data: { pt: "", en: "" }, publicado: true,
      }}
      toInput={(p) => ({
        nome: p.nome,
        imagem: p.imagem ?? "",
        tecnologias: p.tecnologias,
        links: {
          linkedin: p.links.linkedin ?? "",
          github: p.links.github ?? "",
          verProjeto: p.links.verProjeto ?? "",
        },
        descricao: pair(p.descricao),
        data: pair(p.data),
        publicado: p.publicado,
      })}
      toPreview={(p): PreviewData => ({
        title: p.nome,
        subtitle: p.tecnologias.join(", "),
        description: typeof p.descricao === "string" ? p.descricao : p.descricao?.pt || p.descricao?.en || "",
        image: p.imagem,
        published: p.publicado,
        url: p.links.verProjeto,
        tags: p.tecnologias,
        date: typeof p.data === "string" ? p.data : p.data?.pt || p.data?.en || "",
      })}
      renderForm={(input, set) => (
        <>
          <Field label="Nome do projeto">
            <TextInput
              value={input.nome}
              onChange={(nome) => set({ nome })}
              placeholder="Ex: Casa Pronta, Portfolio Pessoal..."
            />
          </Field>

          <ImageField
            label="Imagem do projeto"
            value={input.imagem ?? ""}
            onChange={(imagem) => set({ imagem })}
            helpText="Imagem principal que representa o projeto (recomendado: 1200x800px)"
          />

          <TagsInput
            label="Tecnologias utilizadas"
            value={input.tecnologias}
            onChange={(tecnologias) => set({ tecnologias })}
            placeholder="React, TypeScript, Node.js..."
          />

          <Bilingual
            label="Descrição"
            value={input.descricao ?? { pt: "", en: "" }}
            onChange={(descricao) => set({ descricao })}
            multiline
            placeholder={{
              pt: "Descreva o projeto, seus objetivos e características...",
              en: "Describe the project, its goals and features..."
            }}
          />

          <Bilingual
            label="Data/Período"
            value={input.data ?? { pt: "", en: "" }}
            onChange={(data) => set({ data })}
            placeholder={{
              pt: "Ex: Janeiro 2024, 2023-2024, Em desenvolvimento...",
              en: "Ex: January 2024, 2023-2024, In development..."
            }}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="LinkedIn (post sobre o projeto)">
              <TextInput
                value={input.links.linkedin ?? ""}
                onChange={(v) => set({ links: { ...input.links, linkedin: v } })}
                placeholder="https://linkedin.com/posts/..."
              />
            </Field>

            <Field label="GitHub (repositório)">
              <TextInput
                value={input.links.github ?? ""}
                onChange={(v) => set({ links: { ...input.links, github: v } })}
                placeholder="https://github.com/usuario/projeto"
              />
            </Field>
          </div>

          <Field label="URL do projeto (para visualização)">
            <TextInput
              value={input.links.verProjeto ?? ""}
              onChange={(v) => set({ links: { ...input.links, verProjeto: v } })}
              placeholder="https://meusite.com.br"
            />
          </Field>

          <Checkbox
            label="Projeto publicado"
            checked={input.publicado}
            onChange={(publicado) => set({ publicado })}
            helpText="Projetos publicados aparecerão no portfólio público"
          />
        </>
      )}
    />
  );
}
