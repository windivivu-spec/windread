import Image from "next/image";
import { notFound } from "next/navigation";
import { barbers } from "../../booking/mockBookingData";
import { buildMetadata } from "../../seo";
import { branchProfiles, findBranchProfile } from "../branchData";
import { SiteHeader } from "../../components/SiteHeader";

export function generateStaticParams() {
  return branchProfiles.map((branch) => ({ branchId: branch.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ branchId: string }> }) {
  const { branchId } = await params;
  const branch = findBranchProfile(branchId);
  if (!branch) return {};

  return buildMetadata({
    title: `${branch.name} | WINDREAD`,
    description: `${branch.address}. ${branch.description.vi}`,
    path: `/branches/${branch.id}`,
    image: branch.image
  });
}

export default async function BranchDetailPage({ params }: { params: Promise<{ branchId: string }> }) {
  const { branchId } = await params;
  const branch = findBranchProfile(branchId);
  if (!branch) notFound();

  const branchBarbers = barbers.filter((barber) => branch.barberIds.includes(barber.id));
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(branch.mapQuery)}&output=embed`;

  return (
    <main id="main-content" className="branch-page">
      <SiteHeader />

      <section className="branch-hero">
        <div className="branch-hero-image">
          <Image src={branch.image} alt={`Không gian ${branch.name}`} fill priority sizes="100vw" />
        </div>
        <div className="branch-hero-overlay" />
        <div className="branch-hero-copy">
          <p>{branch.label.vi}</p>
          <h1>{branch.name}</h1>
          <span>{branch.address}</span>
          <div className="branch-hero-actions">
            <a className="book-button large" href={`/booking?branch=${branch.id}`}>
              Đặt lịch tại chi nhánh
            </a>
            <a className="ghost-button" href={`tel:${branch.phone}`}>
              {branch.phone}
            </a>
          </div>
        </div>
      </section>

      <section className="branch-intro section-shell">
        <div>
          <h2>Đúng không gian cho đúng style.</h2>
          <p>{branch.description.vi}</p>
        </div>
        <div className="branch-specialties" aria-label="Dịch vụ chuyên">
          <span>Dịch vụ chuyên</span>
          <div>
            {branch.specialties.vi.map((specialty) => <strong key={specialty}>{specialty}</strong>)}
          </div>
        </div>
      </section>

      <section className="branch-visuals section-shell" aria-label={`Hình ảnh ${branch.name}`}>
        {branch.gallery.map((image, index) => (
          <figure className={`branch-visual branch-visual-${index + 1}`} key={image.src}>
            <Image
              src={image.src}
              alt=""
              width={image.width}
              height={image.height}
              sizes={index === 0 ? "100vw" : "(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"}
            />
          </figure>
        ))}
      </section>

      <section className="branch-location section-shell">
        <div className="branch-location-copy">
          <div>
            <h2>Ghé đúng chỗ.</h2>
            <address>{branch.address}</address>
          </div>
          <a className="ghost-button" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.mapQuery)}`} target="_blank" rel="noreferrer">
            Mở Google Maps
          </a>
        </div>
        <div className="branch-map-frame">
          <iframe title={`Bản đồ ${branch.name}`} src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </section>

      <section className="branch-crew section-shell">
        <h2>Barber tại {branch.label.vi.toLowerCase()}.</h2>
        <div className="branch-crew-grid">
          {branchBarbers.map((barber) => (
            <article className="branch-crew-card" key={barber.id}>
              <div className="branch-crew-photo">
                <Image src={barber.avatar} alt={`${barber.name}, ${barber.title}`} fill sizes="(max-width: 760px) 50vw, 22vw" />
              </div>
              <div>
                <h3>{barber.name}</h3>
                <p>{barber.title}</p>
              </div>
              <a href={barber.id === "win-dread" ? `tel:${branch.phone}` : `/booking?barber=${barber.id}`}>
                {barber.id === "win-dread" ? "Liên hệ đặt lịch" : `Đặt với ${barber.name}`}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="branch-final-cta section-shell">
        <div>
          <h2>Chọn giờ, crew lo phần còn lại.</h2>
          <p>Đặt lịch để giữ ghế tại {branch.name}.</p>
        </div>
        <a className="book-button large" href={`/booking?branch=${branch.id}`}>
          Đặt lịch ngay
        </a>
      </section>

      <footer className="site-footer branch-site-footer">
        <div className="torn-divider" aria-hidden="true" />
        <div className="footer-content">
          <div className="footer-brand">
            <Image src="/images/windread-logo.png" alt="WINDREAD" width={1327} height={404} className="footer-logo" />
            <div className="footer-contact">
              <span>35 - 37 An Thượng 29, Ngũ Hành Sơn, Đà Nẵng</span>
              <span>223 Chương Dương, Ngũ Hành Sơn, Đà Nẵng</span>
              <a href="tel:0393549656">0393549656 (Zalo / WhatsApp)</a>
            </div>
          </div>
          <div className="footer-nav-groups">
            <nav className="footer-links" aria-label="Dịch vụ trọng tâm">
              <h2>Dịch vụ chính</h2>
              <a href="/dreadlock-da-nang">Dreadlock Đà Nẵng</a>
              <a href="/braids-da-nang">Braid & Tết Tóc Đà Nẵng</a>
              <a href="/cornrows-da-nang">Cornrows Đà Nẵng</a>
              <a href="/box-braids-da-nang">Box Braids Đà Nẵng</a>
            </nav>

            <nav className="footer-links" aria-label="Liên kết nhanh">
              <h2>Liên kết nhanh</h2>
              <a href="/">Trang chủ</a>
              <a href="/about">Giới thiệu</a>
              <a href="/pricing">Bảng giá</a>
              <a href="/news">Tin tức</a>
              <a href="/booking">Đặt lịch</a>
            </nav>
          </div>
        </div>
        <div className="footer-media" aria-hidden="true">
          <Image src="/images/footerbg.webp" alt="WINDREAD Barbershop Studio Đà Nẵng" width={1676} height={918} className="footer-image" />
        </div>
        <p className="footer-copyright">© 2025 Win Dread Locs & Barber Club. All Rights Reserved</p>
      </footer>
    </main>
  );
}
