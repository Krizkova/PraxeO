import React, { useEffect, useState } from "react";
import FormCard from "../../common/FormCard";
import ErrorAlert from "../../common/ErrorAlert";
import PracticeDetailEditForm from "./PracticeDetailEditForm";
import PracticeDetailReadView from "./PracticeDetailReadView";
import PracticeAttachmentsCard from "./PracticeAttachmentsCard";
import { getCookie } from "../../../utils/forms/cookies";
import { getPracticeDateLimits } from "../../../utils/date";
import type {
    Practice,
    Attachment,
    UpdatePracticePayload,
    PracticeState,
} from "../../../utils/forms/types/practice";
import type { EditMode } from "../../../pages/practices/PracticeDetailPage";

interface PracticeDetailViewProps {
    practice: Practice;
    loading: boolean;
    error: string | null;
    attachments: Attachment[];
    editMode: EditMode;
    setEditMode: React.Dispatch<React.SetStateAction<EditMode>>;
    canEditFounder: boolean;
    canEditStudent: boolean;
    canEditFinalEvaluation: boolean;
    canChangeState: boolean;
    canUpload: boolean;
    canDeleteAttachment: boolean;
    onUpdate: (data: UpdatePracticePayload) => void;
    onFileUpload: (file: File) => void;
    onDeleteAttachment: (id: number) => void;
    onDownloadAttachment: (id: number, title: string) => void;
    onChangeState: (state: PracticeState) => void;
    onAssignStudent: (assign: boolean) => void;
    onChangeStudentState: (state: "ACTIVE" | "SUBMITTED") => void;
    onExport: () => void;
    taskRefreshKey: number;
    founderResetKey: number;
}

