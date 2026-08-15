"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { branchProfiles } from "./branches/branchData";
import { BookingExperience } from "./booking/BookingExperience";

const orderedBranchProfiles = [...branchProfiles].sort((a, b) => a.label.vi.localeCompare(b.label.vi));

const navItems = [
  { key: "home", href: "/", vi: "Trang chủ", en: "Home" },
  { key: "about", href: "/about", vi: "Giới thiệu", en: "About" },
  { key: "barbers", href: "/barbers", vi: "Barber", en: "Barbers" },
  { key: "pricing", href: "/pricing", vi: "Bảng giá", en: "Pricing" },
  { key: "news", href: "/news", vi: "Tin tức", en: "News" }
] as const;

type PageKey =
  | typeof navItems[number]["key"]
  | "services"
  | "gallery"
  | "shop"
  | "barbers"
  | "booking"
  | "contact";
type Lang = "vi" | "en";
type HomeGalleryTab =
  | "Dreadlocks for men"
  | "Dreadlocks for women"
  | "Cornrows for men"
  | "Barrel twist for men"
  | "Twist for men"
  | "Box braids for men"
  | "Braids for women";
type ServiceExplorerKey = "barber" | "dread" | "braid";

const socialLinks = [
  { label: "Instagram", icon: "IG", href: "https://instagram.com" },
  { label: "Facebook", icon: "FB", href: "https://facebook.com" },
  { label: "TikTok", icon: "TT", href: "https://tiktok.com" }
];

const heroHighlights = [
  {
    icon: "/images/icon/moc.png",
    viTitle: "Chuyên Locs",
    viDesc: "Tạo chất riêng",
    enTitle: "Locs Focus",
    enDesc: "Signature texture"
  },
  {
    icon: "/images/icon/clipper.png",
    viTitle: "Barbers",
    viDesc: "Nhiều kinh nghiệm",
    enTitle: "Barber",
    enDesc: "Style-precise cuts"
  },
  {
    icon: "/images/icon/spray.png",
    viTitle: "Chất lượng",
    viDesc: "Sản phẩm cao cấp",
    enTitle: "Quality",
    enDesc: "Premium products"
  }
] as const;

const serviceExplorerGroups = [
  {
    key: "barber",
    title: "Barber",
    viDesc: "Fade gọn, line up sắc và những form cắt có độ chính xác.",
    enDesc: "Clean fades, sharp line ups and precise classic cuts.",
    image: "/images/thumb1.webp",
    services: [
      { vi: "Clean Fade", en: "Clean Fade", desc: "Low, mid hoặc high fade blend mượt.", image: "/images/barber/barber1.webp" },
      { vi: "Classic Cut", en: "Classic Cut", desc: "Scissor cut và form gọn mỗi ngày.", image: "/images/barber/barber2.webp" },
      { vi: "Beard & Shave", en: "Beard & Shave", desc: "Khăn nóng, tạo form râu, finish sạch.", image: "/images/barber/barber3.webp" },
      { vi: "Texture Cut", en: "Texture Cut", desc: "Layer nhẹ, crop và texture tự nhiên.", image: "/images/barber/barber5.webp" },
      { vi: "Color & Treatment", en: "Color & Treatment", desc: "Màu, uốn và treatment theo nền tóc.", image: "/images/barber/barber4.webp" }
    ]
  },
  {
    key: "dread",
    title: "Dread",
    viDesc: "Starter locs, retwist và chăm form giữ đúng texture thật.",
    enDesc: "Starter locs, retwist and maintenance that keep real texture.",
    image: "/images/thumb2.webp",
    services: [
      { vi: "Starter Locs", en: "Starter Locs", desc: "Tư vấn nền tóc và chia section sạch.", image: "/images/collection / Dreadlocks for Men/collection1.webp" },
      { vi: "Retwist", en: "Retwist", desc: "Làm gọn chân locs và giảm frizz.", image: "/images/collection / Dreadlocks for Men/collection6.webp" },
      { vi: "Locs Repair", en: "Locs Repair", desc: "Sửa section yếu và locs bung form.", image: "/images/collection / Dreadlocks for Men/collection10.webp" },
      { vi: "Locs Styling", en: "Locs Styling", desc: "Barrel, two-strand và rope twist.", image: "/images/collection / Dreadlocks for Men/collection11.webp" },
      { vi: "Locs Detox", en: "Locs Detox", desc: "Deep clean buildup cho da đầu nhẹ hơn.", image: "/images/collection / Dreadlocks for Men/collection7.webp" }
    ]
  },
  {
    key: "braid",
    title: "Braid",
    viDesc: "Cornrow, box braid và pattern gọn, giữ nếp lâu.",
    enDesc: "Cornrow, box braid and street patterns that hold their shape.",
    image: "/images/thumb3.webp",
    services: [
      { vi: "Cornrow", en: "Cornrow", desc: "Đường tết sát da đầu, form gọn.", image: "/images/collection /Cornrows for Men/collection1.webp" },
      { vi: "Box Braid", en: "Box Braid", desc: "Tết box braid đều section và bền nếp.", image: "/images/collection /Boxbraids for Men/collection1.webp" },
      { vi: "Knotless Braid", en: "Knotless Braid", desc: "Nền tết nhẹ, tự nhiên và thoải mái.", image: "/images/collection /Braids for Women/collection1.webp" },
      { vi: "Pattern Braid", en: "Pattern Braid", desc: "Pattern theo ý tưởng streetwear cá nhân.", image: "/images/collection /Cornrows for Men/collection4.webp" },
      { vi: "Braid Refresh", en: "Braid Refresh", desc: "Làm mới chân tết và chỉnh lại form.", image: "/images/collection /Braids for Women/collection5.webp" }
    ]
  },
] as const;

const momentImages = [
  { src: "/images/moment/moment1.webp", orientation: "portrait" },
  { src: "/images/moment/moment6.webp", orientation: "landscape" },
  { src: "/images/moment/moment7.webp", orientation: "portrait" },
  { src: "/images/moment/moment8.webp", orientation: "landscape" },
  { src: "/images/moment/moment10.webp", orientation: "landscape" },
  { src: "/images/moment/moment11.webp", orientation: "landscape" },
  { src: "/images/moment/moment12.webp", orientation: "portrait" },
  { src: "/images/moment/moment13.webp", orientation: "landscape" },
  { src: "/images/moment/moment14.webp", orientation: "landscape" },
  { src: "/images/moment/moment15.webp", orientation: "portrait" },
  { src: "/images/moment/moment16.webp", orientation: "landscape" },
  { src: "/images/moment/moment17.webp", orientation: "portrait" },
  { src: "/images/moment/moment18.webp", orientation: "portrait" },
  { src: "/images/moment/moment19.webp", orientation: "landscape" },
  { src: "/images/moment/moment20.webp", orientation: "landscape" },
  { src: "/images/moment/moment5.webp", orientation: "portrait" }
] as const;

const locServices = [
  {
    name: "Dreadlock",
    desc: "Tạo dreadlock theo độ dài, mật độ và nền tóc; cần tư vấn trước khi làm.",
    time: "240 phút+",
    price: "từ 2,000,000đ"
  },
  {
    name: "Maintenance Locs",
    desc: "Bảo dưỡng chân dread, siết form và xử lý tóc bung; tính theo thời gian làm.",
    time: "60 phút+",
    price: "từ 400,000đ"
  },
  {
    name: "Cornrow & Braids",
    desc: "Cornrow theo số line, box braids và pattern theo nền tóc.",
    time: "90 phút+",
    price: "từ 300,000đ"
  },
  {
    name: "Styling Locs / Braids",
    desc: "Thiết kế twist, cornrow hoặc braids tính theo giờ.",
    time: "60 phút+",
    price: "400,000đ / giờ"
  }
];

