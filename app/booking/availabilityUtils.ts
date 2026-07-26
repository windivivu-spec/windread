import type { Barber, Booking, Service, TimeSlot, Weekday } from "./types";

export const BOOKING_BUFFER_MINUTES = 10;
export const SLOT_STEP_MINUTES = 30;

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

function twoDigit(value: number) {
  return `${value}`.padStart(2, "0");
}

export function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = twoDigit(date.getMonth() + 1);
  const day = twoDigit(date.getDate());
  return `${year}-${month}-${day}`;
}

export function getUpcomingDays(count = 7, now = new Date()) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + index);
    return {
      value: toDateInputValue(date),
      label: `${weekdayLabels[date.getDay()]}, ${twoDigit(date.getDate())}/${twoDigit(date.getMonth() + 1)}`
    };
  });
}

export function formatCurrency(value: number) {
  return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ`;
}

export function formatBookingTime(iso: string) {
  const date = new Date(iso);
  return `${weekdayLabels[date.getDay()]}, ${twoDigit(date.getDate())}/${twoDigit(
    date.getMonth() + 1
  )} ${twoDigit(date.getHours())}:${twoDigit(date.getMinutes())}`;
}

export function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}

export function buildLocalDateTime(date: string, time: string) {
  const [hour, minute] = time.split(":").map(Number);
  const value = new Date(`${date}T00:00:00`);
  value.setHours(hour, minute, 0, 0);
  return value;
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

  const weekday = weekdays[start.getDay()];
  const hours = barber.workingHours[weekday];
  if (!hours) return false;

  const dateValue = toDateInputValue(start);
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

    const label = `${twoDigit(start.getHours())}:${twoDigit(start.getMinutes())}`;
    slots.push({
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      label,
      barberIds: availableBarberIds
    });
  }

  return slots;
}
