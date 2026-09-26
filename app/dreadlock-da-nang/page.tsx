import Image from "next/image";
import Link from "next/link";
import { pageSeo, siteName, siteUrl } from "../seo";
import { articles } from "../../lib/seo/articles";
import { SiteHeader } from "../components/SiteHeader";

export const metadata = pageSeo.dreadlocksDaNang;

export default function DreadlockDaNangPage() {
  const dreadArticles = articles.filter(
    (a) => a.category === "dreadlocks" || a.slug.includes("dreadlock")
  );

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Làm Dreadlock Đà Nẵng",
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
    description: "Dịch vụ làm dreadlock Đà Nẵng chuyên nghiệp: Starter locs, nối tóc, retwist bảo dưỡng chân tóc, sửa chữa locs hư tổn và detox da đầu sâu."
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Làm dreadlock tại Đà Nẵng giá bao nhiêu?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Tại WINDREAD Đà Nẵng, giá làm starter locs nửa đầu dao động từ 1.200.000đ - 1.800.000đ; cả đầu từ 2.200.000đ - 3.500.000đ. Nối tóc dreadlock từ 3.500.000đ tùy độ dài và chất liệu tóc."
        }
      },
      {
        "@type": "Question",
        name: "Địa chỉ tiệm làm dreadlock uy tín nhất ở Đà Nẵng?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "WINDREAD có 2 cơ sở: Cơ sở 2 tại 35-37 An Thượng 29 (chuyên Locs & Braids) và Cơ sở 1 tại 223 Chương Dương (chuyên Clean Fade & Dreadlock Taper), Ngũ Hành Sơn, Đà Nẵng."
        }
      },
      {
        "@type": "Question",
        name: "Tóc ngắn bao nhiêu cm thì làm được dreadlock?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Độ dài tối thiểu lý tưởng là 8-10cm cho tóc tự nhiên. Nếu tóc ngắn khoảng 6-7cm, WINDREAD có thể kết hợp kỹ thuật nối sợi để bạn có ngay bộ locs ưng ý."
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
      { "@type": "ListItem", position: 3, name: "Dreadlock Đà Nẵng", item: `${siteUrl}/dreadlock-da-nang` }
    ]
  };

  const galleryImages = [
    {
      src: "/images/collection / Dreadlocks for Men/collection1.webp",
      alt: "Dreadlock ngắn kết hợp Low Taper Fade nam tại WINDREAD Đà Nẵng",
      width: 736,
      height: 981
    },
    {
      src: "/images/collection / Dreadlocks for Men/collection6.webp",
      alt: "Retwist chân tóc dreadlocks bóng khỏe, đường chia section sắc nét",
      width: 736,
      height: 981
    },
    {
      src: "/images/collection / Dreadlocks for Men/collection7.webp",
      alt: "Dreadlocks dài tự nhiên phong cách Rastafari tại Đà Nẵng",
      width: 736,
      height: 981
    },
    {
      src: "/images/collection / Dreadlocks for Men/collection10.webp",
      alt: "Sửa chữa, phục hồi lọn dreadlocks hư tổn và detox da đầu sâu",
      width: 736,
      height: 981
    },
    {
      src: "/images/collection / Dreadlocks for Men/collection11.webp",
      alt: "Tạo kiểu búi dreadlocks barrel twist cá tính tại WINDREAD Studio",
      width: 736,
      height: 981
    },
    {
      src: "/images/collection / Dreadlocks for Men/collection12.webp",
      alt: "Mẫu dreadlocks medium length phối màu highlight độc đáo",
      width: 736,
      height: 981
    }
  ];

  return (
    <main id="main-content" className="service-landing-page">
      <SiteHeader />

      {/* Cinematic Barbershop Hero */}
      <section className="branch-hero">
        <div className="branch-hero-image">
          <Image
            src="/images/collection / Dreadlocks for Men/collection1.webp"
            alt="Dreadlock Đà Nẵng - Tiệm Làm & Nối Dreadlocks Chuyên Nghiệp WINDREAD"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="branch-hero-overlay" />
        <div className="branch-hero-copy">
          <p>ĐỊA CHỈ SỐ 1 VỀ DREADLOCK TẠI ĐÀ NẴNG</p>
          <h1>DREADLOCK ĐÀ NẴNG</h1>
          <span>
            Chuyên gia Starter Locs, Instant Locs, Retwist và nối tóc Dreadlocks thủ công bằng kỹ thuật móc kim crochet không hóa chất. Form lọn tròn đều, chắc khỏe và giữ nếp bền đẹp lâu dài.
          </span>
          <div className="branch-hero-actions">
            <Link className="book-button large" href="/booking">
              Đặt lịch Dreadlock ngay
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
          <h2>Đúng form lọn, chuẩn chất tóc tự nhiên.</h2>
          <p>
            Tại WINDREAD Đà Nẵng, chúng tôi coi Dreadlocks là một tác phẩm nghệ thuật thủ công. Từng lọn tóc được chia section chính xác theo hình học tự nhiên, móc đan tỉ mỉ bằng kim crochet chuyên dụng không dùng keo dính độc hại, mang lại độ bền trên 2 năm và độ thông thoáng tối đa cho da đầu trong khí hậu biển nhiệt đới.
          </p>
        </div>
        <div className="branch-specialties" aria-label="Cam kết dịch vụ">
          <span>Cam kết tiêu chuẩn</span>
          <div>
            <strong>100% Thủ Công Crochet</strong>
            <strong>Bảo Hành 10 Ngày Miễn Phí</strong>
            <strong>2 Chi Nhánh Tại Đà Nẵng</strong>
            <strong>Tư Vấn Form Trực Tiếp</strong>
          </div>
        </div>
      </section>

      {/* Barbershop Pricing & Service Menu Board */}
      <section className="landing-services section-shell" style={{ paddingTop: "20px" }}>
        <div className="section-title-bar">
          <div>
            <span className="category-tag">BẢNG GIÁ DỊCH VỤ NIÊM YẾT</span>
            <h2>Các Gói Dịch Vụ Dreadlock Chuyên Sâu</h2>
          </div>
          <p>Giá công khai, tư vấn kỹ lưỡng theo chiều dài và mật độ tóc thực tế trước khi thực hiện</p>
        </div>

        <div className="services-grid">
          <article className="service-column">
            <h3>Làm Mới & Nối Dài</h3>

            <div className="service-row">
              <div>
                <h4>Starter Locs Nửa Đầu (Top Head)</h4>
                <p>Tạo bộ lọn dreadlocks phần đỉnh đầu, kết hợp cạo taper fade sắc nét 2 bên mang phong cách đường phố năng động.</p>
              </div>
              <div>
                <span>180 - 240 phút</span>
                <Link href="/booking">1.200.000đ - 1.800.000đ</Link>
              </div>
            </div>

            <div className="service-row">
              <div>
                <h4>Starter Locs Cả Đầu (Full Head)</h4>
                <p>Khởi tạo bộ locs toàn bộ da đầu. Chia section tỉ mỉ, móc kim săn chắc từ chân đến ngọn, tặng kèm chai dưỡng chuyên dụng.</p>
              </div>
              <div>
                <span>300 - 420 phút</span>
                <Link href="/booking">2.200.000đ - 3.500.000đ</Link>
              </div>
            </div>

            <div className="service-row">
              <div>
                <h4>Nối Tóc Dreadlocks Tự Nhiên</h4>
                <p>Nối liền sợi tóc thật cao cấp vào thân lọn sẵn có mà không lộ mối nối. Sở hữu ngay mái tóc dài cá tính trong ngày.</p>
              </div>
              <div>
                <span>240 - 360 phút</span>
                <Link href="/booking">Từ 3.500.000đ</Link>
              </div>
            </div>
          </article>

          <article className="service-column">
            <h3>Bảo Dưỡng & Phục Hồi</h3>

            <div className="service-row">
              <div>
                <h4>Retwist & Chăm Sóc Chân Tóc</h4>
                <p>Gom tóc con mới mọc, định hình lại đường rãnh chia ngôi và dưỡng ẩm chân tóc giúp bộ locs luôn vào nếp sắc nét.</p>
              </div>
              <div>
                <span>60 - 90 phút</span>
                <Link href="/booking">250.000đ - 450.000đ</Link>
              </div>
            </div>

            <div className="service-row">
              <div>
                <h4>Locs Detox & Tẩy Sâu Da Đầu</h4>
                <p>Ngâm detox muối biển khoáng và tinh dầu tràm trà tự nhiên, loại bỏ hoàn toàn cặn bẩn, bã nhờn tích tụ lâu ngày.</p>
              </div>
              <div>
                <span>45 - 60 phút</span>
                <Link href="/booking">200.000đ - 350.000đ</Link>
              </div>
            </div>

            <div className="service-row">
              <div>
                <h4>Repair & Phục Hồi Lọn Yếu</h4>
                <p>Gia cố chân tóc bị teo mỏng, nối lại các lọn tóc bị đứt gãy hoặc xơ xù nặng về trạng thái khỏe mạnh ban đầu.</p>
              </div>
              <div>
                <span>60 - 120 phút</span>
                <Link href="/booking">150.000đ - 500.000đ</Link>
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
            <h2>Hình Ảnh Dreadlocks Thực Hiện Tại WINDREAD</h2>
          </div>
          <p>Tất cả hình ảnh đều được ghi lại chân thực từ khách hàng tại 2 cơ sở An Thượng & Chương Dương</p>
        </div>

        <div className="branch-visuals" aria-label="Bộ sưu tập Dreadlocks Đà Nẵng">
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

      {/* Two Physical Branches in Da Nang */}
      <section className="branch-directory section-shell" aria-labelledby="branch-heading">
        <div className="section-title-bar">
          <div>
            <span className="category-tag">ĐỊA ĐIỂM TIỆM</span>
            <h2 id="branch-heading">Ghé Thăm 2 Chi Nhánh WINDREAD Tại Đà Nẵng</h2>
          </div>
          <p>Không gian thoải mái, điều hòa mát lạnh, trang thiết bị chuyên nghiệp tại Ngũ Hành Sơn</p>
        </div>

        <div className="branch-directory-grid">
          <Link className="branch-directory-card" href="/branches/an-thuong">
            <span className="branch-directory-image">
              <Image
                src="/images/an thuong store/space 1.jpg"
                alt="WINDREAD An Thượng - Tiệm chuyên Dreadlock & Braids Đà Nẵng"
                fill
                sizes="(max-width: 760px) 100vw, 50vw"
              />
            </span>
            <span className="branch-directory-copy">
              <small>Cơ sở 2 · Chuyên Locs & Braids</small>
              <strong>WINDREAD An Thượng</strong>
              <em>35 - 37 An Thượng 29, Phường Mỹ An, Ngũ Hành Sơn, Đà Nẵng (Khu phố Tây)</em>
            </span>
          </Link>

          <Link className="branch-directory-card" href="/branches/chuong-duong">
            <span className="branch-directory-image">
              <Image
                src="/images/chuong duong store/space1.webp"
                alt="WINDREAD Chương Dương - Tiệm Barber & Dreadlock Đà Nẵng"
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
            <h2>Câu Hỏi Thường Gặp Về Dreadlock Đà Nẵng</h2>
          </div>
          <p>Những điều bạn cần biết trước khi bước vào hành trình gắn bó cùng mái tóc Dreadlocks</p>
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
            <h2>Kiến Thức & Kỹ Thuật Chăm Sóc Dreadlocks</h2>
          </div>
          <Link href="/news" style={{ color: "var(--accent-strong)", fontWeight: 900, textTransform: "uppercase", fontSize: "0.85rem" }}>
            Xem tất cả bài viết →
          </Link>
        </div>

        <div className="news-grid">
          {dreadArticles.slice(0, 3).map((art) => (
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
          <h2>Tạo Dấu Ấn Riêng Với Mái Tóc Dreadlocks Độc Bản.</h2>
          <p>Crew WINDREAD luôn sẵn sàng lắng nghe ý tưởng và hiện thực hóa phong cách của bạn.</p>
        </div>
        <Link className="book-button large" href="/booking">
          Đặt Lịch Giữ Chỗ Ngay
        </Link>
      </section>

      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Cohesive Standard Footer with Footer Media */}
      <footer className="site-footer branch-site-footer">
        <div className="torn-divider" aria-hidden="true" />
        <div className="footer-content">
          <div className="footer-brand">
            <Image
              src="/logo-white.png"
              alt="WINDREAD Dreadlock Đà Nẵng"
              width={2000}
              height={735}
              className="footer-logo"
            />
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

        <p className="footer-copyright">
          © 2025 WINDREAD Locs & Barber Club. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}
