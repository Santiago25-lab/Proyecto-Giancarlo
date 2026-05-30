'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { IPHONE_MODELS } from '@/lib/iphoneModels';
import { ArrowLeft, Upload, Smartphone, Headphones, Laptop, Tag, CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();

  // General fields
  const [category, setCategory] = useState('iphone');
  const [customName, setCustomName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  // iPhone specific fields
  const [selectedModelId, setSelectedModelId] = useState(IPHONE_MODELS[0].id);
  const [selectedColor, setSelectedColor] = useState(IPHONE_MODELS[0].colors[0]);
  const [selectedStorage, setSelectedStorage] = useState(IPHONE_MODELS[0].storages[0]);

  // Multiple Image Upload state (Max 7)
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Get current active iPhone model properties
  const activeModel = IPHONE_MODELS.find((m) => m.id === selectedModelId) || IPHONE_MODELS[0];

  // Update selected color and storage when active model changes
  useEffect(() => {
    setSelectedColor(activeModel.colors[0]);
    setSelectedStorage(activeModel.storages[0]);
  }, [selectedModelId, activeModel]);

  // Handle multiple image file selection
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Enforce max 7 images
      const totalImages = imageFiles.length + filesArray.length;
      if (totalImages > 7) {
        alert('Solo puedes subir un máximo de 7 imágenes por producto.');
        return;
      }

      const newFiles = [...imageFiles, ...filesArray];
      const newPreviews = [...imagePreviews, ...filesArray.map(file => URL.createObjectURL(file))];

      setImageFiles(newFiles);
      setImagePreviews(newPreviews);
    }
  };

  // Remove a selected image
  const removeImage = (indexToRemove: number) => {
    const updatedFiles = imageFiles.filter((_, idx) => idx !== indexToRemove);
    const updatedPreviews = imagePreviews.filter((_, idx) => idx !== indexToRemove);
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviews[indexToRemove]);

    setImageFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
  };

  // Upload multiple images to Supabase Storage
  const uploadAllImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const file of imageFiles) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
        uploadedUrls.push(data.publicUrl);
      } catch (err) {
        console.error('Error uploading one of the images:', err);
      }
    }

    return uploadedUrls;
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      // 1. Validate fields
      if (!price) {
        throw new Error('Por favor introduce el precio del producto.');
      }
      if (imageFiles.length === 0) {
        throw new Error('Por favor selecciona al menos una imagen (máximo 7).');
      }

      // 2. Resolve Name and Description based on category
      let finalName = '';
      let finalDescription = description;

      if (category === 'iphone') {
        finalName = `${activeModel.name} ${selectedStorage} - Color ${selectedColor}`;
        if (!finalDescription) {
          finalDescription = `Dispositivo original Apple de la línea ${activeModel.name}. Capacidad de ${selectedStorage} en un elegante color ${selectedColor}. Incluye garantía iNARIÑO.`;
        }
      } else {
        if (!customName) {
          throw new Error('Por favor introduce el nombre del producto.');
        }
        finalName = customName;
      }

      // 3. Upload images
      setUploading(true);
      const uploadedUrls = await uploadAllImages();
      
      if (uploadedUrls.length === 0) {
        throw new Error('No se pudo subir ninguna imagen. Intenta de nuevo.');
      }
      setUploading(false);

      // 4. Save to Supabase DB
      const productPrice = parseFloat(price.replace(/[^0-9]/g, ''));
      if (isNaN(productPrice)) {
        throw new Error('Formato de precio inválido.');
      }

      const { error: dbError } = await supabase.from('products').insert([
        {
          name: finalName,
          price: productPrice,
          category,
          image_url: uploadedUrls[0], // Primary image is the first one
          images: uploadedUrls,      // Full gallery of up to 7 images
          description: finalDescription,
          is_available: isAvailable,
        },
      ]);

      if (dbError) throw dbError;

      setStatusMessage({ type: 'success', text: '¡Producto agregado con éxito!' });
      
      // Redirect after 1.5 seconds
      setTimeout(() => {
        router.push('/admin');
      }, 1500);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error al guardar el producto.' });
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FBFBFD] text-black pt-28 pb-16 px-4 md:px-8">
      {/* Sleek Admin Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-black/5 z-50 px-6 flex items-center justify-between shadow-sm select-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-black text-white text-base">iN</div>
          <span className="font-extrabold text-lg text-black tracking-tight">iNARIÑO <span className="text-red-600 font-bold text-xs uppercase tracking-widest ml-1 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">Admin</span></span>
        </div>
        <Link href="/" className="inline-flex items-center gap-2 text-xs md:text-sm font-bold bg-black text-white hover:bg-gray-900 py-2 px-4 rounded-xl transition duration-300">
          Volver a la Web →
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link href="/admin" className="inline-flex items-center gap-2 text-gray-500 hover:text-red-600 transition duration-300 mb-8 font-semibold">
          <ArrowLeft className="w-4 h-4" /> Volver al panel de control
        </Link>

        {/* Title */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-black">
            Agregar <span className="text-red-600">Nuevo Producto</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Completa los datos para desplegar el producto al catálogo web con hasta 7 fotografías.
          </p>
        </div>

        {/* Status Alerts */}
        {statusMessage && (
          <div
            className={`p-4 rounded-xl mb-8 flex items-center gap-3 border ${
              statusMessage.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
            <span className="font-semibold text-sm md:text-base">{statusMessage.text}</span>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-gray-100 p-6 md:p-8 rounded-3xl shadow-sm">
          
          {/* Category Select */}
          <div className="space-y-3">
            <label className="text-xs font-bold tracking-wider uppercase text-gray-400 block">Categoría del Producto</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'iphone', name: 'iPhone', icon: <Smartphone className="w-5 h-5" /> },
                { id: 'airpods', name: 'AirPods', icon: <Headphones className="w-5 h-5" /> },
                { id: 'mac', name: 'MacBook', icon: <Laptop className="w-5 h-5" /> },
                { id: 'accesorios', name: 'Otros', icon: <Tag className="w-5 h-5" /> },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all duration-300 font-bold ${
                    category === cat.id
                      ? 'bg-red-50 border-red-600 text-red-600 shadow-sm shadow-red-100'
                      : 'bg-[#FBFBFD] border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  {cat.icon}
                  <span className="text-xs md:text-sm">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* DYNAMIC FORMS SECTION */}
          {category === 'iphone' ? (
            <div className="space-y-6 border-t border-gray-100 pt-6">
              <h3 className="text-lg font-black text-red-600 uppercase tracking-tighter">Especificaciones del iPhone</h3>
              
              {/* iPhone Model Dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400 block">Modelo Base de iPhone</label>
                <select
                  value={selectedModelId}
                  onChange={(e) => setSelectedModelId(e.target.value)}
                  className="w-full bg-[#F5F5F7] border border-gray-200 rounded-xl p-3.5 text-black font-semibold focus:outline-none focus:border-red-600 transition"
                >
                  {IPHONE_MODELS.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color Grid Selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase text-gray-400 block">Color Oficial ({selectedColor})</label>
                <div className="flex flex-wrap gap-2">
                  {activeModel.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`py-2 px-4 rounded-xl border text-xs md:text-sm font-semibold transition-all duration-200 ${
                        selectedColor === color
                          ? 'bg-red-600 text-white border-red-600 shadow-sm'
                          : 'bg-[#F5F5F7] border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-black'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Storage Capacity Selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase text-gray-400 block">Almacenamiento ({selectedStorage})</label>
                <div className="flex flex-wrap gap-2">
                  {activeModel.storages.map((storage) => (
                    <button
                      key={storage}
                      type="button"
                      onClick={() => setSelectedStorage(storage)}
                      className={`py-2 px-5 rounded-xl border text-xs md:text-sm font-bold transition-all duration-200 ${
                        selectedStorage === storage
                          ? 'bg-red-600 text-white border-red-600 shadow-sm'
                          : 'bg-[#F5F5F7] border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-black'
                      }`}
                    >
                      {storage}
                    </button>
                  ))}
                </div>
              </div>

              {/* Autogenerated Name Preview */}
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                <span className="text-xs text-gray-400 block uppercase font-bold">Nombre del Producto Autogenerado:</span>
                <span className="text-base md:text-lg font-black text-black block mt-1">
                  {activeModel.name} {selectedStorage} - Color {selectedColor}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-6 border-t border-gray-100 pt-6">
              <h3 className="text-lg font-black text-red-600 uppercase tracking-tighter">Detalles del Dispositivo</h3>
              
              {/* Custom Name Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400 block">Nombre del Producto</label>
                <input
                  type="text"
                  placeholder="Ej. MacBook Pro M3 Max 16'' 1TB"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-[#F5F5F7] border border-gray-200 rounded-xl p-3.5 text-black font-semibold focus:outline-none focus:border-red-600 transition"
                  required={category !== 'iphone'}
                />
              </div>
            </div>
          )}

          {/* COMMON FIELDS: PRICE, DESCRIPTION, IMAGE */}
          <div className="space-y-6 border-t border-gray-100 pt-6">
            
            {/* Price Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400 block">Precio (COP)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-extrabold">$</span>
                <input
                  type="text"
                  placeholder="1.200.000"
                  value={price}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    if (val) {
                      setPrice(Number(val).toLocaleString('es-CO'));
                    } else {
                      setPrice('');
                    }
                  }}
                  className="w-full bg-[#F5F5F7] border border-gray-200 rounded-xl pl-8 pr-4 py-3.5 text-black focus:outline-none focus:border-red-600 transition font-black text-xl"
                  required
                />
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400 block">Descripción (Opcional)</label>
              <textarea
                placeholder={
                  category === 'iphone'
                    ? 'Déjalo vacío para autogenerar una descripción premium...'
                    : 'Detalles del estado, garantía, accesorios incluidos...'
                }
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#F5F5F7] border border-gray-200 rounded-xl p-3.5 text-black focus:outline-none focus:border-red-600 transition h-32 text-sm font-medium"
              />
            </div>

            {/* Multiple Images Upload Area */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase text-gray-400 block">Fotografías del Producto (Hasta 7)</label>
                <span className="text-xs font-bold text-red-600">{imageFiles.length} de 7 seleccionadas</span>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-gray-200 hover:border-red-600 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50/50 transition-all duration-300 relative group">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImagesChange}
                  disabled={imageFiles.length >= 7}
                  className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <Upload className="w-8 h-8 text-gray-400 group-hover:text-red-600 transition duration-300" />
                <span className="text-sm font-bold text-gray-700">Subir Imágenes</span>
                <span className="text-xs text-gray-400">Puedes seleccionar varios archivos a la vez.</span>
              </div>

              {/* Previews Grid */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-4">
                  {imagePreviews.map((preview, idx) => (
                    <div key={idx} className="bg-gray-50 border border-gray-150 rounded-2xl aspect-square flex items-center justify-center overflow-hidden relative group shadow-sm">
                      <img
                        src={preview}
                        alt={`Vista previa ${idx + 1}`}
                        className="w-full h-full object-contain p-1.5"
                      />
                      
                      {/* Order indicator */}
                      <span className="absolute top-1.5 left-1.5 bg-black/75 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        {idx + 1}
                      </span>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Availability Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl">
              <div>
                <span className="font-extrabold text-sm md:text-base block text-black">Producto Disponible</span>
                <span className="text-xs text-gray-400 font-medium">¿El producto se mostrará como disponible en stock?</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <Link
              href="/admin"
              className="w-1/2 text-center py-4 bg-gray-50 border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-100 hover:text-black transition duration-300"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="w-1/2 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition duration-300 shadow-lg shadow-red-600/10 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>{uploading ? 'Subiendo Fotos...' : 'Guardando...'}</span>
                </>
              ) : (
                'Desplegar Producto'
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
