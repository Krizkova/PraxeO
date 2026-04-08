import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import PracticeDetailView from "./PracticeDetailView";

const taskMock = vi.fn(() => <div data-testid="task-component">Task</div>);

vi.mock("../tasks/Task", () => ({
    default: (props: { practiceId: number; allowCreate: boolean }) => taskMock(props),
}));

const basePractice = {
    id: 77,
    name: "Praxe A",
    description: "Detail popisu",
    founderEmail: "teacher@osu.cz",
    studentEmail: "student@osu.cz",
    createdAt: "2026-01-10",
    selectedAt: "2026-01-12",
    completedAt: "2026-06-01",
    state: "ACTIVE",
    finalEvaluation: "",
    studentEvaluation: "Pracuji",
    closed: false,
};

const createProps = (overrides: Partial<any> = {}) => ({
    practice: basePractice,
    loading: false,
    error: null,
    attachments: [],
    editMode: false,
    setEditMode: vi.fn(),
    canEdit: true,
    canEditFounder: true,
    canEditStudent: false,
    canEditFinalEvaluation: false,
    canChangeState: true,
    canUpload: false,
    onUpdate: vi.fn(),
    onFileUpload: vi.fn(),
    onDeleteAttachment: vi.fn(),
    onDownloadAttachment: vi.fn(),
    onChangeState: vi.fn(),
    onAssignStudent: vi.fn(),
    onChangeStudentState: vi.fn(),
    ...overrides,
});

const setUserRole = (role: string) => {
    document.cookie = "userRole=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = `userRole=${role}; path=/`;
};

describe("PracticeDetailView", () => {
    beforeEach(() => {
        taskMock.mockClear();
    });

    it("renders practice detail, allows opening edit mode and passes task props", () => {
        setUserRole("TEACHER");
        const props = createProps();

        render(<PracticeDetailView {...props} />);

        expect(screen.getByText(/Praxe A/i)).toBeInTheDocument();
        expect(screen.getByText(/Detail popisu/i)).toBeInTheDocument();

        fireEvent.click(screen.getByTitle(/upravit praxi/i));
        expect(props.setEditMode).toHaveBeenCalledWith(true);

        expect(screen.getByTestId("task-component")).toBeInTheDocument();
        expect(taskMock).toHaveBeenCalledWith({
            practiceId: 77,
            allowCreate: true,
        });
    });

    it("disables complete button without final evaluation and can cancel practice", () => {
        setUserRole("TEACHER");
        const props = createProps();

        render(<PracticeDetailView {...props} />);

        const completeBtn = screen.getByRole("button", { name: /praxe dokon/i });
        expect(completeBtn).toBeDisabled();

        fireEvent.click(screen.getByRole("button", { name: /zrušit praxi/i }));
        expect(props.onChangeState).toHaveBeenCalledWith("CANCELED");
    });

    it("allows student to assign to a NEW practice", () => {
        setUserRole("STUDENT");
        const props = createProps({
            canEdit: false,
            canChangeState: false,
            practice: {
                ...basePractice,
                state: "NEW",
                studentEmail: null,
            },
        });

        render(<PracticeDetailView {...props} />);

        fireEvent.click(screen.getByRole("button", { name: /praxi/i }));
        expect(props.onAssignStudent).toHaveBeenCalledWith(true);
    });

    it("shows student active actions and calls unassign", () => {
        setUserRole("STUDENT");
        const props = createProps({
            canEdit: false,
            canChangeState: false,
            canEditStudent: true,
            practice: {
                ...basePractice,
                state: "ACTIVE",
                studentEvaluation: "",
            },
        });

        render(<PracticeDetailView {...props} />);

        fireEvent.click(screen.getByRole("button", { name: /odhl/i }));
        expect(props.onAssignStudent).toHaveBeenCalledWith(false);

        expect(screen.getByRole("button", { name: /odevzd/i })).toBeDisabled();
    });

    it("allows student to return SUBMITTED practice back to ACTIVE", () => {
        setUserRole("STUDENT");
        const props = createProps({
            canEdit: false,
            canChangeState: false,
            practice: {
                ...basePractice,
                state: "SUBMITTED",
            },
        });

        render(<PracticeDetailView {...props} />);

        fireEvent.click(screen.getByRole("button", { name: /aktivn/i }));
        expect(props.onChangeStudentState).toHaveBeenCalledWith("ACTIVE");
    });

    it("submits full admin payload in edit mode", () => {
        setUserRole("ADMIN");
        const props = createProps({
            editMode: true,
            canEditFounder: false,
            canEditStudent: false,
            canEditFinalEvaluation: false,
            practice: {
                ...basePractice,
                finalEvaluation: "Stará final",
                studentEvaluation: "Stará student",
            },
        });

        const { container } = render(<PracticeDetailView {...props} />);

        fireEvent.change(screen.getByDisplayValue("Praxe A"), {
            target: { value: "Praxe B" },
        });
        fireEvent.change(screen.getByDisplayValue("Detail popisu"), {
            target: { value: "Nový popis" },
        });

        const dateInput = container.querySelector('input[type="date"]') as HTMLInputElement;
        fireEvent.change(dateInput, { target: { value: "2026-07-01" } });

        fireEvent.change(screen.getByDisplayValue("Stará final"), {
            target: { value: "Final A" },
        });
        fireEvent.change(screen.getByDisplayValue("Stará student"), {
            target: { value: "Student A" },
        });
        fireEvent.change(screen.getByDisplayValue("teacher@osu.cz"), {
            target: { value: "newteacher@osu.cz" },
        });
        fireEvent.change(screen.getByDisplayValue("student@osu.cz"), {
            target: { value: "newstudent@osu.cz" },
        });

        const stateSelect = container.querySelector("select") as HTMLSelectElement;
        fireEvent.change(stateSelect, { target: { value: "COMPLETED" } });

        fireEvent.click(screen.getByRole("button", { name: /ulo/i }));

        expect(props.onUpdate).toHaveBeenCalledWith({
            name: "Praxe B",
            description: "Nový popis",
            completedAt: "2026-07-01",
            finalEvaluation: "Final A",
            studentEvaluation: "Student A",
            founderEmail: "newteacher@osu.cz",
            studentEmail: "newstudent@osu.cz",
            state: "COMPLETED",
        });
    });

});
