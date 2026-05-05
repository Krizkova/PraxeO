import { expect, test } from "@playwright/test";
import { loginAsAdmin } from "./helpers";

test.describe("Authentication", () => {
    test("shows login page", async ({ page }) => {
        await page.goto("/");

        await expect(page.getByPlaceholder("jan.pavel@osu.cz")).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
        await expect(page.getByRole("button", { name: /přihlásit se/i })).toBeVisible();
        await expect(page.getByRole("button", { name: /zapomenuté heslo/i })).toBeVisible();
        await expect(page.getByRole("button", { name: /registrovat se/i })).toBeVisible();
    });

    test("logs in as seeded admin and logs out", async ({ page }) => {
        await loginAsAdmin(page);

        await expect(page.getByRole("button", { name: /přidat uživatele/i })).toBeVisible();

        await page.getByRole("button", { name: /odhlásit/i }).click();

        await expect(page).toHaveURL("/");
        await expect(page.getByPlaceholder("jan.pavel@osu.cz")).toBeVisible();
    });

    test("rejects invalid credentials", async ({ page }) => {
        await page.goto("/");

        await page.getByPlaceholder("jan.pavel@osu.cz").fill("admin@osu.cz");
        await page.locator('input[type="password"]').fill("wrong-password");
        await page.getByRole("button", { name: /přihlásit se/i }).click();

        await expect(page).toHaveURL("/");
        await expect(page.getByText(/neplat|chyba|přihlášení/i)).toBeVisible();
    });
});
