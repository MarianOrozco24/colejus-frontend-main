export const getNewsImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const apiBase = process.env.REACT_APP_BACKEND_URL || "";
  const origin = apiBase.replace(/\/api\/?$/, "");
  const normalizedPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;

  return `${origin}${normalizedPath}`;
};
