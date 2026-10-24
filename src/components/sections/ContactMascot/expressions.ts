// ============================================================================
// Vocabulário de expressões faciais do mascote — tabelas de paths SVG e o
// tipo de blend de emoção. É dado puro (nenhuma lógica de runtime).
// ============================================================================

export type Expression =
  | "idle"
  | "nome"
  | "email"
  | "mensagem"
  | "success"
  | "error"
  | "curious"
  | "surprised"
  | "sleep"
  | "typing"
  | "confused"
  | "hyper";

export const MOUTH: Record<Expression, string> = {
  idle: "M46 80 Q60 87 74 80",
  nome: "M46 80 Q60 91 74 80",
  email: "M48 80 Q60 85 72 80",
  mensagem: "M50 82 Q60 86 70 82",
  success: "M44 78 Q60 97 76 78",
  error: "M46 86 Q60 79 74 86",
  curious: "M48 80 Q60 89 72 80",
  surprised: "M50 85 Q60 96 70 85",
  sleep: "M55 83 Q60 85 65 83",
  typing: "M48 80 Q60 86 72 80",
  confused: "M48 84 Q60 80 72 86",
  hyper: "M42 78 Q60 100 78 78",
};

export const BROW_L: Record<Expression, string> = {
  idle: "M34 45 Q44 41 52 44",
  nome: "M34 45 Q44 41 52 44",
  email: "M34 40 Q44 35 52 39",
  mensagem: "M34 44 Q44 41 52 44",
  success: "M34 41 Q44 37 52 41",
  error: "M34 40 Q44 45 52 47",
  curious: "M34 43 Q44 39 52 42",
  surprised: "M34 35 Q44 30 52 38",
  sleep: "M36 47 Q44 46 50 47",
  typing: "M34 43 Q44 40 52 44",
  confused: "M34 45 Q44 40 52 42",
  hyper: "M32 38 Q44 32 54 40",
};

export const BROW_R: Record<Expression, string> = {
  idle: "M68 44 Q76 41 86 45",
  nome: "M68 44 Q76 41 86 45",
  email: "M68 39 Q76 35 86 40",
  mensagem: "M68 44 Q76 41 86 45",
  success: "M68 41 Q76 37 86 41",
  error: "M68 47 Q76 45 86 40",
  curious: "M68 40 Q76 34 86 39",
  surprised: "M68 38 Q76 30 86 35",
  sleep: "M70 47 Q76 46 84 47",
  typing: "M68 44 Q76 40 86 43",
  confused: "M68 38 Q76 35 86 42",
  hyper: "M66 40 Q76 32 88 38",
};

// Triplo de emoção: principal + secundária + peso da mistura (0..~0.45).
export type EmotionBlend = {
  primary: Expression;
  secondary: Expression;
  blend: number;
};

export const sameBlend = (a: EmotionBlend, b: EmotionBlend) =>
  a.primary === b.primary &&
  a.secondary === b.secondary &&
  Math.abs(a.blend - b.blend) < 0.02;
