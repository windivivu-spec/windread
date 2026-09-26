import Image from "next/image";
import Link from "next/link";
import { pageSeo, siteName, siteUrl } from "../seo";
import { articles } from "../../lib/seo/articles";
import { SiteHeader } from "../components/SiteHeader";

export const metadata = pageSeo.cornrowsDaNang;

export default function CornrowsDaNangPage() {
  const cornrowArticles = articles.filter(
    (a) => a.slug.includes("cornrow") || a.category === "braids"
  );

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Tết Tóc Cornrows Đà Nẵng",
    provider: {
      "@type": "HairSalon",
      name: "WINDREAD Locs & Barber Club",
      url: siteUrl,
      telephone: "+84393549656",
      address: {
        "@type": "PostalAddress",
        streetAddress: "35 - 37 An Thượng 29",
        addressLocality: "Ngũ Hành Sơn",
        addressRegion: "Đà Nẵng",
        addressCountry: "VN"
      }
    },
    areaServed: {
      "@type": "City",
      name: "Đà Nẵng"
    },
    description: "Tết tóc Cornrows Đà Nẵng sát da đầu cho nam & nữ: Đường line sắc nét, hoa văn ziczac, pop smoke braids, không đau da đầu."
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Tết tóc Cornrows tại Đà Nẵng giá bao nhiêu?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Giá tết tóc Cornrows tại WINDREAD Đà Nẵng dao động từ 300.000đ cho mẫu cơ bản 4-6 đường thẳng và từ 450.000đ - 800.000đ cho các mẫu hoa văn ziczac, geometric phức tạp."
        }
      },
      {
        "@type": "Question",
        name: "Tóc Cornrows giữ được bao lâu?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cornrows giữ được trung bình từ 2 đến 4 tuần tùy cơ địa da đầu và thói quen sinh hoạt. Khi đi ngủ nên trùm khăn satin để hạn chế xù tóc con."
        }
      },
      {
        "@type": "Question",
        name: "Tết tóc Cornrows có đau không?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Tại WINDREAD, thợ dùng sáp mềm và lực tay đều đặn nên không gây đau buốt hay giật chân tóc, da đầu êm dịu ngay từ ngày đầu tiên."
        }
      }
    ]
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Dịch vụ", item: `${siteUrl}/services` },
      { "@type": "ListItem", position: 3, name: "Cornrow Đà Nẵng", item: `${siteUrl}/cornrows-da-nang` }
    ]
  };

  const galleryImages = [
    {
      src: "/images/collection /Cornrows for Men/collection1.webp",
      alt: "Cornrow thẳng cổ điển nam tại WINDREAD Đà Nẵng",
      width: 736,
      height: 981
    },
    {
      src: "/images/collection /Cornrows for Men/collection4.webp",
      alt: "Cornrow hoa văn ziczac độc đáo tại WINDREAD An Thượng",
      width: 736,
      height: 981
    },
    {
      src: "/images/moment/DSC09946.webp",
      alt: "Đường chia line da đầu sắc nét không một sợi tóc thừa",
      width: 1920,
      height: 1280
    },
    {
      src: "/images/moment/DSC09957.webp",
      alt: "Mẫu cornrow thể thao thoáng mát cho mùa hè Đà Nẵng",
      width: 1920,
      height: 1280
    },
    {
      src: "/images/moment/Unknown-4.webp",
      alt: "Cornrows kết hợp fade hai bên tai cực ngầu",
      width: 1920,
      height: 1280
    },
    {
      src: "/images/moment/Unknown-5.webp",
      alt: "Khách hàng hài lòng với bộ tóc cornrow tại An Thượng",
      width: 1920,
      height: 1280
    }
  ];

  return (
    <main id="main-content" className="service-landing-page">
      <SiteHeader />

      {/* Cinematic Barbershop Hero */}
      <section className="branch-hero">
        <div className="branch-hero-image">
          <Image
            src="/images/collection /Cornrows for Men/collection1.webp"
            alt="Cornrow Đà Nẵng - Tết Tóc Sát Da Đầu Nam & Nữ Sắc Nét WINDREAD"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="branch-hero-overlay" />
        <div className="branch-hero-copy">
          <p>ĐỈNH CAO TẾT TÓC SÁT DA ĐẦU TẠI ĐÀ NẴNG</p>
          <h1>CORNROW ĐÀ NẴNG</h1>
          <span>
            Chuyên tết tóc Cornrows chuẩn phong cách thể thao và hip-hop đường phố tại Đà Nẵng. Chia đường line thẳng tắp, hoa văn sáng tạo theo yêu cầu, chất lượng bền nếp 2-4 tuần không lo xù gãy.
          </span>
          <div className="branch-hero-actions">
            <Link className="book-button large" href="/booking">
              Đặt lịch tết Cornrow
            </Link>
            <a className="ghost-button" href="tel:0393549656">
              Hotline: 0393549656
            </a>
          </div>
        </div>
      </section>

      {/* Philosophy & Guarantees */}
      <section className="branch-intro section-shell">
        <div>
          <h2>Đường line nét căng, phong cách thể thao mạnh mẽ.</h2>
          <p>
            Cornrows tại WINDREAD được thực hiện bằng kỹ thuật bện sát da đầu với độ siết vừa vặn, không kéo căng nang tóc. Dù bạn đi biển, tập gym, chơi bóng rổ hay tham gia các hoạt động ngoài trời, mái tóc vẫn giữ nguyên độ gọn gàng, thoáng khí và góc cạnh nam tính.
          </p>
        </div>
        <div className="branch-specialties" aria-label="Cam kết dịch vụ">
          <span>Cam kết tiêu chuẩn</span>
          <div>
            <strong>Line Nét Căng Từng Milimet</strong>
            <strong>Mát Mẻ Bơi Lội Mùa Hè</strong>
            <strong>Hoàn Thiện Trong 45 - 90 Phút</strong>
            <strong>2 Chi Nhánh Đà Nẵng</strong>
          </div>
        </div>
      </section>

      {/* Barbershop Pricing & Service Menu Board */}
      <section className="landing-services section-shell" style={{ paddingTop: "20px" }}>
        <div className="section-title-bar">
          <div>
            <span className="category-tag">BẢNG GIÁ DỊCH VỤ NIÊM YẾT</span>
            <h2>Các Kiểu Tết Cornrows Được Ưa Chuộng</h2>
          </div>
          <p>Bảng giá rõ ràng, bao gồm gội sạch da đầu trước khi tết và dưỡng sáp khóa nếp</p>
        </div>

        <div className="services-grid">
          <article className="service-column">
            <h3>Cornrows Cổ Điển & Phổ Thông</h3>

            <div className="service-row">
              <div>
                <h4>Classic Straight-Backs (4 - 8 Hàng)</h4>
                <p>Đường tết thẳng tắp từ trán về gáy. Phong cách thể thao tối giản, mạnh mẽ và nam tính.</p>
              </div>
              <div>
                <span>45 - 60 phút</span>
                <Link href="/booking">300.000đ - 500.000đ</Link>
              </div>
            </div>

            <div className="service-row">
              <div>
                <h4>Pop Smoke / Zig-Zag Pattern</h4>
                <p>Tết rẽ ngôi giữa sang 2 bên hoặc đan chéo hoa văn ziczac phong cách hip-hop Brooklyn hiện đại.</p>
              </div>
              <div>
                <span>60 - 90 phút</span>
                <Link href="/booking">450.000đ - 750.000đ</Link>
              </div>
            </div>

            <div className="service-row">
              <div>
                <h4>Cornrows Nửa Đầu + Top Knot</h4>
                <p>Tết phần đỉnh đầu và gom đuôi tóc phía sau thành búi củ tỏi (Man Bun) phong trần.</p>
              </div>
              <div>
                <span>50 - 75 phút</span>
                <Link href="/booking">350.000đ - 600.000đ</Link>
              </div>
            </div>
          </article>

          <article className="service-column">
            <h3>Combo Trọn Gói & Nối Sợi Màu</h3>

            <div className="service-row">
              <div>
                <h4>Combo Cornrows + Clean Fade</h4>
                <p>Trọn gói: Tết cornrows đỉnh đầu + Cạo taper fade mịn màng 2 bên tai và cạo viền sắc sảo.</p>
              </div>
              <div>
                <span>75 - 90 phút</span>
                <Link href="/booking">450.000đ - 650.000đ</Link>
              </div>
            </div>

            <div className="service-row">
              <div>
                <h4>Cornrows Nối Thêm Sợi Màu (Extensions)</h4>
                <p>Bện kết hợp sợi tóc nhân tạo màu sáng (vàng, xám khói, đỏ, ombre) tạo điểm nhấn lễ hội độc đáo.</p>
              </div>
              <div>
                <span>75 - 120 phút</span>
                <Link href="/booking">500.000đ - 900.000đ</Link>
              </div>
            </div>

            <div className="service-row">
              <div>
                <h4>Chăm Sóc & Dặm Nếp Da Đầu</h4>
                <p>Gội xả làm sạch nhẹ nhàng không làm xù bím, xịt dưỡng chống ngứa da đầu chiết xuất bạc hà.</p>
              </div>
              <div>
                <span>30 - 45 phút</span>
                <Link href="/booking">150.000đ - 250.000đ</Link>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Real Portfolio Masonry Gallery (Zero Distortion) */}
      <section className="section-shell" style={{ paddingTop: "60px" }}>
        <div className="section-title-bar">
          <div>
            <span className="category-tag">PORTFOLIO THỰC TẾ</span>
            <h2>Hình Ảnh Mẫu Tóc Cornrows Tại WINDREAD Đà Nẵng</h2>
          </div>
          <p>Ảnh chụp thực tế các mẫu cornrows nam & nữ chia line sắc sảo tại 2 cơ sở An Thượng & Chương Dương</p>
        </div>

        <div className="branch-visuals" aria-label="Bộ sưu tập Cornrows Đà Nẵng">
          {galleryImages.map((image, index) => (
            <figure className={`branch-visual branch-visual-${index + 1}`} key={image.src}>
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
              />
            </figure>
          ))}
        </div>
      </section>

      {/* Physical Branches in Da Nang */}
      <section className="branch-directory section-shell" aria-labelledby="cornrows-branch-heading">
        <div className="section-title-bar">
          <div>
            <span className="category-tag">ĐỊA ĐIỂM TIỆM</span>
            <h2 id="cornrows-branch-heading">Ghé Thăm 2 Chi Nhánh WINDREAD Tại Đà Nẵng</h2>
          </div>
          <p>Không gian chuẩn phong cách barbershop đường phố, trang bị máy lạnh và ghế cắt êm ái</p>
        </div>

        <div className="branch-directory-grid">
          <Link className="branch-directory-card" href="/branches/an-thuong">
            <span className="branch-directory-image">
              <Image
                src="/images/an thuong store/space 1.jpg"
                alt="WINDREAD An Thượng - Tiệm chuyên Cornrows & Braids Đà Nẵng"
                fill
                sizes="(max-width: 760px) 100vw, 50vw"
              />
            </span>
            <span className="branch-directory-copy">
              <small>Cơ sở 2 · Chuyên Braids & Locs</small>
              <strong>WINDREAD An Thượng</strong>
              <em>35 - 37 An Thượng 29, Phường Mỹ An, Ngũ Hành Sơn, Đà Nẵng (Khu phố Tây)</em>
            </span>
          </Link>

          <Link className="branch-directory-card" href="/branches/chuong-duong">
            <span className="branch-directory-image">
              <Image
                src="/images/chuong duong store/space1.webp"
                alt="WINDREAD Chương Dương - Tiệm Barber & Cornrows Nam Đà Nẵng"
                fill
                sizes="(max-width: 760px) 100vw, 50vw"
              />
            </span>
            <span className="branch-directory-copy">
              <small>Cơ sở 1 · Barber & Clean Fades</small>
              <strong>WINDREAD Chương Dương</strong>
              <em>223 Chương Dương, Phường Bắc Mỹ An, Ngũ Hành Sơn, Đà Nẵng (Bờ sông Hàn)</em>
            </span>
          </Link>
        </div>
      </section>

      {/* FAQ Interactive Accordion */}
      <section className="section-shell" style={{ paddingTop: "60px" }}>
        <div className="section-title-bar">
          <div>
            <span className="category-tag">GIẢI ĐÁP THẮC MẮC</span>
            <h2>Câu Hỏi Thường Gặp Về Tết Cornrow Đà Nẵng</h2>
          </div>
          <p>Tất cả thông tin về thời gian thực hiện, độ dài tóc tối thiểu và cách gội đầu tại nhà</p>
        </div>

        <div className="faq-accordion">
          {faqJsonLd.mainEntity.map((item, idx) => (
            <details className="faq-item" key={idx} open={idx === 0}>
              <summary className="faq-question">
                <strong>{item.name}</strong>
              </summary>
              <div className="faq-answer">
                <p>{item.acceptedAnswer.text}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Related Informational Articles (Silo Links) */}
      <section className="section-shell" style={{ paddingTop: "60px" }}>
        <div className="section-title-bar">
          <div>
            <span className="category-tag">CẨM NANG HỮU ÍCH</span>
            <h2>Bài Viết Về Kỹ Thuật Tết Tóc Cornrows</h2>
          </div>
          <Link href="/news" style={{ color: "var(--accent-strong)", fontWeight: 900, textTransform: "uppercase", fontSize: "0.85rem" }}>
            Xem tất cả bài viết →
          </Link>
        </div>

        <div className="news-grid">
          {cornrowArticles.slice(0, 3).map((art) => (
            <article className="news-card" key={art.slug}>
              <Link href={`/news/${art.slug}`}>
                <Image
                  src={art.heroImage}
                  alt={art.title}
                  width={520}
                  height={340}
                  style={{ objectFit: "cover" }}
                />
              </Link>
              <h3>
                <Link href={`/news/${art.slug}`}>{art.title}</Link>
              </h3>
              <p>{art.excerpt}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="branch-final-cta section-shell" style={{ marginTop: "60px" }}>
        <div>
          <h2>Lên Đồ Streetwear Đậm Chất Cùng Mái Tóc Cornrows.</h2>
          <p>Đến ngay WINDREAD tại 35-37 An Thượng 29 hoặc 223 Chương Dương, Đà Nẵng để trải nghiệm dịch vụ chuyên nghiệp.</p>
        </div>
        <Link className="book-button large" href="/booking">
          Đặt Lịch Giữ Ghế Ngay
        </Link>
      </section>

      {/* Schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Cohesive Standard Footer with Footer Media */}
      <footer className="site-footer branch-site-footer">
        <div className="torn-divider" aria-hidden="true" />
        <div className="footer-content">
          <div className="footer-brand">
            <Image src="/logo-white.png" alt="WINDREAD Cornrows Đà Nẵng" width={2000} height={735} className="footer-logo" />
            <div className="footer-contact">
              <span>Cơ sở 1: 223 Chương Dương, Ngũ Hành Sơn, Đà Nẵng</span>
              <span>Cơ sở 2: 35 - 37 An Thượng 29, Ngũ Hành Sơn, Đà Nẵng</span>
              <a href="tel:0393549656">Hotline: 0393549656 (Zalo / WhatsApp)</a>
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

        <p className="footer-copyright">© 2025 WINDREAD Locs & Barber Club. All Rights Reserved.</p>
      </footer>
    </main>
  );
}
