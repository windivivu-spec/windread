export function asText(value: unknown, label: string, options: { required?: boolean; max?: number } = {}) {
  const text = typeof value === "string" ? value.trim() : "";
  if ((options.required ?? true) && !text) throw new Error(`${label} là bắt buộc.`);
  if (options.max && text.length > options.max) throw new Error(`${label} quá dài.`);
  return text;
}

export function asMoney(value: unknown, label: string, options: { min?: number } = {}) {
  const number = typeof value === "number" ? value : Number(value);
  const min = options.min ?? 0;
  if (!Number.isSafeInteger(number) || number < min) throw new Error(`${label} không hợp lệ.`);
  return number;
}

export function asUuid(value: unknown, label: string) {
  const text = asText(value, label);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(text)) {
    throw new Error(`${label} không hợp lệ.`);
  }
  return text;
}

export async function bodyJson(request: Request) {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    throw new Error("Dữ liệu gửi lên không hợp lệ.");
  }
}
