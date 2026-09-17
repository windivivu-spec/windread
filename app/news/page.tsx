import Image from "next/image";
import Link from "next/link";
import { articles as staticArticles, getLiveArticles } from "../../lib/seo/articles";
import { pageSeo, siteName, siteUrl } from "../seo";
import { SiteHeader } from "../components/SiteHeader";
import { NewsHubClient } from "./NewsHubClient";

export const metadata = pageSeo.news;

export default async function NewsPage() {
  const liveArticles = await getLiveArticles();
  const displayArticles = liveArticles?.length ? liveArticles : staticArticles;
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: siteUrl
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tin tức",
        item: `${siteUrl}/news`
      }
    ]
  };

  return (
    <main id="main-content" className="service-landing-page">
      <SiteHeader />

      {/* Cinematic Barbershop Hero */}
      <section className="branch-hero">
        <div className="branch-hero-image">
          <Image
            src="/images/chuong duong store/space1.webp"
            alt="Cẩm Nang Tóc Dreadlocks, Braids & Barber Đà Nẵng - WINDREAD Journal"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="branch-hero-overlay" />
        <div className="branch-hero-copy">
          <p>WINDREAD JOURNAL & CARE NOTES</p>
          <h1>CẨM NANG WINDREAD</h1>
          <span>
            Tổng hợp kinh nghiệm thực chiến từ các nghệ nhân locs maker & braider tại WINDREAD Đà Nẵng. 
            Cẩm nang chọn kiểu, bảng giá chi tiết, hướng dẫn tự chăm sóc tại nhà và địa chỉ làm tóc uy tín.
          </span>
          <div className="branch-hero-actions">
            <Link className="book-button" href="/booking">
              Đặt Lịch Tư Vấn Trực Tiếp
            </Link>
            <a className="ghost-button" href="tel:0393549656">
              Hotline: 0393549656
            </a>
          </div>
        </div>
      </section>

      {/* Editorial Hub Client Component with Filter Tabs & Equal Height Cards */}
      <NewsHubClient articles={displayArticles} />

      {/* Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Unified Site Footer */}
      <footer className="site-footer branch-site-footer">
        <div className="torn-divider" aria-hidden="true" />
        <div className="footer-content">
          <div className="footer-brand">
            <Image
              src="/images/windread-logo.png"
              alt="WINDREAD Cẩm Nang Tóc Đà Nẵng"
              width={1327}
              height={404}
              className="footer-logo"
            />
            <div className="footer-contact">
              <span>Cơ sở 1: 223 Chương Dương, Ngũ Hành Sơn, Đà Nẵng</span>
              <span>Cơ sở 2: 35 - 37 An Thượng 29, Ngũ Hành Sơn, Đà Nẵng</span>
              <a href="tel:0393549656">Hotline / Zalo: 0393549656</a>
            </div>
          </div>

          <div className="footer-nav-groups">
            <nav className="footer-links" aria-label="Dịch vụ trọng tâm">
              <h2>Dịch vụ chính</h2>
              <Link href="/dreadlock-da-nang">Dreadlock Đà Nẵng</Link>
              <Link href="/braids-da-nang">Braid & Tết Tóc Đà Nẵng</Link>
              <Link href="/cornrows-da-nang">Cornrows Đà Nẵng</Link>
              <Link href="/box-braids-da-nang">Box Braids Đà Nẵng</Link>
            </nav>

            <nav className="footer-links" aria-label="Liên kết nhanh">
              <h2>Liên kết nhanh</h2>
              <Link href="/">Trang chủ</Link>
              <Link href="/about">Giới thiệu</Link>
              <Link href="/pricing">Bảng giá</Link>
              <Link href="/news">Tin tức</Link>
              <Link href="/booking">Đặt lịch online</Link>
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
          © 2025 WINDREAD Locs & Barber Club. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}
