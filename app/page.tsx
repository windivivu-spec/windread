"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { branchProfiles } from "./branches/branchData";
import { formatCurrency } from "./booking/availabilityUtils";
import { BookingExperience } from "./booking/BookingExperience";
import { getServiceCategory, serviceCategories } from "./booking/serviceCategories";
import { getLocalizedPriceLabel, getLocalizedService, groupServicesForDisplay } from "./booking/servicePresentation";
import type { Service } from "./booking/types";

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
type ServiceExplorerKey = "barber" | "dread" | "braid";
type PricingBranchId = "chuong-duong" | "an-thuong";
type PricingCategoryId = "barber" | "dreadlocks" | "braids" | "afro";

const socialLinks = [
  { label: "Instagram", icon: "IG", href: "https://www.instagram.com/windread.locs_barber.club" },
  { label: "Facebook", icon: "FB", href: "https://www.facebook.com/profile.php?id=61583308184992" }
];

const heroHighlights = [
  {
    icon: "/images/hero-specialties/barber.png",
    viTitle: "Barber",
    viDesc: "Fade và cắt tạo kiểu",
    enTitle: "Barber",
    enDesc: "Fades and sharp cuts"
  },
  {
    icon: "/images/hero-specialties/dreadlocks.png",
    viTitle: "Dreadlocks",
    viDesc: "Locs theo chất riêng",
    enTitle: "Dreadlocks",
    enDesc: "Locs with character"
  },
  {
    icon: "/images/hero-specialties/afro-hair.png",
    viTitle: "Afro Hair",
    viDesc: "Tôn vinh tóc tự nhiên",
    enTitle: "Afro Hair",
    enDesc: "Natural texture care"
  },
  {
    icon: "/images/hero-specialties/braids-cornrows.png",
    viTitle: "Braids & Cornrows",
    viDesc: "Tết tóc theo phom riêng",
    enTitle: "Braids & Cornrows",
    enDesc: "Braids made for you"
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
  { src: "/images/moment/DSC09798.webp", orientation: "portrait" },
  { src: "/images/moment/DSC09788.webp", orientation: "landscape" },
  { src: "/images/moment/DSC09870.webp", orientation: "portrait" },
  { src: "/images/moment/DSC09923.webp", orientation: "landscape" },
  { src: "/images/moment/DSC09889.webp", orientation: "portrait" },
  { src: "/images/moment/Unknown-7.webp", orientation: "landscape" },
  { src: "/images/moment/DSC09946.webp", orientation: "portrait" },
  { src: "/images/moment/Unknown-4.webp", orientation: "landscape" },
  { src: "/images/moment/DSC09957.webp", orientation: "portrait" },
  { src: "/images/moment/Unknown-5.webp", orientation: "landscape" },
  { src: "/images/moment/DSC09979.webp", orientation: "portrait" },
  { src: "/images/moment/moment6.webp", orientation: "landscape" },
  { src: "/images/moment/moment1.webp", orientation: "portrait" },
  { src: "/images/moment/moment8.webp", orientation: "landscape" },
  { src: "/images/moment/moment5.webp", orientation: "portrait" },
  { src: "/images/moment/moment10.webp", orientation: "landscape" },
  { src: "/images/moment/moment7.webp", orientation: "portrait" },
  { src: "/images/moment/moment11.webp", orientation: "landscape" },
  { src: "/images/moment/moment12.webp", orientation: "portrait" },
  { src: "/images/moment/moment13.webp", orientation: "landscape" },
  { src: "/images/moment/moment14.webp", orientation: "landscape" },
  { src: "/images/moment/moment19.webp", orientation: "landscape" },
  { src: "/images/moment/moment20.webp", orientation: "landscape" }
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

const legacyPriceBoards = [
  {
    id: "an-thuong",
    branch: "Cơ sở 1 · An Thượng",
    address: "35–37 An Thượng 29 · Locs, dreadlock, braids & grooming",
    groups: [
      {
        title: "Barber, Combo & VIP",
        rows: [
          ["Cắt tóc & tạo kiểu", "Với Uppercut · 45 phút", "150.000đ"],
          ["Cạo khăn nóng & lạnh", "Hot & cold towel shave · 30 phút", "120.000đ"],
          ["Tỉa râu cơ bản / cắt side", "Chọn một dịch vụ · 25 phút", "100.000đ"],
          ["Sấy & tạo kiểu tóc", "Hair styling", "100.000đ"],
          ["Gội đầu thường", "Hair washing", "50.000đ"],
          ["Gội & làm sạch Dreads / Locs", "Tùy độ dài", "50.000–150.000đ"],
          ["Gội & sấy tóc Afro", "Afro hair wash & blow-dry", "100.000–200.000đ"],
          ["Tattoo tóc cơ bản", "Theo thiết kế", "50.000–150.000đ"],
          ["Gentleman's Set I", "Cắt + cạo khăn nóng/lạnh + Uppercut", "250.000đ"],
          ["Gentleman's Set II", "Cắt + gội + cạo khăn nóng/lạnh + Uppercut", "290.000đ"],
          ["VIP Gentleman's Combo", "Chỉ nhận đặt lịch trước", "390.000đ"]
        ]
      },
      {
        title: "Dreadlock, Braids & Maintenance",
        rows: [
          ["Dreadlock", "Theo độ dài, mật độ và nền tóc", "2.000.000–8.000.000đ"],
          ["Single Dread", "1 dread, dài 20–30cm", "150.000đ / dread"],
          ["Pair of Dreads", "1 cặp dread, dài 30–40cm", "300.000đ / cặp"],
          ["Cornrow 2–8 line", "Tết theo số line", "150.000đ / line"],
          ["Cornrow 10–16 line", "Tết theo số line", "130.000đ / line"],
          ["Braids nam", "Box braids / pattern", "1.000.000–3.000.000đ"],
          ["Braids nữ", "Box braids theo độ dài & mật độ", "3.000.000–4.000.000đ"],
          ["Styling design", "Twist, cornrow hoặc braids", "400.000đ / giờ"],
          ["Maintenance · 1 thợ", "Giờ đầu 400.000đ; từ giờ thứ hai", "300.000đ / giờ"],
          ["Maintenance · 2 thợ", "Giờ đầu 600.000đ; giờ 2 / từ giờ 3", "500.000đ / 400.000đ mỗi giờ"]
        ]
      },
      {
        title: "Add-on xử lý tóc",
        rows: [
          ["Uốn basic", "Uốn cơ bản", "300.000–400.000đ"],
          ["Uốn xoăn", "Curly perm", "350.000–450.000đ"],
          ["Uốn Ruffled", "Ruffled perm", "400.000–450.000đ"],
          ["Uốn sâu", "Texture perm", "400.000–450.000đ"],
          ["Uốn PremLock", "Theo độ dài tóc", "800.000–1.300.000đ"],
          ["Uốn Afro", "Theo độ dài tóc", "1.000.000–1.500.000đ"],
          ["Tẩy tóc", "Tính theo lần tẩy", "250.000đ / lần"],
          ["Tẩy nối chân", "Theo nền tóc", "400.000–600.000đ"],
          ["Ép side", "Hair pressed down", "250.000đ"],
          ["Phục hồi tóc", "Hair restore", "300.000–400.000đ"],
          ["Nhuộm râu", "Beard dye", "150.000–250.000đ"],
          ["Nhuộm đen", "Black dye", "150.000–250.000đ"]
        ]
      }
    ]
  },
  {
    id: "chuong-duong",
    branch: "Cơ sở 2 · Chương Dương",
    address: "223 Chương Dương · Barber, uốn, nhuộm & chăm sóc tóc",
    groups: [
      {
        title: "Haircut, Beard & Facial Care",
        rows: [
          ["Cắt tóc & tạo kiểu", "Với pomade", "120.000đ"],
          ["Fade hai bên & gáy", "Làm gọn side và gáy", "90.000đ"],
          ["Cắt tóc nam dài", "Chỉnh form tóc nam dài", "200.000đ"],
          ["Tattoo tóc cơ bản", "Theo thiết kế", "50.000–150.000đ"],
          ["Gội đầu thư giãn", "Hair washing", "40.000đ"],
          ["Cắt tóc bởi chuyên gia", "Chỉ nhận lịch hẹn trước", "160.000đ"],
          ["Tỉa râu", "Tạo form râu", "80.000đ"],
          ["Tỉa râu cơ bản / cạo viền", "Làm gọn đường viền", "70.000đ"],
          ["Cạo đầu / cạo mặt", "Dịch vụ cạo cơ bản", "70.000đ"],
          ["Cạo khăn nóng & lạnh", "Hot & cold towel shave", "60.000đ"]
        ]
      },
      {
        title: "Hair Care & Perming",
        rows: [
          ["Gội & sấy tạo kiểu", "Với pomade", "70.000đ"],
          ["Phục hồi Keratin", "Cho tóc khô xơ", "200.000–400.000đ"],
          ["Ép side", "Down perm", "250.000đ"],
          ["Uốn basic", "Theo độ dài và nền tóc", "300.000–400.000đ"],
          ["Uốn xoăn", "Curly perm", "350.000–450.000đ"],
          ["Uốn Ruffled", "Tạo texture", "400.000–500.000đ"],
          ["Uốn PremLock", "Theo độ dài và nền tóc", "800.000–1.200.000đ"],
          ["Uốn Afro", "Theo độ dài và nền tóc", "1.000.000–1.500.000đ"]
        ]
      },
      {
        title: "Bleaching & Coloring",
        rows: [
          ["Tẩy tóc", "Tính theo mỗi lần tẩy", "250.000đ / lần"],
          ["Tẩy nối chân tóc", "Bleach root touch-up", "500.000–900.000đ"],
          ["Nhuộm tóc thời trang", "Theo nền tóc", "250.000–350.000đ"],
          ["Nhuộm đen", "Hair blackening", "150.000–250.000đ"],
          ["Nhuộm râu", "Beard coloring", "150.000–250.000đ"],
          ["Nhuộm râu cơ bản", "Basic beard coloring", "100.000đ"]
        ]
      }
    ]
  }
];

const barbers = [
  {
    bookingId: "huy",
    name: "FARM",
    role: "BARBER",
    specialties: ["Haircut | Beard Trim & Shape-Up"],
    years: "5 năm",
    bio: "Fade mượt, line up sắc và form cắt hợp phong cách streetwear.",
    style: "Low fade, burst fade, sharp line up",
    image: "/images/barber/barber1.webp"
  },
  {
    bookingId: "van-huy",
    name: "HUYBRAIDER",
    role: "BARBER",
    specialties: ["Afro Hair Braiding & Loc Artistry & Haircut"],
    years: "5 năm",
    bio: "Tay kéo gọn, fade mượt, hợp streetwear và form mặt châu Á.",
    style: "Low fade, burst fade, sharp line up",
    image: "/images/barber/barber2.webp"
  },
  {
    bookingId: "tinh",
    name: "TINHTEOTOP",
    role: "BARBER",
    specialties: ["Haircut"],
    years: "1 năm",
    bio: "Classic barber rituals, hot towel, beard shape và finish premium.",
    style: "Tapered beard, calm shave, old-school finish",
    image: "/images/barber/barber3.webp"
  },
  {
    bookingId: "phuc",
    name: "DEMIBOY",
    role: "BARBER",
    specialties: ["Haircut", "Dreadlock"],
    years: "1 năm",
    bio: "Tư vấn màu, texture và treatment phù hợp với nền tóc hiện tại.",
    style: "Color, texture, treatment",
    image: "/images/barber/barber4.webp"
  },
  {
    bookingId: "thuan",
    name: "THUANBARBER",
    role: "BARBER",
    specialties: ["Haircut"],
    years: "4 năm",
    bio: "Xử lý layer và texture tự nhiên cho các form tóc có độ chuyển động.",
    style: "Textured crop, layered cut, natural volume",
    image: "/images/barber/barber5.webp"
  },
  {
    bookingId: "kien",
    name: "KD",
    role: "BARBER",
    specialties: ["Haircut"],
    years: "5 năm",
    bio: "Tập trung vào đường viền tóc, taper và finish sạch từ mọi góc nhìn.",
    style: "Line up, taper, clean finish",
    image: "/images/barber/barber6.webp"
  },
  {
    bookingId: "duy",
    name: "DUY LOCS",
    role: "BARBER",
    specialties: ["Haircut + Locs"],
    years: "5 năm",
    bio: "Tư vấn texture, màu trầm và treatment để giữ tóc khỏe sau xử lý.",
    style: "Wave, color, treatment",
    image: "/images/barber/barber7.webp"
  },
  {
    bookingId: "win-dread",
    name: "WIN DREAD",
    role: "FOUNDER",
    specialties: ["Classic"],
    years: "5 năm",
    bio: "Xử lý texture, màu trầm và những form tóc cần độ chuyển tự nhiên.",
    style: "Texture crop, soft color, natural finish",
    image: "/images/barber/barber8.webp"
  }
];

type CatalogGender = "Men" | "Women";

type HairstyleCatalog = {
  id: "dreadlocks" | "cornrows" | "barrel-twist" | "twist" | "braids";
  title: string;
  viDesc: string;
  enDesc: string;
  cover: string;
  collections: Array<{
    gender: CatalogGender;
    images: string[];
  }>;
};

const hairstyleCatalog: HairstyleCatalog[] = [
  {
    id: "dreadlocks",
    title: "Dreadlocks",
    viDesc: "Locs rõ section, giữ texture thật và form bền theo thời gian.",
    enDesc: "Defined sections, real texture and a form that holds over time.",
    cover: "/images/collection /thumbnail/dreadlock.webp",
    collections: [
      {
        gender: "Men",
        images: [
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
          "/images/collection / Dreadlocks for Men/collection14.webp"
        ]
      },
      {
        gender: "Women",
        images: [
          "/images/collection /Dreadlocks for Women/collection1.webp",
          "/images/collection /Dreadlocks for Women/collection2.webp",
          "/images/collection /Dreadlocks for Women/collection3.webp",
          "/images/collection /Dreadlocks for Women/collection4.webp",
          "/images/collection /Dreadlocks for Women/collection5.webp",
          "/images/collection /Dreadlocks for Women/collection6.webp",
          "/images/collection /Dreadlocks for Women/collection7.webp",
          "/images/collection /Dreadlocks for Women/collection8.webp"
        ]
      }
    ]
  },
  {
    id: "cornrows",
    title: "Cornrows",
    viDesc: "Đường tết sát da đầu, gọn nét và cá nhân hóa theo pattern.",
    enDesc: "Close-to-scalp braids with clean lines and custom patterns.",
    cover: "/images/collection /thumbnail/cornrow.webp",
    collections: [
      {
        gender: "Men",
        images: [
          "/images/collection /Cornrows for Men/collection1.webp",
          "/images/collection /Cornrows for Men/collection2.webp",
          "/images/collection /Cornrows for Men/collection3.webp",
          "/images/collection /Cornrows for Men/collection4.webp",
          "/images/collection /Cornrows for Men/collection5.webp",
          "/images/collection /Cornrows for Men/collection6.webp",
          "/images/collection /Cornrows for Men/collection7.webp",
          "/images/collection /Cornrows for Men/collection8.webp"
        ]
      }
    ]
  },
  {
    id: "twist",
    title: "Twist",
    viDesc: "Twist đều sợi, nhẹ đầu và dễ biến tấu theo độ dài tóc.",
    enDesc: "Even twists with a light feel, shaped around your length.",
    cover: "/images/collection /thumbnail/Twist .webp",
    collections: [
      {
        gender: "Men",
        images: [
          "/images/collection /Twist for Men/collection1.webp",
          "/images/collection /Twist for Men/collection2.webp",
          "/images/collection /Twist for Men/collection3.webp",
          "/images/collection /Twist for Men/collection4.webp",
          "/images/collection /Twist for Men/collection5.webp",
          "/images/collection /Twist for Men/collection6.webp",
          "/images/collection /Twist for Men/collection7.webp",
          "/images/collection /Twist for Men/collection8.webp"
        ]
      }
    ]
  },
  {
    id: "braids",
    title: "Braids",
    viDesc: "Box braids và braid tự nhiên, chọn form theo mật độ tóc riêng.",
    enDesc: "Box and natural braids selected around your density and shape.",
    cover: "/images/collection /thumbnail/braids.webp",
    collections: [
      {
        gender: "Men",
        images: [
          "/images/collection /Boxbraids for Men/collection1.webp",
          "/images/collection /Boxbraids for Men/collection2.webp",
          "/images/collection /Boxbraids for Men/collection3.webp",
          "/images/collection /Boxbraids for Men/collection4.webp",
          "/images/collection /Boxbraids for Men/collection5.webp",
          "/images/collection /Boxbraids for Men/collection6.webp",
          "/images/collection /Boxbraids for Men/collection7.webp",
          "/images/collection /Boxbraids for Men/collection8.webp"
        ]
      },
      {
        gender: "Women",
        images: [
          "/images/collection /Braids for Women/collection1.webp",
          "/images/collection /Braids for Women/collection2.webp",
          "/images/collection /Braids for Women/collection3.webp",
          "/images/collection /Braids for Women/collection5.webp",
          "/images/collection /Braids for Women/collection6.webp",
          "/images/collection /Braids for Women/collection7.webp",
          "/images/collection /Braids for Women/collection8.webp"
        ]
      }
    ]
  },
  {
    id: "barrel-twist",
    title: "Barrel Twist",
    viDesc: "Locs được cuộn chắc tay, tạo độ nổi khối và nhịp chuyển rõ.",
    enDesc: "Locs wrapped with definition for sculpted volume and movement.",
    cover: "/images/collection /thumbnail/Barrel Twist .webp",
    collections: [
      {
        gender: "Men",
        images: [
          "/images/collection /Barrel Twist for Men/collection1.webp",
          "/images/collection /Barrel Twist for Men/collection2.webp",
          "/images/collection /Barrel Twist for Men/collection3.webp",
          "/images/collection /Barrel Twist for Men/collection4.webp",
          "/images/collection /Barrel Twist for Men/collection5.webp",
          "/images/collection /Barrel Twist for Men/collection6.webp"
        ]
      }
    ]
  }
];

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

export function SitePage({
  page,
  pricingServices = [],
  pricingDataUnavailable = false
}: {
  page?: PageKey;
  pricingServices?: Service[];
  pricingDataUnavailable?: boolean;
}) {
  const pathname = usePathname();
  const currentPage = page ?? routeForPage(pathname);
  const [language, setLanguage] = useState<Lang>("vi");
  const [barberFilter, setBarberFilter] = useState("All");
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [selectedCatalogId, setSelectedCatalogId] = useState<HairstyleCatalog["id"]>("dreadlocks");
  const [selectedCatalogGender, setSelectedCatalogGender] = useState<CatalogGender>("Men");
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeServiceExplorer, setActiveServiceExplorer] = useState<ServiceExplorerKey>("dread");
  const [isServiceExplorerOpen, setIsServiceExplorerOpen] = useState(false);
  const [preloadedServiceGroups, setPreloadedServiceGroups] = useState<ServiceExplorerKey[]>([]);
  const [preloadedCatalogs, setPreloadedCatalogs] = useState<HairstyleCatalog["id"][]>([]);
  const [recoveredPricingServices, setRecoveredPricingServices] = useState<Service[]>([]);
  const [pricingRecoveryFailed, setPricingRecoveryFailed] = useState(false);
  const [activePricingBranchId, setActivePricingBranchId] = useState<PricingBranchId>("chuong-duong");
  const [activePricingCategoryId, setActivePricingCategoryId] = useState<PricingCategoryId>("barber");
  const isEnglish = language === "en";
  const visiblePricingServices = pricingServices.length > 0 ? pricingServices : recoveredPricingServices;

  const visibleBarbersForBranch = (barberIds: string[]) =>
    barbers.filter(
      (barber) =>
        barberIds.includes(barber.bookingId) &&
        (barberFilter === "All" || barber.specialties.join(" ").toLowerCase().includes(barberFilter.toLowerCase()))
    );

  function warmServiceGroup(groupKey: ServiceExplorerKey) {
    setPreloadedServiceGroups((current) => (current.includes(groupKey) ? current : [...current, groupKey]));
  }

  function warmCatalog(catalogId: HairstyleCatalog["id"]) {
    setPreloadedCatalogs((current) => (current.includes(catalogId) ? current : [...current, catalogId]));
  }

  const selectedCatalog = hairstyleCatalog.find((catalog) => catalog.id === selectedCatalogId) ?? hairstyleCatalog[0];
  const selectedCatalogCollection =
    selectedCatalog.collections.find((collection) => collection.gender === selectedCatalogGender) ?? selectedCatalog.collections[0];
  const activeCatalogImages = selectedCatalogCollection.images;

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
    if (currentPage !== "pricing" || pricingServices.length > 0 || !pricingDataUnavailable) return;
    let isCurrent = true;

    Promise.all(
      ["chuong-duong", "an-thuong"].map(async (branchId) => {
        const response = await fetch(`/api/services?branchId=${branchId}`);
        if (!response.ok) throw new Error("Pricing recovery failed");
        return (await response.json()) as Service[];
      })
    )
      .then((result) => {
        if (isCurrent) setRecoveredPricingServices(result.flat());
      })
      .catch(() => {
        if (isCurrent) setPricingRecoveryFailed(true);
      });

    return () => {
      isCurrent = false;
    };
  }, [currentPage, pricingDataUnavailable, pricingServices.length]);

  useEffect(() => {
    if (!menuOpen && !catalogOpen) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setCatalogOpen(false);
      }

    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [catalogOpen, menuOpen]);

  function openCatalog(catalog: HairstyleCatalog) {
    warmCatalog(catalog.id);
    if (catalogOpen && selectedCatalogId === catalog.id) {
      setCatalogOpen(false);
      return;
    }
    setSelectedCatalogId(catalog.id);
    setSelectedCatalogGender(catalog.collections[0].gender);
    setCatalogOpen(true);
  }

  function renderHairstyleCatalog() {
    return (
      <>
        <div className="catalog-image-preloads" aria-hidden="true">
          {preloadedCatalogs.map((catalogId) => {
            const catalog = hairstyleCatalog.find((item) => item.id === catalogId);
            if (!catalog) return null;

            return (
              <div className="catalog-image-preload" key={catalog.id}>
                {catalog.collections.flatMap((collection) => collection.images).map((image) => (
                  <Image
                    key={image}
                    src={image}
                    alt=""
                    fill
                    sizes="(max-width: 780px) 33vw, (max-width: 1080px) 33vw, 20vw"
                    loading="eager"
                    decoding="async"
                    quality={70}
                  />
                ))}
              </div>
            );
          })}
        </div>
        <div className="hairstyle-catalog-grid" aria-label={isEnglish ? "Hairstyle catalogs" : "Các catalog kiểu tóc"}>
          {hairstyleCatalog.map((catalog) => (
            <button
              className="hairstyle-catalog-card reveal"
              type="button"
              key={catalog.id}
              onPointerEnter={() => warmCatalog(catalog.id)}
              onFocus={() => warmCatalog(catalog.id)}
              onTouchStart={() => warmCatalog(catalog.id)}
              onClick={() => openCatalog(catalog)}
              aria-expanded={catalogOpen && selectedCatalogId === catalog.id}
            >
              <span className="hairstyle-catalog-cover">
                <Image
                  src={catalog.cover}
                  alt={`${catalog.title} ${isEnglish ? "catalog cover" : "ảnh bìa catalog"}`}
                  fill
                  sizes="(max-width: 1080px) 33vw, 20vw"
                  loading="eager"
                  decoding="async"
                  quality={70}
                  onLoad={(event) => event.currentTarget.closest(".hairstyle-catalog-cover")?.classList.add("is-loaded")}
                />
                <span className="hairstyle-catalog-overlay">
                  <small>{catalog.collections.map((collection) => collection.gender).join(" / ")}</small>
                  <span className="hairstyle-catalog-text">
                    <strong>{catalog.title}</strong>
                    <span>{isEnglish ? catalog.enDesc : catalog.viDesc}</span>
                  </span>
                </span>
              </span>
            </button>
          ))}
        </div>
        <div className="catalog-mobile-scroll-hint" aria-hidden="true">
          <span className="catalog-scroll-arrow catalog-scroll-arrow-left">←</span>
          <span>{isEnglish ? "Swipe to explore" : "Vuốt để xem thêm"}</span>
          <span className="catalog-scroll-arrow catalog-scroll-arrow-right">→</span>
        </div>
        {catalogOpen && (
          <div className="catalog-inline-panel" aria-label={`${selectedCatalog.title} ${selectedCatalogGender}`}>
            {selectedCatalog.collections.length > 1 && (
              <div className="catalog-inline-tabs" role="tablist" aria-label={isEnglish ? "Collection groups" : "Nhóm bộ ảnh"}>
                {selectedCatalog.collections.map((collection) => (
                  <button
                    type="button"
                    key={collection.gender}
                    role="tab"
                    aria-selected={selectedCatalogGender === collection.gender}
                    className={selectedCatalogGender === collection.gender ? "active" : ""}
                    onClick={() => setSelectedCatalogGender(collection.gender)}
                  >
                    {collection.gender}
                  </button>
                ))}
              </div>
            )}
            <div className="catalog-inline-grid" key={`${selectedCatalog.id}-${selectedCatalogGender}`}>
              {activeCatalogImages.map((image, index) => (
                <figure
                  className="catalog-inline-tile"
                  key={image}
                  style={{ "--catalog-delay": `${index * 42}ms` } as CSSProperties}
                >
                  <Image
                    src={image}
                    alt={`${selectedCatalog.title} ${selectedCatalogGender} ${index + 1}`}
                    fill
                    sizes="(max-width: 1080px) 33vw, 20vw"
                    loading={index < 5 ? "eager" : "lazy"}
                    decoding="async"
                    quality={70}
                    onLoad={(event) => event.currentTarget.closest(".catalog-inline-tile")?.classList.add("is-loaded")}
                  />
                </figure>
              ))}
            </div>
          </div>
        )}
      </>
    );
  }

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
  const pricingBranches = [
    {
      id: "chuong-duong",
      branch: isEnglish ? "Branch 01 · Chương Dương" : "Cơ sở 1 · Chương Dương",
      address: "223 Chương Dương · Barber, Dreadlocks, Braids & Afro"
    },
    {
      id: "an-thuong",
      branch: isEnglish ? "Branch 02 · An Thượng" : "Cơ sở 2 · An Thượng",
      address: "35–37 An Thượng 29 · Locs, braids & grooming"
    }
  ] as const;
  const priceBoards = pricingBranches.map((branch) => ({
    ...branch,
    groups: serviceCategories
      .map((category) => ({
        id: category.id,
        title: isEnglish ? category.labelEn : category.label,
        sections: groupServicesForDisplay(
          visiblePricingServices.filter((service) => service.branchId === branch.id && getServiceCategory(service) === category.id),
          isEnglish
        )
      }))
      .filter((group) => group.sections.length > 0)
  }));
  const activePricingBoard = priceBoards.find((board) => board.id === activePricingBranchId) ?? priceBoards[0];
  const activePricingGroup = activePricingBoard?.groups.find((group) => group.id === activePricingCategoryId) ?? activePricingBoard?.groups[0];

  function selectPricingBranch(branchId: PricingBranchId) {
    const nextBoard = priceBoards.find((board) => board.id === branchId);
    setActivePricingBranchId(branchId);
    if (nextBoard && !nextBoard.groups.some((group) => group.id === activePricingCategoryId)) {
      setActivePricingCategoryId(nextBoard.groups[0]?.id ?? "barber");
    }
  }

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
                  alt="WINDREAD - Dreadlock, Braid & Barber Đà Nẵng"
                  width={1327}
                  height={331}
                  priority
                  className="brand-logo"
                />
                <span className="sr-only">
                  {isEnglish
                    ? "WINDREAD - Leading Dreadlock, Braid, Cornrow & Barber Studio in Da Nang, Vietnam"
                    : "WINDREAD - Tiệm Làm Dreadlock, Braid, Cornrow & Barber Hàng Đầu Tại Đà Nẵng"}
                </span>
              </h1>
              <div className="hero-subcontent">
                <div className="hero-highlights" aria-label={isEnglish ? "Signature styles" : "Bốn kiểu tóc đặc trưng"}>
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
                <div className="hero-details">
                  <div className="hero-pole" aria-hidden="true">
                    <video className="hero-pole-video" autoPlay loop muted playsInline preload="metadata">
                      <source src="/loop-web.mp4" type="video/mp4" />
                      <source src="/loop-web.mov" type="video/quicktime" />
                    </video>
                  </div>
                  <div className="hero-subcopy">
                    {isEnglish ? (
                      <p className="hero-desc">
                        A minimalist, sharp, and disciplined space. Where raw hair texture is elevated by premium services and a street soul.
                      </p>
                    ) : (
                      <ul className="hero-desc hero-desc-list">
                        <li>Không gian đậm chất Street vibes - Old School 90’s.</li>
                        <li>Thánh địa của tóc nam, Afro, Dreadlocks &amp; Braids.</li>
                        <li>Tôn vinh kiểu tóc đẹp qua đôi tay thợ tóc từ đường phố.</li>
                      </ul>
                    )}
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
          <div className="hero-mobile-highlights" aria-label={isEnglish ? "Signature styles" : "Bốn kiểu tóc đặc trưng"}>
            {heroHighlights.map((item) => (
              <div className="hero-highlight" key={`mobile-${item.viTitle}`}>
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
          <div className="service-image-preloads" aria-hidden="true">
            {preloadedServiceGroups.map((groupKey) => {
              const group = serviceExplorerGroups.find((item) => item.key === groupKey);
              if (!group) return null;
              return (
                <div className="service-image-preload" key={group.key}>
                  <Image src={group.image} alt="" fill sizes="(max-width: 780px) 100vw, 76vw" loading="eager" decoding="async" quality={70} />
                  {group.services.map((service) => (
                    <Image key={service.en} src={service.image} alt="" fill sizes="(max-width: 780px) 50vw, 18vw" loading="eager" decoding="async" quality={70} />
                  ))}
                </div>
              );
            })}
          </div>
          {isServiceExplorerOpen ? (
            <div className="service-explorer" aria-label={isEnglish ? "Service explorer" : "Khám phá dịch vụ"}>
              <article className="service-explorer-panel" key={activeServiceGroup.key}>
                <Image
                  className="service-explorer-panel-image"
                  src={activeServiceGroup.image}
                  alt=""
                  fill
                  sizes="(max-width: 780px) 100vw, 76vw"
                  loading="eager"
                  decoding="async"
                  quality={70}
                  onLoad={(event) => event.currentTarget.closest(".service-explorer-panel")?.classList.add("is-loaded")}
                />
                <div className="service-explorer-header">
                  <div className="service-explorer-panel-copy">
                    <button className="service-explorer-back" type="button" onClick={() => setIsServiceExplorerOpen(false)}>
                      {isEnglish ? "All services" : "Tất cả dịch vụ"}
                    </button>
                    <p>{activeServiceGroup.title}</p>
                    <h2>{isEnglish ? activeServiceGroup.enDesc : activeServiceGroup.viDesc}</h2>
                  </div>
                  <div className="service-explorer-action-area">
                    {activeServiceGroup.key === "dread" && (
                      <>
                        <a className="service-explorer-more-btn" href="/dreadlock-da-nang">
                          {isEnglish ? "Explore Dreadlocks →" : "Xem Thêm Dreadlocks →"}
                        </a>
                        <div className="service-explorer-sub-pills">
                          <a className="service-explorer-sub-pill" href="/news/gia-lam-dreadlock-o-da-nang">
                            Bảng giá Locs
                          </a>
                          <a className="service-explorer-sub-pill" href="/news/top-dia-chi-lam-dreadlock-tai-da-nang">
                            Địa chỉ uy tín
                          </a>
                        </div>
                      </>
                    )}
                    {activeServiceGroup.key === "braid" && (
                      <>
                        <a className="service-explorer-more-btn" href="/braids-da-nang">
                          {isEnglish ? "Explore Braids →" : "Xem Thêm Braids →"}
                        </a>
                        <div className="service-explorer-sub-pills">
                          <a className="service-explorer-sub-pill" href="/cornrows-da-nang">
                            Cornrows
                          </a>
                          <a className="service-explorer-sub-pill" href="/box-braids-da-nang">
                            Box Braids
                          </a>
                          <a className="service-explorer-sub-pill" href="/news/top-noi-lam-braids-tai-da-nang">
                            Cẩm nang tết tóc
                          </a>
                        </div>
                      </>
                    )}
                    {activeServiceGroup.key === "barber" && (
                      <a className="service-explorer-more-btn" href="/barbers">
                        {isEnglish ? "Explore Barber Club →" : "Xem Thêm Barber →"}
                      </a>
                    )}
                  </div>
                </div>
                <div className="service-explorer-service-grid">
                  {activeServiceGroup.services.map((service, index) => (
                    <a className="service-explorer-service" href="/booking" key={service.en}>
                      <Image
                        src={service.image}
                        alt=""
                        fill
                        sizes="(max-width: 780px) 50vw, 18vw"
                        loading={index < 3 ? "eager" : "lazy"}
                        decoding="async"
                        quality={70}
                        onLoad={(event) => event.currentTarget.closest(".service-explorer-service")?.classList.add("is-loaded")}
                      />
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
                      className="service-explorer-tab"
                      key={group.key}
                      onPointerEnter={() => warmServiceGroup(group.key)}
                      onFocus={() => warmServiceGroup(group.key)}
                      onTouchStart={() => warmServiceGroup(group.key)}
                      onClick={() => {
                        warmServiceGroup(group.key);
                        setActiveServiceExplorer(group.key);
                      }}
                    >
                      <Image
                        src={group.image}
                        alt=""
                        fill
                        sizes="(max-width: 780px) 50vw, 20vw"
                        loading="eager"
                        decoding="async"
                        quality={70}
                        onLoad={(event) => event.currentTarget.closest(".service-explorer-tab")?.classList.add("is-loaded")}
                      />
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
                  onPointerEnter={() => warmServiceGroup(group.key)}
                  onFocus={() => warmServiceGroup(group.key)}
                  onTouchStart={() => warmServiceGroup(group.key)}
                  onClick={() => {
                    warmServiceGroup(group.key);
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
        <section className="hairstyle-library home-hairstyle-library section-shell">
          <div className="section-heading reveal">
            <p className="eyebrow">{isEnglish ? "Hairstyle catalog" : "Thư viện kiểu tóc"}</p>
            <h2>{isEnglish ? "Find your texture." : "Chọn đúng texture."}</h2>
            <p>{isEnglish ? "Open a cover to browse every look. Men and Women are separated where available." : "Chọn một ảnh bìa để xem toàn bộ mẫu. Những bộ có đủ mẫu sẽ được chia Men và Women."}</p>
          </div>
          {renderHairstyleCatalog()}
        </section>
      )}

      {showAbout && (
        <section id="about" className="about section-shell page-view">
          <div className="about-copy reveal">
            <p className="eyebrow">{pageEyebrows.about[language]}</p>
            <h1>{isEnglish ? "About WINDREAD | Locs & Street Barber Club Da Nang" : "Về WINDREAD | Tiệm Dreadlock & Street Barber Club Đà Nẵng"}</h1>
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
            <h1>{isEnglish ? "Dreadlocks, Braids & Barber Services in Da Nang" : "Dịch Vụ Dreadlocks, Braids & Barber Tại Đà Nẵng"}</h1>
            <p>
              {isEnglish
                ? "Choose dread work for long-term texture, braid work for tight patterns, or a clean fade to reset the whole look today."
                : "Chọn dread để xây texture dài hạn, braid để lên pattern gọn, hoặc clean fade để reset visual ngay hôm nay."}
            </p>
          </div>
          <div className="money-page-pills" aria-label="Chuyên trang dịch vụ" style={{ marginBottom: "1.5rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <a href="/dreadlock-da-nang" className="pill-link" style={{ padding: "0.4rem 0.8rem", borderRadius: "999px", background: "var(--panel)", border: "1px solid var(--line)", fontSize: "0.85rem" }}>
              ✦ Dreadlock Đà Nẵng
            </a>
            <a href="/braids-da-nang" className="pill-link" style={{ padding: "0.4rem 0.8rem", borderRadius: "999px", background: "var(--panel)", border: "1px solid var(--line)", fontSize: "0.85rem" }}>
              ✦ Braid & Tết Tóc Đà Nẵng
            </a>
            <a href="/cornrows-da-nang" className="pill-link" style={{ padding: "0.4rem 0.8rem", borderRadius: "999px", background: "var(--panel)", border: "1px solid var(--line)", fontSize: "0.85rem" }}>
              ✦ Cornrows Đà Nẵng
            </a>
            <a href="/box-braids-da-nang" className="pill-link" style={{ padding: "0.4rem 0.8rem", borderRadius: "999px", background: "var(--panel)", border: "1px solid var(--line)", fontSize: "0.85rem" }}>
              ✦ Box Braids Đà Nẵng
            </a>
          </div>
          <div className="highlight-banner reveal">
            <strong>Locs Specialist</strong>
            <span>{isEnglish ? "First-timer consultation available. Book ahead so the crew can check texture and timing." : "Có tư vấn cho khách làm locs lần đầu. Đặt trước để crew check chất tóc và thời gian phù hợp."}</span>
          </div>
          <div className="services-grid">
            <ServiceColumn title="Cơ sở 2 - An Thượng - Locs & Braids" items={displayedLocServices} />
            <ServiceColumn title="Cơ sở 1 - Chương Dương - Barber & Texture" items={displayedBarberServices} />
          </div>
        </section>
      )}

      {showGallery && (
        <section id="gallery" className="hairstyle-library section-shell page-view">
          <div className="section-heading reveal">
            <p className="eyebrow">{pageEyebrows.gallery[language]}</p>
            <h1>{isEnglish ? "Hairstyle Gallery | Dreadlocks, Braids & Barber Da Nang" : "Bộ Sưu Tập Tóc Dreadlocks & Braids Đà Nẵng"}</h1>
            <p>{isEnglish ? "Open a cover to see every look. Men and Women are separated where the collection has both." : "Chọn một ảnh bìa để xem toàn bộ mẫu. Những bộ có đủ mẫu sẽ được chia Men và Women."}</p>
          </div>
          {renderHairstyleCatalog()}
        </section>
      )}

      {showShop && (
        <section id="shop" className="shop section-shell page-view">
          <div className="section-heading reveal">
            <p className="eyebrow">{pageEyebrows.shop[language]}</p>
            <h1>{isEnglish ? "Locs & Braids Care Shop | WINDREAD" : "Sản Phẩm Chăm Sóc Dreadlocks & Braids | WINDREAD"}</h1>
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
            <FilterChips items={["All", "Haircut", "Locs", "Dreadlock", "Braiding", "Beard"]} active={barberFilter} onChange={setBarberFilter} />
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
                      <dd>{(isEnglish ? branch.specialties.en : branch.specialties.vi).join(" - ")}</dd>
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
                            <p className="barber-card-title">{barber.role}</p>
                            <h3>{barber.name}</h3>
                            <p className="barber-card-experience">{isEnglish ? `${barber.years} experience` : `${barber.years} kinh nghiệm`}</p>
                            <p className="barber-card-specialties">{isEnglish ? "Specializes in" : "Chuyên môn"}: {barber.specialties.join(" · ")}</p>
                            <div className="barber-card-actions">
                              <a className="barber-book-link" href={barber.bookingId === "win-dread" ? `tel:${branch.phone}` : `/booking?branch=${branch.id}&barber=${barber.bookingId}`}>
                                {barber.bookingId === "win-dread" ? (isEnglish ? "Call to book" : "Liên hệ đặt lịch") : (isEnglish ? "Book" : "Đặt lịch")}
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
            <h1>{isEnglish ? "WINDREAD Price Menu | Dreadlock, Braid & Barber Da Nang" : "Bảng Giá Dịch Vụ Dreadlock, Braid & Barber Đà Nẵng"}</h1>
          </div>
          <div className="pricing-board">
            <p className="pricing-intro">
              {isEnglish
                ? "Choose your location first. Each branch has its own bookable menu and crew."
                : "Chọn đúng cơ sở trước khi đặt lịch. Mỗi chi nhánh có bảng giá và đội ngũ phục vụ riêng."}
            </p>
            <div className="pricing-branches">
              {visiblePricingServices.length > 0 && activePricingBoard && activePricingGroup ? (
                <>
                  <div className="pricing-branch-tabs" aria-label={isEnglish ? "Choose a branch" : "Chọn cơ sở"}>
                    {priceBoards.map((board) => (
                      <button
                        className={`pricing-branch-tab${board.id === activePricingBoard.id ? " is-active" : ""}`}
                        type="button"
                        key={board.id}
                        aria-pressed={board.id === activePricingBoard.id}
                        onClick={() => selectPricingBranch(board.id)}
                      >
                        <strong>{board.branch}</strong>
                        <span>{board.address}</span>
                      </button>
                    ))}
                  </div>

                  <section className="pricing-branch" aria-label={activePricingBoard.branch}>
                    <h3 className="pricing-category-heading">{isEnglish ? "Choose a service" : "Chọn dịch vụ"}</h3>
                    <div className="pricing-service-tabs" aria-label={isEnglish ? "Choose a service category" : "Chọn dịch vụ"}>
                      {serviceCategories.map((category) => {
                        const isAvailable = activePricingBoard.groups.some((group) => group.id === category.id);
                        return (
                          <button
                            className={`pricing-service-tab${category.id === activePricingGroup.id ? " is-active" : ""}`}
                            type="button"
                            key={category.id}
                            disabled={!isAvailable}
                            aria-pressed={category.id === activePricingGroup.id}
                            onClick={() => setActivePricingCategoryId(category.id)}
                          >
                            <strong>{isEnglish ? category.labelEn : category.label}</strong>
                            <span>{isEnglish ? category.descriptionEn : category.description}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pricing-groups">
                      <section className="pricing-group" key={`${activePricingBoard.id}-${activePricingGroup.id}`}>
                        <h4>{activePricingGroup.title}</h4>
                        {activePricingGroup.sections.map((section) => (
                          <section className="pricing-subgroup" key={section.id}>
                            <h5>{section.label}</h5>
                            <div className="price-table">
                              {section.services.map((service) => {
                                const localizedService = getLocalizedService(service, isEnglish);
                                return (
                                  <a
                                    className={`price-row price-row-book${service.id === "cd-win-dread-experience" ? " price-row-signature" : ""}`}
                                    href={`/booking?branch=${encodeURIComponent(service.branchId)}&service=${encodeURIComponent(service.id)}`}
                                    key={service.id}
                                  >
                                    <div className="price-row-copy">
                                      <strong>{localizedService.name}</strong>
                                      <span title={localizedService.description}>{localizedService.description}</span>
                                    </div>
                                    <div className="price-row-facts">
                                      <span className="price-row-duration">{service.durationMinutes} {isEnglish ? "min" : "phút"}</span>
                                      <b>{getLocalizedPriceLabel(service, isEnglish) || formatCurrency(service.price, isEnglish)}</b>
                                    </div>
                                  </a>
                                );
                              })}
                            </div>
                          </section>
                        ))}
                        {activePricingBoard.id === "chuong-duong" && activePricingGroup.id === "afro" && (
                          <div className="pricing-afro-guide">
                            <section>
                              <h5>{isEnglish ? "Level guide" : "Hướng dẫn mức giá"}</h5>
                              <p><strong>{isEnglish ? "Level 1" : "Mức 1"}</strong><span>{isEnglish ? "Base price - short/normal density" : "Giá gốc - tóc ngắn/mật độ thường"}</span></p>
                              <p><strong>{isEnglish ? "Level 2" : "Mức 2"}</strong><span>+50.000đ - {isEnglish ? "medium or thicker hair" : "tóc vừa hoặc dày hơn"}</span></p>
                              <p><strong>{isEnglish ? "Level 3" : "Mức 3"}</strong><span>+100.000đ - {isEnglish ? "long or very dense hair" : "tóc dài hoặc rất dày"}</span></p>
                            </section>
                            <section>
                              <h5>{isEnglish ? "Add-on" : "Dịch vụ bổ sung"}</h5>
                              <p><strong>{isEnglish ? "Extra detangling" : "Gỡ rối thêm"}</strong><span>+100.000đ / 30 {isEnglish ? "min" : "phút"}</span></p>
                              <p><strong>Signature Afro Care</strong><span>{isEnglish ? "Level 2 +50.000đ · Level 3 +100.000đ" : "Mức 2 +50.000đ · Mức 3 +100.000đ"}</span></p>
                            </section>
                          </div>
                        )}
                      </section>
                    </div>
                  </section>

                  {activePricingBoard.id === "an-thuong" && (
                    <div className="pricing-extras">
                      <section className="free-utilities" aria-labelledby="free-utilities-title">
                        <h4 id="free-utilities-title">{isEnglish ? "Free utilities" : "Tiện ích miễn phí"}</h4>
                        <p>{isEnglish ? "Enjoy the space while you wait." : "Thư giãn trong không gian tiệm khi chờ đến lượt."}</p>
                        <ul>
                          <li>{isEnglish ? "Billiards" : "Bàn bi-a"}</li>
                          <li>{isEnglish ? "Foosball table" : "Bàn bi lắc"}</li>
                          <li>{isEnglish ? "Board games" : "Trò chơi bàn cờ"}</li>
                          <li>{isEnglish ? "Complimentary drink" : "Nước uống miễn phí"}</li>
                        </ul>
                      </section>
                      <section className="vip-experience" aria-labelledby="vip-experience-title">
                        <h4 id="vip-experience-title">{isEnglish ? "Signature VIP experience" : "Trải nghiệm VIP đặc biệt"}</h4>
                        <p>{isEnglish ? "VIP Gentleman's Combo includes:" : "VIP Gentleman's Combo bao gồm:"}</p>
                        <ul>
                          <li>{isEnglish ? "Personal styling consultation" : "Tư vấn kiểu tóc cá nhân"}</li>
                          <li>{isEnglish ? "Haircut or shave on request" : "Cắt tóc hoặc cạo theo yêu cầu"}</li>
                          <li>{isEnglish ? "Hot and cold towel grooming" : "Chăm sóc với khăn nóng và lạnh"}</li>
                          <li>{isEnglish ? "Priority appointment, no waiting" : "Ưu tiên lịch hẹn, hạn chế chờ đợi"}</li>
                          <li>{isEnglish ? "Special gift for VIP guests" : "Quà tặng dành cho khách VIP"}</li>
                        </ul>
                      </section>
                    </div>
                  )}
                </>
              ) : (
                <p className="pricing-loading" role="status">
                  {pricingRecoveryFailed
                    ? (isEnglish ? "The price menu is temporarily unavailable. Please use Booking or contact the crew for the current price." : "Bảng giá đang tạm thời chưa tải được. Hãy vào Đặt lịch hoặc liên hệ crew để xem giá hiện tại.")
                    : (isEnglish ? "Loading the current price menu…" : "Đang tải bảng giá hiện tại…")}
                </p>
              )}
            </div>
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
            <h1>{isEnglish ? "Contact WINDREAD Barber & Hair Studio Da Nang" : "Địa Chỉ & Liên Hệ Tiệm WINDREAD Đà Nẵng"}</h1>
          </div>
          <div className="contact-grid">
            <div className="map-card reveal" aria-label="Ban do WINDREAD">
              <span className="map-pin"><Image src="/images/windread-mark.png" alt="" width={1420} height={1414} /></span>
              <p>{isEnglish ? "Ngu Hanh Son / Da Nang" : "Ngũ Hành Sơn / Đà Nẵng"}</p>
            </div>
            <div className="contact-cards">
              {[
                [isEnglish ? "Address 1" : "Địa chỉ 1", "35 - 37 An Thượng 29, Ngũ Hành Sơn, Đà Nẵng"],
                [isEnglish ? "Address 2" : "Địa chỉ 2", "223 Chương Dương, Ngũ Hành Sơn, Đà Nẵng"],
                [isEnglish ? "Opening hours" : "Giờ mở cửa", "Mon-Sun 09:00-19:00"],
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
        <div className="specialty-marquee" aria-label={isEnglish ? "WINDREAD hair services: Dreadlocks, Retwist, Locs Repair, Locs Detox, Braids, Box Braids, Knotless Braids, Cornrows, Afro Hair" : "Dịch vụ tóc WINDREAD: Dreadlocks, Retwist, Locs Repair, Locs Detox, Braids, Box Braids, Knotless Braids, Cornrows, Afro Hair"}>
          <div className="specialty-marquee-track" aria-hidden="true">
            {[0, 1].map((copy) => (
              <div className="specialty-marquee-group" key={copy}>
                {["Dreadlocks", "Retwist", "Locs Repair", "Locs Detox", "Braids", "Box Braids", "Knotless Braids", "Cornrows", "Afro Hair"].map((service) => (
                  <span className="specialty-marquee-item" key={service}>{service}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
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
                  <Image
                    src={branch.id === "an-thuong" ? "/images/thumb1.webp" : branch.image}
                    alt={`Không gian ${branch.name}`}
                    fill
                    sizes="(max-width: 760px) 100vw, 50vw"
                  />
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

          <div className="footer-nav-groups">
            <nav className="footer-links" aria-label={isEnglish ? "Footer service links" : "Dịch vụ trọng tâm"}>
              <h2>{isEnglish ? "Specialized Services" : "Dịch vụ trọng tâm"}</h2>
              <a href="/dreadlock-da-nang">Dreadlock Đà Nẵng</a>
              <a href="/braids-da-nang">Braid & Tết Tóc Đà Nẵng</a>
              <a href="/cornrows-da-nang">Cornrows Đà Nẵng</a>
              <a href="/box-braids-da-nang">Box Braids Đà Nẵng</a>
              <a href="/news">{isEnglish ? "Care Journal" : "Cẩm nang tóc"}</a>
            </nav>

            <nav className="footer-links" aria-label={isEnglish ? "Footer quick links" : "Liên kết nhanh"}>
              <h2>{isEnglish ? "Quick Links" : "Liên kết nhanh"}</h2>
              <a href="/">{isEnglish ? "Home" : "Trang chủ"}</a>
              <a href="/about">{isEnglish ? "About" : "Giới thiệu"}</a>
              <a href="/services">{isEnglish ? "Services" : "Dịch vụ"}</a>
              <a href="/pricing">{isEnglish ? "Pricing" : "Bảng giá"}</a>
              <a href="/booking">{isEnglish ? "Booking" : "Đặt lịch"}</a>
              <a href="/contact">{isEnglish ? "Contact" : "Liên hệ"}</a>
            </nav>
          </div>
        </div>

        <div className="footer-media" aria-hidden="true">
          <Image
            src="/images/footerbg.webp"
            alt="WINDREAD Dreadlock & Barber Studio Đà Nẵng"
            width={1676}
            height={918}
            className="footer-image"
          />
        </div>
        <p className="footer-copyright">
          © 2025 Win Dread Locs & Barber Club. All Rights Reserved
        </p>
      </footer>

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
