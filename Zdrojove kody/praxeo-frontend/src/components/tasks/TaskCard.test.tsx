import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import TaskCard from "./TaskCard";
import { deleteAttachment, downloadAttachment } from "../../api/practicesApi";

vi.mock("../../api/practicesApi", () => ({
    downloadAttachment: vi.fn(),
    deleteAttachment: vi.fn(),
}));

const baseTask = {
    id: 10,
    title: "Task detail",
    description: "Popis tasku",
    links: ["osu.cz"],
    files: [{ id: 5, title: "zadani.pdf" }],
    creationDate: "2026-04-01",
    expectedEndDate: "2026-06-01",
    actualEndDate: "2026-06-10",
    closed: false,
    finalEvaluation: "Splněno dobře",
    evaluationAuthorName: "Učitel",
    status: "ACTIVE" as const,
    reportFlag: true,
    founder: { name: "Autor" },
};

describe("TaskCard", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders task metadata, links, files and final evaluation", () => {
        render(
            <TaskCard
                task={baseTask}
                allowCreate={true}
                currentUserEmail="autor@osu.cz"
                onEdit={vi.fn()}
                onDelete={vi.fn()}
            />
        );

        expect(screen.getByText("Task detail")).toBeInTheDocument();
        expect(screen.getByText("Popis tasku")).toBeInTheDocument();
        expect(screen.getByText(/reportuje se/i)).toBeInTheDocument();
        expect(screen.getByText("zadani.pdf")).toBeInTheDocument();
        expect(screen.getByText("Splněno dobře")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "[1]" })).toHaveAttribute("href", "https://osu.cz");
    });

    it("calls edit and delete actions for active task", () => {
        const onEdit = vi.fn();
        const onDelete = vi.fn();

        render(
            <TaskCard
                task={baseTask}
                allowCreate={true}
                currentUserEmail="autor@osu.cz"
                onEdit={onEdit}
                onDelete={onDelete}
            />
        );

        fireEvent.click(screen.getByTitle("Upravit task"));
        fireEvent.click(screen.getByTitle("Smazat task"));

        expect(onEdit).toHaveBeenCalledWith(baseTask);
        expect(onDelete).toHaveBeenCalledWith(10);
    });

    it("downloads attachment from task card", async () => {
        const createObjectURL = vi.fn(() => "blob:task-file");
        vi.stubGlobal("URL", { ...window.URL, createObjectURL });
        vi.mocked(downloadAttachment).mockResolvedValue({ data: new Blob(["x"]) } as any);

        render(
            <TaskCard
                task={baseTask}
                allowCreate={true}
                currentUserEmail="autor@osu.cz"
                onEdit={vi.fn()}
                onDelete={vi.fn()}
            />
        );

        fireEvent.click(screen.getByTitle("Stáhnout"));

        await waitFor(() => {
            expect(downloadAttachment).toHaveBeenCalledWith(5);
        });
        expect(createObjectURL).toHaveBeenCalled();
    });

    it("does not delete attachment when confirmation is declined", async () => {
        render(
            <TaskCard
                task={baseTask}
                allowCreate={true}
                currentUserEmail="autor@osu.cz"
                onEdit={vi.fn()}
                onDelete={vi.fn()}
            />
        );

        fireEvent.click(screen.getByTitle("Smazat"));
        fireEvent.click(screen.getByRole("button", { name: /zrušit/i }));

        expect(deleteAttachment).not.toHaveBeenCalled();
    });

    it("deletes attachment after confirmation", async () => {
        vi.mocked(deleteAttachment).mockResolvedValue({} as any);

        render(
            <TaskCard
                task={baseTask}
                allowCreate={true}
                currentUserEmail="autor@osu.cz"
                onEdit={vi.fn()}
                onDelete={vi.fn()}
            />
        );

        fireEvent.click(screen.getByTitle("Smazat"));
        fireEvent.click(screen.getAllByRole("button", { name: /smazat/i })[0]);

        await waitFor(() => {
            expect(deleteAttachment).toHaveBeenCalledWith(5);
        });
    });

    it("hides attachment delete action when task cannot be edited", () => {
        render(
            <TaskCard
                task={baseTask}
                allowCreate={false}
                currentUserEmail="student@osu.cz"
                onEdit={vi.fn()}
                onDelete={vi.fn()}
            />
        );

        expect(screen.getByTitle("Stáhnout")).toBeInTheDocument();
        expect(screen.queryByTitle("Smazat")).not.toBeInTheDocument();
    });

    it("hides task actions for completed task", () => {
        render(
            <TaskCard
                task={{ ...baseTask, status: "COMPLETED" }}
                allowCreate={true}
                currentUserEmail="autor@osu.cz"
                onEdit={vi.fn()}
                onDelete={vi.fn()}
            />
        );

        expect(screen.queryByTitle("Upravit task")).not.toBeInTheDocument();
        expect(screen.queryByTitle("Smazat task")).not.toBeInTheDocument();
    });
});
