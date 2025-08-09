// src/utils/format.ts
export const KRW = (n: number | string = 0) =>
  `${Number(n || 0).toLocaleString("ko-KR")}원`;

export const fmt = (d?: string | Date) => {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("ko-KR");
};

export const fmtRange = (s?: string, e?: string) =>
  [fmt(s), fmt(e)].filter(Boolean).join(" ~ ");

export const joinEventFees = (fees?: Record<string, number>) =>
  !fees ? "" : Object.entries(fees).map(([k,v]) => `${k} ${KRW(v)}`).join(" / ");

export const sumSelected = (base: number, fees: Record<string, number>, selected: string[]) =>
  Number(base || 0) + (selected || []).reduce((acc, ev) => acc + Number(fees?.[ev] || 0), 0);
