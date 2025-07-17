/**
 * Returns the full image URL by prepending the backend base URL to a relative path.
 * If the path is already absolute (starts with http), returns it as is.
 * Allows specifying a default image for profiles or regular images.
 */
export function getImageUrl(path?: string, type: "profile" | "image" = "image"): string {
  const defaultProfile = "/images/default-profile.png";
  const defaultImage = "/images/placeholder_image.png";
  if (!path) return type === "profile" ? defaultProfile : defaultImage;
  if (path.startsWith("http")) return path;
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  return `${BASE_URL}${path}`;
}