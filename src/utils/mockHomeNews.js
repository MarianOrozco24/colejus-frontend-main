const images = [
  "/image-1.jpeg",
  "/image-2.jpeg",
  "/image-5.jpeg",
  "/carousel-image.jpeg",
];

const mockItem = ({ uuid, title, subtitle, date, featured, image, tag, content }) => ({
  uuid,
  title,
  subtitle,
  date,
  reading_duration: featured ? 3 : 2,
  is_featured: featured,
  is_active: true,
  image_path: image,
  tags: [{ name: tag }],
  content:
    content ||
    `<p>${subtitle}</p><p>Esta es una vista previa de diseño. El contenido definitivo se carga desde el panel de novedades.</p>`,
});

export const MOCK_FEATURED_NEWS = [
  mockItem({
    uuid: "preview-featured-1",
    title: "¿Sabías que ahora podés usar la sala de reuniones de nuestra sede?",
    subtitle:
      "Para atender clientes, firmar acuerdos, escrituras y reunirte con tu equipo.",
    date: "2026-06-26",
    featured: true,
    image: images[1],
    tag: "Destacada",
  }),
  mockItem({
    uuid: "preview-featured-2",
    title: "Actividades Día del Abogado",
    subtitle: "El Colegio lo construimos entre todos.",
    date: "2026-08-13",
    featured: true,
    image: images[2],
    tag: "Destacada",
  }),
  mockItem({
    uuid: "preview-featured-3",
    title: "Renovación de autoridades UIBA",
    subtitle: "Una nueva etapa para la representación institucional.",
    date: "2026-06-26",
    featured: true,
    image: images[0],
    tag: "Destacada",
  }),
  mockItem({
    uuid: "preview-featured-4",
    title: "Llamado a elecciones de la Comisión de Jóvenes Abogados",
    subtitle: "Elección de nuevas autoridades de la Comisión para el próximo período.",
    date: "2026-07-29",
    featured: true,
    image: images[3],
    tag: "Destacada",
  }),
];

export const MOCK_REST_NEWS = [
  mockItem({
    uuid: "preview-rest-1",
    title: "Receso judicial julio 2026",
    subtitle: "Horario de atención al público.",
    date: "2026-07-08",
    featured: false,
    image: images[3],
    tag: "Novedad",
  }),
  mockItem({
    uuid: "preview-rest-2",
    title: "Inhabilitación profesional",
    subtitle: "Comunicado importante.",
    date: "2026-06-24",
    featured: false,
    image: images[0],
    tag: "Novedad",
  }),
  mockItem({
    uuid: "preview-rest-3",
    title: "Capacitación en práctica profesional",
    subtitle: "Inscripciones abiertas para el próximo taller.",
    date: "2026-06-18",
    featured: false,
    image: images[1],
    tag: "Novedad",
  }),
  mockItem({
    uuid: "preview-rest-4",
    title: "Nuevo horario de mesa de entradas",
    subtitle: "Atención en sede central y delegaciones.",
    date: "2026-06-10",
    featured: false,
    image: images[2],
    tag: "Novedad",
  }),
];

export const shouldPreviewHomeNews = () => {
  if (process.env.NODE_ENV !== "development") return false;
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("preview") === "novedades";
};

export const findPreviewNewsById = (uuid) => {
  if (process.env.NODE_ENV !== "development" || !uuid) return null;
  return (
    [...MOCK_FEATURED_NEWS, ...MOCK_REST_NEWS].find((item) => item.uuid === uuid) ||
    null
  );
};
