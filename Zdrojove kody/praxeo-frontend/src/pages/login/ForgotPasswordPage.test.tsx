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
        const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => undefined);

        render(
            <MemoryRouter>
                <ForgotPasswordPage />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/zadejte email/i), {
            target: { value: "user@osu.cz" },
        });
        fireEvent.submit(screen.getByRole("button", { name: /obnovit heslo/i }).closest("form") as HTMLFormElement);

        await waitFor(() => {
            expect(forgotPassword).toHaveBeenCalledWith({ email: "user@osu.cz" });
            expect(alertSpy).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });

        alertSpy.mockRestore();
    });

    it("shows error alert when api call fails", async () => {
        vi.mocked(forgotPassword).mockRejectedValue(new Error("fail"));
        const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => undefined);

        render(
            <MemoryRouter>
                <ForgotPasswordPage />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/zadejte email/i), {
            target: { value: "user@osu.cz" },
        });
        fireEvent.submit(screen.getByRole("button", { name: /obnovit heslo/i }).closest("form") as HTMLFormElement);

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalled();
            expect(mockNavigate).not.toHaveBeenCalledWith("/");
        });

        alertSpy.mockRestore();
    });
});
