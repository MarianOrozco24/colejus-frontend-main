# Carpeta `src/utils/` - Funciones Auxiliares (Helpers)

Este directorio agrupa las funciones de ayuda globales y utilidades transversales que facilitan tareas lógicas repetitivas en múltiples vistas o componentes del cliente.

---

## 📂 Archivos del Directorio

### 🔐 [`hasPermission.js`](file:///c:/Users/Usuario/OneDrive/Documentos/GitHub/Colejus/colejus-frontend-main/src/utils/hasPermission.js)
* **Función:** Validador local de permisos granulares del usuario logueado.
* **Detalles:**
  - Extrae el listado de perfiles (`profiles`) desde el `localStorage`.
  - Evalúa si el usuario cuenta con el rol de desarrollador (`dev`) en cuyo caso autoriza de forma implícita (bypass completo).
  - Recorre los permisos asociados a los perfiles del usuario para verificar si posee la autorización solicitada (ej. `manage_rooms`, `view_revenue`).
  - Utilizado en la navegación condicional para ocultar o mostrar botones, enlaces del menú lateral, y proteger el enrutamiento de componentes del panel de control.
