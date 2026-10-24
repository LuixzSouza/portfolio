"use client";

import { motion } from "framer-motion";
import { Edit3, Eye, EyeOff, GripVertical, Trash2 } from "lucide-react";

export function ListView<TItem>({
  items,
  getId,
  rowTitle,
  rowSubtitle,
  isPublished,
  onEdit,
  onDelete,
  canReorder = false,
  dragId = null,
  overId = null,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: {
  items: TItem[];
  getId: (item: TItem) => number;
  rowTitle: (item: TItem) => string;
  rowSubtitle?: (item: TItem) => string;
  isPublished?: (item: TItem) => boolean;
  onEdit: (item: TItem) => void;
  onDelete: (item: TItem) => void;
  canReorder?: boolean;
  dragId?: number | null;
  overId?: number | null;
  onDragStart?: (id: number) => void;
  onDragOver?: (id: number) => void;
  onDrop?: (id: number) => void;
  onDragEnd?: () => void;
}) {
  return (
    <div className="space-y-2">
      {items.map((item) => {
        const published = isPublished?.(item);
        const id = getId(item);
        return (
          <motion.div
            key={id}
            layout
            onDragOver={canReorder ? (e) => { e.preventDefault(); onDragOver?.(id); } : undefined}
            onDrop={canReorder ? (e) => { e.preventDefault(); onDrop?.(id); } : undefined}
            className={`group flex items-center gap-4 rounded-xl border bg-surface p-4 transition-colors hover:border-foreground/20 ${
              dragId === id ? "border-foreground/20 opacity-40" : "border-foreground/10"
            } ${overId === id && dragId !== id ? "ring-2 ring-inset ring-foreground/30" : ""}`}
          >
            {canReorder && (
              <span
                draggable
                onDragStart={(e) => { e.dataTransfer.effectAllowed = "move"; onDragStart?.(id); }}
                onDragEnd={() => onDragEnd?.()}
                aria-label="Arrastar para reordenar"
                className="-ml-1 shrink-0 cursor-grab rounded-lg p-1 text-muted transition-colors hover:bg-foreground/5 hover:text-foreground active:cursor-grabbing"
              >
                <GripVertical className="h-4 w-4" />
              </span>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-foreground truncate">
                  {rowTitle(item)}
                </h3>
                {isPublished && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      published
                        ? "bg-green-500/10 text-green-600"
                        : "bg-orange-500/10 text-orange-600"
                    }`}
                  >
                    {published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    {published ? "Publicado" : "Rascunho"}
                  </span>
                )}
              </div>
              {rowSubtitle && (
                <p className="text-sm text-muted truncate">
                  {rowSubtitle(item)}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => onEdit(item)}
                className="flex items-center gap-1 rounded-lg border border-foreground/20 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-foreground/5"
              >
                <Edit3 className="h-3 w-3" />
                Editar
              </button>
              <button
                type="button"
                onClick={() => onDelete(item)}
                className="flex items-center gap-1 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-500/10"
              >
                <Trash2 className="h-3 w-3" />
                Excluir
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
