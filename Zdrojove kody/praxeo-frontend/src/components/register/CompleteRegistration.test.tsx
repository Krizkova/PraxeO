import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CompleteRegistration from "./CompleteRegistration";
import { completeRegistration, getRoleByToken, loginUser } from "../../api/userApi";

type CompleteRegistrationViewProps = {
    role?: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
    companyName: string;
    password: string;
    agreedToTerms: boolean;
    loading: boolean;
    errorMessage: string;
    tokenInvalid: boolean;
    setFirstName: (value: string) => void;
    setLastName: (value: string) => void;
    setStudentNumber: (value: string) => void;
    setCompanyName: (value: string) => void;
    setPassword: (value: string) => void;
    setAgreedToTerms: (value: boolean) => void;
    handleSubmit: (e: React.FormEvent) => void;
};

const { mockNavigate, mockSearchParams, mockAuthLogin, getLatestProps, setLatestProps } = vi.hoisted(() => {
    let latestProps: CompleteRegistrationViewProps | undefined;

    return {
        mockNavigate: vi.fn(),
        mockSearchParams: new URLSearchParams("token=reg-token"),
        mockAuthLogin: vi.fn(),
        getLatestProps: () => latestProps,
        setLatestProps: (props: CompleteRegistrationViewProps) => {
            latestProps = props;
        },
    };
});

const latestProps = () => {
    const props = getLatestProps();
    if (!props) throw new Error("CompleteRegistrationView props are not available");
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

vi.mock("./CompleteRegistrationView", () => ({
    default: (props: CompleteRegistrationViewProps) => {
        setLatestProps(props);
        return <div data-testid="complete-registration-view" />;
    },
}));

vi.mock("../../api/userApi", () => ({
    completeRegistration: vi.fn(),
    loginUser: vi.fn(),
    getRoleByToken: vi.fn(),
}));

vi.mock("../../context/AuthContext", () => ({
    useAuth: () => ({
        login: mockAuthLogin,
    }),
}));

describe("CompleteRegistration", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        setLatestProps(undefined as any);
    });

    it("completes student registration, logs in through auth context and redirects", async () => {
        vi.mocked(getRoleByToken).mockResolvedValue({ role: "STUDENT" });
        vi.mocked(completeRegistration).mockResolvedValue({ success: true, email: "student@osu.cz" });
        vi.mocked(loginUser).mockResolvedValue({
            token: "token123",
            email: "student@osu.cz",
            role: "STUDENT",
            firstName: "Jan",
            lastName: "Novák",
        });

        render(
            <MemoryRouter>
                <CompleteRegistration />
            </MemoryRouter>
        );

        expect(screen.getByTestId("complete-registration-view")).toBeInTheDocument();

        await act(async () => {
            await Promise.resolve();
        });

        act(() => {
            latestProps().setFirstName("Jan");
            latestProps().setLastName("Novák");
            latestProps().setPassword("Strong123");
            latestProps().setStudentNumber("S12345");
            latestProps().setAgreedToTerms(true);
        });

        await act(async () => {
            await latestProps().handleSubmit({ preventDefault: vi.fn() } as any);
        });

        expect(getRoleByToken).toHaveBeenCalledWith("reg-token");
        expect(completeRegistration).toHaveBeenCalledWith({
            token: "reg-token",
            password: "Strong123",
            firstName: "Jan",
            lastName: "Novák",
            studentNumber: "S12345",
        });
        expect(loginUser).toHaveBeenCalledWith("student@osu.cz", "Strong123");
        expect(mockAuthLogin).toHaveBeenCalledWith("token123", {
            email: "student@osu.cz",
            role: "STUDENT",
            firstName: "Jan",
            lastName: "Novák",
        });
        expect(mockNavigate).toHaveBeenCalledWith("/summary", {
            replace: true,
            state: { fromRegistration: true },
        });
    });

    it("sets error and does not login when registration is unsuccessful", async () => {
        vi.mocked(getRoleByToken).mockResolvedValue({ role: "EXTERNAL_WORKER" });
        vi.mocked(completeRegistration).mockResolvedValue({ success: false, message: "Neplatný token" });

        render(
            <MemoryRouter>
                <CompleteRegistration />
            </MemoryRouter>
        );

        await act(async () => {
            await Promise.resolve();
        });

        act(() => {
            latestProps().setFirstName("Eva");
            latestProps().setLastName("Dvořáková");
            latestProps().setPassword("Strong123");
            latestProps().setCompanyName("ACME");
            latestProps().setAgreedToTerms(true);
        });

        await act(async () => {
            await latestProps().handleSubmit({ preventDefault: vi.fn() } as any);
        });

        expect(completeRegistration).toHaveBeenCalledWith({
            token: "reg-token",
            password: "Strong123",
            firstName: "Eva",
            lastName: "Dvořáková",
            companyName: "ACME",
        });
        expect(latestProps().errorMessage).toBe("Neplatný token");
        expect(loginUser).not.toHaveBeenCalled();
        expect(mockAuthLogin).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("sets communication error when request throws", async () => {
        vi.mocked(getRoleByToken).mockResolvedValue({ role: "STUDENT" });
        vi.mocked(completeRegistration).mockRejectedValue(new Error("network"));

        render(
            <MemoryRouter>
                <CompleteRegistration />
            </MemoryRouter>
        );

        await act(async () => {
            await Promise.resolve();
        });

        act(() => {
            latestProps().setFirstName("Jan");
            latestProps().setLastName("Novák");
            latestProps().setPassword("Strong123");
            latestProps().setStudentNumber("S12345");
            latestProps().setAgreedToTerms(true);
        });

        await act(async () => {
            await latestProps().handleSubmit({ preventDefault: vi.fn() } as any);
        });

        expect(latestProps().errorMessage).toContain("Tento odkaz");
        expect(loginUser).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
