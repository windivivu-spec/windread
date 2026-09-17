import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, getArticleBySlug, getLiveArticleBySlug } from "../../../lib/seo/articles";
import { siteName, siteUrl } from "../../seo";
import type { Metadata } from "next";
import { SiteHeader } from "../../components/SiteHeader";

export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = (await getLiveArticleBySlug(slug)) || getArticleBySlug(slug);
  if (!article) return {};

  const url = new URL(`/news/${article.slug}`, siteUrl).toString();
  const imageUrl = new URL(article.heroImage, siteUrl).toString();

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    alternates: {
      canonical: url
    },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      url,
      siteName,
      type: "article",
      locale: "vi_VN",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: article.metaTitle,
      description: article.metaDescription,
      images: [imageUrl]
    }
  };
}

export default async function ArticleDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = (await getLiveArticleBySlug(slug)) || getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = articles.filter((item) =>
    article.relatedSlugs.includes(item.slug)
  );

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    image: new URL(article.heroImage, siteUrl).toString(),
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Person",
      name: article.author
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      logo: {
        "@type": "ImageObject",
        url: new URL("/images/windread-logo.png", siteUrl).toString()
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": new URL(`/news/${article.slug}`, siteUrl).toString()
    }
  };

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
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `${siteUrl}/news/${article.slug}`
      }
    ]
  };

  const faqJsonLd =
    article.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: article.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer
            }
          }))
        }
      : null;

  return (
    <main id="main-content" className="article-page">
      <SiteHeader />

      {/* Breadcrumbs */}
      <nav className="article-breadcrumbs section-shell" aria-label="Breadcrumb">
        <ol>
          <li>
            <Link href="/">Trang chủ</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/news">Tin tức</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{article.title}</li>
        </ol>
      </nav>

      {/* Article Header */}
      <header className="article-header section-shell">
        <div className="article-meta-badge">
          <span className="category-tag">{article.categoryLabel}</span>
          <time dateTime={article.publishedAt}>Cập nhật: {article.updatedAt}</time>
        </div>
        <h1 className="article-title">{article.title}</h1>
        <p className="article-excerpt">{article.excerpt}</p>
        <div className="article-author-card">
          <span>Tác giả: <strong>{article.author}</strong></span>
          <span>Địa điểm: <strong>WINDREAD Studio, Đà Nẵng</strong></span>
        </div>
        <div className="article-hero-media">
          <Image
            src={article.heroImage}
            alt={article.title}
            width={1200}
            height={675}
            priority
            className="article-hero-image"
          />
        </div>
      </header>

      {/* Article Body + Sidebar */}
      <div className="article-layout section-shell">
        <aside className="article-sidebar">
          {article.toc.length > 0 && (
            <div className="article-toc-box">
              <h2>Mục lục bài viết</h2>
              <ul>
                {article.toc.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`}>{item.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="article-booking-widget">
            <h3>Làm Tóc Tại Đà Nẵng?</h3>
            <p>Giữ ghế trước để crew WINDREAD tư vấn chất tóc và lên form chuẩn nhất.</p>
            <Link className="book-button large full-width" href="/booking">
              Đặt lịch online ngay
            </Link>
            <a className="ghost-button full-width" href="tel:0393549656">
              Hotline: 0393549656
            </a>
          </div>
        </aside>

        <article className="article-content-wrapper">
          {article.content.map((paragraph, index) => {
            const trimmed = paragraph.trim();
            
            // Check for standalone markdown image: ![Alt](url)
            const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
            if (imgMatch) {
              const altText = imgMatch[1];
              const imgSrc = imgMatch[2];
              return (
                <figure key={index} className="article-inline-image">
                  <Image
                    src={imgSrc}
                    alt={altText || article.title}
                    width={900}
                    height={600}
                    className="article-body-image"
                  />
                  {altText && <figcaption>{altText}</figcaption>}
                </figure>
              );
            }

            // Check for headings: ## or ###
            if (trimmed.startsWith("### ") || trimmed.startsWith("## ")) {
              const isH3 = trimmed.startsWith("### ");
              const prefix = isH3 ? "### " : "## ";
              const [heading, ...body] = trimmed.split("\n\n");
              const headingText = heading.replace(prefix, "").trim();
              const anchorId =
                article.toc.find((t) => t.title.toLowerCase().includes(headingText.slice(0, 10).toLowerCase()))?.id ||
                `section-${index}`;

              return (
                <section key={index} id={anchorId} className="article-section">
                  <h2>{headingText}</h2>
                  {body.map((subP, subIndex) => (
                    <p key={subIndex} dangerouslySetInnerHTML={{ __html: formatMarkdownText(subP) }} />
                  ))}
                </section>
              );
            }

            return (
              <p key={index} dangerouslySetInnerHTML={{ __html: formatMarkdownText(paragraph) }} />
            );
          })}

          {/* Money Page CTA Box */}
          <div className="article-money-cta">
            <div className="cta-icon">✦</div>
            <div className="cta-text">
              <h3>Dịch vụ chuyên biệt tại WINDREAD</h3>
              <p>Trải nghiệm dịch vụ chuyên sâu tại cơ sở An Thượng hoặc Chương Dương, Đà Nẵng.</p>
            </div>
            <Link className="book-button" href={article.moneyPageLink.href}>
              {article.moneyPageLink.label} →
            </Link>
          </div>

          {/* FAQ Accordion Section */}
          {article.faqs.length > 0 && (
            <section id="faq" className="article-faq-section">
              <h2>Câu hỏi thường gặp</h2>
              <div className="faq-list">
                {article.faqs.map((faq, fIdx) => (
                  <details className="faq-item" key={fIdx} open={fIdx === 0}>
                    <summary className="faq-question">
                      <strong>{faq.question}</strong>
                    </summary>
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}
        </article>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="article-related section-shell">
          <h2>Bài viết liên quan</h2>
          <div className="related-grid">
            {relatedArticles.map((rel) => (
              <Link href={`/news/${rel.slug}`} key={rel.slug} className="related-card">
                <div className="related-image-box">
                  <Image src={rel.heroImage} alt={rel.title} width={400} height={260} />
                </div>
                <div className="related-copy">
                  <span className="category-tag small">{rel.categoryLabel}</span>
                  <h3>{rel.title}</h3>
                  <p>{rel.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Structured Data Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* Footer */}
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

function formatMarkdownText(text: string): string {
  return text
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<figure class="article-inline-image"><img src="$2" alt="$1" class="article-body-image" /><figcaption>$1</figcaption></figure>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^> (.*)$/gm, "<blockquote>$1</blockquote>")
    .replace(/\n- (.*?)(?=(\n- |$))/g, "<li>$1</li>")
    .replace(/(<li>[\s\S]*?<\/li>)/g, "<ul>$1</ul>");
}
