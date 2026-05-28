'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

const words = ["CONFIANZA", "SEGURIDAD", "TRANQUILIDAD", "EXPERIENCIA", "GARANTÍA"];

const TrustSection = () => {
  const [index, setIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const headingTopRef = useRef<HTMLSpanElement>(null);
  const headingBotRef = useRef<HTMLSpanElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  // Word cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // GSAP animations
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {

      // --- "PORQUE TU" heading top line ---
      if (headingTopRef.current) {
        gsap.from(headingTopRef.current, {
          xPercent: -40,
          opacity: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: headingTopRef.current,
            start: 'top 88%',
            once: true,
          },
        });
      }

      // --- "ES LO MÁS IMPORTANTE" heading bottom line ---
      if (headingBotRef.current) {
        gsap.from(headingBotRef.current, {
          xPercent: 40,
          opacity: 0,
          duration: 1,
          ease: 'expo.out',
          delay: 0.12,
          scrollTrigger: {
            trigger: headingBotRef.current,
            start: 'top 90%',
            once: true,
          },
        });
      }

      // --- Paragraph SplitType word-by-word reveal ---
      if (paraRef.current) {
        const split = new SplitType(paraRef.current, { types: 'words' });
        gsap.from(split.words, {
          opacity: 0,
          y: 18,
          stagger: 0.022,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: paraRef.current,
            start: 'top 85%',
            once: true,
          },
        });
      }

      // --- Decorative dots scale-in ---
      if (dotsRef.current) {
        gsap.from(dotsRef.current.children, {
          scaleX: 0,
          transformOrigin: 'left center',
          stagger: 0.1,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: dotsRef.current,
            start: 'top 90%',
            once: true,
          },
        });
      }

      // --- Feature cards slide-in from right with stagger ---
      if (featuresRef.current) {
        const cards = featuresRef.current.querySelectorAll('.trust-card');
        gsap.from(cards, {
          opacity: 0,
          x: 80,
          stagger: 0.15,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 85%',
            once: true,
          },
        });

        // Hover: subtle red left-border glow sweep
        cards.forEach((card) => {
          const el = card as HTMLElement;
          el.addEventListener('mouseenter', () => {
            gsap.to(el, { x: 6, duration: 0.3, ease: 'power2.out' });
          });
          el.addEventListener('mouseleave', () => {
            gsap.to(el, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.6)' });
          });
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      title: 'Transparencia Total',
      desc: 'Sin letras pequeñas ni sorpresas. Te explicamos exactamente qué estás comprando y bajo qué condiciones.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: 'Cero Intermediarios',
      desc: 'Tratas directamente con nosotros. Esto nos permite garantizar la cadena de seguridad de cada dispositivo.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
    {
      title: 'Soporte Local Real',
      desc: 'Estamos en Nariño. Si tienes un problema, vienes, te tomas un café con nosotros y lo solucionamos.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 px-6 relative overflow-hidden bg-black text-white">
      {/* Background glow blobs */}
      <div className="absolute bottom-0 left-0 w-1/2 h-full bg-red-600/10 blur-[150px] rounded-full -z-10" />
      <div className="absolute top-1/2 right-0 w-1/3 h-1/2 bg-red-800/10 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">

          {/* Left Text */}
          <div className="w-full md:w-1/2">
            <h2
              className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-tight flex flex-col items-start"
              style={{ perspective: '1200px' }}
            >
              <span ref={headingTopRef} className="block">PORQUE TU</span>

              {/* Animated word carousel */}
              <span className="relative h-[1.3em] w-full overflow-hidden flex items-center py-2" style={{ perspective: '1200px' }}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={words[index]}
                    initial={{ y: 50, opacity: 0, rotateX: -70, z: -60, filter: 'blur(6px)' }}
                    animate={{ y: 0, opacity: 1, rotateX: 0, z: 0, filter: 'blur(0px)' }}
                    exit={{ y: -50, opacity: 0, rotateX: 70, z: -60, filter: 'blur(6px)' }}
                    transition={{ type: 'spring', stiffness: 140, damping: 14, mass: 0.8 }}
                    className="absolute text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-800 select-none origin-center"
                    style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
                  >
                    {words[index]}
                  </motion.span>
                </AnimatePresence>
              </span>

              <span ref={headingBotRef} className="block">ES LO MÁS IMPORTANTE</span>
            </h2>

            <p ref={paraRef} className="text-gray-400 text-lg mb-8 leading-relaxed">
              Sabemos que adquirir tecnología de alta gama es una inversión importante. Por eso, hemos diseñado un ecosistema de compra donde la transparencia, la seguridad y tu tranquilidad son nuestra prioridad absoluta.
            </p>

            <div ref={dotsRef} className="flex gap-4">
              <div className="h-1 w-12 bg-red-600 rounded-full" />
              <div className="h-1 w-4 bg-red-800 rounded-full" />
              <div className="h-1 w-2 bg-red-900 rounded-full" />
            </div>
          </div>

          {/* Right Feature Cards */}
          <div ref={featuresRef} className="w-full md:w-1/2 grid grid-cols-1 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="trust-card bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 hover:border-red-600/30 transition-colors duration-300 group cursor-default"
                style={{ willChange: 'transform' }}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center text-red-500 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-bold">{f.title}</h3>
                </div>
                <p className="text-gray-400 text-sm pl-14">{f.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default TrustSection;
