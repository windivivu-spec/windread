import type { Barber, Booking, Branch, Service } from "./types";

export const branches: Branch[] = [
  {
    id: "an-thuong",
    name: "Cơ sở 2",
    address: "35 - 37 An Thượng 29, Ngũ Hành Sơn, Đà Nẵng",
    phone: "0393549656",
    image: "/images/thumb1.webp"
  },
  {
    id: "chuong-duong",
    name: "Cơ sở 1",
    address: "223 Chương Dương, Ngũ Hành Sơn, Đà Nẵng",
    phone: "0393549656",
    image: "/images/branch chuong duong.webp"
  }
];

const allServices: Service[] = [
  {
    id: "an-dreadlock",
    branchId: "chuong-duong",
    name: "Dreadlock",
    description: "Tạo dreadlock theo độ dài, mật độ và nền tóc; crew tư vấn trước khi làm.",
    price: 2000000,
    durationMinutes: 240
  },
  {
    id: "an-single-dread",
    branchId: "an-thuong",
    name: "Single Dread",
    description: "Làm một dread riêng lẻ, áp dụng cho độ dài 20–30cm.",
    price: 150000,
    durationMinutes: 30
  },
  {
    id: "an-cornrow",
    branchId: "an-thuong",
    name: "Cornrow 2–8 line",
    description: "Tết cornrow sát da đầu, 150.000đ mỗi line; áp dụng cho 2, 4, 6 hoặc 8 line.",
    price: 300000,
    durationMinutes: 90
  },
  {
    id: "an-braids-men",
    branchId: "an-thuong",
    name: "Braids nam",
    description: "Box braids hoặc pattern theo nền tóc và số section.",
    price: 1000000,
    durationMinutes: 180
  },
  {
    id: "an-braids-women",
    branchId: "an-thuong",
    name: "Braids nữ",
    description: "Box braids theo độ dài, mật độ và thiết kế mong muốn.",
    price: 3000000,
    durationMinutes: 300
  },
  {
    id: "an-locs-styling",
    branchId: "an-thuong",
    name: "Styling locs / braids",
    description: "Thiết kế kiểu locs, twist, cornrow hoặc braids tính theo giờ.",
    price: 400000,
    durationMinutes: 60
  },
  {
    id: "an-basic-perm",
    branchId: "an-thuong",
    name: "Uốn basic",
    description: "Uốn cơ bản; crew báo giá chính xác theo độ dài và chất tóc.",
    price: 300000,
    durationMinutes: 90
  },
  {
    id: "an-hair-bleach",
    branchId: "an-thuong",
    name: "Tẩy tóc",
    description: "Tẩy tóc theo session, kiểm tra nền tóc trước khi xử lý.",
    price: 250000,
    durationMinutes: 90
  },
  {
    id: "an-pair-dreads",
    branchId: "an-thuong",
    name: "Pair of Dreads",
    description: "Làm một cặp dread, áp dụng cho độ dài 30–40cm.",
    price: 300000,
    durationMinutes: 60
  },
  {
    id: "an-cornrow-10-16",
    branchId: "an-thuong",
    name: "Cornrow 10–16 line",
    description: "Tết cornrow sát da đầu, 130.000đ mỗi line; áp dụng cho 10, 12, 14 hoặc 16 line.",
    price: 1300000,
    durationMinutes: 180
  },
  {
    id: "an-curly-perm",
    branchId: "an-thuong",
    name: "Uốn xoăn",
    description: "Curly perm; giá 350.000–450.000đ tùy độ dài và chất tóc.",
    price: 350000,
    durationMinutes: 120
  },
  {
    id: "an-ruffled-perm",
    branchId: "an-thuong",
    name: "Uốn Ruffled",
    description: "Ruffled perm; giá 400.000–450.000đ tùy form tóc.",
    price: 400000,
    durationMinutes: 120
  },
  {
    id: "an-texture-perm",
    branchId: "an-thuong",
    name: "Uốn sâu / Texture Perm",
    description: "Uốn sâu tạo texture; giá 400.000–450.000đ tùy chất tóc.",
    price: 400000,
    durationMinutes: 120
  },
  {
    id: "an-premlock-perm",
    branchId: "an-thuong",
    name: "Uốn PremLock",
    description: "PremLock perm; giá 800.000–1.300.000đ tùy độ dài tóc.",
    price: 800000,
    durationMinutes: 150
  },
  {
    id: "an-afro-perm",
    branchId: "an-thuong",
    name: "Uốn Afro",
    description: "Afro perm; giá 1.000.000–1.500.000đ tùy độ dài và mật độ tóc.",
    price: 1000000,
    durationMinutes: 180
  },
  {
    id: "an-root-bleaching",
    branchId: "an-thuong",
    name: "Tẩy nối chân",
    description: "Tẩy nối chân tóc; giá 400.000–600.000đ theo nền tóc.",
    price: 400000,
    durationMinutes: 120
  },
  {
    id: "an-hair-pressed-down",
    branchId: "an-thuong",
    name: "Ép side",
    description: "Hair pressed down / ép side tóc.",
    price: 250000,
    durationMinutes: 60
  },
  {
    id: "an-hair-restore",
    branchId: "an-thuong",
    name: "Phục hồi tóc",
    description: "Hair restore cho tóc cần phục hồi; giá 300.000–400.000đ.",
    price: 300000,
    durationMinutes: 90
  },
  {
    id: "an-beard-dye",
    branchId: "an-thuong",
    name: "Nhuộm râu",
    description: "Beard dye; giá 150.000–250.000đ theo tình trạng râu.",
    price: 150000,
    durationMinutes: 45
  },
  {
    id: "an-black-dye",
    branchId: "an-thuong",
    name: "Nhuộm đen",
    description: "Black dye; giá 150.000–250.000đ theo nền tóc.",
    price: 150000,
    durationMinutes: 60
  },
  {
    id: "an-haircut-styling",
    branchId: "an-thuong",
    name: "Cắt tóc & tạo kiểu",
    description: "Cắt tóc, tạo kiểu với Uppercut; thời lượng 45 phút.",
    price: 150000,
    durationMinutes: 45
  },
  {
    id: "an-hot-cold-towel-shave",
    branchId: "an-thuong",
    name: "Cạo khăn nóng & lạnh",
    description: "Hot & cold towel shave; thời lượng 30 phút.",
    price: 120000,
    durationMinutes: 30
  },
  {
    id: "an-basic-beard-trim-side",
    branchId: "an-thuong",
    name: "Tỉa râu cơ bản / cắt side",
    description: "Tỉa râu cơ bản hoặc chỉ cắt phần side; thời lượng 25 phút.",
    price: 100000,
    durationMinutes: 25
  },
  {
    id: "an-hair-styling",
    branchId: "an-thuong",
    name: "Sấy & tạo kiểu tóc",
    description: "Hair styling sau khi gội hoặc cắt tóc.",
    price: 100000,
    durationMinutes: 30
  },
  {
    id: "an-hair-washing",
    branchId: "an-thuong",
    name: "Gội đầu thường",
    description: "Hair washing cơ bản.",
    price: 50000,
    durationMinutes: 30
  },
  {
    id: "an-locs-washing",
    branchId: "an-thuong",
    name: "Gội & làm sạch Dreads / Locs",
    description: "Giá 50.000–150.000đ tùy độ dài dread hoặc locs.",
    price: 50000,
    durationMinutes: 45
  },
  {
    id: "an-afro-wash-blowdry",
    branchId: "an-thuong",
    name: "Gội & sấy tóc Afro",
    description: "Afro hair wash & blow-dry; giá 100.000–200.000đ.",
    price: 100000,
    durationMinutes: 60
  },
  {
    id: "an-basic-hair-tattoo",
    branchId: "an-thuong",
    name: "Tattoo tóc cơ bản",
    description: "Basic hair tattoo; giá 50.000–150.000đ theo thiết kế.",
    price: 50000,
    durationMinutes: 30
  },
  {
    id: "an-gentlemans-set-1",
    branchId: "an-thuong",
    name: "Gentleman's Set I",
    description: "Cắt tóc + cạo khăn nóng/lạnh + Uppercut.",
    price: 250000,
    durationMinutes: 75
  },
  {
    id: "an-gentlemans-set-2",
    branchId: "an-thuong",
    name: "Gentleman's Set II",
    description: "Cắt tóc + gội + cạo khăn nóng/lạnh + Uppercut.",
    price: 290000,
    durationMinutes: 90
  },
  {
    id: "an-vip-gentlemans-combo",
    branchId: "an-thuong",
    name: "VIP Gentleman's Combo",
    description: "Chỉ nhận đặt lịch trước; tư vấn tạo kiểu, haircut/shave theo yêu cầu, khăn nóng/lạnh, grooming và quyền ưu tiên.",
    price: 390000,
    durationMinutes: 120
  },
  {
    id: "an-maintenance-1-worker-first-hour",
    branchId: "an-thuong",
    name: "Maintenance · 1 thợ · giờ đầu",
    description: "Bảo dưỡng dread/locs với 1 thợ, áp dụng cho giờ đầu tiên.",
    price: 400000,
    durationMinutes: 60
  },
  {
    id: "an-maintenance-1-worker-additional-hour",
    branchId: "an-thuong",
    name: "Maintenance · 1 thợ · giờ tiếp theo",
    description: "Bảo dưỡng dread/locs với 1 thợ, tính từ giờ thứ hai.",
    price: 300000,
    durationMinutes: 60
  },
  {
    id: "an-maintenance-2-workers-first-hour",
    branchId: "an-thuong",
    name: "Maintenance · 2 thợ · giờ đầu",
    description: "Bảo dưỡng dread/locs với 2 thợ, áp dụng cho giờ đầu tiên.",
    price: 600000,
    durationMinutes: 60
  },
  {
    id: "an-maintenance-2-workers-second-hour",
    branchId: "an-thuong",
    name: "Maintenance · 2 thợ · giờ thứ hai",
    description: "Bảo dưỡng dread/locs với 2 thợ, áp dụng cho giờ thứ hai.",
    price: 500000,
    durationMinutes: 60
  },
  {
    id: "an-maintenance-2-workers-additional-hour",
    branchId: "an-thuong",
    name: "Maintenance · 2 thợ · từ giờ thứ ba",
    description: "Bảo dưỡng dread/locs với 2 thợ, tính từ giờ thứ ba trở đi.",
    price: 400000,
    durationMinutes: 60
  },
  {
    id: "cd-haircut",
    branchId: "chuong-duong",
    name: "Cắt tóc & tạo kiểu",
    description: "Cắt tóc và tạo kiểu với pomade.",
    price: 120000,
    durationMinutes: 45
  },
  {
    id: "cd-sides-back-fade",
    branchId: "chuong-duong",
    name: "Fade hai bên & gáy",
    description: "Làm gọn phần hai bên và gáy.",
    price: 90000,
    durationMinutes: 30
  },
  {
    id: "cd-long-haircut",
    branchId: "chuong-duong",
    name: "Cắt tóc nam dài",
    description: "Cắt và chỉnh form cho tóc nam dài.",
    price: 200000,
    durationMinutes: 60
  },
  {
    id: "cd-wash-blowdry",
    branchId: "chuong-duong",
    name: "Gội & sấy tạo kiểu",
    description: "Gội, sấy và tạo kiểu với pomade.",
    price: 70000,
    durationMinutes: 30
  },
  {
    id: "cd-keratin-therapy",
    branchId: "chuong-duong",
    name: "Phục hồi Keratin",
    description: "Phục hồi Keratin cho tóc khô xơ; giá 200.000–400.000đ tùy tình trạng tóc.",
    price: 200000,
    durationMinutes: 60
  },
  {
    id: "cd-down-perm",
    branchId: "chuong-duong",
    name: "Ép side tóc",
    description: "Down perm làm gọn side tóc.",
    price: 250000,
    durationMinutes: 60
  },
  {
    id: "cd-basic-perm",
    branchId: "chuong-duong",
    name: "Uốn basic",
    description: "Uốn cơ bản; giá 300.000–400.000đ tùy độ dài và nền tóc.",
    price: 300000,
    durationMinutes: 90
  },
  {
    id: "cd-curly-perm",
    branchId: "chuong-duong",
    name: "Uốn xoăn",
    description: "Curly perm; giá 350.000–450.000đ tùy độ dài và độ xoăn mong muốn.",
    price: 350000,
    durationMinutes: 120
  },
  {
    id: "cd-premlock-perm",
    branchId: "chuong-duong",
    name: "Uốn PremLock",
    description: "Uốn PremLock; giá 800.000–1.200.000đ tùy nền tóc.",
    price: 800000,
    durationMinutes: 150
  },
  {
    id: "cd-afro-perm",
    branchId: "chuong-duong",
    name: "Uốn Afro",
    description: "Uốn Afro; giá 1.000.000–1.500.000đ tùy độ dài và mật độ tóc.",
    price: 1000000,
    durationMinutes: 180
  },
  {
    id: "cd-hair-color",
    branchId: "chuong-duong",
    name: "Nhuộm tóc thời trang",
    description: "Nhuộm màu thời trang; giá 250.000–350.000đ tùy nền tóc và màu chọn.",
    price: 250000,
    durationMinutes: 90
  },
  {
    id: "cd-beard-trim",
    branchId: "chuong-duong",
    name: "Tỉa râu",
    description: "Tạo form và làm gọn râu.",
    price: 80000,
    durationMinutes: 30
  },
  {
    id: "cd-hot-towel-shave",
    branchId: "chuong-duong",
    name: "Cạo khăn nóng & lạnh",
    description: "Cạo mặt với khăn nóng và lạnh.",
    price: 60000,
    durationMinutes: 30
  },
  {
    id: "cd-ruffled-perm",
    branchId: "chuong-duong",
    name: "Uốn Ruffled",
    description: "Ruffled perm; giá 400.000–500.000đ tùy form tóc.",
    price: 400000,
    durationMinutes: 120
  },
  {
    id: "cd-hair-bleaching",
    branchId: "chuong-duong",
    name: "Tẩy tóc",
    description: "Hair bleaching, tính theo mỗi lần tẩy.",
    price: 250000,
    durationMinutes: 90
  },
  {
    id: "cd-bleach-root-touch-up",
    branchId: "chuong-duong",
    name: "Tẩy nối chân tóc",
    description: "Bleach root touch-up; giá 500.000–900.000đ tùy nền tóc.",
    price: 500000,
    durationMinutes: 120
  },
  {
    id: "cd-hair-blackening",
    branchId: "chuong-duong",
    name: "Nhuộm đen",
    description: "Hair blackening; giá 150.000–250.000đ tùy nền tóc.",
    price: 150000,
    durationMinutes: 60
  },
  {
    id: "cd-beard-coloring",
    branchId: "chuong-duong",
    name: "Nhuộm râu",
    description: "Beard coloring; giá 150.000–250.000đ tùy tình trạng râu.",
    price: 150000,
    durationMinutes: 45
  },
  {
    id: "cd-basic-beard-coloring",
    branchId: "chuong-duong",
    name: "Nhuộm râu cơ bản",
    description: "Basic beard coloring.",
    price: 100000,
    durationMinutes: 30
  },
  {
    id: "cd-basic-hair-tattoo",
    branchId: "chuong-duong",
    name: "Tattoo tóc cơ bản",
    description: "Basic hair tattoo; giá 50.000–150.000đ theo thiết kế.",
    price: 50000,
    durationMinutes: 30
  },
  {
    id: "cd-hair-washing",
    branchId: "chuong-duong",
    name: "Gội đầu thư giãn",
    description: "Hair washing cơ bản.",
    price: 40000,
    durationMinutes: 30
  },
  {
    id: "cd-haircut-expert",
    branchId: "chuong-duong",
    name: "Cắt tóc bởi chuyên gia",
    description: "Chỉ nhận đặt lịch trước.",
    price: 160000,
    durationMinutes: 60
  },
  {
    id: "cd-basic-beard-trim-line-up",
    branchId: "chuong-duong",
    name: "Tỉa râu cơ bản / cạo viền",
    description: "Basic beard trim hoặc line-up.",
    price: 70000,
    durationMinutes: 25
  },
  {
    id: "cd-full-head-face-shave",
    branchId: "chuong-duong",
    name: "Cạo đầu / cạo mặt",
    description: "Full head shave hoặc face shave.",
    price: 70000,
    durationMinutes: 30
  }
];

