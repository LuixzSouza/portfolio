"use client";

import { Plus, Search } from "lucide-react";
import { PreviewGrid } from "../PreviewCard";
import type { ViewMode } from "./types";

export function LoadingView({ viewMode }: { viewMode: ViewMode }) {
  if (viewMode === "grid") {
    return (
      <PreviewGrid>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-video rounded-2xl border border-foreground/10 bg-surface animate-pulse" />
        ))}
      </PreviewGrid>
    );
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-16 rounded-xl border border-foreground/10 bg-surface animate-pulse" />
      ))}
    </div>
  );
}

export function EmptyView({ title, hasQuery, onCreate }: {
  title: string;
  hasQuery: boolean;
  onCreate: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-foreground/10 p-3 mb-4">
        {hasQuery ? (
          <Search className="h-6 w-6 text-muted" />
        ) : (
          <Plus className="h-6 w-6 text-muted" />
        )}
      </div>
      <h3 className="font-roobert font-semibold text-foreground mb-2">
        {hasQuery ? "Nenhum resultado encontrado" : `Nenhum ${title.toLowerCase().slice(0, -1)} ainda`}
      </h3>
      <p className="text-sm text-muted mb-6 max-w-md">
        {hasQuery
          ? "Tente ajustar sua busca ou filtros para encontrar o que procura."
          : `Comece criando seu primeiro ${title.toLowerCase().slice(0, -1)} para vê-lo aparecer aqui.`
        }
      </p>
      {!hasQuery && (
        <button
          type="button"
          onClick={onCreate}
          className="flex items-center gap-2 rounded-xl bg-foreground text-background px-4 py-2 text-sm font-medium transition-colors hover:bg-foreground/90"
        >
          <Plus className="h-4 w-4" />
          Criar {title.toLowerCase().slice(0, -1)}
        </button>
      )}
    </div>
  );
}
