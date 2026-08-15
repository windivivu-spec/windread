import { getBarbers, getBranches, getServices } from "../booking/supabaseServer";

export type ChatSuggestion = {
  label: string;
  message: string;
  tone?: "default" | "confirm" | "muted";
};

export type ChatLanguage = "vi" | "en";

function normalizedText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .toLocaleLowerCase("vi-VN");
}

function uniqueSuggestions(suggestions: ChatSuggestion[]) {
  const seen = new Set<string>();
  return suggestions.filter((suggestion) => {
    const key = normalizedText(suggestion.message);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function languageForChatText(text: string, fallback: ChatLanguage = "vi"): ChatLanguage {
  const normalized = normalizedText(text);
  if (
    /[ăâđêôơư]|\b(xin|chao|ban|minh|muon|dat lich|dich vu|chi nhanh|co so|ngay mai|hom nay)\b/.test(
      text.toLocaleLowerCase("vi-VN")
    )
  ) {
    return "vi";
  }
  if (
    /\b(hello|hi|i|my|want|need|can|could|would|where|how|what|which|when|yes|no|please|thanks|thank you|booking|appointment|service|barber|branch|today|tomorrow|available|confirm)\b/.test(
      normalized
    )
  ) {
    return "en";
  }
  return fallback;
}

export async function getChatSuggestions(
  reply: string,
  language: ChatLanguage = languageForChatText(reply)
): Promise<ChatSuggestion[]> {
  const text = normalizedText(reply);
  const isEnglish = language === "en";

  const asksForConfirmation =
    (/(?:ban\s+)?(?:vui long\s+)?xac nhan/.test(text) &&
      /(?:xac nhan|thong tin|lich hen)[\s\S]{0,90}(?:dung|khong|nhe|chu)/.test(text) &&
      !/(?:da dat|dat lich) thanh cong|ma booking/.test(text)) ||
      (/(?:please\s+)?confirm/.test(text) &&
        /(?:booking|appointment|details|information)/.test(text) &&
        !/(?:booking|appointment).{0,24}(?:confirmed|complete|successful)/.test(text));

  if (asksForConfirmation) {
    return [
      isEnglish
        ? { label: "Confirm booking", message: "Confirm", tone: "confirm" }
        : { label: "Xác nhận đặt lịch", message: "Xác nhận", tone: "confirm" },
      isEnglish
        ? { label: "Edit details", message: "I want to edit my booking details", tone: "muted" }
        : { label: "Chỉnh sửa thông tin", message: "Tôi muốn chỉnh sửa thông tin", tone: "muted" }
    ];
  }

  const asksForDate =
    (/(?:ngay nao|hom nao|thoi gian nao|khi nao)/.test(text) &&
      /(?:dat lich|muon dat|muon ghe|tai co so|cho dich vu)/.test(text)) ||
      (/(?:what|which|when).{0,35}(?:date|day)|(?:date|day).{0,35}(?:work|prefer|choose)/.test(text) &&
        /(?:booking|appointment|service)/.test(text));
  if (asksForDate) {
    return [
      isEnglish ? { label: "Today", message: "Today" } : { label: "Hôm nay", message: "Hôm nay" },
      isEnglish ? { label: "Tomorrow", message: "Tomorrow" } : { label: "Ngày mai", message: "Ngày mai" }
    ];
  }

  if (/(?:barber|tho)[\s\S]{0,75}(?:nao|chon|trong|phu hop|bat ky|which|choose|available|any)/.test(text)) {
    const barbers = await getBarbers();
    const mentionedBarbers = barbers.filter((barber) => text.includes(normalizedText(barber.name)));
    const suggestions: ChatSuggestion[] = mentionedBarbers.map((barber) => ({
      label: barber.name,
      message: barber.name
    }));
    if (/tho bat ky|bat ky barber|khong chon tho|hay chon tho bat ky|any barber|no preference/.test(text)) {
      suggestions.unshift(
        isEnglish
          ? { label: "Any barber", message: "Any barber" }
          : { label: "Thợ bất kỳ", message: "Thợ bất kỳ" }
      );
    }
    return uniqueSuggestions(suggestions).slice(0, 8);
  }

  const asksForService =
    /(?:dich vu|lam toc|cat toc)[\s\S]{0,55}(?:gi|nao|chon)|chon\s+(?:dich vu|goi)|(?:service|haircut)[\s\S]{0,55}(?:which|choose)|choose\s+(?:a\s+)?service/.test(text);
  if (asksForService) {
    const services = await getServices();
    return services.map((service) => ({ label: service.name, message: service.name }));
  }

  const timeMatches = Array.from(reply.matchAll(/(?:^|\s)([0-2]?\d:[0-5]\d)(?=\s|[,.!?;)]|$)/g)).map(
    (match) => match[1].padStart(5, "0")
  );
  const times = [...new Set(timeMatches)].slice(0, 10);
  if (times.length > 0 && /(?:khung gio|gio trong|chon gio|gio nao|gio hen|time slots?|available times?|choose a time)/.test(text)) {
    return times.map((time) => ({ label: time, message: time }));
  }

  if (/chua con khung gio|kin lich|het lich|no (?:available )?(?:time|slot)|fully booked/.test(text)) {
    return [
      isEnglish
        ? { label: "Check tomorrow", message: "Check tomorrow" }
        : { label: "Kiểm tra ngày mai", message: "Kiểm tra ngày mai" },
      isEnglish
        ? { label: "Choose another branch", message: "Check another branch", tone: "muted" }
        : { label: "Chọn cơ sở khác", message: "Kiểm tra cơ sở khác", tone: "muted" }
    ];
  }

  const asksForBranch =
    /(?:chon|muon ghe|muon den)\s+(?:chi nhanh|co so)|(?:chi nhanh|co so)\s+nao|(?:which|choose)\s+(?:branch|location)|(?:branch|location)\s+(?:would|do)/.test(text);
  if (asksForBranch) {
    const branches = await getBranches();
    return branches.map((branch) => ({ label: branch.name, message: branch.name }));
  }

  if (/ban co muon|ban muon minh|co can minh|would you like|do you want|can i help|shall i/.test(text)) {
    return [
      isEnglish ? { label: "Yes", message: "Yes" } : { label: "Có", message: "Có" },
      isEnglish ? { label: "No", message: "No", tone: "muted" } : { label: "Không", message: "Không", tone: "muted" }
    ];
  }

  return [];
}
