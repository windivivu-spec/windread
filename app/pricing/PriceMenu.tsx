import { formatCurrency } from "../booking/availabilityUtils";
import { getLocalizedPriceLabel, getLocalizedService, type ServiceDisplayGroup } from "../booking/servicePresentation";
import type { Service } from "../booking/types";
import styles from "./PriceMenu.module.css";

const comparisonPairs = [
  ["cd-haircut", "cd-haircut-expert"],
  ["cd-fresh-cut", "cd-priority-fresh-cut"],
  ["cd-gentlemans-set", "cd-priority-gentlemans-set"],
  ["cd-full-grooming", "cd-priority-full-grooming"]
] as const;

function bookingHref(service: Service) {
  return `/booking?branch=${encodeURIComponent(service.branchId)}&service=${encodeURIComponent(service.id)}`;
}

export function PriceMenu({ sections, isEnglish, compareBarberPrices }: {
  sections: ServiceDisplayGroup[];
  isEnglish: boolean;
  compareBarberPrices: boolean;
}) {
  const allServices = sections.flatMap((section) => section.services);
  const price = (service: Service) => getLocalizedPriceLabel(service, isEnglish) || formatCurrency(service.price, isEnglish);
  const pairs = compareBarberPrices ? comparisonPairs.map(([walkInId, priorityId]) => ({
    id: walkInId,
    walkIn: allServices.find((service) => service.id === walkInId),
    priority: allServices.find((service) => service.id === priorityId)
  })).filter((pair) => pair.walkIn && pair.priority) : [];
  const haircut = pairs.find((pair) => pair.id === "cd-haircut");
  const combos = pairs.filter((pair) => pair.id !== "cd-haircut");
  const pairedIds = new Set(pairs.flatMap((pair) => [pair.walkIn?.id, pair.priority?.id]).filter(Boolean));
  const remainingSections = sections.map((section) => ({
    ...section,
    services: section.services.filter((service) => !pairedIds.has(service.id))
  })).filter((section) => section.services.length > 0);
  let sectionNumber = 0;
  const heading = (label: string) => (
    <h5 className={styles.heading}><span>{String(++sectionNumber).padStart(2, "0")}</span><span aria-hidden="true">—</span>{label}</h5>
  );

  function renderRate(service: Service, priority: boolean) {
    const content = <><span>{priority ? "Appointment" : "Walk-in"}</span><b>{price(service)}</b>{priority && service.isBookable !== false && <span className={styles.arrow} aria-hidden="true">↗</span>}</>;
    return priority && service.isBookable !== false
      ? <a className={`${styles.rate} ${styles.priorityRate}`} href={bookingHref(service)}>{content}<span className="sr-only">{isEnglish ? `Book ${service.name}` : `Đặt lịch ${service.name}`}</span></a>
      : <div className={styles.rate}>{content}</div>;
  }

  return <div className={styles.menu}>
    {haircut && <section className={styles.section}>
      {heading("Haircut")}
      <div className={styles.haircutGrid}>
        {([haircut.walkIn, haircut.priority] as const).map((service, index) => {
          if (!service) return null;
          const priority = index === 1;
          const content = <>
            <span className={styles.cardLabel}>{priority ? "Priority appointment" : "Walk-in"}</span>
            <b className={styles.cardPrice}>{price(service)}</b>
            <strong className={styles.cardBenefit}>{priority ? (isEnglish ? "Choose your barber and time" : "Chọn barber và giờ") : (isEnglish ? "No appointment needed" : "Không cần đặt lịch")}</strong>
            <p>{priority ? (isEnglish ? "A reserved appointment with priority service at your chosen time." : "Giữ lịch riêng, ưu tiên phục vụ đúng giờ.") : (isEnglish ? "Service is subject to barber availability and waiting time." : "Phục vụ theo tình trạng thợ và thời gian chờ.")}</p>
            {priority && service.isBookable !== false && <span className={styles.cardCta}>{isEnglish ? "Book appointment" : "Đặt lịch trước"}<span aria-hidden="true">↗</span></span>}
          </>;
          return priority && service.isBookable !== false
            ? <a className={`${styles.haircutCard} ${styles.priorityCard}`} href={bookingHref(service)} key={service.id}>{content}</a>
            : <article className={styles.haircutCard} key={service.id}>{content}</article>;
        })}
      </div>
    </section>}

    {combos.length > 0 && <section className={styles.section}>
      {heading("Combo services")}
      <div className={styles.comboGrid}>
        {combos.map((pair) => {
          const service = pair.walkIn ?? pair.priority!;
          const localized = getLocalizedService(service, isEnglish);
          return <article className={styles.combo} key={pair.id}>
            <div className={styles.itemHeading}><h6>{localized.name.replace(/^Priority\s+/i, "")}</h6><span>{service.durationMinutes} {isEnglish ? "min" : "phút"}</span></div>
            <p className={styles.description}>{localized.description.split(".")[0]}</p>
            <div className={styles.rates}>{pair.walkIn && renderRate(pair.walkIn, false)}{pair.priority && renderRate(pair.priority, true)}</div>
          </article>;
        })}
      </div>
    </section>}

    {remainingSections.map((section) => <section className="pricing-subgroup" key={section.id}>
      <h5>{section.label}</h5>
      <div className="price-table">
        {section.services.map((service) => {
          const localized = getLocalizedService(service, isEnglish);
          const content = <>
            <div className="price-row-copy">
              <strong>{localized.name}</strong>
              <span title={localized.description}>{localized.description}</span>
            </div>
            <div className="price-row-facts">
              <div className="price-row-meta">
                {service.isBookable === false && <em className="price-row-walk-in-label">{isEnglish ? "Walk-in only" : "Chỉ nhận tại tiệm"}</em>}
                <span className="price-row-duration">{service.durationMinutes} {isEnglish ? "min" : "phút"}</span>
              </div>
              <b>{price(service)}</b>
            </div>
          </>;
          return service.isBookable === false
            ? <article className="price-row price-row-walk-in" key={service.id}>{content}</article>
            : <a className="price-row price-row-book" href={bookingHref(service)} key={service.id}>{content}</a>;
        })}
      </div>
    </section>)}
  </div>;
}
