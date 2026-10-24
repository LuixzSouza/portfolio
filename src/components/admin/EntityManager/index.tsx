"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Edit3, GripVertical, Grid3X3, List, Plus, Search, Trash2 } from "lucide-react";
import { ApiError } from "@/lib/api";
import { PreviewCard, PreviewGrid, type PreviewData } from "../PreviewCard";
import { useToast } from "../Toast";
import { ConfirmDialog } from "./ConfirmDialog";
import { EditModal } from "./EditModal";
import { ListView } from "./ListView";
import { EmptyView, LoadingView } from "./states";
import type { FilterType, ViewMode } from "./types";

export interface EntityManagerProps<TItem, TInput> {
  title: string;
  fetchAll: () => Promise<TItem[]>;
  create: (input: TInput) => Promise<TItem>;
  update: (id: number, input: TInput) => Promise<TItem>;
  remove: (id: number) => Promise<void>;
  reorder?: (ids: number[]) => Promise<void>;
  getId: (item: TItem) => number;
  rowTitle: (item: TItem) => string;
  rowSubtitle?: (item: TItem) => string;
  isPublished?: (item: TItem) => boolean;
  emptyInput: TInput;
  toInput: (item: TItem) => TInput;
  toPreview: (item: TItem) => PreviewData;
  previewType?: "project" | "certificate" | "testimonial" | "service" | "generic";
  renderForm: (input: TInput, set: (patch: Partial<TInput>) => void) => React.ReactNode;
}

type Editing<TItem> = { mode: "new" } | { mode: "edit"; item: TItem } | null;

