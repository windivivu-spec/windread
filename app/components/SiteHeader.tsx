"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { key: "home", href: "/", vi: "Trang chủ", en: "Home" },
  { key: "about", href: "/about", vi: "Giới thiệu", en: "About" },
  { key: "barbers", href: "/barbers", vi: "Barber", en: "Barbers" },
  { key: "pricing", href: "/pricing", vi: "Bảng giá", en: "Pricing" },
  { key: "news", href: "/news", vi: "Tin tức", en: "News" }
] as const;

const socialLinks = [
  { label: "Instagram", icon: "IG", href: "https://www.instagram.com/windread.locs_barber.club" },
  { label: "Facebook", icon: "FB", href: "https://www.facebook.com/profile.php?id=61583308184992" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState<"vi" | "en">("vi");
  const isEnglish = language === "en";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="site-nav" aria-label="Điều hướng chính">
      <Link className="nav-brand" href="/" aria-label="WINDREAD home" onClick={() => setMenuOpen(false)}>
        <Image
          src="/logo-white.png"
          alt="WINDREAD Barber & Locs Club"
          width={2000}
          height={735}
          priority
          className="nav-logo"
        />
        <span className="sr-only">WINDREAD</span>
      </Link>
      <nav className={`nav-links ${menuOpen ? "is-open" : ""}`} aria-label="Section links">
        {navItems.map((item) => (
          <Link
            key={item.key}
            className={isActive(item.href) ? "active" : ""}
            href={item.href}
            onClick={() => setMenuOpen(false)}
          >
            {isEnglish ? item.en : item.vi}
          </Link>
        ))}
        <Link className="nav-book-link" href="/booking" onClick={() => setMenuOpen(false)}>
          {isEnglish ? "Book Now" : "Đặt lịch"}
        </Link>
      </nav>
      <div className="nav-actions">
        <button
          className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
          type="button"
          aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
        <button
          className="language-toggle"
          type="button"
          aria-label={isEnglish ? "Switch to Vietnamese" : "Chuyển sang tiếng Anh"}
          onClick={() => setLanguage((v) => (v === "vi" ? "en" : "vi"))}
        >
          {isEnglish ? "VI" : "EN"}
        </button>
        <Link className="book-button" href="/booking">
          {isEnglish ? "BOOK NOW" : "ĐẶT LỊCH"}
        </Link>
        <div className="nav-socials" aria-label="Mạng xã hội">
          {socialLinks.map((link) => (
            <a key={link.label} href={link.href} aria-label={link.label} target="_blank" rel="noopener noreferrer">
              <span className="social-icon" aria-label={link.label} title={link.label}>
                {link.icon}
              </span>
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
