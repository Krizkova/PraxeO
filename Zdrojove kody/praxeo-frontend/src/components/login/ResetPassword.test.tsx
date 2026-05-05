import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ResetPassword from "./ResetPassword";
import { getRoleByToken, loginUser, resetPassword } from "../../api/userApi";

type ResetPasswordViewProps = {
    password: string;
    password2: string;
    loading: boolean;
    errorMessage: string;
    tokenInvalid: boolean;
    setPassword: (value: string) => void;
    setPassword2: (value: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
};

const { mockNavigate, mockSearchParams, mockAuthLogin, getLatestProps, setLatestProps } = vi.hoisted(() => {
    let latestProps: ResetPasswordViewProps | undefined;

    return {
        mockNavigate: vi.fn(),
        mockSearchParams: new URLSearchParams("token=test-token"),
        mockAuthLogin: vi.fn(),
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
    getRoleByToken: vi.fn(),
    loginUser: vi.fn(),
    resetPassword: vi.fn(),
}));

vi.mock("../../context/AuthContext", () => ({
    useAuth: () => ({
        login: mockAuthLogin,
    }),
}));

describe("ResetPassword", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        setLatestProps(undefined as any);
        mockSearchParams.set("token", "test-token");
        vi.mocked(getRoleByToken).mockResolvedValue({ role: "STUDENT" });
    });

    it("resets password, logs user in through auth context and redirects to summary", async () => {
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
        expect(mockAuthLogin).toHaveBeenCalledWith("token123", {
            email: "student@osu.cz",
            role: "STUDENT",
            firstName: undefined,
            lastName: undefined,
        });
        expect(mockNavigate).toHaveBeenCalledWith("/summary", {
            replace: true,
            state: { fromPasswordReset: true },
        });
    });

    it("sets reset error and does not login when reset is unsuccessful", async () => {
        vi.mocked(resetPassword).mockResolvedValue({ success: false, message: "Token expiroval" });

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

        expect(latestProps().errorMessage).toBe("Token expiroval");
        expect(loginUser).not.toHaveBeenCalled();
        expect(mockAuthLogin).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("sets token error when reset token is missing from URL", async () => {
        mockSearchParams.delete("token");

        render(
            <MemoryRouter>
                <ResetPassword />
            </MemoryRouter>
        );

        await act(async () => {
            await Promise.resolve();
        });

        expect(latestProps().tokenInvalid).toBe(true);
        expect(latestProps().errorMessage).toContain("Tento odkaz");
        expect(getRoleByToken).not.toHaveBeenCalled();
        expect(resetPassword).not.toHaveBeenCalled();
    });

    it("does not call reset API when passwords do not match", async () => {
        render(
            <MemoryRouter>
                <ResetPassword />
            </MemoryRouter>
        );

        act(() => {
            latestProps().setPassword("Strong123");
            latestProps().setPassword2("Different123");
        });

        await act(async () => {
            await latestProps().handleSubmit({ preventDefault: vi.fn() } as any);
        });

        expect(latestProps().errorMessage).toBe("Hesla se neshodují.");
        expect(resetPassword).not.toHaveBeenCalled();
        expect(loginUser).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("sets error when auto login fails after successful reset", async () => {
        vi.mocked(resetPassword).mockResolvedValue({ success: true, email: "student@osu.cz" });
        vi.mocked(loginUser).mockResolvedValue(undefined as any);

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

        expect(latestProps().errorMessage).toContain("přihlášení se nezdařilo");
        expect(mockAuthLogin).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("sets communication error when reset request throws", async () => {
        vi.mocked(resetPassword).mockRejectedValue({ response: { data: { message: "Server down" } } });

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

        expect(latestProps().errorMessage).toBe("Server down");
        expect(latestProps().tokenInvalid).toBe(true);
        expect(loginUser).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
