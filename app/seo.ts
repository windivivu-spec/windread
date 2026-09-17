import type { Metadata } from "next";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://windread.vn";

export const siteName = "WINDREAD";

export const defaultDescription =
  "WINDREAD là locs và barber club cho dreadlocks, braid, clean fades và street grooming tại Việt Nam.";

export const routes = [
  { path: "/", label: "Trang chủ", priority: 1 },
  { path: "/dreadlock-da-nang", label: "Dreadlock Đà Nẵng", priority: 0.98 },
  { path: "/braids-da-nang", label: "Braid Đà Nẵng", priority: 0.97 },
  { path: "/cornrows-da-nang", label: "Cornrow Đà Nẵng", priority: 0.96 },
  { path: "/box-braids-da-nang", label: "Box Braids Đà Nẵng", priority: 0.95 },
  { path: "/services", label: "Dịch vụ", priority: 0.92 },
  { path: "/pricing", label: "Bảng giá", priority: 0.9 },
  { path: "/booking", label: "Đặt lịch", priority: 0.95 },
  { path: "/about", label: "Giới thiệu", priority: 0.82 },
  { path: "/gallery", label: "Gallery", priority: 0.88 },
  { path: "/barbers", label: "Barbers", priority: 0.76 },
  { path: "/news", label: "Tin tức", priority: 0.85 },
  { path: "/branches/an-thuong", label: "WINDREAD An Thượng", priority: 0.85 },
  { path: "/branches/chuong-duong", label: "WINDREAD Chương Dương", priority: 0.85 },
  { path: "/shop", label: "Shop", priority: 0.72 },
  { path: "/contact", label: "Liên hệ", priority: 0.8 }
] as const;

type PageSeo = {
  title: string;
  description: string;
  path: string;
  image?: string;
};

export function buildMetadata({ title, description, path, image = "/images/hero-dreadlocks-v2.png" }: PageSeo): Metadata {
  const url = new URL(path, siteUrl).toString();
  return {
    title,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      type: "website",
      locale: "vi_VN",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: "WINDREAD Dreadlocks, Braids & Barber Đà Nẵng"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image]
    }
  };
}

