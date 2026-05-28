'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

const GarantiasSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {

      // --- Heading split reveal ---
      if (headingRef.current) {
        const split = new SplitType(headingRef.current, { types: 'chars' });
        gsap.from(split.chars, {
          opacity: 0,
          y: 60,
          rotateX: -80,
          stagger: 0.025,
          duration: 0.7,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
            once: true,
          },
        });
      }

      // --- Subtext line reveal ---
      if (subRef.current) {
        gsap.from(subRef.current, {
          opacity: 0,
          y: 20,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: subRef.current,
            start: 'top 88%',
            once: true,
          },
        });
      }

      // --- Red line width expand ---
      if (lineRef.current) {
        gsap.from(lineRef.current, {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: lineRef.current,
            start: 'top 90%',
            once: true,
          },
        });
      }

      // --- Cards stagger from below with 3D flip ---
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.garantia-card');
        gsap.from(cards, {
          opacity: 0,
          y: 80,
          rotateY: 25,
          transformOrigin: 'left center',
          stagger: 0.12,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 85%',
            once: true,
          },
        });

        // Hover tilt per card
        cards.forEach((card) => {
          const el = card as HTMLElement;
          el.addEventListener('mouseenter', () => {
            gsap.to(el, { y: -8, scale: 1.02, duration: 0.35, ease: 'power2.out' });
          });
          el.addEventListener('mouseleave', () => {
            gsap.to(el, { y: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1,0.5)' });
          });
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const cards = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Garantía Extendida',
      desc: 'Respaldo directo en nuestra sede. Sin terceros ni largas esperas. Resolvemos de inmediato.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      title: '100% Originales',
      desc: 'Equipos verificados meticulosamente por expertos. Garantizamos la originalidad de cada componente.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Cambios Flexibles',
      desc: 'Políticas claras y justas para cambios y devoluciones si tu dispositivo presenta defectos de fábrica.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: 'Soporte Continuo',
      desc: 'Te acompañamos en la configuración y te damos tips para sacarle el máximo provecho a tu equipo.',
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 px-6 relative overflow-hidden bg-white">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-red-600/5 blur-[100px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2
            ref={headingRef}
            className="text-4xl md:text-6xl font-black tracking-tighter text-black mb-4"
            style={{ perspective: '800px' }}
          >
            NUESTRAS <span className="text-red-600">GARANTÍAS</span>
          </h2>
          <p ref={subRef} className="text-xl text-gray-600 max-w-2xl mx-auto">
            &ldquo;No me compran por precio. Me compran por seguridad.&rdquo;
          </p>
          <div ref={lineRef} className="h-1 w-24 bg-red-600 mx-auto rounded-full mt-6" />
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, i) => (
            <div
              key={i}
              className="garantia-card p-8 rounded-3xl bg-gray-50 border border-black/5 hover:border-red-600/20 hover:shadow-xl hover:shadow-red-600/5 transition-colors duration-300 group cursor-default"
              style={{ willChange: 'transform' }}
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-black mb-3">{card.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GarantiasSection;
