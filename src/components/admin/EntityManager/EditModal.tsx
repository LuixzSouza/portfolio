"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { AdminLangProvider, AdminLangTabs } from "../fields";

export function EditModal<TInput>({
  title,
  input,
  setInput,
  onSave,
  onClose,
  saving,
  renderForm,
}: {
  title: string;
  input: TInput;
  setInput: (input: TInput) => void;
  onSave: () => void;
  onClose: () => void;
  saving: boolean;
  renderForm: (input: TInput, set: (patch: Partial<TInput>) => void) => React.ReactNode;
}) {
  const set = (patch: Partial<TInput>) => setInput({ ...input, ...patch });

  const formRef = useRef<HTMLDivElement>(null);
  // Snapshot do input ao abrir — base para detectar alterações não salvas.
  const initialRef = useRef(JSON.stringify(input));
  const isDirty = JSON.stringify(input) !== initialRef.current;

  // Fecha com guarda de alterações não salvas.
  const requestClose = useCallback(() => {
    if (saving) return;
    if (isDirty && !window.confirm("Descartar as alterações não salvas?")) return;
    onClose();
  }, [saving, isDirty, onClose]);

  // Trava o scroll do fundo e fecha no Escape enquanto o modal está aberto.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [requestClose]);

  // Foca o primeiro campo ao abrir.
  useEffect(() => {
    const el = formRef.current?.querySelector<HTMLElement>("input, textarea, select");
    el?.focus();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && requestClose()}
    >
      <AdminLangProvider>
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-2xl max-h-[90vh] overflow-hidden bg-background rounded-2xl border border-foreground/20 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-4 border-b border-foreground/10 p-6">
            <h3 className="font-roobert text-lg font-semibold text-foreground">
              {title}
            </h3>
            <div className="flex items-center gap-3">
              <AdminLangTabs />
              <button
                type="button"
                onClick={requestClose}
                aria-label="Fechar"
                className="rounded-lg p-2 text-muted transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div ref={formRef} className="max-h-[60vh] overflow-y-auto p-6 space-y-6">
            {renderForm(input, set)}
          </div>

          {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-foreground/10 p-6">
          <span className="text-xs text-muted">
            {isDirty ? "Alterações não salvas" : ""}
          </span>
          <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={requestClose}
            disabled={saving}
            className="rounded-xl border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
          >
            {saving && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-background/20 border-t-background" />
            )}
            Salvar
          </button>
          </div>
          </div>
        </motion.div>
      </AdminLangProvider>
    </motion.div>
  );
}
