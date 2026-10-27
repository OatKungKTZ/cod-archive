import { verified, ps3Fact } from "./verified";
export interface Fact {
  label: string;
  value: string;
  status: "verified" | "unknown" | "unverified";
  source?: string;
}
export interface Game {
  id: string;
  title: string;
  short: string;
  year: number | null;
  series: "mw" | "bo" | "pending";
  order: number;
  periods: { label: string; start: number; spoiler?: boolean }[];
  summary: string;
  characters: string[];
  color: string;
  tag: string;
  facts: Fact[];
  campaignHours: number | null;
  missions: number | null;
  source: string;
  verifiedTitle: boolean;
  releaseDate?: string;
  checkedAt?: string;
}
const unknownFacts: Fact[] = [
  {
    label: "FPS / 60–120 FPS",
    value: "Unknown — ต้องตรวจแยกเวอร์ชันและโหมดเกม",
    status: "unknown",
  },
  {
    label: "ความละเอียด / Performance Mode",
    value: "Unknown — ยังไม่มีผลทดสอบที่ยืนยัน",
    status: "unknown",
  },
  {
    label: "120Hz",
    value: "ต้องตรวจการรองรับของเกม จอ และการตั้งค่า PS5 แยกกัน",
    status: "unverified",
  },
  {
    label: "พื้นที่ติดตั้ง / แพ็กที่จำเป็น",
    value: "Unknown — เปลี่ยนได้ตาม Patch และโหมดที่ติดตั้ง",
    status: "unknown",
  },
  {
    label: "ภาษาเสียงและคำบรรยาย",
    value: "Unknown — ต้องตรวจ Region และ Edition",
    status: "unknown",
  },
  {
    label: "เวลา Campaign / จำนวนภารกิจ",
    value: "Unknown — ยังไม่ยืนยันแหล่งข้อมูล",
    status: "unknown",
  },
];
const rows: Omit<Game, "facts" | "campaignHours" | "missions">[] = [
  {
    id: "mw-2019",
    title: "Call of Duty: Modern Warfare",
    short: "MW",
    year: 2019,
    series: "mw",
    order: 1,
    periods: [{ label: "2019 · รอตรวจสอบรายละเอียด", start: 2019 }],
    summary:
      "เรื่องราวปฏิบัติการร่วมของหน่วยรบพิเศษ ท่ามกลางความขัดแย้งร่วมสมัย จุดเริ่มต้นของ Modern Warfare สาย Reboot",
    characters: ["Captain Price", "Alex", "Farah Karim"],
    color: "#8ba7a0",
    tag: "THE REBOOT BEGINS",
    source:
      "https://www.playstation.com/en-us/games/call-of-duty-modern-warfare/",
    verifiedTitle: false,
  },
  {
    id: "mw-2022",
    title: "Call of Duty: Modern Warfare II",
    short: "MW II",
    year: 2022,
    series: "mw",
    order: 2,
    periods: [{ label: "2022 · รอตรวจสอบรายละเอียด", start: 2022 }],
    summary:
      "ติดตาม Task Force 141 ในปฏิบัติการที่ขยายขอบเขตจากภาค Modern Warfare (2019) โดยไม่เปิดเผยจุดหักมุมของเรื่อง",
    characters: ["Captain Price", "Ghost", "Soap", "Gaz"],
    color: "#a3c94c",
    tag: "TASK FORCE 141",
    source: "https://www.callofduty.com/modernwarfare2",
    verifiedTitle: false,
  },
  {
    id: "mw-2023",
    title: "Call of Duty: Modern Warfare III",
    short: "MW III",
    year: 2023,
    series: "mw",
    order: 3,
    periods: [{ label: "2023 · รอตรวจสอบรายละเอียด", start: 2023 }],
    summary:
      "เรื่องราวต่อเนื่องของ Task Force 141 เมื่อภัยคุกคามครั้งใหม่ผลักดันให้ทีมต้องออกปฏิบัติการอีกครั้ง",
    characters: ["Captain Price", "Ghost", "Soap", "Gaz"],
    color: "#e26055",
    tag: "THE NEXT CHAPTER",
    source: "https://www.callofduty.com/modernwarfare3",
    verifiedTitle: false,
  },
  {
    id: "bo-2010",
    title: "Call of Duty: Black Ops",
    short: "BLACK OPS",
    year: 2010,
    series: "bo",
    order: 4,
    periods: [{ label: "ทศวรรษ 1960 · รอตรวจสอบ", start: 1961 }],
    summary:
      "เรื่องราวปฏิบัติการลับในยุคสงครามเย็น ที่ความทรงจำและข้อมูลข่าวกรองมีบทบาทสำคัญ",
    characters: ["Alex Mason", "Frank Woods", "Jason Hudson"],
    color: "#d89548",
    tag: "BEHIND ENEMY LINES",
    source: "https://www.callofduty.com/blackops",
    verifiedTitle: false,
  },
  {
    id: "bo-coldwar",
    title: "Call of Duty: Black Ops Cold War",
    short: "COLD WAR",
    year: 2020,
    series: "bo",
    order: 5,
    periods: [{ label: "ต้นทศวรรษ 1980 · รอตรวจสอบ", start: 1981 }],
    summary:
      "ปฏิบัติการข่าวกรองในช่วงสงครามเย็น พร้อมตัวละครคุ้นเคยและภารกิจที่ต้องอาศัยการตัดสินใจ",
    characters: ["Russell Adler", "Alex Mason", "Frank Woods"],
    color: "#6bb4c2",
    tag: "TRUST NO ONE",
    source:
      "https://www.playstation.com/en-us/games/call-of-duty-black-ops-cold-war/",
    verifiedTitle: false,
  },
  {
    id: "bo-2012",
    title: "Call of Duty: Black Ops II",
    short: "BLACK OPS II",
    year: 2012,
    series: "bo",
    order: 6,
    periods: [
      { label: "ทศวรรษ 1980 · รอตรวจสอบ", start: 1986 },
      { label: "2025 · รอตรวจสอบ", start: 2025 },
    ],
    summary:
      "เรื่องราวหลายช่วงเวลาที่เชื่อมปฏิบัติการในอดีตเข้ากับความขัดแย้งในอนาคต ไม่เปิดเผยความสัมพันธ์เชิงลึกหรือบทสรุป",
    characters: ["David Mason", "Frank Woods"],
    color: "#e3aa5d",
    tag: "TWO ERAS. ONE ARCHIVE.",
    source: "https://www.callofduty.com/blackops2",
    verifiedTitle: false,
  },
  {
    id: "bo-2024",
    title: "Call of Duty: Black Ops 6",
    short: "BLACK OPS 6",
    year: 2024,
    series: "bo",
    order: 7,
    periods: [{ label: "ต้นทศวรรษ 1990 · รอตรวจสอบ", start: 1991 }],
    summary:
      "เรื่องราวสายลับและปฏิบัติการในช่วงการเปลี่ยนผ่านหลังสงครามเย็น โดยซ่อนข้อมูลที่อาจเปิดเผยจุดหักมุม",
    characters: [],
    color: "#e89538",
    tag: "QUESTION EVERYTHING",
    source: "https://www.callofduty.com/blackops6",
    verifiedTitle: false,
  },
  {
    id: "bo-2025",
    title: "Call of Duty: Black Ops 7",
    short: "BLACK OPS 7",
    year: 2025,
    series: "bo",
    order: 8,
    periods: [{ label: "2035 · รอตรวจสอบ", start: 2035 }],
    summary:
      "รายการในแผนการสะสม Black Ops รายละเอียดเนื้อเรื่องและความเชื่อมโยงต้องตรวจจากแหล่งทางการก่อนยืนยัน",
    characters: [],
    color: "#e87444",
    tag: "A NEW FRONTIER",
    source: "https://www.callofduty.com/blackops7",
    verifiedTitle: false,
  },
  {
    id: "mw4-pending",
    title: "Call of Duty: Modern Warfare 4",
    short: "MW4",
    year: 2026,
    series: "pending",
    order: 9,
    periods: [],
    summary:
      "ยืนยันชื่อและการวางจำหน่ายจากหน้า Call of Duty ทางการแล้ว ส่วนลำดับการเล่น ช่วงเวลา และความเชื่อมโยงเชิงลึกยังอยู่ระหว่างตรวจสอบ",
    characters: [],
    color: "#a0a7b6",
    tag: "PENDING VERIFICATION",
    source: "https://www.callofduty.com/modernwarfare4",
    verifiedTitle: true,
  },
];
export const games: Game[] = rows.map((g) => ({
  ...g,
  source: verified[g.id]?.source ?? g.source,
  verifiedTitle: !!verified[g.id],
  releaseDate: verified[g.id]?.date,
  checkedAt: verified[g.id] ? "2026-10-27" : undefined,
  campaignHours: null,
  missions: null,
  facts: [
    ...(verified[g.id]?.facts ?? []),
    ...(["bo-2010", "bo-2012"].includes(g.id) ? [ps3Fact] : []),
    {
      label: "เล่นบน PS5 Pro",
      value:
        g.id === "bo-2010" || g.id === "bo-2012"
          ? "Unverified — ไม่ถือว่าแผ่น PS3 เล่นบน PS5 ได้ ต้องตรวจผลิตภัณฑ์ PS4/PS5 ที่มีจริง"
          : "Unknown — ต้องยืนยันเวอร์ชันเกมและความเข้ากันได้",
      status: "unverified",
    },
    {
      label: "แผ่น PS4 / PS5 และ Native / Backward Compatibility",
      value: "Unknown — ห้ามใช้รายชื่อใน Archive เป็นหลักฐานการรองรับเครื่อง",
      status: "unknown",
    },
    ...unknownFacts,
  ],
}));
export const seriesLabel = {
  mw: "Modern Warfare Reboot",
  bo: "Black Ops",
  pending: "รอยืนยันลำดับเนื้อเรื่อง",
};
export function timelineEntries(mode: string, series: string) {
  const selected = games.filter((g) => series === "all" || g.series === series);
  if (mode === "chronological")
    return selected
      .flatMap((g) =>
        g.periods.length
          ? g.periods.map((period, i) => ({
              game: g,
              period: period.label,
              key: `${g.id}-${i}`,
              sort: period.start,
            }))
          : [{ game: g, period: "ช่วงเวลา Unknown", key: g.id, sort: 9999 }],
      )
      .sort((a, b) => a.sort - b.sort);
  return [...selected]
    .sort((a, b) =>
      mode === "release"
        ? (a.releaseDate ?? `${a.year ?? 9999}-12-31`).localeCompare(
            b.releaseDate ?? `${b.year ?? 9999}-12-31`,
          )
        : a.order - b.order,
    )
    .map((g) => ({
      game: g,
      period: g.periods.map((p) => p.label).join(" / ") || "ช่วงเวลา Unknown",
      key: g.id,
      sort: g.order,
    }));
}
