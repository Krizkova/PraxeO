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

interface PracticeDetailViewProps {
    practice: Practice;
    loading: boolean;
    error: string | null;
    attachments: Attachment[];
    editMode: boolean;
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
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
}

// Detail praxe drží lokální stav formuláře, validaci a rozděluje zobrazení do sekcí
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
                                                               }) => {
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

    // Při změně praxe nebo režimu editace naplníme formulář aktuálními daty
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

    const completedAtValue = completedAt ? completedAt.substring(0, 10) : "";

    // Validace polí pro zakladatele praxe
    const nameInvalid = showErrors && canEditFounder && !name.trim();
    const descriptionInvalid = showErrors && canEditFounder && !description.trim();
    const dateMissing = showErrors && canEditFounder && !completedAtValue;

    const isDateOutOfRange =
        !!completedAtValue &&
        (completedAtValue < minDateValue || completedAtValue > maxDateValue);

    const dateOutOfRange = showErrors && canEditFounder && isDateOutOfRange;
    const dateInvalid = dateMissing || dateOutOfRange;

    const canSaveFounderFields =
        !!name.trim() &&
        !!description.trim() &&
        !!completedAtValue &&
        !isDateOutOfRange;

    const canSave = !canEditFounder || canSaveFounderFields;

    // Sestaví payload podle oprávnění uživatele
    const buildUpdatePayload = (): UpdatePracticePayload => {
        const payload: UpdatePracticePayload = {};

        if (canEditFounder) {
            payload.name = name;
            payload.description = description;
            payload.completedAt = completedAtValue || null;
        }

        if (canEditFinalEvaluation) {
            payload.finalEvaluation = finalEvaluation;
        }

        if (canEditStudent) {
            payload.studentEvaluation = studentEvaluation;
        }

        // Admin může měnit přiřazení uživatelů
        if (isAdmin) {
            payload.founderEmail = founderEmail;
            payload.studentEmail = studentEmail;
            payload.state = practiceState;
        }

        return payload;
    };

    // Uložení změn podle oprávnění uživatele
    const handleSave = () => {
        setShowErrors(true);

        if (!canSave) {
            return;
        }

        // Admin může měnit stav praxe přes samostatný endpoint
        if (isAdmin && practiceState !== practice.state) {
            onChangeState(practiceState);
        }

        onUpdate(buildUpdatePayload());
    };

    // Stav načítání detailu praxe
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

    // Chybový stav
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
            {/* Hlavní karta s detailem nebo editací */}
            <FormCard padding={28}>
                {editMode ? (
                    <PracticeDetailEditForm
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
                    />
                )}
            </FormCard>

            {/* Pravý panel s přílohami */}
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