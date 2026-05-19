import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import BentoGrid from '@/components/BentoGrid';
import OfficeSection from '@/components/OfficeSection';

export default function Home() {
  return (
    <main className="bg-white">
      <Navbar />
      <Hero />
      <BentoGrid />
      <OfficeSection />
      
      {/* Footer Simple */}
      <footer className="py-12 px-6 border-t border-white/5 text-center bg-black">
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} iNARIÑO. Todos los derechos reservados. <br />
          <span className="text-red-900/50">Built for Excellence.</span>
        </p>
      </footer>
    </main>
  );
}
