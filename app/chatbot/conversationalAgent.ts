import { createHash, randomUUID } from "node:crypto";
import { GoogleAuth } from "google-auth-library";
import { getChatHistory } from "./store";
import {
  executeChatbotTool,
  OUT_OF_SCOPE_REPLY,
  shouldBlockBeforeModel,
  type ChatChannel
} from "./vertex";

const MAX_TOOL_ROUNDS = 5;
const LANGUAGE_CODE = "vi";
const CLOUD_PLATFORM_SCOPE = "https://www.googleapis.com/auth/cloud-platform";
const VIETNAM_TIME_ZONE = "Asia/Ho_Chi_Minh";

type JsonRecord = Record<string, unknown>;
type ResponseMessage = {
  text?: { text?: string[] };
  toolCall?: {
    tool?: string;
    action?: string;
    inputParameters?: JsonRecord;
  };
};
type DetectIntentResponse = {
  queryResult?: { responseMessages?: ResponseMessage[] };
};

type SlotSearchOutput = {
  branchId?: unknown;
  serviceId?: unknown;
  barberId?: unknown;
  date?: unknown;
  available?: unknown;
  slots?: unknown;
  error?: unknown;
};

function serviceAccountCredentials() {
  const raw = process.env.GOOGLE_VERTEX_SERVICE_ACCOUNT_JSON;
  if (!raw) return undefined;

  const parsed = JSON.parse(raw) as {
    client_email?: string;
    private_key?: string;
    project_id?: string;
  };
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error("GOOGLE_VERTEX_SERVICE_ACCOUNT_JSON is missing client_email or private_key.");
  }

  return {
    client_email: parsed.client_email,
    private_key: parsed.private_key.replace(/\\n/g, "\n")
  };
}

function conversationalAgentConfig() {
  const project = process.env.GOOGLE_CLOUD_PROJECT;
  const agentId = process.env.GOOGLE_CONVERSATIONAL_AGENT_ID;
  const location = process.env.GOOGLE_CONVERSATIONAL_AGENT_LOCATION || "global";
  const environmentId = process.env.GOOGLE_CONVERSATIONAL_AGENT_ENVIRONMENT_ID;
  const model = process.env.GOOGLE_CONVERSATIONAL_AGENT_MODEL;

  if (!project || !agentId) {
    throw new Error(
      "Conversational Agents requires GOOGLE_CLOUD_PROJECT and GOOGLE_CONVERSATIONAL_AGENT_ID."
    );
  }

  return { project, agentId, location, environmentId, model };
}

function sessionIdForRequest(senderId: string) {
  // Conversational Agents keeps server-side session context. Reusing one ID
  // indefinitely eventually exceeds its token limit and can leave the session
  // stuck waiting for a tool result after an interrupted request.
  return createHash("sha256")
    .update(`${senderId}:${randomUUID()}`)
    .digest("hex")
    .slice(0, 32);
}

function vietnamDateOffset(offsetDays = 0) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: VIETNAM_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const date = new Date(
    Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day) + offsetDays, 12)
  );
  return date.toISOString().slice(0, 10);
}

function temporalContext() {
  return {
    currentDate: vietnamDateOffset(),
    tomorrowDate: vietnamDateOffset(1),
    timeZone: VIETNAM_TIME_ZONE
  };
}

function textWithTemporalContext(text: string) {
  const context = temporalContext();
  return `${text}\n\n[Ngữ cảnh thời gian từ hệ thống: hôm nay là ${context.currentDate}; ngày mai là ${context.tomorrowDate}; múi giờ ${context.timeZone}. Phải tự quy đổi các cách nói “hôm nay”, “ngày mai” sang ngày YYYY-MM-DD tương ứng và không hỏi lại ngày nếu khách đã nói rõ.]`;
}

