import { getAvailableSlots, getBookingEnd } from "./availabilityUtils";
import { syncBookingToCalendar } from "./calendar";
import { sendBarberBookingEmail } from "./email";
import { barbers as mockBarbers, branches as mockBranches, seedBookings, services as mockServices } from "./mockBookingData";
import type { Barber, Booking, BookingDraft, BookingStatus, Branch, Service, TimeSlot, Weekday, WorkingWindow } from "./types";

type SupabaseBranchRow = {
  id: string;
  name: string;
  address: string;
  phone: string;
};

type SupabaseServiceRow = {
  id: string;
  branch_id: string;
  name: string;
  description: string;
  price: number;
  price_label?: string | null;
  duration_minutes: number;
};

type SupabaseBarberRow = {
  id: string;
  branch_id: string;
  name: string;
  email: string | null;
  avatar: string;
  title: string;
  specialties: string[];
  working_hours: Partial<Record<Weekday, WorkingWindow>>;
};

type SupabaseBarberServiceRow = {
  barber_id: string;
  service_id: string;
};

type SupabaseBookingRow = {
  id: string;
  branch_id: string;
  service_id: string;
  barber_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  note: string | null;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  guest_count?: number;
  group_id?: string | null;
  created_at: string;
};

const phonePattern = /^(0|\+84)(\d[\s.-]?){8,10}$/;

type SupabaseErrorBody = {
  code?: string;
  details?: string | null;
  hint?: string | null;
  message?: string;
};

class SupabaseRestError extends Error {
  status: number;
  code?: string;

  constructor(status: number, body: SupabaseErrorBody, fallback: string) {
    super(body.message || fallback);
    this.name = "SupabaseRestError";
    this.status = status;
    this.code = body.code;
  }
}

function isBookingConflictError(error: unknown) {
  if (!(error instanceof SupabaseRestError)) return false;
  return error.code === "23505" || error.message.includes("Booking overlaps an existing appointment");
}

function isMissingGroupMetadataError(error: unknown) {
  if (!(error instanceof SupabaseRestError) || error.code !== "PGRST204") return false;
  return error.message.includes("group_id") || error.message.includes("guest_count");
}

function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return {
    url: url.replace(/\/$/, ""),
    serviceRoleKey
  };
}

export function isSupabaseConfigured() {
  return Boolean(supabaseConfig());
}

async function restFetch<T>(path: string, init: RequestInit = {}) {
  const config = supabaseConfig();
  if (!config) throw new Error("Supabase env is not configured.");

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: config.serviceRoleKey,
      authorization: `Bearer ${config.serviceRoleKey}`,
      "content-type": "application/json",
      ...(init.headers ?? {})
    }
  });

  if (!response.ok) {
    const detail = await response.text();
    let body: SupabaseErrorBody = {};
    try {
      body = JSON.parse(detail) as SupabaseErrorBody;
    } catch {
      body = { message: detail };
    }
    throw new SupabaseRestError(
      response.status,
      body,
      `Supabase request failed with ${response.status}`
    );
  }

  if (response.status === 204) return null as T;
  return (await response.json()) as T;
}

function mapService(row: SupabaseServiceRow): Service {
  return {
    id: row.id,
    branchId: row.branch_id,
    name: row.name,
    description: row.description,
    price: row.price,
    priceLabel: row.price_label ?? undefined,
    durationMinutes: row.duration_minutes
  };
}

function mapBarber(row: SupabaseBarberRow, serviceIds: string[]): Barber {
  return {
    id: row.id,
    branchId: row.branch_id,
    name: row.name,
    email: row.email ?? undefined,
    avatar: row.avatar,
    title: row.title,
    specialties: row.specialties ?? [],
    serviceIds,
    workingHours: row.working_hours ?? {}
  };
}

function mapBooking(row: SupabaseBookingRow): Booking {
  return {
    id: row.id,
    branchId: row.branch_id,
    serviceId: row.service_id,
    barberId: row.barber_id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email ?? undefined,
    note: row.note ?? undefined,
    startTime: row.start_time,
    endTime: row.end_time,
    status: row.status,
    guestCount: row.guest_count ?? 1,
    groupId: row.group_id ?? undefined,
    createdAt: row.created_at
  };
}

function normalizedIsoDateTime(value: string) {
  const milliseconds = Date.parse(value);
  return Number.isFinite(milliseconds) ? new Date(milliseconds).toISOString() : value;
}

