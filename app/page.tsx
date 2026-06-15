"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { FormEvent, useEffect, useMemo, useState } from "react";

const navItems = [
  { key: "home", href: "/", vi: "Trang chủ", en: "Home" },
  { key: "about", href: "/about", vi: "Giới thiệu", en: "About" },
  { key: "pricing", href: "/pricing", vi: "Bảng giá", en: "Pricing" },
  { key: "news", href: "/news", vi: "Tin tức", en: "News" }
] as const;

type PageKey =
  | typeof navItems[number]["key"]
  | "services"
  | "gallery"
  | "shop"
  | "barbers"
  | "booking"
  | "contact";
type Lang = "vi" | "en";
type HomeGalleryTab = "DREAD LOCK" | "Braid" | "Other";

const socialLinks = [
  { label: "Instagram", icon: "IG", href: "https://instagram.com" },
  { label: "Facebook", icon: "FB", href: "https://facebook.com" },
  { label: "TikTok", icon: "TT", href: "https://tiktok.com" }
];

const heroHighlights = [
  {
    icon: "/images/icon/moc.png",
    viTitle: "Chuyên Locs",
    viDesc: "Tạo chất riêng",
    enTitle: "Locs Focus",
    enDesc: "Signature texture"
  },
  {
    icon: "/images/icon/clipper.png",
    viTitle: "Barbers",
    viDesc: "Nhiều kinh nghiệm",
    enTitle: "Barber",
    enDesc: "Style-precise cuts"
  },
  {
    icon: "/images/icon/spray.png",
    viTitle: "Chất lượng",
    viDesc: "Sản phẩm cao cấp",
    enTitle: "Quality",
    enDesc: "Premium products"
  }
] as const;

const locServices = [
  {
    name: "Starter Locs",
    desc: "Tư vấn form locs hợp chất tóc, chia section sạch và khóa nền tự nhiên.",
    time: "120-240 phút",
    price: "từ 900,000đ"
  },
  {
    name: "Retwist & Palm Roll",
    desc: "Làm gọn chân locs, giữ texture thật, không ép tóc quá tay.",
    time: "90-150 phút",
    price: "từ 450,000đ"
  },
  {
    name: "Locs Styling",
    desc: "Two-strand, barrel twist, high pony, street-ready finish.",
    time: "45-90 phút",
    price: "từ 350,000đ"
  },
  {
    name: "Color Locs",
    desc: "Nhuộm highlight, muted red, blonde tips và treatment bảo vệ sợi tóc.",
    time: "180-300 phút",
    price: "từ 1,200,000đ"
  }
];

const barberServices = [
  {
    name: "Clean Fade",
    desc: "Low, mid, high fade với line up sắc và blend mượt.",
    time: "45-60 phút",
    price: "từ 220,000đ"
  },
  {
    name: "Classic Cut",
    desc: "Scissor cut, crop, textured top, shape theo style cá nhân.",
    time: "45 phút",
    price: "từ 200,000đ"
  },
  {
    name: "Beard Trim",
    desc: "Tạo form râu, clean cheek line, finish bằng balm ấm.",
    time: "25 phút",
    price: "từ 120,000đ"
  },
  {
    name: "Hot Towel Shave",
    desc: "Khăn nóng, dao cạo classic, calm finish cho da mặt.",
    time: "35 phút",
    price: "từ 180,000đ"
  }
];

const priceGroups = [
  {
    title: "Locs Services",
    rows: [
      ["Starter Locs", "Sectioning, crochet/palm roll, tư vấn chăm sóc", "từ 900,000đ"],
      ["Locs Maintenance", "Làm sạch chân, tighten, sửa locs yếu", "từ 500,000đ"],
      ["Retwist", "Palm roll, gel nhẹ, finish gọn", "từ 450,000đ"],
      ["Locs Styling", "Two-strand, barrel, bun, rope twist", "từ 350,000đ"]
    ]
  },
  {
    title: "Haircut & Fades",
    rows: [
      ["Clean Fade", "Low/mid/high fade, line up", "từ 220,000đ"],
      ["Classic Cut", "Crop, taper, texture cut", "từ 200,000đ"],
      ["Line Up", "Viền tóc, mai, gáy", "từ 90,000đ"]
    ]
  },
  {
    title: "Beard & Shaving",
    rows: [
      ["Beard Trim", "Shape râu, balm finish", "từ 120,000đ"],
      ["Hot Towel Shave", "Khăn nóng, dao cạo classic", "từ 180,000đ"]
    ]
  },
  {
    title: "Color & Treatment",
    rows: [
      ["Color Locs", "Highlight, tone, treatment bảo vệ locs", "từ 1,200,000đ"],
      ["Detox Locs", "Deep clean buildup, rinse và dry", "từ 650,000đ"],
      ["Scalp Treatment", "Làm dịu da đầu, cân bằng dầu", "từ 250,000đ"]
    ]
  },
  {
    title: "Combo Packages",
    rows: [
      ["Dread & Fade Combo", "Retwist + clean fade + line up", "từ 650,000đ"],
      ["Full Street Reset", "Detox + retwist + style + fade", "từ 1,350,000đ"]
    ]
  }
];

