import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import PracticeDetail from "./PracticeDetail";
import {
    changePracticeState,
    deleteAttachment,
    downloadAttachment,
    getAttachmentsForPractice,
    getPractice,
    updatePractice,
    uploadAttachment,
} from "../../api/practicesApi";

type PracticeDetailViewProps = {
    practice: any;
    loading: boolean;
    error: string | null;
    attachments: any[];
    editMode: boolean;
    setEditMode: (value: boolean) => void;
    canEdit: boolean;
    canEditFounder: boolean;
    canEditStudent: boolean;
    canEditFinalEvaluation: boolean;
    canChangeState: boolean;
    canUpload: boolean;
    onUpdate: (data: any) => void;
    onFileUpload: (file: File) => void;
    onDeleteAttachment: (id: number) => void;
    onDownloadAttachment: (id: number, title: string) => void;
    onChangeState: (state: "CANCELED" | "COMPLETED") => void;
};

const { mockSetEditMode, getLatestProps, setLatestProps } = vi.hoisted(() => {
    let latestProps: PracticeDetailViewProps | undefined;

    return {
        mockSetEditMode: vi.fn(),
        getLatestProps: () => latestProps,
        setLatestProps: (props: PracticeDetailViewProps) => {
            latestProps = props;
        },
    };
});

const latestProps = () => {
    const props = getLatestProps();
    if (!props) throw new Error("PracticeDetailView props are not available");
    return props;
};

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
    return {
        ...actual,
        useParams: () => ({ id: "55" }),
    };
});

vi.mock("./PracticeDetailView", () => ({
    default: (props: PracticeDetailViewProps) => {
        setLatestProps(props);
        return <div data-testid="practice-detail-view" />;
    },
}));

vi.mock("../../api/practicesApi", () => ({
    getPractice: vi.fn(),
    getAttachmentsForPractice: vi.fn(),
    uploadAttachment: vi.fn(),
    deleteAttachment: vi.fn(),
    downloadAttachment: vi.fn(),
    updatePractice: vi.fn(),
    changePracticeState: vi.fn(),
}));

describe("PracticeDetail", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        setLatestProps(undefined as any);
    });

    it("loads practice and attachments then handles update/state/file actions", async () => {
        vi.mocked(getPractice).mockResolvedValue({
            id: 55,
            name: "Praxe",
            closed: false,
            canEditFounderFields: true,
            canEditStudentFields: false,
            canEditFinalEvaluation: false,
            canChangeState: true,
            canUploadAttachments: true,
        });
        vi.mocked(getAttachmentsForPractice).mockResolvedValue([{ id: 1, title: "a.pdf" }]);
        vi.mocked(updatePractice).mockResolvedValue({
            id: 55,
            name: "Praxe updated",
            closed: false,
            canEditFounderFields: true,
            canEditStudentFields: false,
            canEditFinalEvaluation: false,
            canChangeState: true,
            canUploadAttachments: true,
        });
        vi.mocked(uploadAttachment).mockResolvedValue({ id: 2, title: "b.pdf" });
        vi.mocked(deleteAttachment).mockResolvedValue({});
        vi.mocked(changePracticeState).mockResolvedValue({
            id: 55,
            name: "Praxe updated",
            closed: true,
            canEditFounderFields: true,
            canEditStudentFields: false,
            canEditFinalEvaluation: false,
            canChangeState: false,
            canUploadAttachments: false,
        });
        vi.mocked(downloadAttachment).mockResolvedValue({ data: new Blob(["x"]) } as any);

        const createObjectURLSpy = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:url");
        const appendSpy = vi.spyOn(document.body, "appendChild");
        const removeSpy = vi.spyOn(HTMLAnchorElement.prototype, "remove");
        const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);

        render(
            <MemoryRouter>
                <PracticeDetail editMode={false} setEditMode={mockSetEditMode} />
            </MemoryRouter>
        );

        await screen.findByTestId("practice-detail-view");

        expect(latestProps().practice.id).toBe(55);
        expect(latestProps().attachments).toHaveLength(1);

        await act(async () => {
            latestProps().onUpdate({ name: "Praxe updated" });
            await Promise.resolve();
        });
        expect(updatePractice).toHaveBeenCalledWith(55, { name: "Praxe updated" });

        const file = new File(["content"], "test.txt", { type: "text/plain" });
        await act(async () => {
            latestProps().onFileUpload(file);
            await Promise.resolve();
        });
        expect(uploadAttachment).toHaveBeenCalledWith(55, file);

        await act(async () => {
            latestProps().onDeleteAttachment(1);
            await Promise.resolve();
        });
        expect(deleteAttachment).toHaveBeenCalledWith(1);

        await act(async () => {
            latestProps().onDownloadAttachment(2, "b.pdf");
            await Promise.resolve();
        });
        expect(downloadAttachment).toHaveBeenCalledWith(2);
        expect(createObjectURLSpy).toHaveBeenCalled();
        expect(appendSpy).toHaveBeenCalled();
        expect(clickSpy).toHaveBeenCalled();
        expect(removeSpy).toHaveBeenCalled();

        await act(async () => {
            latestProps().onChangeState("COMPLETED");
            await Promise.resolve();
        });
        expect(changePracticeState).toHaveBeenCalledWith(55, "COMPLETED");
        expect(mockSetEditMode).toHaveBeenCalledWith(false);

        createObjectURLSpy.mockRestore();
        appendSpy.mockRestore();
        removeSpy.mockRestore();
        clickSpy.mockRestore();
    });

    it("passes error to view when attachments loading fails", async () => {
        vi.mocked(getPractice).mockResolvedValue({
            id: 55,
            name: "Praxe",
            closed: false,
            canEditFounderFields: true,
            canEditStudentFields: false,
            canEditFinalEvaluation: false,
            canChangeState: true,
            canUploadAttachments: true,
        });
        vi.mocked(getAttachmentsForPractice).mockRejectedValue(new Error("fail"));

        render(
            <MemoryRouter>
                <PracticeDetail editMode={false} setEditMode={mockSetEditMode} />
            </MemoryRouter>
        );

        await screen.findByTestId("practice-detail-view");

        expect(latestProps().error).toContain("Nepodařilo se načíst detail praxe");
    });
});
