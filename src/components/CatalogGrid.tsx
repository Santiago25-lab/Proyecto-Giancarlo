'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Smartphone, Headphones, Laptop, Tag, ShieldCheck, ShoppingBag, ArrowRight, X, ChevronLeft, ChevronRight, Check, Search } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string;
  images: string[];
  description: string;
  is_available: boolean;
}

const CATEGORIES = [
  { id: 'all', name: 'Todos', icon: null },
  { id: 'iphone', name: 'iPhone', icon: <Smartphone className="w-4 h-4" /> },
  { id: 'airpods', name: 'AirPods', icon: <Headphones className="w-4 h-4" /> },
  { id: 'mac', name: 'MacBook', icon: <Laptop className="w-4 h-4" /> },
  { id: 'accesorios', name: 'Otros Accesorios', icon: <Tag className="w-4 h-4" /> },
];

export default function CatalogGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Search & Autocomplete State
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  // Detail Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // GSAP animations for Header & Category Pills on Mount (using fromTo & clearProps for maximum safety)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.brand-badge', 
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', clearProps: 'all' }
      );
      gsap.fromTo('.brand-title', 
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.1, ease: 'power3.out', clearProps: 'all' }
      );
      gsap.fromTo('.brand-desc', 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.25, ease: 'power3.out', clearProps: 'all' }
      );
      gsap.fromTo('.search-bar-wrap', 
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, delay: 0.35, ease: 'power3.out', clearProps: 'all' }
      );
      gsap.fromTo('.category-pill', 
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, stagger: 0.06, delay: 0.45, ease: 'power3.out', clearProps: 'all' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // GSAP animation for product cards when filtered list changes
  useEffect(() => {
    if (!loading && filteredProducts.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo('.product-card', 
          {
            y: 40,
            opacity: 0,
            scale: 0.95
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: 'back.out(1.15)',
            overwrite: 'auto',
            clearProps: 'transform' // do not clear opacity to keep cards visible
          }
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [filteredProducts, loading]);

  // Autocomplete Recommendations logic
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSuggestions([]);
    } else {
      const q = searchQuery.toLowerCase();
      const matches = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
      setSuggestions(matches);
    }
  }, [searchQuery, products]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Ensure images is always an array
        const formattedData = (data || []).map((p: any) => ({
          ...p,
          images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image_url || ''],
        }));

        setProducts(formattedData);
        setFilteredProducts(formattedData);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    setFilteredProducts(result);
  }, [selectedCategory, products, searchQuery]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
    document.body.style.overflow = 'hidden'; // Disable scroll on body
  };

  const closeModal = () => {
    setSelectedProduct(null);
    document.body.style.overflow = 'unset'; // Re-enable scroll
  };

  // Generate dynamic WhatsApp link for buying
  const getWhatsAppLink = (productName: string, price: number) => {
    const formattedPrice = price.toLocaleString('es-CO');
    const text = encodeURIComponent(
      `¡Hola iNARIÑO! Me interesa el siguiente dispositivo de su catálogo:\n\n` +
      `📱 *Dispositivo:* ${productName}\n` +
      `💵 *Precio:* $${formattedPrice} COP\n\n` +
      `¿Tienen disponibilidad para entrega inmediata?`
    );
    return `https://wa.me/573215886915?text=${text}`;
  };

  // Next & Prev Image for Carousel
  const nextImage = (total: number) => {
    setActiveImageIndex((prev) => (prev + 1) % total);
  };

  const prevImage = (total: number) => {
    setActiveImageIndex((prev) => (prev - 1 + total) % total);
  };

  return (
    <section ref={containerRef} className="py-16 px-4 md:px-8 max-w-7xl mx-auto bg-[#FBFBFD] dark:bg-[#0a0a0c] min-h-screen transition-colors duration-500">
      {/* Upper Brand Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
        <div>
          <span className="brand-badge text-red-600 font-bold uppercase tracking-wider text-xs md:text-sm flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-600" /> 100% Originales & Garantizados
          </span>
          <h2 className="brand-title text-4xl md:text-6xl font-black tracking-tighter text-black dark:text-white mt-2 transition-colors duration-500">
            EXCLUSIVIDAD <br className="hidden md:inline" /> EN TU <span className="text-red-600">MANO</span>
          </h2>
        </div>
        <p className="brand-desc text-gray-500 dark:text-gray-400 max-w-md text-sm md:text-base font-medium transition-colors duration-500">
          Haz clic en cualquier producto para abrir su vista de detalles oficial, explorar fotos en 360° y ver su ficha técnica al estilo Apple.
        </p>
      </div>

      {/* Sleek Search Bar */}
      <div className="search-bar-wrap max-w-lg mb-10 relative z-30">
        <div className="relative flex items-center bg-white dark:bg-black/60 border border-gray-200 dark:border-white/10 focus-within:border-red-600 dark:focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-600/10 rounded-2xl shadow-sm px-4 py-3.5 transition-all duration-300 backdrop-blur-md bg-white/70 dark:bg-black/70">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Buscar por modelo, capacidad, color..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Allow click on suggestion
            className="w-full bg-transparent text-sm font-semibold text-black dark:text-white focus:outline-none placeholder-gray-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-400 transition cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dynamic Autocomplete Recommendations */}
        {showSuggestions && searchQuery.trim() !== '' && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-gray-150 dark:border-white/10 rounded-2xl shadow-2xl z-40 max-h-72 overflow-y-auto p-2 space-y-1 select-none animate-in fade-in slide-in-from-top-2 duration-200">
            {suggestions.length > 0 ? (
              suggestions.slice(0, 5).map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => {
                    openModal(prod);
                    setSearchQuery('');
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-red-50/50 dark:hover:bg-white/5 cursor-pointer transition duration-200"
                >
                  <img src={prod.image_url} alt={prod.name} className="w-10 h-10 object-contain bg-[#F5F5F7] dark:bg-white/5 rounded-lg p-0.5" />
                  <div className="flex-grow text-left">
                    <span className="block text-xs font-extrabold text-black dark:text-white line-clamp-1">{prod.name}</span>
                    <span className="text-[10px] text-red-600 font-bold">${prod.price.toLocaleString('es-CO')} COP</span>
                  </div>
                  <span className="text-[9px] bg-black dark:bg-white/20 text-white dark:text-white font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0">
                    {prod.category}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-gray-400 font-semibold">
                No se encontraron coincidencias para "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2.5 mb-12 overflow-x-auto pb-4 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`category-pill flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/10'
                : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/5 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white'
            }`}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid Display */}
      {loading ? (
        <div className="py-24 text-center text-gray-500 flex flex-col items-center justify-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
          <span className="font-semibold text-lg dark:text-gray-400">Cargando dispositivos exclusivos...</span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-[#121214] border border-gray-150 dark:border-white/5 rounded-3xl p-8 max-w-lg mx-auto shadow-sm transition-colors duration-500">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-black dark:text-white mb-2">No hay productos en esta categoría</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Pronto subiremos nuevos dispositivos de lujo a nuestro catálogo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                onClick={() => openModal(product)}
                className="product-card bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-xl hover:border-gray-200 dark:hover:border-white/10 transition-all duration-500 flex flex-col group cursor-pointer"
              >
                {/* Image Area with Red Glow on hover */}
                <div className="aspect-[4/3] bg-[#F5F5F7] dark:bg-white/5 relative overflow-hidden flex items-center justify-center p-6 border-b border-gray-50 dark:border-white/5 transition-colors duration-500">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <ShoppingBag className="w-16 h-16 text-gray-300" />
                  )}

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="bg-black/90 dark:bg-white/20 text-white dark:text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                      {product.category}
                    </span>
                    {!product.is_available && (
                      <span className="bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                        Agotado
                      </span>
                    )}
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-6 md:p-8 flex-grow flex flex-col justify-between space-y-6">
                  <div>
                    <h3 className="text-xl md:text-2xl font-extrabold text-black dark:text-white group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors duration-300 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 leading-relaxed line-clamp-2 transition-colors duration-500">
                      {product.description || 'Sin descripción disponible.'}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-50 dark:border-white/5 flex items-center justify-between transition-colors duration-500">
                    <div>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block">Precio Especial</span>
                      <span className="text-xl md:text-2xl font-black text-black dark:text-white transition-colors duration-500">
                        ${product.price.toLocaleString('es-CO')} <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">COP</span>
                      </span>
                    </div>

                    <button
                      className="inline-flex items-center gap-2 font-bold text-sm px-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-black dark:text-white group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 dark:group-hover:border-red-600 transition-all duration-300 shadow-sm"
                    >
                      Detalles <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* DYNAMIC APPLE-STYLE DETAILS MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 30, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white dark:bg-[#121214] border border-transparent dark:border-white/5 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative max-h-[90vh] md:h-[580px] transition-all duration-500"
              onClick={(e) => e.stopPropagation()} // Prevent closing on click inside
            >
              
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-20 p-2 bg-gray-150/80 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-white rounded-full transition duration-300 shadow-sm cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* LEFT SIDE: CAROUSEL GALLERY */}
              <div className="w-full md:w-[55%] bg-[#F5F5F7] dark:bg-white/5 p-6 flex flex-col justify-between relative min-h-[350px] md:min-h-0 md:h-full transition-colors duration-500">
                {/* Arrow Navigation */}
                {selectedProduct.images.length > 1 && (
                  <>
                    <button
                      onClick={() => prevImage(selectedProduct.images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2.5 bg-white/90 dark:bg-black/80 hover:bg-white dark:hover:bg-black text-black dark:text-white rounded-full shadow-md transition cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5 font-bold" />
                    </button>
                    <button
                      onClick={() => nextImage(selectedProduct.images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2.5 bg-white/90 dark:bg-black/80 hover:bg-white dark:hover:bg-black text-black dark:text-white rounded-full shadow-md transition cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5 font-bold" />
                    </button>
                  </>
                )}

                {/* Main Large Image Display */}
                <div className="flex-grow flex items-center justify-center h-[260px] md:h-[350px] mt-4">
                  <motion.img
                    key={activeImageIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    src={selectedProduct.images[activeImageIndex] || selectedProduct.image_url}
                    alt={selectedProduct.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                {/* Thumbnail selector */}
                {selectedProduct.images.length > 1 && (
                  <div className="flex justify-center gap-2 mt-4 overflow-x-auto py-2 scrollbar-none shrink-0">
                    {selectedProduct.images.map((image, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-14 h-14 rounded-xl border-2 bg-white dark:bg-white/5 flex items-center justify-center overflow-hidden transition-all shrink-0 cursor-pointer ${
                          activeImageIndex === idx ? 'border-red-600 scale-105 shadow-sm' : 'border-gray-200 dark:border-white/10 hover:border-gray-300'
                        }`}
                      >
                        <img src={image} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-contain p-0.5" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT SIDE: PRODUCT INFO & SPECS */}
              <div className="w-full md:w-[45%] flex flex-col bg-white dark:bg-[#121214] h-[350px] md:h-full justify-between transition-colors duration-500">
                
                {/* Scrollable Content Container */}
                <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-6 select-none scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10 hover:scrollbar-thumb-gray-300 dark:hover:scrollbar-thumb-white/20">
                  
                  {/* Category & Availability Badges */}
                  <div className="flex items-center gap-2">
                    <span className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 border border-red-100 dark:border-red-500/20 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      {selectedProduct.category}
                    </span>
                    <span className="bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/5 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      Original Apple
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-black text-black dark:text-white tracking-tight leading-tight">
                    {selectedProduct.name}
                  </h3>

                  {/* Pricing block */}
                  <div>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-bold block mb-1">Valor de Inversión</span>
                    <span className="text-2xl md:text-3xl font-black text-red-600 dark:text-red-500">
                      ${selectedProduct.price.toLocaleString('es-CO')} <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">COP</span>
                    </span>
                  </div>

                  {/* Specifications List */}
                  <div className="space-y-3.5 border-t border-b border-gray-100 dark:border-white/5 py-5 my-2">
                    <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Detalles Premium</h4>
                    
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center gap-2 text-xs md:text-sm text-gray-700 dark:text-gray-300">
                        <Check className="w-4 h-4 text-green-600 dark:text-green-500 shrink-0" />
                        <span><strong>Garantía iNARIÑO:</strong> Respaldo total post-venta.</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-gray-700 dark:text-gray-300">
                        <Check className="w-4 h-4 text-green-600 dark:text-green-500 shrink-0" />
                        <span><strong>Estado del Producto:</strong> 100% Homologado y Libre.</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-gray-700 dark:text-gray-300">
                        <Check className="w-4 h-4 text-green-600 dark:text-green-500 shrink-0" />
                        <span><strong>Verificación:</strong> Autenticidad certificada.</span>
                      </div>
                    </div>
                  </div>

                  {/* Description Box */}
                  <div className="space-y-1.5 pb-4">
                    <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Descripción del Producto</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm leading-relaxed font-semibold">
                      {selectedProduct.description || 'Este dispositivo de alta gama cuenta con todas las garantías de seguridad y respaldo oficial de iNARIÑO.'}
                    </p>
                  </div>
                </div>

                {/* STICKY BOTTOM ACTION BAR (Never gets cut off) */}
                <div className="p-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between gap-4 bg-white dark:bg-[#121214] shrink-0 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)] transition-colors duration-500">
                  <div className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                    <ShieldCheck className="w-4 h-4 text-red-600" /> Compra Protegida
                  </div>
                  
                  <a
                    href={getWhatsAppLink(selectedProduct.name, selectedProduct.price)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-grow inline-flex items-center justify-center gap-2 font-black text-xs md:text-sm px-5 py-3.5 rounded-2xl text-center transition-all duration-300 ${
                      selectedProduct.is_available
                        ? 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg shadow-red-600/15'
                        : 'bg-gray-105 dark:bg-white/5 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    }`}
                    onClick={(e) => {
                      if (!selectedProduct.is_available) e.preventDefault();
                    }}
                  >
                    {selectedProduct.is_available ? 'Comprar en WhatsApp' : 'Agotado'} <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
