import Image from "next/image";
import Link from "next/link";
import { pageSeo, siteName, siteUrl } from "../seo";
import { articles } from "../../lib/seo/articles";
import { SiteHeader } from "../components/SiteHeader";

export const metadata = pageSeo.boxBraidsDaNang;

export default function BoxBraidsDaNangPage() {
  const boxBraidArticles = articles.filter(
    (a) => a.slug.includes("box-braid") || a.category === "braids"
  );

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Tết Tóc Box Braids Đà Nẵng",
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
    description: "Tết tóc Box Braids Đà Nẵng cho nam & nữ: Kỹ thuật chia ô tóc hình vuông hoặc tam giác hoàn hảo, nối sợi tóc giả cao cấp, chuyển động lọn linh hoạt."
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Tết tóc Box Braids tại Đà Nẵng giá bao nhiêu?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Giá tết Box Braids nam (phần đỉnh đầu) từ 400.000đ - 700.000đ. Giá tết Box Braids nữ dài toàn đầu từ 900.000đ - 2.200.000đ (đã bao gồm tóc nối theo yêu cầu)."
        }
      },
      {
        "@type": "Question",
        name: "Box Braids chơi được bao lâu?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Box Braids có độ bền cao từ 4 đến 6 tuần. Bạn có thể tự do gội đầu và tạo kiểu búi cao, buộc đuôi ngựa tùy thích."
        }
      },
      {
        "@type": "Question",
        name: "Tiệm có sẵn tóc nối màu không?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "WINDREAD luôn có sẵn hơn 30 màu tóc nối từ đen tự nhiên, nâu tây, vàng bạch kim, đến ombre pastel cá tính để bạn thoải mái lựa chọn."
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
      { "@type": "ListItem", position: 3, name: "Box Braids Đà Nẵng", item: `${siteUrl}/box-braids-da-nang` }
    ]
  };

  const galleryImages = [
    {
      src: "/images/collection /Boxbraids for Men/collection1.webp",
      alt: "Box braids nam buộc củ tỏi đỉnh đầu tại WINDREAD Đà Nẵng",
      width: 736,
      height: 981
    },
    {
      src: "/images/collection /Braids for Women/collection1.webp",
      alt: "Box braids nữ dài ngang eo phối màu ombre sang chảnh",
      width: 736,
      height: 981
    },
    {
      src: "/images/collection /Braids for Women/collection5.webp",
      alt: "Khách hàng nữ tự tin khoe tóc box braids tại Đà Nẵng",
      width: 736,
      height: 981
    },
    {
      src: "/images/moment/DSC09889.webp",
      alt: "Nghệ nhân braider đan từng lọn tóc hộp đều tăm tắp",
      width: 1920,
      height: 1280
    },
    {
      src: "/images/moment/Unknown-7.webp",
      alt: "Box braids phong cách streetwear tại khu phố Tây An Thượng",
      width: 1920,
      height: 1280
    },
    {
      src: "/images/moment/DSC09979.webp",
      alt: "Không gian studio ấm cúng và đầy tính nghệ thuật tại Đà Nẵng",
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
            src="/images/collection /Boxbraids for Men/collection1.webp"
            alt="Box Braids Đà Nẵng - Tết Tóc Hộp Đẹp, Cá Tính Cho Nam & Nữ WINDREAD"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="branch-hero-overlay" />
        <div className="branch-hero-copy">
          <p>CHUYÊN GIA BOX BRAIDS TẠI ĐÀ NẴNG</p>
          <h1>BOX BRAIDS ĐÀ NẴNG</h1>
          <span>
            Dịch vụ tết Box Braids chuẩn kỹ thuật quốc tế: Chia ô vuông vắn đều tăm tắp, phối sợi tóc nối cao cấp bồng bềnh, tạo kiểu đa dạng từ buộc búi man-bun đến buông xõa quyến rũ.
          </span>
          <div className="branch-hero-actions">
            <Link className="book-button large" href="/booking">
              Đặt lịch tết Box Braids
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
          <h2>Đường chia sắc nét, chuyển động lọn tóc linh hoạt.</h2>
          <p>
            Box Braids tại WINDREAD là sự kết hợp giữa nghệ thuật hình học và gu thẩm mỹ đường phố. Chúng tôi sử dụng sợi tóc Kanekalon siêu nhẹ, kháng nước và chống xù, giúp bạn tự tin vận động, tắm biển Mỹ Khê và tham gia các buổi tiệc đêm mà tóc vẫn bồng bềnh nguyên form.
          </p>
        </div>
        <div className="branch-specialties" aria-label="Cam kết dịch vụ">
          <span>Cam kết tiêu chuẩn</span>
          <div>
            <strong>Đường Chia Ô Đều Đặn</strong>
            <strong>Độ Bền 4 - 6 Tuần</strong>
            <strong>Sợi Nối Nhẹ Không Đau Đầu</strong>
            <strong>Hơn 30 Màu Tóc Nối Có Sẵn</strong>
          </div>
        </div>
      </section>

      {/* Barbershop Pricing & Service Menu Board */}
      <section className="landing-services section-shell" style={{ paddingTop: "20px" }}>
        <div className="section-title-bar">
          <div>
            <span className="category-tag">BẢNG GIÁ DỊCH VỤ NIÊM YẾT</span>
            <h2>Các Gói Box Braids Theo Kích Thước</h2>
          </div>
          <p>Bảng giá trọn gói, bao gồm sợi tóc nối và phụ kiện charm trang trí đi kèm</p>
        </div>

        <div className="services-grid">
          <article className="service-column">
            <h3>Box Braids Phổ Biến (Unisex)</h3>

            <div className="service-row">
              <div>
                <h4>Medium Box Braids (Lọn Vừa)</h4>
                <p>Kích thước lọn chuẩn mực, vừa vặn độ dày và chuyển động nhẹ nhàng. Kiểu tóc được yêu thích nhất cả nam và nữ.</p>
              </div>
              <div>
                <span>180 - 240 phút</span>
                <Link href="/booking">1.200.000đ - 1.800.000đ</Link>
              </div>
            </div>

            <div className="service-row">
              <div>
                <h4>Jumbo Box Braids (Lọn To Bản)</h4>
                <p>Lọn tóc to nổi bật, cá tính đậm chất hip-hop thập niên 90s. Thời gian tết nhanh và cảm giác siêu nhẹ đầu.</p>
              </div>
              <div>
                <span>120 - 150 phút</span>
                <Link href="/booking">900.000đ - 1.400.000đ</Link>
              </div>
            </div>

            <div className="service-row">
              <div>
                <h4>Micro / Small Box Braids (Lọn Nhỏ)</h4>
                <p>Hơn 100 lọn bện tinh xảo, bồng bềnh như suối tóc mây tự nhiên. Độ bền cao nhất, có thể tạo đủ kiểu búi uốn.</p>
              </div>
              <div>
                <span>240 - 360 phút</span>
                <Link href="/booking">1.800.000đ - 2.600.000đ</Link>
              </div>
            </div>
          </article>

          <article className="service-column">
            <h3>Box Braids Nam & Tạo Kiểu</h3>

            <div className="service-row">
              <div>
                <h4>Box Braids Nam (Top Head) + Fade</h4>
                <p>Tết ô vuông đỉnh đầu kết hợp cạo taper fade sắc nét 2 bên mang tai, đính kèm charm cườm kim loại cực ngầu.</p>
              </div>
              <div>
                <span>60 - 90 phút</span>
                <Link href="/booking">400.000đ - 700.000đ</Link>
              </div>
            </div>

            <div className="service-row">
              <div>
                <h4>Goddess / Bohemian Box Braids</h4>
                <p>Tết box braids kết hợp buông lơi các lọn tóc xoăn sóng bồng bềnh, mang đậm vẻ đẹp nữ tính quyến rũ.</p>
              </div>
              <div>
                <span>200 - 300 phút</span>
                <Link href="/booking">1.500.000đ - 2.500.000đ</Link>
              </div>
            </div>

            <div className="service-row">
              <div>
                <h4>Bảo Dưỡng Chân Tóc & Tháo Tóc</h4>
                <p>Dặm chân tóc mọc mới sau 4 tuần hoặc hỗ trợ tháo tóc, gội xả phục hồi tóc thật mềm mượt không gãy rụng.</p>
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
            <h2>Hình Ảnh Mẫu Tóc Box Braids Tại WINDREAD Đà Nẵng</h2>
          </div>
          <p>Hình ảnh thực tế những bộ tóc Box Braids đều đặn, sắc nét được tết trực tiếp tại studio</p>
        </div>

        <div className="branch-visuals" aria-label="Bộ sưu tập Box Braids Đà Nẵng">
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
      <section className="branch-directory section-shell" aria-labelledby="boxbraids-branch-heading">
        <div className="section-title-bar">
          <div>
            <span className="category-tag">ĐỊA ĐIỂM TIỆM</span>
            <h2 id="boxbraids-branch-heading">Ghé Thăm 2 Chi Nhánh WINDREAD Tại Đà Nẵng</h2>
          </div>
          <p>Tọa lạc tại khu phố Tây An Thượng và bờ sông Hàn Chương Dương, không gian thoáng đãng</p>
        </div>

        <div className="branch-directory-grid">
          <Link className="branch-directory-card" href="/branches/an-thuong">
            <span className="branch-directory-image">
              <Image
                src="/images/an thuong store/space 1.jpg"
                alt="WINDREAD An Thượng - Tiệm chuyên Box Braids & Locs Đà Nẵng"
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
                alt="WINDREAD Chương Dương - Tiệm Barber & Box Braids Nam Đà Nẵng"
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
            <h2>Câu Hỏi Thường Gặp Về Box Braids Đà Nẵng</h2>
          </div>
          <p>Giải đáp thắc mắc về độ dài tóc, chất liệu sợi kanekalon và bí quyết giữ nếp lâu</p>
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
            <h2>Bài Viết Hướng Dẫn Về Box Braids</h2>
          </div>
          <Link href="/news" style={{ color: "var(--accent-strong)", fontWeight: 900, textTransform: "uppercase", fontSize: "0.85rem" }}>
            Xem tất cả bài viết →
          </Link>
        </div>

        <div className="news-grid">
          {boxBraidArticles.slice(0, 3).map((art) => (
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
          <h2>Sở Hữu Mái Tóc Box Braids Độc Bản Của Riêng Bạn.</h2>
          <p>Đặt hẹn trực tuyến tại 35-37 An Thượng 29, Đà Nẵng để được crew phục vụ chu đáo nhất.</p>
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
            <Image src="/logo-white.png" alt="WINDREAD Box Braids Đà Nẵng" width={2000} height={735} className="footer-logo" />
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
