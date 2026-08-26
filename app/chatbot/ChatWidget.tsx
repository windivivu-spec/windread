"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./ChatWidget.module.css";

const zaloUrl = "https://zalo.me/0393549656";
const whatsappUrl = "https://wa.me/84393549656";

export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  return (
    <aside className={styles.root} aria-label="Liên hệ WINDREAD">
      {open ? (
        <div className={styles.contactMenu} aria-label="Các kênh liên hệ">
          <a className={`${styles.contactOption} ${styles.zalo}`} href={zaloUrl} target="_blank" rel="noreferrer">
            <span className={styles.contactIcon} aria-hidden="true">Z</span>
            <span className={styles.contactCopy}>
              <strong>Zalo</strong>
              <small>0393 549 656</small>
            </span>
          </a>
          <a className={`${styles.contactOption} ${styles.whatsapp}`} href={whatsappUrl} target="_blank" rel="noreferrer">
            <span className={styles.contactIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M9.2 7.9c.2-.5.5-.5.8-.5h.4c.2 0 .4.1.5.4l.7 1.8c.1.3.1.5-.1.7l-.5.6c.5 1 1.2 1.7 2.2 2.2l.6-.5c.2-.2.4-.2.7-.1l1.8.7c.3.1.4.3.4.5v.4c0 .3 0 .6-.5.8-.4.2-1 .3-1.6.1-1-.3-2.2-1.1-3.3-2.2-1.1-1.1-1.9-2.3-2.2-3.3-.2-.6-.1-1.2.1-1.6Z" fill="currentColor" />
              </svg>
            </span>
            <span className={styles.contactCopy}>
              <strong>WhatsApp</strong>
              <small>0393 549 656</small>
            </span>
          </a>
        </div>
      ) : null}

      <button
        type="button"
        className={`${styles.launcher} ${open ? styles.launcherOpen : ""}`}
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={open ? "Đóng các kênh liên hệ" : "Mở các kênh liên hệ"}
      >
        {open ? (
          <span aria-hidden="true">×</span>
        ) : (
          <Image src="/images/windread-mark.png" width={34} height={34} alt="" />
        )}
      </button>
    </aside>
  );
}
