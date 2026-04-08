import { act, renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useLogin } from "./Login";
import { loginUser } from "../../api/userApi";
import Cookies from "js-cookie";

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

vi.mock("../../api/userApi", () => ({
    loginUser: vi.fn(),
}));

vi.mock("js-cookie", () => ({
    default: {
        set: vi.fn(),
    },
}));

describe("useLogin", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <MemoryRouter>{children}</MemoryRouter>
    );

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("logs user in, stores cookies and navigates to summary", async () => {
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
        expect(Cookies.set).toHaveBeenCalledWith("token", "token123", { expires: 1, path: "/" });
        expect(Cookies.set).toHaveBeenCalledWith("userEmail", "student@osu.cz");
        expect(Cookies.set).toHaveBeenCalledWith("userRole", "STUDENT");
        expect(Cookies.set).toHaveBeenCalledWith("userName", "Jan");
        expect(mockNavigate).toHaveBeenCalledWith("/summary");
    });

    it("shows alert on login error", async () => {
        vi.mocked(loginUser).mockRejectedValue(new Error("Neplatné údaje"));
        const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => undefined);

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
        expect(alertSpy).toHaveBeenCalledWith("Neplatné údaje");
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(Cookies.set).not.toHaveBeenCalled();

        alertSpy.mockRestore();
    });

    it("shows fallback alert message when error has no message", async () => {
        vi.mocked(loginUser).mockRejectedValue({});
        const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => undefined);

        const { result } = renderHook(() => useLogin(), { wrapper });

        act(() => {
            result.current.setEmail("student@osu.cz");
            result.current.setPassword("spatneheslo");
        });

        await act(async () => {
            await result.current.handleLogin({ preventDefault: vi.fn() } as any);
        });

        expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining("Chyba"));
        expect(mockNavigate).not.toHaveBeenCalled();

        alertSpy.mockRestore();
    });
});
