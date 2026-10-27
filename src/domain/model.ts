import { z } from "zod";
export const ownershipLabels = {
  unknown: "ยังไม่ยืนยัน",
  notOwned: "ยังไม่มี",
  owned: "มีแล้ว",
};
export const playLabels = {
  unknown: "ยังไม่ยืนยัน",
  notStarted: "ยังไม่เริ่ม",
  playing: "กำลังเล่น",
  paused: "พักไว้",
  completed: "เล่นจบ",
};
const date = z
  .string()
  .refine(
    (s) =>
      s === "" ||
      (/^\d{4}-\d{2}-\d{2}$/.test(s) &&
        !isNaN(Date.parse(s)) &&
        new Date(s).toISOString().slice(0, 10) === s),
    "วันที่ไม่ถูกต้อง",
  );
const amount = z.number().finite().nonnegative().max(1e9).nullable();
const text = z.string().max(20000);
export const userGameSchema = z.object({
  ownership: z.enum(["unknown", "notOwned", "owned"]),
  play: z.enum(["unknown", "notStarted", "playing", "paused", "completed"]),
  spoiler: z.boolean(),
  started: date,
  finished: date,
  rating: z.number().int().min(1).max(10).nullable(),
  notes: text,
});
export const itemSchema = z.object({
  id: z.string().min(1).max(100),
  gameId: z.string().min(1).max(100),
  format: z.enum(["PS4 Disc", "PS5 Disc", "Digital", "Unknown"]),
  region: text,
  edition: text,
  ratingSystem: text,
  condition: text,
  purchased: date,
  price: amount,
  store: text,
});
export const wishSchema = z.object({
  gameId: z.string().min(1).max(100),
  format: z.enum(["PS4 Disc", "PS5 Disc", "Digital", "Unknown"]),
  target: amount,
  notes: text,
});
export const observationSchema = z.object({
  id: z.string().min(1).max(100),
  gameId: z.string().min(1).max(100),
  price: z.number().finite().nonnegative().max(1e9),
  store: text,
  url: z
    .string()
    .max(2000)
    .refine(
      (s) => !s || /^https?:\/\//i.test(s),
      "ใช้ลิงก์ http หรือ https เท่านั้น",
    ),
  date: date,
});
export const stateSchema = z
  .object({
    games: z.record(z.string().max(100), userGameSchema),
    items: z.array(itemSchema).max(10000),
    wishlist: z.array(wishSchema).max(10000),
    observations: z.array(observationSchema).max(10000),
    budget: amount,
    theme: z.enum(["dark", "light", "system"]),
  })
  .superRefine((s, c) => {
    for (const arr of [s.items, s.observations]) {
      if (new Set(arr.map((x) => x.id)).size !== arr.length)
        c.addIssue({ code: "custom", message: "พบ ID ซ้ำ" });
    }
    if (new Set(s.wishlist.map((x) => x.gameId)).size !== s.wishlist.length)
      c.addIssue({ code: "custom", message: "พบ Wishlist ซ้ำ" });
  });
export type UserState = z.infer<typeof stateSchema>;
export type UserGame = z.infer<typeof userGameSchema>;
export const blankGame = (): UserGame => ({
  ownership: "unknown",
  play: "unknown",
  spoiler: false,
  started: "",
  finished: "",
  rating: null,
  notes: "",
});
export const initialState = (): UserState => ({
  games: { "mw-2019": { ...blankGame(), ownership: "owned" } },
  items: [
    {
      id: "initial-mw2019",
      gameId: "mw-2019",
      format: "PS4 Disc",
      region: "US",
      ratingSystem: "ESRB",
      edition: "",
      condition: "",
      purchased: "",
      price: null,
      store: "",
    },
  ],
  wishlist: [],
  observations: [],
  budget: null,
  theme: "dark",
});
export const backupSchema = z.object({
  app: z.literal("COD Archive"),
  schemaVersion: z.literal(1),
  catalogVersion: z.string(),
  exportedAt: z.string().datetime(),
  data: stateSchema,
});
export function parseBackup(raw: string) {
  if (new Blob([raw]).size > 5 * 1024 * 1024)
    throw new Error("ไฟล์ใหญ่เกิน 5 MB");
  return backupSchema.parse(JSON.parse(raw));
}
export function exportBackup(data: UserState) {
  return JSON.stringify(
    {
      app: "COD Archive",
      schemaVersion: 1,
      catalogVersion: "2026-10-v1",
      exportedAt: new Date().toISOString(),
      data,
    },
    null,
    2,
  );
}
export const money = (n: number) =>
  new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(n);
