"use client";

import Image from "next/image";
import { FormEvent, RefObject, useEffect, useMemo, useRef, useState } from "react";
import { bookingService } from "./bookingService";
import {
  BOOKING_BUFFER_MINUTES,
  formatBookingTime,
  formatCurrency,
  getUpcomingDays
} from "./availabilityUtils";
import { getServiceCategory, serviceCategories } from "./serviceCategories";
import { getLocalizedPriceLabel, getLocalizedService, groupServicesForDisplay } from "./servicePresentation";
import type { Barber, Booking, BookingDraft, Branch, Service, TimeSlot } from "./types";

type BookingErrors = Partial<Record<keyof BookingDraft, string>>;
type BookingStepKey = "info" | "branch" | "service" | "barber" | "time";
type BookingHistoryState = {
  windreadBookingStep?: BookingStepKey;
};
type StoredBooking = {
  booking: Booking;
  savedAt: number;
};

const initialDraft: BookingDraft = {
  branchId: "chuong-duong",
  serviceId: "cd-haircut",
  barberId: "any",
  date: getUpcomingDays(1)[0]?.value ?? "",
  slot: "",
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  note: "",
  guestCount: 1
};

const branchImages: Record<string, string> = {
  "an-thuong": "/images/thumb1.webp",
  "chuong-duong": "/images/branch chuong duong.webp"
};

function getLocalizedBranchName(branch: Branch | undefined, isEnglish: boolean) {
  if (!branch) return "-";
  if (!isEnglish) return branch.name;
  if (branch.id === "chuong-duong") return "Branch 01 · Chương Dương";
  if (branch.id === "an-thuong") return "Branch 02 · An Thượng";
  return branch.name;
}

const LAST_BOOKING_STORAGE_KEY = "windread-last-booking-confirmation";
const LAST_BOOKING_TTL_MS = 60 * 60 * 1000;

