import type { Metadata } from "next";
import "./globals.css";
import { pageSeo, siteName, siteUrl } from "./seo";
import { ChatWidget } from "./chatbot/ChatWidget";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  keywords: [
    "dreadlock Đà Nẵng",
    "braid Đà Nẵng",
    "tết tóc Đà Nẵng",
    "cornrow Đà Nẵng",
    "box braids Đà Nẵng",
    "dreadlock Da Nang",
    "braids Da Nang",
    "hair braiding Da Nang",
    "barber tại đà nẵng",
    "cắt tóc đẹp đà nẵng",
    "tóc mỹ đen đà nẵng",
    "starter locs Đà Nẵng",
    "retwist locs Đà Nẵng",
    "clean fade Đà Nẵng",
    "WINDREAD",
    "barbershop Da Nang"
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  formatDetection: {
    telephone: true,
    address: true,
    email: true
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  ...pageSeo.home
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HairSalon",
      "@id": `${siteUrl}/#organization`,
      name: "WINDREAD | Dreadlocks, Braids & Barber Club Đà Nẵng",
      alternateName: ["WINDREAD Barbershop", "Win Dread", "Windread Locs & Braids"],
      url: siteUrl,
      logo: `${siteUrl}/images/windread-logo.png`,
      image: `${siteUrl}/images/hero-dreadlocks-v2.png`,
      description: "Hệ thống tiệm làm dreadlocks, braids, cornrows, box braids và cắt tóc barber street style hàng đầu tại Đà Nẵng.",
      telephone: "+84393549656",
      priceRange: "150.000đ - 3.500.000đ",
      currenciesAccepted: "VND",
      paymentAccepted: "Cash, Credit Card, Bank Transfer, QR Pay",
      areaServed: [
        { "@type": "City", name: "Đà Nẵng" },
        { "@type": "AdministrativeArea", name: "Ngũ Hành Sơn" },
        { "@type": "Country", name: "Vietnam" }
      ],
      sameAs: [
        "https://www.instagram.com/windread.locs_barber.club",
        "https://www.facebook.com/profile.php?id=61583308184992"
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Dịch Vụ Tóc WINDREAD",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Dreadlocks Đà Nẵng (Starter Locs, Nối Locs, Retwist)",
              description: "Dịch vụ làm mới dreadlock, nối tóc dreadlocks thủ công, retwist chân tóc và detox da đầu chuyên sâu."
            }
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Braids Đà Nẵng (Tết Tóc Nam & Nữ)",
              description: "Dịch vụ tết tóc phong cách đường phố, box braids, knotless braids, twist bền nếp và thoải mái."
            }
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Cornrows Đà Nẵng (Tết Tóc Sát Da Đầu)",
              description: "Tết cornrow đường line sắc nét, thiết kế hoa văn độc bản theo phong cách hiphop và thể thao."
            }
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Barber Grooming & Clean Fade",
              description: "Cắt tóc nam barber, fade mịn mượt, tỉa tạo form râu khăn nóng và phục hồi da đầu."
            }
          }
        ]
      },
      department: [
        {
          "@type": "HairSalon",
          "@id": `${siteUrl}/branches/an-thuong#branch`,
          name: "WINDREAD An Thượng - Chuyên Locs & Braids",
          url: `${siteUrl}/branches/an-thuong`,
          telephone: "+84393549656",
          image: `${siteUrl}/images/an%20thuong%20store/space%201.jpg`,
          address: {
            "@type": "PostalAddress",
            streetAddress: "35 - 37 An Thượng 29",
            addressLocality: "Mỹ An, Ngũ Hành Sơn",
            addressRegion: "Đà Nẵng",
            postalCode: "550000",
            addressCountry: "VN"
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 16.0538,
            longitude: 108.2442
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
              opens: "09:00",
              closes: "21:00"
            }
          ]
        },
        {
          "@type": "BarberShop",
          "@id": `${siteUrl}/branches/chuong-duong#branch`,
          name: "WINDREAD Chương Dương - Barber & Street Fades",
          url: `${siteUrl}/branches/chuong-duong`,
          telephone: "+84393549656",
          image: `${siteUrl}/images/chuong%20duong%20store/space1.webp`,
          address: {
            "@type": "PostalAddress",
            streetAddress: "223 Chương Dương",
            addressLocality: "Bắc Mỹ An, Ngũ Hành Sơn",
            addressRegion: "Đà Nẵng",
            postalCode: "550000",
            addressCountry: "VN"
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 16.0506,
            longitude: 108.2369
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
              opens: "09:00",
              closes: "20:30"
            }
          ]
        }
      ]
    }
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
        <a className="skip-link" href="#main-content">
          Bỏ qua điều hướng
        </a>
        {children}
        <ChatWidget />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </body>
    </html>
  );
}
