import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import Task from "./Task";
import { createTask, deleteTask, getTasks, updateTask, uploadTaskAttachment } from "../../api/tasksApi";

vi.mock("../../api/tasksApi", () => ({
    getTasks: vi.fn(),
    createTask: vi.fn(),
    deleteTask: vi.fn(),
    updateTask: vi.fn(),
    uploadTaskAttachment: vi.fn(),
}));

vi.mock("../../api/practicesApi", () => ({
    downloadAttachment: vi.fn(),
    deleteAttachment: vi.fn(),
}));

const createTaskItem = (overrides: Partial<any> = {}) => ({
    id: 10,
    title: "Původní úkol",
    description: "Původní popis",
    links: [],
    files: [],
    creationDate: "2026-04-01",
    expectedEndDate: null,
    actualEndDate: null,
    closed: false,
    finalEvaluation: "",
    evaluationAuthorName: "",
    status: "ACTIVE",
    reportFlag: false,
    ...overrides,
});

describe("Task", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(updateTask).mockResolvedValue({ id: 99, title: "Updated", description: "Updated" });
        vi.mocked(uploadTaskAttachment).mockResolvedValue({});
    });

    afterEach(async () => {
        await new Promise((resolve) => setTimeout(resolve, 350));
    });

    it("creates a new task from UI and renders it in list", async () => {
        vi.mocked(getTasks)
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([{ id: 1, title: "Úkol 1", description: "Popis úkolu" }]);
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
                files: [],
                title: "Úkol 1",
                description: "Popis úkolu",
                links: [],
                expectedEndDate: null,
                reportFlag: false,
                finalEvaluation: undefined,
            });
        });

        expect(screen.getByText("Úkol 1")).toBeInTheDocument();
        expect(screen.getByText("Popis úkolu")).toBeInTheDocument();
    });

    it("creates task with optional fields and uploads selected file", async () => {
        const file = new File(["obsah"], "zadani.pdf", { type: "application/pdf" });
        const createdTask = createTaskItem({
            id: 2,
            title: "Úkol s přílohou",
            description: "Popis s odkazem",
            links: ["https://osu.cz"],
            expectedEndDate: "2026-06-01",
            reportFlag: true,
        });

        vi.mocked(getTasks)
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([createdTask]);
        vi.mocked(createTask).mockResolvedValue(createdTask);

        const { container } = render(<Task practiceId={55} allowCreate={true} />);

        fireEvent.click(screen.getByRole("button", { name: /přidat task/i }));

        const textboxes = screen.getAllByRole("textbox");
        fireEvent.change(textboxes[0], { target: { value: "Úkol s přílohou" } });
        fireEvent.change(textboxes[1], { target: { value: "Popis s odkazem" } });
        fireEvent.change(screen.getByPlaceholderText("https://odkaz.cz"), {
            target: { value: "https://osu.cz" },
        });
        fireEvent.change(container.querySelector('input[type="date"]') as HTMLInputElement, {
            target: { value: "2026-06-01" },
        });
        fireEvent.click(screen.getByLabelText(/reportovat/i));
        fireEvent.change(container.querySelector('input[type="file"]') as HTMLInputElement, {
            target: { files: [file] },
        });

        fireEvent.click(screen.getByRole("button", { name: /^Přidat$/i }));

        await waitFor(() => {
            expect(createTask).toHaveBeenCalledWith(55, {
                files: [],
                title: "Úkol s přílohou",
                description: "Popis s odkazem",
                links: ["https://osu.cz"],
                expectedEndDate: "2026-06-01",
                reportFlag: true,
                finalEvaluation: undefined,
            });
        });
        await waitFor(() => {
            expect(uploadTaskAttachment).toHaveBeenCalledWith(55, 2, file);
        });
        expect(screen.getByText("Úkol s přílohou")).toBeInTheDocument();
    });

    it("edits existing task and saves changed fields", async () => {
        const originalTask = createTaskItem({
            id: 15,
            title: "Vlastní úkol",
            description: "Starý popis",
            links: ["https://old.cz"],
            expectedEndDate: "2026-06-01",
            reportFlag: false,
        });
        const updatedTask = createTaskItem({
            id: 15,
            title: "Upravený úkol",
            description: "Nový popis",
            links: ["https://new.cz"],
            expectedEndDate: "2026-06-01",
            reportFlag: true,
        });

        vi.mocked(getTasks)
            .mockResolvedValueOnce([originalTask])
            .mockResolvedValueOnce([updatedTask]);
        vi.mocked(updateTask).mockResolvedValue(updatedTask);

        const { container } = render(<Task practiceId={55} allowCreate={true} />);

        expect(await screen.findByText("Vlastní úkol")).toBeInTheDocument();
        fireEvent.click(screen.getByTitle("Upravit task"));

        const textboxes = screen.getAllByRole("textbox");
        fireEvent.change(textboxes[0], { target: { value: "Upravený úkol" } });
        fireEvent.change(textboxes[1], { target: { value: "Nový popis" } });
        fireEvent.change(screen.getByDisplayValue("https://old.cz"), {
            target: { value: "https://new.cz" },
        });
        fireEvent.change(container.querySelector('input[type="date"]') as HTMLInputElement, {
            target: { value: "2026-07-01" },
        });
        fireEvent.click(screen.getByLabelText(/reportovat/i));
        fireEvent.click(screen.getByRole("button", { name: /uložit změny/i }));

        await waitFor(() => {
            expect(updateTask).toHaveBeenCalledWith(15, {
                files: [],
                title: "Upravený úkol",
                description: "Nový popis",
                links: ["https://new.cz"],
                expectedEndDate: "2026-07-01",
                reportFlag: true,
                finalEvaluation: undefined,
            });
        });
        expect(await screen.findByText("Upravený úkol")).toBeInTheDocument();
    });

    it("saves final evaluation when editing existing task", async () => {
        const originalTask = createTaskItem({
            id: 20,
            title: "Vyhodnotit úkol",
            description: "Popis",
        });
        const updatedTask = createTaskItem({
            ...originalTask,
            finalEvaluation: "Závěrečné hodnocení úkolu",
            evaluationAuthorName: "Učitel",
        });

        vi.mocked(getTasks)
            .mockResolvedValueOnce([originalTask])
            .mockResolvedValueOnce([updatedTask]);
        vi.mocked(updateTask).mockResolvedValue(updatedTask);

        render(<Task practiceId={55} allowCreate={true} />);

        expect(await screen.findByText("Vyhodnotit úkol")).toBeInTheDocument();
        fireEvent.click(screen.getByTitle("Upravit task"));

        fireEvent.change(screen.getByPlaceholderText(/zadejte hodnocení/i), {
            target: { value: "Závěrečné hodnocení úkolu" },
        });
        fireEvent.click(screen.getByRole("button", { name: /uložit změny/i }));

        await waitFor(() => {
            expect(updateTask).toHaveBeenCalledWith(20, {
                files: [],
                title: "Vyhodnotit úkol",
                description: "Popis",
                links: [],
                expectedEndDate: null,
                reportFlag: false,
                finalEvaluation: "Závěrečné hodnocení úkolu",
            });
        });
        expect(await screen.findByText("Závěrečné hodnocení úkolu")).toBeInTheDocument();
    });

    it("hides create and delete controls when allowCreate is false", async () => {
        vi.mocked(getTasks).mockResolvedValue([{ id: 10, title: "Read", description: "Only" }]);

        render(<Task practiceId={55} allowCreate={false} />);

        expect(await screen.findByText("Read")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /přidat task/i })).not.toBeInTheDocument();
        expect(screen.queryByTitle("Smazat task")).not.toBeInTheDocument();
    });

    it("validates required fields before creating task", async () => {
        vi.mocked(getTasks).mockResolvedValue([]);

        render(<Task practiceId={55} allowCreate={true} />);

        fireEvent.click(screen.getByRole("button", { name: /přidat task/i }));
        fireEvent.click(screen.getByRole("button", { name: /^Přidat$/i }));

        expect(createTask).not.toHaveBeenCalled();
        expect(screen.getAllByText(/povinné pole/i)).toHaveLength(2);
    });

    it("deletes task from UI list on success", async () => {
        vi.mocked(getTasks).mockResolvedValue([{ id: 1, title: "Delete me", description: "Tmp" }]);
        vi.mocked(deleteTask).mockResolvedValue({});

        render(<Task practiceId={55} allowCreate={true} />);

        expect(await screen.findByText("Delete me")).toBeInTheDocument();

        fireEvent.click(screen.getByTitle("Smazat task"));
        fireEvent.click(screen.getByRole("button", { name: /^smazat$/i }));

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

        render(<Task practiceId={55} allowCreate={true} />);

        expect(await screen.findByText("Keep me")).toBeInTheDocument();
        fireEvent.click(screen.getByTitle("Smazat task"));
        fireEvent.click(screen.getByRole("button", { name: /^smazat$/i }));

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalled();
        });
        expect(screen.getByText("Keep me")).toBeInTheDocument();

        alertSpy.mockRestore();
    });
});

