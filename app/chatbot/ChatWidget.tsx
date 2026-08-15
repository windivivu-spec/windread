"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import styles from "./ChatWidget.module.css";
import type { ChatLanguage, ChatSuggestion } from "./suggestions";

type ChatMessage = {
  role: "user" | "model";
  content: string;
};

type ChatApiResponse = {
  messages?: ChatMessage[];
  reply?: string;
  message?: string;
  suggestions?: ChatSuggestion[];
};

async function readChatApiResponse(response: Response): Promise<ChatApiResponse> {
  const raw = await response.text();
  if (!raw) return {};

  try {
    return JSON.parse(raw) as ChatApiResponse;
  } catch {
    throw new Error(
      response.ok
        ? "Phản hồi từ trợ lý chưa đúng định dạng. Vui lòng thử lại."
        : "Máy chủ trợ lý đang khởi động lại. Vui lòng thử lại sau ít phút."
    );
  }
}

const chatCopy = {
  vi: {
    welcome: "Chào bạn, mình là WIND. Mình có thể tư vấn dịch vụ, báo giá và hỗ trợ đặt lịch ngay tại đây.",
    quickPrompts: ["Xem bảng giá", "Địa chỉ tiệm", "Đặt lịch"],
    title: "Trợ lý tư vấn và đặt lịch",
    clear: "Xóa chat",
    close: "Đóng",
    quickLabel: "Gợi ý câu hỏi",
    suggestionLabel: "Chọn nhanh",
    inputLabel: "Tin nhắn",
    placeholder: "Hỏi về dịch vụ hoặc đặt lịch...",
    send: "Gửi",
    disclaimer: "AI có thể nhầm. Giá và lịch trống được kiểm tra từ hệ thống.",
    error: "Trợ lý WIND đang gián đoạn. Bạn vui lòng thử lại hoặc gọi/Zalo 0393549656."
  },
  en: {
    welcome: "Hi, I'm WIND. I can help with services, pricing and booking your appointment here.",
    quickPrompts: ["View prices", "Shop address", "Book an appointment"],
    title: "Service and booking assistant",
    clear: "Clear chat",
    close: "Close",
    quickLabel: "Quick questions",
    suggestionLabel: "Quick replies",
    inputLabel: "Message",
    placeholder: "Ask about services or booking...",
    send: "Send",
    disclaimer: "AI can make mistakes. Prices and available times are checked from the system.",
    error: "WIND is temporarily unavailable. Please try again or call/Zalo 0393549656."
  }
} as const;

function welcomeMessage(language: ChatLanguage): ChatMessage {
  return {
    role: "model",
    content: chatCopy[language].welcome
  };
};

