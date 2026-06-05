# Carpeta `src/components/` - Componentes Reutilizables de Interfaz

Este directorio contiene los componentes visuales de React modulares y reutilizables. Ayudan a mantener el código ordenado y escalable, dividiendo la interfaz en piezas independientes de interfaz de usuario.

---

## 📂 Componentes y Funcionalidades

### 🧭 Navegación y Estructura (Layout)
- **[`NavBar.jsx`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/components/NavBar.jsx) & [`NavBarMobile.jsx`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/components/NavBarMobile.jsx) & [`ResponsiveNav.jsx`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/components/ResponsiveNav.jsx):**
  Implementa los menús de navegación superior. Cambia dinámicamente de acuerdo al estado de sesión del usuario y es completamente responsivo (con panel lateral desplegable en móviles).
- **[`Header.jsx`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/components/Header.jsx):**
  Cabecera institucional que muestra logos y datos de contacto del Colegio en la parte superior.
- **[`Footer.jsx`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/components/Footer.jsx) & [`MobileFooter.jsx`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/components/MobileFooter.jsx):**
  Pie de página de la aplicación con enlaces rápidos, redes sociales, horarios y mapa de ubicación.

### 🎠 Carruseles (Carousels)
- **[`HomeCarousel.jsx`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/components/HomeCarousel.jsx) & [`MobileHomeCarousel.jsx`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/components/MobileHomeCarousel.jsx):**
  Banners rotativos principales de la página de inicio que muestran anuncios importantes.
- **[`NewsCarousel.jsx`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/components/NewsCarousel.jsx):**
  Deslizador de novedades y últimas noticias del colegio.
- **[`CourtCarousel.jsx`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/components/CourtCarousel.jsx):**
  Presentación visual de juzgados y dependencias.

### 🔍 Filtros y Búsquedas
- **[`EdictosFilterBar.jsx`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/components/EdictosFilterBar.jsx):**
  Barra de herramientas de búsqueda de edictos (filtra por materia, juzgado, fecha de publicación y texto).
- **[`ProfesionalesFilterBar.jsx`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/components/ProfesionalesFilterBar.jsx):**
  Filtro avanzado para el directorio de abogados colegiados (permite buscar por especialidad, nombre, ubicación y estado de matrícula).

### 🏷️ Componentes Auxiliares
- **[`TagInput.jsx`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/components/TagInput.jsx):**
  Componente interactivo complejo para seleccionar y crear etiquetas dinámicamente en los formularios de administración de noticias o cursos.
- **[`ToolCard.jsx`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/components/ToolCard.jsx):**
  Tarjeta de acceso rápido para herramientas y calculadoras legales en la Home.
- **[`ContactCard.jsx`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/components/ContactCard.jsx):**
  Tarjeta informativa para desplegar datos de contacto de juzgados o dependencias específicas.
