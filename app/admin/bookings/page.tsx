"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { bookingService } from "../../booking/bookingService";
import { formatBookingTime, toDateInputValue } from "../../booking/availabilityUtils";
import type { Barber, Booking, BookingStatus, Branch, Service } from "../../booking/types";
import { AdminFrame, useAdminSession } from "../components/AdminFrame";

const statuses: BookingStatus[] = ["pending", "confirmed", "cancelled", "completed"];
const statusLabels: Record<BookingStatus, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  cancelled: "Đã huỷ",
  completed: "Hoàn tất"
};
const viewLabels = {
  week: "Tuần",
  day: "Ngày",
  list: "Danh sách"
} as const;
const calendarHours = Array.from({ length: 11 }, (_, index) => index + 9);
const weekdayLabels = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

type CalendarView = keyof typeof viewLabels;

function getInitialParam(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  return new URLSearchParams(window.location.search).get(name) || fallback;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfWeek(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  const day = next.getDay();
  next.setDate(next.getDate() - (day === 0 ? 6 : day - 1));
  return next;
}

function sameDay(iso: string, date: Date) {
  return toDateInputValue(new Date(iso)) === toDateInputValue(date);
}

function minutesFromHour(iso: string) {
  const date = new Date(iso);
  return date.getMinutes();
}

function formatDayLabel(date: Date) {
  return `${weekdayLabels[date.getDay()]}, ${String(date.getDate()).padStart(2, "0")}/${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;
}

function formatLongDayLabel(date: Date) {
  return `${formatDayLabel(date)} / ${date.getFullYear()}`;
}

function formatShortTime(iso: string) {
  const date = new Date(iso);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function sortBookings(a: Booking, b: Booking) {
  return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
}

function BookingCalendar() {
  const { branchId: adminBranchId, setBranchId: setAdminBranchId } = useAdminSession();
  const [selectedDate, setSelectedDate] = useState(() => getInitialParam("date", toDateInputValue(new Date())));
  const [view, setView] = useState<CalendarView>(() => {
    const value = getInitialParam("view", "week");
    return value === "day" || value === "list" ? value : "week";
  });
  const [branchId, setBranchId] = useState(() => getInitialParam("branch", adminBranchId || "all"));
  const [barberId, setBarberId] = useState(() => getInitialParam("barber", "all"));
  const [status, setStatus] = useState<BookingStatus | "all">(() => {
    const value = getInitialParam("status", "all");
    return statuses.includes(value as BookingStatus) ? (value as BookingStatus) : "all";
  });
  const [hidePastBookings, setHidePastBookings] = useState(() => getInitialParam("past", "hide") !== "show");
  const [bookings, setBookings] = useState<Booking[]>(() => bookingService.getBookings(false));
  const [branches, setBranches] = useState<Branch[]>(() => bookingService.getBranches());
  const [barbers, setBarbers] = useState<Barber[]>(() => bookingService.getBarbers());
  const [services, setServices] = useState<Service[]>(() => bookingService.getServices());
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    Promise.all([
      bookingService.fetchBranches(),
      bookingService.fetchServices(),
      bookingService.fetchBarbers(),
      bookingService.fetchBookings()
    ])
      .then(([nextBranches, nextServices, nextBarbers, nextBookings]) => {
        if (!isMounted) return;
        setBranches(nextBranches);
        setServices(nextServices);
        setBarbers(nextBarbers);
        setBookings(nextBookings);
        setLoadError("");
      })
      .catch(() => {
        if (isMounted) setLoadError("Không tải được dữ liệu mới nhất. Đang hiển thị dữ liệu có sẵn.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (!params.has("view") && window.matchMedia("(max-width: 780px)").matches) {
      setView("day");
    }
  }, []);

  useEffect(() => {
    function handleBranchChange(event: Event) {
      const nextBranchId = (event as CustomEvent<{ branchId?: string }>).detail?.branchId;
      if (!nextBranchId) return;
      setBranchId(nextBranchId);
      setBarberId("all");
    }

    window.addEventListener("windread-admin-branch-change", handleBranchChange);
    return () => window.removeEventListener("windread-admin-branch-change", handleBranchChange);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("date", selectedDate);
    params.set("view", view);
    if (branchId !== "all") params.set("branch", branchId);
    if (barberId !== "all") params.set("barber", barberId);
    if (status !== "all") params.set("status", status);
    if (!hidePastBookings) params.set("past", "show");
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  }, [barberId, branchId, hidePastBookings, selectedDate, status, view]);

  const selectedDateValue = useMemo(() => new Date(`${selectedDate}T00:00:00`), [selectedDate]);
  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDateValue);
    return Array.from({ length: 7 }, (_, index) => addDays(start, index));
  }, [selectedDateValue]);

  const branchBarbers = useMemo(
    () => barbers.filter((barber) => branchId === "all" || barber.branchId === branchId),
    [barbers, branchId]
  );

  const visibleBookings = useMemo(
    () =>
      bookings
        .filter((booking) => {
          const isPast = new Date(booking.endTime).getTime() < Date.now();
          const start = new Date(booking.startTime);
          const inRange =
            view === "week"
              ? weekDays.some((day) => sameDay(booking.startTime, day))
              : view === "day"
                ? sameDay(booking.startTime, selectedDateValue)
                : true;
          if (hidePastBookings && isPast) return false;
          if (!inRange) return false;
          if (branchId !== "all" && booking.branchId !== branchId) return false;
          if (barberId !== "all" && booking.barberId !== barberId) return false;
          if (status !== "all" && booking.status !== status) return false;
          if (view === "list" && toDateInputValue(start) < selectedDate) return false;
          return true;
        })
        .sort(sortBookings),
    [barberId, bookings, branchId, hidePastBookings, selectedDate, selectedDateValue, status, view, weekDays]
  );

  const stats = useMemo(() => {
    const upcoming = bookings.filter((booking) => new Date(booking.endTime).getTime() >= Date.now());
    return {
      total: visibleBookings.length,
      pending: visibleBookings.filter((booking) => booking.status === "pending").length,
      confirmed: visibleBookings.filter((booking) => booking.status === "confirmed").length,
      next: upcoming.sort(sortBookings)[0]
    };
  }, [bookings, visibleBookings]);

  const selectedBarber = barbers.find((barber) => barber.id === barberId);
  const selectedBranch = branches.find((branch) => branch.id === branchId);

  async function updateStatus(bookingId: string, nextStatus: BookingStatus) {
    setBookings((current) =>
      current.map((booking) => (booking.id === bookingId ? { ...booking, status: nextStatus } : booking))
    );
    setBookings(await bookingService.updateBookingStatus(bookingId, nextStatus));
  }

  function moveDate(direction: -1 | 1) {
    const amount = view === "week" ? 7 : 1;
    setSelectedDate(toDateInputValue(addDays(selectedDateValue, direction * amount)));
  }

  function renderBookingCard(booking: Booking, compact = false) {
    const branch = branches.find((item) => item.id === booking.branchId);
    const service = services.find((item) => item.id === booking.serviceId);
    const barber = barbers.find((item) => item.id === booking.barberId);
    return (
      <article className={`admin-calendar-card status-${booking.status} ${compact ? "compact" : ""}`} key={booking.id}>
        <div className="admin-card-topline">
          <span>{formatShortTime(booking.startTime)}</span>
          <select
            aria-label={`Trạng thái ${booking.id}`}
            value={booking.status}
            onChange={(event) => updateStatus(booking.id, event.target.value as BookingStatus)}
          >
            {statuses.map((item) => (
              <option value={item} key={item}>
                {statusLabels[item]}
              </option>
            ))}
          </select>
        </div>
        <h3>{booking.customerName}</h3>
        <p>{service?.name || booking.serviceId}</p>
        <dl>
          <div>
            <dt>Thợ</dt>
            <dd>{barber?.name || booking.barberId}</dd>
          </div>
          <div>
            <dt>Cơ sở</dt>
            <dd>{branch?.name || booking.branchId}</dd>
          </div>
          {!compact && (
            <div>
              <dt>SĐT</dt>
              <dd>
                <a href={`tel:${booking.customerPhone}`}>{booking.customerPhone}</a>
              </dd>
            </div>
          )}
        </dl>
        {!compact && booking.note && <p className="admin-card-note">{booking.note}</p>}
        {!compact && booking.status !== "cancelled" && <Link className="admin-text-button" href={`/admin/pos?booking=${encodeURIComponent(booking.id)}`}>Tạo hóa đơn</Link>}
      </article>
    );
  }

  function renderBookingListRow(booking: Booking) {
    const branch = branches.find((item) => item.id === booking.branchId);
    const service = services.find((item) => item.id === booking.serviceId);
    const barber = barbers.find((item) => item.id === booking.barberId);

    return (
      <article className={`admin-booking-list-row status-${booking.status}`} key={booking.id}>
        <div className="admin-list-time">
          <strong>{formatShortTime(booking.startTime)}</strong>
          <span>{formatShortTime(booking.endTime)}</span>
        </div>
        <div className="admin-list-customer">
          <h3>{booking.customerName}</h3>
          <a href={`tel:${booking.customerPhone}`}>{booking.customerPhone}</a>
        </div>
        <div className="admin-list-detail">
          <span>Dịch vụ</span>
          <strong>{service?.name || booking.serviceId}</strong>
        </div>
        <div className="admin-list-detail">
          <span>Thợ / Cơ sở</span>
          <strong>{barber?.name || booking.barberId}</strong>
          <small>{branch?.name || booking.branchId}</small>
        </div>
        <label className="admin-list-status">
          <span className="sr-only">Trạng thái booking của {booking.customerName}</span>
          <select
            aria-label={`Trạng thái ${booking.id}`}
            value={booking.status}
            onChange={(event) => updateStatus(booking.id, event.target.value as BookingStatus)}
          >
            {statuses.map((item) => (
              <option value={item} key={item}>
                {statusLabels[item]}
              </option>
            ))}
          </select>
        </label>
        {booking.status !== "cancelled" && <Link className="admin-list-invoice-link" href={`/admin/pos?booking=${encodeURIComponent(booking.id)}`}>Thu tiền</Link>}
        {booking.note && <p className="admin-list-note">{booking.note}</p>}
      </article>
    );
  }

  const bookingsByDate = useMemo(() => {
    return visibleBookings.reduce<Array<{ date: string; bookings: Booking[] }>>((groups, booking) => {
      const date = toDateInputValue(new Date(booking.startTime));
      const group = groups.at(-1);
      if (group?.date === date) {
        group.bookings.push(booking);
      } else {
        groups.push({ date, bookings: [booking] });
      }
      return groups;
    }, []);
  }, [visibleBookings]);

  return (
    <section className="admin-bookings-page">
      <header className="admin-bookings-header">
        <a className="ghost-button" href="/booking">
          Về đặt lịch
        </a>
        <div>
          <p className="section-kicker">Staff calendar</p>
          <h1>Quản lý booking</h1>
          <p>
            {selectedBarber ? `Lịch của ${selectedBarber.name}` : "Lịch tổng của shop"}
            {selectedBranch ? ` / ${selectedBranch.name}` : ""}
          </p>
        </div>
      </header>

      <section className="booking-admin-panel">
        <div className="admin-calendar-toolbar">
          <div className="admin-date-nav">
            <button type="button" onClick={() => moveDate(-1)} aria-label="Lùi lịch">
              ←
            </button>
            <button type="button" onClick={() => setSelectedDate(toDateInputValue(new Date()))}>
              Hôm nay
            </button>
            <button type="button" onClick={() => moveDate(1)} aria-label="Tiến lịch">
              →
            </button>
            <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
          </div>
          <div className="admin-view-switch" aria-label="Chế độ xem">
            {(Object.keys(viewLabels) as CalendarView[]).map((item) => (
              <button className={view === item ? "is-active" : ""} type="button" key={item} onClick={() => setView(item)}>
                {viewLabels[item]}
              </button>
            ))}
          </div>
        </div>

        <div className="booking-admin-filters">
          <label>
            <span>Cơ sở</span>
            <select
              value={branchId}
              onChange={(event) => {
                const nextBranchId = event.target.value;
                setBranchId(nextBranchId);
                setAdminBranchId(nextBranchId);
                setBarberId("all");
              }}
            >
              <option value="all">Tất cả cơ sở</option>
              {branches.map((branch) => (
                <option value={branch.id} key={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Thợ</span>
            <select value={barberId} onChange={(event) => setBarberId(event.target.value)}>
              <option value="all">Tất cả thợ</option>
              {branchBarbers.map((barber) => (
                <option value={barber.id} key={barber.id}>
                  {barber.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Trạng thái</span>
            <select value={status} onChange={(event) => setStatus(event.target.value as BookingStatus | "all")}>
              <option value="all">Tất cả</option>
              {statuses.map((item) => (
                <option value={item} key={item}>
                  {statusLabels[item]}
                </option>
              ))}
            </select>
          </label>
          <label className="booking-admin-toggle">
            <span>Hiển thị</span>
            <input
              type="checkbox"
              checked={hidePastBookings}
              onChange={(event) => setHidePastBookings(event.target.checked)}
            />
            <strong>Ẩn lịch đã qua</strong>
          </label>
        </div>

        {loadError && <p className="admin-inline-alert">{loadError}</p>}

        <div className="admin-calendar-metrics">
          <div>
            <span>Đang hiển thị</span>
            <strong>{stats.total}</strong>
          </div>
          <div>
            <span>Chờ xác nhận</span>
            <strong>{stats.pending}</strong>
          </div>
          <div>
            <span>Đã xác nhận</span>
            <strong>{stats.confirmed}</strong>
          </div>
          <div>
            <span>Lịch kế tiếp</span>
            <strong>{stats.next ? formatBookingTime(stats.next.startTime) : "Trống"}</strong>
          </div>
        </div>

        {selectedBarber && (
          <div className="admin-barber-share">
            <span>Link lịch thợ</span>
            <code>{`/admin/bookings?barber=${selectedBarber.id}&view=day`}</code>
          </div>
        )}

        {isLoading && <div className="admin-calendar-skeleton">Đang tải lịch mới nhất...</div>}

        {!isLoading && view === "week" && (
          <section className="admin-week-calendar" aria-label="Lịch tuần">
            <div className="admin-week-head">
              <span />
              {weekDays.map((day) => (
                <strong className={sameDay(new Date().toISOString(), day) ? "is-today" : ""} key={day.toISOString()}>
                  {formatDayLabel(day)}
                </strong>
              ))}
            </div>
            <div className="admin-week-body">
              {calendarHours.map((hour) => (
                <div className="admin-hour-row" key={hour}>
                  <time>{`${String(hour).padStart(2, "0")}:00`}</time>
                  {weekDays.map((day) => {
                    const hourBookings = visibleBookings.filter((booking) => {
                      const start = new Date(booking.startTime);
                      return sameDay(booking.startTime, day) && start.getHours() === hour;
                    });
                    return (
                      <div className="admin-hour-cell" key={`${day.toISOString()}-${hour}`}>
                        {hourBookings.map((booking) => (
                          <div
                            className="admin-hour-card-wrap"
                            style={{ marginTop: `${Math.max(0, minutesFromHour(booking.startTime) / 2)}px` }}
                            key={booking.id}
                          >
                            {renderBookingCard(booking, true)}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </section>
        )}

        {!isLoading && view === "day" && (
          <section className="admin-day-calendar" aria-label="Lịch ngày">
            <header>
              <p className="section-kicker">{formatDayLabel(selectedDateValue)}</p>
              <h2>{visibleBookings.length} lịch trong ngày</h2>
            </header>
            <div className="admin-day-lanes">
              {calendarHours.map((hour) => {
                const hourBookings = visibleBookings.filter((booking) => new Date(booking.startTime).getHours() === hour);
                return (
                  <div className="admin-day-hour" key={hour}>
                    <time>{`${String(hour).padStart(2, "0")}:00`}</time>
                    <div>
                      {hourBookings.map((booking) => renderBookingCard(booking))}
                      {hourBookings.length === 0 && <span className="admin-empty-hour">Trống</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {!isLoading && view === "list" && (
          <section className="admin-agenda-list" aria-label="Danh sách booking">
            <header className="admin-list-header">
              <div>
                <p className="section-kicker">List view</p>
                <h2>Lịch hẹn từ {formatLongDayLabel(selectedDateValue)}</h2>
              </div>
              <p>{visibleBookings.length} booking phù hợp</p>
            </header>
            {bookingsByDate.map((group) => {
              const date = new Date(`${group.date}T00:00:00`);
              return (
                <section className="admin-list-date-group" key={group.date} aria-label={formatLongDayLabel(date)}>
                  <h3>{formatLongDayLabel(date)}</h3>
                  <div className="admin-list-column-labels" aria-hidden="true">
                    <span>Giờ</span>
                    <span>Khách hàng</span>
                    <span>Dịch vụ</span>
                    <span>Phân công</span>
                    <span>Trạng thái</span>
                  </div>
                  <div className="admin-list-rows">{group.bookings.map((booking) => renderBookingListRow(booking))}</div>
                </section>
              );
            })}
          </section>
        )}

        {!isLoading && visibleBookings.length === 0 && (
          <div className="booking-empty">Không có booking phù hợp với bộ lọc hiện tại.</div>
        )}
      </section>
    </section>
  );
}

export default function AdminBookingsPage() {
  return <AdminFrame title="Lịch hẹn" eyebrow="Theo dõi lịch & tạo hóa đơn"><BookingCalendar /></AdminFrame>;
}
