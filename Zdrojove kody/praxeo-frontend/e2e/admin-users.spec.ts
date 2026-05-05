import { expect, test } from "@playwright/test";
import { loginAsAdmin } from "./helpers";

test.describe("Admin user invitation", () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
        await page.getByRole("button", { name: /přidat uživatele/i }).click();
        await expect(page).toHaveURL(/\/add-user/);
    });

    test("validates university email for teacher invitation", async ({ page }) => {
        await page.locator("select").selectOption("TEACHER");
        await page.getByLabel(/e-mail/i).fill("ucitel@example.com");

        await expect(page.getByText(/učitel musí mít univerzitní adresu/i)).toBeVisible();
        await expect(page.getByRole("button", { name: /odeslat odkaz/i })).toBeDisabled();
    });

    test("allows external worker invitation with non-university email", async ({ page }) => {
        await page.locator("select").selectOption("EXTERNAL_WORKER");
        await page.getByLabel(/e-mail/i).fill("externista@example.com");

        await expect(page.getByText(/učitel musí mít univerzitní adresu/i)).not.toBeVisible();
        await expect(page.getByRole("button", { name: /odeslat odkaz/i })).toBeEnabled();
    });
});
