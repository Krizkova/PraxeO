import { expect, type Page } from "@playwright/test";

export const adminUser = {
    email: "admin@osu.cz",
    password: "Admin123",
};

export async function loginAsAdmin(page: Page) {
    await page.goto("/");

    await page.getByPlaceholder("jan.pavel@osu.cz").fill(adminUser.email);
    await page.locator('input[type="password"]').fill(adminUser.password);
    await page.getByRole("button", { name: /přihlásit se/i }).click();

    await expect(page).toHaveURL(/\/summary/);
    await expect(page.getByText(adminUser.email)).toBeVisible();
}