const barberServices = [
  {
    name: "Cắt tóc & tạo kiểu",
    desc: "Cắt tóc và tạo kiểu với pomade.",
    time: "45 phút",
    price: "120,000đ"
  },
  {
    name: "Fade hai bên & gáy",
    desc: "Làm gọn side và gáy cho form tóc đang có.",
    time: "30 phút",
    price: "90,000đ"
  },
  {
    name: "Uốn & xử lý texture",
    desc: "Ép side, uốn cơ bản, uốn xoăn hoặc PremLock theo chất tóc.",
    time: "60 phút+",
    price: "từ 250,000đ"
  },
  {
    name: "Beard & Shave",
    desc: "Tỉa râu, chỉnh viền và cạo với khăn nóng/lạnh.",
    time: "30 phút",
    price: "từ 60,000đ"
  }
];

const priceBoards = [
  {
    branch: "Cơ sở 2 · An Thượng",
    address: "35–37 An Thượng 29 · Locs, dreadlock & braids",
    groups: [
      {
        title: "Dreadlock & Maintenance",
        rows: [
          ["Dreadlock", "Theo độ dài, mật độ và nền tóc", "2,000,000–8,000,000đ"],
          ["Single Dread", "1 dread, dài 20–30cm", "150,000đ / dread"],
          ["Pair of Dreads", "1 cặp dread, dài 30–40cm", "300,000đ / cặp"],
          ["Maintenance · 1 thợ", "Giờ đầu 400,000đ; từ giờ thứ hai", "300,000đ / giờ"],
          ["Maintenance · 2 thợ", "Giờ đầu 600,000đ; giờ 2 / từ giờ 3", "500,000đ / 400,000đ mỗi giờ"]
        ]
      },
      {
        title: "Cornrow, Braids & Styling",
        rows: [
          ["Cornrow 2–8 line", "Tết theo số line", "150,000đ / line"],
          ["Cornrow 10–16 line", "Tết theo số line", "130,000đ / line"],
          ["Braids nam", "Box braids / pattern", "1,000,000–3,000,000đ"],
          ["Braids nữ", "Box braids theo độ dài & mật độ", "3,000,000–4,000,000đ"],
          ["Styling design", "Twist, cornrow hoặc braids", "400,000đ / giờ"]
        ]
      },
      {
        title: "Add-on xử lý tóc",
        rows: [
          ["Uốn basic", "Uốn cơ bản", "300,000–400,000đ"],
          ["Uốn xoăn", "Curly perm", "350,000–450,000đ"],
          ["Uốn Ruffled", "Ruffled perm", "400,000–450,000đ"],
          ["Uốn sâu", "Texture perm", "400,000–450,000đ"],
          ["Uốn PremLock", "Theo độ dài tóc", "800,000–1,300,000đ"],
          ["Uốn Afro", "Theo độ dài tóc", "1,000,000–1,500,000đ"],
          ["Tẩy tóc", "Tính theo lần tẩy", "250,000đ / lần"],
          ["Tẩy nối chân", "Theo nền tóc", "400,000–600,000đ"],
          ["Ép side", "Hair pressed down", "250,000đ"],
          ["Phục hồi tóc", "Hair restore", "300,000–400,000đ"],
          ["Nhuộm râu", "Beard dye", "150,000–250,000đ"],
          ["Nhuộm đen", "Black dye", "150,000–250,000đ"]
        ]
      },
      {
        title: "Barber, Combo & VIP",
        rows: [
          ["Cắt tóc & tạo kiểu", "Với Uppercut · 45 phút", "150,000đ"],
          ["Cạo khăn nóng & lạnh", "Hot & cold towel shave · 30 phút", "120,000đ"],
          ["Tỉa râu cơ bản / cắt side", "Chọn một dịch vụ · 25 phút", "100,000đ"],
          ["Sấy & tạo kiểu tóc", "Hair styling", "100,000đ"],
          ["Gội đầu thường", "Hair washing", "50,000đ"],
          ["Gội & làm sạch Dreads / Locs", "Tùy độ dài", "50,000–150,000đ"],
          ["Gội & sấy tóc Afro", "Afro hair wash & blow-dry", "100,000–200,000đ"],
          ["Tattoo tóc cơ bản", "Theo thiết kế", "50,000–150,000đ"],
          ["Gentleman's Set I", "Cắt + cạo khăn nóng/lạnh + Uppercut", "250,000đ"],
          ["Gentleman's Set II", "Cắt + gội + cạo khăn nóng/lạnh + Uppercut", "290,000đ"],
          ["VIP Gentleman's Combo", "Chỉ nhận đặt lịch trước", "390,000đ"]
        ]
      }
    ]
  },
  {
    branch: "Cơ sở 1 · Chương Dương",
    address: "223 Chương Dương · Barber, uốn, nhuộm & chăm sóc tóc",
    groups: [
      {
        title: "Haircut & Styling",
        rows: [
          ["Cắt tóc & tạo kiểu", "Với pomade", "120,000đ"],
          ["Fade hai bên & gáy", "Làm gọn side và gáy", "90,000đ"],
          ["Cắt tóc nam dài", "Chỉnh form tóc nam dài", "200,000đ"],
          ["Tattoo tóc cơ bản", "Theo thiết kế", "50,000–150,000đ"],
          ["Gội đầu thư giãn", "Hair washing", "40,000đ"],
          ["Cắt tóc bởi chuyên gia", "Chỉ nhận lịch hẹn trước", "160,000đ"]
        ]
      },
      {
        title: "Chăm sóc & uốn tóc",
        rows: [
          ["Gội & sấy tạo kiểu", "Với pomade", "70,000đ"],
          ["Phục hồi Keratin", "Cho tóc khô xơ", "200,000–400,000đ"],
          ["Ép side", "Down perm", "250,000đ"],
          ["Uốn basic", "Theo độ dài và nền tóc", "300,000–400,000đ"],
          ["Uốn xoăn", "Curly perm", "350,000–450,000đ"],
          ["Uốn Ruffled", "Tạo texture", "400,000–500,000đ"],
          ["Uốn PremLock", "Theo độ dài và nền tóc", "800,000–1,200,000đ"],
          ["Uốn Afro", "Theo độ dài và nền tóc", "1,000,000–1,500,000đ"]
        ]
      },
      {
        title: "Tẩy & nhuộm tóc",
        rows: [
          ["Tẩy tóc", "Tính theo mỗi lần tẩy", "250,000đ / session"],
          ["Tẩy nối chân tóc", "Bleach root touch-up", "500,000–900,000đ"],
          ["Nhuộm tóc thời trang", "Theo nền tóc", "250,000–350,000đ"],
          ["Nhuộm đen", "Hair blackening", "150,000–250,000đ"],
          ["Nhuộm râu", "Beard coloring", "150,000–250,000đ"],
          ["Nhuộm râu cơ bản", "Basic beard coloring", "100,000đ"]
        ]
      },
      {
        title: "Beard & Facial Care",
        rows: [
          ["Tỉa râu", "Tạo form râu", "80,000đ"],
          ["Tỉa râu cơ bản / cạo viền", "Làm gọn đường viền", "70,000đ"],
          ["Cạo đầu / cạo mặt", "Dịch vụ cạo cơ bản", "70,000đ"],
          ["Cạo khăn nóng & lạnh", "Hot & cold towel shave", "60,000đ"]
        ]
      }
    ]
  }
];

