"use client";

import { PageFlip } from "page-flip";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const DESKTOP_ABOUT_PAGES = [
  "/images/about/about_1_hor_left.webp",
  "/images/about/about_1_hor_right.webp",
  "/images/about/about_2.webp",
  "/images/about/about_3.webp",
  "/images/about/about_4.webp",
  "/images/about/about_5.webp"
];

const MOBILE_ABOUT_PAGES = [
  "/images/about/about_1.webp",
  "/images/about/about_2.webp",
  "/images/about/about_3.webp",
  "/images/about/about_4.webp",
  "/images/about/about_5.webp"
];

const ABOUT_NAV_ITEMS = [
  { href: "/", label: "Trang chủ" },
  { href: "/about", label: "Giới thiệu" },
  { href: "/pricing", label: "Bảng giá" },
  { href: "/news", label: "Tin tức" }
];

type FlipEvent = {
  data: number | string | boolean | object;
};

type PageFlipInstance = {
  loadFromImages: (images: string[]) => void;
  loadFromHTML: (items: HTMLElement[]) => void;
  updateFromImages: (images: string[]) => void;
  flipNext: (corner?: "top" | "bottom") => void;
  flipPrev: (corner?: "top" | "bottom") => void;
  turnToPage: (page: number) => void;
  getCurrentPageIndex: () => number;
  getPageCount: () => number;
  destroy: () => void;
  on: (event: "flip" | "changeOrientation" | "changeState" | "init" | "update", cb: (event: FlipEvent) => void) => void;
};

function preloadImages(images: string[]) {
  return Promise.all(
    images.map(
      (src) =>
        new Promise<void>((resolve) => {
          const image = new window.Image();
          image.onload = () => resolve();
          image.onerror = () => resolve();
          image.src = src;
        })
    )
  );
}

function ReducedMotionBook({ pages }: { pages: string[] }) {
  return (
    <main id="main-content" className="about-image-fallback" aria-label="Windread about pages">
      <header>
        <Link href="/">Windread</Link>
        <Link href="/booking">Book Now</Link>
      </header>
      <section>
        {pages.map((src, index) => (
          <figure key={src}>
            <Image
              src={src}
              alt={`Windread book page ${index + 1}`}
              width={1086}
              height={1448}
              sizes="(max-width: 760px) 94vw, 520px"
              priority={index === 0}
            />
          </figure>
        ))}
      </section>
    </main>
  );
}

export default function AboutPage() {
  const bookHostRef = useRef<HTMLDivElement | null>(null);
  const flipRef = useRef<PageFlipInstance | null>(null);
  const [page, setPage] = useState(0);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const activePages = isMobile ? MOBILE_ABOUT_PAGES : DESKTOP_ABOUT_PAGES;

  const pageLabel = useMemo(() => {
    const current = Math.min(page + 1, activePages.length);
    return `${String(current).padStart(2, "0")} / ${String(activePages.length).padStart(2, "0")}`;
  }, [activePages.length, page]);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 760px)");
    const syncMotion = () => setReducedMotion(motionQuery.matches);
    syncMotion();
    setIsMobile(mobileQuery.matches);
    setMediaReady(true);
    motionQuery.addEventListener("change", syncMotion);
    return () => {
      motionQuery.removeEventListener("change", syncMotion);
    };
  }, []);

  useEffect(() => {
    if (!bookHostRef.current || reducedMotion || !mediaReady) return;
    let cancelled = false;
    let loaded = false;
    setReady(false);
    setPage(0);

    const bookElement = document.createElement("div");
    bookElement.className = "about-pageflip";
    bookHostRef.current.replaceChildren(bookElement);

    const pageElements = activePages.map((src, index) => {
      const pageElement = document.createElement("div");
      pageElement.className = "about-flip-page";
      const image = document.createElement("img");
      image.src = src;
      image.alt = `Windread book page ${index + 1}`;
      image.draggable = false;
      pageElement.appendChild(image);
      return pageElement;
    });

    const pageFlip = new PageFlip(bookElement, {
      width: 768,
      height: 1024,
      size: "stretch",
      minWidth: 292,
      maxWidth: 620,
      minHeight: 389,
      maxHeight: 827,
      drawShadow: true,
      flippingTime: 900,
      usePortrait: true,
      startZIndex: 2,
      autoSize: true,
      maxShadowOpacity: 0.72,
      showCover: false,
      mobileScrollSupport: false,
      swipeDistance: 24,
      clickEventForward: true,
      useMouseEvents: true,
      showPageCorners: true,
      disableFlipByClick: false
    }) as PageFlipInstance;

    pageFlip.on("init", (event) => {
      if (typeof event.data === "object" && event.data && "page" in event.data) {
        setPage(Number((event.data as { page: number }).page));
      }
      window.setTimeout(() => {
        if (!cancelled) setReady(true);
      }, 120);
    });

    pageFlip.on("flip", (event) => {
      if (typeof event.data === "number") setPage(event.data);
    });

    flipRef.current = pageFlip;

    preloadImages(activePages).then(() => {
      if (cancelled) return;
      pageFlip.loadFromHTML(pageElements);
      loaded = true;
    });

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") pageFlip.flipNext("bottom");
      if (event.key === "ArrowLeft") pageFlip.flipPrev("bottom");
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      cancelled = true;
      window.removeEventListener("keydown", handleKey);
      flipRef.current = null;
      if (loaded) pageFlip.destroy();
      if (bookHostRef.current) bookHostRef.current.replaceChildren();
    };
  }, [activePages, mediaReady, reducedMotion]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  if (reducedMotion) {
    return <ReducedMotionBook pages={activePages} />;
  }

  return (
    <main id="main-content" className="about-flip-shell">
      <div className="about-reader-noise" aria-hidden="true" />
      <header className="site-nav about-book-nav" aria-label="Điều hướng chính">
        <Link className="nav-brand" href="/" aria-label="WINDREAD home">
          <Image
            src="/images/windread-logo.png"
            alt=""
            width={265}
            height={81}
            priority
            className="nav-logo"
          />
          <span className="sr-only">WINDREAD</span>
        </Link>
        <nav className={`nav-links ${menuOpen ? "is-open" : ""}`} aria-label="Section links">
          {ABOUT_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              className={item.href === "/about" ? "active" : ""}
              href={item.href}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
            type="button"
            aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
          <Link className="book-button" href="/booking">
            BOOK NOW
          </Link>
        </div>
      </header>

      <section className={`about-reader-stage ${ready ? "is-ready" : ""}`} aria-label="Interactive Windread book">
        <div ref={bookHostRef} className="about-pageflip-host" />
        {!ready && <span className="about-reader-loading">Loading pages</span>}
      </section>

      <footer className="about-reader-controls" aria-label="Book navigation">
        <button type="button" onClick={() => flipRef.current?.flipPrev("bottom")}>
          Prev
        </button>
        <span>{pageLabel}</span>
        <button type="button" onClick={() => flipRef.current?.flipNext("bottom")}>
          Next
        </button>
      </footer>
    </main>
  );
}
