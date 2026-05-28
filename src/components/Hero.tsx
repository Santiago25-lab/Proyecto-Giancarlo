'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const giancarloWrapRef = useRef<HTMLDivElement>(null); // parallax wrapper
  const giancarloRef = useRef<HTMLImageElement>(null);   // entrance target
  const logoRef = useRef<HTMLDivElement>(null);
  const scrollLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial states explicitly inside the context
      gsap.set([giancarloRef.current, logoRef.current, '.accessory', scrollLineRef.current], {
        opacity: 0,
        visibility: 'visible', // Ensure it's rendered
      });
      gsap.set(giancarloRef.current, { y: 80, scale: 0.94 });
      gsap.set(logoRef.current, { y: 30, scale: 0.88 });
      gsap.set('.accessory', { y: 20 });

      // --- Entrance timeline (runs once, never reverses) ---
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      tl.to(giancarloRef.current, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.6,
        delay: 0.3,
        onComplete: () => gsap.set(giancarloRef.current, { clearProps: 'y,scale' }),
      })
        .to(
          logoRef.current,
          { y: 0, opacity: 1, scale: 1, duration: 1.2,
            onComplete: () => gsap.set(logoRef.current, { clearProps: 'y,scale' }),
          },
          '-=0.9'
        )
        .to(
          '.accessory',
          { opacity: 1, y: 0, stagger: 0.12, duration: 0.8 },
          '-=0.7'
        )
        .to(
          scrollLineRef.current,
          { opacity: 0.3, scaleY: 1, transformOrigin: 'top center', duration: 0.6 },
          '-=0.3'
        );

      // --- Scroll: accessories drift off screen (parallax) ---
      gsap.to('.accessory', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
        y: (i) => (i + 1) * 80,
        x: (i) => (i % 2 === 0 ? -20 : 20),
        opacity: 0,
        scale: 0.8,
      });

      // --- Scroll: video subtle scale (parallax) ---
      gsap.to('.hero-video', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
        scale: 1.1,
      });

      // --- Scroll: Giancarlo wrapper (not image itself) drifts up slightly ---
      gsap.to(giancarloWrapRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
        y: -50,
      });

    }, containerRef);

    // --- Mouse parallax: uses separate wrapper, no conflict with entrance ---
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const nx = (e.clientX / innerWidth - 0.5) * 2;
      const ny = (e.clientY / innerHeight - 0.5) * 2;

      gsap.to(giancarloWrapRef.current, {
        x: nx * 16,
        rotateY: nx * 4,
        rotateX: -ny * 3,
        duration: 1.2,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      gsap.to(logoRef.current, {
        x: nx * 7,
        duration: 1.5,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      ctx.revert();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center bg-white"
    >
      {/* Background Video */}
      <div className="hero-video absolute inset-0 z-0 overflow-hidden">
        <video autoPlay muted playsInline className="w-full h-full object-cover">
          <source src="/explocion-suave-iphone.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/60 z-10" />
      </div>

      {/* Floating Accessories */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {[
          { id: 1, text: 'SEGURIDAD', pos: 'top-[25%] left-[15%]' },
          { id: 2, text: 'GARANTÍA', pos: 'top-[55%] right-[12%]' },
          { id: 3, text: 'CONFIANZA', pos: 'bottom-[25%] left-[18%]' },
          { id: 4, text: 'CALIDAD', pos: 'top-[15%] right-[22%]' },
        ].map((item) => (
          <div key={item.id} className={`accessory absolute flex items-center justify-center opacity-0 ${item.pos}`}>
            <div className="flex items-center gap-3 bg-white/30 px-6 py-2 rounded-full backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)] animate-pulse" />
              <span className="text-black/80 text-lg md:text-xl font-bold tracking-[0.25em] uppercase drop-shadow-sm">
                {item.text}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Giancarlo + Logo */}
      <div className="relative z-30 w-full max-w-5xl px-6 flex flex-col items-center text-center pt-20 md:pt-24">
        <div
          className="relative w-full flex justify-center items-end"
          style={{ height: '75vh', maxHeight: '620px', perspective: '800px' }}
        >
          {/* Parallax wrapper (mouse + scroll move this) */}
          <div
            ref={giancarloWrapRef}
            className="absolute inset-0 flex items-end justify-center z-10"
            style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
          >
            {/* Image itself (entrance animation targets this) */}
            <img
              ref={giancarloRef}
              src="/giancarlo sin fondo.png"
              alt="Giancarlo - iNariño Founder"
              className="h-full object-contain object-bottom drop-shadow-[0_20px_60px_rgba(0,0,0,0.15)] opacity-0"
              style={{
                maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
              }}
            />
          </div>

          {/* Logo */}
          <div
            ref={logoRef}
            className="relative z-20 -mb-16 md:-mb-24 opacity-0"
            style={{ willChange: 'transform' }}
          >
            <img
              src="/Logo inariño.png"
              alt="iNARIÑO Logo"
              className="w-72 md:w-[480px] object-contain drop-shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
            />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollLineRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40"
        style={{ transform: 'scaleY(0)' }}
      >
        <div className="w-px h-12 bg-gradient-to-b from-red-600 to-transparent animate-bounce" />
      </div>
    </section>
  );
};

export default Hero;
