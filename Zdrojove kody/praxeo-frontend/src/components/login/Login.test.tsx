import { act, renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useLogin } from "./useLogin";
import { loginUser } from "../../api/userApi";

const { mockNavigate, mockAuthLogin } = vi.hoisted(() => ({
    mockNavigate: vi.fn(),
    mockAuthLogin: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock("../../api/userApi", () => ({
    loginUser: vi.fn(),
}));

vi.mock("../../context/AuthContext", () => ({
    useAuth: () => ({
        login: mockAuthLogin,
    }),
}));

describe("useLogin", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <MemoryRouter>{children}</MemoryRouter>
    );

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("logs user in through auth context and navigates to summary", async () => {
        vi.mocked(loginUser).mockResolvedValue({
            token: "token123",
            email: "student@osu.cz",
            role: "STUDENT",
            firstName: "Jan",
        });

        const { result } = renderHook(() => useLogin(), { wrapper });

        act(() => {
            result.current.setEmail("student@osu.cz");
            result.current.setPassword("tajneheslo");
        });

        const preventDefault = vi.fn();
        await act(async () => {
            await result.current.handleLogin({ preventDefault } as any);
        });

        expect(preventDefault).toHaveBeenCalledTimes(1);
        expect(loginUser).toHaveBeenCalledWith("student@osu.cz", "tajneheslo");
        expect(mockAuthLogin).toHaveBeenCalledWith("token123", {
            email: "student@osu.cz",
            role: "STUDENT",
            firstName: "Jan",
            lastName: undefined,
        });
        expect(mockNavigate).toHaveBeenCalledWith("/summary");
    });

    it("sets unauthorized error message on invalid credentials", async () => {
        vi.mocked(loginUser).mockRejectedValue({ response: { status: 401 } });

        const { result } = renderHook(() => useLogin(), { wrapper });

        act(() => {
            result.current.setEmail("student@osu.cz");
            result.current.setPassword("spatneheslo");
        });

        const preventDefault = vi.fn();
        await act(async () => {
            await result.current.handleLogin({ preventDefault } as any);
        });

        expect(preventDefault).toHaveBeenCalledTimes(1);
        expect(result.current.error).toContain("Nesprávný e-mail nebo heslo");
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(mockAuthLogin).not.toHaveBeenCalled();
    });

    it("sets fallback error message when error has no known status", async () => {
        vi.mocked(loginUser).mockRejectedValue({});

        const { result } = renderHook(() => useLogin(), { wrapper });

        act(() => {
            result.current.setEmail("student@osu.cz");
            result.current.setPassword("spatneheslo");
        });

        await act(async () => {
            await result.current.handleLogin({ preventDefault: vi.fn() } as any);
        });

        expect(result.current.error).toContain("Nastala chyba při přihlášení");
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
