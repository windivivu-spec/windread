# WINDREAD Barber Website

## Booking data layer

The booking flow talks to local Next.js API routes first:

- `GET /api/branches`
- `GET /api/services`
- `GET /api/barbers?branchId=...&serviceId=...`
- `GET /api/available-slots?branchId=...&serviceId=...&barberId=...&date=...`
- `POST /api/bookings`
- `GET /api/bookings/:id`

Those API routes use Supabase REST from the server when these env vars are configured:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

If Supabase env is missing, the booking flow falls back to mock data in `app/booking/mockBookingData.ts`.

The SQL schema and seed data live at `supabase/migrations/202607060420_booking.sql`. Apply it through the Supabase MCP tool, Supabase SQL editor, or a Postgres connection using `SUPABASE_DB_URL`.

## Google Calendar

`app/booking/calendar.ts` syncs new bookings to Google Calendar with a Google service account.
Setup steps:

1. In Google Cloud Console, create or select a project.
2. Enable **Google Calendar API**.
3. Create a **Service account**.
4. Create a JSON key for that service account.
5. Open the target Google Calendar settings and share the calendar with the service account email.
6. Give that service account permission to **Make changes to events**.
7. Copy the calendar ID from Calendar settings.
8. Add these env vars:

- `GOOGLE_CALENDAR_ID`
- `GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_CALENDAR_PRIVATE_KEY`
- `GOOGLE_CALENDAR_TIME_ZONE`

For `GOOGLE_CALENDAR_PRIVATE_KEY`, keep the key as one line with escaped newlines:

```env
GOOGLE_CALENDAR_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Restart `npm run dev` after changing env vars.

## Facebook Messenger AI assistant (Vertex AI)

The Facebook Page chatbot webhook is available at:

- `GET /api/messenger/webhook` for Meta webhook verification
- `POST /api/messenger/webhook` for Messenger events

It answers from WINDREAD's official address, expertise, hours, policies and price board. For booking, Gemini uses server-side tools to read the live Supabase catalog, check real availability and call the same `createBooking` flow as the website. Booking overlap protection, Google Calendar sync and barber email notifications therefore remain shared with the website.

### 1. Apply the chatbot migration

Apply `supabase/migrations/20260720070433_messenger_ai_chat.sql`. It adds private, RLS-enabled tables for conversation history and Messenger webhook de-duplication. Only the server-side `service_role` has table access.

### 2. Configure Google Cloud Vertex AI

For the simplest Vercel setup, create a Vertex AI Express Mode API key and add these server-only environment variables:

```env
GOOGLE_VERTEX_API_KEY=your-express-mode-api-key
GOOGLE_VERTEX_MODEL=gemini-3.5-flash
```

Do not prefix the key with `NEXT_PUBLIC_`. With Express Mode, `GOOGLE_CLOUD_PROJECT` and `GOOGLE_VERTEX_SERVICE_ACCOUNT_JSON` can remain empty.

Standard Vertex AI authentication is also supported. Enable the Vertex AI API, grant a service account permission to call Vertex AI models (for example, `Vertex AI User`), then configure:

```env
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=asia-southeast1
GOOGLE_VERTEX_MODEL=gemini-3.5-flash
GOOGLE_VERTEX_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"..."}
```

Application Default Credentials also work on Google Cloud; in that case, omit `GOOGLE_VERTEX_SERVICE_ACCOUNT_JSON`.

### 3. Connect the Meta app and Facebook Page

1. Deploy the site to a public HTTPS domain.
2. In Meta for Developers, add the Messenger product and connect the barber shop's Facebook Page.
3. Set the callback URL to `https://YOUR_DOMAIN/api/messenger/webhook`.
4. Choose a strong random verify token and use the same value in Meta and `META_WEBHOOK_VERIFY_TOKEN`.
5. Subscribe the Page to `messages` and `messaging_postbacks`.
6. Add the App Secret and Page Access Token as server-only environment variables:

```env
META_APP_SECRET=...
META_PAGE_ACCESS_TOKEN=...
META_WEBHOOK_VERIFY_TOKEN=...
META_GRAPH_API_VERSION=v23.0
```

Never expose the Meta token, App Secret, Supabase service-role key or Google service-account JSON through a `NEXT_PUBLIC_` variable. For public customers outside the app's test roles, complete the Meta app review and switch the app to Live mode.

## Booking email notifications

New bookings can send a Brevo transactional email to the selected barber when the barber row has an `email`.

Add these env vars:

- `BREVO_API_KEY`
- `BOOKING_EMAIL_FROM`
- `BOOKING_EMAIL_REPLY_TO` optional

Example:

```env
BREVO_API_KEY=xkeysib-...
BOOKING_EMAIL_FROM=Windread Booking <booking@windread.vn>
BOOKING_EMAIL_REPLY_TO=shop@gmail.com
```

Restart `npm run dev` after changing env vars.