function recentConversationContext(history: Awaited<ReturnType<typeof getChatHistory>>) {
  const previousMessages = history.slice(0, -1).slice(-8);
  if (previousMessages.length === 0) return "";

  const transcript = previousMessages
    .map((message) => `${message.role === "user" ? "Khách" : "WIND"}: ${message.content}`)
    .join("\n")
    .slice(-3500);
  return `\n\n[Lịch sử hội thoại gần nhất để tiếp tục đúng ngữ cảnh:\n${transcript}\n]`;
}

function claimsBookingSuccess(text: string) {
  return /(đặt|dat|tạo|tao)\s+lịch\s+(thành công|thanh cong)|mã\s+booking|ma\s+booking/i.test(text);
}

function successfulBookingReply(output: JsonRecord) {
  const booking = output.booking as JsonRecord | undefined;
  const bookingId = typeof booking?.id === "string" ? booking.id : "";
  const startTime = typeof booking?.startTime === "string" ? booking.startTime : "";
  const formattedTime = startTime
    ? new Intl.DateTimeFormat("vi-VN", {
        timeZone: VIETNAM_TIME_ZONE,
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date(startTime))
    : "";
  const message = typeof output.message === "string" ? output.message : "Đặt lịch thành công.";
  const timeDetail = formattedTime ? ` Thời gian: ${formattedTime}.` : "";
  const bookingDetail = bookingId ? ` Mã booking của bạn là ${bookingId}.` : "";
  return `${message}${timeDetail}${bookingDetail} Bạn vui lòng lưu lại mã này để đối chiếu khi đến tiệm.`;
}

function slotSearchReply(output: SlotSearchOutput) {
  const date = typeof output.date === "string" ? output.date : "ngày bạn chọn";
  if (typeof output.error === "string") return null;

  const slots = Array.isArray(output.slots)
    ? output.slots.filter(
        (slot): slot is { label: string } =>
          Boolean(slot) && typeof slot === "object" && typeof (slot as { label?: unknown }).label === "string"
      )
    : [];

  if (output.available === true && slots.length > 0) {
    const labels = [...new Set(slots.map((slot) => slot.label))];
    return `Ngày ${date} hiện còn các khung giờ: ${labels.join(", ")}. Bạn chọn giờ nào?`;
  }

  if (output.available === false || slots.length === 0) {
    return `Ngày ${date} hiện chưa còn khung giờ phù hợp với lựa chọn này. Bạn muốn kiểm tra ngày khác hay cơ sở khác?`;
  }

  return null;
}

async function accessToken(project: string) {
  const auth = new GoogleAuth({
    projectId: project,
    credentials: serviceAccountCredentials(),
    scopes: [CLOUD_PLATFORM_SCOPE]
  });
  const client = await auth.getClient();
  const result = await client.getAccessToken();
  if (!result.token) throw new Error("Google authentication did not return an access token.");
  return result.token;
}

function endpointFor(location: string) {
  return location === "global"
    ? "dialogflow.googleapis.com"
    : `${location}-dialogflow.googleapis.com`;
}

async function detectIntent(
  endpoint: string,
  session: string,
  token: string,
  queryInput: JsonRecord,
  channel: ChatChannel,
  model?: string
) {
  const context = temporalContext();
  const response = await fetch(`https://${endpoint}/v3/${session}:detectIntent`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      queryInput,
      queryParams: {
        timeZone: VIETNAM_TIME_ZONE,
        ...(model ? { llmModelSettings: { model } } : {}),
        parameters: {
          channel,
          current_date: context.currentDate,
          tomorrow_date: context.tomorrowDate,
          time_zone: context.timeZone
        }
      },
      responseView: "DETECT_INTENT_RESPONSE_VIEW_FULL"
    })
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 1500);
    throw new Error(`Conversational Agents detectIntent failed (${response.status}): ${detail}`);
  }
  return (await response.json()) as DetectIntentResponse;
}

function responseText(messages: ResponseMessage[]) {
  return messages
    .flatMap((message) => message.text?.text ?? [])
    .filter((text) => Boolean(text?.trim()))
    .join("\n")
    .trim();
}