const barbers = [
  {
    bookingId: "kai-loc",
    name: "Kai Loc",
    role: "Locs Expert",
    specialties: ["Locs", "Fade"],
    years: "6 năm",
    bio: "Fade mượt, line up sắc và form cắt hợp phong cách streetwear.",
    style: "Low fade, burst fade, sharp line up",
    image: "/images/barber/barber1.webp",
    instagram: "https://instagram.com/kailoc"
  },
  {
    bookingId: "minh-fade",
    name: "Minh Fade",
    role: "Fade Specialist",
    specialties: ["Fade"],
    years: "6 năm",
    bio: "Tay kéo gọn, fade mượt, hợp streetwear và form mặt châu Á.",
    style: "Low fade, burst fade, sharp line up",
    image: "/images/barber/barber2.webp",
    instagram: "https://instagram.com/minhfade"
  },
  {
    bookingId: "ryo-beard",
    name: "Ryo Beard",
    role: "Beard & Shave",
    specialties: ["Beard"],
    years: "7 năm",
    bio: "Classic barber rituals, hot towel, beard shape và finish premium.",
    style: "Tapered beard, calm shave, old-school finish",
    image: "/images/barber/barber3.webp",
    instagram: "https://instagram.com/ryobeard"
  },
  {
    bookingId: "linh-color",
    name: "Linh Color",
    role: "Color Artist",
    specialties: ["Classic"],
    years: "4 năm",
    bio: "Tư vấn màu, texture và treatment phù hợp với nền tóc hiện tại.",
    style: "Color, texture, treatment",
    image: "/images/barber/barber4.webp",
    instagram: "https://instagram.com/linhcolor"
  },
  {
    bookingId: "bao-crop",
    name: "Bao Crop",
    role: "Crop & Texture",
    specialties: ["Classic"],
    years: "5 năm",
    bio: "Xử lý layer và texture tự nhiên cho các form tóc có độ chuyển động.",
    style: "Textured crop, layered cut, natural volume",
    image: "/images/barber/barber5.webp",
    instagram: "https://instagram.com/baocrop"
  },
  {
    bookingId: "son-line",
    name: "Son Line",
    role: "Line-up Artist",
    specialties: ["Fade"],
    years: "4 năm",
    bio: "Tập trung vào đường viền tóc, taper và finish sạch từ mọi góc nhìn.",
    style: "Line up, taper, clean finish",
    image: "/images/barber/barber6.webp",
    instagram: "https://instagram.com/sonline"
  },
  {
    bookingId: "hieu-wave",
    name: "Hieu Wave",
    role: "Wave Stylist",
    specialties: ["Classic"],
    years: "4 năm",
    bio: "Tư vấn texture, màu trầm và treatment để giữ tóc khỏe sau xử lý.",
    style: "Wave, color, treatment",
    image: "/images/barber/barber7.webp",
    instagram: "https://instagram.com/hieuwave"
  },
  {
    bookingId: "khoa-blend",
    name: "Khoa Blend",
    role: "Texture & Color Artist",
    specialties: ["Classic"],
    years: "5 năm",
    bio: "Xử lý texture, màu trầm và những form tóc cần độ chuyển tự nhiên.",
    style: "Texture crop, soft color, natural finish",
    image: "/images/barber/barber8.webp",
    instagram: "https://instagram.com/khoablend"
  }
];

const galleryItems = [
  { label: "Starter locs", cat: "Locs", img: "/images/hero-dreadlocks-v2.png" },
  { label: "High-top fade", cat: "Barber", img: "/images/barber-portrait-v2.png" },
  { label: "Locs care set", cat: "Products", img: "/images/locs-products-v2.png" },
  { label: "Shop mood", cat: "Behind", img: "/images/barbershop-interior-v2.png" },
  { label: "Color locs", cat: "Locs", img: "/images/hero-dreadlocks-v2.png" },
  { label: "Clipper detail", cat: "Behind", img: "/images/barbershop-interior-v2.png" },
  { label: "Beard care", cat: "Products", img: "/images/locs-products-v2.png" },
  { label: "Crew portrait", cat: "Barber", img: "/images/barber-portrait-v2.png" }
];

const homeGalleryImages: Record<HomeGalleryTab, string[]> = {
  "Dreadlocks for men": [
    "/images/collection / Dreadlocks for Men/collection1.webp",
    "/images/collection / Dreadlocks for Men/collection2.webp",
    "/images/collection / Dreadlocks for Men/collection3.webp",
    "/images/collection / Dreadlocks for Men/collection4.webp",
    "/images/collection / Dreadlocks for Men/collection5.webp",
    "/images/collection / Dreadlocks for Men/collection6.webp",
    "/images/collection / Dreadlocks for Men/collection7.webp",
    "/images/collection / Dreadlocks for Men/collection8.webp",
    "/images/collection / Dreadlocks for Men/collection10.webp",
    "/images/collection / Dreadlocks for Men/collection11.webp",
    "/images/collection / Dreadlocks for Men/collection12.webp",
    "/images/collection / Dreadlocks for Men/collection14.webp",
    "/images/collection / Dreadlocks for Men/collection15.webp"
  ],
  "Dreadlocks for women": [
    "/images/collection /Dreadlocks for Women/collection1.webp",
    "/images/collection /Dreadlocks for Women/collection2.webp",
    "/images/collection /Dreadlocks for Women/collection3.webp",
    "/images/collection /Dreadlocks for Women/collection4.webp",
    "/images/collection /Dreadlocks for Women/collection5.webp",
    "/images/collection /Dreadlocks for Women/collection6.webp",
    "/images/collection /Dreadlocks for Women/collection7.webp",
    "/images/collection /Dreadlocks for Women/collection8.webp"
  ],
  "Cornrows for men": [
    "/images/collection /Cornrows for Men/collection1.webp",
    "/images/collection /Cornrows for Men/collection2.webp",
    "/images/collection /Cornrows for Men/collection3.webp",
    "/images/collection /Cornrows for Men/collection4.webp",
    "/images/collection /Cornrows for Men/collection5.webp",
    "/images/collection /Cornrows for Men/collection6.webp",
    "/images/collection /Cornrows for Men/collection7.webp",
    "/images/collection /Cornrows for Men/collection8.webp"
  ],
  "Barrel twist for men": [
    "/images/collection /Barrel Twist for Men/collection1.webp",
    "/images/collection /Barrel Twist for Men/collection2.webp",
    "/images/collection /Barrel Twist for Men/collection3.webp",
    "/images/collection /Barrel Twist for Men/collection4.webp",
    "/images/collection /Barrel Twist for Men/collection5.webp",
    "/images/collection /Barrel Twist for Men/collection6.webp"
  ],
  "Twist for men": [
    "/images/collection /Twist for Men/collection1.webp",
    "/images/collection /Twist for Men/collection2.webp",
    "/images/collection /Twist for Men/collection3.webp",
    "/images/collection /Twist for Men/collection4.webp",
    "/images/collection /Twist for Men/collection5.webp",
    "/images/collection /Twist for Men/collection6.webp",
    "/images/collection /Twist for Men/collection7.webp",
    "/images/collection /Twist for Men/collection8.webp"
  ],
  "Box braids for men": [
    "/images/collection /Boxbraids for Men/collection1.webp",
    "/images/collection /Boxbraids for Men/collection2.webp",
    "/images/collection /Boxbraids for Men/collection3.webp",
    "/images/collection /Boxbraids for Men/collection4.webp",
    "/images/collection /Boxbraids for Men/collection5.webp",
    "/images/collection /Boxbraids for Men/collection6.webp",
    "/images/collection /Boxbraids for Men/collection7.webp",
    "/images/collection /Boxbraids for Men/collection8.webp"
  ],
  "Braids for women": [
    "/images/collection /Braids for Women/collection1.webp",
    "/images/collection /Braids for Women/collection2.webp",
    "/images/collection /Braids for Women/collection3.webp",
    "/images/collection /Braids for Women/collection5.webp",
    "/images/collection /Braids for Women/collection6.webp",
    "/images/collection /Braids for Women/collection7.webp",
    "/images/collection /Braids for Women/collection8.webp"
  ]
};

