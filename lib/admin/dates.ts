const timeZone = "Asia/Ho_Chi_Minh";

export function hcmDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}`;
}

export function hcmMonth(date = new Date()) {
  return hcmDate(date).slice(0, 7);
}

export function hcmDayRange(date = hcmDate()) {
  const start = new Date(`${date}T00:00:00+07:00`);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start: start.toISOString(), end: end.toISOString() };
}

export function monthRange(month = hcmMonth()) {
  const start = new Date(`${month}-01T00:00:00+07:00`);
  const end = new Date(start);
  end.setUTCMonth(end.getUTCMonth() + 1);
  return { start: start.toISOString(), end: end.toISOString(), startDate: `${month}-01`, endDate: hcmDate(new Date(end.getTime() - 1)) };
}
