"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Trash2 } from "lucide-react";

export function ConfirmDialog({
  itemName,
  deleting,
  onConfirm,
  onCancel,
}: {
  itemName: string;
  deleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        role="alertdialog"
        aria-modal="true"
        className="w-full max-w-md overflow-hidden rounded-2xl border border-foreground/15 bg-background shadow-2xl"
      >
        <div className="flex flex-col items-center gap-4 p-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-roobert text-lg font-semibold text-foreground">
              Excluir item?
            </h3>
            <p className="text-sm text-muted">
              Você está prestes a excluir{" "}
              <span className="font-medium text-foreground">“{itemName}”</span>. Esta ação não pode
              ser desfeita.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-foreground/10 p-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-xl border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-60"
          >
            {deleting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            {deleting ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
