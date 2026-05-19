'use client';

import { motion } from 'framer-motion';
import { Shield, Smartphone, Headphones, Watch, Lock, Zap } from 'lucide-react';

const products = [
  {
    title: "iPhone Series",
    description: "Seguridad blindada en cada dispositivo.",
    icon: <Smartphone className="w-8 h-8 text-red-600" />,
    className: "md:col-span-2 md:row-span-2 bg-gray-50",
  },
  {
    title: "AirPods Pro",
    description: "Inmersión y autenticidad garantizada.",
    icon: <Headphones className="w-6 h-6 text-red-500" />,
    className: "md:col-span-1 md:row-span-1 bg-white shadow-sm border border-black/5",
  },
  {
    title: "Garantía Total",
    description: "Soporte 24/7 post-venta.",
    icon: <Shield className="w-6 h-6 text-red-500" />,
    className: "md:col-span-1 md:row-span-1 bg-white shadow-sm border border-black/5",
  },
  {
    title: "Accesorios",
    description: "Complementos originales.",
    icon: <Zap className="w-6 h-6 text-red-500" />,
    className: "md:col-span-1 md:row-span-2 bg-gradient-to-b from-white to-red-50",
  },
  {
    title: "Seguridad iNariño",
    description: "Nuestro sello de confianza.",
    icon: <Lock className="w-6 h-6 text-red-600" />,
    className: "md:col-span-1 md:row-span-1 bg-white shadow-sm border border-black/5",
  },
];

const BentoGrid = () => {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto bg-white">
      <div className="flex flex-col mb-12">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-4">
          CATÁLOGO <span className="text-red-600">PREMIUM</span>
        </h2>
        <p className="text-gray-500 max-w-md">
          Seleccionamos lo mejor de la tecnología con el respaldo de seguridad que solo nosotros ofrecemos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 0.98, translateY: -5 }}
            className={`
              ${product.className}
              p-8 rounded-3xl flex flex-col justify-between
              transition-all duration-300 hover:red-glow group
            `}
          >
            <div className="mb-4 group-hover:scale-110 transition-transform duration-500">
              {product.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-black mb-2">{product.title}</h3>
              <p className="text-gray-600 text-sm">{product.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default BentoGrid;
