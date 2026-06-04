# Carpeta `src/pages/` - Páginas y Vistas del Portal

Este directorio contiene las pantallas y páginas completas de la aplicación. Se dividen en páginas **públicas** (para cualquier visitante o colegiado) y páginas de **administración** (`backoffice`), protegidas por roles.

---

## 📂 Directorio Raíz (`pages/`)

### 🏠 Portal Principal y Navegación
- **[`Home.jsx`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/pages/Home.jsx):**
  Página de aterrizaje (landing page) institucional. Muestra accesos directos, carruseles de anuncios y herramientas rápidas.
- **[`Login.jsx`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/pages/Login.jsx):**
  Pantalla de inicio de sesión segura para los abogados matriculados y administradores.

### 📋 Herramientas Legales e Institucionales
- **[`DerechoFijo.jsx`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/pages/DerechoFijo.jsx):**
  Calculadora y generador de comprobantes para el cobro del Derecho Fijo.
- **[`Liquidaciones.jsx`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/pages/Liquidaciones.jsx):**
  Módulo de tasación de tasas de justicia y liquidaciones de honorarios profesionales.
- **[`Coworking.jsx`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/pages/Coworking.jsx):**
  Página de reserva y visualización de salas de coworking del Colegio. Guía al abogado a través de la elección de la sala, horarios, acompañantes y datos de contacto.
- **[`Nosotros.jsx`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/pages/Nosotros.jsx):**
  Sección institucional que presenta la reseña del Colegio y la comisión directiva actual.
- **[`Contacto.jsx`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/pages/Contacto.jsx):**
  Formulario de sugerencias/contacto e información de geolocalización física.

### 📰 Publicaciones
- **[`Novedades.jsx`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/pages/Novedades.jsx) & [`VerNoticia.jsx`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/pages/VerNoticia.jsx):**
  Directorio de noticias y vista de lectura en detalle de un artículo seleccionado.
- **[`LinksInteres.jsx`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/pages/LinksInteres.jsx):**
  Colección de hipervínculos hacia juzgados, boletines oficiales y entidades judiciales.
- **[`Profesionales.jsx`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/pages/Profesionales.jsx):**
  Directorio público de búsqueda y consulta de abogados matriculados.

### 💳 Estados de Pago (Call-backs)
- **[`PaymentSuccess.jsx`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/pages/PaymentSuccess.jsx) & [`PaymentFailure.jsx`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/pages/PaymentFailure.jsx):**
  Pantallas de redireccionamiento tras finalizar el proceso de pago en la pasarela de Mercado Pago.

---

## 📂 Subdirectorios

### 🔒 [`backoffice/`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/pages/backoffice) - Panel de Control Interno
Contiene los módulos protegidos para la administración del portal:
- **`rooms/` ([`BookRoom.jsx`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/pages/backoffice/rooms/BookRoom.jsx)):**
  Módulo de reservas del backoffice. Permite tanto reservar turnos como administrar las salas físicas (CRUD completo), incluyendo la subida interactiva de imágenes locales.
- **[`DevPanel.jsx`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/pages/backoffice/DevPanel.jsx):**
  Panel exclusivo para el desarrollador. Permite visualizar los logs de errores SQL de base de datos en caliente y desactivar la validación del cobro de membresía del coworking.
- **`UserManager.jsx` & `ProfileManager.jsx`:**
  Gestores del directorio de usuarios internos, asignación de perfiles y permisos del backoffice.

### 📜 `Edictos/` - Publicación Oficial
- Pantallas para la visualización, descarga y búsqueda avanzada de edictos judiciales cargados por los letrados.
