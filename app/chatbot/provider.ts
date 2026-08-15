import { generateConversationalAgentReply } from "./conversationalAgent";
import {
  generateChatReply as generateVertexGeminiReply,
  type ChatChannel
} from "./vertex";

type ChatProvider = "conversational_agents" | "vertex_gemini";

function configuredProvider(): ChatProvider {
  const provider = process.env.GOOGLE_CHAT_PROVIDER || "vertex_gemini";
  if (provider === "conversational_agents" || provider === "vertex_gemini") return provider;
  throw new Error(
    "GOOGLE_CHAT_PROVIDER must be either 'conversational_agents' or 'vertex_gemini'."
  );
}

export async function generateChatReply(
  senderId: string,
  latestUserText: string,
  channel: ChatChannel = "messenger"
) {
  if (configuredProvider() === "conversational_agents") {
    return generateConversationalAgentReply(senderId, latestUserText, channel);
  }
  return generateVertexGeminiReply(senderId, latestUserText, channel);
}

export async function generateMessengerReply(senderId: string, latestUserText: string) {
  return generateChatReply(senderId, latestUserText, "messenger");
}
