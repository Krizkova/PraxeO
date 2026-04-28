import { expect, test } from "@playwright/test";

test.describe("Authentication", () => {
    test("shows login page", async ({ page }) => {
        await page.goto("/");

        await expect(page.getByPlaceholder("jan.pavel@osu.cz")).toBeVisible();
        await expect(page.getByRole("button", { name: /přihlásit se/i })).toBeVisible();
        await expect(page.getByRole("button", { name: /zapomenut/i })).toBeVisible();
    });

    test("logs in as seeded admin and logs out", async ({ page }) => {
        await page.goto("/");

        await page.getByPlaceholder("jan.pavel@osu.cz").fill("admin@osu.cz");
        await page.getByPlaceholder("••••••••").fill("Admin123");
        await page.getByRole("button", { name: /přihlásit se/i }).click();

        await expect(page).toHaveURL(/\/summary/);
        await expect(page.getByText("admin@osu.cz")).toBeVisible();
        await expect(page.getByRole("button", { name: /přidat uživatele/i })).toBeVisible();

        await page.getByRole("button", { name: /odhlásit/i }).click();

        await expect(page.getByPlaceholder("jan.pavel@osu.cz")).toBeVisible();
    });
});