const products = [
  {
    name: "Root Oil No.04",
    cat: "Locs Care",
    price: "280,000đ",
    img: "/images/locs-products-v2.png",
    desc: "Oil nhẹ cho da đầu và chân locs, hương gỗ trầm ấm.",
    benefits: "Jojoba, castor, tea tree. Giảm khô, giữ locs mềm, không bết.",
    usage: "Nhỏ 3-5 giọt lên da đầu, massage nhẹ 2-3 lần mỗi tuần."
  },
  {
    name: "Matte Loc Wax",
    cat: "Styling",
    price: "240,000đ",
    img: "/images/locs-products-v2.png",
    desc: "Wax giữ nếp nhẹ cho style locs mà không bóng giả.",
    benefits: "Shea butter, beeswax, clay. Giữ form và giảm frizz.",
    usage: "Lấy lượng nhỏ, làm ấm trong lòng bàn tay rồi vuốt lên locs."
  },
  {
    name: "Beard Street Balm",
    cat: "Beard Care",
    price: "220,000đ",
    img: "/images/locs-products-v2.png",
    desc: "Balm làm mềm râu, giữ form gọn sau khi trim.",
    benefits: "Argan, cedar, vitamin E. Làm mềm và tạo mùi ấm trầm.",
    usage: "Dùng sau tắm hoặc sau trim, chải đều vào beard."
  },
  {
    name: "WINDREAD Tee",
    cat: "Merch",
    price: "390,000đ",
    img: "/images/locs-products-v2.png",
    desc: "Áo black heavyweight fit rộng, chất street club.",
    benefits: "Cotton dày, print muted red, form oversize.",
    usage: "Mặc mỗi ngày, giặt mặt trái với nước lạnh."
  }
];

function SocialIcon({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="social-icon" aria-label={label} title={label}>
      {icon}
    </span>
  );
}

const pageRoutes: Record<string, PageKey> = {
  "/": "home",
  "/about": "about",
  "/services": "services",
  "/gallery": "gallery",
  "/shop": "shop",
  "/barbers": "barbers",
  "/pricing": "pricing",
  "/news": "news",
  "/booking": "booking",
  "/contact": "contact"
};

const pageEyebrows: Record<PageKey, { vi: string; en: string }> = {
  home: { vi: "Street Art For Your Hair", en: "Street Art For Your Hair" },
  about: { vi: "Từ đường phố, cho đường phố.", en: "From the street, for the street." },
  services: { vi: "Dread, braid & barber.", en: "Dread, braid & barber." },
  gallery: { vi: "Nhìn chất tóc, không chỉ nhìn ảnh.", en: "Texture first, not just photos." },
  shop: { vi: "Chăm tóc sau khi rời ghế.", en: "Care after the chair." },
  barbers: { vi: "The Crew", en: "The Crew" },
  pricing: { vi: "Giá rõ trước khi làm.", en: "Clear prices before the chair." },
  news: { vi: "Tin mới từ WINDREAD", en: "Latest from WINDREAD" },
  booking: { vi: "Đặt lịch giữ ghế.", en: "Book the chair." },
  contact: { vi: "Ghé WINDREAD.", en: "Pull up to WINDREAD." }
};

function routeForPage(pathname: string | null): PageKey {
  return pageRoutes[pathname ?? "/"] ?? "home";
}

