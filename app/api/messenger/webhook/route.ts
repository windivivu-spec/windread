import { after, NextRequest, NextResponse } from "next/server";
import { generateMessengerReply } from "../../../chatbot/vertex";
import { sendMessengerText, sendMessengerTyping, verifyMetaSignature } from "../../../chatbot/messenger";
import { claimMessengerEvent, saveChatMessage } from "../../../chatbot/store";

export const runtime = "nodejs";

type MetaMessagingEvent = {
  sender?: { id?: string };
  recipient?: { id?: string };
  timestamp?: number;
  message?: {
    mid?: string;
    text?: string;
    is_echo?: boolean;
  };
  postback?: {
    mid?: string;
    title?: string;
    payload?: string;
  };
};

type MetaWebhookPayload = {
  object?: string;
  entry?: Array<{
    messaging?: MetaMessagingEvent[];
  }>;
};

function eventText(event: MetaMessagingEvent) {
  if (event.message?.text?.trim()) return event.message.text.trim();
  const payload = event.postback?.payload?.trim();
  if (payload === "GET_STARTED") return "Xin chào, tôi muốn tìm hiểu dịch vụ của WINDREAD.";
  if (event.postback?.title?.trim()) return event.postback.title.trim();
  if (payload) return payload;
  return "Tôi vừa gửi một attachment. Hãy nhờ tôi mô tả nhu cầu bằng tin nhắn chữ.";
}

function eventId(event: MetaMessagingEvent, senderId: string, text: string) {
  return (
    event.message?.mid ||
    event.postback?.mid ||
    `messenger-${senderId}-${event.timestamp ?? 0}-${Buffer.from(text).toString("base64url").slice(0, 48)}`
  );
}

async function processEvent(event: MetaMessagingEvent) {
  const senderId = event.sender?.id;
  if (!senderId || event.message?.is_echo) return;
  if (!event.message && !event.postback) return;

  const text = eventText(event);
  const messageId = eventId(event, senderId, text);
  if (!(await claimMessengerEvent(messageId, senderId))) return;

  await saveChatMessage(senderId, { role: "user", content: text });

  try {
    await sendMessengerTyping(senderId, true);
    const reply = await generateMessengerReply(senderId, text);
    await saveChatMessage(senderId, { role: "model", content: reply });
    await sendMessengerText(senderId, reply);
  } catch (error) {
    console.error("Messenger chatbot processing failed:", error instanceof Error ? error.message : error);
    await sendMessengerText(
      senderId,
      "Xin lỗi bạn, trợ lý WINDREAD đang gián đoạn một chút. Bạn vui lòng thử lại sau hoặc gọi/Zalo 0393549656 để crew hỗ trợ ngay nhé."
    );
  } finally {
    try {
      await sendMessengerTyping(senderId, false);
    } catch (error) {
      console.warn("Could not turn off Messenger typing indicator:", error instanceof Error ? error.message : error);
    }
  }
}

async function processWebhook(payload: MetaWebhookPayload) {
  for (const entry of payload.entry ?? []) {
    for (const event of entry.messaging ?? []) {
      await processEvent(event);
    }
  }
}

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get("hub.mode");
  const token = request.nextUrl.searchParams.get("hub.verify_token");
  const challenge = request.nextUrl.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token && token === process.env.META_WEBHOOK_VERIFY_TOKEN && challenge) {
    return new NextResponse(challenge, { status: 200, headers: { "content-type": "text/plain" } });
  }

  return NextResponse.json({ message: "Webhook verification failed." }, { status: 403 });
}

export async function POST(request: NextRequest) {
  if (!process.env.META_APP_SECRET) {
    return NextResponse.json({ message: "META_APP_SECRET is not configured." }, { status: 503 });
  }

  const rawBody = await request.text();
  if (!verifyMetaSignature(rawBody, request.headers.get("x-hub-signature-256"))) {
    return NextResponse.json({ message: "Invalid webhook signature." }, { status: 401 });
  }

  let payload: MetaWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as MetaWebhookPayload;
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload." }, { status: 400 });
  }

  if (payload.object !== "page") {
    return NextResponse.json({ message: "Unsupported webhook object." }, { status: 404 });
  }

  after(async () => {
    try {
      await processWebhook(payload);
    } catch (error) {
      console.error("Messenger webhook background task failed:", error instanceof Error ? error.message : error);
    }
  });

  return new NextResponse("EVENT_RECEIVED", { status: 200, headers: { "content-type": "text/plain" } });
}

