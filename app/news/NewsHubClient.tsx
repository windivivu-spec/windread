"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import type { Article } from "../../lib/seo/articles";

type CategoryFilter = "all" | "local" | "dreadlocks" | "braids";

export function NewsHubClient({ articles }: { articles: Article[] }) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");

  const spotlightArticle = useMemo(() => {
    return articles.find((a) => a.slug === "top-dia-chi-lam-dreadlock-tai-da-nang") ?? articles[0];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (activeCategory === "all") {
      // In "all" view, spotlight is highlighted at top, remaining in grid
      return articles;
    }
    if (activeCategory === "local") {
      return articles.filter((a) => a.category === "local");
    }
    if (activeCategory === "dreadlocks") {
      return articles.filter((a) => a.category === "dreadlocks");
    }
    if (activeCategory === "braids") {
      return articles.filter((a) => a.category === "braids" || a.category === "barber");
    }
    return articles;
  }, [articles, activeCategory]);

  const counts = useMemo(() => {
    return {
      all: articles.length,
      local: articles.filter((a) => a.category === "local").length,
      dreadlocks: articles.filter((a) => a.category === "dreadlocks").length,
      braids: articles.filter((a) => a.category === "braids" || a.category === "barber").length
    };
  }, [articles]);

  return (
    <div className="news-hub-shell">
      {/* Quick Service Landing Navigation */}
      <div className="news-service-nav" style={{ marginBottom: "36px" }}>
        <span className="news-service-nav-label">Dịch vụ trọng tâm:</span>
        <div className="news-service-pills">
          <Link href="/dreadlock-da-nang" className="news-service-pill">
            ✦ Dreadlock Đà Nẵng
          </Link>
          <Link href="/braids-da-nang" className="news-service-pill">
            ✦ Braid & Tết Tóc Đà Nẵng
          </Link>
          <Link href="/cornrows-da-nang" className="news-service-pill">
            ✦ Cornrows Đà Nẵng
          </Link>
          <Link href="/box-braids-da-nang" className="news-service-pill">
            ✦ Box Braids Đà Nẵng
          </Link>
        </div>
      </div>

      {/* Featured Spotlight Article (Show in "all" or "local" mode) */}
      {(activeCategory === "all" || activeCategory === "local") && spotlightArticle && (
        <article className="news-spotlight-card">
          <Link href={`/news/${spotlightArticle.slug}`} className="news-spotlight-thumb">
            <Image
              src={spotlightArticle.heroImage}
              alt={spotlightArticle.title}
              width={720}
              height={450}
              priority
              sizes="(max-width: 900px) 100vw, 55vw"
            />
          </Link>
          <div className="news-spotlight-copy">
            <p className="eyebrow">BÀI VIẾT NỔI BẬT · {spotlightArticle.intent}</p>
            <h2>
              <Link href={`/news/${spotlightArticle.slug}`}>{spotlightArticle.title}</Link>
            </h2>
            <p>{spotlightArticle.excerpt}</p>
            <div className="news-spotlight-actions">
              <Link className="book-button" href={`/news/${spotlightArticle.slug}`}>
                Đọc Bài Viết Này →
              </Link>
              {spotlightArticle.moneyPageLink && (
                <Link className="ghost-button" href={spotlightArticle.moneyPageLink.href}>
                  Xem Dịch Vụ: {spotlightArticle.moneyPageLink.label}
                </Link>
              )}
            </div>
          </div>
        </article>
      )}

      {/* Category Filter Tabs */}
      <div className="news-filter-tabs" role="tablist" aria-label="Lọc cẩm nang theo chuyên mục">
        <button
          type="button"
          role="tab"
          aria-selected={activeCategory === "all"}
          className={`news-filter-tab ${activeCategory === "all" ? "is-active" : ""}`}
          onClick={() => setActiveCategory("all")}
        >
          <span>Tất Cả Bài Viết</span>
          <span className="news-filter-count">{counts.all}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeCategory === "local"}
          className={`news-filter-tab ${activeCategory === "local" ? "is-active" : ""}`}
          onClick={() => setActiveCategory("local")}
        >
          <span>Địa Chỉ & Bảng Giá</span>
          <span className="news-filter-count">{counts.local}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeCategory === "dreadlocks"}
          className={`news-filter-tab ${activeCategory === "dreadlocks" ? "is-active" : ""}`}
          onClick={() => setActiveCategory("dreadlocks")}
        >
          <span>Kỹ Thuật Dreadlocks</span>
          <span className="news-filter-count">{counts.dreadlocks}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeCategory === "braids"}
          className={`news-filter-tab ${activeCategory === "braids" ? "is-active" : ""}`}
          onClick={() => setActiveCategory("braids")}
        >
          <span>Braids, Cornrows & Barber</span>
          <span className="news-filter-count">{counts.braids}</span>
        </button>
      </div>

      {/* 3-Column Equal-Height Editorial Card Grid */}
      <div className="editorial-card-grid">
        {filteredArticles.map((article) => (
          <article className="editorial-card" key={article.slug}>
            <Link href={`/news/${article.slug}`} className="editorial-card-thumb">
              <Image
                src={article.heroImage}
                alt={article.title}
                width={540}
                height={340}
                sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 33vw"
              />
            </Link>
            <div className="editorial-card-body">
              <div className="editorial-card-meta">
                <span className="editorial-card-tag">{article.intent}</span>
              </div>
              <h3 className="editorial-card-title">
                <Link href={`/news/${article.slug}`}>{article.title}</Link>
              </h3>
              <p className="editorial-card-excerpt">{article.excerpt}</p>
              <div className="editorial-card-footer">
                <Link href={`/news/${article.slug}`} className="editorial-card-link">
                  Đọc tiếp →
                </Link>
                {article.moneyPageLink && (
                  <Link href={article.moneyPageLink.href} className="editorial-card-money">
                    {article.moneyPageLink.label}
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Bottom Final CTA */}
      <section className="branch-final-cta" style={{ marginTop: "72px" }}>
        <div>
          <h2>Sẵn Sàng Thay Đổi Phong Cách?</h2>
          <p>
            Ghé ngay 2 chi nhánh WINDREAD tại Đà Nẵng để được tư vấn chất tóc thực tế và sở hữu diện mạo ưng ý nhất.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link className="book-button large" href="/booking">
            Đặt Lịch Giữ Ghế Ngay
          </Link>
          <a
            className="ghost-button"
            href="tel:0393549656"
            style={{ minHeight: "48px", display: "inline-flex", alignItems: "center", padding: "0 20px" }}
          >
            Hotline: 0393549656
          </a>
        </div>
      </section>
    </div>
  );
}
