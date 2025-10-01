const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];

export const isValidImageFile = (file) => {
  if (!file || !file.type) return false;
  return allowedImageTypes.includes(file.type);
};
