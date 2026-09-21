export const WHATSAPP = {
  sanRafael: {
    label: "San Rafael",
    phone: "5492604600555",
  },
  alvear: {
    label: "Gral. Alvear",
    phone: "5492604118463",
  },
};

export const whatsappUrl = (phone, text) => {
  const base = `https://wa.me/${phone}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
};

export const isInternalPath = (href = "") => href.startsWith("/");

export const EXTERNAL_LINKS = {
  poderJudicial: {
    label: "Poder Judicial Mza",
    href: "https://jusmendoza.gob.ar/",
  },
  notificaciones: {
    label: "Notificaciones",
    href: "https://notificaciones.jus.mendoza.gov.ar/",
  },
  listasDiarias: {
    label: "Listas diarias",
    href: "https://www2.jus.mendoza.gov.ar/listas/proveidos/listas.php",
  },
  atm: {
    label: "ATM",
    href: "https://atm.mendoza.gov.ar/",
  },
  cajaForense: {
    label: "Caja Forense",
    href: "https://cfm.org.ar/",
  },
  faca: {
    label: "FACA",
    href: "https://faca.org.ar/",
  },
  tasasJudiciales: {
    label: "Tasas Judiciales",
    href: "https://jusmendoza.gob.ar/tasas-judiciales/",
  },
  valorJus: {
    label: "Valor de JUS",
    href: "https://jusmendoza.gob.ar/tasas-judiciales/",
  },
};

export const DIGITAL_TOOLS = [
  { name: "Derecho fijo", link: "/derecho-fijo" },
  { name: "Liquidaciones", link: "/liquidaciones" },
  { name: "Edictos", link: "/edictos" },
  { name: "Caja forense", link: EXTERNAL_LINKS.cajaForense.href },
  { name: "Poder Judicial Mza", link: EXTERNAL_LINKS.poderJudicial.href },
  { name: "Notificaciones", link: EXTERNAL_LINKS.notificaciones.href },
  { name: "Listas diarias", link: EXTERNAL_LINKS.listasDiarias.href },
  { name: "ATM", link: EXTERNAL_LINKS.atm.href },
];

export const INTEREST_LINKS = [
  EXTERNAL_LINKS.poderJudicial,
  EXTERNAL_LINKS.listasDiarias,
  EXTERNAL_LINKS.notificaciones,
  EXTERNAL_LINKS.atm,
  EXTERNAL_LINKS.faca,
  EXTERNAL_LINKS.tasasJudiciales,
  EXTERNAL_LINKS.cajaForense,
  EXTERNAL_LINKS.valorJus,
];

export const SEARCH_PAGES = [
  {
    path: "/derecho-fijo",
    title: "Derecho Fijo",
    content: "Información sobre derecho fijo y trámites relacionados",
  },
  {
    path: "/liquidaciones",
    title: "Liquidaciones",
    content: "Sistema de liquidaciones y pagos",
  },
  {
    path: "/edictos",
    title: "Edictos",
    content: "Publicación y consulta de edictos",
  },
  {
    path: "/novedades",
    title: "Novedades",
    content: "Últimas noticias y actualizaciones del Colegio",
  },
  {
    path: "/nosotros",
    title: "Nosotros",
    content: "Directorio, comisiones e institutos del Colegio",
  },
  {
    path: "/profesionales",
    title: "Profesionales",
    content: "Consulta de profesionales y matrícula",
  },
  {
    path: "/contacto",
    title: "Contacto",
    content: "WhatsApp, sedes y contacto del Colegio",
  },
  {
    path: "/links-de-interes",
    title: "Links de interés",
    content: "Poder Judicial, listas diarias, ATM y Caja Forense",
  },
  {
    path: "/backoffice/reservar-sala",
    title: "Reserva de Salas",
    content: "Reserva de salas y espacios de reunión",
  },
];
