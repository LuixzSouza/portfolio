"use client";

import { useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MOUTH, BROW_L, BROW_R } from "./expressions";
import { lerpPath } from "./math";
import { useMascotBrain } from "./useMascotBrain";
import { SmartBubble } from "./SmartBubble";
import { ParticleSystem } from "./ParticleSystem";
import type { ContactMascotProps } from "./types";

// Reexports públicos — mantém `import { ContactMascot, ContactField } from "./ContactMascot"`.
export type { ContactField, ContactStatus, ContactMascotProps } from "./types";
export type { Expression } from "./expressions";

// ============================================================================
// RENDER — consome o cérebro (física + emoção) e desenha o SVG. Apresentação
// pura: nenhuma regra de comportamento vive aqui.
// ============================================================================

export function ContactMascot(props: ContactMascotProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const brain = useMascotBrain(props, svgRef);

  const { emotion, energy, poked, isBlinking, isSleeping, covered, particles, lowPerf } = brain.state;
  const {
    controls, faceX, headRotate, bodyLean, earX,
    cheekDeformX, mouthSkew, mouthStretch,
    glowOpacity, talkScale,
    lightX, lightY, dispScale, combinedScaleX, combinedScaleY, shadowScaleX, bubbleX,
    pupilLcx, pupilRcx, pupilCy, wetLcx, wetRcx, wetCy, wetR,
  } = brain.physics;

  const { primary, secondary, blend } = emotion;

  // Emotion blending: paths interpolados entre principal e secundária.
  const mouthD = useMemo(() => lerpPath(MOUTH[primary], MOUTH[secondary], blend), [primary, secondary, blend]);
  const browLD = useMemo(() => lerpPath(BROW_L[primary], BROW_L[secondary], blend), [primary, secondary, blend]);
  const browRD = useMemo(() => lerpPath(BROW_R[primary], BROW_R[secondary], blend), [primary, secondary, blend]);

  const eyeScaleY = poked ? 1.35 : (isSleeping || isBlinking) ? 0.04 : primary === "success" ? 0.5 : 1;
  const blushOn = ["idle", "curious", "success", "typing", "confused", "hyper"].includes(primary);
  const morphSpeed = energy > 70 ? 0.25 : energy < 30 ? 0.6 : 0.4;
  const morph = { duration: morphSpeed, ease: [0.34, 1.56, 0.64, 1] as const };
  // Pseudo-músculos: a sobrancelha direita reage com leve atraso/timing diferente.
  const morphR = { duration: morphSpeed * 1.15, ease: [0.34, 1.56, 0.64, 1] as const, delay: 0.04 };

  const useMesh = !lowPerf;

  return (
    <div className="relative flex flex-col items-center gap-6">
      <ParticleSystem type={particles} count={lowPerf ? 6 : 12} />

      <div className="relative z-10">
        <motion.div style={{ rotate: bodyLean, scaleX: combinedScaleX, scaleY: combinedScaleY }}>
          <motion.div animate={controls} style={{ rotate: headRotate }}>
            <svg
              ref={svgRef}
              width="130"
              height="130"
              viewBox="0 0 120 120"
              onClick={brain.actions.triggerPoke}
              className="cursor-pointer select-none overflow-visible drop-shadow-[0_25px_40px_rgb(var(--foreground)/0.18)]"
            >
              <defs>
                <radialGradient id="rimGlow3D" cx="50%" cy="50%" r="75%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </radialGradient>
                <linearGradient id="lensSpecGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
                <radialGradient id="moveSpec" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </radialGradient>
                {useMesh && (
                  <filter id="meshWarp" x="-30%" y="-30%" width="160%" height="160%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves={2} seed={7} result="noise" />
                    <motion.feDisplacementMap in="SourceGraphic" in2="noise" scale={dispScale} xChannelSelector="R" yChannelSelector="G" />
                  </filter>
                )}
              </defs>

              <motion.g style={{ x: earX }}>
                <path d="M10 40 L4 36 M110 40 L116 36" className="stroke-foreground" strokeWidth="4" strokeLinecap="round" />
                <circle cx="4" cy="36" r="4.5" className="fill-foreground" />
                <circle cx="116" cy="36" r="4.5" className="fill-foreground" />
              </motion.g>

              <rect x="12" y="16" width="96" height="88" rx="38" className="fill-foreground" />
              <motion.rect x="12" y="16" width="96" height="88" rx="38" fill="url(#rimGlow3D)" style={{ opacity: glowOpacity }} />
              {/* Reactive light: specular móvel seguindo o rosto pela casca. */}
              <motion.ellipse rx="26" ry="20" fill="url(#moveSpec)" style={{ cx: lightX, cy: lightY, opacity: glowOpacity }} />

              <motion.g style={useMesh ? { x: faceX, y: brain.physics.faceY, filter: "url(#meshWarp)" } : { x: faceX, y: brain.physics.faceY }}>

                {/* Elastic Cheeks animadas no phoneme simulation */}
                <motion.g style={{ x: cheekDeformX, scaleY: talkScale }} initial={false} animate={{ opacity: blushOn ? 1 : 0 }} transition={morph}>
                  <ellipse cx="32" cy="74" rx="7.5" ry="4.5" className="fill-background/30" />
                  <ellipse cx="88" cy="74" rx="7.5" ry="4.5" className="fill-background/30" />
                </motion.g>

                <motion.g animate={{ scaleY: eyeScaleY }} transition={{ duration: isBlinking ? 0.08 : morphSpeed }} style={{ transformOrigin: "60px 56px" }}>
                  <ellipse cx="44" cy="56" rx="12" ry="14" className="fill-background" />
                  <ellipse cx="76" cy="56" rx="12" ry="14" className="fill-background" />

                  <motion.g initial={false} animate={{ opacity: isSleeping ? 0 : 1 }}>
                    <motion.circle r="6" className="fill-foreground" style={{ cx: pupilLcx, cy: pupilCy }} />
                    <motion.circle r="6" className="fill-foreground" style={{ cx: pupilRcx, cy: pupilCy }} />
                    {/* Eye wetness: highlight especular minúsculo. */}
                    <motion.circle style={{ r: wetR, cx: wetLcx, cy: wetCy }} fill="url(#lensSpecGlow)" />
                    <motion.circle style={{ r: wetR, cx: wetRcx, cy: wetCy }} fill="url(#lensSpecGlow)" />
                  </motion.g>
                </motion.g>

                <motion.path d={browLD} initial={false} animate={{ d: browLD }} transition={morph} className="fill-none stroke-background" strokeWidth="4" strokeLinecap="round" />
                <motion.path d={browRD} initial={false} animate={{ d: browRD }} transition={morphR} className="fill-none stroke-background" strokeWidth="4" strokeLinecap="round" />

                {/* Mouth Phoneme Simulation com Força G */}
                <motion.g style={{ scaleY: talkScale, transformOrigin: "60px 82px" }}>
                  <motion.path
                    style={{ skewX: mouthSkew, scaleY: mouthStretch, transformOrigin: "60px 82px" }}
                    d={mouthD}
                    initial={false}
                    animate={{ d: mouthD }}
                    transition={morph}
                    className="fill-none stroke-background"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                </motion.g>
              </motion.g>

              <AnimatePresence>
                {covered && (
                  <motion.g
                    initial={{ y: 70, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 70, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    <circle cx="44" cy="56" r="18" className="fill-foreground stroke-background" strokeWidth="3" />
                    <circle cx="76" cy="56" r="18" className="fill-foreground stroke-background" strokeWidth="3" />
                    <path d="M36 49 v14 M44 48 v16 M52 49 v14" className="stroke-background" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M68 49 v14 M76 48 v16 M84 49 v14" className="stroke-background" strokeWidth="2.5" strokeLinecap="round" />
                  </motion.g>
                )}
              </AnimatePresence>

            </svg>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ scaleX: shadowScaleX }}
          animate={{ opacity: [0.25, 0.1, 0.25] }}
          transition={{ duration: isSleeping ? 5 : 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-5 left-1/2 h-3 w-26 -translate-x-1/2 rounded-[100%] bg-foreground/30 blur-[5px]"
        />

        <AnimatePresence>
          {isSleeping && (
            <motion.div
              initial={{ opacity: 0, x: -10, y: 10, scale: 0.5 }}
              animate={{ opacity: 1, x: 28, y: -35, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, filter: "blur(5px)" }}
              transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
              className="absolute -right-6 -top-4 font-serif text-3xl font-bold italic text-foreground/45 pointer-events-none"
            >
              Zzz
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        style={{ x: bubbleX }}
        className="relative flex h-10 items-center justify-center z-20"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={props.caption}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="rounded-full bg-foreground px-6 py-2.5 text-center text-[15px] font-medium tracking-wide text-background shadow-2xl"
          >
            <SmartBubble text={props.caption} emotion={primary} />
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