function findRequestedSlot(slots: TimeSlot[], requestedValue: string) {
  const requestedMilliseconds = Date.parse(requestedValue);
  if (Number.isFinite(requestedMilliseconds)) {
    return slots.find((slot) => Date.parse(slot.startTime) === requestedMilliseconds);
  }

  const timeLabel = requestedValue.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!timeLabel) return undefined;
  const normalizedLabel = `${timeLabel[1].padStart(2, "0")}:${timeLabel[2]}`;
  return slots.find((slot) => slot.label === normalizedLabel);
}

export function validateBookingDraft(draft: BookingDraft) {
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
}

export async function getBranches(): Promise<Branch[]> {
  if (!isSupabaseConfigured()) return mockBranches;
  return restFetch<SupabaseBranchRow[]>("branches?select=*&order=name.asc").then((rows) =>
    rows.map((row) => ({
      id: row.id,
      name: row.name,
      address: row.address,
      phone: row.phone
    }))
  );
}

export async function getServices(branchId?: string): Promise<Service[]> {
  if (!isSupabaseConfigured()) {
    return branchId ? mockServices.filter((service) => service.branchId === branchId) : mockServices;
  }

  const branchFilter = branchId ? `&branch_id=eq.${encodeURIComponent(branchId)}` : "";
  return restFetch<SupabaseServiceRow[]>(
    `services?select=*&is_bookable=eq.true${branchFilter}&order=price.asc`
  ).then((rows) => rows.map(mapService));
}

export async function getBarbers(branchId?: string, serviceId?: string): Promise<Barber[]> {
  if (!isSupabaseConfigured()) {
    return mockBarbers.filter((barber) => {
      if (branchId && barber.branchId !== branchId) return false;
      if (serviceId && !barber.serviceIds.includes(serviceId)) return false;
      return true;
    });
  }

  const branchFilter = branchId ? `&branch_id=eq.${encodeURIComponent(branchId)}` : "";
  const [barberRows, serviceRows] = await Promise.all([
    restFetch<SupabaseBarberRow[]>(`barbers?select=*&order=name.asc${branchFilter}`),
    restFetch<SupabaseBarberServiceRow[]>("barber_services?select=*")
  ]);

  return barberRows
    .map((barber) =>
      mapBarber(
        barber,
        serviceRows.filter((row) => row.barber_id === barber.id).map((row) => row.service_id)
      )
    )
    .filter((barber) => !serviceId || barber.serviceIds.includes(serviceId));
}

export async function getBookings(): Promise<Booking[]> {
  if (!isSupabaseConfigured()) return seedBookings;
  return restFetch<SupabaseBookingRow[]>("bookings?select=*&order=start_time.asc").then((rows) =>
    rows.map(mapBooking)
  );
}

export async function getBooking(id: string): Promise<Booking | null> {
  if (!isSupabaseConfigured()) return seedBookings.find((booking) => booking.id === id) ?? null;
  const rows = await restFetch<SupabaseBookingRow[]>(`bookings?select=*&id=eq.${encodeURIComponent(id)}&limit=1`);
  return rows[0] ? mapBooking(rows[0]) : null;
}

async function findMatchingBooking(draft: BookingDraft): Promise<Booking | null> {
  if (!isSupabaseConfigured()) return null;

  const filters = [
    "select=*",
    `branch_id=eq.${encodeURIComponent(draft.branchId)}`,
    `service_id=eq.${encodeURIComponent(draft.serviceId)}`,
    `customer_phone=eq.${encodeURIComponent(draft.customerPhone.trim())}`,
    `start_time=eq.${encodeURIComponent(normalizedIsoDateTime(draft.slot))}`,
    "status=neq.cancelled",
    "limit=1"
  ];
  if (draft.barberId !== "any") {
    filters.push(`barber_id=eq.${encodeURIComponent(draft.barberId)}`);
  }

  const rows = await restFetch<SupabaseBookingRow[]>(`bookings?${filters.join("&")}`);
  return rows[0] ? mapBooking(rows[0]) : null;
}

export async function getSlots(branchId: string, serviceId: string, barberId: string, date: string): Promise<TimeSlot[]> {
  const [services, barbers, bookings] = await Promise.all([getServices(branchId), getBarbers(branchId), getBookings()]);
  const service = services.find((item) => item.id === serviceId);
  if (!service) return [];

  return getAvailableSlots({
    branchId,
    service,
    barberId,
    date,
    barbers,
    bookings
  });
}

