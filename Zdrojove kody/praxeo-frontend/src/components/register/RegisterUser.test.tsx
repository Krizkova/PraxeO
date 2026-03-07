import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import RegisterUser from "./RegisterUser";
import { registerUser } from "../../api/userApi";

type RegisterUserViewProps = {
    formData: { email: string; role: string };
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    isAdminOrTeacher: boolean;
    roleSelect: string;
    onRoleChange: (role: string) => void;
};

const { mockNavigate, getLatestProps, setLatestProps } = vi.hoisted(() => {
    let latestProps: RegisterUserViewProps | undefined;

    return {
        mockNavigate: vi.fn(),
        getLatestProps: () => latestProps,
        setLatestProps: (props: RegisterUserViewProps) => {
            latestProps = props;
        },
    };
});

const latestProps = () => {
    const props = getLatestProps();
    if (!props) throw new Error("RegisterUserView props are not available");
    return props;
};

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock("js-cookie", () => ({
    default: {
        get: vi.fn(() => "ADMIN"),
    },
}));

vi.mock("./RegisterUserView", () => ({
    default: (props: RegisterUserViewProps) => {
        setLatestProps(props);
        return <div data-testid="register-user-view" />;
    },
}));

vi.mock("../../api/userApi", () => ({
    registerUser: vi.fn(),
}));

describe("RegisterUser", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        setLatestProps(undefined as any);
    });

    it("submits selected role for admin/teacher", async () => {
        vi.mocked(registerUser).mockResolvedValue({});
        const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => undefined);

        render(
            <MemoryRouter>
                <RegisterUser isAdminOrTeacher={true} />
            </MemoryRouter>
        );

        expect(screen.getByTestId("register-user-view")).toBeInTheDocument();

        act(() => {
            latestProps().onRoleChange("EXTERNAL_WORKER");
            latestProps().onChange({ target: { name: "email", value: "new@osu.cz" } } as any);
        });

        await act(async () => {
            await latestProps().onSubmit({ preventDefault: vi.fn() } as any);
        });

        expect(registerUser).toHaveBeenCalledWith({
            email: "new@osu.cz",
            role: "EXTERNAL_WORKER",
        });
        expect(alertSpy).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/");

        alertSpy.mockRestore();
    });

    it("forces STUDENT role for non-admin submit", async () => {
        vi.mocked(registerUser).mockResolvedValue({});
        const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => undefined);

        render(
            <MemoryRouter>
                <RegisterUser isAdminOrTeacher={false} />
            </MemoryRouter>
        );

        act(() => {
            latestProps().onChange({ target: { name: "email", value: "student@osu.cz" } } as any);
        });

        await act(async () => {
            await latestProps().onSubmit({ preventDefault: vi.fn() } as any);
        });

        expect(registerUser).toHaveBeenCalledWith({
            email: "student@osu.cz",
            role: "STUDENT",
        });
        expect(alertSpy).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/");

        alertSpy.mockRestore();
    });
});
