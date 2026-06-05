# Colejus Frontend - Portal del Colegio de Abogados

Esta es la interfaz de usuario (cliente) del portal y sistema de gestión de coworking del Colegio de Abogados, desarrollada en **React** con **TailwindCSS** para un diseño moderno y responsivo, **React Router DOM** para la navegación y **React Icons**.

---

## 🛠️ Tecnologías Utilizadas

- **Framework:** React (Create React App)
- **Estilos:** TailwindCSS & Vanilla CSS
- **Navegación:** React Router DOM (Single Page Application)
- **Iconografía:** React Icons
- **HTTP Client:** Fetch API nativa (integrada con helpers modulares)

---

## 📂 Estructura del Proyecto

El código fuente principal está organizado dentro de la carpeta `src/`:

```text
colejus-frontend-main/
├── public/                 # HTML base y activos estáticos públicos (imágenes por defecto)
├── src/                    # Código de React
│   ├── api/                # Conectores HTTP para consumir los endpoints del backend
│   ├── components/         # Componentes React modulares y reutilizables (navs, footers, carousels)
│   ├── pages/              # Pantallas del portal público y del panel de administración (backoffice)
│   ├── styles/             # Hojas de estilo CSS personalizadas
│   ├── utils/              # Funciones de ayuda compartidas (helpers de permisos)
│   ├── App.js              # Configuración de rutas (React Router) y accesos
│   ├── index.js            # Punto de entrada de renderizado de React
│   └── App.css / index.css # Estilos globales base
├── package.json            # Configuración de scripts y dependencias de Node.js
├── tailwind.config.js      # Configuración de TailwindCSS
└── .env                    # Variables de entorno locales (no versionado)
```

---

## 🚀 Instalación y Ejecución Local

Sigue estos pasos para poner en marcha la aplicación en tu entorno de desarrollo local:

### 1. Requisitos Previos
- Tener instalado **Node.js (versión 16.0.0 o superior)** y **npm**.

### 2. Instalar Dependencias
Desde la raíz del directorio `colejus-frontend-main`, ejecuta:
```bash
npm install
```

### 3. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz de `colejus-frontend-main` con el siguiente contenido para apuntar al backend local:
```env
REACT_APP_BACKEND_URL=http://127.0.0.1:5000/api
```
*Nota: Si el backend está desplegado en producción, reemplaza con el dominio de producción correspondiente.*

### 4. Iniciar el Servidor de Desarrollo
Para levantar el servidor web local con recarga en caliente:
```bash
npm start
```
La aplicación se abrirá automáticamente en tu navegador en `http://localhost:3000`.

### 5. Compilación para Producción
Para compilar y optimizar los archivos estáticos listos para desplegar en un servidor de producción:
```bash
npm run build
```
La salida se generará dentro de la carpeta `build/`.

---

## 🔒 Permisos y Seguridad en el Cliente

El frontend gestiona la visualización condicional de secciones y botones mediante el token JWT almacenado en `localStorage`:
- **`hasPermission(permission)`**: Helper que verifica si los roles del usuario logueado contienen el permiso requerido.
- **Acceso a Backoffice:** Los usuarios con perfil `admin`, `administrador` o `dev` tienen acceso a los paneles de administración, edición de salas, estadísticas y visor de logs.
