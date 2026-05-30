'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  type: 'dot' | 'spark' | 'ring';
}

const CLICKABLE = 'a, button, [role="button"], input, label, select, textarea, [tabindex]';

export default function CursorEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef({ x: -200, y: -200 });
  const trailRef = useRef<{ x: number; y: number }[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const ringPosRef = useRef({ x: -200, y: -200 });
  const isHoveringRef = useRef(false);
  const ringRafRef = useRef<number>(0);

  // Skip entirely on touch/mobile — no cursor exists, saves significant CPU/GPU
  const isMobile =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || window.innerWidth < 768);

  useEffect(() => {
    if (isMobile) return; // nothing to do on touch devices
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to fill the whole viewport
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Track mouse globally
    const onMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };

      // Move dot cursor instantly
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }

      // Detect if hovering interactive element
      const target = e.target as Element;
      isHoveringRef.current = !!target?.closest(CLICKABLE);

      // Spawn particles
      const count = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < count; i++) {
        const type: Particle['type'] =
          Math.random() < 0.15 ? 'ring' : Math.random() < 0.4 ? 'spark' : 'dot';
        const angle = Math.random() * Math.PI * 2;
        const speed = type === 'spark' ? Math.random() * 3 + 1 : Math.random() * 1.5 + 0.2;
        particlesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 6,
          y: e.clientY + (Math.random() - 0.5) * 6,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (type === 'spark' ? 1.5 : 0),
          life: 1,
          maxLife:
            type === 'ring'
              ? 0.7
              : type === 'spark'
              ? 0.5 + Math.random() * 0.4
              : 0.6 + Math.random() * 0.5,
          size:
            type === 'ring'
              ? 12 + Math.random() * 8
              : type === 'spark'
              ? 1 + Math.random() * 2
              : 2 + Math.random() * 3,
          type,
        });
      }

      // Trail
      trailRef.current.push({ x: e.clientX, y: e.clientY });
      if (trailRef.current.length > 22) trailRef.current.shift();
    };

    window.addEventListener('mousemove', onMove, { passive: true });

    // Ring lag animation — also changes scale/border on hover
    const animRing = () => {
      const ring = cursorRingRef.current;
      if (ring) {
        ringPosRef.current.x += (cursorRef.current.x - ringPosRef.current.x) * 0.12;
        ringPosRef.current.y += (cursorRef.current.y - ringPosRef.current.y) * 0.12;

        const isHov = isHoveringRef.current;
        const size = isHov ? 56 : 40;
        const half = size / 2;

        ring.style.width = `${size}px`;
        ring.style.height = `${size}px`;
        ring.style.transform = `translate(${ringPosRef.current.x - half}px, ${ringPosRef.current.y - half}px)`;
        ring.style.borderColor = isHov ? 'rgba(239,68,68,0.9)' : 'rgba(239,68,68,0.55)';
        ring.style.boxShadow = isHov
          ? '0 0 20px 4px rgba(239,68,68,0.35)'
          : '0 0 12px 0 rgba(239,68,68,0.2)';
        ring.style.backgroundColor = isHov ? 'rgba(239,68,68,0.07)' : 'transparent';
      }
      ringRafRef.current = requestAnimationFrame(animRing);
    };
    animRing();

    // Main canvas draw loop
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw trail
      if (trailRef.current.length > 1) {
        for (let i = 1; i < trailRef.current.length; i++) {
          const progress = i / trailRef.current.length;
          const prev = trailRef.current[i - 1];
          const curr = trailRef.current[i];
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(curr.x, curr.y);
          ctx.strokeStyle = `rgba(239, 68, 68, ${progress * 0.3})`;
          ctx.lineWidth = progress * 2.5;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
      }

      // Update & draw particles
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);
      for (const p of particlesRef.current) {
        const decay =
          p.type === 'ring' ? 0.045 : p.type === 'spark' ? 0.038 : 0.028;
        p.life -= decay;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.type === 'spark' ? 0.12 : 0.04;
        p.vx *= 0.97;

        const alpha = Math.max(0, p.life / p.maxLife);

        if (p.type === 'ring') {
          const radius = p.size * (1 - p.life / p.maxLife) * 2.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(239, 68, 68, ${alpha * 0.6})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else if (p.type === 'spark') {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3);
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.85})`;
          ctx.lineWidth = p.size * 0.5;
          ctx.lineCap = 'round';
          ctx.stroke();
        } else {
          const r = p.size * alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2.5);
          gradient.addColorStop(0, `rgba(239, 68, 68, ${alpha * 0.9})`);
          gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animFrameRef.current);
      cancelAnimationFrame(ringRafRef.current);
    };
  }, []);

  // No cursor UI on touch devices
  if (isMobile) return null;

  return (
    <>
      {/* Canvas — fixed to viewport, covers 100% at all times */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 9998,
        }}
      />

      {/* Dot — follows cursor instantly */}
      <div
        ref={cursorDotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: '#ef4444',
          pointerEvents: 'none',
          zIndex: 9999,
          boxShadow: '0 0 10px 3px rgba(239,68,68,0.85)',
          willChange: 'transform',
        }}
      />

      {/* Ring — lags behind, expands on clickable elements */}
      <div
        ref={cursorRingRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1.5px solid rgba(239, 68, 68, 0.55)',
          pointerEvents: 'none',
          zIndex: 9997,
          willChange: 'transform, width, height',
          transition: 'width 0.18s ease, height 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease',
          boxShadow: '0 0 12px 0 rgba(239,68,68,0.2)',
        }}
      />
    </>
  );
}
