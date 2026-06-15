import type { Metadata } from "next";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://windread.vn";

export const siteName = "WINDREAD";

export const defaultDescription =
  "WINDREAD là locs và barber club cho dreadlocks, braid, clean fades và street grooming tại Việt Nam.";

export const routes = [
  { path: "/", label: "Trang chủ", priority: 1 },
  { path: "/about", label: "Giới thiệu", priority: 0.82 },
  { path: "/services", label: "Dịch vụ", priority: 0.92 },
  { path: "/gallery", label: "Gallery", priority: 0.88 },
  { path: "/pricing", label: "Bảng giá", priority: 0.9 },
  { path: "/barbers", label: "Barbers", priority: 0.76 },
  { path: "/shop", label: "Shop", priority: 0.72 },
  { path: "/news", label: "Tin tức", priority: 0.68 },
  { path: "/booking", label: "Đặt lịch", priority: 0.95 },
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
          alt: "WINDREAD locs and barber club"
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
    title: "WINDREAD | Locs & Barber Club",
    description: defaultDescription,
    path: "/"
  }),
  about: buildMetadata({
    title: "Giới thiệu WINDREAD | The Book of Windread",
    description: "Câu chuyện Windread, văn hóa dreadlocks, barber club và tinh thần street-first.",
    path: "/about",
    image: "/images/about/about_1_hor.webp"
  }),
  services: buildMetadata({
    title: "Dịch vụ dreadlocks, braid & barber | WINDREAD",
    description: "Starter locs, retwist, locs styling, clean fade, classic cut và beard trim tại WINDREAD.",
    path: "/services"
  }),
  gallery: buildMetadata({
    title: "Gallery dreadlocks, braid & barber | WINDREAD",
    description: "Xem các mẫu dreadlocks, braid và haircut street style được thực hiện tại WINDREAD.",
    path: "/gallery"
  }),
  pricing: buildMetadata({
    title: "Bảng giá dịch vụ | WINDREAD",
    description: "Bảng giá rõ ràng cho starter locs, retwist, styling, fade, classic cut và combo barber.",
    path: "/pricing"
  }),
  barbers: buildMetadata({
    title: "Đội ngũ barbers | WINDREAD",
    description: "Gặp đội ngũ thợ chuyên locs, fade, braid và grooming tại WINDREAD.",
    path: "/barbers"
  }),
  shop: buildMetadata({
    title: "Shop chăm sóc locs | WINDREAD",
    description: "Sản phẩm chăm sóc dreadlocks, scalp, wax, spray và grooming sau khi rời ghế.",
    path: "/shop"
  }),
  news: buildMetadata({
    title: "Tin mới từ WINDREAD | Locs & barber culture",
    description: "Bài viết, tips chăm sóc dreadlocks, barber culture và cập nhật mới từ WINDREAD.",
    path: "/news"
  }),
  booking: buildMetadata({
    title: "Đặt lịch | WINDREAD",
    description: "Đặt lịch làm dreadlocks, braid, fade và barber services tại WINDREAD.",
    path: "/booking"
  }),
  contact: buildMetadata({
    title: "Liên hệ | WINDREAD",
    description: "Thông tin liên hệ, giờ mở cửa và địa chỉ WINDREAD Locs & Barber Club.",
    path: "/contact"
  })
} satisfies Record<string, Metadata>;
