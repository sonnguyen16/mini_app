import { env } from "../config/env";

export const getImageUrl = (imagePath: string) => {
  if (!imagePath) return "/deal1.jpg"; // fallback image
  if (imagePath.startsWith("http")) return imagePath; // already full URL
  return `${env.STORAGE_BASE_URL}/${imagePath}`;
};
