"use client";

import { useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";

/**
 * Balão de fala com efeito máquina de escrever + micro-bounce audio-reactive
 * (cada caractere que aparece dá um pulsinho). Velocidade varia com a emoção.
 */
export function SmartBubble({ text, emotion }: { text: string; emotion: string }) {
  const [displayed, setDisplayed] = useState("");
  const pulse = useAnimationControls();

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const speed = emotion === "sleep" || emotion === "confused" ? 70 : 25;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, emotion]);

  // Audio-reactive fake: micro bounce a cada caractere que aparece.
  useEffect(() => {
    if (!displayed) return;
    pulse.start({ scale: [1, 1.035, 1], transition: { duration: 0.11, ease: "easeOut" } });
  }, [displayed, pulse]);

  return <motion.span animate={pulse} className="inline-block">{displayed || " "}</motion.span>;
}
