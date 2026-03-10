import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ResetPassword from "./ResetPassword";
import { loginUser, resetPassword } from "../../api/userApi";
import Cookies from "js-cookie";

type ResetPasswordViewProps = {
    password: string;
    password2: string;
    loading: boolean;
    setPassword: (value: string) => void;
    setPassword2: (value: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
};

const { mockNavigate, mockSearchParams, getLatestProps, setLatestProps } = vi.hoisted(() => {
    let latestProps: ResetPasswordViewProps | undefined;

    return {
        mockNavigate: vi.fn(),
        mockSearchParams: new URLSearchParams("token=test-token"),
        getLatestProps: () => latestProps,
        setLatestProps: (props: ResetPasswordViewProps) => {
            latestProps = props;
        },
    };
});

const latestProps = () => {
    const props = getLatestProps();
    if (!props) {
        throw new Error("ResetPasswordView props are not available");
    }
    return props;
};

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useSearchParams: () => [mockSearchParams, vi.fn()],
    };
});

vi.mock("./ResetPasswordView", () => ({
    default: (props: ResetPasswordViewProps) => {
        setLatestProps(props);
        return <div data-testid="reset-password-view" />;
    },
}));

vi.mock("../../api/userApi", () => ({
    loginUser: vi.fn(),
    resetPassword: vi.fn(),
}));

vi.mock("js-cookie", () => ({
    default: {
        set: vi.fn(),
    },
}));

describe("ResetPassword", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        setLatestProps(undefined as any);
    });

    it("resets password, logs user in and redirects to summary", async () => {
        vi.mocked(resetPassword).mockResolvedValue({ success: true, email: "student@osu.cz" });
        vi.mocked(loginUser).mockResolvedValue({
            token: "token123",
            email: "student@osu.cz",
            role: "STUDENT",
        });

        render(
            <MemoryRouter>
                <ResetPassword />
            </MemoryRouter>
        );

        expect(screen.getByTestId("reset-password-view")).toBeInTheDocument();

        act(() => {
            latestProps().setPassword("Strong123");
            latestProps().setPassword2("Strong123");
        });

        const preventDefault = vi.fn();
        await act(async () => {
            await latestProps().handleSubmit({ preventDefault } as any);
        });

        expect(preventDefault).toHaveBeenCalledTimes(1);
        expect(resetPassword).toHaveBeenCalledWith({ token: "test-token", password: "Strong123" });
        expect(loginUser).toHaveBeenCalledWith("student@osu.cz", "Strong123");
        expect(Cookies.set).toHaveBeenCalledWith("token", "token123");
        expect(Cookies.set).toHaveBeenCalledWith("userEmail", "student@osu.cz");
        expect(Cookies.set).toHaveBeenCalledWith("userRole", "STUDENT");
        expect(mockNavigate).toHaveBeenCalledWith("/summary");
    });

    it("shows reset error and does not login when reset is unsuccessful", async () => {
        vi.mocked(resetPassword).mockResolvedValue({ success: false, message: "Token expiroval" });
        const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => undefined);

        render(
            <MemoryRouter>
                <ResetPassword />
            </MemoryRouter>
        );

        act(() => {
            latestProps().setPassword("Strong123");
            latestProps().setPassword2("Strong123");
        });

        await act(async () => {
            await latestProps().handleSubmit({ preventDefault: vi.fn() } as any);
        });

        expect(alertSpy).toHaveBeenCalledWith("Token expiroval");
        expect(loginUser).not.toHaveBeenCalled();
        expect(Cookies.set).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();

        alertSpy.mockRestore();
    });
});
