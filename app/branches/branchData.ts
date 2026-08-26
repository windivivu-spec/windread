export type BranchProfile = {
  id: "an-thuong" | "chuong-duong";
  label: { vi: string; en: string };
  name: string;
  address: string;
  phone: string;
  image: string;
  gallery: string[];
  mapQuery: string;
  specialties: { vi: string[]; en: string[] };
  description: { vi: string; en: string };
  barberIds: string[];
};

export const branchProfiles: BranchProfile[] = [
  {
    id: "an-thuong",
    label: { vi: "Cơ sở 2", en: "Branch 02" },
    name: "WINDREAD An Thượng",
    address: "35 - 37 An Thượng 29, Ngũ Hành Sơn, Đà Nẵng",
    phone: "0393549656",
    image: "/images/thumb1.webp",
    gallery: ["/images/thumb1.webp", "/images/moment/moment6.webp", "/images/moment/DSC09798.webp"],
    mapQuery: "35-37 An Thuong 29, Ngu Hanh Son, Da Nang",
    specialties: {
      vi: ["Starter Locs", "Retwist & chăm locs", "Braids"],
      en: ["Starter Locs", "Retwist & loc care", "Braids"]
    },
    description: {
      vi: "Không gian chính cho locs, braid và những buổi tư vấn texture kỹ hơn.",
      en: "Our main space for locs, braids and deeper texture consultations."
    },
    barberIds: ["duy", "thuan", "phuc", "win-dread"]
  },
  {
    id: "chuong-duong",
    label: { vi: "Cơ sở 1", en: "Branch 01" },
    name: "WINDREAD Chương Dương",
    address: "223 Chương Dương, Ngũ Hành Sơn, Đà Nẵng",
    phone: "0393549656",
    image: "/images/branch chuong duong.webp",
    gallery: ["/images/branch chuong duong.webp", "/images/moment/DSC09946.webp", "/images/moment/moment20.webp"],
    mapQuery: "223 Chuong Duong, Ngu Hanh Son, Da Nang",
    specialties: {
      vi: ["Clean Fade", "Cắt & tạo texture", "Beard & shave"],
      en: ["Clean Fades", "Cuts & texture", "Beard & shave"]
    },
    description: {
      vi: "Điểm hẹn cho barber cổ điển, fade sắc và những form cắt gọn hàng ngày.",
      en: "A home for classic barbering, sharp fades and precise everyday cuts."
    },
    barberIds: ["huy", "van-huy", "tinh", "kien"]
  }
];

export function findBranchProfile(id: string) {
  return branchProfiles.find((branch) => branch.id === id);
}
