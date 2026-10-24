// ============================================================================
// Matemática pura do mascote — sem React, 100% testável isoladamente.
// (ruído orgânico, interpolação de paths SVG, clamp e blending de emoções)
// ============================================================================

export const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

/**
 * Ruído suave estilo fBm (soma de senos incomensuráveis) — contínuo porém sem
 * padrão perceptível. Cada chamada recebe uma seed aleatória, então duas
 * instâncias nunca oscilam igual.
 */
export function makeNoise(seed: number = 0) {
  return (t: number) =>
    (Math.sin(t + seed) * 0.5 +
      Math.sin(t * 2.13 + seed * 1.7) * 0.25 +
      Math.sin(t * 4.31 + seed * 2.3) * 0.125 +
      Math.sin(t * 8.57 + seed * 0.9) * 0.0625) /
    0.9375;
}

/**
 * Emotion blending: interpola dois paths SVG que compartilham o mesmo esqueleto
 * de comandos (todos os MOUTH/BROW são "M x y Q x y x y" = mesma contagem de
 * números). Permite misturar expressões (ex.: 70% typing + 30% curious) em vez
 * de trocar estados de forma seca.
 */
export function lerpPath(a: string, b: string, w: number): string {
  if (w <= 0.001) return a;
  const nb = b.match(/-?\d+\.?\d*/g);
  if (!nb) return a;
  let i = 0;
  return a.replace(/-?\d+\.?\d*/g, (token) => {
    const va = parseFloat(token);
    const vb = parseFloat(nb[i] ?? token);
    i++;
    return (va + (vb - va) * w).toFixed(2);
  });
}
