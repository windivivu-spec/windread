export type StoredChatMessage = {
  role: "user" | "model";
  content: string;
};

type MessengerMessageRow = StoredChatMessage & {
  created_at: string;
};

type ChatbotMemory = {
  eventIds: Set<string>;
  messages: Map<string, StoredChatMessage[]>;
};

const globalForChatbot = globalThis as typeof globalThis & {
  windreadChatbotMemory?: ChatbotMemory;
};

function memoryStore() {
  if (!globalForChatbot.windreadChatbotMemory) {
    globalForChatbot.windreadChatbotMemory = {
      eventIds: new Set<string>(),
      messages: new Map<string, StoredChatMessage[]>()
    };
  }
  return globalForChatbot.windreadChatbotMemory;
}

function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return { url: url.replace(/\/$/, ""), serviceRoleKey };
}

async function chatbotRestFetch<T>(path: string, init: RequestInit = {}) {
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
    const error = new Error((await response.text()) || `Supabase request failed with ${response.status}`);
    Object.assign(error, { status: response.status });
    throw error;
  }

  if (response.status === 204) return null as T;
  return (await response.json()) as T;
}

export async function claimMessengerEvent(messageId: string, senderId: string) {
  if (!supabaseConfig()) {
    const memory = memoryStore();
    if (memory.eventIds.has(messageId)) return false;
    memory.eventIds.add(messageId);
    return true;
  }

  try {
    await chatbotRestFetch("messenger_events", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ message_id: messageId, sender_id: senderId })
    });
    return true;
  } catch (error) {
    if ((error as Error & { status?: number }).status === 409) return false;
    throw error;
  }
}

export async function saveChatMessage(senderId: string, message: StoredChatMessage) {
  const content = message.content.trim().slice(0, 4000);
  if (!content) return;

  if (!supabaseConfig()) {
    const memory = memoryStore();
    const history = memory.messages.get(senderId) ?? [];
    memory.messages.set(senderId, [...history, { ...message, content }].slice(-20));
    return;
  }

  await chatbotRestFetch("messenger_messages", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ sender_id: senderId, role: message.role, content })
  });
}

export async function getChatHistory(senderId: string, limit = 18): Promise<StoredChatMessage[]> {
  if (!supabaseConfig()) {
    return (memoryStore().messages.get(senderId) ?? []).slice(-limit);
  }

  const rows = await chatbotRestFetch<MessengerMessageRow[]>(
    `messenger_messages?select=role,content,created_at&sender_id=eq.${encodeURIComponent(senderId)}` +
      `&order=created_at.desc&limit=${Math.min(Math.max(limit, 1), 30)}`
  );
  return rows.reverse().map(({ role, content }) => ({ role, content }));
}

