import React from "react";
import { Pencil } from "lucide-react";
import { translatePracticeState } from "../../../utils/forms/types/practiceState";
import { formatDate } from "../../../utils/date";
import { practiceStateColors } from "../../../utils/forms/constants/practiceStateColors";
import Task from "../../tasks/Task";
import PrimaryButton from "../../common/PrimaryButton";
import SecondaryButton from "../../common/SecondaryButton";
import PracticeInfoRow from "./PracticeInfoRow";
import PracticeIconButton from "./PracticeIconButton";
import type { Practice } from "../../../utils/forms/types/practice";

interface Props {
    practice: Practice;
    role?: string;
    canEditFounder: boolean;
    canEditStudent: boolean;
    canEditFinalEvaluation: boolean;
    canChangeState: boolean;
    onSetEditMode: (value: boolean) => void;
    onAssignStudent: (assign: boolean) => void;
    onChangeStudentState: (state: "ACTIVE" | "SUBMITTED") => void;
    onChangeState: (state: "CANCELED" | "COMPLETED") => void;
}

// Read-only zobrazení detailu praxe, akcí a úkolů
const PracticeDetailReadView: React.FC<Props> = ({
                                                     practice,
                                                     role,
                                                     canEditFounder,
                                                     canEditStudent,
                                                     canEditFinalEvaluation,
                                                     canChangeState,
                                                     onSetEditMode,
                                                     onAssignStudent,
                                                     onChangeStudentState,
                                                     onChangeState,
                                                 }) => {
    const btnDanger: React.CSSProperties = {
        height: 40,
        background: "#fce4ec",
        color: "#c62828",
        border: "1px solid #f48fb1",
        borderRadius: 10,
        padding: "0 16px",
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
    };

    const btnBlue: React.CSSProperties = {
        height: 40,
        background: "#e3f2fd",
        color: "#1565c0",
        border: "1px solid #90caf9",
        borderRadius: 10,
        padding: "0 18px",
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
    };

    const stateBadge = practiceStateColors[practice.state];
    const hasStudentEvaluation = !!practice.studentEvaluation?.trim();
    const hasFinalEvaluation = !!practice.finalEvaluation?.trim();
    const canCompletePractice = hasFinalEvaluation && hasStudentEvaluation;

    const canEditPractice =
        canEditFounder ||
        canEditStudent ||
        canEditFinalEvaluation ||
        canChangeState;

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    marginBottom: 20,
                    alignItems: "flex-start",
                }}
            >
                {role === "STUDENT" && !practice.studentEmail && practice.state === "NEW" && (
                    <button style={btnBlue} onClick={() => onAssignStudent(true)}>
                        Přihlásit se k praxi
                    </button>
                )}

                {canEditStudent && practice.state === "ACTIVE" && (
                    <>
                        <SecondaryButton onClick={() => onAssignStudent(false)}>
                            Odhlásit se z praxe
                        </SecondaryButton>

                        <PrimaryButton
                            width="auto"
                            height={40}
                            disabled={!hasStudentEvaluation}
                            onClick={() => onChangeStudentState("SUBMITTED")}
                        >
                            Odevzdat praxi
                        </PrimaryButton>
                    </>
                )}

                {canEditStudent &&
                    practice.state === "SUBMITTED" &&
                    !hasFinalEvaluation && (
                        <SecondaryButton onClick={() => onChangeStudentState("ACTIVE")}>
                            Vrátit do aktivního stavu
                        </SecondaryButton>
                    )}
            </div>

            <div style={{ marginBottom: 16 }}>
                {canEditPractice && (
                    <div style={{ marginBottom: 12 }}>
                        <PracticeIconButton
                            onClick={() => onSetEditMode(true)}
                            title="Upravit praxi"
                            color="#e67e22"
                            size={22}
                        >
                            <Pencil size={18} strokeWidth={1.8} />
                        </PracticeIconButton>
                    </div>
                )}

                <PracticeInfoRow label="Název:">{practice.name}</PracticeInfoRow>
                <PracticeInfoRow label="Popis:">{practice.description}</PracticeInfoRow>
                <PracticeInfoRow label="Zakladatel:">
                    {practice.founderEmail ?? "—"}
                </PracticeInfoRow>
                <PracticeInfoRow label="Student:">
                    {practice.studentEmail ?? "—"}
                </PracticeInfoRow>
                <PracticeInfoRow label="Vytvořeno:">
                    {formatDate(practice.createdAt)}
                </PracticeInfoRow>
                <PracticeInfoRow label="Vybráno:">
                    {formatDate(practice.selectedAt)}
                </PracticeInfoRow>
                <PracticeInfoRow label="Datum dokončení:">
                    {formatDate(practice.completedAt)}
                </PracticeInfoRow>

                <PracticeInfoRow label="Stav:">
                    <span
                        style={{
                            background: stateBadge.bg,
                            color: stateBadge.color,
                            padding: "2px 10px",
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 600,
                        }}
                    >
                        {translatePracticeState(practice.state)}
                    </span>
                </PracticeInfoRow>

                <PracticeInfoRow label="Finální hodnocení:">
                    <>
                        {practice.finalEvaluation ?? "—"}
                        {canEditFinalEvaluation && (
                            <PracticeIconButton
                                onClick={() => onSetEditMode(true)}
                                title={
                                    hasFinalEvaluation
                                        ? "Upravit hodnocení"
                                        : "Přidat hodnocení"
                                }
                                color="#e67e22"
                                size={22}
                            >
                                <Pencil size={14} strokeWidth={1.8} />
                            </PracticeIconButton>
                        )}
                    </>
                </PracticeInfoRow>

                <PracticeInfoRow label="Hodnocení studenta:">
                    <>
                        {practice.studentEvaluation ?? "—"}
                        {canEditStudent && (
                            <PracticeIconButton
                                onClick={() => onSetEditMode(true)}
                                title={
                                    hasStudentEvaluation
                                        ? "Upravit hodnocení"
                                        : "Přidat hodnocení"
                                }
                                color="#e67e22"
                                size={22}
                            >
                                <Pencil size={14} strokeWidth={1.8} />
                            </PracticeIconButton>
                        )}
                    </>
                </PracticeInfoRow>
            </div>

            <div style={{ marginTop: 16 }}>
                <Task
                    practiceId={practice.id}
                    allowCreate={
                        (practice.state === "NEW" || practice.state === "ACTIVE") &&
                        (canEditFounder || canEditStudent)
                    }
                />
            </div>

            {canChangeState && (
                <div
                    style={{
                        display: "flex",
                        gap: 10,
                        flexWrap: "wrap",
                        marginTop: 24,
                        paddingTop: 20,
                        borderTop: "1px solid #f0f5f0",
                    }}
                >
                    <button style={btnDanger} onClick={() => onChangeState("CANCELED")}>
                        Zrušit praxi
                    </button>

                    {!(role === "ADMIN" && practice.state === "COMPLETED") && (
                        <PrimaryButton
                            width="auto"
                            height={40}
                            disabled={!canCompletePractice}
                            onClick={() => onChangeState("COMPLETED")}
                        >
                            Praxe dokončena
                        </PrimaryButton>
                    )}
                </div>
            )}
        </div>
    );
};

export default PracticeDetailReadView;