import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CompleteRegistration from "./CompleteRegistration";
import { completeRegistration, getRoleByToken, loginUser } from "../../api/userApi";
import Cookies from "js-cookie";

type CompleteRegistrationViewProps = {
    role?: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
    companyName: string;
    password: string;
    agreedToTerms: boolean;
    loading: boolean;
    setFirstName: (value: string) => void;
    setLastName: (value: string) => void;
    setStudentNumber: (value: string) => void;
    setCompanyName: (value: string) => void;
    setPassword: (value: string) => void;
    setAgreedToTerms: (value: boolean) => void;
    handleSubmit: (e: React.FormEvent) => void;
};

const { mockNavigate, mockSearchParams, getLatestProps, setLatestProps } = vi.hoisted(() => {
    let latestProps: CompleteRegistrationViewProps | undefined;

    return {
        mockNavigate: vi.fn(),
        mockSearchParams: new URLSearchParams("token=reg-token"),
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

vi.mock("js-cookie", () => ({
    default: {
        set: vi.fn(),
    },
}));

describe("CompleteRegistration", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        setLatestProps(undefined as any);
    });

    it("completes student registration, logs in and redirects", async () => {
        vi.mocked(getRoleByToken).mockResolvedValue({ role: "STUDENT" });
        vi.mocked(completeRegistration).mockResolvedValue({ success: true, email: "student@osu.cz" });
        vi.mocked(loginUser).mockResolvedValue({
            token: "token123",
            email: "student@osu.cz",
            role: "STUDENT",
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
        expect(Cookies.set).toHaveBeenCalledWith("token", "token123");
        expect(Cookies.set).toHaveBeenCalledWith("userEmail", "student@osu.cz");
        expect(Cookies.set).toHaveBeenCalledWith("userRole", "STUDENT");
        expect(mockNavigate).toHaveBeenCalledWith("/summary");
    });

    it("shows alert and does not login when registration is unsuccessful", async () => {
        vi.mocked(getRoleByToken).mockResolvedValue({ role: "EXTERNAL_WORKER" });
        vi.mocked(completeRegistration).mockResolvedValue({ success: false, message: "Neplatný token" });
        const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => undefined);

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
        expect(alertSpy).toHaveBeenCalledWith("Neplatný token");
        expect(loginUser).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();

        alertSpy.mockRestore();
    });

    it("shows communication error alert when request throws", async () => {
        vi.mocked(getRoleByToken).mockResolvedValue({ role: "STUDENT" });
        vi.mocked(completeRegistration).mockRejectedValue(new Error("network"));
        const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => undefined);

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

        expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining("Chyba komunikace"));
        expect(loginUser).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();

        alertSpy.mockRestore();
    });
});
