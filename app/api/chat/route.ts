import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { deleteChatHistory, getChatHistory, saveChatMessage } from "../../chatbot/store";
import { generateChatReply } from "../../chatbot/provider";
import {
  getChatSuggestions,
  languageForChatText,
  type ChatLanguage
} from "../../chatbot/suggestions";
import {
  confirmParsedBookingSummary,
  hasExplicitConfirmation,
  parseBookingSummary,
  type ParsedBookingSummary
} from "../../chatbot/vertex";

export const runtime = "nodejs";
export const maxDuration = 60;

const COOKIE_NAME = "windread_chat_session";
const PENDING_BOOKING_COOKIE = "windread_pending_booking";
const PENDING_BOOKING_TTL_SECONDS = 15 * 60;
const MAX_MESSAGE_LENGTH = 1200;
const MAX_REQUESTS_PER_MINUTE = 12;

type RateLimitEntry = { count: number; resetAt: number };
const globalForChatRateLimit = globalThis as typeof globalThis & {
  windreadChatRateLimit?: Map<string, RateLimitEntry>;
};

function rateLimitStore() {
  if (!globalForChatRateLimit.windreadChatRateLimit) {
    globalForChatRateLimit.windreadChatRateLimit = new Map();
  }
  return globalForChatRateLimit.windreadChatRateLimit;
}

function sessionId(request: NextRequest) {
  const existing = request.cookies.get(COOKIE_NAME)?.value;
  if (existing && /^[0-9a-f-]{36}$/i.test(existing)) return existing;
  return randomUUID();
}

function senderIdFor(session: string) {
  return `web:${session}`;
}

function withSessionCookie(response: NextResponse, session: string) {
  response.cookies.set(COOKIE_NAME, session, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
  return response;
}

function pendingBookingSecret() {
  return process.env.CHATBOT_STATE_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

function signPendingBooking(draft: ParsedBookingSummary) {
  const secret = pendingBookingSecret();
  if (!secret) return null;
  const payload = Buffer.from(
    JSON.stringify({ draft, expiresAt: Date.now() + PENDING_BOOKING_TTL_SECONDS * 1000 })
  ).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function readPendingBooking(request: NextRequest): ParsedBookingSummary | null {
  const secret = pendingBookingSecret();
  const token = request.cookies.get(PENDING_BOOKING_COOKIE)?.value;
  if (!secret || !token) return null;
  const [payload, signature, ...extra] = token.split(".");
  if (!payload || !signature || extra.length > 0) return null;
  const expected = createHmac("sha256", secret).update(payload).digest();
  let supplied: Buffer;
  try {
    supplied = Buffer.from(signature, "base64url");
  } catch {
    return null;
  }
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;

  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      draft?: ParsedBookingSummary;
      expiresAt?: number;
    };
    if (!decoded.draft || typeof decoded.expiresAt !== "number" || decoded.expiresAt < Date.now()) {
      return null;
    }
    return decoded.draft;
  } catch {
    return null;
  }
}

function setPendingBookingCookie(response: NextResponse, draft: ParsedBookingSummary | null) {
  if (!draft) {
    response.cookies.set(PENDING_BOOKING_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0
    });
    return response;
  }
  const token = signPendingBooking(draft);
  if (!token) return response;
  response.cookies.set(PENDING_BOOKING_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: PENDING_BOOKING_TTL_SECONDS
  });
  return response;
}

function pendingBookingFromHistory(messages: Awaited<ReturnType<typeof getChatHistory>>) {
  for (let index = messages.length - 1; index >= Math.max(0, messages.length - 12); index -= 1) {
    const message = messages[index];
    if (message.role !== "model") continue;
    const draft = parseBookingSummary(message.content);
    if (!draft) continue;
    const changedAfterSummary = messages
      .slice(index + 1)
      .some((item) => item.role === "user" && !hasExplicitConfirmation(item.content));
    return changedAfterSummary ? null : draft;
  }
  return null;
}

