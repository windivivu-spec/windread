import type { Service, ServiceCategory } from "./types";

export const serviceCategories: Array<{
  id: ServiceCategory;
  label: string;
  labelEn: string;
  description: string;
  descriptionEn: string;
}> = [
  { id: "barber", label: "Barber", labelEn: "Barber", description: "Cắt, cạo, tạo kiểu & màu", descriptionEn: "Cuts, shaves, styling & colour" },
  { id: "dreadlocks", label: "Dreadlocks", labelEn: "Dreadlocks", description: "Làm mới, nối & chăm locs", descriptionEn: "New locs, extensions & care" },
  { id: "braids", label: "Braids", labelEn: "Braids", description: "Cornrows, box & knotless", descriptionEn: "Cornrows, box & knotless styles" },
  { id: "afro", label: "Afro", labelEn: "Afro", description: "Gội, gỡ rối & treatment", descriptionEn: "Washing, detangling & treatments" }
];

const dreadlockIds = ["dread", "locs", "maintenance"];
const braidIds = ["braid", "cornrow", "curl-ends", "hair-extension"];
const afroIds = ["afro"];

export function getServiceCategory(service: Pick<Service, "id" | "category">): ServiceCategory {
  if (service.category) return service.category;
  const id = service.id.toLowerCase();
  if (dreadlockIds.some((fragment) => id.includes(fragment))) return "dreadlocks";
  if (braidIds.some((fragment) => id.includes(fragment))) return "braids";
  if (afroIds.some((fragment) => id.includes(fragment))) return "afro";
  return "barber";
}
