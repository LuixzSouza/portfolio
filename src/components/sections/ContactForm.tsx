"use client";

import { useRef, useState, type FormEvent } from "react";
import { Container } from "@/components/ds/Container";
import { Section } from "@/components/ds/Section";
import { Heading } from "@/components/ds/Heading";
import { Text } from "@/components/ds/Text";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Reveal } from "@/components/ds/Reveal";
import { ArrowButton } from "@/components/ds/ArrowButton";
import { ArrowUpRight } from "lucide-react";
import { ContactMascot, type ContactField } from "./ContactMascot";
import { useTranslations } from "@/content/useTranslations";
import { useLanguage } from "@/components/ds/LanguageProvider";
import { cvHref } from "@/lib/cv";

type Status = "idle" | "loading" | "success" | "error";

const FIELD_CLASS =
  "rounded-xl border border-foreground/15 bg-background/40 px-4 py-3 font-roobert text-foreground outline-none transition-colors placeholder:text-muted/60 focus:border-foreground/40 focus-visible:ring-2 focus-visible:ring-foreground/30 disabled:opacity-60";

export function ContactForm() {
  const t = useTranslations();
  const { lang } = useLanguage();
  const [form, setForm] = useState({ nome: "", email: "", mensagem: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [focused, setFocused] = useState<ContactField>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [attempted, setAttempted] = useState(false);

  const nomeRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const mensagemRef = useRef<HTMLTextAreaElement>(null);

  const emailValid = /\S+@\S+\.\S+/.test(form.email.trim());
  const invalid = {
    nome: attempted && !form.nome.trim(),
    email: attempted && (!form.email.trim() || !emailValid),
    mensagem: attempted && !form.mensagem.trim(),
  };

  const channels = [
    { key: "email", label: t.contact.channelEmail, value: "ola@luixzsouza.com.br", href: "mailto:ola@luixzsouza.com.br" },
    { key: "whats", label: t.contact.channelWhats, value: "+55 (35) 99735-4797", href: "https://wa.me/5535997354797" },
    {
      key: "linkedin",
      label: t.contact.channelLinkedin,
      value: "Luiz Antônio de Souza",
      href: "https://www.linkedin.com/in/luiz-antonio-souza-5000a226b/",
    },
    { key: "github", label: t.contact.channelGithub, value: "LuixzSouza", href: "https://github.com/LuixzSouza" },
    { key: "cv", label: t.contact.channelCv, value: t.contact.cv, href: cvHref(lang) },
  ];

  const channelCaption: Record<string, string> = {
    email: t.contact.mascotChannelEmail,
    whats: t.contact.mascotChannelWhats,
    linkedin: t.contact.mascotChannelLinkedin,
    github: t.contact.mascotChannelGithub,
    cv: t.contact.mascotChannelCv,
  };

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const caption =
    status === "success"
      ? t.contact.mascotSuccess
      : status === "error"
        ? t.contact.mascotError
        : status === "loading"
          ? t.contact.mascotSending
          : focused === "nome"
            ? t.contact.mascotName
            : focused === "email"
              ? t.contact.mascotEmail
              : focused === "mensagem"
                ? t.contact.mascotMessage
                : hovered
                  ? channelCaption[hovered]
                  : t.contact.mascotIdle;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setAttempted(true);

    // Valida e leva o foco direto ao primeiro campo com problema.
    if (!form.nome.trim()) {
      setStatus("error");
      nomeRef.current?.focus();
      return;
    }
    if (!form.email.trim() || !emailValid) {
      setStatus("error");
      emailRef.current?.focus();
      return;
    }
    if (!form.mensagem.trim()) {
      setStatus("error");
      mensagemRef.current?.focus();
      return;
    }

    setStatus("loading");
    try {
      // URL absoluta: o backend vive em /php (mesma origem). Relativo quebrava
      // nas rotas por idioma (/pt/contact → /pt/php/sendEmail.php, inexistente).
      const res = await fetch("/php/sendEmail.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ nome: "", email: "", mensagem: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const loading = status === "loading";

  return (
    <Section className="pt-28 md:pt-36">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Coluna esquerda: convite + canais */}
          <div className="flex flex-col">
            <Reveal className="flex flex-col gap-7">
              <Eyebrow>{t.contact.eyebrow}</Eyebrow>
              <Heading as="h1" size="display-md" className="max-w-[18ch] text-balance leading-[1.02]">
                {t.contact.headingLead}{" "}
                <span className="font-serif font-normal italic">{t.contact.headingEmphasis}</span>
              </Heading>
              <Text size="lg" tone="muted" measure>
                {t.contact.text}
              </Text>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-foreground/15 px-3.5 py-1.5 text-xs font-medium text-muted">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground/40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-foreground" />
                </span>
                {t.hero.badge}
              </span>
            </Reveal>

            <Reveal delay={0.1} className="mt-12 flex flex-col border-t border-foreground/10">
              {channels.map((c) => (
                <a
                  key={c.key}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHovered(c.key)}
                  onMouseLeave={() => setHovered((h) => (h === c.key ? null : h))}
                  onFocus={() => setHovered(c.key)}
                  onBlur={() => setHovered((h) => (h === c.key ? null : h))}
                  className="group flex items-center justify-between gap-4 border-b border-foreground/10 py-5 transition-colors hover:bg-foreground/[0.025]"
                >
                  <span className="flex flex-col gap-1">
                    <span className="text-eyebrow font-medium uppercase text-muted">
                      {c.label}
                    </span>
                    <span className="font-roobert text-lg text-foreground md:text-xl">
                      {c.value}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="h-5 w-5 shrink-0 text-muted transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                    strokeWidth={2}
                    aria-hidden
                  />
                </a>
              ))}
            </Reveal>
          </div>

          {/* Coluna direita: formulário */}
          <Reveal delay={0.1}>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 rounded-3xl border border-foreground/10 bg-surface p-8 md:p-10"
            >
              <ContactMascot
                focused={focused}
                nameValue={form.nome}
                emailValue={form.email}
                status={status}
                caption={caption}
                hovered={hovered}
              />

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-muted">{t.contact.nameLabel}</span>
                <input
                  ref={nomeRef}
                  type="text"
                  name="nome"
                  value={form.nome}
                  onChange={(e) => update("nome", e.target.value)}
                  onFocus={() => setFocused("nome")}
                  onBlur={() => setFocused(null)}
                  placeholder={t.contact.namePlaceholder}
                  disabled={loading}
                  aria-invalid={invalid.nome}
                  className={`${FIELD_CLASS} ${invalid.nome ? "border-red-500/60 focus:border-red-500/60" : ""}`}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-muted">{t.contact.emailLabel}</span>
                <input
                  ref={emailRef}
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  placeholder={t.contact.emailPlaceholder}
                  disabled={loading}
                  aria-invalid={invalid.email}
                  className={`${FIELD_CLASS} ${invalid.email ? "border-red-500/60 focus:border-red-500/60" : ""}`}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-muted">{t.contact.messageLabel}</span>
                <textarea
                  ref={mensagemRef}
                  name="mensagem"
                  value={form.mensagem}
                  onChange={(e) => update("mensagem", e.target.value)}
                  onFocus={() => setFocused("mensagem")}
                  onBlur={() => setFocused(null)}
                  placeholder={t.contact.messagePlaceholder}
                  rows={5}
                  disabled={loading}
                  aria-invalid={invalid.mensagem}
                  className={`${FIELD_CLASS} resize-none ${invalid.mensagem ? "border-red-500/60 focus:border-red-500/60" : ""}`}
                />
              </label>

              <div className="mt-2 flex flex-col gap-4">
                <ArrowButton type="submit" variant="solid" disabled={loading} className="self-start">
                  {loading ? t.contact.sending : t.contact.submit}
                </ArrowButton>

                <div role="status" aria-live="polite">
                  {status === "success" && (
                    <Text size="sm" className="text-foreground">
                      {t.contact.success}
                    </Text>
                  )}
                </div>
                {status === "error" && (
                  <div role="alert">
                    <Text size="sm" className="text-red-600">
                      {t.contact.error}
                    </Text>
                  </div>
                )}
              </div>
            </form>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