export function ChatWidget() {
  const pathname = usePathname();
  const [language, setLanguage] = useState<ChatLanguage>("vi");
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage("vi")]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<ChatSuggestion[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const hidden = pathname.startsWith("/admin");
  const copy = chatCopy[language];

  useEffect(() => {
    function setLanguageFromPage(nextLanguage: unknown) {
      setLanguage(nextLanguage === "en" ? "en" : "vi");
    }
    function handleLanguageChange(event: Event) {
      setLanguageFromPage((event as CustomEvent<ChatLanguage>).detail);
    }

    setLanguageFromPage(window.localStorage.getItem("windread-language"));
    window.addEventListener("windread-language-change", handleLanguageChange);
    return () => window.removeEventListener("windread-language-change", handleLanguageChange);
  }, []);

  useEffect(() => {
    setMessages((current) => (current.length === 1 ? [welcomeMessage(language)] : current));
  }, [language]);

  useEffect(() => {
    if (!open || loaded) return;
    let active = true;
    fetch(`/api/chat?language=${language}`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Không tải được lịch sử chat.");
        return readChatApiResponse(response);
      })
      .then((data) => {
        if (!active) return;
        if (data.messages?.length) setMessages([welcomeMessage(language), ...data.messages]);
        setSuggestions(data.suggestions ?? []);
        setLoaded(true);
      })
      .catch(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, [language, loaded, open]);

  useEffect(() => {
    if (!open || !loaded) return;
    let active = true;
    fetch(`/api/chat?language=${language}`, { cache: "no-store" })
      .then(readChatApiResponse)
      .then((data) => {
        if (active) setSuggestions(data.suggestions ?? []);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [language, loaded, open]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, pending]);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  async function sendMessage(rawMessage: string) {
    const message = rawMessage.trim();
    if (!message || pending) return;

    setMessages((current) => [...current, { role: "user", content: message }]);
    setInput("");
    setSuggestions([]);
    setError("");
    setPending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message, language })
      });
      const data = await readChatApiResponse(response);
      if (!response.ok || !data.reply) throw new Error(data.message || "Không nhận được phản hồi.");
      setMessages((current) => [...current, { role: "model", content: data.reply as string }]);
      setSuggestions(data.suggestions ?? []);
    } catch (requestError) {
      console.error("WIND chatbot request failed:", requestError);
      setError(copy.error);
    } finally {
      setPending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  async function clearConversation() {
    setError("");
    try {
      const response = await fetch("/api/chat", { method: "DELETE" });
      if (!response.ok) throw new Error("Chưa thể xóa cuộc trò chuyện.");
      setMessages([welcomeMessage(language)]);
      setSuggestions([]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Chưa thể xóa cuộc trò chuyện.");
    }
  }

  if (hidden) return null;

  return (
    <aside className={styles.root} aria-label="Trợ lý WINDREAD">
      {open ? (
        <section className={styles.panel} role="dialog" aria-label="Chat với trợ lý WINDREAD">
          <header className={styles.header}>
            <div className={styles.identity}>
              <Image
                className={styles.avatar}
                src="/images/windread-mark.png"
                width={42}
                height={42}
                alt=""
              />
              <div>
                <strong>WIND</strong>
                <span>{copy.title}</span>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button type="button" onClick={() => void clearConversation()} disabled={pending}>
                {copy.clear}
              </button>
              <button type="button" onClick={() => setOpen(false)} aria-label="Đóng cửa sổ chat">
                {copy.close}
              </button>
            </div>
          </header>

          <div className={styles.messages} aria-live="polite" aria-busy={pending}>
            {messages.map((message, index) => (
              <div
                className={`${styles.message} ${message.role === "user" ? styles.user : styles.model}`}
                key={`${message.role}-${index}-${message.content.slice(0, 20)}`}
              >
                {message.content}
              </div>
            ))}
            {pending ? (
              <div className={`${styles.message} ${styles.model} ${styles.thinking}`}>
                <span />
                <span />
                <span />
                <span className={styles.srOnly}>WIND đang trả lời</span>
              </div>
            ) : null}
            <div ref={endRef} />
          </div>

          {messages.length === 1 ? (
            <div className={styles.quickPrompts} aria-label={copy.quickLabel}>
              {copy.quickPrompts.map((prompt) => (
                <button key={prompt} type="button" onClick={() => void sendMessage(prompt)}>
                  {prompt}
                </button>
              ))}
            </div>
          ) : null}

          {suggestions.length > 0 ? (
            <div className={styles.suggestionArea} aria-label={copy.suggestionLabel}>
              <span>{copy.suggestionLabel}</span>
              <div className={styles.suggestions}>
                {suggestions.map((suggestion) => (
                  <button
                    className={
                      suggestion.tone === "confirm"
                        ? styles.suggestionConfirm
                        : suggestion.tone === "muted"
                          ? styles.suggestionMuted
                          : undefined
                    }
                    disabled={pending}
                    key={`${suggestion.label}-${suggestion.message}`}
                    onClick={() => void sendMessage(suggestion.message)}
                    type="button"
                  >
                    {suggestion.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {error ? <p className={styles.error}>{error}</p> : null}

          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.srOnly} htmlFor="windread-chat-message">
              {copy.inputLabel}
            </label>
            <textarea
              ref={inputRef}
              id="windread-chat-message"
              value={input}
              onChange={(event) => setInput(event.target.value.slice(0, 1200))}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder={copy.placeholder}
              rows={1}
              disabled={pending}
            />
            <button type="submit" disabled={pending || !input.trim()}>
              {copy.send}
            </button>
          </form>
          <p className={styles.disclaimer}>{copy.disclaimer}</p>
        </section>
      ) : null}

      <button
        type="button"
        className={`${styles.launcher} ${open ? styles.launcherOpen : ""}`}
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={open ? "Đóng trợ lý WINDREAD" : "Mở trợ lý WINDREAD"}
      >
        {open ? (
          <span aria-hidden="true">×</span>
        ) : (
          <Image src="/images/windread-mark.png" width={34} height={34} alt="" />
        )}
      </button>
    </aside>
  );
}