export async function generateConversationalAgentReply(
  senderId: string,
  latestUserText: string,
  channel: ChatChannel
) {
  if (shouldBlockBeforeModel(latestUserText)) return OUT_OF_SCOPE_REPLY;

  const { project, agentId, location, environmentId, model } = conversationalAgentConfig();
  const agentPath = `projects/${project}/locations/${location}/agents/${agentId}`;
  const requestSessionId = sessionIdForRequest(senderId);
  const session = environmentId
    ? `${agentPath}/environments/${environmentId}/sessions/${requestSessionId}`
    : `${agentPath}/sessions/${requestSessionId}`;
  const endpoint = endpointFor(location);
  const token = await accessToken(project);
  const history = await getChatHistory(senderId);
  const userConversation = history
    .filter((message) => message.role === "user")
    .map((message) => message.content)
    .join(" ");
  const previousModelText =
    history
      .slice(0, -1)
      .reverse()
      .find((message) => message.role === "model")?.content ?? "";

  let queryInput: JsonRecord = {
    text: {
      text: `${textWithTemporalContext(latestUserText)}${recentConversationContext(history)}`
    },
    languageCode: LANGUAGE_CODE
  };
  for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
    const response = await detectIntent(endpoint, session, token, queryInput, channel, model);
    const messages = response.queryResult?.responseMessages ?? [];
    const toolCall = messages.find((message) => message.toolCall)?.toolCall;

    if (!toolCall) {
      const reply = responseText(messages);
      if (!reply) throw new Error("Conversational Agents returned an empty response.");
      // A generative agent must never be allowed to invent a successful write.
      // Only a successful create_booking tool result can authorize that claim.
      if (claimsBookingSuccess(reply)) {
        console.error("Conversational Agent claimed booking success without create_booking tool output.");
        return "Mình chưa ghi được lịch vào hệ thống nên chưa thể xác nhận đặt lịch. Bạn vui lòng kiểm tra lại thông tin và xác nhận một lần nữa nhé.";
      }
      return reply;
    }

    const action = toolCall.action?.trim();
    if (!action) throw new Error("Conversational Agents returned a tool call without an action.");
    const output = await executeChatbotTool(
      {
        name: action,
        args: toolCall.inputParameters ?? {}
      },
      latestUserText,
      userConversation,
      previousModelText,
      channel
    );
    console.info("Conversational Agent tool completed", {
      action,
      branchId: toolCall.inputParameters?.branchId,
      serviceId: toolCall.inputParameters?.serviceId,
      barberId: toolCall.inputParameters?.barberId,
      date: toolCall.inputParameters?.date,
      slot: toolCall.inputParameters?.slot,
      success: output.success === true,
      bookingId:
        typeof (output.booking as JsonRecord | undefined)?.id === "string"
          ? (output.booking as JsonRecord).id
          : undefined,
      error: typeof output.error === "string" ? output.error : undefined
    });
    if (action === "find_available_slots") {
      // Availability is deterministic database output. Return it directly so a
      // generative response cannot contradict the real slot list or invent that
      // additional dates were checked.
      const deterministicReply = slotSearchReply(output);
      if (deterministicReply) return deterministicReply;
    }
    if (action === "create_booking" && output.success === true) {
      // A database write is the authoritative terminal state. Return its result
      // immediately instead of asking the model to paraphrase it; the agent can
      // legally return an empty turn after a tool call even though the write
      // already succeeded.
      return successfulBookingReply(output);
    }

    queryInput = {
      toolCallResult: {
        tool: toolCall.tool,
        action,
        // Keep the agent schema stable while database catalog/booking shapes evolve.
        outputParameters: { result: JSON.stringify(output) }
      },
      languageCode: LANGUAGE_CODE
    };
  }

  throw new Error("Conversational Agents exceeded the maximum tool-call rounds.");
}