const barbers = [
  {
    name: "Kai Loc",
    role: "Locs Expert",
    spec: "Locs",
    years: "8 năm",
    bio: "Chuyên starter locs, retwist và repair cho chất tóc khô, dày, tự nhiên.",
    style: "Natural roots, raw texture, clean sectioning"
  },
  {
    name: "Minh Fade",
    role: "Fade Specialist",
    spec: "Fade",
    years: "6 năm",
    bio: "Tay kéo gọn, fade mượt, hợp streetwear và form mặt châu Á.",
    style: "Low fade, burst fade, sharp line up"
  },
  {
    name: "Ryo Beard",
    role: "Beard & Shave",
    spec: "Beard",
    years: "7 năm",
    bio: "Classic barber rituals, hot towel, beard shape và finish premium.",
    style: "Tapered beard, calm shave, old-school finish"
  }
];

const galleryItems = [
  { label: "Starter locs", cat: "Locs", img: "/images/hero-dreadlocks-v2.png" },
  { label: "High-top fade", cat: "Barber", img: "/images/barber-portrait-v2.png" },
  { label: "Locs care set", cat: "Products", img: "/images/locs-products-v2.png" },
  { label: "Shop mood", cat: "Behind", img: "/images/barbershop-interior-v2.png" },
  { label: "Color locs", cat: "Locs", img: "/images/hero-dreadlocks-v2.png" },
  { label: "Clipper detail", cat: "Behind", img: "/images/barbershop-interior-v2.png" },
  { label: "Beard care", cat: "Products", img: "/images/locs-products-v2.png" },
  { label: "Crew portrait", cat: "Barber", img: "/images/barber-portrait-v2.png" }
];

const homeGalleryImages: Record<HomeGalleryTab, string[]> = {
  "DREAD LOCK": [
    "/images/gallery/dreadlock1.png",
    "/images/gallery/dreadlock2.png",
    "/images/gallery/dreadlock3.png",
    "/images/gallery/dreadlock4.png",
    "/images/gallery/dreadlock5.png",
    "/images/gallery/dreadlock6.png"
  ],
  Braid: [
    "/images/gallery/braided1.png",
    "/images/gallery/braided2.png",
    "/images/gallery/braided3.png",
    "/images/gallery/braided4.png",
    "/images/gallery/braided5.png",
    "/images/gallery/braided6.png"
  ],
  Other: [
    "/images/gallery/dreadlock2.png",
    "/images/gallery/braided1.png",
    "/images/gallery/dreadlock4.png",
    "/images/gallery/braided4.png",
    "/images/gallery/dreadlock6.png",
    "/images/gallery/braided6.png"
  ]
};

const products = [
  {
    name: "Root Oil No.04",
    cat: "Locs Care",
    price: "280,000đ",
    img: "/images/locs-products-v2.png",
    desc: "Oil nhẹ cho da đầu và chân locs, hương gỗ trầm ấm.",
    benefits: "Jojoba, castor, tea tree. Giảm khô, giữ locs mềm, không bết.",
    usage: "Nhỏ 3-5 giọt lên da đầu, massage nhẹ 2-3 lần mỗi tuần."
  },
  {
    name: "Matte Loc Wax",
    cat: "Styling",
    price: "240,000đ",
    img: "/images/locs-products-v2.png",
    desc: "Wax giữ nếp nhẹ cho style locs mà không bóng giả.",
    benefits: "Shea butter, beeswax, clay. Giữ form và giảm frizz.",
    usage: "Lấy lượng nhỏ, làm ấm trong lòng bàn tay rồi vuốt lên locs."
  },
  {
    name: "Beard Street Balm",
    cat: "Beard Care",
    price: "220,000đ",
    img: "/images/locs-products-v2.png",
    desc: "Balm làm mềm râu, giữ form gọn sau khi trim.",
    benefits: "Argan, cedar, vitamin E. Làm mềm và tạo mùi ấm trầm.",
    usage: "Dùng sau tắm hoặc sau trim, chải đều vào beard."
  },
  {
    name: "WINDREAD Tee",
    cat: "Merch",
    price: "390,000đ",
    img: "/images/locs-products-v2.png",
    desc: "Áo black heavyweight fit rộng, chất street club.",
    benefits: "Cotton dày, print muted red, form oversize.",
    usage: "Mặc mỗi ngày, giặt mặt trái với nước lạnh."
  }
];

function SocialIcon({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="social-icon" aria-label={label} title={label}>
      {icon}
    </span>
  );
}

const pageRoutes: Record<string, PageKey> = {
  "/": "home",
  "/about": "about",
  "/services": "services",
  "/gallery": "gallery",
  "/shop": "shop",
  "/barbers": "barbers",
  "/pricing": "pricing",
  "/news": "news",
  "/booking": "booking",
  "/contact": "contact"
};

const pageEyebrows: Record<PageKey, { vi: string; en: string }> = {
  home: { vi: "Street Art For Your Hair", en: "Street Art For Your Hair" },
  about: { vi: "Từ đường phố, cho đường phố.", en: "From the street, for the street." },
  services: { vi: "Dread, braid & barber.", en: "Dread, braid & barber." },
  gallery: { vi: "Nhìn chất tóc, không chỉ nhìn ảnh.", en: "Texture first, not just photos." },
  shop: { vi: "Chăm tóc sau khi rời ghế.", en: "Care after the chair." },
  barbers: { vi: "The Crew", en: "The Crew" },
  pricing: { vi: "Giá rõ trước khi làm.", en: "Clear prices before the chair." },
  news: { vi: "Tin mới từ WINDREAD", en: "Latest from WINDREAD" },
  booking: { vi: "Đặt lịch giữ ghế.", en: "Book the chair." },
  contact: { vi: "Ghé WINDREAD.", en: "Pull up to WINDREAD." }
};

