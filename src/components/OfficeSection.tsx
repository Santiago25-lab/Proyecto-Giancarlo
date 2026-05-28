'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

const OfficeSection = () => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!textRef.current) return;

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
      ease: "expo.out",
      scrollTrigger: {
        trigger: textRef.current,
        start: "top 85%",
        once: true,
      }
    });

    return () => {
      split.revert();
    };
  }, []);

  // HTML5 Canvas Gravity / Magnetic Particle Grid (Like Google Antigravity Auth Page!)
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = container.offsetWidth;
    let height = canvas.height = container.offsetHeight;

    const particles: Array<{
      x: number;      // Base position X
      y: number;      // Base position Y
      px: number;     // Current position X
      py: number;     // Current position Y
      vx: number;     // Velocity X
      vy: number;     // Velocity Y
      size: number;
      color: string;
    }> = [];

    // Generate a fine grid of interactive particles
    const spacing = 45;
    for (let x = spacing / 2; x < width; x += spacing) {
      for (let y = spacing / 2; y < height; y += spacing) {
        const rx = x + (Math.random() - 0.5) * 8;
        const ry = y + (Math.random() - 0.5) * 8;
        
        particles.push({
          x: rx,
          y: ry,
          px: rx,
          py: ry,
          vx: 0,
          vy: 0,
          size: Math.random() > 0.94 ? 2 : 1,
          color: Math.random() > 0.88 ? 'rgba(239, 68, 68, 0.35)' : 'rgba(255, 255, 255, 0.22)',
        });
      }
    }

    const mouse = { x: -1000, y: -1000, active: false };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    // Track mouse movement across the entire container
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      if (!canvas || !container) return;
      width = canvas.width = container.offsetWidth;
      height = canvas.height = container.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Dynamic Physics Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        const dx = mouse.x - p.px;
        const dy = mouse.y - p.py;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Repulsion / Warp Force (Snaps away from cursor within radius)
        const repelRadius = 140;
        if (mouse.active && dist < repelRadius) {
          const force = (repelRadius - dist) / repelRadius; // 0 to 1
          const angle = Math.atan2(dy, dx);
          
          // Target point pushed away from cursor
          const tx = p.px - Math.cos(angle) * force * 38;
          const ty = p.py - Math.sin(angle) * force * 38;
          
          p.vx += (tx - p.px) * 0.08;
          p.vy += (ty - p.py) * 0.08;
        }

        // Spring Force - pull back to original base coordinates
        const homeDx = p.x - p.px;
        const homeDy = p.y - p.py;
        p.vx += homeDx * 0.05;
        p.vy += homeDy * 0.05;

        // Apply friction/drag to make the bounce fluid and rubbery
        p.vx *= 0.83;
        p.vy *= 0.83;

        // Update particle positions
        p.px += p.vx;
        p.py += p.vy;

        // Draw particle dot
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.px, p.py, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full min-h-[95vh] flex items-center justify-center py-20 px-6 overflow-hidden bg-black text-white"
    >
      
      {/* 100% Bright & Unobstructed Full Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="/equipo-giancarlo.png" 
          alt="Sede iNARIÑO" 
          className="w-full h-full object-cover opacity-90 transition-transform duration-[2000ms] ease-out"
          style={{ 
            transform: isHovered ? 'scale(1.02)' : 'scale(1)' 
          }}
        />
        
        {/* Extremely thin dark vignette just to make the white text pop, maintaining maximum photo brightness */}
        <div className="absolute inset-0 bg-black/25 z-10" />
        
        {/* Vignette styling for a cinematic borderless finish */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 z-10 pointer-events-none" />
      </div>

      {/* HTML5 Particle Gravity Canvas Overlay (Google Antigravity style) */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* Interactive Cyber Security Tech Hotspots - Hover to discover office areas */}
      <div className="absolute inset-0 z-20 pointer-events-none hidden md:block">
        
        {/* Hotspot 1 - Giancarlo (Left side) */}
        <div className="absolute top-[32%] left-[10%] pointer-events-auto group/spot">
          <span className="absolute -inset-2 inline-flex h-8 w-8 rounded-full bg-red-600 opacity-75 animate-ping cursor-pointer" />
          <span className="relative flex h-4.5 w-4.5 rounded-full bg-red-600 border-2 border-white cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.8)] group-hover/spot:scale-110 transition-transform duration-300" />
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-black/95 text-white p-4 rounded-xl border border-red-500/20 opacity-0 scale-95 group-hover/spot:opacity-100 group-hover/spot:scale-100 transition-all duration-300 shadow-2xl z-50 text-xs backdrop-blur-md">
            <div className="font-mono text-[8px] text-red-500 mb-1 tracking-wider uppercase font-bold">ZONA 01</div>
            <h6 className="font-bold text-sm text-white mb-1">Asesoría de Confianza</h6>
            <p className="text-gray-400 leading-normal text-[11px]">Trato directo con Giancarlo para configurar tu dispositivo Apple ideal con seguridad absoluta.</p>
          </div>
        </div>

        {/* Hotspot 2 - Laboratorio de Control (Top Right) */}
        <div className="absolute top-[40%] right-[32%] pointer-events-auto group/spot">
          <span className="absolute -inset-2 inline-flex h-8 w-8 rounded-full bg-red-600 opacity-75 animate-ping cursor-pointer" />
          <span className="relative flex h-4.5 w-4.5 rounded-full bg-red-600 border-2 border-white cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.8)] group-hover/spot:scale-110 transition-transform duration-300" />
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-black/95 text-white p-4 rounded-xl border border-red-500/20 opacity-0 scale-95 group-hover/spot:opacity-100 group-hover/spot:scale-100 transition-all duration-300 shadow-2xl z-50 text-xs backdrop-blur-md">
            <div className="font-mono text-[8px] text-red-500 mb-1 tracking-wider uppercase font-bold">ZONA 02</div>
            <h6 className="font-bold text-sm text-white mb-1">Laboratorio de Diagnóstico</h6>
            <p className="text-gray-400 leading-normal text-[11px]">Donde realizamos las pruebas estéticas y funcionales oficiales de 40 puntos de fábrica.</p>
          </div>
        </div>

        {/* Hotspot 3 - Atención VIP (Bottom Right) */}
        <div className="absolute top-[68%] right-[10%] pointer-events-auto group/spot">
          <span className="absolute -inset-2 inline-flex h-8 w-8 rounded-full bg-red-600 opacity-75 animate-ping cursor-pointer" />
          <span className="relative flex h-4.5 w-4.5 rounded-full bg-red-600 border-2 border-white cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.8)] group-hover/spot:scale-110 transition-transform duration-300" />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 bg-black/95 text-white p-4 rounded-xl border border-red-500/20 opacity-0 scale-95 group-hover/spot:opacity-100 group-hover/spot:scale-100 transition-all duration-300 shadow-2xl z-50 text-xs backdrop-blur-md">
            <div className="font-mono text-[8px] text-red-500 mb-1 tracking-wider uppercase font-bold">ZONA 03</div>
            <h6 className="font-bold text-sm text-white mb-1">Soporte Técnico Real</h6>
            <p className="text-gray-400 leading-normal text-[11px]">Asistencia presencial continua y soporte de configuración para que disfrutes al máximo de tu inversión.</p>
          </div>
        </div>
      </div>

      {/* Floating Borderless Cinematic Content */}
      <div className="relative z-20 max-w-5xl mx-auto w-full flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {/* Sede Badge Tag */}
          <div className="flex items-center gap-2 mb-6 drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)]">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            <span className="text-xs font-mono text-red-500 tracking-[0.4em] uppercase font-bold">SEDE OPERATIVA NARIÑO</span>
          </div>

          {/* High-Contrast Large Typographical Header floating cleanly over the office photo */}
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-6 leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            MÁS QUE UNA EMPRESA, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-800">UN EQUIPO.</span>
          </h2>

          <p ref={textRef} className="text-gray-100 text-lg md:text-2xl mb-16 leading-relaxed max-w-3xl font-light drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            Nuestras oficinas físicas en Nariño son el corazón de nuestra operación. Aquí, cada dispositivo es verificado bajo estrictos estándares de seguridad para garantizar que recibes exactamente lo que esperas.
          </p>

          {/* Compact Frosted Glass Features placed at the bottom where they don't cover faces */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mt-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl border border-white/10 bg-black/35 backdrop-blur-md hover:border-red-600/30 hover:bg-black/60 transition-all duration-300 group text-left flex items-start gap-4 shadow-2xl">
              <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center shrink-0 text-red-500 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 font-mono font-bold text-xs">
                01
              </div>
              <div>
                <h4 className="text-white font-bold text-base mb-0.5">Presencia Física</h4>
                <p className="text-gray-300 text-xs leading-relaxed">Visítanos y conoce nuestra sede en Pasto. Seguridad real cara a cara.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl border border-white/10 bg-black/35 backdrop-blur-md hover:border-red-600/30 hover:bg-black/60 transition-all duration-300 group text-left flex items-start gap-4 shadow-2xl">
              <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center shrink-0 text-red-500 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 font-mono font-bold text-xs">
                02
              </div>
              <div>
                <h4 className="text-black font-bold text-base mb-0.5 text-white">Soporte Técnico Real</h4>
                <p className="text-gray-300 text-xs leading-relaxed">Asesores locales y soporte de ingeniería de primer nivel a tu disposición.</p>
              </div>
            </div>

          </div>
        </motion.div>
      </div>

    </section>
  );
};

export default OfficeSection;
