import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import Task from "./Task";
import { createTask, deleteTask, getTasks } from "../../api/tasksApi";

vi.mock("../../api/tasksApi", () => ({
    getTasks: vi.fn(),
    createTask: vi.fn(),
    deleteTask: vi.fn(),
}));

describe("Task", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("creates a new task from UI and renders it in list", async () => {
        vi.mocked(getTasks).mockResolvedValue([]);
        vi.mocked(createTask).mockResolvedValue({
            id: 1,
            title: "Úkol 1",
            description: "Popis úkolu",
        });

        render(<Task practiceId={55} allowCreate={true} />);

        fireEvent.click(screen.getByRole("button", { name: /přidat task/i }));

        const textboxes = screen.getAllByRole("textbox");
        fireEvent.change(textboxes[0], { target: { value: "Úkol 1" } });
        fireEvent.change(textboxes[1], { target: { value: "Popis úkolu" } });

        fireEvent.click(screen.getByRole("button", { name: /^Přidat$/i }));

        await waitFor(() => {
            expect(createTask).toHaveBeenCalledWith(55, {
                title: "Úkol 1",
                description: "Popis úkolu",
            });
        });

        expect(screen.getByText("Úkol 1")).toBeInTheDocument();
        expect(screen.getByText("Popis úkolu")).toBeInTheDocument();
    });

    it("hides create and delete controls when allowCreate is false", async () => {
        vi.mocked(getTasks).mockResolvedValue([{ id: 10, title: "Read", description: "Only" }]);

        const { container } = render(<Task practiceId={55} allowCreate={false} />);

        expect(await screen.findByText("Read")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /přidat task/i })).not.toBeInTheDocument();
        expect(container.querySelector("button.btn-outline-danger")).toBeNull();
    });

    it("shows alert when create task fails", async () => {
        vi.mocked(getTasks).mockResolvedValue([]);
        vi.mocked(createTask).mockRejectedValue({
            response: { data: { message: "Task create failed" } },
        });
        const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => undefined);

        render(<Task practiceId={55} allowCreate={true} />);

        fireEvent.click(screen.getByRole("button", { name: /přidat task/i }));
        const textboxes = screen.getAllByRole("textbox");
        fireEvent.change(textboxes[0], { target: { value: "Úkol error" } });
        fireEvent.change(textboxes[1], { target: { value: "Popis error" } });
        fireEvent.click(screen.getByRole("button", { name: /^Přidat$/i }));

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalled();
        });

        alertSpy.mockRestore();
    });

    it("deletes task from UI list on success", async () => {
        vi.mocked(getTasks).mockResolvedValue([{ id: 1, title: "Delete me", description: "Tmp" }]);
        vi.mocked(deleteTask).mockResolvedValue({});

        const { container } = render(<Task practiceId={55} allowCreate={true} />);

        expect(await screen.findByText("Delete me")).toBeInTheDocument();

        fireEvent.click(container.querySelector("button.btn-outline-danger") as HTMLButtonElement);

        await waitFor(() => {
            expect(deleteTask).toHaveBeenCalledWith(1);
        });
        await waitFor(() => {
            expect(screen.queryByText("Delete me")).not.toBeInTheDocument();
        });
    });

    it("shows alert when delete task fails", async () => {
        vi.mocked(getTasks).mockResolvedValue([{ id: 2, title: "Keep me", description: "Stay" }]);
        vi.mocked(deleteTask).mockRejectedValue({
            response: { data: { message: "Task delete failed" } },
        });
        const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => undefined);

        const { container } = render(<Task practiceId={55} allowCreate={true} />);

        expect(await screen.findByText("Keep me")).toBeInTheDocument();
        fireEvent.click(container.querySelector("button.btn-outline-danger") as HTMLButtonElement);

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalled();
        });
        expect(screen.getByText("Keep me")).toBeInTheDocument();

        alertSpy.mockRestore();
    });
});
