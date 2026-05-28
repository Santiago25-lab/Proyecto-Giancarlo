import Navbar from '@/components/Navbar';
import CatalogGrid from '@/components/CatalogGrid';

export const metadata = {
  title: 'Catálogo | iNARIÑO — Dispositivos Premium',
  description: 'Explora nuestra selección exclusiva de dispositivos Apple con garantía y respaldo de seguridad.',
};

export default function CatalogoPage() {
  return (
    <main className="bg-white pt-20">
      <Navbar />
      <CatalogGrid />

      {/* Footer Simple */}
      <footer className="py-12 px-6 border-t border-black/5 text-center bg-black">
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} iNARIÑO. Todos los derechos reservados. <br />
          <span className="text-red-900/50">Built for Excellence.</span>
        </p>
      </footer>
    </main>
  );
}
