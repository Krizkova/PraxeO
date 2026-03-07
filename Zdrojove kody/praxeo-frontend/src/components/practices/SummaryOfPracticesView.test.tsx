import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import SummaryOfPracticesView from "./SummaryOfPracticesView";

const practices = [
    {
        id: 2,
        name: "B-practice",
        state: "IN_PROGRESS",
        founderEmail: "b@osu.cz",
        studentEmail: "student2@osu.cz",
        selectedAt: "2026-01-03",
        completedAt: "2026-05-01",
    },
    {
        id: 1,
        name: "A-practice",
        state: "CREATED",
        founderEmail: "a@osu.cz",
        studentEmail: "student1@osu.cz",
        selectedAt: "2026-01-02",
        completedAt: "2026-04-01",
    },
];

describe("SummaryOfPracticesView", () => {
    it("filters rows by search query", () => {
        render(
            <SummaryOfPracticesView
                practices={practices}
                loading={false}
                error={null}
                onOpenDetail={vi.fn()}
                onCreate={vi.fn()}
                canCreate={true}
            />
        );

        fireEvent.change(screen.getByPlaceholderText(/vyhledávání/i), {
            target: { value: "A-practice" },
        });

        expect(screen.getByText("A-practice")).toBeInTheDocument();
        expect(screen.queryByText("B-practice")).not.toBeInTheDocument();
    });

    it("calls onCreate and onOpenDetail actions", () => {
        const onCreate = vi.fn();
        const onOpenDetail = vi.fn();

        render(
            <SummaryOfPracticesView
                practices={practices}
                loading={false}
                error={null}
                onOpenDetail={onOpenDetail}
                onCreate={onCreate}
                canCreate={true}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: /přidat praxi/i }));
        expect(onCreate).toHaveBeenCalledTimes(1);

        fireEvent.doubleClick(screen.getByText("A-practice").closest("tr") as HTMLTableRowElement);
        expect(onOpenDetail).toHaveBeenCalledWith(1);
    });
});
