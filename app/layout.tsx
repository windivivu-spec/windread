import type { Metadata } from "next";
import "./globals.css";
import { pageSeo, siteName, siteUrl } from "./seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  keywords: [
    "Windread",
    "dreadlocks",
    "locs",
    "retwist",
    "starter locs",
    "braid",
    "barber",
    "clean fade",
    "barbershop Viet Nam"
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
  "@type": "HairSalon",
  name: siteName,
  url: siteUrl,
  image: new URL("/images/hero-dreadlocks-v2.png", siteUrl).toString(),
  description:
    "Locs & Barber Club chuyên dreadlocks, braid, retwist, clean fades và street grooming.",
  priceRange: "$$",
  servesCuisine: undefined,
  serviceType: ["Starter Locs", "Retwist", "Locs Styling", "Braid", "Clean Fade", "Classic Cut"],
  areaServed: "Viet Nam",
  sameAs: ["https://instagram.com", "https://facebook.com", "https://tiktok.com"]
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </body>
    </html>
  );
}
