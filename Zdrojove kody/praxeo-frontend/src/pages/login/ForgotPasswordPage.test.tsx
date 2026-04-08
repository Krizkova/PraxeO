import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ForgotPasswordPage from "../../pages/login/ForgotPasswordPage";
import { forgotPassword } from "../../api/userApi";

const { mockNavigate } = vi.hoisted(() => ({
    mockNavigate: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock("../../components/header/Header", () => ({
    default: () => <div data-testid="header" />,
}));

vi.mock("../../api/userApi", () => ({
    forgotPassword: vi.fn(),
}));

describe("ForgotPasswordPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("submits email and navigates home on success", async () => {
        vi.mocked(forgotPassword).mockResolvedValue({});

        render(
            <MemoryRouter>
                <ForgotPasswordPage />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/jan\.pavel@osu\.cz/i), {
            target: { value: "user@osu.cz" },
        });
        fireEvent.submit(screen.getByRole("button", { name: /odeslat odkaz/i }).closest("form") as HTMLFormElement);

        await waitFor(() => {
            expect(forgotPassword).toHaveBeenCalledWith({ email: "user@osu.cz" });
            expect(screen.getByText(/zkontrolujte e-mail/i)).toBeInTheDocument();
        });
    });

    it("shows inline error when api call fails", async () => {
        vi.mocked(forgotPassword).mockRejectedValue(new Error("fail"));

        render(
            <MemoryRouter>
                <ForgotPasswordPage />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/jan\.pavel@osu\.cz/i), {
            target: { value: "user@osu.cz" },
        });
        fireEvent.submit(screen.getByRole("button", { name: /odeslat odkaz/i }).closest("form") as HTMLFormElement);

        await waitFor(() => {
            expect(screen.getByText(/neočekávaná chyba|neoÄŤek/iu)).toBeInTheDocument();
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    it("shows not-found message when API says account does not exist", async () => {
        vi.mocked(forgotPassword).mockRejectedValue({
            response: { data: { message: "uživatel neexistuje" } },
        });

        render(
            <MemoryRouter>
                <ForgotPasswordPage />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/jan\.pavel@osu\.cz/i), {
            target: { value: "missing@osu.cz" },
        });
        fireEvent.submit(screen.getByRole("button", { name: /odeslat odkaz/i }).closest("form") as HTMLFormElement);

        await waitFor(() => {
            expect(screen.getByText(/nalezen|zaregistrujte/i)).toBeInTheDocument();
        });
    });

    it("navigates back when back link is clicked", () => {
        render(
            <MemoryRouter>
                <ForgotPasswordPage />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText((text) => text.includes("Zp")));
        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
});
