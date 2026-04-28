import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import TaskModal from "./TaskModal";
import { deleteAttachment, downloadAttachment } from "../../api/practicesApi";

vi.mock("../../api/practicesApi", () => ({
    downloadAttachment: vi.fn(),
    deleteAttachment: vi.fn(),
}));

const createProps = (overrides: Partial<any> = {}) => ({
    show: true,
    editingTask: null,
    title: "Task A",
    description: "Popis",
    linkItems: ["https://osu.cz"],
    selectedFiles: [],
    expectedEndDate: "",
    reportFlag: false,
    finalEvaluation: "",
    minDateValue: "2026-04-01",
    maxDateValue: "2031-04-01",
    dateInvalid: false,
    setTitle: vi.fn(),
    setDescription: vi.fn(),
    setExpectedEndDate: vi.fn(),
    setReportFlag: vi.fn(),
    setFinalEvaluation: vi.fn(),
    addLink: vi.fn(),
    updateLink: vi.fn(),
    removeLink: vi.fn(),
    handleFileChange: vi.fn(),
    removeFile: vi.fn(),
    handleSubmit: vi.fn(),
    resetForm: vi.fn(),
    ...overrides,
});

describe("TaskModal", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("does not render when hidden", () => {
        render(<TaskModal {...createProps({ show: false })} />);

        expect(screen.queryByText(/task/i)).not.toBeInTheDocument();
    });

    it("updates required fields and closes modal", () => {
        const props = createProps();

        render(<TaskModal {...props} />);

        fireEvent.change(screen.getByPlaceholderText("Název tasku"), {
            target: { value: "Nový název" },
        });
        fireEvent.change(screen.getByPlaceholderText("Popis tasku..."), {
            target: { value: "Nový popis" },
        });
        fireEvent.click(screen.getByRole("button", { name: /zrušit/i }));

        expect(props.setTitle).toHaveBeenCalledWith("Nový název");
        expect(props.setDescription).toHaveBeenCalledWith("Nový popis");
        expect(props.resetForm).toHaveBeenCalled();
    });

    it("handles link changes and removing extra link", () => {
        const props = createProps({ linkItems: ["https://osu.cz", "https://portal.osu.cz"] });

        render(<TaskModal {...props} />);

        fireEvent.click(screen.getByRole("button", { name: /přidat odkaz/i }));
        fireEvent.change(screen.getByDisplayValue("https://portal.osu.cz"), {
            target: { value: "https://new.osu.cz" },
        });
        fireEvent.click(screen.getAllByRole("button", { name: "×" })[1]);

        expect(props.addLink).toHaveBeenCalledTimes(1);
        expect(props.updateLink).toHaveBeenCalledWith(1, "https://new.osu.cz");
        expect(props.removeLink).toHaveBeenCalledWith(1);
    });

    it("validates invalid expected end date before submit", () => {
        const props = createProps({
            expectedEndDate: "2035-01-01",
            dateInvalid: true,
        });

        render(<TaskModal {...props} />);

        fireEvent.click(screen.getByRole("button", { name: /^přidat$/i }));

        expect(props.handleSubmit).not.toHaveBeenCalled();
        expect(screen.getByText(/platné datum/i)).toBeInTheDocument();
    });

    it("removes selected file before upload", () => {
        const file = new File(["x"], "soubor.pdf", { type: "application/pdf" });
        const props = createProps({ selectedFiles: [file] });

        render(<TaskModal {...props} />);

        fireEvent.click(screen.getByRole("button", { name: "×" }));

        expect(props.removeFile).toHaveBeenCalledWith(0);
    });

    it("downloads and declines deleting existing attachment in edit mode", async () => {
        const createObjectURL = vi.fn(() => "blob:modal-file");
        const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);
        vi.stubGlobal("URL", { ...window.URL, createObjectURL });
        vi.mocked(downloadAttachment).mockResolvedValue({ data: new Blob(["x"]) } as any);

        const props = createProps({
            editingTask: {
                id: 20,
                title: "Task A",
                description: "Popis",
                files: [{ id: 7, title: "vystup.pdf" }],
            },
        });

        render(<TaskModal {...props} />);

        fireEvent.click(screen.getByTitle("Stáhnout"));
        fireEvent.click(screen.getByTitle("Smazat"));

        await waitFor(() => {
            expect(downloadAttachment).toHaveBeenCalledWith(7);
        });
        expect(createObjectURL).toHaveBeenCalled();
        expect(confirmSpy).toHaveBeenCalled();
        expect(deleteAttachment).not.toHaveBeenCalled();

        confirmSpy.mockRestore();
    });

    it("submits final evaluation in edit mode", () => {
        const props = createProps({
            editingTask: {
                id: 20,
                title: "Task A",
                description: "Popis",
                files: [],
            },
            finalEvaluation: "",
        });

        render(<TaskModal {...props} />);

        fireEvent.change(screen.getByPlaceholderText(/zadejte hodnocení/i), {
            target: { value: "Hotovo" },
        });
        fireEvent.click(screen.getByRole("button", { name: /uložit změny/i }));

        expect(props.setFinalEvaluation).toHaveBeenCalledWith("Hotovo");
        expect(props.handleSubmit).toHaveBeenCalledTimes(1);
    });
});