export function BookingExperience({ isEnglish }: { isEnglish: boolean }) {
  const [branches, setBranches] = useState<Branch[]>(() => [...bookingService.getBranches()].sort((a, b) => a.name.localeCompare(b.name)));
  const [services, setServices] = useState<Service[]>(() => bookingService.getServices(initialDraft.branchId));
  const [barbers, setBarbers] = useState<Barber[]>(() => bookingService.getBarbers(initialDraft.branchId, initialDraft.serviceId));
  const [slots, setSlots] = useState<TimeSlot[]>(() =>
    bookingService.getAvailableSlots(initialDraft.branchId, initialDraft.serviceId, initialDraft.barberId, initialDraft.date, false)
  );
  const [draft, setDraft] = useState<BookingDraft>(initialDraft);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [savedBooking, setSavedBooking] = useState<Booking | null>(null);
  const [savedBookingExpiresAt, setSavedBookingExpiresAt] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingsVersion, setBookingsVersion] = useState(0);
  const [clientReady, setClientReady] = useState(false);
  const [lockedBarberId, setLockedBarberId] = useState<string | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"forward" | "back">("forward");
  const bookingFormRef = useRef<HTMLFormElement | null>(null);
  const bookingResultRef = useRef<HTMLElement | null>(null);
  const activeStepIndexRef = useRef(activeStepIndex);

  const selectedBranch = branches.find((branch) => branch.id === draft.branchId) ?? branches[0];
  const selectedService = services.find((service) => service.id === draft.serviceId) ?? services[0];
  const filteredBarbers = barbers;
  const lockedBarber = lockedBarberId
    ? bookingService.getBarbers().find((barber) => barber.id === lockedBarberId)
    : undefined;
  const days = useMemo(() => getUpcomingDays(8, isEnglish), [isEnglish]);
  const isGroupBooking = draft.guestCount > 1;
  const bookingSteps = useMemo<{ key: BookingStepKey; label: string }[]>(
    () => lockedBarberId
      ? [
          { key: "time", label: isEnglish ? "Time" : "Ngày giờ" },
          { key: "info", label: isEnglish ? "Info" : "Thông tin" }
        ]
      : [
          { key: "branch", label: isEnglish ? "Branch" : "Cơ sở" },
          { key: "service", label: isEnglish ? "Service" : "Dịch vụ" },
          ...(isGroupBooking ? [] : [{ key: "barber" as const, label: isEnglish ? "Barber" : "Thợ" }]),
          { key: "time", label: isEnglish ? "Time" : "Ngày giờ" },
          { key: "info", label: isEnglish ? "Info" : "Thông tin" }
        ],
    [isEnglish, isGroupBooking, lockedBarberId]
  );
  const visibleStepIndex = Math.min(activeStepIndex, Math.max(bookingSteps.length - 1, 0));
  const activeStep = bookingSteps[visibleStepIndex];

  useEffect(() => {
    activeStepIndexRef.current = activeStepIndex;
  }, [activeStepIndex]);

  useEffect(() => {
    if (activeStepIndex < bookingSteps.length) return;

    const nextIndex = Math.max(bookingSteps.length - 1, 0);
    setActiveStepIndex(nextIndex);
    activeStepIndexRef.current = nextIndex;

    if (clientReady && bookingSteps[nextIndex]) {
      window.history.replaceState(
        { ...(window.history.state as BookingHistoryState | null), windreadBookingStep: bookingSteps[nextIndex].key },
        "",
        window.location.href
      );
    }
  }, [activeStepIndex, bookingSteps, clientReady]);

  const selectedSlot = slots.find((slot) => slot.startTime === draft.slot);
  const selectedBarber =
    lockedBarber ?? (draft.barberId === "any"
      ? filteredBarbers.find((barber) => selectedSlot?.barberIds.includes(barber.id))
      : filteredBarbers.find((barber) => barber.id === draft.barberId));

  useEffect(() => {
    setClientReady(true);
  }, []);

  useEffect(() => {
    if (!clientReady) return;

    const searchParams = new URLSearchParams(window.location.search);
    const barberId = searchParams.get("barber");
    const branchId = searchParams.get("branch");
    const serviceId = searchParams.get("service");
    const barber = barberId ? bookingService.getBarbers().find((item) => item.id === barberId) : undefined;
    const branch = branchId ? bookingService.getBranches().find((item) => item.id === branchId) : undefined;
    if (!barber && !branch && !serviceId) return;

    if (barber) setLockedBarberId(barber.id);
    setDraft((current) => ({
      ...current,
      branchId: barber?.branchId ?? branch?.id ?? current.branchId,
      barberId: barber?.id ?? "any",
      serviceId: barber ? barber.serviceIds[0] ?? current.serviceId : serviceId ?? current.serviceId,
      guestCount: barber ? 1 : current.guestCount,
      slot: ""
    }));
    setActiveStepIndex(0);
  }, [clientReady]);

  useEffect(() => {
    if (!clientReady) return;

    const initialState = window.history.state as BookingHistoryState | null;
    const initialStep = initialState?.windreadBookingStep;
    const initialIndex = initialStep ? bookingSteps.findIndex((step) => step.key === initialStep) : -1;

    if (initialIndex >= 0) {
      setActiveStepIndex(initialIndex);
      activeStepIndexRef.current = initialIndex;
    } else {
      window.history.replaceState(
        { ...initialState, windreadBookingStep: bookingSteps[0]?.key ?? ("info" satisfies BookingStepKey) },
        "",
        window.location.href
      );
    }

    const handlePopState = (event: PopStateEvent) => {
      const step = (event.state as BookingHistoryState | null)?.windreadBookingStep;
      const nextIndex = step ? bookingSteps.findIndex((item) => item.key === step) : -1;

      if (nextIndex < 0) return;

      setSlideDirection(nextIndex < activeStepIndexRef.current ? "back" : "forward");
      setActiveStepIndex(nextIndex);
      activeStepIndexRef.current = nextIndex;
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [bookingSteps, clientReady]);

  useEffect(() => {
    if (!clientReady) return;

    try {
      const storedBooking = window.localStorage.getItem(LAST_BOOKING_STORAGE_KEY);
      if (!storedBooking) return;
      const parsed = JSON.parse(storedBooking) as Partial<StoredBooking>;
      if (!parsed.booking || typeof parsed.savedAt !== "number") {
        window.localStorage.removeItem(LAST_BOOKING_STORAGE_KEY);
        return;
      }
      const expiresAt = parsed.savedAt + LAST_BOOKING_TTL_MS;
      if (Date.now() >= expiresAt) {
        window.localStorage.removeItem(LAST_BOOKING_STORAGE_KEY);
        return;
      }
      setSavedBooking({ ...parsed.booking, guestCount: parsed.booking.guestCount ?? 1 } as Booking);
      setSavedBookingExpiresAt(expiresAt);
    } catch {
      window.localStorage.removeItem(LAST_BOOKING_STORAGE_KEY);
    }
  }, [clientReady]);

  useEffect(() => {
    if (!savedBookingExpiresAt) return;

    const remainingMs = savedBookingExpiresAt - Date.now();
    if (remainingMs <= 0) {
      clearSavedBooking();
      return;
    }

    const timeout = window.setTimeout(clearSavedBooking, remainingMs);
    return () => window.clearTimeout(timeout);
  }, [savedBookingExpiresAt]);

  useEffect(() => {
    if (!createdBooking) return;

    window.requestAnimationFrame(() => {
      bookingResultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [createdBooking]);

  useEffect(() => {
    if (!clientReady) return;
    let active = true;

    bookingService.fetchBranches().then((nextBranches) => {
      if (!active) return;
      setBranches(nextBranches);
    });

    return () => {
      active = false;
    };
  }, [clientReady]);

  useEffect(() => {
    if (!clientReady) return;
    let active = true;

    bookingService.fetchServices(draft.branchId).then((nextServices) => {
      if (!active) return;
      setServices(nextServices);
      setDraft((current) => {
        if (current.branchId !== draft.branchId) return current;
        const serviceStillValid = nextServices.some((service) => service.id === current.serviceId);
        return {
          ...current,
          serviceId: serviceStillValid ? current.serviceId : nextServices[0]?.id ?? "",
          barberId: serviceStillValid ? current.barberId : "any",
          slot: ""
        };
      });
    });

    return () => {
      active = false;
    };
  }, [clientReady, draft.branchId]);

  useEffect(() => {
    setDraft((current) => {
      const serviceBarbers = barbers;
      const barberStillValid = lockedBarberId
        ? current.barberId === lockedBarberId
        : current.barberId === "any" || serviceBarbers.some((barber) => barber.id === current.barberId);
      return {
        ...current,
        barberId: barberStillValid ? current.barberId : lockedBarberId ?? "any",
        slot: ""
      };
    });
  }, [barbers, draft.branchId, draft.date, draft.serviceId, lockedBarberId]);

  useEffect(() => {
    if (!clientReady) return;
    let active = true;

    bookingService.fetchBarbers(draft.branchId, draft.serviceId).then((nextBarbers) => {
      if (active) setBarbers(nextBarbers);
    });

    return () => {
      active = false;
    };
  }, [clientReady, draft.branchId, draft.serviceId]);

  useEffect(() => {
    if (!clientReady) return;
    let active = true;

    bookingService
      .fetchAvailableSlots(draft.branchId, draft.serviceId, draft.barberId, draft.date)
      .then((nextSlots) => {
        if (active) {
          setSlots(draft.guestCount > 1 ? nextSlots.filter((slot) => slot.barberIds.length >= draft.guestCount) : nextSlots);
        }
      });

    return () => {
      active = false;
    };
  }, [bookingsVersion, clientReady, draft.barberId, draft.branchId, draft.date, draft.guestCount, draft.serviceId]);

  function updateDraft(value: Partial<BookingDraft>) {
    setDraft((current) => {
      const next = { ...current, ...value };
      if (next.guestCount > 1) {
        next.barberId = "any";
      }
      if (value.guestCount !== undefined || value.branchId || value.serviceId || value.barberId || value.date) {
        next.slot = "";
      }
      return next;
    });
    setErrors((current) => {
      const next = { ...current };
      Object.keys(value).forEach((key) => delete next[key as keyof BookingDraft]);
      return next;
    });
    setSubmitError("");
  }

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    const result = await bookingService.createBooking(draft);
    setIsSubmitting(false);

    if (!result.booking) {
      const nextErrors = result.errors;
      setErrors(nextErrors);
      setSubmitError(result.message);
      if (nextErrors.customerName || nextErrors.customerPhone || nextErrors.customerEmail) {
        moveToStepKey("info");
      } else if (nextErrors.branchId) {
        moveToStepKey("branch");
      } else if (nextErrors.serviceId) {
        moveToStepKey("service");
      } else if (nextErrors.barberId) {
        moveToStepKey("barber");
      } else if (nextErrors.date || nextErrors.slot) {
        moveToStepKey("time");
      }
      window.requestAnimationFrame(() => {
        bookingFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      setBookingsVersion((version) => version + 1);
      return;
    }

    setCreatedBooking(result.booking);
    setSavedBooking(result.booking);
    const savedAt = Date.now();
    setSavedBookingExpiresAt(savedAt + LAST_BOOKING_TTL_MS);
    window.localStorage.setItem(LAST_BOOKING_STORAGE_KEY, JSON.stringify({ booking: result.booking, savedAt } satisfies StoredBooking));
    setBookingsVersion((version) => version + 1);
  }

  function startNewBooking() {
    setCreatedBooking(null);
    setLockedBarberId(null);
    setDraft({ ...initialDraft, date: getUpcomingDays(1, isEnglish)[0]?.value ?? "" });
    setErrors({});
    setSubmitError("");
    setActiveStepIndex(0);
    setSlideDirection("forward");
  }

  function moveToStep(nextIndex: number) {
    const boundedIndex = Math.max(0, Math.min(bookingSteps.length - 1, nextIndex));
    if (boundedIndex === activeStepIndex) return;

    if (boundedIndex < activeStepIndex) {
      window.history.go(boundedIndex - activeStepIndex);
      return;
    }

    for (let index = activeStepIndex + 1; index <= boundedIndex; index += 1) {
      window.history.pushState(
        { ...(window.history.state as BookingHistoryState | null), windreadBookingStep: bookingSteps[index].key },
        "",
        window.location.href
      );
    }

    setSlideDirection("forward");
    setActiveStepIndex(boundedIndex);
    activeStepIndexRef.current = boundedIndex;
  }

  function moveToPreviousStep() {
    if (activeStepIndex === 0) return;
    window.history.back();
  }

  function moveToStepKey(key: BookingStepKey) {
    const index = bookingSteps.findIndex((step) => step.key === key);
    if (index >= 0) moveToStep(index);
  }

  function clearSavedBooking() {
    setSavedBooking(null);
    setSavedBookingExpiresAt(null);
    window.localStorage.removeItem(LAST_BOOKING_STORAGE_KEY);
  }

  if (createdBooking) {
    return (
      <BookingSuccess
        booking={createdBooking}
        branches={branches}
        services={services}
        barbers={barbers}
        isEnglish={isEnglish}
        onReset={startNewBooking}
        resultRef={bookingResultRef}
      />
    );
  }

  return (
    <form className="booking-console reveal" ref={bookingFormRef} onSubmit={submitBooking}>
      <div className={`booking-stepper booking-stepper-${bookingSteps.length}`} aria-label={isEnglish ? "Booking steps" : "Các bước đặt lịch"}>
        {bookingSteps.map((step, index) => (
          <button
            className={`${visibleStepIndex === index ? "is-active" : ""} ${visibleStepIndex > index ? "is-complete" : ""}`}
            type="button"
            key={step.key}
            onClick={() => moveToStep(index)}
            aria-current={visibleStepIndex === index ? "step" : undefined}
          >
            <b>{index + 1}</b>
            {step.label}
          </button>
        ))}
      </div>

      {savedBooking && (
        <SavedBookingHint
          booking={savedBooking}
          expiresAt={savedBookingExpiresAt}
          isEnglish={isEnglish}
          onView={() => {
            setCreatedBooking(savedBooking);
          }}
          onClear={clearSavedBooking}
        />
      )}

      {lockedBarber && (
        <LockedBookingContext
          branch={selectedBranch}
          barber={lockedBarber}
          isEnglish={isEnglish}
        />
      )}

      <div className="booking-wizard-shell">
        <div className="booking-step-viewport">
          <section className={`booking-panel booking-step-card slide-${slideDirection}`} key={activeStep.key}>
            {activeStep.key === "info" && (
              <>
                <CustomerInfoForm
                  draft={draft}
                  errors={errors}
                  onChange={updateDraft}
                  isEnglish={isEnglish}
                  isBarberLocked={Boolean(lockedBarberId)}
                />
                <BookingSummary
                  branch={selectedBranch}
                  service={selectedService}
                  barber={selectedBarber}
                  slot={selectedSlot}
                  draft={draft}
                  submitError={submitError}
                  isSubmitting={isSubmitting}
                  isEnglish={isEnglish}
                />
              </>
            )}

            {!lockedBarberId && activeStep.key === "branch" && (
              <BranchSelector
                branches={branches}
                selectedBranchId={draft.branchId}
                onSelect={(branchId) => updateDraft({ branchId, serviceId: "", barberId: "any", slot: "" })}
                error={errors.branchId}
                isEnglish={isEnglish}
              />
            )}

            {!lockedBarberId && activeStep.key === "service" && (
              <ServiceSelector
                services={services}
                selectedServiceId={draft.serviceId}
                onSelect={(serviceId) => updateDraft({ serviceId, barberId: "any", slot: "" })}
                error={errors.serviceId}
                isEnglish={isEnglish}
                guestCount={draft.guestCount}
              />
            )}

            {!lockedBarberId && !isGroupBooking && activeStep.key === "barber" && (
              <BarberSelector
                barbers={filteredBarbers}
                selectedBarberId={draft.barberId}
                onSelect={(barberId) => updateDraft({ barberId, slot: "" })}
                error={errors.barberId}
                isEnglish={isEnglish}
              />
            )}

            {activeStep.key === "time" && (
              <>
                <DateSelector
                  days={days}
                  selectedDate={draft.date}
                  onSelect={(date) => updateDraft({ date, slot: "" })}
                  error={errors.date}
                  isEnglish={isEnglish}
                />
                <TimeSlotPicker
                  slots={slots}
                  selectedSlot={draft.slot}
                  barbers={filteredBarbers}
                  onSelect={(slot) => updateDraft({ slot })}
                  error={errors.slot}
                  isEnglish={isEnglish}
                  guestCount={draft.guestCount}
                />
              </>
            )}
          </section>
        </div>

        <div className="booking-wizard-nav">
          <button
            className="ghost-button"
            type="button"
            onClick={moveToPreviousStep}
            disabled={visibleStepIndex === 0}
          >
            {isEnglish ? "Back" : "Quay lại"}
          </button>
          <span>
            {visibleStepIndex + 1}/{bookingSteps.length}
          </span>
          {visibleStepIndex < bookingSteps.length - 1 ? (
            <button className="book-button" type="button" onClick={() => moveToStep(visibleStepIndex + 1)}>
              {isEnglish ? "Next" : "Tiếp tục"}
            </button>
          ) : (
            <span className="booking-nav-hint">{isEnglish ? "Review and confirm below" : "Kiểm tra rồi xác nhận bên trên"}</span>
          )}
        </div>
      </div>
    </form>
  );
}

function LockedBookingContext({
  branch,
  barber,
  isEnglish
}: {
  branch?: Branch;
  barber: Barber;
  isEnglish: boolean;
}) {
  return (
    <aside className="booking-locked-context" aria-label={isEnglish ? "Selected barber" : "Barber đã chọn"}>
      <div>
        <span className="booking-locked-media">
          <Image src={barber.avatar} alt="" width={82} height={104} />
        </span>
        <div className="booking-locked-copy">
          <span>{isEnglish ? "Barber selected" : "Barber đã chọn"}</span>
          <strong>{barber.name}</strong>
          <small>{barber.title}</small>
        </div>
      </div>
      <div>
        <span className="booking-locked-media">
          <Image
            src={branch?.image ?? branchImages[branch?.id ?? ""] ?? "/images/barbershop-interior-v2.png"}
            alt=""
            width={150}
            height={104}
          />
        </span>
        <div className="booking-locked-copy">
          <span>{isEnglish ? "Branch" : "Cơ sở"}</span>
          <strong>{getLocalizedBranchName(branch, isEnglish)}</strong>
          <small>{branch?.address ?? "-"}</small>
        </div>
      </div>
    </aside>
  );
}

function SavedBookingHint({
  booking,
  expiresAt,
  isEnglish,
  onView,
  onClear
}: {
  booking: Booking;
  expiresAt: number | null;
  isEnglish: boolean;
  onView: () => void;
  onClear: () => void;
}) {
  const minutesLeft = expiresAt ? Math.max(1, Math.ceil((expiresAt - Date.now()) / 60000)) : 60;

  return (
    <div className="saved-booking-hint">
      <div>
        <span>{isEnglish ? "Booking request saved on this device" : "Yêu cầu đặt lịch đã lưu trên máy này"}</span>
        <strong>{isEnglish ? "Waiting for staff confirmation" : "Đang chờ nhân viên xác minh"}</strong>
        <small>
          {formatBookingTime(booking.startTime, isEnglish)} / {isEnglish ? `${minutesLeft} min left` : `còn ${minutesLeft} phút`}
        </small>
      </div>
      <div className="saved-booking-actions">
        <button className="ghost-button" type="button" onClick={onView}>
          {isEnglish ? "View request" : "Xem lịch đã gửi"}
        </button>
        <button className="ghost-button" type="button" onClick={onClear}>
          {isEnglish ? "Dismiss" : "Ẩn thông báo"}
        </button>
      </div>
    </div>
  );
}

function BranchSelector({
  branches,
  selectedBranchId,
  onSelect,
  error,
  isEnglish
}: {
  branches: Branch[];
  selectedBranchId: string;
  onSelect: (branchId: string) => void;
  error?: string;
  isEnglish: boolean;
}) {
  return (
    <div className="booking-block">
      <h3>{isEnglish ? "Choose branch" : "Chọn cơ sở"}</h3>
      <div className="booking-choice-grid two">
        {branches.map((branch) => {
          const branchImage = branch.image ?? branchImages[branch.id] ?? "/images/barbershop-interior-v2.png";
          return (
            <button
              className={`branch-pick ${selectedBranchId === branch.id ? "is-selected" : ""}`}
              type="button"
              key={branch.id}
              onClick={() => onSelect(branch.id)}
            >
              <span className="branch-pick-media">
                <Image src={branchImage} alt={`${branch.name} - ${branch.address}`} width={520} height={320} />
              </span>
              <strong>{getLocalizedBranchName(branch, isEnglish)}</strong>
              <span>{branch.address}</span>
            </button>
          );
        })}
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

function ServiceSelector({
  services,
  selectedServiceId,
  onSelect,
  error,
  isEnglish,
  guestCount
}: {
  services: Service[];
  selectedServiceId: string;
  onSelect: (serviceId: string) => void;
  error?: string;
  isEnglish: boolean;
  guestCount: number;
}) {
  const availableCategories = serviceCategories.filter((category) =>
    services.some((service) => getServiceCategory(service) === category.id)
  );
  const [activeCategory, setActiveCategory] = useState(availableCategories[0]?.id ?? "barber");
  const visibleCategory = availableCategories.some((category) => category.id === activeCategory)
    ? activeCategory
    : (availableCategories[0]?.id ?? "barber");
  const currentCategory = serviceCategories.find((category) => category.id === visibleCategory);
  const categoryServices = services.filter((service) => getServiceCategory(service) === visibleCategory);
  const serviceSections = groupServicesForDisplay(categoryServices, isEnglish);

  return (
    <div className="booking-block">
      <h3>{isEnglish ? "Choose service" : "Chọn dịch vụ"}</h3>
      {guestCount > 1 && (
        <div className="group-booking-note">
          <strong>{isEnglish ? `${guestCount} guests, one shared service` : `${guestCount} khách, cùng một dịch vụ`}</strong>
          <span>
            {isEnglish
              ? "We will match enough available barbers so your group can start together."
              : "Crew sẽ xếp đủ thợ còn trống để cả nhóm bắt đầu cùng lúc."}
          </span>
        </div>
      )}
      <div className="service-category-tabs" role="tablist" aria-label={isEnglish ? "Service groups" : "Nhóm dịch vụ"}>
        {availableCategories.map((category) => (
          <button
            className={visibleCategory === category.id ? "is-active" : ""}
            type="button"
            role="tab"
            aria-selected={visibleCategory === category.id}
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
          >
            <strong>{isEnglish ? category.labelEn : category.label}</strong>
            <span>{isEnglish ? category.descriptionEn : category.description}</span>
          </button>
        ))}
      </div>
      {currentCategory && (
        <div className="service-category-heading">
          <span>{isEnglish ? currentCategory.labelEn : currentCategory.label}</span>
          <small>{categoryServices.length} {isEnglish ? "services" : "dịch vụ"}</small>
        </div>
      )}
      <div className="service-section-list">
        {serviceSections.map((section) => (
          <section className="service-section" key={section.id}>
            <h4>{section.label}</h4>
            <div className="service-pick-grid">
              {section.services.map((service) => {
                const localizedService = getLocalizedService(service, isEnglish);
                return (
                  <button
                    className={selectedServiceId === service.id ? "is-selected" : ""}
                    type="button"
                    key={service.id}
                    onClick={() => onSelect(service.id)}
                  >
                    <strong>{localizedService.name}</strong>
                    <span>{service.durationMinutes} {isEnglish ? "min" : "phút"}</span>
                    <small>{getLocalizedPriceLabel(service, isEnglish) || formatCurrency(service.price, isEnglish)}</small>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

function BarberSelector({
  barbers,
  selectedBarberId,
  onSelect,
  error,
  isEnglish
}: {
  barbers: Barber[];
  selectedBarberId: string;
  onSelect: (barberId: string) => void;
  error?: string;
  isEnglish: boolean;
}) {
  return (
    <div className="booking-block">
      <h3>{isEnglish ? "Choose barber" : "Chọn barber"}</h3>
      <div className="barber-pick-grid">
        <button
          className={`barber-pick any ${selectedBarberId === "any" ? "is-selected" : ""}`}
          type="button"
          onClick={() => onSelect("any")}
        >
          <span className="barber-avatar-fallback">
            <Image src="/images/windread-mark.png" alt="" width={180} height={180} />
          </span>
          <strong>{isEnglish ? "Any crew" : "Thợ bất kỳ"}</strong>
          <small>{isEnglish ? "Auto-pick available barber" : "Tự chọn thợ còn trống"}</small>
        </button>
        {barbers.map((barber) => (
          <button
            className={`barber-pick ${selectedBarberId === barber.id ? "is-selected" : ""}`}
            type="button"
            key={barber.id}
            onClick={() => onSelect(barber.id)}
          >
            <span className="barber-photo-frame">
              <Image src={barber.avatar} alt={`${barber.name} - ${barber.title}`} width={320} height={454} />
            </span>
            <strong>{barber.name}</strong>
            <small>{barber.title}</small>
          </button>
        ))}
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

function DateSelector({
  days,
  selectedDate,
  onSelect,
  error,
  isEnglish
}: {
  days: { value: string; label: string }[];
  selectedDate: string;
  onSelect: (date: string) => void;
  error?: string;
  isEnglish: boolean;
}) {
  return (
    <div className="booking-block">
      <h3>{isEnglish ? "Choose date" : "Chọn ngày"}</h3>
      <div className="date-strip">
        {days.map((day) => (
          <button
            className={selectedDate === day.value ? "is-selected" : ""}
            type="button"
            key={day.value}
            onClick={() => onSelect(day.value)}
          >
            {day.label}
          </button>
        ))}
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

function TimeSlotPicker({
  slots,
  selectedSlot,
  barbers,
  onSelect,
  error,
  isEnglish,
  guestCount
}: {
  slots: TimeSlot[];
  selectedSlot: string;
  barbers: Barber[];
  onSelect: (slot: string) => void;
  error?: string;
  isEnglish: boolean;
  guestCount: number;
}) {
  return (
    <div className="booking-block">
      <div className="booking-block-title">
        <h3>{isEnglish ? "Available slots" : "Khung giờ còn trống"}</h3>
        <span>+{BOOKING_BUFFER_MINUTES} {isEnglish ? "min buffer" : "phút buffer"}</span>
      </div>
      {slots.length > 0 ? (
        <div className="slot-grid">
          {slots.map((slot) => {
            const firstBarber = barbers.find((barber) => slot.barberIds.includes(barber.id));
            return (
              <button
                className={selectedSlot === slot.startTime ? "is-selected" : ""}
                type="button"
                key={slot.startTime}
                onClick={() => onSelect(slot.startTime)}
              >
                <strong>{slot.label}</strong>
                <span>
                  {guestCount > 1
                    ? (isEnglish ? `${guestCount} barbers ready` : `${guestCount} thợ sẵn sàng`)
                    : `${firstBarber?.name ?? "Crew"} ready`}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="booking-empty">
          {guestCount > 1
            ? (isEnglish ? "No time has enough barbers for your group. Try another date." : "Không còn khung giờ đủ thợ cho cả nhóm. Hãy thử ngày khác.")
            : (isEnglish ? "No open slot for this setup. Try another date or any crew." : "Không còn slot phù hợp. Thử ngày khác hoặc chọn Thợ bất kỳ.")}
        </div>
      )}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

function CustomerInfoForm({
  draft,
  errors,
  onChange,
  isEnglish,
  isBarberLocked
}: {
  draft: BookingDraft;
  errors: BookingErrors;
  onChange: (value: Partial<BookingDraft>) => void;
  isEnglish: boolean;
  isBarberLocked: boolean;
}) {
  return (
    <div className="booking-block">
      <h3>{isEnglish ? "Your info" : "Thông tin khách"}</h3>
      <div className="booking-guest-count" aria-describedby="guest-count-help">
        <label className="booking-guest-select">
          <span>{isEnglish ? "Guests" : "Số khách"}</span>
          <select
            value={draft.guestCount}
            onChange={(event) => onChange({ guestCount: Number(event.target.value) })}
          >
            {[1, 2, 3, 4].map((count) => (
              <option key={count} value={count} disabled={isBarberLocked && count > 1}>
                {count} {isEnglish ? (count === 1 ? "guest" : "guests") : "khách"}
              </option>
            ))}
          </select>
        </label>
        <p id="guest-count-help">
          {isBarberLocked
            ? (isEnglish ? "This barber booking is for one chair. For a group, start a new booking so we can match the full crew." : "Lịch với barber đã chọn giữ một ghế. Đặt nhóm hãy bắt đầu lịch mới để crew xếp đủ thợ.")
            : draft.guestCount > 1
              ? (isEnglish ? "Your group shares branch, service and time. We automatically reserve separate available barbers." : "Cả nhóm dùng chung cơ sở, dịch vụ và giờ. Hệ thống tự giữ ghế với các thợ đang trống.")
              : (isEnglish ? "Booking for yourself. Add guests when you want to come together." : "Đặt cho một người. Tăng số khách khi bạn muốn đến cùng nhóm.")}
        </p>
      </div>
      <div className="field-pair">
        <label>
          <span>{isEnglish ? "Full name" : "Họ tên"}</span>
          <input
            type="text"
            value={draft.customerName}
            onChange={(event) => onChange({ customerName: event.target.value })}
            autoComplete="name"
          />
          {errors.customerName && <small className="field-error">{errors.customerName}</small>}
        </label>
        <label>
          <span>{isEnglish ? "Phone / WhatsApp" : "Số điện thoại / WhatsApp"}</span>
          <input
            type="tel"
            value={draft.customerPhone}
            onChange={(event) => onChange({ customerPhone: event.target.value })}
            autoComplete="tel"
            placeholder={isEnglish ? "090… / +1 or your country code" : "090… / +1 hoặc mã quốc gia của bạn"}
            title={isEnglish ? "Use your country code if you do not have a Vietnamese number." : "Nếu không dùng số Việt Nam, hãy nhập kèm mã quốc gia."}
          />
          {errors.customerPhone && <small className="field-error">{errors.customerPhone}</small>}
        </label>
      </div>
      <label>
        <span>{isEnglish ? "Email (optional)" : "Email không bắt buộc"}</span>
        <input
          type="email"
          value={draft.customerEmail}
          onChange={(event) => onChange({ customerEmail: event.target.value })}
          autoComplete="email"
        />
        {errors.customerEmail && <small className="field-error">{errors.customerEmail}</small>}
      </label>
      <label>
        <span>{isEnglish ? "Note (optional)" : "Ghi chú không bắt buộc"}</span>
        <textarea
          rows={4}
          value={draft.note}
          onChange={(event) => onChange({ note: event.target.value })}
          placeholder={isEnglish ? "E.g. WhatsApp only, text only / please do not call, or anything the crew should know before your visit." : "VD: Liên hệ qua WhatsApp, chỉ nhắn tin / không gọi điện, hoặc điều crew cần biết trước khi bạn đến."}
        />
        <small className="field-hint">{isEnglish ? "We will follow your preferred contact method when confirming the appointment." : "Crew sẽ ưu tiên cách liên hệ bạn ghi ở đây khi xác nhận lịch."}</small>
      </label>
    </div>
  );
}

function BookingSummary({
  branch,
  service,
  barber,
  slot,
  draft,
  submitError,
  isSubmitting,
  isEnglish
}: {
  branch?: Branch;
  service?: Service;
  barber?: Barber;
  slot?: TimeSlot;
  draft: BookingDraft;
  submitError: string;
  isSubmitting: boolean;
  isEnglish: boolean;
}) {
  return (
    <aside className="booking-summary">
      <div className="booking-summary-heading">
        <p className="section-kicker">{isEnglish ? "Confirm" : "Xác nhận"}</p>
        <h3>{isEnglish ? "Chair summary" : "Thông tin giữ ghế"}</h3>
      </div>
      <dl>
        <div>
          <dt>{isEnglish ? "Branch" : "Cơ sở"}</dt>
          <dd>{branch?.address ?? "-"}</dd>
        </div>
        <div>
          <dt>{isEnglish ? "Service" : "Dịch vụ"}</dt>
          <dd>{service ? `${getLocalizedService(service, isEnglish).name} / ${service.durationMinutes} ${isEnglish ? "min" : "phút"}` : "-"}</dd>
        </div>
        <div>
          <dt>{isEnglish ? "Guests" : "Số khách"}</dt>
          <dd>{draft.guestCount} {isEnglish ? (draft.guestCount === 1 ? "guest" : "guests") : "khách"}</dd>
        </div>
        <div>
          <dt>{isEnglish ? "Barber" : "Thợ"}</dt>
          <dd>{draft.guestCount > 1 ? (isEnglish ? "Crew auto-matched" : "Crew tự xếp thợ") : barber?.name ?? (draft.barberId === "any" ? "Thợ bất kỳ" : "-")}</dd>
        </div>
        <div>
          <dt>{isEnglish ? "Time" : "Ngày giờ"}</dt>
          <dd>{slot ? formatBookingTime(slot.startTime, isEnglish) : "-"}</dd>
        </div>
        <div>
          <dt>{isEnglish ? "Phone" : "Số điện thoại"}</dt>
          <dd>{draft.customerPhone || "-"}</dd>
        </div>
      </dl>
      <div className="booking-summary-actions">
        <button className="book-button large" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (isEnglish ? "Holding slot..." : "Đang giữ ghế...") : isEnglish ? "Confirm booking" : "Xác nhận đặt lịch"}
        </button>
      </div>
      {submitError && <p className="booking-alert">{submitError}</p>}
      <p className="booking-fineprint">
        {isEnglish
          ? "A group booking reserves one available barber per guest at the same time."
          : "Lịch nhóm sẽ giữ một thợ còn trống cho mỗi khách tại cùng một khung giờ."}
      </p>
    </aside>
  );
}

function BookingSuccess({
  booking,
  branches,
  services,
  barbers,
  isEnglish,
  onReset,
  resultRef
}: {
  booking: Booking;
  branches: Branch[];
  services: Service[];
  barbers: Barber[];
  isEnglish: boolean;
  onReset: () => void;
  resultRef: RefObject<HTMLElement | null>;
}) {
  const branch = branches.find((item) => item.id === booking.branchId);
  const service = services.find((item) => item.id === booking.serviceId);
  const barber = barbers.find((item) => item.id === booking.barberId);

  return (
    <section className="booking-success inline-visible" ref={resultRef} aria-live="polite">
      <div className="booking-success-top">
        <span className="success-mark"><Image src="/images/windread-mark.png" alt="" width={1420} height={1414} /></span>
      </div>
      <h3>{isEnglish ? "Your booking request has been received." : "Đã nhận yêu cầu đặt lịch của bạn."}</h3>
      <p className="booking-success-note">
        {isEnglish
          ? "Our staff will contact you at the phone number or WhatsApp you provided to verify the appointment. The time is only confirmed after the crew replies."
          : "Nhân viên sẽ liên hệ qua số điện thoại hoặc WhatsApp bạn đã cung cấp để xác minh lịch. Lịch chỉ được xác nhận sau khi crew phản hồi."}
      </p>
      <div className="booking-contact-card">
        <span>{isEnglish ? "Confirmation contact" : "Thông tin xác minh"}</span>
        <strong>{isEnglish ? `We will contact ${booking.customerPhone}` : `Crew sẽ liên hệ ${booking.customerPhone}`}</strong>
        <p>{booking.note ? (isEnglish ? `Your note: ${booking.note}` : `Ghi chú của bạn: ${booking.note}`) : (isEnglish ? "No contact preference was added. We will use the phone number above." : "Bạn chưa để lại cách liên hệ riêng. Crew sẽ dùng số điện thoại bên trên.")}</p>
      </div>
      <dl>
        <dt>{isEnglish ? "Service" : "Dịch vụ"}</dt>
        <dd>{service ? getLocalizedService(service, isEnglish).name : "-"}</dd>
        <dt>{isEnglish ? "Guests" : "Số khách"}</dt>
        <dd>{booking.guestCount} {isEnglish ? (booking.guestCount === 1 ? "guest" : "guests") : "khách"}</dd>
        <dt>{isEnglish ? "Barber" : "Thợ"}</dt>
        <dd>{booking.guestCount > 1 ? (isEnglish ? "Crew auto-matched" : "Crew tự xếp thợ") : barber?.name}</dd>
        <dt>{isEnglish ? "Branch" : "Cơ sở"}</dt>
        <dd>{branch?.address}</dd>
        <dt>{isEnglish ? "Time" : "Ngày giờ"}</dt>
        <dd>{formatBookingTime(booking.startTime, isEnglish)}</dd>
        <dt>{isEnglish ? "Phone" : "Số điện thoại"}</dt>
        <dd>{booking.customerPhone}</dd>
      </dl>
      <div className="success-actions">
        <a className="ghost-button" href="/">
          {isEnglish ? "Back home" : "Về trang chủ"}
        </a>
        <button className="book-button" type="button" onClick={onReset}>
          {isEnglish ? "Book another" : "Đặt lịch mới"}
        </button>
      </div>
    </section>
  );
}