export const pageSeo = {
  home: buildMetadata({
    title: "WINDREAD | Dreadlock, Braid & Barber Hàng Đầu Tại Đà Nẵng",
    description: "WINDREAD là tiệm làm dreadlocks, braids, cornrows, box braids và cắt tóc barber phong cách đường phố uy tín tại Đà Nẵng. 2 cơ sở: An Thượng & Chương Dương.",
    path: "/"
  }),
  dreadlocksDaNang: buildMetadata({
    title: "Dreadlock Đà Nẵng | Tiệm Làm & Nối Dreadlocks Chuyên Nghiệp WINDREAD",
    description: "Dịch vụ dreadlock Đà Nẵng chuyên nghiệp: Starter locs, nối tóc, retwist, sửa chữa và detox da đầu. Thợ giỏi tay nghề cao tại phố Tây An Thượng, Đà Nẵng.",
    path: "/dreadlock-da-nang"
  }),
  braidsDaNang: buildMetadata({
    title: "Braid Đà Nẵng | Dịch Vụ Tết Tóc Nam & Nữ Đẹp Chuyên Nghiệp | WINDREAD",
    description: "Tết tóc Braid Đà Nẵng chuẩn phong cách đường phố cho nam và nữ. Đa dạng mẫu: box braid, knotless braid, twist, pattern cá tính, không đau da đầu.",
    path: "/braids-da-nang"
  }),
  cornrowsDaNang: buildMetadata({
    title: "Cornrow Đà Nẵng | Tết Tóc Sát Da Đầu Nam & Nữ Sắc Nét | WINDREAD",
    description: "Chuyên tết tóc Cornrows Đà Nẵng với đường line sắc sảo, vào nếp gọn gàng, bền đẹp 2-4 tuần. Địa chỉ làm tóc phong cách hiphop uy tín tại Đà Nẵng.",
    path: "/cornrows-da-nang"
  }),
  boxBraidsDaNang: buildMetadata({
    title: "Box Braids Đà Nẵng | Tết Tóc Hộp Đẹp, Cá Tính Cho Nam & Nữ | WINDREAD",
    description: "Địa chỉ tết Box Braids Đà Nẵng chuyên nghiệp, kỹ thuật chia ô tóc chuẩn xác, phối tóc giả cao cấp cho người bản địa và khách du lịch quốc tế.",
    path: "/box-braids-da-nang"
  }),
  about: buildMetadata({
    title: "Về WINDREAD | Tiệm Dreadlock & Street Barber Club Đà Nẵng",
    description: "Câu chuyện sáng lập WINDREAD, văn hóa tóc Afro, kỹ thuật Dreadlocks thủ công và tinh thần đường phố độc bản tại Đà Nẵng.",
    path: "/about",
    image: "/images/about/about-hor.png"
  }),
  services: buildMetadata({
    title: "Dịch Vụ Dreadlocks, Braids & Barber Đà Nẵng | WINDREAD",
    description: "Trọn gói dịch vụ tóc: Starter locs, retwist, tết tóc cornrows, box braids, clean fade & chăm sóc râu tóc barber chuyên sâu tại Đà Nẵng.",
    path: "/services"
  }),
  gallery: buildMetadata({
    title: "Bộ Sưu Tập Tóc Dreadlocks & Braids Đà Nẵng | WINDREAD Gallery",
    description: "Xem bộ sưu tập thực tế các mẫu tóc dreadlocks nam nữ, tết cornrows, braids và những kiểu tóc barber street style thực hiện tại WINDREAD Đà Nẵng.",
    path: "/gallery"
  }),
  pricing: buildMetadata({
    title: "Bảng Giá Làm Dreadlocks, Braids & Barber Đà Nẵng | WINDREAD",
    description: "Bảng giá minh bạch cho starter locs, retwist, tết cornrows, box braids, clean fade và combo phục hồi tóc tại 2 cơ sở WINDREAD Đà Nẵng.",
    path: "/pricing"
  }),
  barbers: buildMetadata({
    title: "Đội Ngũ Barbers & Thợ Tết Tóc Đà Nẵng | WINDREAD Crew",
    description: "Gặp gỡ đội ngũ nghệ nhân locs maker, braider và thợ cắt tóc fade lành nghề tại WINDREAD Đà Nẵng. Đặt lịch chọn thợ yêu thích ngay.",
    path: "/barbers"
  }),
  shop: buildMetadata({
    title: "Shop Sản Phẩm Chăm Sóc Dreadlocks & Braids | WINDREAD",
    description: "Sản phẩm xịt dưỡng locs, sáp giữ nếp braids, dầu gội detox da đầu và phụ kiện bảo vệ tóc chuyên dụng sau khi rời ghế tại WINDREAD Đà Nẵng.",
    path: "/shop"
  }),
  news: buildMetadata({
    title: "Cẩm Nang Dreadlocks, Braids & Barber Đà Nẵng | WINDREAD Journal",
    description: "Tổng hợp bài viết hướng dẫn chăm sóc dreadlock, kinh nghiệm tết tóc braids, bảng giá và top địa chỉ làm tóc uy tín tại Đà Nẵng.",
    path: "/news"
  }),
  booking: buildMetadata({
    title: "Đặt Lịch Làm Dreadlocks & Tết Tóc Đà Nẵng | WINDREAD",
    description: "Hệ thống đặt lịch online giữ ghế làm dreadlock, tết tóc braids, cornrows, fade tại 2 cơ sở WINDREAD Đà Nẵng. Nhanh chóng, không phải chờ đợi.",
    path: "/booking"
  }),
  contact: buildMetadata({
    title: "Địa Chỉ & Liên Hệ Tiệm WINDREAD Đà Nẵng | Hotline & Bản Đồ",
    description: "Thông tin liên hệ 2 cơ sở WINDREAD tại Đà Nẵng: 35-37 An Thượng 29 và 223 Chương Dương, Ngũ Hành Sơn. Hotline/Zalo: 0393549656.",
    path: "/contact"
  })
} satisfies Record<string, Metadata>;
