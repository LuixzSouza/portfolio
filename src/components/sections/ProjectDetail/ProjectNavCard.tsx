"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Projeto } from "@/data/projects";
import { slugify } from "@/lib/slug";
import { useLocalizedHref } from "@/lib/useLocale";

export function ProjectNavCard({
  project,
  direction,
  label,
}: {
  project: Projeto;
  direction: "prev" | "next";
  label: string;
}) {
  const isPrev = direction === "prev";
  const loc = useLocalizedHref();
  return (
    <Link
      href={loc(`/project?id=${slugify(project.nome)}`)}
      className={`group flex items-center gap-5 rounded-2xl border border-foreground/10 p-5 transition-colors duration-300 hover:border-foreground/30 hover:bg-foreground/[0.03] ${
        isPrev ? "" : "sm:flex-row-reverse sm:text-right"
      }`}
    >
      {project.imagem && (
        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-2">
          <Image
            src={project.imagem}
            alt={project.nome}
            fill
            sizes="80px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className={`flex flex-1 flex-col gap-1 ${isPrev ? "" : "sm:items-end"}`}>
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted">
          {isPrev && <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />}
          {label}
          {!isPrev && <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />}
        </span>
        <span className="font-roobert text-lg font-medium">{project.nome}</span>
      </div>
    </Link>
  );
}
