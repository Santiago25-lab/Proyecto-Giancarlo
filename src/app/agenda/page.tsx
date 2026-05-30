'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, CheckCircle2, ShieldCheck, User, Phone, Mail, HelpCircle, ArrowRight } from 'lucide-react';

const SERVICES = [
  { id: 'asesoria', name: 'Asesoría Comercial / Compra', description: 'Te ayudamos a elegir tu próximo iPhone, Mac o AirPods.' },
  { id: 'soporte', name: 'Soporte Técnico / Diagnóstico', description: 'Revisión y solución de problemas con tus dispositivos Apple.' },
  { id: 'entrega', name: 'Entrega Personalizada en Oficina', description: 'Recoge tu producto comprado directamente en nuestra sucursal.' },
  { id: 'garantia', name: 'Trámite de Garantía o Cambios', description: 'Validación de soporte posventa o cambios de equipo.' }
];

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
];

export default function AgendaPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState(SERVICES[0].name);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Entrance animations on Mount
  useEffect(() => {
    if (!success) {
      const ctx = gsap.context(() => {
        gsap.from('.vip-badge', {
          y: -25,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out'
        });
        gsap.from('.agenda-title', {
          y: 35,
          opacity: 0,
          duration: 1,
          delay: 0.1,
          ease: 'power3.out'
        });
        gsap.from('.agenda-desc', {
          y: 20,
          opacity: 0,
          duration: 1,
          delay: 0.25,
          ease: 'power3.out'
        });
        gsap.from('.step-card', {
          y: 45,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          delay: 0.35,
          ease: 'power3.out'
        });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [success]);

  // Pop-in animation on booking success screen
  useEffect(() => {
    if (success) {
      const ctx = gsap.context(() => {
        gsap.fromTo('.success-card',
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.2)' }
        );
        gsap.from('.success-icon', {
          scale: 0,
          opacity: 0,
          duration: 0.6,
          delay: 0.2,
          ease: 'back.out(1.7)'
        });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    try {
      if (!name || !whatsapp || !date || !time || !service) {
        throw new Error('Por favor completa todos los campos obligatorios.');
      }

      const { error } = await supabase.from('bookings').insert([
        {
          client_name: name,
          client_whatsapp: whatsapp,
          client_email: email || null,
          service,
          booking_date: date,
          booking_time: time,
          notes: notes || null,
          status: 'Pendiente'
        }
      ]);

      if (error) throw error;

      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al agendar la cita. Inténtalo de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  // Get tomorrow's date string as minimum for the date input
  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Only book starting tomorrow
    return today.toISOString().split('T')[0];
  };

  return (
    <main ref={containerRef} className="min-h-screen bg-[#FBFBFD] text-black pt-28 pb-16 px-4 md:px-8">
      <Navbar />

      <div className="max-w-3xl mx-auto">
        {/* Banner */}
        <div className="text-center mb-12">
          <span className="vip-badge text-red-600 font-bold uppercase tracking-wider text-xs md:text-sm flex items-center justify-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-red-600" /> Reserva Tu Asesoría VIP
          </span>
          <h1 className="agenda-title text-4xl md:text-6xl font-black tracking-tighter uppercase text-black">
            AGENDA TU <span className="text-red-600">CITA</span>
          </h1>
          <p className="agenda-desc text-gray-500 max-w-lg mx-auto mt-3 text-sm md:text-base font-medium">
            Reserva una cita presencial u online con nuestros asesores certificados Apple y recibe una atención a tu altura.
          </p>
        </div>

        {success ? (
          <div className="success-card bg-white border border-gray-100 rounded-3xl p-8 md:p-12 text-center shadow-lg space-y-6">
            <div className="success-icon w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-600">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-black">¡Cita aprobada!</h2>
              <p className="text-red-600 mt-2 font-bold text-lg md:text-xl">
                Te esperamos pronto.
              </p>
            </div>
            
            <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl text-left max-w-md mx-auto space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-200/50 pb-2">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Servicio</span>
                <span className="font-extrabold text-black">{service}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200/50 pb-2">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Fecha</span>
                <span className="font-extrabold text-black">{date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Hora</span>
                <span className="font-extrabold text-red-600">{time}</span>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-black text-white hover:bg-gray-900 font-bold py-3.5 px-8 rounded-2xl transition duration-300 shadow-md"
              >
                Volver al Inicio <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 md:p-8 space-y-8">
            
            {/* Error Message */}
            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-2 text-sm font-semibold">
                <HelpCircle className="w-5 h-5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Step 1: Select Service */}
            <div className="step-card space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">1. Selecciona el Tipo de Asistencia</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SERVICES.map((srv) => (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => setService(srv.name)}
                    className={`text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-32 ${
                      service === srv.name
                        ? 'bg-red-50/50 border-red-600 text-black shadow-sm'
                        : 'bg-[#FBFBFD] border-gray-200 text-gray-600 hover:border-black hover:text-black'
                    }`}
                  >
                    <span className="font-extrabold text-sm block md:text-base leading-snug">{srv.name}</span>
                    <span className="text-[11px] text-gray-400 font-medium leading-snug mt-2 line-clamp-2">{srv.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Date & Time Picker */}
            <div className="step-card grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
              {/* Date Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-red-600" /> 2. Elige el Día
                </label>
                <input
                  type="date"
                  min={getMinDate()}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#F5F5F7] border border-gray-200 rounded-xl p-3.5 text-black font-semibold focus:outline-none focus:border-red-600 transition"
                  required
                />
              </div>

              {/* Time Slots Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-red-600" /> 3. Selecciona la Hora ({time || 'Ninguna'})
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(slot)}
                      className={`py-2 px-1 rounded-xl border text-[11px] font-bold text-center transition-all ${
                        time === slot
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-[#F5F5F7] border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Client Info */}
            <div className="step-card space-y-4 border-t border-gray-100 pt-6">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">4. Información de Contacto</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1"><User className="w-3 h-3 text-red-600" /> Nombre Completo *</label>
                  <input
                    type="text"
                    placeholder="Ej. Santiago Díaz"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#F5F5F7] border border-gray-200 rounded-xl p-3 text-sm text-black font-semibold focus:outline-none focus:border-red-600 transition"
                    required
                  />
                </div>

                {/* WhatsApp */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1"><Phone className="w-3 h-3 text-red-600" /> WhatsApp / Teléfono *</label>
                  <input
                    type="tel"
                    placeholder="Ej. +57 3215886915"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full bg-[#F5F5F7] border border-gray-200 rounded-xl p-3 text-sm text-black font-semibold focus:outline-none focus:border-red-600 transition"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1"><Mail className="w-3 h-3 text-red-600" /> Correo Electrónico (Opcional)</label>
                <input
                  type="email"
                  placeholder="santiago@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F5F5F7] border border-gray-200 rounded-xl p-3 text-sm text-black font-semibold focus:outline-none focus:border-red-600 transition"
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Detalles Adicionales / Notas de la Cita (Opcional)</label>
                <textarea
                  placeholder="Dinos qué dispositivo tienes y breve descripción de tu necesidad..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#F5F5F7] border border-gray-200 rounded-xl p-3 text-sm text-black font-medium focus:outline-none focus:border-red-600 transition h-24"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="step-card pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition duration-300 shadow-lg shadow-red-600/10 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Agendando Tu Asesoría VIP...</span>
                  </>
                ) : (
                  'Reservar Mi Cita De Inmediato'
                )}
              </button>
            </div>

          </form>
        )}
      </div>
    </main>
  );
}
