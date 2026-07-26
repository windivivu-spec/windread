import type { Barber, Booking, Branch, Service } from "./types";

export const branches: Branch[] = [
  {
    id: "an-thuong",
    name: "Cơ sở 1",
    address: "35 - 37 An Thượng 29, Ngũ Hành Sơn, Đà Nẵng",
    phone: "0393549656",
    image: "/images/thumb1.webp"
  },
  {
    id: "chuong-duong",
    name: "Cơ sở 2",
    address: "223 Chương Dương, Ngũ Hành Sơn, Đà Nẵng",
    phone: "0393549656",
    image: "/images/branch2.jpg"
  }
];

export const services: Service[] = [
  {
    id: "haircut",
    name: "Cắt tóc",
    description: "Classic cut, crop hoặc fade gọn theo form mặt.",
    price: 220000,
    durationMinutes: 30
  },
  {
    id: "wash-cut",
    name: "Cắt + gội",
    description: "Cắt tóc, gội sạch và finish bằng sản phẩm giữ nếp nhẹ.",
    price: 280000,
    durationMinutes: 45
  },
  {
    id: "shave",
    name: "Cạo mặt",
    description: "Khăn nóng, dao cạo classic và balm làm dịu da.",
    price: 180000,
    durationMinutes: 30
  },
  {
    id: "perm",
    name: "Uốn tóc",
    description: "Tư vấn texture, uốn form và chăm tóc sau xử lý.",
    price: 750000,
    durationMinutes: 90
  },
  {
    id: "color",
    name: "Nhuộm tóc",
    description: "Nhuộm tone street, highlight hoặc xử lý màu theo nền tóc.",
    price: 900000,
    durationMinutes: 120
  },
  {
    id: "custom-combo",
    name: "Combo tùy chỉnh",
    description: "Crew tư vấn combo dread, fade, beard hoặc treatment theo nhu cầu.",
    price: 650000,
    durationMinutes: 90
  },
  {
    id: "fix-dread",
    name: "Fix Dread",
    description: "Bảo dưỡng chân dread, siết form và làm gọn phần tóc bung.",
    price: 650000,
    durationMinutes: 90
  },
  {
    id: "dread-lock",
    name: "Dread Lock",
    description: "Tư vấn form dread, chia section và tạo lock theo nền tóc hiện tại.",
    price: 900000,
    durationMinutes: 120
  },
  {
    id: "braids",
    name: "Braids",
    description: "Tết braids gọn, giữ form chắc và finish theo style cá nhân.",
    price: 850000,
    durationMinutes: 120
  }
];

const allServiceIds = services.map((service) => service.id);

const weekdayHours = {
  monday: { start: "10:00", end: "21:00" },
  tuesday: { start: "10:00", end: "21:00" },
  wednesday: { start: "10:00", end: "21:00" },
  thursday: { start: "10:00", end: "21:00" },
  friday: { start: "10:00", end: "21:00" },
  saturday: { start: "10:00", end: "21:00" },
  sunday: { start: "12:00", end: "18:00" }
} as const;

export const barbers: Barber[] = [
  {
    id: "kai-loc",
    branchId: "an-thuong",
    name: "Kai Loc",
    email: "kai.loc@windread.vn",
    avatar: "/images/barber/barber1.png",
    title: "Locs Expert",
    specialties: ["Locs", "Uốn texture", "Combo street reset"],
    serviceIds: allServiceIds,
    workingHours: weekdayHours
  },
  {
    id: "minh-fade",
    branchId: "chuong-duong",
    name: "Minh Fade",
    email: "minh.fade@windread.vn",
    avatar: "/images/barber/barber2.png",
    title: "Fade Specialist",
    specialties: ["Clean fade", "Classic cut", "Line up"],
    serviceIds: allServiceIds,
    workingHours: weekdayHours
  },
  {
    id: "ryo-beard",
    branchId: "chuong-duong",
    name: "Ryo Beard",
    email: "ryo.beard@windread.vn",
    avatar: "/images/barber/barber3.png",
    title: "Beard & Shave",
    specialties: ["Hot towel", "Cạo mặt", "Beard shape"],
    serviceIds: allServiceIds,
    workingHours: weekdayHours
  },
  {
    id: "linh-color",
    branchId: "an-thuong",
    name: "Linh Color",
    email: "linh.color@windread.vn",
    avatar: "/images/barber/barber4.png",
    title: "Color Artist",
    specialties: ["Nhuộm tóc", "Uốn tóc", "Treatment"],
    serviceIds: allServiceIds,
    workingHours: weekdayHours
  },
  {
    id: "bao-crop",
    branchId: "chuong-duong",
    name: "Bao Crop",
    email: "bao.crop@windread.vn",
    avatar: "/images/barber/barber5.png",
    title: "Crop & Texture",
    specialties: ["Textured crop", "Layer gọn", "Wash finish"],
    serviceIds: allServiceIds,
    workingHours: weekdayHours
  },
  {
    id: "son-line",
    branchId: "an-thuong",
    name: "Son Line",
    email: "son.line@windread.vn",
    avatar: "/images/barber/barber6.png",
    title: "Line-up Artist",
    specialties: ["Line up", "Skin fade", "Cạo mặt"],
    serviceIds: allServiceIds,
    workingHours: weekdayHours
  },
  {
    id: "hieu-wave",
    branchId: "chuong-duong",
    name: "Hieu Wave",
    email: "hieu.wave@windread.vn",
    avatar: "/images/barber/barber7.png",
    title: "Wave Stylist",
    specialties: ["Uốn tóc", "Nhuộm tone trầm", "Treatment"],
    serviceIds: allServiceIds,
    workingHours: weekdayHours
  }
];

export const seedBookings: Booking[] = [
  {
    id: "WD-260706-1015",
    branchId: "an-thuong",
    serviceId: "wash-cut",
    barberId: "son-line",
    customerName: "Khách đã đặt",
    customerPhone: "0393549656",
    startTime: "2026-07-06T10:30:00+07:00",
    endTime: "2026-07-06T11:15:00+07:00",
    status: "confirmed",
    guestCount: 1,
    createdAt: "2026-07-05T09:00:00+07:00"
  },
  {
    id: "WD-260706-1600",
    branchId: "chuong-duong",
    serviceId: "color",
    barberId: "hieu-wave",
    customerName: "Khách đã đặt",
    customerPhone: "0900000000",
    startTime: "2026-07-06T15:00:00+07:00",
    endTime: "2026-07-06T17:00:00+07:00",
    status: "confirmed",
    guestCount: 1,
    createdAt: "2026-07-05T10:10:00+07:00"
  }
];
