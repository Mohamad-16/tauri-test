import { expect, test } from "@playwright/test";

test("login screen renders in the default (English, LTR) locale", async ({ page }) => {
  await page.goto("/#/login");

  await expect(page.getByRole("heading", { name: "FluxBooks Tray" })).toBeVisible();
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
});

test("switching to Arabic flips the document to RTL", async ({ page }) => {
  await page.goto("/#/login");
  await page.evaluate(() => localStorage.setItem("fluxbooks-language", "ar"));
  await page.reload();

  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
});
