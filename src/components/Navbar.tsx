'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Scroll detection and video end detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight - 80);
    };
    const handleVideoEnded = () => setVideoEnded(true);

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('heroVideoEnded', handleVideoEnded);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('heroVideoEnded', handleVideoEnded);
    };
  }, []);

  // GSAP entrance animation
  useEffect(() => {
    if (!navRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Logo clips in
      tl.from(logoRef.current, {
        clipPath: 'inset(0% 100% 0% 0%)',
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
      });

      // Links stagger in
      if (linksRef.current) {
        const links = linksRef.current.querySelectorAll('a');
        tl.from(links, {
          opacity: 0,
          y: -12,
          stagger: 0.07,
          duration: 0.5,
          ease: 'power3.out',
        }, '-=0.5');
      }

      // CTA button scale in
      tl.from(ctaRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        ease: 'back.out(1.7)',
      }, '-=0.3');

    }, navRef);

    return () => ctx.revert();
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Catálogo', href: '/catalogo' },
    { name: 'Agenda', href: '/agenda' },
    { name: 'Quiénes Somos', href: '#' },
    { name: 'Contáctanos', href: '#' },
  ];

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out px-6 py-4 ${
        scrolled || videoEnded
          ? 'bg-white/40 dark:bg-black/40 backdrop-blur-2xl border-b border-white/20 dark:border-white/5 shadow-sm'
          : 'bg-white/0 dark:bg-black/0 backdrop-blur-none border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <div ref={logoRef} className="flex items-center gap-2 sm:gap-3" style={{ clipPath: 'inset(0% 0% 0% 0%)' }}>
          <div className="hidden sm:flex w-8 h-8 shrink-0 bg-red-600 rounded-lg items-center justify-center shadow-md">
            <span className="text-white font-black text-xs">iN</span>
          </div>
          {/* Logo claro (modo light) */}
          <img
            src="/Logo inariño.png"
            alt="iNARIÑO Logo"
            className="h-7 sm:h-10 md:h-12 w-auto object-contain block dark:hidden transition-all duration-500"
          />
          {/* Logo blanco (modo dark) */}
          <img
            src="/Logo inariño blanco.png"
            alt="iNARIÑO Logo"
            className="h-7 sm:h-10 md:h-12 w-auto object-contain hidden dark:block transition-all duration-500"
          />
        </div>

        {/* Desktop Links */}
        <div ref={linksRef} className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-semibold text-black dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors duration-300 relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Desktop & Mobile CTA / Menu Toggle */}
        <div ref={ctaRef} className="flex items-center gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* WhatsApp Button */}
          <a
            href="https://wa.me/573215886915"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 sm:w-auto sm:h-auto p-2.5 sm:px-4 sm:py-2 flex items-center justify-center gap-2 bg-[#25D366] text-white text-xs font-bold rounded-full hover:bg-[#128C7E] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-black dark:text-white hover:text-red-600 dark:hover:text-red-500 focus:outline-none transition duration-300 z-50 relative bg-white/60 dark:bg-white/10 backdrop-blur-md border border-black/5 dark:border-white/10 rounded-full"
            aria-label="Menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between items-center relative">
              <span className={`w-5 h-0.5 bg-black dark:bg-white transition-all duration-300 rounded-full ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`w-5 h-0.5 bg-black dark:bg-white transition-all duration-300 rounded-full ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-5 h-0.5 bg-black dark:bg-white transition-all duration-300 rounded-full ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </div>
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Panel */}
      <div
        className={`fixed top-0 left-0 right-0 h-screen bg-white/95 dark:bg-black/95 backdrop-blur-2xl z-40 flex flex-col justify-center items-center gap-8 transition-all duration-500 md:hidden ${
          menuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-10 invisible pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center gap-6 text-center">
          {navLinks.map((link, idx) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-2xl font-black text-black dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-all uppercase tracking-tight"
              style={{
                transitionDelay: `${idx * 50}ms`
              }}
            >
              {link.name}
            </Link>
          ))}
          <a
            href="https://wa.me/573215886915"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 px-8 py-3.5 flex items-center gap-2 bg-[#25D366] text-white text-sm font-bold rounded-full hover:bg-[#128C7E] transition-all duration-300 shadow-lg"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
