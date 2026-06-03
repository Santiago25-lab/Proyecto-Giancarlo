'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Helper: returns true if user is on a touch/mobile device
const isMobileDevice = () =>
  typeof window !== 'undefined' &&
  (window.innerWidth < 768 || 'ontouchstart' in window);

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const giancarloWrapRef = useRef<HTMLDivElement>(null); // parallax wrapper
  const giancarloRef = useRef<HTMLImageElement>(null);   // entrance target
  const logoRef = useRef<HTMLDivElement>(null);
  const scrollLineRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Programmatic autoplay and interaction fallback for mobile devices (like iOS Safari)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force load the video resource
    video.load();

    // Fallback timeout to dispatch the heroVideoEnded event in case autoplay fails
    // or video is blocked/stuck, so the navbar is not left in a completely transparent state.
    const fallbackTimeout = setTimeout(() => {
      window.dispatchEvent(new Event('heroVideoEnded'));
    }, 4500); // 4.5 seconds fallback

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Playback started successfully, clear the timeout
          clearTimeout(fallbackTimeout);
        })
        .catch((error) => {
          console.warn('Autoplay prevented by browser, listening for user interaction:', error);

          // Fallback: try playing on any user interaction (touchstart, scroll, click)
          const playOnInteraction = () => {
            video.play()
              .then(() => {
                clearTimeout(fallbackTimeout);
                cleanup();
              })
              .catch(() => {});
          };

          const cleanup = () => {
            window.removeEventListener('touchstart', playOnInteraction);
            window.removeEventListener('scroll', playOnInteraction);
            window.removeEventListener('click', playOnInteraction);
          };

          window.addEventListener('touchstart', playOnInteraction, { passive: true });
          window.addEventListener('scroll', playOnInteraction, { passive: true });
          window.addEventListener('click', playOnInteraction, { passive: true });
        });
    }

    return () => {
      clearTimeout(fallbackTimeout);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const mobile = isMobileDevice();

    const ctx = gsap.context(() => {
      // Set initial states explicitly inside the context
      gsap.set([giancarloRef.current, logoRef.current, '.accessory', scrollLineRef.current], {
        opacity: 0,
        visibility: 'visible',
      });
      gsap.set(giancarloRef.current, { y: mobile ? 40 : 80, scale: 0.94 });
      gsap.set(logoRef.current, { y: mobile ? 20 : 30, scale: 0.88 });
      gsap.set('.accessory', { y: 20 });

      // --- Entrance timeline (runs once, never reverses) ---
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      tl.to(giancarloRef.current, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: mobile ? 1.0 : 1.6,
        delay: 0.2,
        onComplete: () => gsap.set(giancarloRef.current, { clearProps: 'y,scale' }),
      })
        .to(
          logoRef.current,
          { y: 0, opacity: 1, scale: 1, duration: mobile ? 0.8 : 1.2,
            onComplete: () => gsap.set(logoRef.current, { clearProps: 'y,scale' }),
          },
          '-=0.7'
        )
        .to(
          '.accessory',
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.6 },
          '-=0.5'
        )
        .to(
          scrollLineRef.current,
          { opacity: 0.3, scaleY: 1, transformOrigin: 'top center', duration: 0.5 },
          '-=0.2'
        );

      // Skip heavy scroll-based parallax on mobile to prevent lag
      if (!mobile) {
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

        // --- Scroll: video subtle scale (parallax) — desktop only ---
        gsap.to('.hero-video', {
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
          scale: 1.08, // Reduced from 1.1 to lessen GPU load
        });

        // --- Scroll: Giancarlo wrapper drifts up slightly --- desktop only
        gsap.to(giancarloWrapRef.current, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
          y: -50,
        });
      }

    }, containerRef);

    // --- Mouse parallax: desktop only (no touch devices) ---
    if (mobile) {
      return () => ctx.revert();
    }

    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
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
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      ctx.revert();
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0c] transition-colors duration-500"
    >
      {/* Background Video — always rendered; preload=auto ensures it plays immediately on mobile */}
      <div className="hero-video absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          suppressHydrationWarning
          preload="auto"
          className="w-full h-full object-cover"
          onEnded={() => window.dispatchEvent(new Event('heroVideoEnded'))}
        >
          {/* WebM transparent video for Chrome/Firefox/Android/Windows */}
          <source src="/explocion-suave-iphone-transparent.webm" type="video/webm" />
          {/* HEVC transparent video for Safari/iOS/macOS */}
          <source src="/explocion-suave-iphone-transparent.mov" type="video/quicktime; codecs=hevc" />
          {/* Fallback standard MP4 (solid background) */}
          <source src="/explocion-suave-iphone.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/60 dark:to-[#0a0a0c]/80 z-10 transition-all duration-500" />
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
            <div className="flex items-center gap-3 bg-white/30 dark:bg-white/5 px-6 py-2 rounded-full backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 dark:border-white/10 transition-colors duration-500">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)] animate-pulse" />
              <span className="text-black/80 dark:text-white/80 text-lg md:text-xl font-bold tracking-[0.25em] uppercase drop-shadow-sm transition-colors duration-500">
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
          {/* Parallax wrapper (mouse + scroll move this) — perspective disabled on mobile */}
          <div
            ref={giancarloWrapRef}
            className="absolute inset-0 flex items-end justify-center z-10"
            style={{ transformStyle: 'preserve-3d' }}
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
            {/* Logo claro (modo light) */}
            <img
              src="/Logo inariño.png"
              alt="iNARIÑO Logo"
              className="w-72 md:w-[480px] object-contain drop-shadow-[0_10px_40px_rgba(0,0,0,0.25)] block dark:hidden transition-all duration-500"
            />
            {/* Logo blanco (modo dark) */}
            <img
              src="/Logo inariño blanco.png"
              alt="iNARIÑO Logo"
              className="w-72 md:w-[480px] object-contain drop-shadow-[0_10px_40px_rgba(255,255,255,0.1)] hidden dark:block transition-all duration-500"
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
