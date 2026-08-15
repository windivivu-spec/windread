import { barbers, branches, seedBookings, services } from "./mockBookingData";
import { getAvailableSlots, getBookingEnd } from "./availabilityUtils";
import { syncBookingToCalendar } from "./calendar";
import type { Booking, BookingDraft, BookingStatus } from "./types";

const STORAGE_KEY = "windread-bookings";
const phonePattern = /^(0|\+84)(\d[\s.-]?){8,10}$/;

async function fetchJson<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {})
    }
  });
  const data = await response.json();
  if (!response.ok) throw data;
  return data as T;
}

function readStoredBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed)
      ? parsed.map((booking) => ({ ...booking, guestCount: booking.guestCount ?? 1 }))
      : [];
  } catch {
    return [];
  }
}

function writeStoredBookings(bookings: Booking[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export const bookingService = {
  getBranches() {
    return branches;
  },

  getServices(branchId?: string) {
    return branchId ? services.filter((service) => service.branchId === branchId) : services;
  },

  getBarbers(branchId?: string, serviceId?: string) {
    return barbers.filter((barber) => {
      if (branchId && barber.branchId !== branchId) return false;
      if (serviceId && !barber.serviceIds.includes(serviceId)) return false;
      return true;
    });
  },

  getBookings(includeStored = true) {
    return includeStored ? [...seedBookings, ...readStoredBookings()] : seedBookings;
  },

  async fetchBranches() {
    try {
      return await fetchJson<typeof branches>("/api/branches");
    } catch {
      return branches;
    }
  },

  async fetchServices(branchId?: string) {
    const params = new URLSearchParams();
    if (branchId) params.set("branchId", branchId);
    try {
      return await fetchJson<typeof services>(`/api/services?${params.toString()}`);
    } catch {
      return this.getServices(branchId);
    }
  },

  async fetchBarbers(branchId?: string, serviceId?: string) {
    const params = new URLSearchParams();
    if (branchId) params.set("branchId", branchId);
    if (serviceId) params.set("serviceId", serviceId);

    try {
      return await fetchJson<typeof barbers>(`/api/barbers?${params.toString()}`);
    } catch {
      return this.getBarbers(branchId, serviceId);
    }
  },

  async fetchBookings() {
    try {
      return await fetchJson<Booking[]>("/api/bookings");
    } catch {
      return this.getBookings();
    }
  },

  getAvailableSlots(
    branchId: string,
    serviceId: string,
    barberId: string,
    date: string,
    includeStored = true
  ) {
    const service = services.find((item) => item.id === serviceId);
    if (!service) return [];

    return getAvailableSlots({
      branchId,
      service,
      barberId,
      date,
      barbers,
      bookings: this.getBookings(includeStored)
    });
  },

  async fetchAvailableSlots(branchId: string, serviceId: string, barberId: string, date: string) {
    const params = new URLSearchParams({ branchId, serviceId, barberId, date });
    try {
      return await fetchJson(`/api/available-slots?${params.toString()}`) as ReturnType<typeof getAvailableSlots>;
    } catch {
      return this.getAvailableSlots(branchId, serviceId, barberId, date);
    }
  },

  validateDraft(draft: BookingDraft) {
    const errors: Partial<Record<keyof BookingDraft, string>> = {};
    if (!draft.branchId) errors.branchId = "Chọn cơ sở trước khi giữ ghế.";
    if (!draft.serviceId) errors.serviceId = "Chọn dịch vụ để tính thời lượng slot.";
    if (!draft.barberId) errors.barberId = "Chọn thợ hoặc Thợ bất kỳ.";
    if (!Number.isInteger(draft.guestCount) || draft.guestCount < 1 || draft.guestCount > 4) {
      errors.guestCount = "Số khách cần từ 1 đến 4 người.";
    }
    if (draft.guestCount > 1 && draft.barberId !== "any") {
      errors.barberId = "Đặt nhóm cần để crew xếp thợ phù hợp.";
    }
    if (!draft.date) errors.date = "Chọn ngày muốn ghé.";
    if (!draft.slot) errors.slot = "Chọn khung giờ còn trống.";
    if (!draft.customerName.trim()) errors.customerName = "Nhập họ tên để crew xác nhận lịch.";
    if (!phonePattern.test(draft.customerPhone.trim())) {
      errors.customerPhone = "Số điện thoại chưa đúng định dạng Việt Nam.";
    }
    if (draft.customerEmail && !/^\S+@\S+\.\S+$/.test(draft.customerEmail)) {
      errors.customerEmail = "Email chưa đúng định dạng.";
    }
    return errors;
  },

  async createBooking(draft: BookingDraft) {
    const errors = this.validateDraft(draft);
    if (Object.keys(errors).length > 0) {
      return { booking: null, errors, message: "Thông tin đặt lịch chưa đầy đủ." };
    }

    try {
      return await fetchJson<{ booking: Booking | null; errors: Partial<Record<keyof BookingDraft, string>>; message: string }>(
        "/api/bookings",
        {
          method: "POST",
          body: JSON.stringify(draft)
        }
      );
    } catch (error) {
      const apiError = error as {
        booking?: null;
        errors?: Partial<Record<keyof BookingDraft, string>>;
        message?: string;
      };
      if (apiError.errors || apiError.message) {
        return {
          booking: null,
          errors: apiError.errors ?? {},
          message: apiError.message ?? "Không tạo được booking."
        };
      }
    }

    const service = services.find((item) => item.id === draft.serviceId);
    if (!service) return { booking: null, errors, message: "Dịch vụ không tồn tại." };

    const availableSlots = this.getAvailableSlots(draft.branchId, draft.serviceId, draft.barberId, draft.date);
    const selectedSlot = availableSlots.find((slot) => slot.startTime === draft.slot);
    if (!selectedSlot) {
      return {
        booking: null,
        errors: { slot: "Slot này vừa được đặt hoặc không còn khả dụng." },
        message: "Slot không còn trống. Chọn khung giờ khác nhé."
      };
    }

    const selectedBarberIds = draft.barberId === "any"
      ? selectedSlot.barberIds.slice(0, draft.guestCount)
      : [draft.barberId];
    if (selectedBarberIds.length < draft.guestCount) {
      return {
        booking: null,
        errors: { slot: "Khung giờ này không còn đủ thợ cho cả nhóm." },
        message: "Khung giờ này không còn đủ ghế. Hãy chọn giờ khác nhé."
      };
    }
    const createdAt = new Date().toISOString();
    const groupId = draft.guestCount > 1 ? `GRP-${Date.now().toString(36).toUpperCase()}` : undefined;
    const bookings = selectedBarberIds.map((barberId, index): Booking => ({
      id: `WD-${Date.now().toString(36).toUpperCase()}${index + 1}`,
      branchId: draft.branchId,
      serviceId: draft.serviceId,
      barberId,
      customerName: draft.customerName.trim(),
      customerPhone: draft.customerPhone.trim(),
      customerEmail: draft.customerEmail.trim() || undefined,
      note: draft.note.trim() || undefined,
      startTime: selectedSlot.startTime,
      endTime: getBookingEnd(selectedSlot.startTime, service.durationMinutes),
      status: "pending",
      guestCount: draft.guestCount,
      groupId,
      createdAt
    }));

    writeStoredBookings([...readStoredBookings(), ...bookings]);
    await Promise.all(bookings.map((booking) =>
      syncBookingToCalendar(booking, { barberEmail: barbers.find((barber) => barber.id === booking.barberId)?.email })
    ));

    return {
      booking: bookings[0],
      errors: {},
      message: draft.guestCount > 1 ? "Đã giữ ghế cho cả nhóm." : "Đặt lịch thành công."
    };
  },

  async updateBookingStatus(bookingId: string, status: BookingStatus) {
    try {
      await fetchJson<Booking[]>(`/api/bookings/${encodeURIComponent(bookingId)}`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      return await this.fetchBookings();
    } catch {
      // Fall through to the local mock update.
    }

    const storedBookings = readStoredBookings();
    const nextBookings = storedBookings.map((booking) =>
      booking.id === bookingId ? { ...booking, status } : booking
    );
    writeStoredBookings(nextBookings);
    return [...seedBookings, ...nextBookings];
  }
};
