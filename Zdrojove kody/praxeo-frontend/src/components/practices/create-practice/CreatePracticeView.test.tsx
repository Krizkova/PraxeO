import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import CreatePracticeView from "./CreatePracticeView";

describe("CreatePracticeView", () => {
    it("shows validation errors for invalid form and does not submit", () => {
        const onSubmit = vi.fn();

        render(
            <CreatePracticeView
                name=""
                description=""
                completedAt=""
                loading={false}
                error={null}
                onChangeName={vi.fn()}
                onChangeDescription={vi.fn()}
                onChangeDate={vi.fn()}
                onSubmit={onSubmit}
            />
        );

        const button = screen.getByRole("button", { name: /vytvořit praxi/i });
        expect(button).not.toBeDisabled();

        fireEvent.click(button);

        expect(onSubmit).not.toHaveBeenCalled();
        expect(screen.getAllByText(/povinné pole/i)).toHaveLength(3);
        expect(screen.getByText(/vyplňte povinná pole/i)).toBeInTheDocument();
    });

    it("disables submit only while loading", () => {
        const { rerender } = render(
            <CreatePracticeView
                name="Praxe A"
                description="Popis"
                completedAt="2026-06-01"
                loading={true}
                error={null}
                onChangeName={vi.fn()}
                onChangeDescription={vi.fn()}
                onChangeDate={vi.fn()}
                onSubmit={vi.fn()}
            />
        );

        expect(screen.getByRole("button")).toBeDisabled();

        rerender(
            <CreatePracticeView
                name="Praxe A"
                description="Popis"
                completedAt="2026-06-01"
                loading={false}
                error={null}
                onChangeName={vi.fn()}
                onChangeDescription={vi.fn()}
                onChangeDate={vi.fn()}
                onSubmit={vi.fn()}
            />
        );

        expect(screen.getByRole("button")).not.toBeDisabled();
    });

    it("calls onSubmit on valid form submit", () => {
        const onSubmit = vi.fn();

        render(
            <CreatePracticeView
                name="Praxe A"
                description="Popis"
                completedAt="2026-06-01"
                loading={false}
                error={null}
                onChangeName={vi.fn()}
                onChangeDescription={vi.fn()}
                onChangeDate={vi.fn()}
                onSubmit={onSubmit}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: /vytvořit praxi/i }));
        expect(onSubmit).toHaveBeenCalledTimes(1);
    });
});