// Keep both current branch catalogues available when Supabase is not configured.
export const services = allServices;

const serviceIdsByBranch = {
  "an-thuong": services.filter((service) => service.branchId === "an-thuong").map((service) => service.id),
  "chuong-duong": services.filter((service) => service.branchId === "chuong-duong").map((service) => service.id)
};

const weekdayHours = {
  monday: { start: "09:00", end: "19:00" },
  tuesday: { start: "09:00", end: "19:00" },
  wednesday: { start: "09:00", end: "19:00" },
  thursday: { start: "09:00", end: "19:00" },
  friday: { start: "09:00", end: "19:00" },
  saturday: { start: "09:00", end: "19:00" },
  sunday: { start: "09:00", end: "19:00" }
} as const;

export const barbers: Barber[] = [
  {
    id: "huy",
    branchId: "chuong-duong",
    name: "HUY",
    email: "kai.loc@windread.vn",
    avatar: "/images/barber/barber1.webp",
    title: "BARBER",
    specialties: ["Locs", "Uốn texture", "Combo street reset"],
    serviceIds: serviceIdsByBranch["chuong-duong"],
    workingHours: weekdayHours
  },
  {
    id: "van-huy",
    branchId: "chuong-duong",
    name: "VĂN HUY",
    email: "minh.fade@windread.vn",
    avatar: "/images/barber/barber2.webp",
    title: "BARBER",
    specialties: ["Clean fade", "Classic cut", "Line up"],
    serviceIds: serviceIdsByBranch["chuong-duong"],
    workingHours: weekdayHours
  },
  {
    id: "tinh",
    branchId: "chuong-duong",
    name: "TÌNH",
    email: "ryo.beard@windread.vn",
    avatar: "/images/barber/barber3.webp",
    title: "BARBER",
    specialties: ["Hot towel", "Cạo mặt", "Beard shape"],
    serviceIds: serviceIdsByBranch["chuong-duong"],
    workingHours: weekdayHours
  },
  {
    id: "phuc",
    branchId: "an-thuong",
    name: "PHÚC",
    email: "linh.color@windread.vn",
    avatar: "/images/barber/barber4.webp",
    title: "BARBER",
    specialties: ["Nhuộm tóc", "Uốn tóc", "Treatment"],
    serviceIds: serviceIdsByBranch["an-thuong"],
    workingHours: weekdayHours
  },
  {
    id: "thuan",
    branchId: "an-thuong",
    name: "THUẬN",
    email: "bao.crop@windread.vn",
    avatar: "/images/barber/barber5.webp",
    title: "BARBER",
    specialties: ["Textured crop", "Layer gọn", "Wash finish"],
    serviceIds: serviceIdsByBranch["an-thuong"],
    workingHours: weekdayHours
  },
  {
    id: "kien",
    branchId: "chuong-duong",
    name: "KIÊN",
    email: "son.line@windread.vn",
    avatar: "/images/barber/barber6.webp",
    title: "BARBER",
    specialties: ["Line up", "Skin fade", "Cạo mặt"],
    serviceIds: serviceIdsByBranch["chuong-duong"],
    workingHours: weekdayHours
  },
  {
    id: "duy",
    branchId: "an-thuong",
    name: "DUY",
    email: "hieu.wave@windread.vn",
    avatar: "/images/barber/barber7.webp",
    title: "BARBER",
    specialties: ["Uốn tóc", "Nhuộm tone trầm", "Treatment"],
    serviceIds: serviceIdsByBranch["an-thuong"],
    workingHours: weekdayHours
  },
  {
    id: "win-dread",
    branchId: "an-thuong",
    name: "WIN DREAD",
    email: "khoa.blend@windread.vn",
    avatar: "/images/barber/barber8.webp",
    title: "FOUNDER",
    specialties: ["Texture", "Nhuộm tone trầm", "Treatment"],
    serviceIds: serviceIdsByBranch["an-thuong"],
    workingHours: weekdayHours
  }
];

export const seedBookings: Booking[] = [
  {
    id: "WD-260706-1015",
    branchId: "chuong-duong",
    serviceId: "cd-haircut",
    barberId: "kien",
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
    branchId: "an-thuong",
    serviceId: "an-black-dye",
    barberId: "duy",
    customerName: "Khách đã đặt",
    customerPhone: "0900000000",
    startTime: "2026-07-06T15:00:00+07:00",
    endTime: "2026-07-06T17:00:00+07:00",
    status: "confirmed",
    guestCount: 1,
    createdAt: "2026-07-05T10:10:00+07:00"
  }
];
