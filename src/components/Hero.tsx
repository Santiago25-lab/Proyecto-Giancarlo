'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const accessoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // GSAP Scroll Animation for Accessories
    const ctx = gsap.context(() => {
      gsap.to(".accessory", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
        y: (i) => (i + 1) * 100,
        x: (i) => (i % 2 === 0 ? -50 : 50),
        rotation: (i) => (i + 1) * 45,
        opacity: 0,
        scale: 0.5,
      });

      // Background video movement - solo escala, sin bajar opacidad
      gsap.to(".hero-video", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        scale: 1.1,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center bg-white"
    >
      {/* Background Video */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 2 }}
        className="hero-video absolute inset-0 z-0 overflow-hidden"
      >
        <video 
          autoPlay
          muted 
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/Explocion suave Iphone.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/60 z-10" />
      </motion.div>

      {/* Floating Accessories (GSAP target) */}
      <div ref={accessoriesRef} className="absolute inset-0 pointer-events-none z-20">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`accessory absolute w-32 h-32 bg-white/40 border border-black/5 shadow-xl rounded-2xl backdrop-blur-md flex items-center justify-center
              ${i === 1 ? 'top-[25%] left-[15%]' : ''}
              ${i === 2 ? 'top-[55%] right-[12%]' : ''}
              ${i === 3 ? 'bottom-[25%] left-[18%]' : ''}
              ${i === 4 ? 'top-[15%] right-[22%]' : ''}
            `}
          >
             <span className="text-red-600 text-xs font-mono font-bold tracking-widest">iNARIÑO</span>
          </div>
        ))}
      </div>

      {/* Giancarlo + Logo Integration */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-30 w-full max-w-5xl px-6 flex flex-col items-center text-center pt-20 md:pt-24"
      >
        {/* Composición: Giancarlo detrás, logo delante abajo */}
        <div className="relative w-full flex justify-center items-end" style={{ height: '75vh', maxHeight: '620px' }}>

          {/* Giancarlo — ocupa toda la altura, centrado */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 flex items-end justify-center z-10"
          >
            <img 
              src="/giancarlo sin fondo.png" 
              alt="Giancarlo - iNariño Founder"
              className="h-full object-contain object-bottom drop-shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
              style={{ maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' }}
            />
          </motion.div>

          {/* Logo — en la parte inferior, encima de Giancarlo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            className="relative z-20 -mb-16 md:-mb-24"
          >
            <img
              src="/Logo inariño.png"
              alt="iNARIÑO Logo"
              className="w-72 md:w-[480px] object-contain drop-shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
            />
          </motion.div>

        </div>
        

      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 opacity-30"
      >
        <div className="w-px h-12 bg-gradient-to-b from-red-600 to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;
