import { createHmac, timingSafeEqual } from "node:crypto";

const MAX_MESSENGER_TEXT_LENGTH = 1900;

function messengerConfig() {
  const accessToken = process.env.META_PAGE_ACCESS_TOKEN;
  const apiVersion = process.env.META_GRAPH_API_VERSION || "v23.0";
  if (!accessToken) throw new Error("META_PAGE_ACCESS_TOKEN is not configured.");
  return { accessToken, apiVersion };
}

export function verifyMetaSignature(rawBody: string, signatureHeader: string | null) {
  const appSecret = process.env.META_APP_SECRET;
  if (!appSecret || !signatureHeader?.startsWith("sha256=")) return false;

  const providedHex = signatureHeader.slice("sha256=".length);
  const expectedHex = createHmac("sha256", appSecret).update(rawBody).digest("hex");
  if (providedHex.length !== expectedHex.length) return false;

  return timingSafeEqual(Buffer.from(providedHex, "hex"), Buffer.from(expectedHex, "hex"));
}

async function callSendApi(senderId: string, payload: Record<string, unknown>) {
  const { accessToken, apiVersion } = messengerConfig();
  const response = await fetch(`https://graph.facebook.com/${apiVersion}/me/messages`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({ recipient: { id: senderId }, ...payload })
  });

  if (!response.ok) {
    throw new Error((await response.text()) || `Messenger Send API failed with ${response.status}`);
  }
}

function splitMessengerText(text: string) {
  const clean = text.trim();
  if (clean.length <= MAX_MESSENGER_TEXT_LENGTH) return [clean];

  const chunks: string[] = [];
  let remaining = clean;
  while (remaining.length > MAX_MESSENGER_TEXT_LENGTH) {
    const candidate = remaining.slice(0, MAX_MESSENGER_TEXT_LENGTH);
    const paragraphBreak = candidate.lastIndexOf("\n\n");
    const sentenceBreak = candidate.lastIndexOf(". ");
    const splitAt = Math.max(paragraphBreak, sentenceBreak, MAX_MESSENGER_TEXT_LENGTH - 250);
    chunks.push(remaining.slice(0, splitAt + (sentenceBreak === splitAt ? 1 : 0)).trim());
    remaining = remaining.slice(splitAt + (sentenceBreak === splitAt ? 1 : 0)).trim();
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}

export async function sendMessengerText(senderId: string, text: string) {
  for (const chunk of splitMessengerText(text)) {
    await callSendApi(senderId, {
      messaging_type: "RESPONSE",
      message: { text: chunk }
    });
  }
}

export async function sendMessengerTyping(senderId: string, isTyping: boolean) {
  await callSendApi(senderId, { sender_action: isTyping ? "typing_on" : "typing_off" });
}

