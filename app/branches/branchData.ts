export type BranchProfile = {
  id: "an-thuong" | "chuong-duong";
  label: { vi: string; en: string };
  name: string;
  address: string;
  phone: string;
  image: string;
  gallery: BranchGalleryImage[];
  mapQuery: string;
  specialties: { vi: string[]; en: string[] };
  description: { vi: string; en: string };
  barberIds: string[];
};

export type BranchGalleryImage = {
  src: string;
  width: number;
  height: number;
};

export const branchProfiles: BranchProfile[] = [
  {
    id: "an-thuong",
    label: { vi: "Cơ sở 2", en: "Branch 02" },
    name: "WINDREAD An Thượng",
    address: "35 - 37 An Thượng 29, Ngũ Hành Sơn, Đà Nẵng",
    phone: "0393549656",
    image: "/images/an thuong store/space 1.jpg",
    gallery: [
      { src: "/images/an thuong store/space 1.jpg", width: 1566, height: 1051 },
      { src: "/images/an thuong store/space 6.webp", width: 1851, height: 1280 },
      { src: "/images/an thuong store/space 9.webp", width: 2600, height: 1734 },
      { src: "/images/an thuong store/space 3.jpg", width: 1616, height: 1080 },
      { src: "/images/an thuong store/space 7.jpg", width: 2600, height: 1734 },
      { src: "/images/an thuong store/space 2.jpg", width: 2743, height: 1833 },
      { src: "/images/an thuong store/space 5.jpg", width: 957, height: 640 },
      { src: "/images/an thuong store/space 4.webp", width: 1052, height: 701 },
      { src: "/images/an thuong store/space 8.webp", width: 2600, height: 1734 }
    ],
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
    image: "/images/chuong duong store/space1.webp",
    gallery: [
      { src: "/images/chuong duong store/space1.webp", width: 5584, height: 3723 },
      { src: "/images/chuong duong store/space9.webp", width: 6000, height: 4000 },
      { src: "/images/chuong duong store/space6.webp", width: 2048, height: 1366 },
      { src: "/images/chuong duong store/space8.webp", width: 4000, height: 6000 },
      { src: "/images/chuong duong store/space3.webp", width: 4000, height: 6000 },
      { src: "/images/chuong duong store/space4.webp", width: 3701, height: 5551 },
      { src: "/images/chuong duong store/space7.webp", width: 1080, height: 1616 },
      { src: "/images/chuong duong store/space2.webp", width: 6000, height: 4000 },
      { src: "/images/chuong duong store/space5.webp", width: 2048, height: 1366 }
    ],
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
