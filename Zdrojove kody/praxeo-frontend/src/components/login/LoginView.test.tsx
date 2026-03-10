import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import LoginView from "./LoginView";

const { mockNavigate, mockUseLogin } = vi.hoisted(() => ({
    mockNavigate: vi.fn(),
    mockUseLogin: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock("./Login", () => ({
    useLogin: mockUseLogin,
}));

describe("LoginView", () => {
    const setEmail = vi.fn();
    const setPassword = vi.fn();
    const handleLogin = vi.fn((e?: Event) => e?.preventDefault?.());

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseLogin.mockReturnValue({
            email: "",
            setEmail,
            password: "",
            setPassword,
            handleLogin,
        });
    });

    it("updates email and password fields", () => {
        render(<LoginView />);

        fireEvent.change(screen.getByLabelText("Email"), {
            target: { value: "student@osu.cz" },
        });
        fireEvent.change(screen.getByLabelText("Heslo"), {
            target: { value: "tajneheslo" },
        });

        expect(setEmail).toHaveBeenCalledWith("student@osu.cz");
        expect(setPassword).toHaveBeenCalledWith("tajneheslo");
    });

    it("calls handleLogin when form is submitted", async () => {
        const user = userEvent.setup();
        mockUseLogin.mockReturnValueOnce({
            email: "student@osu.cz",
            setEmail,
            password: "tajneheslo",
            setPassword,
            handleLogin,
        });

        render(<LoginView />);

        await user.click(screen.getByRole("button", { name: /přihlásit/i }));

        expect(handleLogin).toHaveBeenCalledTimes(1);
    });

    it("navigates to forgot-password and register pages", async () => {
        const user = userEvent.setup();
        render(<LoginView />);

        await user.click(screen.getByText(/zapomněl/i));
        expect(mockNavigate).toHaveBeenCalledWith("/forgot-password");

        await user.click(screen.getByRole("button", { name: /registrovat/i }));
        expect(mockNavigate).toHaveBeenCalledWith("/registerStudent");
    });
});