// Prezentační vrstva detailu praxe.
// Přepíná mezi režimem čtení a editace, drží lokální stav formuláře
// a skládá payload pro uložení změn podle aktuální role a editMode.
const PracticeDetailView: React.FC<PracticeDetailViewProps> = ({
                                                                   practice,
                                                                   loading,
                                                                   error,
                                                                   attachments,
                                                                   editMode,
                                                                   setEditMode,
                                                                   canEditFounder,
                                                                   canEditStudent,
                                                                   canEditFinalEvaluation,
                                                                   canChangeState,
                                                                   canUpload,
                                                                   canDeleteAttachment,
                                                                   onUpdate,
                                                                   onFileUpload,
                                                                   onDeleteAttachment,
                                                                   onDownloadAttachment,
                                                                   onChangeState,
                                                                   onAssignStudent,
                                                                   onChangeStudentState,
                                                                   onExport,
                                                                   taskRefreshKey,
                                                                   founderResetKey,
                                                               }) => {
    // Lokální stav formuláře je oddělený od načteného detailu.
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [completedAt, setCompletedAt] = useState<string | null>(null);
    const [studentEvaluation, setStudentEvaluation] = useState("");
    const [finalEvaluation, setFinalEvaluation] = useState("");
    const [founderEmail, setFounderEmail] = useState("");
    const [studentEmail, setStudentEmail] = useState("");
    const [practiceState, setPracticeState] = useState<PracticeState>("NEW");
    const [showErrors, setShowErrors] = useState(false);

    const role: string | undefined = getCookie("userRole");
    const isAdmin = role === "ADMIN";

    const { minDateValue, maxDateValue } = getPracticeDateLimits();

    // Po načtení nové praxe nebo přepnutí editace se formulář znovu naplní aktuálními daty.
    useEffect(() => {
        setName(practice.name || "");
        setDescription(practice.description || "");
        setCompletedAt(practice.completedAt || null);
        setStudentEvaluation(practice.studentEvaluation || "");
        setFinalEvaluation(practice.finalEvaluation || "");
        setFounderEmail(practice.founderEmail || "");
        setStudentEmail(practice.studentEmail || "");
        setPracticeState(practice.state);
        setShowErrors(false);
    }, [practice, editMode]);

    // Po zavření chybového dialogu se founder email vrátí na potvrzenou hodnotu
    // a studentEmail se resetuje na původní hodnotu z praxe.
    useEffect(() => {
        setFounderEmail(practice.founderEmail || "");
        setStudentEmail(practice.studentEmail || "");
    }, [founderResetKey, practice.founderEmail, practice.studentEmail]);

    const completedAtValue = completedAt ? completedAt.substring(0, 10) : "";

    const isFounderMode = editMode === "founder";
    const nameInvalid = showErrors && isFounderMode && canEditFounder && !name.trim();
    const descriptionInvalid =
        showErrors && isFounderMode && canEditFounder && !description.trim();
    const dateMissing = showErrors && isFounderMode && canEditFounder && !completedAtValue;

    const isDateOutOfRange =
        !!completedAtValue &&
        (completedAtValue < minDateValue || completedAtValue > maxDateValue);

    const dateOutOfRange =
        showErrors && isFounderMode && canEditFounder && isDateOutOfRange;
    const dateInvalid = dateMissing || dateOutOfRange;

    const canSaveFounderFields =
        !!name.trim() &&
        !!description.trim() &&
        !!completedAtValue &&
        !isDateOutOfRange;

    const canSave = !isFounderMode || !canEditFounder || canSaveFounderFields;

    const hasStudent = !!studentEmail.trim();

    // Bez studenta lze nastavit pouze NEW nebo CANCELED.
    const allowedAdminStatesWithoutStudent: PracticeState[] = ["NEW", "CANCELED"];

    // Po přiřazení studenta už stav NEW není povolený.
    const allowedAdminStatesWithStudent: PracticeState[] = [
        "ACTIVE",
        "SUBMITTED",
        "COMPLETED",
        "CANCELED",
    ];

    const availableAdminStates = isAdmin
        ? hasStudent
            ? allowedAdminStatesWithStudent
            : allowedAdminStatesWithoutStudent
        : undefined;

    const adminStateHelpText = isAdmin
        ? hasStudent
            ? "Po přiřazení studenta už nelze změnit stav zpět na Nový."
            : "Bez přiřazeného studenta lze nastavit pouze stavy Nový a Zrušený."
        : undefined;

    // Po změně přiřazeného studenta opravíme případný neplatný stav.
    useEffect(() => {
        if (!isAdmin) {
            return;
        }

        if (hasStudent && practiceState === "NEW") {
            setPracticeState("ACTIVE");
        }

        if (!hasStudent && !["NEW", "CANCELED"].includes(practiceState)) {
            setPracticeState("NEW");
        }
    }, [isAdmin, hasStudent, practiceState]);

    // Sestaví payload pouze z těch polí,
    // která mají být v aktuálním režimu skutečně změněna.
    const buildUpdatePayload = (): UpdatePracticePayload => {
        const payload: UpdatePracticePayload = {};

        if (editMode === "founder" && canEditFounder) {
            payload.name = name;
            payload.description = description;
            payload.completedAt = completedAtValue || null;
        }

        if (editMode === "evaluation" && canEditFinalEvaluation) {
            payload.finalEvaluation = finalEvaluation;
        }

        if (editMode === "student" && canEditStudent) {
            payload.studentEvaluation = studentEvaluation;
        }

        if (isAdmin) {
            const normalizedFounderEmail = founderEmail.trim()
                ? founderEmail.trim()
                : null;
            const normalizedStudentEmail = studentEmail.trim()
                ? studentEmail.trim()
                : null;

            payload.founderEmail = normalizedFounderEmail;
            payload.studentEmail = normalizedStudentEmail;
            payload.finalEvaluation = finalEvaluation;
            payload.studentEvaluation = studentEvaluation;

            // Bez studenta lze uložit pouze NEW nebo CANCELED.
            // Se studentem naopak stav NEW není povolený.
            if (normalizedStudentEmail === null) {
                payload.state = ["NEW", "CANCELED"].includes(practiceState)
                    ? practiceState
                    : "NEW";
            } else {
                payload.state = ["ACTIVE", "SUBMITTED", "COMPLETED", "CANCELED"].includes(practiceState)
                    ? practiceState
                    : "ACTIVE";
            }
        }

        return payload;
    };

    const handleSave = () => {
        setShowErrors(true);

        if (!canSave) {
            return;
        }

        onUpdate(buildUpdatePayload());
    };

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
                <div
                    style={{
                        width: 26,
                        height: 26,
                        border: "2px solid #D6EDDF",
                        borderTopColor: "#2d7a2d",
                        borderRadius: "50%",
                    }}
                />
            </div>
        );
    }

    if (error) {
        return <ErrorAlert message={error} />;
    }

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) 300px",
                gap: 24,
                alignItems: "start",
                maxWidth: 1200,
            }}
        >
            <FormCard padding={28}>
                {editMode ? (
                    <PracticeDetailEditForm
                        editMode={editMode}
                        canEditFounder={canEditFounder}
                        canEditFinalEvaluation={canEditFinalEvaluation}
                        canEditStudent={canEditStudent}
                        isAdmin={isAdmin}
                        name={name}
                        description={description}
                        completedAtValue={completedAtValue}
                        finalEvaluation={finalEvaluation}
                        studentEvaluation={studentEvaluation}
                        founderEmail={founderEmail}
                        studentEmail={studentEmail}
                        practiceState={practiceState}
                        nameInvalid={nameInvalid}
                        descriptionInvalid={descriptionInvalid}
                        dateMissing={dateMissing}
                        dateOutOfRange={dateOutOfRange}
                        dateInvalid={dateInvalid}
                        minDateValue={minDateValue}
                        maxDateValue={maxDateValue}
                        availableStates={availableAdminStates}
                        stateHelpText={adminStateHelpText}
                        onChangeName={setName}
                        onChangeDescription={setDescription}
                        onChangeCompletedAt={setCompletedAt}
                        onChangeFinalEvaluation={setFinalEvaluation}
                        onChangeStudentEvaluation={setStudentEvaluation}
                        onChangeFounderEmail={setFounderEmail}
                        onChangeStudentEmail={setStudentEmail}
                        onChangePracticeState={setPracticeState}
                        onSave={handleSave}
                        onCancel={() => setEditMode(false)}
                    />
                ) : (
                    <PracticeDetailReadView
                        practice={practice}
                        role={role}
                        canEditFounder={canEditFounder}
                        canEditStudent={canEditStudent}
                        canEditFinalEvaluation={canEditFinalEvaluation}
                        canChangeState={canChangeState}
                        onSetEditMode={setEditMode}
                        onAssignStudent={onAssignStudent}
                        onChangeStudentState={onChangeStudentState}
                        onChangeState={onChangeState}
                        onExport={onExport}
                        taskRefreshKey={taskRefreshKey}
                    />
                )}
            </FormCard>

            <PracticeAttachmentsCard
                attachments={attachments}
                canUpload={canUpload}
                canDeleteAttachment={canDeleteAttachment}
                isClosed={practice.closed}
                onFileUpload={onFileUpload}
                onDeleteAttachment={onDeleteAttachment}
                onDownloadAttachment={onDownloadAttachment}
            />
        </div>
    );
};

export default PracticeDetailView;