export function SitePage({ page }: { page?: PageKey }) {
  const pathname = usePathname();
  const currentPage = page ?? routeForPage(pathname);
  const [language, setLanguage] = useState<Lang>("vi");
  const [galleryFilter, setGalleryFilter] = useState("All");
  const [barberFilter, setBarberFilter] = useState("All");
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [homeGalleryTab, setHomeGalleryTab] = useState<HomeGalleryTab>("Dreadlocks for men");
  const [homeGalleryVisibleTab, setHomeGalleryVisibleTab] = useState<HomeGalleryTab>("Dreadlocks for men");
  const [activeServiceExplorer, setActiveServiceExplorer] = useState<ServiceExplorerKey>("dread");
  const [isServiceExplorerOpen, setIsServiceExplorerOpen] = useState(false);
  const isEnglish = language === "en";

  const visibleGallery = useMemo(
    () =>
      galleryFilter === "All"
        ? galleryItems
        : galleryItems.filter((item) => item.cat === galleryFilter),
    [galleryFilter]
  );

  const visibleBarbersForBranch = (barberIds: string[]) =>
    barbers.filter(
      (barber) =>
        barberIds.includes(barber.bookingId) &&
        (barberFilter === "All" || barber.specialties.includes(barberFilter))
    );

  useEffect(() => {
    document.documentElement.classList.add("reveal-ready");
    const revealItems = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.14 }
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("reveal-ready");
    };
  }, []);

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem("windread-language");
    if (storedLanguage === "vi" || storedLanguage === "en") setLanguage(storedLanguage);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem("windread-language", language);
    window.dispatchEvent(new CustomEvent("windread-language-change", { detail: language }));
  }, [language]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen && !lightboxOpen) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setLightboxOpen(false);
      }

      if (!lightboxOpen || visibleGallery.length === 0) return;
      if (event.key === "ArrowLeft") {
        setSelectedImage((index) => (index === 0 ? visibleGallery.length - 1 : index - 1));
      }
      if (event.key === "ArrowRight") {
        setSelectedImage((index) => (index + 1) % visibleGallery.length);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, menuOpen, visibleGallery.length]);

  function openLightbox(index: number) {
    setSelectedImage(index);
    setLightboxOpen(true);
  }

  function changeHomeGalleryTab(tab: HomeGalleryTab) {
    if (tab === homeGalleryVisibleTab) return;
    setHomeGalleryTab(tab);
    setHomeGalleryVisibleTab(tab);
  }

  const currentLightboxItem = visibleGallery[selectedImage] ?? visibleGallery[0];
  const activeHomeGallery = homeGalleryImages[homeGalleryVisibleTab];
  const activeServiceGroup = serviceExplorerGroups.find((group) => group.key === activeServiceExplorer) ?? serviceExplorerGroups[0];
  const displayedLocServices = isEnglish
    ? [
      { name: "Starter Locs", desc: "Consultation, clean sectioning and a natural loc foundation.", time: "120-240 min", price: "from 900,000đ" },
      { name: "Retwist & Palm Roll", desc: "Clean roots, controlled frizz and real texture without overworking the hair.", time: "90-150 min", price: "from 450,000đ" },
      { name: "Locs Styling", desc: "Two-strand, barrel twist, high pony and street-ready finish.", time: "45-90 min", price: "from 350,000đ" },
      { name: "Color Locs", desc: "Highlights, muted red, blonde tips and treatment to protect the strand.", time: "180-300 min", price: "from 1,200,000đ" }
    ]
    : locServices;
  const displayedBarberServices = isEnglish
    ? [
      { name: "Clean Fade", desc: "Low, mid or high fade with sharp line up and smooth blend.", time: "45-60 min", price: "from 220,000đ" },
      { name: "Classic Cut", desc: "Scissor cut, crop, textured top and shape built around your style.", time: "45 min", price: "from 200,000đ" },
      { name: "Beard Trim", desc: "Beard shape, clean cheek line and warm balm finish.", time: "25 min", price: "from 120,000đ" },
      { name: "Hot Towel Shave", desc: "Hot towel, classic razor and calm finish for the skin.", time: "35 min", price: "from 180,000đ" }
    ]
    : barberServices;

  const showHome = currentPage === "home";
  const showAbout = currentPage === "about";
  const showServices = currentPage === "services";
  const showGallery = currentPage === "gallery";
  const showShop = currentPage === "shop";
  const showBarbers = currentPage === "barbers";
  const showPricing = currentPage === "pricing";
  const showNews = currentPage === "news";
  const showBooking = currentPage === "booking";
  const showContact = currentPage === "contact";

  return (
    <main id="main-content">
      <header className="site-nav" aria-label="Dieu huong chinh">
        <a className="nav-brand" href="/" aria-label="WINDREAD home">
          <Image
            src="/images/windread-logo.png"
            alt=""
            width={265}
            height={81}
            priority
            className="nav-logo"
          />
          <span className="sr-only">WINDREAD</span>
        </a>
        <nav className={`nav-links ${menuOpen ? "is-open" : ""}`} aria-label="Section links">
          {navItems.map((item) => (
            <a
              key={item.key}
              className={currentPage === item.key ? "active" : ""}
              href={item.href}
              onClick={() => setMenuOpen(false)}
            >
              {isEnglish ? item.en : item.vi}
            </a>
          ))}
          <a className="nav-book-link" href="/booking" onClick={() => setMenuOpen(false)}>
            {isEnglish ? "Book Now" : "Đặt lịch"}
          </a>
        </nav>
        <div className="nav-actions">
          <button
            className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
            type="button"
            aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
          <button
            className="language-toggle"
            type="button"
            aria-label={isEnglish ? "Switch to Vietnamese" : "Chuyển sang tiếng Anh"}
            onClick={() => setLanguage((value) => (value === "vi" ? "en" : "vi"))}
          >
            {isEnglish ? "VI" : "EN"}
          </button>
          <a className="book-button" href="/booking">
            {isEnglish ? "BOOK NOW" : "ĐẶT LỊCH"}
          </a>
          <div className="nav-socials" aria-label="Mang xa hoi">
            {socialLinks.map((link) => (
              <a key={link.label} href={link.href} aria-label={link.label}>
                <SocialIcon icon={link.icon} label={link.label} />
              </a>
            ))}
          </div>
        </div>
      </header>

      {showHome && (
        <section id="home" className="hero section-shell">
          <div className="hero-stage">
            <div className="hero-copy reveal">
              <p className="eyebrow">{pageEyebrows.home[language]}</p>
              <h1 className="brand-title">
                <Image
                  src="/images/windread-logo.png"
                  alt="WINDREAD"
                  width={1327}
                  height={331}
                  priority
                  className="brand-logo"
                />
              </h1>
              <div className="hero-subcontent">
                <div className="hero-pole" aria-hidden="true">
                  <video
                    className="hero-pole-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    onCanPlay={(event) => {
                      event.currentTarget.muted = true;
                      event.currentTarget.play().catch(() => undefined);
                    }}
                  >
                    <source src="/loop-hero.mov" type="video/quicktime" />
                    <source src="/loop-hero-web.mp4" type="video/mp4" />
                  </video>
                </div>
                <div className="hero-subcopy">
                  <div className="hero-highlights" aria-label={isEnglish ? "Hero service highlights" : "Điểm nổi bật dịch vụ"}>
                    {heroHighlights.map((item) => (
                      <div className="hero-highlight" key={item.viTitle}>
                        <Image
                          src={item.icon}
                          alt=""
                          width={72}
                          height={72}
                          className="hero-highlight-icon"
                          aria-hidden="true"
                        />
                        <div className="hero-highlight-copy">
                          <strong>{isEnglish ? item.enTitle : item.viTitle}</strong>
                          <p>{isEnglish ? item.enDesc : item.viDesc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="hero-desc">
                    {isEnglish
                      ? "A minimalist, sharp, and disciplined space. Where raw hair texture is elevated by premium services and a street soul."
                      : "Một không gian tối giản, gọn gàng và đầy tính kỷ luật. Nơi tôn vinh chất tóc thật bằng dịch vụ cao cấp và linh hồn đường phố"}
                  </p>
                  <div className="hero-actions">
                    <a className="book-button large" href="/booking">
                      {isEnglish ? "Book Now" : "Đặt lịch"} <span aria-hidden="true">{"->"}</span>
                    </a>
                    <a className="ghost-button" href="/pricing">
                      {isEnglish ? "See pricing" : "Xem bảng giá"}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-visual reveal">
              <Image
                src="/images/hero2.png"
                alt="Không gian WINDREAD old-school street barber"
                priority
                fill
                sizes="100vw"
                className="hero-image parallax-img"
              />
            </div>
          </div>
          <section className="moment-marquee" aria-label={isEnglish ? "Moments at WINDREAD" : "Khoảnh khắc tại WINDREAD"}>
            <div className="moment-marquee-track">
              {[0, 1].map((set) => (
                <div className="moment-marquee-group" aria-hidden={set === 1} key={set}>
                  {momentImages.map((moment, index) => (
                    <figure className={`moment-marquee-frame ${moment.orientation}`} key={`${set}-${moment.src}`}>
                      <Image
                        src={moment.src}
                        alt={set === 0 ? `${isEnglish ? "WINDREAD moment" : "Khoảnh khắc WINDREAD"} ${index + 1}` : ""}
                        fill
                        sizes="(max-width: 780px) 150px, 300px"
                      />
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          </section>
          {isServiceExplorerOpen ? (
            <div className="service-explorer" aria-label={isEnglish ? "Service explorer" : "Khám phá dịch vụ"}>
              <article className="service-explorer-panel" key={activeServiceGroup.key}>
                <Image
                  className="service-explorer-panel-image"
                  src={activeServiceGroup.image}
                  alt=""
                  fill
                  sizes="(max-width: 780px) 100vw, 76vw"
                />
                <div className="service-explorer-panel-copy">
                  <button className="service-explorer-back" type="button" onClick={() => setIsServiceExplorerOpen(false)}>
                    {isEnglish ? "All services" : "Tất cả dịch vụ"}
                  </button>
                  <p>{activeServiceGroup.title}</p>
                  <h2>{isEnglish ? activeServiceGroup.enDesc : activeServiceGroup.viDesc}</h2>
                </div>
                <div className="service-explorer-service-grid">
                  {activeServiceGroup.services.map((service) => (
                    <a className="service-explorer-service" href="/booking" key={service.en}>
                      <Image src={service.image} alt="" fill sizes="(max-width: 780px) 50vw, 18vw" />
                      <div>
                        <h3>{isEnglish ? service.en : service.vi}</h3>
                        <p>{service.desc}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </article>
              <nav className="service-explorer-tabs" aria-label={isEnglish ? "Other service groups" : "Nhóm dịch vụ khác"}>
                {serviceExplorerGroups
                  .filter((group) => group.key !== activeServiceGroup.key)
                  .map((group) => (
                    <button
                      type="button"
                      key={group.key}
                      onClick={() => setActiveServiceExplorer(group.key)}
                    >
                      <Image src={group.image} alt="" fill sizes="(max-width: 780px) 50vw, 20vw" />
                      <span>{group.title}</span>
                    </button>
                  ))}
              </nav>
            </div>
          ) : (
            <div className="feature-strip reveal is-visible" aria-label={isEnglish ? "Featured service groups" : "Nhóm dịch vụ nổi bật"}>
              {serviceExplorerGroups.map((group) => (
                <button
                  className="feature-strip-tile"
                  type="button"
                  key={group.key}
                  style={{ "--tile-image": `url("${group.image}")` } as CSSProperties}
                  onClick={() => {
                    setActiveServiceExplorer(group.key);
                    setIsServiceExplorerOpen(true);
                  }}
                >
                  <div className="feature-title">
                    <span>{group.title}</span>
                  </div>
                  <p>{isEnglish ? group.enDesc : group.viDesc}</p>
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {showHome && (
        <section className="home-gallery section-shell">
          <div className="section-heading reveal">
            <div>
              <p className="eyebrow">{isEnglish ? "Gallery" : "Thư viện kiểu tóc"}</p>
              <h2>{isEnglish ? "Texture on the wall." : "Chất tóc riêng trên từng khung hình."}</h2>
            </div>
          </div>
          <div className="home-gallery-tabs reveal" role="tablist" aria-label="Home gallery categories">
            {(Object.keys(homeGalleryImages) as HomeGalleryTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={homeGalleryTab === tab}
                className={homeGalleryTab === tab ? "active" : ""}
                onClick={() => changeHomeGalleryTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="home-gallery-grid" key={homeGalleryVisibleTab}>
            {activeHomeGallery.map((src, index) => (
              <figure className="home-gallery-tile" key={`${homeGalleryVisibleTab}-${src}-${index}`}>
                <Image
                  src={src}
                  alt={`${homeGalleryVisibleTab} ${index + 1}`}
                  fill
                  sizes="(max-width: 700px) 100vw, (max-width: 980px) 50vw, 33vw"
                />
              </figure>
            ))}
          </div>
        </section>
      )}

      {showAbout && (
        <section id="about" className="about section-shell page-view">
          <div className="about-copy reveal">
            <p className="eyebrow">{pageEyebrows.about[language]}</p>
            <h2>{isEnglish ? "About WINDREAD" : "Câu chuyện WINDREAD"}</h2>
            <p>
              {isEnglish
                ? "WINDREAD started from a love for real dreadlocks, sharp fades and late nights moving through alleyways with bass behind the shoulders. The shop blends Saigon street energy, Harajuku attitude and classic barber discipline."
                : "WINDREAD bắt đầu từ tình yêu với dreadlocks thật, những đường fade sắc và những đêm đi qua hẻm nhỏ với tiếng bass sau lưng. Tụi mình trộn năng lượng Sài Gòn, tinh thần Harajuku và kỷ luật classic barber."}
            </p>
            <p>
              {isEnglish
                ? "Locs are not a quick trend here. They are commitment. Before touching your hair, the crew checks lifestyle, texture, maintenance time and the shape you actually want. Real hair, real talk, real result."
                : "Ở đây, locs không phải trend nhanh. Đó là một cam kết. Trước khi chạm vào tóc, crew hỏi về lifestyle, chất tóc, thời gian chăm sóc và form bạn thật sự muốn. Tóc thật, tư vấn thật, kết quả thật."}
            </p>
            <div className="value-row" aria-label="Gia tri WINDREAD">
              {["Authenticity", "Craftsmanship", "Culture", "Community"].map((value) => (
                <span key={value}>{value}</span>
              ))}
            </div>
          </div>
          <div className="photo-stack reveal" aria-label="Khong gian WINDREAD">
            <Image src="/images/barbershop-interior-v2.png" alt="Ghế barber và không gian tiệm" fill sizes="(max-width: 900px) 100vw, 44vw" />
            <div className="stack-card top">Clean tools</div>
            <div className="stack-card bottom">Raw texture</div>
          </div>
        </section>
      )}

      {showServices && (
        <section id="services" className="services section-shell page-view">
          <div className="section-heading reveal">
            <p className="eyebrow">{pageEyebrows.services[language]}</p>
            <h2>{isEnglish ? "Clear services. No confusing menu." : "Dịch vụ rõ ràng. Không menu rối."}</h2>
            <p>
              {isEnglish
                ? "Choose dread work for long-term texture, braid work for tight patterns, or a clean fade to reset the whole look today."
                : "Chọn dread để xây texture dài hạn, braid để lên pattern gọn, hoặc clean fade để reset visual ngay hôm nay."}
            </p>
          </div>
          <div className="highlight-banner reveal">
            <strong>Locs Specialist</strong>
            <span>{isEnglish ? "First-timer consultation available. Book ahead so the crew can check texture and timing." : "Có tư vấn cho khách làm locs lần đầu. Đặt trước để crew check chất tóc và thời gian phù hợp."}</span>
          </div>
          <div className="services-grid">
            <ServiceColumn title="Cơ sở 2 · An Thượng · Locs & Braids" items={displayedLocServices} />
            <ServiceColumn title="Cơ sở 1 · Chương Dương · Barber & Texture" items={displayedBarberServices} />
          </div>
        </section>
      )}

      {showGallery && (
        <section id="gallery" className="gallery section-shell page-view">
          <div className="section-heading reveal">
            <p className="eyebrow">{pageEyebrows.gallery[language]}</p>
            <h2>{isEnglish ? "Before, after, behind the chair." : "Trước, sau và phía sau ghế cắt."}</h2>
          </div>
          <FilterChips
            items={["All", "Locs", "Barber", "Products", "Behind"]}
            active={galleryFilter}
            onChange={setGalleryFilter}
          />
          <div className="masonry-grid">
            {visibleGallery.map((item, index) => (
              <button
                className="gallery-tile reveal"
                type="button"
                key={`${item.label}-${index}`}
                onClick={() => openLightbox(index)}
              >
                <Image src={item.img} alt={item.label} fill sizes="(max-width: 700px) 100vw, 25vw" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {showShop && (
        <section id="shop" className="shop section-shell page-view">
          <div className="section-heading reveal">
            <p className="eyebrow">{pageEyebrows.shop[language]}</p>
            <h2>{isEnglish ? "Locs care & grooming goods." : "Đồ chăm locs và grooming."}</h2>
            <p>{isEnglish ? "Care products, beard goods and merch selected for the days after you leave the chair." : "Sản phẩm chăm locs, beard và merch được chọn để dùng sau mỗi lần rời ghế."}</p>
          </div>
          <div className="shop-layout">
            <div className="product-grid">
              {products.map((product) => (
                <article
                  className={`product-card reveal ${selectedProduct.name === product.name ? "selected" : ""}`}
                  key={product.name}
                >
                  <button type="button" onClick={() => setSelectedProduct(product)}>
                    <Image src={product.img} alt={product.name} width={420} height={320} />
                    <span>{product.cat}</span>
                    <h3>{product.name}</h3>
                    <p>{product.desc}</p>
                    <strong>{product.price}</strong>
                  </button>
                  <button className="small-cta" type="button" onClick={() => setCartCount((count) => count + 1)}>
                    Add to Cart
                  </button>
                </article>
              ))}
            </div>
            <aside className="product-detail reveal" aria-label="Chi tiet san pham">
              <span className="cart-pill">Cart {cartCount}</span>
              <Image src={selectedProduct.img} alt={selectedProduct.name} width={680} height={460} />
              <p className="eyebrow">{selectedProduct.cat}</p>
              <h3>{selectedProduct.name}</h3>
              <p>{selectedProduct.desc}</p>
              <dl>
                <dt>Thanh phan / loi ich</dt>
                <dd>{selectedProduct.benefits}</dd>
                <dt>Cach dung</dt>
                <dd>{selectedProduct.usage}</dd>
              </dl>
              <button className="book-button" type="button" onClick={() => setCartCount((count) => count + 1)}>
                Buy on Shopee
              </button>
            </aside>
          </div>
        </section>
      )}

      {showBarbers && (
        <section id="barbers" className="barbers section-shell page-view">
          <div className="barbers-filter-row reveal">
            <div>
              <p className="eyebrow">{pageEyebrows.barbers[language]}</p>
              <h1>{isEnglish ? "The hands that hold the shape." : "Những bàn tay giữ form."}</h1>
            </div>
            <FilterChips items={["All", "Locs", "Fade", "Classic", "Beard"]} active={barberFilter} onChange={setBarberFilter} />
          </div>

          {orderedBranchProfiles.map((branch) => {
            const branchBarbers = visibleBarbersForBranch(branch.barberIds);

            return (
              <section className="barbers-layout" key={branch.id} aria-labelledby={`barbers-${branch.id}`}>
                <aside className="barbers-branch-panel reveal is-visible" aria-label={isEnglish ? `${branch.name} information` : `Thông tin ${branch.name}`}>
                  <p className="eyebrow">{isEnglish ? branch.label.en : branch.label.vi}</p>
                  <h2 id={`barbers-${branch.id}`}>{branch.name}</h2>
                  <p className="barbers-branch-description">{isEnglish ? branch.description.en : branch.description.vi}</p>
                  <dl className="barbers-branch-details">
                    <div>
                      <dt>{isEnglish ? "Address" : "Địa chỉ"}</dt>
                      <dd>{branch.address}</dd>
                    </div>
                    <div>
                      <dt>{isEnglish ? "Contact" : "Liên hệ"}</dt>
                      <dd><a href={`tel:${branch.phone}`}>{branch.phone}</a></dd>
                    </div>
                    <div>
                      <dt>{isEnglish ? "Focus" : "Thế mạnh"}</dt>
                      <dd>{(isEnglish ? branch.specialties.en : branch.specialties.vi).join(" · ")}</dd>
                    </div>
                  </dl>
                  <div className="barbers-branch-actions">
                    <a className="book-button" href={`/booking?branch=${branch.id}`}>{isEnglish ? "Book this branch" : "Đặt lịch chi nhánh"}</a>
                    <a className="barbers-map-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.mapQuery)}`} target="_blank" rel="noreferrer">
                      {isEnglish ? "Open map" : "Mở bản đồ"} <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </aside>

                <div className="barbers-crew-area">
                  <div className="barbers-crew-heading reveal">
                    <p>{isEnglish ? `${branchBarbers.length} barbers at this branch.` : `${branchBarbers.length} barber đang làm việc tại chi nhánh này.`}</p>
                  </div>
                  <div className="barbers-carousel-shell">
                    <div className="barber-grid">
                      {branchBarbers.map((barber) => (
                        <article className="barber-card" key={barber.name}>
                          <div className="barber-card-photo">
                            <Image
                              src={barber.image}
                              alt={`${barber.name}, ${barber.role}`}
                              fill
                              sizes="(max-width: 780px) 50vw, (max-width: 1180px) 33vw, 24vw"
                            />
                          </div>
                          <div className="barber-card-content">
                            <p>{barber.role} / {barber.years}</p>
                            <h3>{barber.name}</h3>
                            <span>{barber.style}</span>
                            <p className="barber-card-bio">{barber.bio}</p>
                            <div className="barber-card-actions">
                              <a className="barber-book-link" href={`/booking?branch=${branch.id}&barber=${barber.bookingId}`}>{isEnglish ? "Book" : "Đặt lịch"}</a>
                              <a href={barber.instagram} target="_blank" rel="noreferrer" aria-label={`${barber.name} Instagram`}>
                                Instagram
                              </a>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                    <button
                      className="barbers-scroll-button"
                      type="button"
                      aria-label={isEnglish ? "Show more barbers" : "Xem thêm barber"}
                      onClick={(event) => {
                        const list = event.currentTarget.parentElement?.querySelector<HTMLElement>(".barber-grid");
                        list?.scrollBy({ left: list.clientWidth * 0.84, behavior: "smooth" });
                      }}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M4 12h15M13 6l6 6-6 6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </section>
            );
          })}
        </section>
      )}

      {showPricing && (
        <section id="pricing" className="pricing section-shell page-view">
          <div className="section-heading reveal">
            <p className="eyebrow">{pageEyebrows.pricing[language]}</p>
            <h2>{isEnglish ? "WINDREAD pricing board" : "Bảng giá WINDREAD"}</h2>
          </div>
          <div className="pricing-board reveal">
            {priceBoards.map((board) => (
              <section className="pricing-branch" key={board.branch} aria-labelledby={board.branch.replaceAll(" ", "-")}>
                <div className="pricing-branch-heading">
                  <h3 id={board.branch.replaceAll(" ", "-")}>{board.branch}</h3>
                  <p>{board.address}</p>
                </div>
                {board.groups.map((group) => (
                  <section key={`${board.branch}-${group.title}`} aria-labelledby={`${board.branch}-${group.title}`.replaceAll(" ", "-")}>
                    <h4 id={`${board.branch}-${group.title}`.replaceAll(" ", "-")}>{group.title}</h4>
                    <div className="price-table">
                      {group.rows.map(([name, desc, price]) => (
                        <div className="price-row" key={name}>
                          <strong>{name}</strong>
                          <span>{desc}</span>
                          <b>{price}</b>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </section>
            ))}
            <p className="pricing-note">
              {isEnglish
                ? "Note: Prices shown as a range depend on hair length, thickness and the requested design. The crew confirms the final price before starting."
                : "Lưu ý: Các giá dạng khoảng sẽ phụ thuộc độ dài, mật độ tóc và thiết kế thực tế. Crew sẽ xác nhận giá cuối cùng trước khi làm."}
            </p>
          </div>
        </section>
      )}

      {showNews && (
        <section id="news" className="news section-shell page-view">
          <div className="section-heading reveal">
            <p className="eyebrow">{pageEyebrows.news[language]}</p>
            <h2>{isEnglish ? "Care notes, street cuts and shop updates." : "Ghi chú chăm tóc, street cut và tin từ tiệm."}</h2>
            <p>
              {isEnglish
                ? "Short reads from the crew: how to keep locs clean, when to retwist, and what is happening inside WINDREAD."
                : "Những bài ngắn từ crew: cách giữ locs sạch, khi nào nên retwist, và những cập nhật mới trong WINDREAD."}
            </p>
          </div>
          <div className="news-grid">
            {[
              [isEnglish ? "When should you retwist?" : "Khi nào nên retwist?", isEnglish ? "A quick guide for keeping roots clean without overworking your locs." : "Hướng dẫn nhanh để chân locs gọn mà không làm tóc bị quá tải.", "/images/thumb2.webp"],
              [isEnglish ? "Fade shapes for dread styles" : "Fade nào hợp với dread?", isEnglish ? "Low, taper, burst or high fade: how each shape changes your silhouette." : "Low, taper, burst hay high fade: mỗi form sẽ đổi silhouette của bạn thế nào.", "/images/thumb1.webp"],
              [isEnglish ? "Braid care after the chair" : "Chăm braid sau khi rời ghế", isEnglish ? "How to sleep, wash and keep your pattern sharp for longer." : "Cách ngủ, gội và giữ pattern sắc lâu hơn sau khi braid.", "/images/thumb3.webp"]
            ].map(([title, text, img]) => (
              <article className="news-card reveal" key={title}>
                <Image src={img} alt="" width={520} height={346} />
                <span>{isEnglish ? "WINDREAD Journal" : "Nhật ký WINDREAD"}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {showBooking && (
        <section id="booking" className="booking section-shell page-view">
          <div className="booking-copy reveal">
            <p className="eyebrow">{pageEyebrows.booking[language]}</p>
            <h2>{isEnglish ? "Book ahead. Sit down with the right vibe." : "Đặt trước. Vào ghế đúng vibe."}</h2>
            <p>
              {isEnglish
                ? "Pick branch, service, barber and a real open slot. The crew sees the details before you sit down."
                : "Chọn cơ sở, dịch vụ, thợ và khung giờ còn trống thật. Crew nắm đủ thông tin trước khi bạn vào ghế."}
            </p>
            <a className="ghost-button admin-booking-link" href="/admin/bookings">
              {isEnglish ? "Staff board" : "Bảng quản lý"}
            </a>
          </div>
          <BookingExperience isEnglish={isEnglish} />
        </section>
      )}

      {showContact && (
        <section id="contact" className="contact section-shell page-view">
          <div className="section-heading reveal">
            <p className="eyebrow">{pageEyebrows.contact[language]}</p>
            <h2>{isEnglish ? "The WINDREAD chair is on." : "Ghế WINDREAD đang sáng đèn."}</h2>
          </div>
          <div className="contact-grid">
            <div className="map-card reveal" aria-label="Ban do WINDREAD">
              <span className="map-pin">W</span>
              <p>{isEnglish ? "Ngu Hanh Son / Da Nang" : "Ngũ Hành Sơn / Đà Nẵng"}</p>
            </div>
            <div className="contact-cards">
              {[
                [isEnglish ? "Address 1" : "Địa chỉ 1", "35 - 37 An Thượng 29, Ngũ Hành Sơn, Đà Nẵng"],
                [isEnglish ? "Address 2" : "Địa chỉ 2", "223 Chương Dương, Ngũ Hành Sơn, Đà Nẵng"],
                [isEnglish ? "Opening hours" : "Giờ mở cửa", "Mon-Sat 10:00-21:00 / Sun 12:00-18:00"],
                [isEnglish ? "Phone" : "Điện thoại", "0393549656 (Zalo / WhatsApp)"]
              ].map(([title, text]) => (
                <article className="info-card reveal" key={title}>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
              <a className="book-button" href="/booking">
                {isEnglish ? "Book Now" : "Đặt lịch"}
              </a>
            </div>
          </div>
        </section>
      )}

      {showHome && (
        <section className="branch-directory section-shell" aria-labelledby="branch-directory-title">
          <div className="branch-directory-heading reveal">
            <h2 id="branch-directory-title">{isEnglish ? "Choose your WINDREAD." : "Chọn chi nhánh WINDREAD."}</h2>
            <p>{isEnglish ? "See the space, meet the crew and book at the branch that fits your style." : "Xem không gian, gặp crew và đặt lịch đúng nơi hợp với style của bạn."}</p>
          </div>
          <div className="branch-directory-grid">
            {orderedBranchProfiles.map((branch) => (
              <a className="branch-directory-card reveal" href={`/branches/${branch.id}`} key={branch.id}>
                <span className="branch-directory-image">
                  <Image src={branch.image} alt={`Không gian ${branch.name}`} fill sizes="(max-width: 760px) 100vw, 50vw" />
                </span>
                <span className="branch-directory-copy">
                  <small>{isEnglish ? branch.label.en : branch.label.vi}</small>
                  <strong>{branch.name}</strong>
                  <em>{branch.address}</em>
                  <b>{isEnglish ? "Specializes in" : "Chuyên"}: {isEnglish ? branch.specialties.en.join(", ") : branch.specialties.vi.join(", ")}</b>
                  <i>{isEnglish ? "View branch" : "Xem chi nhánh"} <span aria-hidden="true">→</span></i>
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      <footer className="site-footer">
        <div className="torn-divider" aria-hidden="true" />
        <div className="footer-content">
          <div className="footer-brand">
            <Image
              src="/images/windread-logo.png"
              alt="Win Dread Locs Barber Club"
              width={1327}
              height={404}
              className="footer-logo"
            />
            <div className="footer-contact">
              <span>35 - 37 An Thượng 29, Ngũ Hành Sơn, Đà Nẵng</span>
              <span>223 Chương Dương, Ngũ Hành Sơn, Đà Nẵng</span>
              <a href="tel:0393549656">0393549656 (Zalo / WhatsApp)</a>
            </div>
            <div className="footer-brand-follow">
              <h2>{isEnglish ? "Follow Us" : "Theo dõi"}</h2>
              <div className="footer-socials">
                {socialLinks.map((link) => (
                  <a key={link.label} href={link.href} aria-label={link.label}>
                    <SocialIcon icon={link.icon} label={link.label} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <nav className="footer-links" aria-label={isEnglish ? "Footer quick links" : "Liên kết footer"}>
            <h2>{isEnglish ? "Quick Links" : "Liên kết nhanh"}</h2>
            <a href="/">{isEnglish ? "Home" : "Trang chủ"}</a>
            <a href="/about">{isEnglish ? "About" : "Giới thiệu"}</a>
            <a href="/services">{isEnglish ? "Services" : "Dịch vụ"}</a>
            <a href="/gallery">{isEnglish ? "Gallery" : "Thư viện"}</a>
            <a href="/booking">{isEnglish ? "Booking" : "Đặt lịch"}</a>
            <a href="/contact">{isEnglish ? "Contact" : "Liên hệ"}</a>
          </nav>
        </div>

        <div className="footer-media" aria-hidden="true">
          <Image
            src="/images/footerbg.png"
            alt=""
            width={1038}
            height={400}
            className="footer-image"
          />
        </div>
        <p className="footer-copyright">
          © 2025 Win Dread Locs & Barber Club. All Rights Reserved
        </p>
      </footer>

      {lightboxOpen && currentLightboxItem && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Gallery viewer">
          <button className="lightbox-close" type="button" onClick={() => setLightboxOpen(false)}>
            Close
          </button>
          <button
            className="lightbox-nav prev"
            type="button"
            aria-label="Anh truoc"
            onClick={() => setSelectedImage((index) => (index === 0 ? visibleGallery.length - 1 : index - 1))}
          >
            ‹
          </button>
          <Image src={currentLightboxItem.img} alt={currentLightboxItem.label} width={1100} height={760} />
          <p>{currentLightboxItem.label}</p>
          <button
            className="lightbox-nav next"
            type="button"
            aria-label="Anh tiep"
            onClick={() => setSelectedImage((index) => (index + 1) % visibleGallery.length)}
          >
            ›
          </button>
        </div>
      )}
    </main>
  );
}

function ServiceColumn({
  title,
  items
}: {
  title: string;
  items: { name: string; desc: string; time: string; price: string }[];
}) {
  return (
    <article className="service-column reveal">
      <h3>{title}</h3>
      {items.map((item) => (
        <div className="service-row" key={item.name}>
          <div>
            <h4>{item.name}</h4>
            <p>{item.desc}</p>
          </div>
          <div>
            <span>{item.time}</span>
            <a href="/pricing">{item.price}</a>
          </div>
        </div>
      ))}
    </article>
  );
}

function FilterChips({
  items,
  active,
  onChange
}: {
  items: string[];
  active: string;
  onChange: (item: string) => void;
}) {
  return (
    <div className="filter-chips reveal" role="tablist" aria-label="Bo loc">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          className={active === item ? "active" : ""}
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  return <SitePage page="home" />;
}
