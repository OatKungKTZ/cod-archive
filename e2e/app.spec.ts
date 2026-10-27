import { test, expect } from "@playwright/test";
test("หน้าหลัก คลังเกม บันทึก และ Refresh บน Subpath", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("./");
  await expect(
    page.getByRole("heading", { name: "ทุกภาค ทุกเรื่องราว ในคลังเดียว" }),
  ).toBeVisible();
  await page.goto("./#/collection");
  await expect(page.getByText("แสดง 9 เกม")).toBeVisible();
  await page.getByLabel("ค้นหาเกม").fill("Modern Warfare");
  await expect(page.locator(".game-card")).toHaveCount(4);
  await page.goto("./#/games/mw-2019");
  await expect(page.getByLabel("การครอบครอง", { exact: true })).toHaveValue(
    "owned",
  );
  await expect(page.getByLabel("สถานะการเล่น", { exact: true })).toHaveValue(
    "unknown",
  );
  await page
    .getByLabel("สถานะการเล่น", { exact: true })
    .selectOption("completed");
  await page
    .getByLabel("บันทึกส่วนตัว", { exact: true })
    .fill("ทดสอบบันทึกส่วนตัว");
  await expect(page.getByRole("status").last()).toContainText("บันทึกแล้ว");
  await page.reload();
  await expect(page.getByLabel("บันทึกส่วนตัว", { exact: true })).toHaveValue(
    "ทดสอบบันทึกส่วนตัว",
  );
  await expect(
    page.getByLabel("อนุญาตให้แสดงข้อมูล Spoiler สำหรับเกมนี้"),
  ).not.toBeChecked();
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    )
    .toBeTruthy();
  expect(errors).toEqual([]);
});
test("Backup ส่งออก ตรวจไฟล์ผิด และ Import แบบยืนยัน", async ({ page }) => {
  await page.goto("./#/settings");
  await expect(
    page.getByRole("heading", { name: "สำรองและกู้คืน" }),
  ).toBeVisible();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export JSON" }).click();
  const file = await download;
  expect(file.suggestedFilename()).toMatch(/^cod-archive-backup/);
  await page
    .getByLabel("เลือกไฟล์ Backup JSON")
    .setInputFiles({
      name: "bad.json",
      mimeType: "application/json",
      buffer: Buffer.from("{}"),
    });
  await expect(page.getByText("นำเข้าไม่ได้:", { exact: false })).toBeVisible();
  const path = await file.path();
  await page.getByLabel("เลือกไฟล์ Backup JSON").setInputFiles(path!);
  await expect(
    page.getByRole("heading", { name: "ตรวจสอบก่อนแทนที่ข้อมูล" }),
  ).toBeVisible();
  page.once("dialog", (dialog) => dialog.accept());
  await page
    .getByRole("button", { name: "ยืนยันแทนที่ข้อมูล", exact: true })
    .click();
  await expect(page.getByRole("status").last()).toContainText("บันทึกแล้ว");
});
test("PWA Cache และแก้ข้อมูลได้ขณะ Offline", async ({ page, context }) => {
  await page.goto("./");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await expect
    .poll(() => page.evaluate(() => !!navigator.serviceWorker.controller))
    .toBeTruthy();
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "ทุกภาค ทุกเรื่องราว ในคลังเดียว" }),
  ).toBeVisible();
  await page.goto("./#/games/mw-2019");
  await page
    .getByLabel("บันทึกส่วนตัว", { exact: true })
    .fill("บันทึกตอน Offline");
  await expect(page.getByRole("status").last()).toContainText("บันทึกแล้ว");
  await page.reload();
  await expect(page.getByLabel("บันทึกส่วนตัว", { exact: true })).toHaveValue(
    "บันทึกตอน Offline",
  );
});

test("Wishlist งบประมาณ ราคาซื้อจริง และสถิติสอดคล้องกัน", async ({ page }) => {
  await page.goto("./#/wishlist");
  await page.getByRole("button", { name: "เพิ่มเกม", exact: true }).click();
  await page.getByLabel("เลือกเกม", { exact: true }).selectOption("bo-2012");
  await page
    .getByRole("button", { name: "เพิ่มใน Wishlist", exact: true })
    .click();
  await page.getByLabel("ราคาเป้าหมาย (บาท)").fill("500");
  await page.getByLabel("งบสะสมรวม (บาท)").fill("1000");
  await expect(page.getByRole("status").last()).toContainText("บันทึกแล้ว");
  await page.reload();
  await expect(page.getByLabel("ราคาเป้าหมาย (บาท)")).toHaveValue("500");
  await page.goto("./#/games/mw-2019");
  await page.getByLabel("ราคาซื้อจริง (บาท)").fill("600");
  await expect(page.getByRole("status").last()).toContainText("บันทึกแล้ว");
  await page.goto("./#/stats");
  await expect(page.locator(".stat-big")).toContainText("600");
  await page.goto("./#/wishlist");
  await expect(page.locator(".budget-metrics .metric").last()).toContainText(
    "400",
  );
});
test("Timeline หลายช่วงเวลาและทุกหน้าหลักไม่ล้นแนวนอน", async ({ page }) => {
  await page.goto("./#/timeline");
  await page.getByRole("button", { name: "ตามเหตุการณ์", exact: true }).click();
  await expect(
    page.locator('a.timeline-item[href="#/games/bo-2012"]'),
  ).toHaveCount(2);
  await page
    .getByRole("button", { name: "ตามวันวางจำหน่าย", exact: true })
    .click();
  await expect(
    page.locator('a.timeline-item[href="#/games/bo-2012"]'),
  ).toHaveCount(1);
  for (const route of [
    "timeline",
    "collection",
    "wishlist",
    "stats",
    "settings",
    "games/mw-2019",
  ]) {
    await page.goto("./#/" + route);
    await expect(page.locator("h1")).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBeTruthy();
  }
});
