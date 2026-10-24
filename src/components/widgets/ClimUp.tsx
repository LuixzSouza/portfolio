'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useTranslations } from '@/content/useTranslations';

export function ClimUp() {
  const t = useTranslations();
  const [isVisible, setIsVisible] = useState(false);
  // useRef em vez de state: o scroll não deve disparar re-render da página.
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 500) {
        // Mostra ao rolar para cima; esconde ao descer (não atrapalha a leitura).
        setIsVisible(currentScrollY < lastScrollY.current);
      } else {
        setIsVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          onClick={scrollToTop}
          aria-label={t.a11y.backToTop}
          className="group fixed bottom-6 right-6 z-50 rounded-full border border-foreground/10 bg-surface/80 p-3.5 text-muted shadow-2xl backdrop-blur-xl transition-colors duration-300 hover:border-foreground/30 hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background md:bottom-10 md:right-10 md:p-4"
        >
          <ArrowUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 md:h-6 md:w-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
