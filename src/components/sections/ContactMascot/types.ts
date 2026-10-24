// ============================================================================
// Contrato público do mascote: campos do formulário, status e props.
// ============================================================================

export type ContactField = "nome" | "email" | "mensagem" | null;
export type ContactStatus = "idle" | "loading" | "success" | "error";

export interface ContactMascotProps {
  focused: ContactField;
  nameValue: string;
  emailValue: string;
  status: ContactStatus;
  caption: string;
  hovered: string | null;
}
