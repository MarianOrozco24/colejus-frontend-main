## 📝 Descripción

Describe de forma clara y concisa los cambios introducidos por este Pull Request, la justificación técnica de la solución y las pantallas modificadas o creadas.

---

## 🛠️ Tipo de Cambio

- [ ] Nueva funcionalidad o componente (`feat`)
- [ ] Corrección de errores de interfaz o lógica (`fix`)
- [ ] Refactorización o reorganización de componentes (`refactor`)
- [ ] Ajustes de diseño y estilos CSS / Tailwind (`style`)
- [ ] Documentación (`docs`)
- [ ] Actualización de dependencias (`chore`)

---

## 🔗 Tickets o Issues Asociados

- Asocia el issue o ticket correspondiente (ej. `Fixes #123`, `Closes #456`).

---

## 🖼️ Impacto Visual (Capturas de Pantalla / Grabaciones)

*Si este cambio modifica la UI o UX del portal, por favor adjunta capturas de pantalla o un video demostrando el comportamiento anterior y el actual:*

| Antes (Opcional) | Después (Obligatorio) |
| --- | --- |
| *Inserta imagen aquí* | *Inserta imagen aquí* |

---

## 📱 Responsividad y Compatibilidad

- [ ] Probado y verificado en pantallas de Escritorio.
- [ ] Probado y verificado en dispositivos móviles (responsivo verificado con `NavBarMobile`, `MobileFooter`, etc.).
- [ ] Sin desbordamientos de texto ni elementos rotos en diferentes resoluciones.

---

## 🧪 ¿Cómo se probó?

Describe los pasos seguidos para verificar manualmente la lógica de negocio y visual:
1. Loguearse con un usuario con rol X (ej: `dev`).
2. Navegar hacia la sección Y.
3. Realizar la acción Z (ej: subir un archivo de imagen de sala y guardar la sala).
4. Validar el resultado esperado.

---

## 📋 Lista de Verificación (Checklist)

- [ ] Mi código sigue las guías y estándares del proyecto.
- [ ] He realizado una auto-revisión de mi interfaz y código React.
- [ ] Las llamadas a la API se modularizaron correctamente en la carpeta `src/api/`.
- [ ] He comprobado los permisos del usuario usando el helper `hasPermission` cuando corresponde.
- [ ] He actualizado la documentación correspondiente (archivos `README.md` locales si aplica).
- [ ] La consola del navegador está limpia de advertencias graves de React (como `missing key props`) y errores.
- [ ] He verificado el comportamiento del componente con datos nulos o cargas pendientes (estados de cargando y errores).
