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
    image: "/images/branch2.jpg"
  }
];

export const services: Service[] = [
  {
    id: "an-dreadlock",
    branchId: "an-thuong",
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
    avatar: "/images/barber/barber1.webp",
    title: "Locs Expert",
    specialties: ["Locs", "Uốn texture", "Combo street reset"],
    serviceIds: [
      "an-dreadlock", "an-single-dread", "an-pair-dreads", "an-cornrow", "an-cornrow-10-16",
      "an-braids-men", "an-braids-women", "an-locs-styling", "an-locs-washing",
      "an-maintenance-1-worker-first-hour", "an-maintenance-1-worker-additional-hour",
      "an-maintenance-2-workers-first-hour", "an-maintenance-2-workers-second-hour", "an-maintenance-2-workers-additional-hour"
    ],
    workingHours: weekdayHours
  },
  {
    id: "minh-fade",
    branchId: "chuong-duong",
    name: "Minh Fade",
    email: "minh.fade@windread.vn",
    avatar: "/images/barber/barber2.webp",
    title: "Fade Specialist",
    specialties: ["Clean fade", "Classic cut", "Line up"],
    serviceIds: ["cd-haircut", "cd-sides-back-fade", "cd-long-haircut", "cd-wash-blowdry", "cd-basic-hair-tattoo", "cd-hair-washing", "cd-haircut-expert"],
    workingHours: weekdayHours
  },
  {
    id: "ryo-beard",
    branchId: "chuong-duong",
    name: "Ryo Beard",
    email: "ryo.beard@windread.vn",
    avatar: "/images/barber/barber3.webp",
    title: "Beard & Shave",
    specialties: ["Hot towel", "Cạo mặt", "Beard shape"],
    serviceIds: ["cd-haircut", "cd-beard-trim", "cd-basic-beard-trim-line-up", "cd-full-head-face-shave", "cd-hot-towel-shave", "cd-beard-coloring", "cd-basic-beard-coloring"],
    workingHours: weekdayHours
  },
  {
    id: "linh-color",
    branchId: "an-thuong",
    name: "Linh Color",
    email: "linh.color@windread.vn",
    avatar: "/images/barber/barber4.webp",
    title: "Color Artist",
    specialties: ["Nhuộm tóc", "Uốn tóc", "Treatment"],
    serviceIds: [
      "an-basic-perm", "an-curly-perm", "an-ruffled-perm", "an-texture-perm", "an-premlock-perm", "an-afro-perm",
      "an-hair-bleach", "an-root-bleaching", "an-hair-pressed-down", "an-hair-restore", "an-black-dye",
      "an-locs-styling", "an-braids-men", "an-braids-women"
    ],
    workingHours: weekdayHours
  },
  {
    id: "bao-crop",
    branchId: "chuong-duong",
    name: "Bao Crop",
    email: "bao.crop@windread.vn",
    avatar: "/images/barber/barber5.webp",
    title: "Crop & Texture",
    specialties: ["Textured crop", "Layer gọn", "Wash finish"],
    serviceIds: ["cd-haircut", "cd-sides-back-fade", "cd-long-haircut", "cd-wash-blowdry", "cd-basic-hair-tattoo", "cd-hair-washing", "cd-haircut-expert", "cd-down-perm", "cd-basic-perm"],
    workingHours: weekdayHours
  },
  {
    id: "son-line",
    branchId: "an-thuong",
    name: "Son Line",
    email: "son.line@windread.vn",
    avatar: "/images/barber/barber6.webp",
    title: "Line-up Artist",
    specialties: ["Line up", "Skin fade", "Cạo mặt"],
    serviceIds: [
      "an-haircut-styling", "an-hot-cold-towel-shave", "an-basic-beard-trim-side", "an-hair-styling",
      "an-hair-washing", "an-afro-wash-blowdry", "an-basic-hair-tattoo", "an-beard-dye",
      "an-gentlemans-set-1", "an-gentlemans-set-2", "an-vip-gentlemans-combo",
      "an-locs-styling", "an-cornrow", "an-single-dread",
      "an-maintenance-2-workers-first-hour", "an-maintenance-2-workers-second-hour", "an-maintenance-2-workers-additional-hour"
    ],
    workingHours: weekdayHours
  },
  {
    id: "hieu-wave",
    branchId: "chuong-duong",
    name: "Hieu Wave",
    email: "hieu.wave@windread.vn",
    avatar: "/images/barber/barber7.webp",
    title: "Wave Stylist",
    specialties: ["Uốn tóc", "Nhuộm tone trầm", "Treatment"],
    serviceIds: ["cd-keratin-therapy", "cd-down-perm", "cd-basic-perm", "cd-curly-perm", "cd-ruffled-perm", "cd-premlock-perm", "cd-afro-perm", "cd-hair-bleaching", "cd-bleach-root-touch-up", "cd-hair-color", "cd-hair-blackening"],
    workingHours: weekdayHours
  },
  {
    id: "khoa-blend",
    branchId: "an-thuong",
    name: "Khoa Blend",
    email: "khoa.blend@windread.vn",
    avatar: "/images/barber/barber8.webp",
    title: "Texture & Color Artist",
    specialties: ["Texture", "Nhuộm tone trầm", "Treatment"],
    serviceIds: [
      "an-basic-perm", "an-curly-perm", "an-ruffled-perm", "an-texture-perm", "an-premlock-perm", "an-afro-perm",
      "an-hair-bleach", "an-root-bleaching", "an-hair-pressed-down", "an-hair-restore", "an-black-dye",
      "an-locs-styling", "an-braids-men", "an-braids-women"
    ],
    workingHours: weekdayHours
  }
];

export const seedBookings: Booking[] = [
  {
    id: "WD-260706-1015",
    branchId: "an-thuong",
    serviceId: "an-maintenance-1-worker-first-hour",
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
    serviceId: "cd-hair-color",
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
