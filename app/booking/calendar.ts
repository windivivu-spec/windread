import type { Booking } from "./types";

type GoogleCalendarConfig = {
  calendarId: string;
  serviceAccountEmail: string;
  privateKey: string;
  timeZone: string;
};

type TokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type CalendarSyncOptions = {
  barberEmail?: string;
};

const calendarScope = "https://www.googleapis.com/auth/calendar";
const tokenUrl = "https://oauth2.googleapis.com/token";

function googleCalendarConfig(): GoogleCalendarConfig | null {
  if (typeof window !== "undefined") return null;

  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const serviceAccountEmail = process.env.GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_CALENDAR_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!calendarId || !serviceAccountEmail || !privateKey) return null;
  if (!privateKey.includes("-----BEGIN PRIVATE KEY-----") || !privateKey.includes("-----END PRIVATE KEY-----")) {
    throw new Error(
      "GOOGLE_CALENDAR_PRIVATE_KEY must be the full service account private_key value, including BEGIN/END PRIVATE KEY."
    );
  }

  return {
    calendarId,
    serviceAccountEmail,
    privateKey,
    timeZone: process.env.GOOGLE_CALENDAR_TIME_ZONE || "Asia/Ho_Chi_Minh"
  };
}

function base64Url(value: string | ArrayBuffer) {
  const buffer = typeof value === "string" ? Buffer.from(value) : Buffer.from(value);
  return buffer
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function privateKeyToArrayBuffer(privateKey: string) {
  const base64 = privateKey
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s/g, "");
  return Buffer.from(base64, "base64");
}

async function getGoogleAccessToken(config: GoogleCalendarConfig) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64Url(
    JSON.stringify({
      iss: config.serviceAccountEmail,
      scope: calendarScope,
      aud: tokenUrl,
      exp: now + 3600,
      iat: now
    })
  );
  const unsignedJwt = `${header}.${claim}`;
  const key = await crypto.subtle.importKey(
    "pkcs8",
    privateKeyToArrayBuffer(config.privateKey),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    Buffer.from(unsignedJwt)
  );
  const assertion = `${unsignedJwt}.${base64Url(signature)}`;

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion
    })
  });
  const data = (await response.json()) as TokenResponse;

  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || "Google token request failed.");
  }

  return data.access_token;
}

export async function syncBookingToCalendar(booking: Booking, options: CalendarSyncOptions = {}) {
  const config = googleCalendarConfig();
  if (!config) {
    const result = { synced: false, reason: "Google Calendar service account env is not configured." };
    console.warn(result.reason);
    return result;
  }

  const accessToken = await getGoogleAccessToken(config);
  const eventBody = {
    summary: `WINDREAD booking ${booking.id}`,
    description: [
      `Mã booking: ${booking.id}`,
      `Khách: ${booking.customerName}`,
      `SĐT: ${booking.customerPhone}`,
      `Email: ${booking.customerEmail || "-"}`,
      `Cơ sở: ${booking.branchId}`,
      `Dịch vụ: ${booking.serviceId}`,
      `Thợ: ${booking.barberId}`,
      `Ghi chú: ${booking.note || "-"}`
    ].join("\n"),
    start: {
      dateTime: booking.startTime,
      timeZone: config.timeZone
    },
    end: {
      dateTime: booking.endTime,
      timeZone: config.timeZone
    }
  };
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(config.calendarId)}/events`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/json"
      },
      body: JSON.stringify(eventBody)
    }
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Google Calendar event insert failed.");
  }

  const result = { synced: true, eventId: data.id as string };
  console.info(`Google Calendar synced booking ${booking.id} to event ${result.eventId}.`);

  if (options.barberEmail) {
    try {
      const attendeeResponse = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(config.calendarId)}/events/${encodeURIComponent(result.eventId)}?sendUpdates=all`,
        {
          method: "PATCH",
          headers: {
            authorization: `Bearer ${accessToken}`,
            "content-type": "application/json"
          },
          body: JSON.stringify({
            attendees: [{ email: options.barberEmail }]
          })
        }
      );
      const attendeeData = await attendeeResponse.json();

      if (!attendeeResponse.ok) {
        console.warn(
          `Google Calendar attendee invite failed for ${booking.id}: ${
            attendeeData?.error?.message || "Calendar attendee update failed."
          }`
        );
      }
    } catch (error) {
      console.warn(`Google Calendar attendee invite failed for ${booking.id}:`, error);
    }
  }

  return result;
}
