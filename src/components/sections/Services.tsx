"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ds/Container";
import { Section } from "@/components/ds/Section";
import { Heading } from "@/components/ds/Heading";
import { Text } from "@/components/ds/Text";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Reveal } from "@/components/ds/Reveal";
import { ArrowButton } from "@/components/ds/ArrowButton";
import { ServicesInteractive, type Service } from "./ServicesInteractive";
import { useTranslations } from "@/content/useTranslations";

const SERVICE_META = [
  { n: "01", slug: "sites", image: "/services/sites.webp" },
  { n: "02", slug: "sistemas", image: "/services/sistemas.webp" },
  { n: "03", slug: "lojas", image: "/services/lojas.webp" },
];

const STACK = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Tailwind",
  "PHP",
  "MySQL",
  "Figma",
  "Git",
  "AWS",
  "Docker",
];

export function Services() {
  const t = useTranslations();
  const services: Service[] = SERVICE_META.map((meta, i) => ({
    ...meta,
    ...t.services.items[i],
  }));

  return (
    <Section id="servicos" className="border-t border-foreground/10">
      <Container>
        <Reveal className="mb-14 flex flex-col gap-5 md:mb-20">
          <Eyebrow>{t.services.eyebrow}</Eyebrow>
          <Heading size="display-md" className="max-w-[20ch]">
            {t.services.heading}
          </Heading>
          <Text tone="muted" size="lg" measure>
            {t.services.text}
          </Text>
          <ArrowButton href="/services" variant="outline" className="mt-2 self-start">
            {t.services.seeAll}
          </ArrowButton>
        </Reveal>

        {/* Serviços Interativos */}
        <ServicesInteractive services={services} />

        {/* Stack de Tecnologias com Animação em Cascata */}
        <div className="mt-16 flex flex-col gap-5 border-t border-foreground/10 pt-10">
          <Reveal>
            <span className="text-eyebrow font-medium uppercase text-muted">
              {t.services.stackLabel}
            </span>
          </Reveal>
          
          {/* Container do Framer Motion para controlar a cascata */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.05 } } // Atraso de 0.05s entre cada item
            }}
            className="flex flex-wrap gap-2.5"
          >
            {STACK.map((tech) => (
              <motion.span
                key={tech}
                variants={{
                  hidden: { opacity: 0, scale: 0.8, y: 10 },
                  visible: { 
                    opacity: 1, 
                    scale: 1, 
                    y: 0,
                    transition: { type: "spring", stiffness: 200, damping: 15 }
                  }
                }}
                // Efeito tátil extra ao passar o mouse
                whileHover={{ y: -3, scale: 1.05 }}
                className="cursor-default rounded-full border border-foreground/15 px-3.5 py-1.5 text-sm text-muted transition-colors duration-300 hover:border-foreground/40 hover:text-foreground hover:shadow-sm"
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Call to Action */}
        <Reveal className="mt-16 flex flex-col items-start gap-6 border-t border-foreground/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
          <Text size="lg" className="max-w-[28ch]">
            {t.services.ctaText}
          </Text>
          <ArrowButton href="/work" variant="solid">
            {t.services.ctaButton}
          </ArrowButton>
        </Reveal>
      </Container>
    </Section>
  );
}