export function EntityManager<TItem, TInput>(props: EntityManagerProps<TItem, TInput>) {
  const {
    title, fetchAll, create, update, remove, reorder, getId, rowTitle, rowSubtitle,
    isPublished, emptyInput, toInput, toPreview, previewType = "generic", renderForm,
  } = props;

  // Data state
  const [items, setItems] = useState<TItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Editing<TItem>>(null);
  const [input, setInput] = useState<TInput>(emptyInput);
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState<TItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // UI state
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [query, setQuery] = useState("");

  // Drag-and-drop (reordenação)
  const [dragId, setDragId] = useState<number | null>(null);
  const [overId, setOverId] = useState<number | null>(null);

  const toast = useToast();

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchAll()
      .then(setItems)
      .catch((e: unknown) => setError(e instanceof ApiError ? e.message : "Erro ao carregar dados."))
      .finally(() => setLoading(false));
  }, [fetchAll]);

  useEffect(() => load(), [load]);

  // Filtering
  const q = query.trim().toLowerCase();
  const filteredItems = items.filter((item) => {
    const matchesSearch = !q ||
      `${rowTitle(item)} ${rowSubtitle ? rowSubtitle(item) : ""}`.toLowerCase().includes(q);

    const matchesFilter =
      filterType === "all" ||
      (filterType === "published" && isPublished?.(item)) ||
      (filterType === "draft" && !isPublished?.(item));

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: items.length,
    published: isPublished ? items.filter(isPublished).length : 0,
    draft: isPublished ? items.filter(item => !isPublished(item)).length : 0,
  };

  const openNew = () => {
    setInput(emptyInput);
    setEditing({ mode: "new" });
  };

  const openEdit = (item: TItem) => {
    setInput(toInput(item));
    setEditing({ mode: "edit", item });
  };

  const closeModal = () => {
    setEditing(null);
    setInput(emptyInput);
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.mode === "new") {
        const newItem = await create(input);
        setItems((prev) => [newItem, ...prev]);
      } else {
        const updated = await update(getId(editing.item), input);
        setItems((prev) => prev.map((item) => (getId(item) === getId(editing.item) ? updated : item)));
      }
      closeModal();
      toast.success("Salvo com sucesso.");
    } catch (e: unknown) {
      toast.error(e instanceof ApiError ? e.message : "Erro ao salvar.");
    }
    setSaving(false);
  };

  const confirmDelete = async () => {
    if (!confirming) return;
    setDeleting(true);
    try {
      await remove(getId(confirming));
      setItems((prev) => prev.filter((i) => getId(i) !== getId(confirming)));
      setConfirming(null);
      toast.success("Item excluído.");
    } catch (e: unknown) {
      toast.error(e instanceof ApiError ? e.message : "Erro ao excluir.");
    }
    setDeleting(false);
  };

  // Reordenar só faz sentido sobre a lista completa (sem busca nem filtro), em
  // modo lista. A ordem otimista é gravada via reorder(ids); recarrega no erro.
  const canReorder = Boolean(reorder) && !q && filterType === "all" && viewMode === "list";

  const handleDrop = (targetId: number) => {
    const from = dragId;
    setDragId(null);
    setOverId(null);
    if (from === null || from === targetId || !reorder) return;
    setItems((prev) => {
      const fromIdx = prev.findIndex((it) => getId(it) === from);
      const toIdx = prev.findIndex((it) => getId(it) === targetId);
      if (fromIdx < 0 || toIdx < 0) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      reorder(next.map(getId)).catch((e: unknown) => {
        toast.error(e instanceof ApiError ? e.message : "Erro ao reordenar.");
        load();
      });
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="font-roobert text-2xl font-semibold text-foreground">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span>{stats.total} total</span>
            {isPublished && (
              <>
                <span>•</span>
                <span className="text-green-600">{stats.published} publicados</span>
                <span>•</span>
                <span className="text-orange-600">{stats.draft} rascunhos</span>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={openNew}
          className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
        >
          <Plus className="h-4 w-4" />
          Criar {title.slice(0, -1).toLowerCase()}
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder={`Buscar ${title.toLowerCase()}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-foreground/20 bg-background pl-10 pr-4 py-2.5 text-sm transition-colors focus:border-foreground/40 focus:outline-none"
          />
        </div>

        {/* Filters & View */}
        <div className="flex items-center gap-2">
          {isPublished && (
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as FilterType)}
              className="rounded-xl border border-foreground/20 bg-background px-3 py-2.5 text-sm transition-colors focus:border-foreground/40"
            >
              <option value="all">Todos</option>
              <option value="published">Publicados</option>
              <option value="draft">Rascunhos</option>
            </select>
          )}

          <div className="flex rounded-xl border border-foreground/20 bg-background">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-2.5 rounded-l-xl transition-colors ${
                viewMode === "grid" ? "bg-foreground text-background" : "text-muted hover:text-foreground"
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-2.5 rounded-r-xl transition-colors ${
                viewMode === "list" ? "bg-foreground text-background" : "text-muted hover:text-foreground"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-red-500/30 bg-red-500/10 p-4"
        >
          <p className="text-sm text-red-500">{error}</p>
          <button
            type="button"
            onClick={() => setError(null)}
            className="mt-2 text-xs text-red-500/70 hover:text-red-500"
          >
            Dispensar
          </button>
        </motion.div>
      )}

      {/* Dica de reordenação */}
      {canReorder && filteredItems.length > 1 && (
        <p className="flex items-center gap-1.5 text-xs text-muted">
          <GripVertical className="h-3.5 w-3.5" />
          Arraste pelo ícone para reordenar — a ordem é salva automaticamente.
        </p>
      )}
      {reorder && viewMode === "grid" && !query && filterType === "all" && (
        <p className="text-xs text-muted">
          Dica: troque para a visualização em lista para reordenar arrastando.
        </p>
      )}

      {/* Content */}
      {loading ? (
        <LoadingView viewMode={viewMode} />
      ) : filteredItems.length === 0 ? (
        <EmptyView
          title={title}
          hasQuery={!!query}
          onCreate={openNew}
        />
      ) : viewMode === "grid" ? (
        <PreviewGrid>
          {filteredItems.map((item) => (
            <div key={getId(item)} className="relative group">
              <PreviewCard
                data={toPreview(item)}
                type={previewType}
              />
              {/* Actions Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  className="flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-white"
                >
                  <Edit3 className="h-4 w-4" />
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(item)}
                  className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </PreviewGrid>
      ) : (
        <ListView
          items={filteredItems}
          getId={getId}
          rowTitle={rowTitle}
          rowSubtitle={rowSubtitle}
          isPublished={isPublished}
          onEdit={openEdit}
          onDelete={setConfirming}
          canReorder={canReorder}
          dragId={dragId}
          overId={overId}
          onDragStart={setDragId}
          onDragOver={setOverId}
          onDrop={handleDrop}
          onDragEnd={() => {
            setDragId(null);
            setOverId(null);
          }}
        />
      )}

      {/* Modal */}
      <AnimatePresence>
        {editing && (
          <EditModal
            title={editing.mode === "new" ? `Criar ${title.slice(0, -1)}` : `Editar ${title.slice(0, -1)}`}
            input={input}
            setInput={setInput}
            onSave={handleSave}
            onClose={closeModal}
            saving={saving}
            renderForm={renderForm}
          />
        )}
      </AnimatePresence>

      {/* Confirmação de exclusão */}
      <AnimatePresence>
        {confirming && (
          <ConfirmDialog
            itemName={rowTitle(confirming)}
            deleting={deleting}
            onConfirm={confirmDelete}
            onCancel={() => !deleting && setConfirming(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
