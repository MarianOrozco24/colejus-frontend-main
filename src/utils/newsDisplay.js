import { getNewsImageUrl } from "./newsImageUrl";

const FALLBACK_IMAGES = [
  "/image-1.jpeg",
  "/image-2.jpeg",
  "/image-5.jpeg",
  "/carousel-image.jpeg",
];

export const formatNewsDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const normalized = dateStr.includes("T") ? dateStr : `${dateStr}T12:00:00`;
    const date = new Date(normalized);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

export const getNewsCoverImage = (imagePath, index = 0) =>
  getNewsImageUrl(imagePath) || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

export const mapNewsItemForCard = (item, index = 0) => {
  const tags =
    Array.isArray(item.tags) && item.tags.length > 0
      ? item.tags
      : [{ name: "Novedad" }];

  return {
    uuid: item.uuid,
    title: item.title,
    subtitle: item.subtitle || "",
    date: item.date,
    dateLabel: formatNewsDate(item.date),
    reading_duration: item.reading_duration || 3,
    tags,
    image: getNewsCoverImage(item.image_path, index),
    link: `/noticias/${item.uuid}`,
    is_featured: Boolean(item.is_featured),
    is_active: item.is_active !== false,
  };
};
