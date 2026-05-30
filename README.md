# iNariño - Plataforma E-commerce Premium

Este proyecto es una aplicación web de alta gama (Landing Page + Catálogo) para una tienda de productos Apple, construida con Next.js, Tailwind CSS y animaciones avanzadas con GSAP.

## Estado Actual (Implementado)

La aplicación cuenta actualmente con una **Landing Page** altamente pulida, diseñada para dar una sensación de lujo y confianza (estilo Apple):
1. **Navbar Transparente y Dinámico**: Efecto glassmorphism que reacciona al scroll y al final del video principal.
2. **Hero Section (Video)**: Un video inmersivo a pantalla completa que presenta la marca.
3. **Bento Grid**: Una cuadrícula moderna que destaca las principales ventajas competitivas.
4. **Sección de Garantías (Scroll Animations)**: Tarjetas interactivas con un efecto 3D avanzado donde los dispositivos (AirPods Max, iPad, iPhone 17 Pro Max y AirPods Pro) emergen físicamente de detrás de las tarjetas al hacer scroll, gracias a la integración de GSAP ScrollTrigger.
5. **Sección de Confianza (Sticky)**: Una sección con efecto "sticky" (pegajoso) que permite revelar suavemente el contenido inferior.
6. **Smooth Scrolling**: Implementado en toda la página usando Lenis para una navegación fluida.

## Próximas Implementaciones (El Plan)

La siguiente fase del proyecto se enfocará en transformar la Landing Page estática en una plataforma de e-commerce dinámica:

### 1. Página de Catálogo (`/catalogo`)
- **Enrutamiento**: Conectar el enlace "Catálogo" del Navbar para que dirija a una nueva página dedicada.
- **UI/UX**: Diseñar una cuadrícula de productos premium con filtros y búsqueda.
- **Datos Dinámicos**: Los productos se cargarán dinámicamente en lugar de estar escritos directamente en el código.

### 2. Panel de Administrador (`/admin`)
- **Acceso**: Una ruta oculta y protegida donde el dueño de la tienda pueda gestionar su inventario.
- **Subida de Catálogo**: Formularios para agregar nuevos productos (título, descripción, precio, categoría, imágenes).
- **Gestión**: Opciones para editar o eliminar productos existentes.
- **Infraestructura**: Integración con una base de datos (y almacenamiento de imágenes) para guardar el catálogo real.

---
*Proyecto en desarrollo continuo, priorizando animaciones fluidas y diseño premium.*
