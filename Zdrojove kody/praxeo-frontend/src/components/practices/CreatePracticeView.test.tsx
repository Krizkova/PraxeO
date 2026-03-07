import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import CreatePracticeView from "./CreatePracticeView";

describe("CreatePracticeView", () => {
    it("keeps submit disabled for invalid form and enables it for valid form", () => {
        const { rerender } = render(
            <CreatePracticeView
                name=""
                description=""
                completedAt=""
                loading={false}
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
                completedAt="2026-05-01"
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
                completedAt="2026-05-01"
                loading={false}
                error={null}
                onChangeName={vi.fn()}
                onChangeDescription={vi.fn()}
                onChangeDate={vi.fn()}
                onSubmit={onSubmit}
            />
        );

        fireEvent.submit(screen.getByRole("button").closest("form") as HTMLFormElement);
        expect(onSubmit).toHaveBeenCalledTimes(1);
    });
});
