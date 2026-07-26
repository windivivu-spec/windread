import { formatBookingTime } from "./availabilityUtils";
import type { Booking } from "./types";

type EmailAddress = {
  email: string;
  name?: string;
};

type BookingEmailDetails = {
  barberEmail?: string;
  barberName?: string;
  branchName?: string;
  branchAddress?: string;
  serviceName?: string;
};

const brevoEmailUrl = "https://api.brevo.com/v3/smtp/email";

function parseEmailAddress(value?: string): EmailAddress | null {
  if (!value) return null;

  const match = value.match(/^(.*?)<([^>]+)>$/);
  if (match) {
    return {
      name: match[1].trim() || undefined,
      email: match[2].trim()
    };
  }

  return { email: value.trim() };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildBookingEmail(booking: Booking, details: BookingEmailDetails) {
  const rows = [
    ["Mã đặt lịch", booking.id],
    ["Khách", booking.customerName],
    ["Số điện thoại", booking.customerPhone],
    ["Dịch vụ", details.serviceName || booking.serviceId],
    ["Thợ", details.barberName || booking.barberId],
    ["Cơ sở", details.branchName || booking.branchId],
    ["Địa chỉ", details.branchAddress || "-"],
    ["Ngày giờ", formatBookingTime(booking.startTime)],
    ["Ghi chú", booking.note || "-"]
  ];

  const text = [
    "Bạn có lịch đặt mới từ WINDREAD.",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Vui lòng kiểm tra lịch và chuẩn bị xác nhận với khách nếu cần."
  ].join("\n");

  const htmlRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 12px;color:#8f8f8f;border-bottom:1px solid #2c1518;">${escapeHtml(label)}</td>
          <td style="padding:8px 12px;color:#fff;border-bottom:1px solid #2c1518;"><strong>${escapeHtml(value)}</strong></td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;background:#170006;color:#fff;padding:24px;">
      <div style="max-width:560px;margin:0 auto;border:1px solid #5c1d25;padding:24px;">
        <p style="margin:0 0 8px;color:#ff4b5f;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">WINDREAD BOOKING</p>
        <h1 style="margin:0 0 12px;font-size:28px;line-height:1.1;">Bạn có lịch đặt mới</h1>
        <p style="margin:0 0 20px;color:#d9c8c8;">Khách đã giữ chỗ. Vui lòng kiểm tra thông tin bên dưới.</p>
        <table style="width:100%;border-collapse:collapse;background:#24070c;">${htmlRows}</table>
      </div>
    </div>`;

  return { text, html };
}

export async function sendBarberBookingEmail(booking: Booking, details: BookingEmailDetails) {
  if (typeof window !== "undefined") return { sent: false, reason: "Email can only be sent on the server." };

  const apiKey = process.env.BREVO_API_KEY;
  const sender = parseEmailAddress(process.env.BOOKING_EMAIL_FROM);
  const replyTo = parseEmailAddress(process.env.BOOKING_EMAIL_REPLY_TO);

  if (!apiKey || !sender) {
    const reason = "Brevo email env is not configured.";
    console.warn(reason);
    return { sent: false, reason };
  }

  if (!details.barberEmail) {
    const reason = `Barber email is missing for booking ${booking.id}.`;
    console.warn(reason);
    return { sent: false, reason };
  }

  const content = buildBookingEmail(booking, details);
  const response = await fetch(brevoEmailUrl, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json"
    },
    body: JSON.stringify({
      sender,
      to: [{ email: details.barberEmail, name: details.barberName }],
      replyTo: replyTo || undefined,
      subject: `Booking mới ${booking.id} - ${formatBookingTime(booking.startTime)}`,
      textContent: content.text,
      htmlContent: content.html
    })
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Brevo booking email failed.");
  }

  console.info(`Brevo sent booking ${booking.id} to ${details.barberEmail}.`);
  return { sent: true, messageId: data.messageId as string | undefined };
}
