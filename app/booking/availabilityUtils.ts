import type { Barber, Booking, Service, TimeSlot, Weekday } from "./types";

export const BOOKING_BUFFER_MINUTES = 10;
export const SLOT_STEP_MINUTES = 30;
const VIETNAM_TIME_ZONE = "Asia/Ho_Chi_Minh";
const VIETNAM_UTC_OFFSET = "+07:00";

const weekdays: Weekday[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday"
];

const weekdayLabels = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
const weekdayLabelsEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function vietnamDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: VIETNAM_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);
  return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

function weekdayIndex(dateValue: string) {
  const [year, month, day] = dateValue.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12)).getUTCDay();
}

export function toDateInputValue(date: Date) {
  const parts = vietnamDateParts(date);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function getUpcomingDays(count = 7, isEnglish = false, now = new Date()) {
  const [year, month, day] = toDateInputValue(now).split("-").map(Number);
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(Date.UTC(year, month - 1, day + index, 12));
    const value = date.toISOString().slice(0, 10);
    const [, valueMonth, valueDay] = value.split("-");
    return {
      value,
      label: `${(isEnglish ? weekdayLabelsEn : weekdayLabels)[weekdayIndex(value)]}, ${valueDay}/${valueMonth}`
    };
  });
}

export function formatCurrency(value: number, isEnglish = false) {
  const formatted = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, isEnglish ? "," : ".");
  return isEnglish ? `${formatted} VND` : `${formatted}đ`;
}

export function formatBookingTime(iso: string, isEnglish = false) {
  const date = new Date(iso);
  const parts = vietnamDateParts(date);
  const dateValue = `${parts.year}-${parts.month}-${parts.day}`;
  return `${(isEnglish ? weekdayLabelsEn : weekdayLabels)[weekdayIndex(dateValue)]}, ${parts.day}/${parts.month} ${parts.hour}:${parts.minute}`;
}

export function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}

export function buildLocalDateTime(date: string, time: string) {
  // Vietnam does not observe DST, so using its fixed UTC+07 offset makes slot
  // generation identical on local machines and UTC runtimes such as Vercel.
  return new Date(`${date}T${time}:00${VIETNAM_UTC_OFFSET}`);
}

export function getBookingEnd(startTime: string, durationMinutes: number) {
  return addMinutes(new Date(startTime), durationMinutes).toISOString();
}

export function isBarberAvailable(
  barber: Barber,
  service: Service,
  start: Date,
  bookings: Booking[],
  now = new Date()
) {
  if (start.getTime() <= now.getTime()) return false;
  if (!barber.serviceIds.includes(service.id)) return false;

  const dateValue = toDateInputValue(start);
  const weekday = weekdays[weekdayIndex(dateValue)];
  const hours = barber.workingHours[weekday];
  if (!hours) return false;

  const shiftStart = buildLocalDateTime(dateValue, hours.start);
  const shiftEnd = buildLocalDateTime(dateValue, hours.end);
  const end = addMinutes(start, service.durationMinutes);

  if (start < shiftStart || end > shiftEnd) return false;

  return !bookings.some((booking) => {
    if (booking.barberId !== barber.id) return false;
    if (booking.status === "cancelled") return false;

    const bookedStart = new Date(booking.startTime);
    const bookedEnd = new Date(booking.endTime);
    const blockedEnd = addMinutes(bookedEnd, BOOKING_BUFFER_MINUTES);
    const requestedEndWithBuffer = addMinutes(end, BOOKING_BUFFER_MINUTES);

    return start < blockedEnd && requestedEndWithBuffer > bookedStart;
  });
}

export function getAvailableSlots({
  branchId,
  service,
  barberId,
  date,
  barbers,
  bookings,
  now = new Date()
}: {
  branchId: string;
  service: Service;
  barberId: string;
  date: string;
  barbers: Barber[];
  bookings: Booking[];
  now?: Date;
}): TimeSlot[] {
  const branchBarbers = barbers.filter(
    (barber) => barber.branchId === branchId && (barberId === "any" || barber.id === barberId)
  );

  const dayStart = buildLocalDateTime(date, "00:00");
  const slots: TimeSlot[] = [];

  for (let minutes = 0; minutes < 24 * 60; minutes += SLOT_STEP_MINUTES) {
    const start = addMinutes(dayStart, minutes);
    const end = addMinutes(start, service.durationMinutes);
    const availableBarberIds = branchBarbers
      .filter((barber) => isBarberAvailable(barber, service, start, bookings, now))
      .map((barber) => barber.id);

    if (availableBarberIds.length === 0) continue;

    const timeParts = vietnamDateParts(start);
    const label = `${timeParts.hour}:${timeParts.minute}`;
    slots.push({
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      label,
      barberIds: availableBarberIds
    });
  }

  return slots;
}
