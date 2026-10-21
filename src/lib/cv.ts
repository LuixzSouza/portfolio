import type { Lang } from "@/components/ds/LanguageProvider";

export function cvHref(lang: Lang): string {
  return lang === "pt" ? "/cv/curriculo-luiz-souza.pdf" : "/cv/curriculo-luiz-souza-en.pdf";
}
