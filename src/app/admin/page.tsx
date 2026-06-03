'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, ShoppingBag, Eye, Tag, RefreshCw, Calendar, Check, X, Phone, MessageSquare } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string;
  description: string;
  is_available: boolean;
  created_at: string;
}

interface Booking {
  id: string;
  client_name: string;
  client_whatsapp: string;
  client_email: string;
  service: string;
  booking_date: string;
  booking_time: string;
  status: string;
  notes: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'bookings'>('catalog');
  
  // Catalog State
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Bookings State
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null);

  // Fetch Catalog
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formatted = (data || []).map((p: any) => ({
        ...p,
        images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image_url || ''],
      }));
      setProducts(formatted);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch Bookings
  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('booking_date', { ascending: true })
        .order('booking_time', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchBookings();
  }, []);

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
    try {
      setDeletingProductId(id);
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      alert('Error al eliminar el producto');
      console.error(err);
    } finally {
      setDeletingProductId(null);
    }
  };

  // Update Booking Status
  const handleUpdateBookingStatus = async (id: string, status: 'Confirmada' | 'Cancelada') => {
    try {
      setUpdatingBookingId(id);
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      setBookings(
        bookings.map((b) => (b.id === id ? { ...b, status } : b))
      );
    } catch (err) {
      alert('Error al actualizar el estado de la cita');
      console.error(err);
    } finally {
      setUpdatingBookingId(null);
    }
  };

  // Delete Booking
  const handleDeleteBooking = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este registro de cita?')) return;
    try {
      setUpdatingBookingId(id);
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (error) throw error;
      setBookings(bookings.filter((b) => b.id !== id));
    } catch (err) {
      alert('Error al eliminar la cita');
      console.error(err);
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const getWhatsAppChatLink = (phone: string, clientName: string, date: string, time: string, service: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hola ${clientName}, te contactamos de iNARIÑO para validar tu reserva del día ${date} a las ${time} para el servicio de "${service}".`
    );
    return `https://wa.me/${cleanPhone.startsWith('57') ? cleanPhone : '57' + cleanPhone}?text=${text}`;
  };

  return (
    <main className="min-h-screen bg-[#FBFBFD] dark:bg-[#0a0a0c] text-black dark:text-white pt-28 pb-16 px-4 md:px-8 transition-colors duration-500">
      {/* Sleek Admin Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 z-50 px-6 flex items-center justify-between shadow-sm select-none transition-colors duration-500">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-black text-white text-base">iN</div>
          <span className="font-extrabold text-lg text-black dark:text-white tracking-tight">iNARIÑO <span className="text-red-600 font-bold text-xs uppercase tracking-widest ml-1 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-full border border-red-100 dark:border-red-500/20">Admin</span></span>
        </div>
        <Link href="/" className="inline-flex items-center gap-2 text-xs md:text-sm font-bold bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100 py-2 px-4 rounded-xl transition duration-300">
          Volver a la Web →
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-black/10 dark:border-white/5 transition-colors duration-500">
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-black dark:text-white transition-colors duration-500">
              Panel de <span className="text-red-600">Control</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium transition-colors duration-500">
              Administra y controla todos los módulos del ecosistema iNARIÑO.
            </p>
          </div>
          
          {/* Action Tabs / Module Swapper */}
          <div className="flex bg-gray-100 dark:bg-white/5 p-1.5 rounded-2xl border border-gray-200 dark:border-white/5 shrink-0 transition-colors duration-500">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition duration-300 cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-white dark:bg-white/10 text-black dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-red-600" /> Catálogo
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition duration-300 cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-white dark:bg-white/10 text-black dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4 text-red-600" /> Agenda Citas
              {bookings.filter((b) => b.status === 'Pendiente').length > 0 && (
                <span className="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0">
                  {bookings.filter((b) => b.status === 'Pendiente').length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* -------------------- TAB 1: CATALOG MODULE -------------------- */}
        {activeTab === 'catalog' && (
          <div className="space-y-10 animate-fade-in">
            {/* Catalog Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 p-6 rounded-2xl shadow-sm transition-colors duration-500">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider">Productos Totales</span>
                  <ShoppingBag className="w-6 h-6 text-red-500" />
                </div>
                <div className="text-3xl font-black text-black dark:text-white transition-colors duration-500">{loadingProducts ? '...' : products.length}</div>
              </div>
              <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 p-6 rounded-2xl shadow-sm transition-colors duration-500">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider">Categoría Principal</span>
                  <Tag className="w-6 h-6 text-red-500" />
                </div>
                <div className="text-3xl font-black text-black dark:text-white transition-colors duration-500">
                  {loadingProducts
                    ? '...'
                    : products.filter((p) => p.category.toLowerCase() === 'iphone').length > 0
                    ? 'iPhone'
                    : 'Ninguna'}
                </div>
              </div>
              <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 p-6 rounded-2xl shadow-sm flex flex-col justify-between transition-colors duration-500">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider">Acceso Rápido</span>
                  <Eye className="w-6 h-6 text-red-500" />
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Link href="/catalogo" className="text-red-600 dark:text-red-500 font-bold hover:underline text-sm">
                    Catálogo Público →
                  </Link>
                  <Link
                    href="/admin/nuevo"
                    className="bg-red-600 text-white font-bold text-xs py-2 px-4 rounded-xl hover:bg-red-700 transition"
                  >
                    Nuevo Producto
                  </Link>
                </div>
              </div>
            </div>

            {/* Catalog List */}
            <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-3xl shadow-sm overflow-hidden transition-colors duration-500">
              <div className="p-6 border-b border-gray-150 dark:border-white/5 flex justify-between items-center transition-colors duration-500">
                <h3 className="font-extrabold text-lg text-black dark:text-white uppercase tracking-tight">Ecosistema del Catálogo</h3>
                <button
                  onClick={fetchProducts}
                  className="p-2 border border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/10 rounded-xl transition cursor-pointer"
                  title="Actualizar catálogo"
                >
                  <RefreshCw className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {loadingProducts ? (
                <div className="py-20 text-center text-gray-500 flex flex-col items-center justify-center gap-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  <span className="font-semibold dark:text-gray-400">Cargando catálogo...</span>
                </div>
              ) : products.length === 0 ? (
                <div className="py-20 text-center text-gray-500">
                  <p className="text-lg font-semibold dark:text-gray-400">No hay productos en el catálogo todavía.</p>
                  <Link href="/admin/nuevo" className="text-red-600 dark:text-red-500 hover:underline mt-2 inline-block font-bold">
                    Sube tu primer producto aquí
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-white/5 text-gray-400 dark:text-gray-500 text-xs font-bold uppercase bg-gray-50/50 dark:bg-white/[0.02]">
                        <th className="p-4 md:p-5">Imagen</th>
                        <th className="p-4 md:p-5">Producto</th>
                        <th className="p-4 md:p-5">Categoría</th>
                        <th className="p-4 md:p-5">Precio</th>
                        <th className="p-4 md:p-5 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.03] transition duration-200">
                          <td className="p-4 md:p-5">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-center relative">
                              {product.image_url ? (
                                <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-1" />
                              ) : (
                                <ShoppingBag className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                              )}
                            </div>
                          </td>
                          <td className="p-4 md:p-5">
                            <div className="font-extrabold text-black dark:text-white text-base md:text-lg transition-colors duration-300">{product.name}</div>
                            {product.description && (
                              <div className="text-gray-500 dark:text-gray-400 text-xs md:text-sm line-clamp-1 max-w-xs mt-1 transition-colors duration-300">
                                {product.description}
                              </div>
                            )}
                            {!product.is_available && (
                              <span className="inline-block bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] px-2 py-0.5 rounded-full border border-red-100 dark:border-red-500/20 font-bold mt-1">
                                Agotado
                              </span>
                            )}
                          </td>
                          <td className="p-4 md:p-5">
                            <span className="bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-[10px] px-2.5 py-1 rounded-lg border border-gray-200 dark:border-white/10 uppercase font-bold tracking-wider">
                              {product.category}
                            </span>
                          </td>
                          <td className="p-4 md:p-5 font-black text-red-600 dark:text-red-400 text-base md:text-lg transition-colors duration-300">
                            ${product.price.toLocaleString('es-CO')} COP
                          </td>
                          <td className="p-4 md:p-5 text-right">
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              disabled={deletingProductId === product.id}
                              className="p-2.5 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-600 dark:hover:bg-red-600 hover:text-white dark:hover:text-white hover:border-red-600 transition duration-300 disabled:opacity-50"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* -------------------- TAB 2: BOOKINGS MODULE -------------------- */}
        {activeTab === 'bookings' && (
          <div className="space-y-10 animate-fade-in">
            {/* Booking Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 p-6 rounded-2xl shadow-sm transition-colors duration-500">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider">Citas Totales</span>
                  <Calendar className="w-6 h-6 text-red-500" />
                </div>
                <div className="text-3xl font-black text-black dark:text-white transition-colors duration-300">{loadingBookings ? '...' : bookings.length}</div>
              </div>
              <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 p-6 rounded-2xl shadow-sm transition-colors duration-500">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider">Pendientes de Aprobación</span>
                  <RefreshCw className="w-6 h-6 text-yellow-500 animate-spin-slow" />
                </div>
                <div className="text-3xl font-black text-yellow-600 dark:text-yellow-400 transition-colors duration-300">
                  {loadingBookings ? '...' : bookings.filter((b) => b.status === 'Pendiente').length}
                </div>
              </div>
              <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 p-6 rounded-2xl shadow-sm flex flex-col justify-between transition-colors duration-500">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider">Portal Público</span>
                  <Eye className="w-6 h-6 text-red-500" />
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Link href="/agenda" className="text-red-600 dark:text-red-400 font-bold hover:underline text-sm transition-colors duration-300">
                    Ir al Portal de Reservas →
                  </Link>
                </div>
              </div>
            </div>

            {/* Bookings List */}
            <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-3xl shadow-sm overflow-hidden transition-colors duration-500">
              <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center transition-colors duration-500">
                <h3 className="font-extrabold text-lg text-black dark:text-white uppercase tracking-tight transition-colors duration-300">Reservas Registradas</h3>
                <button
                  onClick={fetchBookings}
                  className="p-2 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 rounded-xl transition cursor-pointer"
                  title="Actualizar citas"
                >
                  <RefreshCw className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {loadingBookings ? (
                <div className="py-20 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center gap-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  <span className="font-semibold">Cargando reservas...</span>
                </div>
              ) : bookings.length === 0 ? (
                <div className="py-20 text-center text-gray-500 dark:text-gray-400">
                  <p className="text-lg font-semibold">No hay ninguna cita registrada en la base de datos.</p>
                  <Link href="/agenda" className="text-red-600 dark:text-red-400 hover:underline mt-2 inline-block font-bold transition-colors duration-300">
                    Crea tu primera cita en el portal público
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-white/5 text-gray-400 dark:text-gray-500 text-xs font-bold uppercase bg-gray-50/50 dark:bg-white/[0.02]">
                        <th className="p-4 md:p-5">Cliente / Contacto</th>
                        <th className="p-4 md:p-5">Fecha & Hora</th>
                        <th className="p-4 md:p-5">Servicio</th>
                        <th className="p-4 md:p-5 font-bold">Detalles / Notas</th>
                        <th className="p-4 md:p-5">Estado</th>
                        <th className="p-4 md:p-5 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.03] transition duration-200">
                          <td className="p-4 md:p-5">
                            <div className="font-extrabold text-black dark:text-white text-sm md:text-base transition-colors duration-300">{booking.client_name}</div>
                            <div className="text-gray-400 dark:text-gray-500 text-xs mt-0.5 font-bold flex items-center gap-1">
                              <Phone className="w-3 h-3 text-red-500 shrink-0" /> {booking.client_whatsapp}
                            </div>
                            {booking.client_email && (
                              <div className="text-gray-400 dark:text-gray-500 text-[11px] font-medium mt-0.5">{booking.client_email}</div>
                            )}
                          </td>
                          <td className="p-4 md:p-5">
                            <div className="font-bold text-gray-700 dark:text-gray-300 text-sm transition-colors duration-300">{booking.booking_date}</div>
                            <div className="text-red-600 dark:text-red-400 text-xs font-black mt-0.5 uppercase tracking-wider transition-colors duration-300">{booking.booking_time}</div>
                          </td>
                          <td className="p-4 md:p-5">
                            <span className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] px-2.5 py-1 rounded-lg border border-red-100 dark:border-red-500/20 font-bold uppercase tracking-wider">
                              {booking.service}
                            </span>
                          </td>
                          <td className="p-4 md:p-5 text-xs text-gray-600 dark:text-gray-400 max-w-xs font-medium leading-relaxed transition-colors duration-300">
                            {booking.notes ? booking.notes : <span className="text-gray-400 dark:text-gray-600 font-normal">Sin notas adicionales</span>}
                          </td>
                          <td className="p-4 md:p-5">
                            <span
                              className={`text-[10px] px-2.5 py-1 rounded-full border font-bold uppercase tracking-wider ${
                                booking.status === 'Confirmada'
                                  ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20'
                                  : booking.status === 'Cancelada'
                                  ? 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20'
                                  : 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20'
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="p-4 md:p-5 text-right">
                            <div className="flex justify-end gap-1.5">
                              {/* WhatsApp Contact Link */}
                              <a
                                href={getWhatsAppChatLink(
                                  booking.client_whatsapp,
                                  booking.client_name,
                                  booking.booking_date,
                                  booking.booking_time,
                                  booking.service
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-600 dark:hover:bg-green-600 hover:text-white dark:hover:text-white hover:border-green-600 transition duration-300"
                                title="Contactar por WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>
                              
                              {/* Confirm Button */}
                              {booking.status !== 'Confirmada' && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(booking.id, 'Confirmada')}
                                  disabled={updatingBookingId === booking.id}
                                  className="p-2 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-600 dark:hover:bg-green-600 hover:text-white dark:hover:text-white hover:border-green-600 transition duration-300 disabled:opacity-50"
                                  title="Confirmar Cita"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}
                              
                              {/* Cancel Button */}
                              {booking.status !== 'Cancelada' && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(booking.id, 'Cancelada')}
                                  disabled={updatingBookingId === booking.id}
                                  className="p-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-600 dark:hover:bg-red-600 hover:text-white dark:hover:text-white hover:border-red-600 transition duration-300 disabled:opacity-50"
                                  title="Cancelar Cita"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Delete Button */}
                              <button
                                onClick={() => handleDeleteBooking(booking.id)}
                                disabled={updatingBookingId === booking.id}
                                className="p-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-400 dark:text-gray-500 rounded-xl hover:bg-red-600 dark:hover:bg-red-600 hover:text-white dark:hover:text-white hover:border-red-600 transition duration-300 disabled:opacity-50"
                                title="Eliminar Registro"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
