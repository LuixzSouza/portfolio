import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// Flat config (ESLint 9) que substitui o `next lint` (deprecado, removido no
// Next 16). Faz a ponte com os presets do Next via FlatCompat — mesmas regras
// de antes (.eslintrc.json: next/core-web-vitals + next/typescript).
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      ".next-dev/**",
      "out/**",
      "node_modules/**",
      "public/**",
      "next-env.d.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
