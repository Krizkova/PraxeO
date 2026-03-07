import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CreatePractice from "./CreatePractice";
import { createPractice } from "../../api/practicesApi";

type CreatePracticeViewProps = {
    name: string;
    description: string;
    completedAt: string;
    loading: boolean;
    error: string | null;
    onChangeName: (value: string) => void;
    onChangeDescription: (value: string) => void;
    onChangeDate: (value: string) => void;
    onSubmit: () => void;
};

const { mockNavigate, getLatestProps, setLatestProps } = vi.hoisted(() => {
    let latestProps: CreatePracticeViewProps | undefined;

    return {
        mockNavigate: vi.fn(),
        getLatestProps: () => latestProps,
        setLatestProps: (props: CreatePracticeViewProps) => {
            latestProps = props;
        },
    };
});

const latestProps = () => {
    const props = getLatestProps();
    if (!props) throw new Error("CreatePracticeView props are not available");
    return props;
};

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock("./CreatePracticeView", () => ({
    default: (props: CreatePracticeViewProps) => {
        setLatestProps(props);
        return <div data-testid="create-practice-view" />;
    },
}));

vi.mock("../../api/practicesApi", () => ({
    createPractice: vi.fn(),
}));

describe("CreatePractice", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        setLatestProps(undefined as any);
    });

    it("creates practice and navigates to detail", async () => {
        vi.mocked(createPractice).mockResolvedValue({ id: 77 });

        render(
            <MemoryRouter>
                <CreatePractice />
            </MemoryRouter>
        );

        expect(screen.getByTestId("create-practice-view")).toBeInTheDocument();

        act(() => {
            latestProps().onChangeName("Praxe A");
            latestProps().onChangeDescription("Popis");
            latestProps().onChangeDate("2026-06-01");
        });

        await act(async () => {
            await latestProps().onSubmit();
        });

        expect(createPractice).toHaveBeenCalledWith({
            name: "Praxe A",
            description: "Popis",
            completedAt: "2026-06-01",
        });
        expect(mockNavigate).toHaveBeenCalledWith("/practices/77");
    });

    it("shows alert when create fails", async () => {
        vi.mocked(createPractice).mockRejectedValue(new Error("Chyba"));
        const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => undefined);

        render(
            <MemoryRouter>
                <CreatePractice />
            </MemoryRouter>
        );

        act(() => {
            latestProps().onChangeName("Praxe A");
            latestProps().onChangeDescription("Popis");
            latestProps().onChangeDate("2026-06-01");
        });

        await act(async () => {
            await latestProps().onSubmit();
        });

        expect(alertSpy).toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();

        alertSpy.mockRestore();
    });
});
