import { describe, it, expect } from "vitest";
import {
  initialState,
  blankGame,
  parseBackup,
  exportBackup,
  stateSchema,
} from "./model";
import { stats } from "./stats";
import { timelineEntries, games } from "../data/games";
describe("ข้อมูลส่วนตัวและการคำนวณ", () => {
  it("มี MW2019 1 เกม แต่ไม่สมมติราคาและการเล่นจบ", () => {
    const s = initialState();
    expect(stats(s)).toMatchObject({
      total: 9,
      owned: 1,
      completed: 0,
      spent: 0,
      unpriced: 1,
      average: null,
    });
    expect(s.games["mw-2019"].play).toBe("unknown");
    expect(s.games["bo-2010"]).toBeUndefined();
  });
  it("Wishlist ไม่เปลี่ยนการครอบครองและราคา 0 บาทเป็นราคาที่ระบุ", () => {
    const s = initialState();
    s.wishlist.push({
      gameId: "mw-2019",
      format: "PS5 Disc",
      target: 500,
      notes: "",
    });
    s.items[0].price = 0;
    expect(stats(s)).toMatchObject({
      owned: 1,
      wishes: 1,
      priced: 1,
      unpriced: 0,
      average: 0,
    });
  });
  it("คำนวณยอดและค่าเฉลี่ยเฉพาะราคาที่ระบุ พร้อมแยกสาย", () => {
    const s = initialState();
    s.items[0].price = 600;
    s.items.push({
      ...s.items[0],
      id: "second",
      gameId: "bo-2012",
      price: 1000,
    });
    expect(stats(s)).toMatchObject({ spent: 1600, average: 800 });
    expect(stats(s, "mw").spent).toBe(600);
  });
  it("เล่นจบไม่เท่ากับมีเกมและไม่เปิด Spoiler", () => {
    const s = initialState();
    s.games["bo-2010"] = { ...blankGame(), play: "completed" };
    expect(stats(s)).toMatchObject({ owned: 1, completed: 1 });
    expect(s.games["bo-2010"].spoiler).toBe(false);
  });
});
describe("Backup", () => {
  it("Export/Import คืนข้อมูลทั้งหมดได้", () =>
    expect(parseBackup(exportBackup(initialState())).data).toEqual(
      initialState(),
    ));
  it("เก็บเกมที่ไม่รู้จักเพื่อไม่ทำข้อมูลอนาคตหาย", () => {
    const s = initialState();
    s.games["future-game"] = blankGame();
    expect(
      parseBackup(exportBackup(s)).data.games["future-game"],
    ).toBeDefined();
  });
  it.each(["{}", "not-json", '{"app":"COD Archive","schemaVersion":99}'])(
    "ไม่ยอมรับไฟล์ผิด: %s",
    (raw) => expect(() => parseBackup(raw)).toThrow(),
  );
  it("ไม่ยอมรับ ID ซ้ำและราคาติดลบ", () => {
    const s = initialState();
    s.items.push({ ...s.items[0] });
    expect(() => parseBackup(exportBackup(s))).toThrow();
    s.items.pop();
    s.items[0].price = -1;
    expect(() => stateSchema.parse(s)).toThrow();
  });
  it("ปฏิเสธ URL ที่รันโค้ดและวันที่ผิด", () => {
    const s = initialState();
    s.observations.push({
      id: "a",
      gameId: "mw-2019",
      price: 10,
      store: "",
      url: "javascript:alert(1)",
      date: "2026-02-30",
    });
    expect(() => parseBackup(exportBackup(s))).toThrow();
  });
  it("จำกัดขนาดไฟล์และค่าตัวเลข", () => {
    expect(() => parseBackup(" ".repeat(5 * 1024 * 1024 + 1))).toThrow();
    const s = initialState();
    s.budget = Infinity;
    expect(() => stateSchema.parse(s)).toThrow();
  });
});
describe("Timeline", () => {
  it("ลำดับแนะนำ 8 เกมเดิมไม่เปลี่ยนและ MW4 อยู่ท้ายรอจัดลำดับ", () =>
    expect(timelineEntries("recommended", "all").map((e) => e.game.id)).toEqual(
      [
        "mw-2019",
        "mw-2022",
        "mw-2023",
        "bo-2010",
        "bo-coldwar",
        "bo-2012",
        "bo-2024",
        "bo-2025",
        "mw4-pending",
      ],
    ));
  it("BO2 แสดงสองช่วงเวลาโดยไม่เพิ่มจำนวนเกมในสถิติ", () => {
    const entries = timelineEntries("chronological", "bo");
    expect(entries.filter((e) => e.game.id === "bo-2012")).toHaveLength(2);
    expect(stats(initialState()).total).toBe(games.length);
  });
  it("เรียงวันวางจำหน่ายไม่ใช้ลำดับแนะนำ", () =>
    expect(timelineEntries("release", "all")[0].game.id).toBe("bo-2010"));
});
