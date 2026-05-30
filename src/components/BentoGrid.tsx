'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Award, Tag } from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

const CatalogTeaser = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {

      // --- Heading clip-path reveal (curtain from bottom) ---
      if (headingRef.current) {
        gsap.from(headingRef.current, {
          clipPath: 'inset(100% 0% 0% 0%)',
          opacity: 0,
          y: 30,
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 88%',
            once: true,
          },
        });
      }

      // --- Paragraph word-mask reveal ---
      if (textRef.current) {
        const split = new SplitType(textRef.current, { types: 'lines,words' });
        split.lines?.forEach((line) => {
          const wrapper = document.createElement('div');
          wrapper.style.overflow = 'hidden';
          wrapper.style.paddingBottom = '0.1em';
          line.parentNode?.insertBefore(wrapper, line);
          wrapper.appendChild(line);
        });
        gsap.from(split.lines, {
          yPercent: 100,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 85%',
            once: true,
          },
        });
      }

      // --- Trust badges stagger ---
      if (badgesRef.current) {
        const badges = badgesRef.current.querySelectorAll('.trust-badge');
        gsap.from(badges, {
          opacity: 0,
          y: 24,
          stagger: 0.12,
          duration: 0.7,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: badgesRef.current,
            start: 'top 88%',
            once: true,
          },
        });
      }

      // --- Video container parallax drift on scroll ---
      if (videoRef.current) {
        gsap.from(videoRef.current, {
          opacity: 0,
          x: 80,
          scale: 0.92,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: videoRef.current,
            start: 'top 85%',
            once: true,
          },
        });
        gsap.to(videoRef.current, {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center py-24 px-6 bg-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{ backgroundImage: 'linear-gradient(to right, #000000 1px, transparent 1px), linear-gradient(to bottom, #000000 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Left Side: Typography & CTA */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-red-600" />
            <span className="text-red-600 text-xs font-mono tracking-[0.3em] uppercase font-bold">
              Colección Exclusiva
            </span>
          </div>

          <h2 ref={headingRef} className="text-6xl md:text-8xl font-black tracking-tighter text-black mb-6 leading-none" style={{ textShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            CATÁ<span className="text-transparent bg-clip-text bg-gradient-to-br from-red-500 to-red-800">LOGO</span>
          </h2>
          
          <p ref={textRef} className="text-gray-600 text-lg md:text-xl mb-10 leading-relaxed max-w-lg font-light">
            Explora nuestra selección élite de dispositivos <span className="text-black font-bold">Apple</span>. 
            Calidad impecable, asesoría de expertos y el respaldo de seguridad absoluta que define a iNariño.
          </p>

          {/* Trust Badges */}
          <div ref={badgesRef} className="flex flex-col sm:flex-row gap-6 mb-12">
            <div className="trust-badge flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shadow-sm border border-red-100">
                <ShieldCheck className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-black font-bold text-sm">Garantía Total</p>
                <p className="text-gray-500 text-xs">Respaldo seguro</p>
              </div>
            </div>
            <div className="trust-badge flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-black/5">
                <Award className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="text-black font-bold text-sm">Calidad Premium</p>
                <p className="text-gray-500 text-xs">100% Originales</p>
              </div>
            </div>
            <div className="trust-badge flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-black/5">
                <Tag className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="text-black font-bold text-sm">Mejor Precio</p>
                <p className="text-gray-500 text-xs">Ofertas reales</p>
              </div>
            </div>
          </div>
          
          <div>
            <Link
              href="/catalogo"
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-black text-white font-bold rounded-full overflow-hidden transition-all duration-500 shadow-xl shadow-black/10 hover:shadow-red-600/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
              <span className="relative z-10 tracking-wide text-sm uppercase">Adentrarse al catálogo</span>
              <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
            </Link>
          </div>
        </div>

        {/* Right Side: Cinematic Video Showcase */}
        <div
          ref={videoRef}
          className="relative w-full aspect-[4/5] md:aspect-square lg:aspect-[4/5] group flex items-center justify-center"
          style={{ willChange: 'transform' }}
        >
          <motion.div 
            animate={{ y: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            className="w-full h-full relative z-10 flex items-center justify-center"
          >
            <video 
              suppressHydrationWarning
              src="/video-catalogo.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-[120%] h-[120%] object-contain transition-transform duration-700 group-hover:scale-105"
              style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))' }}
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default CatalogTeaser;
