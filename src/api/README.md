# Carpeta `src/api/` - Conectores y Consumo de API HTTP

Este directorio contiene las funciones encargadas de realizar las peticiones HTTP (utilizando `fetch` de JavaScript) hacia la API del backend. Centraliza y encapsula la lógica de comunicación para mantener las páginas de React limpias de llamadas directas.

---

## 📂 Estructura de Archivos y Funcionalidades

### 🔑 Autenticación y Liquidaciones
- **[`login.js`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/api/login.js):**
  Maneja la llamada al endpoint de autenticación (`/api/login`), enviando las credenciales (matrícula o correo y contraseña) y retornando el token de sesión JWT.
- **[`postDerechoFijo.js`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/api/postDerechoFijo.js):**
  Realiza las llamadas de envío y registro de formularios asociados al cobro y control del Derecho Fijo.
- **[`postLiquidaciones.js`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/api/postLiquidaciones.js):**
  Maneja el envío de datos para el cálculo y liquidación de costos de tasas de justicia y honorarios.

---

### 📂 Subdirectorios Modulares
Cada una de estas carpetas contiene las peticiones CRUD específicas para su respectiva sección en la base de datos:
- **`edicts/`:** Llamadas para listar, crear, editar y eliminar edictos judiciales.
- **`integrantes/`:** Consumo de la API para administrar a los miembros de la comisión del Colegio.
- **`news/`:** Peticiones HTTP para las noticias institucionales y carga de artículos.
- **`professionals/`:** Consultas al directorio de abogados matriculados.
- **`rates/`:** Peticiones para la administración de las tasas arancelarias.
- **`tags/`:** Llamadas de asignación y administración de etiquetas/categorías.
- **`trainings/`:** Administración de cursos, eventos y charlas de capacitación.

---

## 🔒 Manejo de Sesión (Tokens JWT)
La mayoría de las peticiones que modifican datos requieren autorización. Los conectores extraen automáticamente el token activo utilizando:
```javascript
const token = localStorage.getItem('authToken');
```
Y lo añaden en las cabeceras de la petición:
```javascript
headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
}
```
