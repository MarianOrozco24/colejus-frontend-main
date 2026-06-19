export const buildNewsFormData = (data, imageFile) => {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("subtitle", data.subtitle);
  formData.append("date", data.date);
  formData.append("reading_duration", String(data.reading_duration));
  formData.append("content", data.content);

  const tagsPayload = Array.isArray(data.tags)
    ? data.tags.map((tag) => ({ uuid: tag.uuid }))
    : [];

  formData.append("tags", JSON.stringify(tagsPayload));

  if (imageFile) {
    formData.append("image", imageFile);
  }

  return formData;
};
