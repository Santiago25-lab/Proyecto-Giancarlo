import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import BentoGrid from '@/components/BentoGrid';
import GarantiasSection from '@/components/GarantiasSection';
import TrustSection from '@/components/TrustSection';
import OfficeSection from '@/components/OfficeSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="bg-white">
      <Navbar />
      <Hero />
      <BentoGrid />
      <GarantiasSection />
      <TrustSection />
      <OfficeSection />
      <Footer />
    </main>
  );
}
