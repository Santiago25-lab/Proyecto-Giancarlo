'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Registra ScrollTrigger si no estaba registrado
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple-like easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Sincronizar Lenis con el ScrollTrigger de GSAP
    lenis.on('scroll', ScrollTrigger.update);

    // Usar el ticker de GSAP en lugar del requestAnimationFrame estándar
    // Esto asegura que GSAP y Lenis calculen las animaciones en el mismo frame
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Evita que GSAP intente compensar lag, lo cual rompe Lenis
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
