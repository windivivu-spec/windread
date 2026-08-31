export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type WorkingWindow = {
  start: string;
  end: string;
};

export type Branch = {
  id: string;
  name: string;
  address: string;
  phone: string;
  image?: string;
};

export type Service = {
  id: string;
  branchId: string;
  name: string;
  description: string;
  price: number;
  priceLabel?: string;
  category?: ServiceCategory;
  durationMinutes: number;
};

export type ServiceCategory = "barber" | "dreadlocks" | "braids" | "afro";

export type Barber = {
  id: string;
  branchId: string;
  name: string;
  email?: string;
  avatar: string;
  title: string;
  specialties: string[];
  serviceIds: string[];
  workingHours: Partial<Record<Weekday, WorkingWindow>>;
};

export type Booking = {
  id: string;
  branchId: string;
  serviceId: string;
  barberId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  note?: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  guestCount: number;
  groupId?: string;
  createdAt: string;
};

export type BookingDraft = {
  branchId: string;
  serviceId: string;
  barberId: string;
  date: string;
  slot: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  note: string;
  guestCount: number;
};

export type TimeSlot = {
  startTime: string;
  endTime: string;
  label: string;
  barberIds: string[];
};