export async function createBooking(draft: BookingDraft) {
  const errors = validateBookingDraft(draft);
  if (Object.keys(errors).length > 0) {
    return { booking: null, errors, message: "Thông tin đặt lịch chưa đầy đủ." };
  }

  const services = await getServices(draft.branchId);
  const service = services.find((item) => item.id === draft.serviceId);
  if (!service) return { booking: null, errors: {}, message: "Dịch vụ không tồn tại." };
  const branches = await getBranches();
  const selectedBranch = branches.find((branch) => branch.id === draft.branchId);

  const availableSlots = await getSlots(draft.branchId, draft.serviceId, draft.barberId, draft.date);
  // Conversational models may preserve the instant but change the ISO format
  // (for example 04:00Z vs 11:00+07:00). Compare timestamps, not raw strings.
  const selectedSlot = findRequestedSlot(availableSlots, draft.slot);
  if (!selectedSlot) {
    const existingBooking = await findMatchingBooking(draft);
    if (existingBooking) {
      return {
        booking: existingBooking,
        errors: {},
        message: "Lịch này đã được tạo thành công trước đó."
      };
    }
    return {
      booking: null,
      errors: { slot: "Slot này vừa được đặt hoặc không còn khả dụng." },
      message: "Slot không còn trống. Chọn khung giờ khác nhé."
    };
  }

  const barbers = await getBarbers(draft.branchId, draft.serviceId);
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

  const syncCreatedBookingToCalendar = async (createdBooking: Booking) => {
    const selectedBarber = barbers.find((barber) => barber.id === createdBooking.barberId);
    try {
      await syncBookingToCalendar(createdBooking, { barberEmail: selectedBarber?.email });
    } catch (error) {
      console.warn("Google Calendar sync failed:", error);
    }
  };

  const notifySelectedBarber = async (createdBooking: Booking) => {
    const selectedBarber = barbers.find((barber) => barber.id === createdBooking.barberId);
    try {
      await sendBarberBookingEmail(createdBooking, {
        barberEmail: selectedBarber?.email,
        barberName: selectedBarber?.name,
        branchName: selectedBranch?.name,
        branchAddress: selectedBranch?.address,
        serviceName: service.name
      });
    } catch (error) {
      console.warn("Brevo booking email failed:", error);
    }
  };

  if (!isSupabaseConfigured()) {
    await Promise.all(bookings.flatMap((booking) => [
      syncCreatedBookingToCalendar(booking),
      notifySelectedBarber(booking)
    ]));
    return {
      booking: bookings[0],
      errors: {},
      message: draft.guestCount > 1 ? "Đã giữ ghế cho cả nhóm ở mock mode." : "Đặt lịch thành công ở mock mode."
    };
  }

  try {
    const bookingRows = bookings.map((booking) => ({
        id: booking.id,
        branch_id: booking.branchId,
        service_id: booking.serviceId,
        barber_id: booking.barberId,
        customer_name: booking.customerName,
        customer_phone: booking.customerPhone,
        customer_email: booking.customerEmail ?? null,
        note: booking.note ?? null,
        start_time: booking.startTime,
        end_time: booking.endTime,
        status: booking.status,
        guest_count: booking.guestCount,
        group_id: booking.groupId ?? null
      }));
    const insertRows = (body: object[]) =>
      restFetch<SupabaseBookingRow[]>("bookings", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(body)
      });

    let rows: SupabaseBookingRow[];
    try {
      rows = await insertRows(bookingRows);
    } catch (error) {
      if (!isMissingGroupMetadataError(error)) throw error;

      // Older WINDREAD databases predate group booking metadata. A single-customer
      // chatbot booking can safely use the original schema until its migration runs.
      rows = await insertRows(
        bookingRows.map(({ guest_count: _guestCount, group_id: _groupId, ...row }) => row)
      );
    }
    const createdBooking = mapBooking(rows[0]);
    const createdBookings = rows.map(mapBooking);
    await Promise.all(createdBookings.flatMap((booking) => [
      syncCreatedBookingToCalendar(booking),
      notifySelectedBarber(booking)
    ]));
    return {
      booking: createdBooking,
      errors: {},
      message: draft.guestCount > 1 ? "Đã giữ ghế cho cả nhóm." : "Đặt lịch thành công."
    };
  } catch (error) {
    if (isBookingConflictError(error)) {
      const existingBooking = await findMatchingBooking(draft);
      if (existingBooking) {
        return {
          booking: existingBooking,
          errors: {},
          message: "Lịch này đã được tạo thành công trước đó."
        };
      }
      return {
        booking: null,
        errors: { slot: "Slot này vừa được đặt hoặc không còn khả dụng." },
        message: "Slot không còn trống. Chọn khung giờ khác nhé."
      };
    }

    console.error("Supabase booking insert failed:", error);
    return {
      booking: null,
      errors: {},
      message: "Hệ thống chưa thể ghi booking. Vui lòng thử lại hoặc gọi/Zalo 0393549656."
    };
  }
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  if (!isSupabaseConfigured()) return seedBookings;

  const rows = await restFetch<SupabaseBookingRow[]>(`bookings?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ status })
  });
  return rows.map(mapBooking);
}
