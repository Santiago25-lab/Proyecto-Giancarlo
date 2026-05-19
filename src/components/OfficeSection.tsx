'use client';

import { motion } from 'framer-motion';

const OfficeSection = () => {
  return (
    <section className="py-24 px-6 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-red-600/5 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-black mb-6">
            MÁS QUE UNA TIENDA, <br />
            <span className="text-red-600">UN EQUIPO.</span>
          </h2>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Nuestras oficinas físicas en Nariño son el corazón de nuestra operación. Aquí, cada dispositivo es verificado bajo estrictos estándares de seguridad para garantizar que recibes exactamente lo que esperas.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-600/5 border border-red-600/10 flex items-center justify-center shrink-0">
                <span className="text-red-600 font-bold">01</span>
              </div>
              <div>
                <h4 className="text-black font-bold text-xl">Presencia Física</h4>
                <p className="text-gray-500">Visítanos y conoce nuestra sede principal.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-600/5 border border-red-600/10 flex items-center justify-center shrink-0">
                <span className="text-red-600 font-bold">02</span>
              </div>
              <div>
                <h4 className="text-black font-bold text-xl">Soporte Humano</h4>
                <p className="text-gray-500">Un equipo de expertos listos para asesorarte.</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative group"
        >
          <div className="aspect-video bg-gray-50 rounded-3xl overflow-hidden border border-black/5 relative shadow-2xl shadow-black/5">
            <div className="absolute inset-0 flex items-center justify-center text-gray-300 font-medium italic">
              [ FOTO OFICINA / EQUIPO ]
            </div>
            {/* Overlay glow on hover */}
            <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/5 transition-colors duration-500" />
          </div>
          
          {/* Floating badge */}
          <div className="absolute -bottom-6 -right-6 glass p-6 rounded-2xl red-glow hidden md:block">
            <p className="text-black font-bold text-center">
              CERTIFIED<br />
              <span className="text-red-600 text-xs tracking-[0.2em]">SECURITY</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OfficeSection;
