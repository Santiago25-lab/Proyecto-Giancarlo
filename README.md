# iNARIÑO - Premium Apple Store & Tech Consulting

iNARIÑO es una plataforma web de e-commerce y asesoría tecnológica de alta gama, diseñada con un enfoque absoluto en la seguridad, exclusividad y experiencia de usuario (estilo Apple). Construida con **Next.js 15, Tailwind CSS, Supabase y GSAP**, ofrece una navegación ultra fluida y animaciones cinematográficas.

## 🌟 Características Principales

### 1. Interfaz Premium y Animaciones (GSAP + Framer Motion)
- **Modo Claro y Oscuro**: Soporte nativo para light/dark mode con transiciones suaves en todos los componentes.
- **Brillo Metálico Dinámico**: Títulos principales con un efecto de brillo metálico animado mediante máscaras CSS (mask-image) que se desplazan sobre el texto para dar un aspecto lujoso.
- **GSAP ScrollTrigger**: Animaciones de revelado sincronizadas con el scroll, incluyendo la aparición de tarjetas, rotación 3D, y efectos parallax.
- **Dispositivos Flotantes (Garantías)**: Animación avanzada donde modelos de dispositivos Apple (AirPods Max, iPad, iPhone 17 Pro, AirPods Pro) flotan en 3D interactuando visualmente con las tarjetas informativas.
- **Partículas Gravity (Sede Operativa)**: Un canvas interactivo que genera partículas atraídas magnéticamente por el cursor, inspirado en pantallas de autenticación de alta seguridad.
- **Cursor Personalizado**: Un seguidor de cursor invertido que acompaña la navegación del usuario dándole un toque interactivo único a la web.

### 2. Catálogo Dinámico con Base de Datos (`/catalogo`)
- **Conexión a Supabase**: Los productos se cargan directamente desde la base de datos de Supabase en tiempo real.
- **Buscador Inteligente**: Barra de búsqueda con autocompletado y filtrado instantáneo por nombre, categoría o especificaciones.
- **Fichas 360° (Modales)**: Al hacer clic en un producto, se abre un modal de pantalla completa con diseño inspirado en las fichas técnicas de Apple, galería de imágenes interactivas, precio y botón de compra directa a WhatsApp.

### 3. Sistema de Agendamiento (`/agenda`)
- **Reserva de Citas VIP**: Formulario animado que permite a los clientes agendar asesoría física o soporte técnico directamente en la sede de Nariño.
- **Almacenamiento Seguro**: Todas las solicitudes de citas se envían y registran de forma segura en la base de datos (Supabase).
- **Animaciones de Éxito**: Feedback visual cinematográfico al agendar exitosamente la cita.

### 4. Panel de Administración (`/admin`)
- **Gestión de Inventario**: Interfaz privada para añadir, editar o eliminar productos del catálogo.
- **Gestión de Citas**: Visualización de las citas agendadas por los clientes.
- **Autenticación (Futuro)**: Preparado para integrarse con Supabase Auth para restringir el acceso únicamente a los dueños.

## 🛠 Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **Estilos**: Tailwind CSS (con variables CSS personalizadas y soporte Dark Mode)
- **Animaciones**: GSAP (GreenSock), Framer Motion, y CSS Keyframes.
- **Backend & Base de Datos**: Supabase (PostgreSQL).
- **Iconografía**: Lucide React.
- **Scroll Suave**: Lenis (Studio Freight) para un scroll inercial y sedoso.

## 🚀 Ejecución del Proyecto

Para correr este proyecto en entorno local:

```bash
# 1. Instalar dependencias
pnpm install

# 2. Configurar variables de entorno (.env.local)
# Necesitarás las credenciales de tu proyecto de Supabase:
# NEXT_PUBLIC_SUPABASE_URL=tu_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key

# 3. Iniciar el servidor de desarrollo
pnpm run dev
```

---
*Desarrollado con obsesión por los detalles y la experiencia de usuario.*
