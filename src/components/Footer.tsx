'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const builtRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {

      // Border line expands from center
      if (lineRef.current) {
        gsap.from(lineRef.current, {
          scaleX: 0,
          transformOrigin: 'center center',
          duration: 1.4,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 95%',
          },
        });
      }

      // Copyright text fades up
      if (textRef.current) {
        const split = new SplitType(textRef.current, { types: 'words' });
        gsap.from(split.words, {
          opacity: 0,
          y: 16,
          stagger: 0.04,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 98%',
          },
        });
      }

      // "Built for Excellence." flickers in like a neon sign
      if (builtRef.current) {
        gsap.from(builtRef.current, {
          opacity: 0,
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          delay: 0.4,
          ease: 'none',
          scrollTrigger: {
            trigger: builtRef.current,
            start: 'top 98%',
          },
          onComplete: () => {
            if (builtRef.current) {
              gsap.to(builtRef.current, { opacity: 1, duration: 0.3 });
            }
          },
        });
      }

    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="py-12 px-6 text-center bg-black relative overflow-hidden"
    >
      {/* Animated top border */}
      <div
        ref={lineRef}
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        style={{ willChange: 'transform' }}
      />

      {/* Subtle red glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-red-600/8 blur-[60px] rounded-full pointer-events-none" />

      <p ref={textRef} className="text-gray-600 text-sm relative z-10">
        © {new Date().getFullYear()} iNARIÑO. Todos los derechos reservados.{' '}
        <br />
        <span ref={builtRef} className="text-red-900/60">
          Built for Excellence.
        </span>
      </p>
    </footer>
  );
};

export default Footer;


