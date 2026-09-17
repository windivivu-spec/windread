import Image from "next/image";
import Link from "next/link";
import { pageSeo, siteName, siteUrl } from "../seo";
import { articles } from "../../lib/seo/articles";
import { SiteHeader } from "../components/SiteHeader";

export const metadata = pageSeo.braidsDaNang;

export default function BraidsDaNangPage() {
  const braidArticles = articles.filter(
    (a) => a.category === "braids" || a.slug.includes("braid")
  );

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Tết Tóc Braids Đà Nẵng",
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
    description: "Dịch vụ tết tóc Braids Đà Nẵng cho nam & nữ: Knotless braids, box braids, twist, đường tết sắc sảo, không đau da đầu tại phố Tây An Thượng."
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Tết tóc braids tại Đà Nẵng giá bao nhiêu?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Giá tết tóc braids tại WINDREAD dao động từ 300.000đ - 600.000đ cho tóc nam (cornrows, basic braids) và từ 800.000đ - 2.500.000đ cho các kiểu box braids, knotless braids dài toàn đầu."
        }
      },
      {
        "@type": "Question",
        name: "Tết tóc braids có giữ được lâu không?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Tóc braids thông thường giữ nếp đẹp từ 3 đến 6 tuần nếu chăm sóc đúng cách và đội mũ trùm satin khi ngủ."
        }
      },
      {
        "@type": "Question",
        name: "Tóc ngắn có tết được braids không?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Chỉ cần tóc dài từ 7cm trở lên là có thể tết được các kiểu braids cơ bản hoặc nối thêm sợi tóc giả để tạo độ dài theo ý muốn."
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
      { "@type": "ListItem", position: 3, name: "Braid Đà Nẵng", item: `${siteUrl}/braids-da-nang` }
    ]
  };

  const galleryImages = [
    {
      src: "/images/collection /Braids for Women/collection1.webp",
      alt: "Tết tóc braids dài phối màu cá tính tại Đà Nẵng",
      width: 736,
      height: 981
    },
    {
      src: "/images/collection /Braids for Women/collection5.webp",
      alt: "Mẫu braids nữ chụp ảnh check-in biển Mỹ Khê Đà Nẵng",
      width: 736,
      height: 981
    },
    {
      src: "/images/collection /Boxbraids for Men/collection1.webp",
      alt: "Box braids nam kết hợp fade sắc nét tại WINDREAD",
      width: 736,
      height: 981
    },
    {
      src: "/images/collection /Cornrows for Men/collection4.webp",
      alt: "Pattern braids nam hoa văn độc bản tại Đà Nẵng",
      width: 736,
      height: 981
    },
    {
      src: "/images/moment/DSC09870.webp",
      alt: "Nghệ nhân tết tóc cẩn thận từng lọn tại An Thượng Đà Nẵng",
      width: 1920,
      height: 1280
    },
    {
      src: "/images/moment/DSC09923.webp",
      alt: "Thành phẩm bộ tóc braids vào nếp bóng mượt",
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
            src="/images/collection /Braids for Women/collection1.webp"
            alt="Braid & Tết Tóc Đà Nẵng - Tiệm Tết Tóc Phong Cách Chuyên Nghiệp WINDREAD"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="branch-hero-overlay" />
        <div className="branch-hero-copy">
          <p>ĐỊA CHỈ TẾT TÓC BRAIDS HÀNG ĐẦU TẠI ĐÀ NẴNG</p>
          <h1>BRAIDS & TẾT TÓC ĐÀ NẴNG</h1>
          <span>
            Nghệ thuật tết tóc đường phố chuyên nghiệp dành cho cả nam, nữ, du khách quốc tế và cộng đồng expat. Đường tết căng bóng, không đau rát da đầu, giữ nếp hoàn hảo cho mọi chuyến du lịch.
          </span>
          <div className="branch-hero-actions">
            <Link className="book-button large" href="/booking">
              Đặt lịch làm Braids ngay
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
          <h2>Đẹp cá tính, êm dịu và không đau da đầu.</h2>
          <p>
            Tết tóc tại WINDREAD được thực hiện bởi những nghệ nhân giàu kinh nghiệm, sử dụng kỹ thuật vuốt sáp dưỡng ẩm hữu cơ và chia section êm ái. Dù bạn muốn một bộ Box Braids rực rỡ để check-in biển hay một bộ Cornrows cá tính đậm chất hip-hop, chúng tôi đều tạo hình hoàn hảo theo phom đầu của bạn.
          </p>
        </div>
        <div className="branch-specialties" aria-label="Cam kết dịch vụ">
          <span>Cam kết tiêu chuẩn</span>
          <div>
            <strong>Không Đau Da Đầu</strong>
            <strong>Đa Dạng Tóc Nối & Phụ Kiện</strong>
            <strong>Phục Vụ Cả Nam & Nữ</strong>
            <strong>Tư Vấn Tiếng Anh Chuyên Nghiệp</strong>
          </div>
        </div>
      </section>

      {/* Barbershop Pricing & Service Menu Board */}
      <section className="landing-services section-shell" style={{ paddingTop: "20px" }}>
        <div className="section-title-bar">
          <div>
            <span className="category-tag">BẢNG GIÁ DỊCH VỤ NIÊM YẾT</span>
            <h2>Các Gói Dịch Vụ Tết Tóc Braids</h2>
          </div>
          <p>Mức giá minh bạch, bao gồm chi phí gội sạch da đầu và xịt dưỡng sau khi hoàn thiện</p>
        </div>

        <div className="services-grid">
          <article className="service-column">
            <h3>Tết Tóc Nữ (Women Braids)</h3>

            <div className="service-row">
              <div>
                <h4>Box Braids / Knotless Braids Dài</h4>
                <p>Tết từng tép tóc vuông hoặc không mối nối knotless êm ái, nối sợi kanekalon cao cấp bồng bềnh tự nhiên.</p>
              </div>
              <div>
                <span>180 - 300 phút</span>
                <Link href="/booking">800.000đ - 2.500.000đ</Link>
              </div>
            </div>

            <div className="service-row">
              <div>
                <h4>Feed-in Braids & French Braids</h4>
                <p>Tết bím nổi sát da đầu tăng dần độ dày, đính kèm vòng khuyên xỏ kim loại hoặc hạt gỗ bohemian.</p>
              </div>
              <div>
                <span>90 - 150 phút</span>
                <Link href="/booking">400.000đ - 900.000đ</Link>
              </div>
            </div>

            <div className="service-row">
              <div>
                <h4>Tết Tóc Nửa Đầu Check-in Biển</h4>
                <p>Tết 2 - 4 đường line phong cách festival, kết hợp sợi tóc màu neon, ombre bắt mắt đi tiệc và chụp ảnh.</p>
              </div>
              <div>
                <span>45 - 60 phút</span>
                <Link href="/booking">250.000đ - 500.000đ</Link>
              </div>
            </div>
          </article>

          <article className="service-column">
            <h3>Tết Tóc Nam & Chăm Sóc</h3>

            <div className="service-row">
              <div>
                <h4>Cornrows Sát Da Đầu (Men)</h4>
                <p>Đường tết hình học sắc nét từ trán về sau gáy, tôn trọn góc cạnh gương mặt nam tính và kết hợp fade 2 bên.</p>
              </div>
              <div>
                <span>60 - 120 phút</span>
                <Link href="/booking">300.000đ - 650.000đ</Link>
              </div>
            </div>

            <div className="service-row">
              <div>
                <h4>Box Braids Men + Taper Fade</h4>
                <p>Chia ô hình học phần đỉnh đầu, lọn tết buông tự do phong cách rapper Travis Scott / A$AP Rocky.</p>
              </div>
              <div>
                <span>120 - 180 phút</span>
                <Link href="/booking">500.000đ - 1.200.000đ</Link>
              </div>
            </div>

            <div className="service-row">
              <div>
                <h4>Braid Refresh & Tháo Tóc An Toàn</h4>
                <p>Dặm lại chân tóc mọc xù, thay đổi phụ kiện hoặc tháo tóc gội xả dưỡng phục hồi nang tóc mềm mượt.</p>
              </div>
              <div>
                <span>45 - 90 phút</span>
                <Link href="/booking">150.000đ - 350.000đ</Link>
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
            <h2>Hình Ảnh Thực Tế Tết Tóc Braids Tại Đà Nẵng</h2>
          </div>
          <p>Tất cả hình ảnh đều được ghi lại chân thực từ khách hàng tại cơ sở An Thượng & Chương Dương</p>
        </div>

        <div className="branch-visuals" aria-label="Bộ sưu tập Braids Đà Nẵng">
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
      <section className="branch-directory section-shell" aria-labelledby="braids-branch-heading">
        <div className="section-title-bar">
          <div>
            <span className="category-tag">ĐỊA ĐIỂM TIỆM</span>
            <h2 id="braids-branch-heading">Ghé Thăm Không Gian Tết Tóc WINDREAD Đà Nẵng</h2>
          </div>
          <p>Tọa lạc ngay trung tâm phố Tây An Thượng và bờ sông Hàn Chương Dương thoáng mát</p>
        </div>

        <div className="branch-directory-grid">
          <Link className="branch-directory-card" href="/branches/an-thuong">
            <span className="branch-directory-image">
              <Image
                src="/images/an thuong store/space 1.jpg"
                alt="WINDREAD An Thượng - Tiệm chuyên Braids & Locs Đà Nẵng"
                fill
                sizes="(max-width: 760px) 100vw, 50vw"
              />
            </span>
            <span className="branch-directory-copy">
              <small>Cơ sở 2 · Studio Chuyên Braids & Locs</small>
              <strong>WINDREAD An Thượng</strong>
              <em>35 - 37 An Thượng 29, Phường Mỹ An, Ngũ Hành Sơn, Đà Nẵng (Khu phố Tây)</em>
            </span>
          </Link>

          <Link className="branch-directory-card" href="/branches/chuong-duong">
            <span className="branch-directory-image">
              <Image
                src="/images/chuong duong store/space1.webp"
                alt="WINDREAD Chương Dương - Tiệm Barber & Braids Nam Đà Nẵng"
                fill
                sizes="(max-width: 760px) 100vw, 50vw"
              />
            </span>
            <span className="branch-directory-copy">
              <small>Cơ sở 1 · Barber & Men Styling</small>
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
            <h2>Câu Hỏi Thường Gặp Về Dịch Vụ Braids Đà Nẵng</h2>
          </div>
          <p>Tất cả giải đáp về quy trình tết tóc, cách chăm sóc và giữ nếp lâu nhất</p>
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
            <h2>Kiến Thức & Bí Quyết Chăm Sóc Tóc Braids</h2>
          </div>
          <Link href="/news" style={{ color: "var(--accent-strong)", fontWeight: 900, textTransform: "uppercase", fontSize: "0.85rem" }}>
            Xem tất cả bài viết →
          </Link>
        </div>

        <div className="news-grid">
          {braidArticles.slice(0, 3).map((art) => (
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
          <h2>Tỏa Sáng Với Mái Tóc Tết Braids Cá Tính Tại Đà Nẵng.</h2>
          <p>Đội ngũ braider sẵn sàng tư vấn mẫu tóc hợp với khuôn mặt và trang phục của bạn.</p>
        </div>
        <Link className="book-button large" href="/booking">
          Đặt Lịch Giữ Chỗ Ngay
        </Link>
      </section>

      {/* Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Cohesive Standard Footer with Footer Media */}
      <footer className="site-footer branch-site-footer">
        <div className="torn-divider" aria-hidden="true" />
        <div className="footer-content">
          <div className="footer-brand">
            <Image src="/images/windread-logo.png" alt="WINDREAD Braids Đà Nẵng" width={1327} height={404} className="footer-logo" />
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
