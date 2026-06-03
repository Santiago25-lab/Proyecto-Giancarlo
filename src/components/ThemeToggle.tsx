'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import gsap from 'gsap';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (systemPrefersDark) {
      setTheme('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Smooth GSAP spin & scale pop animation on toggle
    gsap.fromTo('.theme-icon',
      { rotate: -90, scale: 0.6, opacity: 0 },
      { rotate: 0, scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.4)' }
    );
  };

  // Avoid layout shift but do not render SVG during SSR
  if (!mounted) {
    return <div className="w-10 h-10 shrink-0" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/10 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/20 transition-all duration-300 relative z-50 overflow-hidden cursor-pointer"
      aria-label="Alternar Tema"
    >
      <div className="theme-icon flex items-center justify-center w-full h-full">
        {theme === 'light' ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </div>
    </button>
  );
}
