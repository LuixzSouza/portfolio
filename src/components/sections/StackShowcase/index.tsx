"use client";

import { useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Section } from "@/components/ds/Section";
import { Container } from "@/components/ds/Container";
import { Heading } from "@/components/ds/Heading";
import { Text } from "@/components/ds/Text";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Reveal } from "@/components/ds/Reveal";
import { useLanguage } from "@/components/ds/LanguageProvider";
import { pickText } from "@/lib/i18n";
import { stackTechs, stackCopy, type StackTech } from "@/data/stack";
import { projetos } from "@/data/projects";
import { TechList } from "./TechList";
import { TechPanel } from "./TechPanel";
import { projectsForTech } from "./matchProjects";

/**
 * Vitrine de Stack — o cliente seleciona uma tecnologia (clique/hover/teclado)
 * e vê, em linguagem de negócio, o que ela agrega + os projetos reais que a usam.
 * Data-driven (src/data/stack), bilíngue e acessível (tablist).
 */
export function StackShowcase({ techs = stackTechs }: { techs?: StackTech[] }) {
  const { lang } = useLanguage();
  const reduced = useReducedMotion() ?? false;
  const [active, setActive] = useState(0);

  const activeTech = techs[active] ?? techs[0];
  const projects = useMemo(
    () => projectsForTech(activeTech, projetos),
    [activeTech],
  );

  if (!activeTech) return null;

  return (
    <Section id="stack" className="border-t border-foreground/10">
      <Container>
        <Reveal className="mb-14 flex flex-col gap-5 md:mb-20">
          <Eyebrow>{pickText(stackCopy.eyebrow, lang)}</Eyebrow>
          <Heading size="display-md" className="max-w-[20ch]">
            {pickText(stackCopy.heading, lang)}
          </Heading>
          <Text tone="muted" size="lg" measure>
            {pickText(stackCopy.text, lang)}
          </Text>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-14">
          {/* Assimétrico: lista estreita (5) + painel largo (7) */}
          <div className="lg:col-span-5">
            <span className="mb-4 hidden text-eyebrow uppercase tracking-widest text-muted/70 lg:block">
              {pickText(stackCopy.hint, lang)}
            </span>
            <TechList
              techs={techs}
              active={active}
              onSelect={setActive}
              lang={lang}
              reduced={reduced}
            />
          </div>

          <div className="lg:col-span-7">
            <TechPanel
              tech={activeTech}
              projects={projects}
              copy={stackCopy}
              lang={lang}
              reduced={reduced}
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