function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const expectedHost = request.headers.get("x-forwarded-host") || request.headers.get("host");
  try {
    return Boolean(expectedHost) && new URL(origin).host === expectedHost;
  } catch {
    return false;
  }
}

function isRateLimited(session: string) {
  const now = Date.now();
  const store = rateLimitStore();
  const current = store.get(session);
  if (!current || current.resetAt <= now) {
    store.set(session, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  current.count += 1;
  return current.count > MAX_REQUESTS_PER_MINUTE;
}

export async function GET(request: NextRequest) {
  const session = sessionId(request);
  const requestedLanguage: ChatLanguage = request.nextUrl.searchParams.get("language") === "en" ? "en" : "vi";
  try {
    const messages = await getChatHistory(senderIdFor(session));
    const latestModelMessage = [...messages].reverse().find((message) => message.role === "model");
    const suggestions = latestModelMessage
      ? await getChatSuggestions(latestModelMessage.content, requestedLanguage)
      : [];
    const response = withSessionCookie(NextResponse.json({ messages, suggestions }), session);
    return setPendingBookingCookie(response, pendingBookingFromHistory(messages));
  } catch (error) {
    console.error("Website chatbot history failed:", error instanceof Error ? error.message : error);
    return withSessionCookie(NextResponse.json({ messages: [] }), session);
  }
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: "Yêu cầu không hợp lệ." }, { status: 403 });
  }

  const session = sessionId(request);
  if (isRateLimited(session)) {
    return withSessionCookie(
      NextResponse.json(
        { message: "Bạn gửi hơi nhanh. Vui lòng chờ một phút rồi thử lại." },
        { status: 429 }
      ),
      session
    );
  }

  let body: { message?: unknown; language?: unknown };
  try {
    body = (await request.json()) as { message?: unknown };
  } catch {
    return NextResponse.json({ message: "Nội dung không hợp lệ." }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  const requestedLanguage: ChatLanguage = body.language === "en" ? "en" : "vi";
  const chatLanguage = languageForChatText(message, requestedLanguage);
  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { message: `Tin nhắn cần từ 1 đến ${MAX_MESSAGE_LENGTH} ký tự.` },
      { status: 400 }
    );
  }

  const senderId = senderIdFor(session);
  try {
    const historyBeforeMessage = await getChatHistory(senderId);
    const pendingBooking =
      readPendingBooking(request) || pendingBookingFromHistory(historyBeforeMessage);
    await saveChatMessage(senderId, { role: "user", content: message });
    const isConfirmation = hasExplicitConfirmation(message);
    const reply =
      isConfirmation && pendingBooking
        ? await confirmParsedBookingSummary(pendingBooking, "website")
        : await generateChatReply(senderId, message, "website");
    await saveChatMessage(senderId, { role: "model", content: reply });
    const suggestions = await getChatSuggestions(reply, chatLanguage);
    const response = withSessionCookie(NextResponse.json({ reply, suggestions }), session);
    const nextPendingBooking = isConfirmation ? null : parseBookingSummary(reply);
    return setPendingBookingCookie(response, nextPendingBooking);
  } catch (error) {
    console.error("Website chatbot failed:", error instanceof Error ? error.message : error);
    return withSessionCookie(
      NextResponse.json(
        {
          message:
            "Trợ lý WINDREAD đang gián đoạn. Bạn thử lại sau hoặc gọi/Zalo 0393549656 để crew hỗ trợ."
        },
        { status: 503 }
      ),
      session
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: "Yêu cầu không hợp lệ." }, { status: 403 });
  }

  const session = sessionId(request);
  try {
    await deleteChatHistory(senderIdFor(session));
    return setPendingBookingCookie(
      withSessionCookie(new NextResponse(null, { status: 204 }), session),
      null
    );
  } catch (error) {
    console.error("Website chatbot clear failed:", error instanceof Error ? error.message : error);
    return withSessionCookie(
      NextResponse.json({ message: "Chưa thể xóa cuộc trò chuyện." }, { status: 500 }),
      session
    );
  }
}
