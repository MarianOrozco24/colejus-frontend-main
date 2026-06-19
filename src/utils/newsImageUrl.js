export const getNewsImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const apiBase = process.env.REACT_APP_BACKEND_URL || "";
  const origin = apiBase.replace(/\/api\/?$/, "");
  let normalizedPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;

  // Serve uploads through the /api prefix to ensure correct routing in production environments
  if (normalizedPath.startsWith("/uploads/")) {
    normalizedPath = `/api${normalizedPath}`;
  }

  return `${origin}${normalizedPath}`;
};