function routeForPage(pathname: string | null): PageKey {
  return pageRoutes[pathname ?? "/"] ?? "home";
}

export function SitePage({ page }: { page?: PageKey }) {
  const pathname = usePathname();
  const currentPage = page ?? routeForPage(pathname);
  const [language, setLanguage] = useState<Lang>("vi");
  const [galleryFilter, setGalleryFilter] = useState("All");
  const [barberFilter, setBarberFilter] = useState("All");
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [homeGalleryTab, setHomeGalleryTab] = useState<HomeGalleryTab>("DREAD LOCK");
  const [homeGalleryVisibleTab, setHomeGalleryVisibleTab] = useState<HomeGalleryTab>("DREAD LOCK");
  const [homeGalleryChanging, setHomeGalleryChanging] = useState(false);
  const isEnglish = language === "en";

  const visibleGallery = useMemo(
    () =>
      galleryFilter === "All"
        ? galleryItems
        : galleryItems.filter((item) => item.cat === galleryFilter),
    [galleryFilter]
  );

  const visibleBarbers = useMemo(
    () =>
      barberFilter === "All"
        ? barbers
        : barbers.filter((barber) => barber.spec === barberFilter),
    [barberFilter]
  );

  useEffect(() => {
    document.documentElement.classList.add("reveal-ready");
    const revealItems = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.14 }
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("reveal-ready");
    };
  }, []);

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem("windread-language");
    if (storedLanguage === "vi" || storedLanguage === "en") setLanguage(storedLanguage);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem("windread-language", language);
  }, [language]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen && !lightboxOpen) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setLightboxOpen(false);
      }

      if (!lightboxOpen || visibleGallery.length === 0) return;
      if (event.key === "ArrowLeft") {
        setSelectedImage((index) => (index === 0 ? visibleGallery.length - 1 : index - 1));
      }
      if (event.key === "ArrowRight") {
        setSelectedImage((index) => (index + 1) % visibleGallery.length);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, menuOpen, visibleGallery.length]);

  function handleBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    form.classList.add("submitted");
  }

  function openLightbox(index: number) {
    setSelectedImage(index);
    setLightboxOpen(true);
  }

  function changeHomeGalleryTab(tab: HomeGalleryTab) {
    if (tab === homeGalleryTab || homeGalleryChanging) return;
    setHomeGalleryTab(tab);
    setHomeGalleryChanging(true);
    window.setTimeout(() => {
      setHomeGalleryVisibleTab(tab);
      window.setTimeout(() => setHomeGalleryChanging(false), 90);
    }, 130);
  }

  const currentLightboxItem = visibleGallery[selectedImage] ?? visibleGallery[0];
  const activeHomeGallery = homeGalleryImages[homeGalleryVisibleTab];
  const displayedLocServices = isEnglish
    ? [
      { name: "Starter Locs", desc: "Consultation, clean sectioning and a natural loc foundation.", time: "120-240 min", price: "from 900,000đ" },
      { name: "Retwist & Palm Roll", desc: "Clean roots, controlled frizz and real texture without overworking the hair.", time: "90-150 min", price: "from 450,000đ" },
      { name: "Locs Styling", desc: "Two-strand, barrel twist, high pony and street-ready finish.", time: "45-90 min", price: "from 350,000đ" },
      { name: "Color Locs", desc: "Highlights, muted red, blonde tips and treatment to protect the strand.", time: "180-300 min", price: "from 1,200,000đ" }
    ]
    : locServices;
  const displayedBarberServices = isEnglish
    ? [
      { name: "Clean Fade", desc: "Low, mid or high fade with sharp line up and smooth blend.", time: "45-60 min", price: "from 220,000đ" },
      { name: "Classic Cut", desc: "Scissor cut, crop, textured top and shape built around your style.", time: "45 min", price: "from 200,000đ" },
      { name: "Beard Trim", desc: "Beard shape, clean cheek line and warm balm finish.", time: "25 min", price: "from 120,000đ" },
      { name: "Hot Towel Shave", desc: "Hot towel, classic razor and calm finish for the skin.", time: "35 min", price: "from 180,000đ" }
    ]
    : barberServices;

  const showHome = currentPage === "home";
  const showAbout = currentPage === "about";
  const showServices = currentPage === "services";
  const showGallery = currentPage === "gallery";
  const showShop = currentPage === "shop";
  const showBarbers = currentPage === "barbers";
  const showPricing = currentPage === "pricing";
  const showNews = currentPage === "news";
  const showBooking = currentPage === "booking";
  const showContact = currentPage === "contact";

  return (
    <main id="main-content">
      <header className="site-nav" aria-label="Dieu huong chinh">
        <a className="nav-brand" href="/" aria-label="WINDREAD home">
          <Image
            src="/images/windread-logo.png"
            alt=""
            width={265}
            height={81}
            priority
            className="nav-logo"
          />
          <span className="sr-only">WINDREAD</span>
        </a>
        <nav className={`nav-links ${menuOpen ? "is-open" : ""}`} aria-label="Section links">
          {navItems.map((item) => (
            <a
              key={item.key}
              className={currentPage === item.key ? "active" : ""}
              href={item.href}
              onClick={() => setMenuOpen(false)}
            >
              {isEnglish ? item.en : item.vi}
            </a>
          ))}
          <a className="nav-book-link" href="/booking" onClick={() => setMenuOpen(false)}>
            {isEnglish ? "Book Now" : "Đặt lịch"}
          </a>
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
          <button
            className="language-toggle"
            type="button"
            aria-label={isEnglish ? "Switch to Vietnamese" : "Chuyển sang tiếng Anh"}
            onClick={() => setLanguage((value) => (value === "vi" ? "en" : "vi"))}
          >
            {isEnglish ? "VI" : "EN"}
          </button>
          <a className="book-button" href="/booking">
            {isEnglish ? "BOOK NOW" : "ĐẶT LỊCH"}
          </a>
          <div className="nav-socials" aria-label="Mang xa hoi">
            {socialLinks.map((link) => (
              <a key={link.label} href={link.href} aria-label={link.label}>
                <SocialIcon icon={link.icon} label={link.label} />
              </a>
            ))}
          </div>
        </div>
      </header>

      {showHome && (
        <section id="home" className="hero section-shell">
          <div className="hero-stage">
            <div className="hero-copy reveal">
              <p className="eyebrow">{pageEyebrows.home[language]}</p>
              <h1 className="brand-title">
                <Image
                  src="/images/windread-logo.png"
                  alt="WINDREAD"
                  width={1327}
                  height={331}
                  priority
                  className="brand-logo"
                />
              </h1>
              <div className="hero-subcontent">
                <div className="hero-pole" aria-hidden="true">
                  <video
                    className="hero-pole-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    onCanPlay={(event) => {
                      event.currentTarget.muted = true;
                      event.currentTarget.play().catch(() => undefined);
                    }}
                  >
                    <source src="/loop-hero.mov" type="video/quicktime" />
                    <source src="/loop-hero-web.mp4" type="video/mp4" />
                  </video>
                </div>
                <div className="hero-subcopy">
                  <div className="hero-highlights" aria-label={isEnglish ? "Hero service highlights" : "Điểm nổi bật dịch vụ"}>
                    {heroHighlights.map((item) => (
                      <div className="hero-highlight" key={item.viTitle}>
                        <Image
                          src={item.icon}
                          alt=""
                          width={72}
                          height={72}
                          className="hero-highlight-icon"
                          aria-hidden="true"
                        />
                        <div className="hero-highlight-copy">
                          <strong>{isEnglish ? item.enTitle : item.viTitle}</strong>
                          <p>{isEnglish ? item.enDesc : item.viDesc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="hero-desc">
                    {isEnglish
                      ? "A minimalist, sharp, and disciplined space. Where raw hair texture is elevated by premium services and a street soul."
                      : "Một không gian tối giản, gọn gàng và đầy tính kỷ luật. Nơi tôn vinh chất tóc thật bằng dịch vụ cao cấp và linh hồn đường phố"}
                  </p>
                  <div className="hero-actions">
                    <a className="book-button large" href="/booking">
                      {isEnglish ? "Book Now" : "Đặt lịch"} <span aria-hidden="true">{"->"}</span>
                    </a>
                    <a className="ghost-button" href="/pricing">
                      {isEnglish ? "See pricing" : "Xem bảng giá"}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-visual reveal">
              <Image
                src="/images/hero.webp"
                alt="Không gian WINDREAD old-school street barber"
                priority
                fill
                sizes="100vw"
                className="hero-image parallax-img"
              />
            </div>
          </div>
          <div className="feature-strip reveal" aria-label="Dịch vụ nổi bật">
            {[
              ["Barber", isEnglish ? "Clean fades, sharp line up and old-school classic cuts." : "Fade gọn, line up sắc, classic cut có chất old-school.", "/images/thumb1.webp"],
              ["Dread", isEnglish ? "Starter locs, retwist and styling that keeps real texture." : "Starter locs, retwist và styling giữ texture thật, raw, real.", "/images/thumb2.webp"],
              ["Braid", isEnglish ? "Cornrow, box braid and streetwear patterns that hold." : "Cornrow, box braid và pattern streetwear gọn gàng, bền nếp.", "/images/thumb3.webp"]
            ].map(([title, text, img]) => (
              <article key={title} style={{ "--tile-image": `url(${img})` } as CSSProperties}>
                <div className="feature-title">
                  <span>{title}</span>
                </div>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {showHome && (
        <section className="signature section-shell">
          <div className="section-heading reveal">
            <p className="eyebrow">{isEnglish ? "Signature Services" : "Dịch vụ chủ lực"}</p>
            <h2>
              {isEnglish ? (
                <>
                  The services that built <span className="heading-accent">WINDREAD.</span>
                </>
              ) : (
                <>
                  Những dịch vụ làm nên <span className="heading-accent">WINDREAD.</span>
                </>
              )}
            </h2>
          </div>
          <div className="service-teaser-grid">
            {[...displayedLocServices.slice(0, 2), ...displayedBarberServices.slice(0, 2)].map((service) => (
              <a className="service-teaser reveal" href="/services" key={service.name}>
                <span>{service.time}</span>
                <h3>{service.name}</h3>
                <p>{service.desc}</p>
                <strong>{service.price}</strong>
              </a>
            ))}
          </div>
        </section>
      )}

      {showHome && (
        <section className="home-gallery section-shell">
          <div className="section-heading reveal">
            <div>
              <p className="eyebrow">{isEnglish ? "Gallery" : "Thư viện kiểu tóc"}</p>
              <h2>{isEnglish ? "Texture on the wall." : "Chất tóc riêng trên từng khung hình."}</h2>
            </div>
          </div>
          <div className="home-gallery-tabs reveal" role="tablist" aria-label="Home gallery categories">
            {(Object.keys(homeGalleryImages) as HomeGalleryTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={homeGalleryTab === tab}
                className={homeGalleryTab === tab ? "active" : ""}
                onClick={() => changeHomeGalleryTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className={`home-gallery-grid ${homeGalleryChanging ? "is-changing" : ""}`}>
            {activeHomeGallery.map((src, index) => (
              <figure className="home-gallery-tile" key={`${homeGalleryVisibleTab}-${src}-${index}`}>
                <Image
                  src={src}
                  alt={`${homeGalleryVisibleTab} ${index + 1}`}
                  fill
                  sizes="(max-width: 700px) 100vw, (max-width: 980px) 50vw, 33vw"
                />
              </figure>
            ))}
          </div>
        </section>
      )}

      {showAbout && (
        <section id="about" className="about section-shell page-view">
          <div className="about-copy reveal">
            <p className="eyebrow">{pageEyebrows.about[language]}</p>
            <h2>{isEnglish ? "About WINDREAD" : "Câu chuyện WINDREAD"}</h2>
            <p>
              {isEnglish
                ? "WINDREAD started from a love for real dreadlocks, sharp fades and late nights moving through alleyways with bass behind the shoulders. The shop blends Saigon street energy, Harajuku attitude and classic barber discipline."
                : "WINDREAD bắt đầu từ tình yêu với dreadlocks thật, những đường fade sắc và những đêm đi qua hẻm nhỏ với tiếng bass sau lưng. Tụi mình trộn năng lượng Sài Gòn, tinh thần Harajuku và kỷ luật classic barber."}
            </p>
            <p>
              {isEnglish
                ? "Locs are not a quick trend here. They are commitment. Before touching your hair, the crew checks lifestyle, texture, maintenance time and the shape you actually want. Real hair, real talk, real result."
                : "Ở đây, locs không phải trend nhanh. Đó là một cam kết. Trước khi chạm vào tóc, crew hỏi về lifestyle, chất tóc, thời gian chăm sóc và form bạn thật sự muốn. Tóc thật, tư vấn thật, kết quả thật."}
            </p>
            <div className="value-row" aria-label="Gia tri WINDREAD">
              {["Authenticity", "Craftsmanship", "Culture", "Community"].map((value) => (
                <span key={value}>{value}</span>
              ))}
            </div>
          </div>
          <div className="photo-stack reveal" aria-label="Khong gian WINDREAD">
            <Image src="/images/barbershop-interior-v2.png" alt="Ghế barber và không gian tiệm" fill sizes="(max-width: 900px) 100vw, 44vw" />
            <div className="stack-card top">Clean tools</div>
            <div className="stack-card bottom">Raw texture</div>
          </div>
        </section>
      )}

      {showServices && (
        <section id="services" className="services section-shell page-view">
          <div className="section-heading reveal">
            <p className="eyebrow">{pageEyebrows.services[language]}</p>
            <h2>{isEnglish ? "Clear services. No confusing menu." : "Dịch vụ rõ ràng. Không menu rối."}</h2>
            <p>
              {isEnglish
                ? "Choose dread work for long-term texture, braid work for tight patterns, or a clean fade to reset the whole look today."
                : "Chọn dread để xây texture dài hạn, braid để lên pattern gọn, hoặc clean fade để reset visual ngay hôm nay."}
            </p>
          </div>
          <div className="highlight-banner reveal">
            <strong>Locs Specialist</strong>
            <span>{isEnglish ? "First-timer consultation available. Book ahead so the crew can check texture and timing." : "Có tư vấn cho khách làm locs lần đầu. Đặt trước để crew check chất tóc và thời gian phù hợp."}</span>
          </div>
          <div className="services-grid">
            <ServiceColumn title="Dread" items={displayedLocServices} />
            <ServiceColumn title="Barber" items={displayedBarberServices} />
          </div>
        </section>
      )}

      {showGallery && (
        <section id="gallery" className="gallery section-shell page-view">
          <div className="section-heading reveal">
            <p className="eyebrow">{pageEyebrows.gallery[language]}</p>
            <h2>{isEnglish ? "Before, after, behind the chair." : "Trước, sau và phía sau ghế cắt."}</h2>
          </div>
          <FilterChips
            items={["All", "Locs", "Barber", "Products", "Behind"]}
            active={galleryFilter}
            onChange={setGalleryFilter}
          />
          <div className="masonry-grid">
            {visibleGallery.map((item, index) => (
              <button
                className="gallery-tile reveal"
                type="button"
                key={`${item.label}-${index}`}
                onClick={() => openLightbox(index)}
              >
                <Image src={item.img} alt={item.label} fill sizes="(max-width: 700px) 100vw, 25vw" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {showShop && (
        <section id="shop" className="shop section-shell page-view">
          <div className="section-heading reveal">
            <p className="eyebrow">{pageEyebrows.shop[language]}</p>
            <h2>{isEnglish ? "Locs care & grooming goods." : "Đồ chăm locs và grooming."}</h2>
            <p>{isEnglish ? "Care products, beard goods and merch selected for the days after you leave the chair." : "Sản phẩm chăm locs, beard và merch được chọn để dùng sau mỗi lần rời ghế."}</p>
          </div>
          <div className="shop-layout">
            <div className="product-grid">
              {products.map((product) => (
                <article
                  className={`product-card reveal ${selectedProduct.name === product.name ? "selected" : ""}`}
                  key={product.name}
                >
                  <button type="button" onClick={() => setSelectedProduct(product)}>
                    <Image src={product.img} alt={product.name} width={420} height={320} />
                    <span>{product.cat}</span>
                    <h3>{product.name}</h3>
                    <p>{product.desc}</p>
                    <strong>{product.price}</strong>
                  </button>
                  <button className="small-cta" type="button" onClick={() => setCartCount((count) => count + 1)}>
                    Add to Cart
                  </button>
                </article>
              ))}
            </div>
            <aside className="product-detail reveal" aria-label="Chi tiet san pham">
              <span className="cart-pill">Cart {cartCount}</span>
              <Image src={selectedProduct.img} alt={selectedProduct.name} width={680} height={460} />
              <p className="eyebrow">{selectedProduct.cat}</p>
              <h3>{selectedProduct.name}</h3>
              <p>{selectedProduct.desc}</p>
              <dl>
                <dt>Thanh phan / loi ich</dt>
                <dd>{selectedProduct.benefits}</dd>
                <dt>Cach dung</dt>
                <dd>{selectedProduct.usage}</dd>
              </dl>
              <button className="book-button" type="button" onClick={() => setCartCount((count) => count + 1)}>
                Buy on Shopee
              </button>
            </aside>
          </div>
        </section>
      )}

      {showBarbers && (
        <section id="barbers" className="barbers section-shell page-view">
          <div className="section-heading reveal">
            <p className="eyebrow">{pageEyebrows.barbers[language]}</p>
            <h2>{isEnglish ? "The hands that hold the shape." : "Những bàn tay giữ form."}</h2>
          </div>
          <FilterChips
            items={["All", "Locs", "Fade", "Beard"]}
            active={barberFilter}
            onChange={setBarberFilter}
          />
          <div className="barber-grid">
            {visibleBarbers.map((barber, index) => (
              <article className="barber-card reveal" key={barber.name}>
                <Image
                  src="/images/barber-portrait-v2.png"
                  alt={`${barber.name}, ${barber.role}`}
                  width={520}
                  height={620}
                  style={{ objectPosition: `${50 + index * 4}% center` }}
                />
                <div>
                  <p>{barber.role} / {barber.years}</p>
                  <h3>{barber.name}</h3>
                  <span>{barber.style}</span>
                  <p>{barber.bio}</p>
                  <a href="https://instagram.com" aria-label={`${barber.name} Instagram`}>
                    <SocialIcon icon="IG" label="Instagram" />
                  </a>
                </div>
              </article>
            ))}
          </div>
          <div className="crew-code reveal">
            <h3>The Crew Code</h3>
            <ul>
              <li>{isEnglish ? "Check hair texture first, never oversell what you do not need." : "Check chất tóc trước khi làm, không bán dịch vụ quá mức cần thiết."}</li>
              <li>{isEnglish ? "Clean tools between clients and keep every station controlled." : "Làm sạch dụng cụ giữa mỗi khách, giữ station gọn và yên tâm."}</li>
              <li>{isEnglish ? "Clear aftercare so locs stay strong and clean longer." : "Tư vấn aftercare rõ ràng để locs sống lâu, đẹp lâu."}</li>
            </ul>
          </div>
        </section>
      )}

      {showPricing && (
        <section id="pricing" className="pricing section-shell page-view">
          <div className="section-heading reveal">
            <p className="eyebrow">{pageEyebrows.pricing[language]}</p>
            <h2>{isEnglish ? "WINDREAD pricing board" : "Bảng giá WINDREAD"}</h2>
          </div>
          <div className="pricing-board reveal">
            {priceGroups.map((group) => (
              <section key={group.title} aria-labelledby={group.title.replaceAll(" ", "-")}>
                <h3 id={group.title.replaceAll(" ", "-")}>{group.title}</h3>
                <div className="price-table">
                  {group.rows.map(([name, desc, price]) => (
                    <div className="price-row" key={name}>
                      <strong>{name}</strong>
                      <span>{desc}</span>
                      <b>{price}</b>
                    </div>
                  ))}
                </div>
              </section>
            ))}
            <p className="pricing-note">
              {isEnglish
                ? "Note: Very long/thick hair, heavy loc repair, after-hours service or house calls may include an extra fee. The crew confirms pricing before starting."
                : "Lưu ý: Tóc quá dài/dày, locs cần repair nhiều, dịch vụ sau giờ hoặc house call có thể phụ thu. Crew sẽ báo giá rõ trước khi làm."}
            </p>
          </div>
        </section>
      )}

      {showNews && (
        <section id="news" className="news section-shell page-view">
          <div className="section-heading reveal">
            <p className="eyebrow">{pageEyebrows.news[language]}</p>
            <h2>{isEnglish ? "Care notes, street cuts and shop updates." : "Ghi chú chăm tóc, street cut và tin từ tiệm."}</h2>
            <p>
              {isEnglish
                ? "Short reads from the crew: how to keep locs clean, when to retwist, and what is happening inside WINDREAD."
                : "Những bài ngắn từ crew: cách giữ locs sạch, khi nào nên retwist, và những cập nhật mới trong WINDREAD."}
            </p>
          </div>
          <div className="news-grid">
            {[
              [isEnglish ? "When should you retwist?" : "Khi nào nên retwist?", isEnglish ? "A quick guide for keeping roots clean without overworking your locs." : "Hướng dẫn nhanh để chân locs gọn mà không làm tóc bị quá tải.", "/images/thumb2.webp"],
              [isEnglish ? "Fade shapes for dread styles" : "Fade nào hợp với dread?", isEnglish ? "Low, taper, burst or high fade: how each shape changes your silhouette." : "Low, taper, burst hay high fade: mỗi form sẽ đổi silhouette của bạn thế nào.", "/images/thumb1.webp"],
              [isEnglish ? "Braid care after the chair" : "Chăm braid sau khi rời ghế", isEnglish ? "How to sleep, wash and keep your pattern sharp for longer." : "Cách ngủ, gội và giữ pattern sắc lâu hơn sau khi braid.", "/images/thumb3.webp"]
            ].map(([title, text, img]) => (
              <article className="news-card reveal" key={title}>
                <Image src={img} alt="" width={520} height={346} />
                <span>{isEnglish ? "WINDREAD Journal" : "Nhật ký WINDREAD"}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {showBooking && (
        <section id="booking" className="booking section-shell page-view">
          <div className="booking-copy reveal">
            <p className="eyebrow">{pageEyebrows.booking[language]}</p>
            <h2>{isEnglish ? "Book ahead. Sit down with the right vibe." : "Đặt trước. Vào ghế đúng vibe."}</h2>
            <p>
              {isEnglish
                ? "Send basic details so the crew can arrange timing, barber and slot length. Deposit keeps your chair during peak hours."
                : "Gửi thông tin cơ bản để crew sắp xếp thời gian, barber và độ dài slot phù hợp. Đặt cọc giúp giữ ghế trong khung giờ cao điểm."}
            </p>
            <div className="booking-rules">
              <span>{isEnglish ? "Deposit: 30%" : "Đặt cọc: 30%"}</span>
              <span>{isEnglish ? "Over 15 minutes late may need a new slot" : "Trễ hơn 15 phút có thể cần đổi slot"}</span>
              <span>{isEnglish ? "Reschedule at least 12 hours ahead" : "Đổi lịch trước ít nhất 12 giờ"}</span>
            </div>
          </div>
          <form className="booking-form reveal" onSubmit={handleBooking}>
            <label>
              <span>{isEnglish ? "1. Choose service" : "1. Chọn dịch vụ"}</span>
              <select required defaultValue="">
                <option value="" disabled>{isEnglish ? "Choose service" : "Chọn service"}</option>
                {[...displayedLocServices, ...displayedBarberServices].map((service) => (
                  <option key={service.name}>{service.name}</option>
                ))}
              </select>
            </label>
            <label>
              <span>{isEnglish ? "2. Choose barber" : "2. Chọn barber"}</span>
              <select defaultValue="Any crew">
                <option>Any crew</option>
                {barbers.map((barber) => (
                  <option key={barber.name}>{barber.name}</option>
                ))}
              </select>
            </label>
            <div className="field-pair">
              <label>
                <span>{isEnglish ? "3. Date" : "3. Ngày"}</span>
                <input type="date" required />
              </label>
              <label>
                <span>Time slot</span>
                <select required defaultValue="">
                  <option value="" disabled>{isEnglish ? "Choose time" : "Chọn giờ"}</option>
                  {["10:00", "12:00", "14:00", "16:00", "19:00"].map((slot) => (
                    <option key={slot}>{slot}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="field-pair">
              <label>
                <span>{isEnglish ? "Name" : "Tên"}</span>
                <input type="text" required placeholder={isEnglish ? "Your name" : "Tên của bạn"} />
              </label>
              <label>
                <span>Phone</span>
                <input type="tel" required placeholder="0393549656" />
              </label>
            </div>
            <div className="field-pair">
              <label>
                <span>Email</span>
                <input type="email" placeholder="you@email.com" />
              </label>
              <label>
                <span>Social handle</span>
                <input type="text" placeholder="@instagram" />
              </label>
            </div>
            <div className="field-pair">
              <label>
                <span>Location</span>
                <select>
                  <option>35 - 37 An Thượng 29, Ngũ Hành Sơn, Đà Nẵng</option>
                  <option>223 Chương Dương, Ngũ Hành Sơn, Đà Nẵng</option>
                </select>
              </label>
              <label>
                <span>Method</span>
                <select>
                  <option>In-shop</option>
                  <option>House call</option>
                </select>
              </label>
            </div>
            <label>
              <span>{isEnglish ? "Describe the hair you want" : "Mô tả kiểu tóc bạn muốn"}</span>
              <textarea rows={4} placeholder={isEnglish ? "Send reference images via IG/Zalo if you have them." : "Gửi ảnh reference qua IG/Zalo nếu có."} />
            </label>
            <button className="book-button large" type="submit">
              {isEnglish ? "Send booking request" : "Gửi yêu cầu đặt lịch"}
            </button>
            <p className="success-message">{isEnglish ? "Request received. The crew will contact you to confirm as soon as possible." : "Đã nhận thông tin. Crew sẽ liên hệ xác nhận lịch sớm nhất."}</p>
            <div className="alt-booking">
              <a href="https://wa.me/">WhatsApp</a>
              <a href="https://zalo.me/">Zalo</a>
              <a href="https://instagram.com">Instagram DM</a>
            </div>
          </form>
        </section>
      )}

      {showContact && (
        <section id="contact" className="contact section-shell page-view">
          <div className="section-heading reveal">
            <p className="eyebrow">{pageEyebrows.contact[language]}</p>
            <h2>{isEnglish ? "The WINDREAD chair is on." : "Ghế WINDREAD đang sáng đèn."}</h2>
          </div>
          <div className="contact-grid">
            <div className="map-card reveal" aria-label="Ban do WINDREAD">
              <span className="map-pin">W</span>
              <p>{isEnglish ? "Ngu Hanh Son / Da Nang" : "Ngũ Hành Sơn / Đà Nẵng"}</p>
            </div>
            <div className="contact-cards">
              {[
                [isEnglish ? "Address 1" : "Địa chỉ 1", "35 - 37 An Thượng 29, Ngũ Hành Sơn, Đà Nẵng"],
                [isEnglish ? "Address 2" : "Địa chỉ 2", "223 Chương Dương, Ngũ Hành Sơn, Đà Nẵng"],
                [isEnglish ? "Opening hours" : "Giờ mở cửa", "Mon-Sat 10:00-21:00 / Sun 12:00-18:00"],
                [isEnglish ? "Phone" : "Điện thoại", "0393549656 (Zalo / WhatsApp)"]
              ].map(([title, text]) => (
                <article className="info-card reveal" key={title}>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
              <a className="book-button" href="/booking">
                {isEnglish ? "Book Now" : "Đặt lịch"}
              </a>
            </div>
          </div>
        </section>
      )}

      <footer className="site-footer">
        <div className="torn-divider" aria-hidden="true" />
        <div className="footer-content">
          <div className="footer-brand">
            <Image
              src="/images/windread-logo.png"
              alt="Win Dread Locs Barber Club"
              width={1327}
              height={404}
              className="footer-logo"
            />
            <div className="footer-contact">
              <span>35 - 37 An Thượng 29, Ngũ Hành Sơn, Đà Nẵng</span>
              <span>223 Chương Dương, Ngũ Hành Sơn, Đà Nẵng</span>
              <a href="tel:0393549656">0393549656 (Zalo / WhatsApp)</a>
            </div>
            <div className="footer-brand-follow">
              <h2>{isEnglish ? "Follow Us" : "Theo dõi"}</h2>
              <div className="footer-socials">
                {socialLinks.map((link) => (
                  <a key={link.label} href={link.href} aria-label={link.label}>
                    <SocialIcon icon={link.icon} label={link.label} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <nav className="footer-links" aria-label={isEnglish ? "Footer quick links" : "Liên kết footer"}>
            <h2>{isEnglish ? "Quick Links" : "Liên kết nhanh"}</h2>
            <a href="/">{isEnglish ? "Home" : "Trang chủ"}</a>
            <a href="/about">{isEnglish ? "About" : "Giới thiệu"}</a>
            <a href="/services">{isEnglish ? "Services" : "Dịch vụ"}</a>
            <a href="/gallery">{isEnglish ? "Gallery" : "Thư viện"}</a>
            <a href="/contact">{isEnglish ? "Contact" : "Liên hệ"}</a>
          </nav>
        </div>

        <div className="footer-media" aria-hidden="true">
          <Image
            src="/images/footerbg.png"
            alt=""
            width={1038}
            height={400}
            className="footer-image"
          />
        </div>
        <p className="footer-copyright">
          © 2025 Win Dread Locs & Barber Club. All Rights Reserved
        </p>
      </footer>

      {lightboxOpen && currentLightboxItem && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Gallery viewer">
          <button className="lightbox-close" type="button" onClick={() => setLightboxOpen(false)}>
            Close
          </button>
          <button
            className="lightbox-nav prev"
            type="button"
            aria-label="Anh truoc"
            onClick={() => setSelectedImage((index) => (index === 0 ? visibleGallery.length - 1 : index - 1))}
          >
            ‹
          </button>
          <Image src={currentLightboxItem.img} alt={currentLightboxItem.label} width={1100} height={760} />
          <p>{currentLightboxItem.label}</p>
          <button
            className="lightbox-nav next"
            type="button"
            aria-label="Anh tiep"
            onClick={() => setSelectedImage((index) => (index + 1) % visibleGallery.length)}
          >
            ›
          </button>
        </div>
      )}
    </main>
  );
}

function ServiceColumn({
  title,
  items
}: {
  title: string;
  items: { name: string; desc: string; time: string; price: string }[];
}) {
  return (
    <article className="service-column reveal">
      <h3>{title}</h3>
      {items.map((item) => (
        <div className="service-row" key={item.name}>
          <div>
            <h4>{item.name}</h4>
            <p>{item.desc}</p>
          </div>
          <div>
            <span>{item.time}</span>
            <a href="/pricing">{item.price}</a>
          </div>
        </div>
      ))}
    </article>
  );
}

function FilterChips({
  items,
  active,
  onChange
}: {
  items: string[];
  active: string;
  onChange: (item: string) => void;
}) {
  return (
    <div className="filter-chips reveal" role="tablist" aria-label="Bo loc">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          className={active === item ? "active" : ""}
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  return <SitePage page="home" />;
}
