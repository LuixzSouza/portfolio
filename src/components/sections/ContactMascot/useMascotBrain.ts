"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  useAnimationControls,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
  useReducedMotion,
  useAnimationFrame,
} from "framer-motion";
import { clamp, makeNoise } from "./math";
import type { EmotionBlend, Expression } from "./expressions";
import { sameBlend } from "./expressions";
import type { ContactMascotProps } from "./types";

// ============================================================================
// CÉREBRO — física com overshoot, ruído orgânico, saccades, energia/mood,
// detecção de "rage typing" e cálculo de emoção. Retorna refs + estado +
// motion values prontos para o render consumir.
// ============================================================================

export function useMascotBrain(
  props: ContactMascotProps,
  svgRef: React.RefObject<SVGSVGElement | null>,
) {
  const { focused, nameValue, emailValue, status, hovered, caption } = props;

  const [poked, setPoked] = useState(false);
  const [energy, setEnergy] = useState(50);
  const [isBlinking, setIsBlinking] = useState(false);
  const [particles, setParticles] = useState<string>("none");
  const [emotion, setEmotion] = useState<EmotionBlend>({ primary: "idle", secondary: "idle", blend: 0 });
  const [rage, setRage] = useState(false); // digitação frenética
  const [noiseSeed, setNoiseSeed] = useState(0); // seed para ruído - só no cliente
  const [breathPhase, setBreathPhase] = useState(0); // fase da respiração - só no cliente

  const typingTimer = useRef<NodeJS.Timeout | null>(null);
  const speakingTimer = useRef<NodeJS.Timeout | null>(null);
  const memoryTimeout = useRef<NodeJS.Timeout | null>(null);
  const rageTimer = useRef<NodeJS.Timeout | null>(null);
  const memoryLock = useRef<boolean>(false);
  const isTypingRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const deepBreath = useRef(false); // "respirar fundo" subconsciente
  const keyTimes = useRef<number[]>([]); // janela de timestamps p/ detectar rage

  // Inicializar seeds aleatórias apenas no cliente (evita hydration mismatch)
  useEffect(() => {
    setNoiseSeed(Math.random() * 1000);
    setBreathPhase(Math.random() * Math.PI * 2);
  }, []);

  const controls = useAnimationControls();
  const prefersReducedMotion = useReducedMotion();

  // Adaptive performance: corta filtros caros em mobile/low-end.
  const lowPerf = useRef(
    typeof navigator !== "undefined" &&
      (((navigator.hardwareConcurrency ?? 8) <= 4) ||
        /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent))
  ).current;

  // Sementes/offsets por instância → cada mascote respira e oscila diferente.
  const noise = useMemo(() => ({
    bx: makeNoise(noiseSeed),
    by: makeNoise(noiseSeed * 1.3),
    breath: makeNoise(noiseSeed * 1.7)
  }), [noiseSeed]);

  // VETORES BASE
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);

  const organicNoiseX = useMotionValue(0);
  const organicNoiseY = useMotionValue(0);
  const breathScaleX = useMotionValue(1);
  const breathScaleY = useMotionValue(1);
  const talkScale = useMotionValue(1); // Modulador de fonema falso

  // FÍSICA COM OVERSHOOT INTELIGENTE — eye focus priority via stiffness
  // decrescente: olhos → rosto → cabeça → corpo.
  const eyeX = useSpring(useTransform(() => targetX.get() + organicNoiseX.get() * 1.5), { stiffness: 600, damping: 18, mass: 0.1 });
  const eyeY = useSpring(useTransform(() => targetY.get() + organicNoiseY.get() * 1.5), { stiffness: 600, damping: 18, mass: 0.1 });

  const faceX = useSpring(useTransform(() => targetX.get() + organicNoiseX.get()), { stiffness: 250, damping: 14, mass: 0.6 });
  const faceY = useSpring(useTransform(() => targetY.get() + organicNoiseY.get()), { stiffness: 250, damping: 14, mass: 0.6 });

  const headContextTilt = useMotionValue(0);
  const headRotate = useSpring(useTransform(() => faceX.get() * 10 + headContextTilt.get()), { stiffness: 100, damping: 12, mass: 1.2 });
  const bodyLean = useSpring(useTransform(faceX, [-1, 1], [-4, 4]), { stiffness: 50, damping: 10, mass: 1.5 });
  const earX = useSpring(useTransform(faceX, (v) => v * -0.9), { stiffness: 35, damping: 6, mass: 0.8 });

  // DEFORMAÇÃO SECUNDÁRIA
  const faceVelX = useVelocity(faceX);
  const faceVelY = useVelocity(faceY);

  const squashX = useTransform(faceVelX, [-300, 0, 300], [1.06, 1, 1.06]);
  const squashY = useTransform(faceVelY, [-300, 0, 300], [1.06, 1, 1.06]);

  const mouthSkew = useTransform(faceVelX, [-400, 400], [-10, 10]);
  const mouthStretch = useTransform(faceVelY, [-400, 0, 400], [1.3, 1, 0.7]);
  const cheekDeformX = useTransform(faceVelX, [-400, 0, 400], [-3, 0, 3]);

  // SHADER FAKE + MOTION BLUR
  const totalSpeed = useTransform(() => Math.abs(faceVelX.get()) + Math.abs(faceVelY.get()));
  const glowOpacity = useTransform(totalSpeed, [0, 400], [0.35, 1]);
  const glowScale = useTransform(totalSpeed, [0, 400], [1, 1.5]);
  // Specular móvel (lightX/lightY) — segue o rosto pela casca.
  const lightX = useTransform(faceX, [-1, 1], [38, 82]);
  const lightY = useTransform(faceY, [-1, 1], [30, 64]);
  // Mesh distortion / motion blur fake: displacement reativo à velocidade.
  const dispScale = useSpring(useTransform(totalSpeed, [0, 120, 600], [0, 1.2, 6]), { stiffness: 300, damping: 30, mass: 0.4 });

  // TRANSFORMS COMPOSTOS (movidos pra fora do render → não recriam por frame)
  const combinedScaleX = useTransform(() => squashX.get() * breathScaleX.get());
  const combinedScaleY = useTransform(() => squashY.get() * breathScaleY.get());
  // Shadow physics: a sombra alarga quando o corpo achata (squashY < 1) e segue a respiração.
  const shadowScaleX = useTransform(() => breathScaleX.get() * 1.15 * (2 - squashY.get()));
  const bubbleX = useTransform(faceX, (v) => v * 1.5);

  // Posições das pupilas/specular dos olhos (evita useTransform inline no JSX).
  const pupilLcx = useTransform(eyeX, (v) => 44 + v * 1.6);
  const pupilRcx = useTransform(eyeX, (v) => 76 + v * 1.6);
  const pupilCy = useTransform(eyeY, (v) => 56 + v * 1.6);
  const wetLcx = useTransform(eyeX, (v) => 42.5 + v * 1.6);
  const wetRcx = useTransform(eyeX, (v) => 74.5 + v * 1.6);
  const wetCy = useTransform(eyeY, (v) => 54.5 + v * 1.6);
  const wetR = useTransform(glowScale, (v) => 2.5 * v);

  // --- CONTROLE DE FALA (Phonemes) ---
  useEffect(() => {
    isSpeakingRef.current = true;
    if (speakingTimer.current) clearTimeout(speakingTimer.current);
    speakingTimer.current = setTimeout(() => {
      isSpeakingRef.current = false;
    }, Math.min(caption.length * 40, 2000));
  }, [caption]);

  // --- ENGINE PROCEDURAL CONTÍNUA ---
  useAnimationFrame((time) => {
    if (prefersReducedMotion) return;
    const t = time / 1000;
    const isSleeping = energy < 20 && !focused;
    const speed = isSleeping ? 0.6 : rage ? 3.2 : energy > 80 ? 2.5 : 1.2;

    // Ruído orgânico (fBm) → micro-movimento contínuo, sem loop perceptível.
    organicNoiseX.set(noise.bx(t * 0.55 * speed) * 0.3);
    organicNoiseY.set(noise.by(t * 0.45 * speed) * 0.2);

    // Respiração: ritmo base (seno + offset aleatório) misturado a variação orgânica.
    // "Respirar fundo" amplia a amplitude por alguns segundos.
    const amp = deepBreath.current ? 0.042 : 0.018;
    const breath = Math.sin(t * 1.5 * speed + breathPhase) * 0.82 + noise.breath(t * 0.7 * speed) * 0.18;
    breathScaleY.set(1 + breath * amp);
    breathScaleX.set(1 - breath * (amp * 0.66));

    // Fonema Fake / Elastic Cheeks
    if (isTypingRef.current || isSpeakingRef.current) {
      talkScale.set(1 + Math.sin(time * 0.04) * (rage ? 0.34 : 0.25));
    } else {
      talkScale.set(1);
    }
  });

  // --- SACCADES + SUBCONSCIOUS BEHAVIORS ---
  useEffect(() => {
    let saccadeTimeout: NodeJS.Timeout;
    const tickSaccade = () => {
      if (energy > 30 && typeof window !== 'undefined') {
        // Micro tremida rápida (saccade) antes de assentar — dois micro-steps.
        const jx = (Math.random() - 0.5) * 0.18;
        const jy = (Math.random() - 0.5) * 0.1;
        targetX.set(targetX.get() + jx * 1.6);
        targetY.set(targetY.get() + jy * 1.6);
        setTimeout(() => {
          targetX.set(targetX.get() - jx);
          targetY.set(targetY.get() - jy);
        }, 45);
      }
      saccadeTimeout = setTimeout(tickSaccade, typeof window !== 'undefined' ? Math.random() * 800 + 200 : 1000);
    };
    tickSaccade();
    return () => clearTimeout(saccadeTimeout);
  }, [energy, targetX, targetY]);

  // Comportamentos subconscientes: olhar pro canto, respirar fundo, auto-inclinar.
  useEffect(() => {
    if (prefersReducedMotion) return;
    let to: NodeJS.Timeout;
    const tick = () => {
      const idleNow = !focused && !hovered && status === "idle" && !poked;
      if (idleNow && typeof window !== 'undefined') {
        const r = Math.random();
        if (r < 0.4) {
          // glance para um canto aleatório, depois volta
          targetX.set((Math.random() - 0.5) * 1.6);
          targetY.set((Math.random() - 0.5) * 1.1);
          setTimeout(() => {
            if (!focused && !hovered) { targetX.set(0); targetY.set(0); }
          }, 850);
        } else if (r < 0.62) {
          deepBreath.current = true;
          setTimeout(() => { deepBreath.current = false; }, 2400);
        } else if (r < 0.8) {
          headContextTilt.set((Math.random() - 0.5) * 16);
          setTimeout(() => { if (!focused) headContextTilt.set(0); }, 1200);
        }
      }
      to = setTimeout(tick, typeof window !== 'undefined' ? Math.random() * 4000 + 3000 : 7000);
    };
    to = setTimeout(tick, 4000);
    return () => clearTimeout(to);
  }, [focused, hovered, status, poked, prefersReducedMotion, targetX, targetY, headContextTilt]);

  // --- IDLE AI MEMORY: segura o último pose por uns segundos antes do idle ---
  useEffect(() => {
    if (!focused && !hovered) {
      memoryLock.current = true;
      if (memoryTimeout.current) clearTimeout(memoryTimeout.current);
      memoryTimeout.current = setTimeout(() => { memoryLock.current = false; }, 2500);
    } else {
      memoryLock.current = false;
      if (memoryTimeout.current) clearTimeout(memoryTimeout.current);
    }
  }, [focused, hovered]);

  // --- ENERGIA / MOOD PERSISTENCE ---
  useEffect(() => {
    const interval = setInterval(() => setEnergy((e) => clamp(e - 2.5, 0, 100)), 1000);
    return () => clearInterval(interval);
  }, []);

  // --- TECLADO + CONTEXT AWARENESS (rage typing) ---
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key.length !== 1 && e.key !== "Backspace") return;
      setEnergy((prev) => clamp(prev + 15, 0, 100));
      isTypingRef.current = true;
      if (typingTimer.current) clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => { isTypingRef.current = false; }, 800);

      // Detecta digitação frenética pela média dos intervalos recentes.
      const now = performance.now();
      keyTimes.current = [...keyTimes.current, now].slice(-6);
      if (keyTimes.current.length >= 4) {
        let sum = 0;
        for (let i = 1; i < keyTimes.current.length; i++) sum += keyTimes.current[i] - keyTimes.current[i - 1];
        const avg = sum / (keyTimes.current.length - 1);
        if (avg < 110) setRage(true);
        else if (avg > 220) setRage(false);
      }
      if (rageTimer.current) clearTimeout(rageTimer.current);
      rageTimer.current = setTimeout(() => setRage(false), 1300);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // --- MAGNETIC CURSOR + ARBITRAGEM DE ALVOS ---
  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (focused || poked || status !== "idle" || memoryLock.current) return;
      const el = svgRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      targetX.set(clamp((e.clientX - (r.left + r.width / 2)) / 180, -1, 1));
      targetY.set(clamp((e.clientY - (r.top + r.height / 2)) / 180, -1, 1));
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [targetX, targetY, focused, poked, status, svgRef]);

  const isEmailInvalid = emailValue.length > 4 && !emailValue.includes("@");

  useEffect(() => {
    if (poked) return;
    const sName = Math.sin(nameValue.length * 0.6) * 0.4;
    const sEmail = Math.sin(emailValue.length * 0.6) * 0.4;

    if (status === "loading") {
      targetX.set(0); targetY.set(-0.9); headContextTilt.set(-10);
    } else if (isEmailInvalid && focused === "email") {
      headContextTilt.set(16);
    } else if (status === "success" || status === "error") {
      targetX.set(0); targetY.set(0); headContextTilt.set(0);
    } else if (focused === "nome") {
      targetX.set(sName); targetY.set(0.7); headContextTilt.set(4);
    } else if (focused === "email") {
      targetX.set(sEmail); targetY.set(0.8); headContextTilt.set(isEmailInvalid ? 16 : 0);
    } else if (focused === "mensagem") {
      targetX.set(0); targetY.set(1); headContextTilt.set(-4);
    } else if (hovered) {
      targetX.set(-0.9); targetY.set(0); headContextTilt.set(-8);
    } else {
      headContextTilt.set(0);
    }
  }, [focused, nameValue, emailValue, hovered, status, poked, targetX, targetY, isEmailInvalid, headContextTilt]);

  // --- CÁLCULO DE EMOÇÃO BRUTA (com blending) ---
  const isSleeping = energy < 20 && !focused;
  const rawBlend = useMemo<EmotionBlend>(() => {
    if (poked) return { primary: "surprised", secondary: "hyper", blend: 0.3 };
    if (status === "success") return { primary: "hyper", secondary: "surprised", blend: 0.28 };
    if (status === "error") return { primary: "error", secondary: "confused", blend: 0.3 };
    if (status === "loading") return { primary: "curious", secondary: "typing", blend: 0.3 };
    if (focused === "email" && isEmailInvalid)
      return { primary: "confused", secondary: energy < 35 ? "sleep" : "error", blend: 0.3 };
    if (rage) return { primary: "hyper", secondary: "typing", blend: 0.4 };
    if (isSleeping) return { primary: "sleep", secondary: "idle", blend: 0.2 };
    if (isTypingRef.current && hovered) return { primary: "typing", secondary: "curious", blend: 0.32 };
    if (isTypingRef.current) return { primary: "typing", secondary: focused ?? "idle", blend: 0.25 };
    if (focused) return { primary: focused, secondary: hovered ? "curious" : "idle", blend: hovered ? 0.3 : 0.12 };
    if (hovered) return { primary: "curious", secondary: "idle", blend: 0.3 };
    if (energy > 80) return { primary: "hyper", secondary: "idle", blend: 0.3 };
    return { primary: "idle", secondary: energy < 35 ? "sleep" : "idle", blend: energy < 35 ? 0.18 : 0 };
  }, [poked, status, focused, isEmailInvalid, energy, rage, isSleeping, hovered]);

  // --- TINY EMOTIONAL DELAYS (120ms) — reação não-instantânea ---
  useEffect(() => {
    const t = setTimeout(() => {
      setEmotion((prev) => (sameBlend(prev, rawBlend) ? prev : rawBlend));
    }, 120);
    return () => clearTimeout(t);
  }, [rawBlend]);

  // --- EVENTOS POKE E PISCADAS ---
  const triggerPoke = async () => {
    if (poked || prefersReducedMotion) return;
    setPoked(true);
    setEnergy(100);
    setParticles("poke");
    setTimeout(() => setParticles("none"), 1000);

    // Micro-anticipation: comprime 40ms antes do salto (sensação Pixar).
    await controls.start({
      scaleY: 0.8,
      scaleX: 1.15,
      y: 12,
      transition: { duration: 0.04, ease: "easeOut" },
    });

    await controls.start({
      x: [0, (Math.random() > 0.5 ? 1 : -1) * 18, 0],
      y: [-40, 8, 0],
      scaleY: [1.25, 0.85, 1],
      scaleX: [0.75, 1.15, 1],
      transition: { duration: 0.65, ease: "easeInOut" },
    });
    setPoked(false);
  };

  useEffect(() => {
    if (status === "success") {
      setParticles("success");
      setEnergy(100);
      // Micro-anticipation antes do pulo de comemoração.
      controls.start({ scaleY: 0.82, y: 8, transition: { duration: 0.05, ease: "easeOut" } }).then(() =>
        controls.start({ y: [0, -28, 0], scaleY: [1.22, 0.85, 1], transition: { duration: 0.6, ease: "circOut" } })
      );
    }
  }, [status, controls]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const autoBlink = () => {
      if (energy < 20 && !focused) return;
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 120);

      if (energy > 75 && Math.random() < 0.25) {
        setTimeout(() => { setIsBlinking(true); setTimeout(() => setIsBlinking(false), 100); }, 180);
      }
      timeout = setTimeout(autoBlink, energy > 60 ? Math.random() * 2000 + 1000 : Math.random() * 4000 + 3000);
    };
    timeout = setTimeout(autoBlink, 2000);
    return () => clearTimeout(timeout);
  }, [energy, focused]);

  return {
    refs: { svgRef },
    state: {
      emotion,
      energy,
      poked,
      isBlinking,
      isSleeping,
      rage,
      lowPerf,
      covered: emotion.primary === "mensagem",
      particles,
    },
    actions: { triggerPoke },
    physics: {
      controls, faceX, faceY, headRotate, bodyLean, earX, eyeX, eyeY,
      squashX, squashY, cheekDeformX, mouthSkew, mouthStretch,
      lightX, lightY, glowOpacity, glowScale, breathScaleX, breathScaleY, talkScale,
      dispScale, combinedScaleX, combinedScaleY, shadowScaleX, bubbleX,
      pupilLcx, pupilRcx, pupilCy, wetLcx, wetRcx, wetCy, wetR,
    },
  };
}

// Reexporta o tipo Expression p/ conveniência de quem usa o cérebro.
export type { Expression };
