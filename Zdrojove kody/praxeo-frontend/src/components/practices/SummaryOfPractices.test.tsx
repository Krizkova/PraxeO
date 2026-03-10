import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import SummaryOfPractices from "./SummaryOfPractices";
import { getPracticesByRole } from "../../api/practicesApi";
import { getCurrentUser } from "../../api/userApi";

type SummaryViewProps = {
    practices: any[];
    loading: boolean;
    error: string | null;
    onOpenDetail: (id: number) => void;
    onCreate: () => void;
    canCreate: boolean;
};

const { mockNavigate, getLatestProps, setLatestProps } = vi.hoisted(() => {
    let latestProps: SummaryViewProps | undefined;

    return {
        mockNavigate: vi.fn(),
        getLatestProps: () => latestProps,
        setLatestProps: (props: SummaryViewProps) => {
            latestProps = props;
        },
    };
});

const latestProps = () => {
    const props = getLatestProps();
    if (!props) throw new Error("SummaryOfPracticesView props are not available");
    return props;
};

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock("./SummaryOfPracticesView", () => ({
    default: (props: SummaryViewProps) => {
        setLatestProps(props);
        return <div data-testid="summary-view" />;
    },
}));

vi.mock("../../api/practicesApi", () => ({
    getPracticesByRole: vi.fn(),
}));

vi.mock("../../api/userApi", () => ({
    getCurrentUser: vi.fn(),
}));

describe("SummaryOfPractices", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        setLatestProps(undefined as any);
    });

    it("loads practices and enables create for teacher role", async () => {
        vi.mocked(getCurrentUser).mockResolvedValue({ role: "TEACHER" });
        vi.mocked(getPracticesByRole).mockResolvedValue([{ id: 10, name: "Praxe" }]);

        render(
            <MemoryRouter>
                <SummaryOfPractices />
            </MemoryRouter>
        );

        expect(screen.getByTestId("summary-view")).toBeInTheDocument();

        await act(async () => {
            await Promise.resolve();
            await Promise.resolve();
        });

        expect(latestProps().practices).toEqual([{ id: 10, name: "Praxe" }]);
        expect(latestProps().canCreate).toBe(true);

        act(() => {
            latestProps().onCreate();
            latestProps().onOpenDetail(10);
        });

        expect(mockNavigate).toHaveBeenCalledWith("/practices/create");
        expect(mockNavigate).toHaveBeenCalledWith("/practices/10");
    });

    it("sets error when loading practices fails", async () => {
        vi.mocked(getCurrentUser).mockResolvedValue({ role: "STUDENT" });
        vi.mocked(getPracticesByRole).mockRejectedValue(new Error("fail"));
        const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => undefined);

        render(
            <MemoryRouter>
                <SummaryOfPractices />
            </MemoryRouter>
        );

        await act(async () => {
            await Promise.resolve();
            await Promise.resolve();
        });

        expect(latestProps().error).toContain("Nepodařilo se načíst praxe");
        expect(latestProps().canCreate).toBe(false);
        expect(alertSpy).toHaveBeenCalled();

        alertSpy.mockRestore();
    });
});
