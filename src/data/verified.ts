import type { Fact } from "./games";
export const checkedAt = "2026-10-27";
const ps = "https://www.playstation.com/en-us/";
const bc = ps + "support/games/ps5-backward-compatibility-games/";
export const verified: Record<
  string,
  { source: string; date: string; facts: Fact[] }
> = Object.fromEntries(
  [
    ["mw-2019", "call-of-duty-modern-warfare", "2019-10-25", "PS4"],
    ["mw-2022", "call-of-duty-modern-warfare-ii", "2022-10-28", "PS4 / PS5"],
    ["mw-2023", "call-of-duty-modern-warfare-iii", "2023-11-10", "PS4 / PS5"],
    [
      "bo-coldwar",
      "call-of-duty-black-ops-cold-war",
      "2020-11-13",
      "PS4 / PS5",
    ],
    ["bo-2024", "call-of-duty-black-ops-6", "2024-10-25", "PS4 / PS5"],
    ["bo-2025", "call-of-duty-black-ops-7", "2025-11-14", "PS4 / PS5"],
  ].map(([id, slug, date, platform]) => {
    const source = ps + "games/" + slug + "/";
    return [
      id,
      {
        source,
        date,
        facts: [
          {
            label: "เวอร์ชัน Digital ที่หน้าทางการระบุ",
            value:
              platform +
              " · PlayStation US; ไม่ยืนยันรูปแบบแผ่นหรือ Edition ในไทย",
            status: "verified",
            source,
          },
          {
            label: "วันวางจำหน่ายตาม PlayStation US",
            value: date,
            status: "verified",
            source,
          },
          ...(id === "mw-2019"
            ? [
                {
                  label: "การเล่นเกมเวอร์ชัน PS4 บน PS5",
                  value:
                    "หน้าสินค้าระบุว่าเล่นบน PS5 ได้ผ่าน Backward Compatibility; ไม่ใช่หลักฐานผลทดสอบ FPS บน PS5 Pro",
                  status: "verified" as const,
                  source,
                },
              ]
            : []),
          ...(id === "bo-2024"
            ? [
                {
                  label: "PS5 Pro Enhanced",
                  value:
                    "หน้าสินค้า PS5 ระบุ PS5 Pro Enhanced แต่ไม่ได้ยืนยันตัวเลข FPS หรือความละเอียดจากข้อความนี้",
                  status: "verified" as const,
                  source,
                },
              ]
            : []),
        ],
      },
    ];
  }),
);
export const ps3Fact: Fact = {
  label: "แผ่น PS3 บน PS5 / PS5 Pro",
  value:
    "PlayStation ระบุว่า PS5 ไม่รองรับแผ่น PS3 จึงไม่ควรซื้อแผ่น PS3 เพื่อเล่นบนเครื่องนี้ การมีเวอร์ชัน PS4/PS5 ของเกมนี้ยังไม่ยืนยัน",
  status: "verified",
  source: bc,
};
verified["mw4-pending"] = {
  source: "https://www.callofduty.com/modernwarfare4",
  date: "2026-10-23",
  facts: [
    {
      label: "ชื่อและวันวางจำหน่าย",
      value:
        "Call of Duty: Modern Warfare 4 · 23 ตุลาคม 2026 · หน้าทางการมีข้อความ On Sale Now",
      status: "verified",
      source: "https://www.callofduty.com/modernwarfare4",
    },
    {
      label: "โหมดที่หน้าทางการระบุ",
      value:
        "Campaign / Multiplayer / DMZ · ไม่ยืนยันว่าแต่ละโหมดใช้ Offline ได้",
      status: "verified",
      source: "https://www.callofduty.com/modernwarfare4",
    },
  ],
};
