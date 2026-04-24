import React from "react";
import { Save, X } from "lucide-react";
import PrimaryButton from "../../common/PrimaryButton";
import PracticeAdminFields from "./PracticeAdminFields";
import SecondaryButton from "../../common/SecondaryButton";
import {
    inputStyle,
    textareaStyle,
    labelStyle,
} from "../../../utils/forms/formStyles";
import {
    getFieldStyle,
    applyFocusStyle,
    clearFocusStyle,
} from "../../../utils/forms/formHelpers";
import type { PracticeState } from "../../../utils/forms/types/practice";

interface Props {
    canEditFounder: boolean;
    canEditFinalEvaluation: boolean;
    canEditStudent: boolean;
    isAdmin: boolean;
    name: string;
    description: string;
    completedAtValue: string;
    finalEvaluation: string;
    studentEvaluation: string;
    founderEmail: string;
    studentEmail: string;
    practiceState: PracticeState;
    nameInvalid: boolean;
    descriptionInvalid: boolean;
    dateMissing: boolean;
    dateOutOfRange: boolean;
    dateInvalid: boolean;
    minDateValue: string;
    maxDateValue: string;
    onChangeName: (value: string) => void;
    onChangeDescription: (value: string) => void;
    onChangeCompletedAt: (value: string) => void;
    onChangeFinalEvaluation: (value: string) => void;
    onChangeStudentEvaluation: (value: string) => void;
    onChangeFounderEmail: (value: string) => void;
    onChangeStudentEmail: (value: string) => void;
    onChangePracticeState: (value: PracticeState) => void;
    onSave: () => void;
    onCancel: () => void;
}

const errorTextStyle: React.CSSProperties = {
    marginTop: 6,
    fontSize: 12,
    color: "#d85a5a",
    fontWeight: 300,
};

const actionContentStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
};

const sectionSpacingStyle: React.CSSProperties = {
    marginBottom: 16,
};

// Editační formulář detailu praxe
const PracticeDetailEditForm: React.FC<Props> = ({
                                                     canEditFounder,
                                                     canEditFinalEvaluation,
                                                     canEditStudent,
                                                     isAdmin,
                                                     name,
                                                     description,
                                                     completedAtValue,
                                                     finalEvaluation,
                                                     studentEvaluation,
                                                     founderEmail,
                                                     studentEmail,
                                                     practiceState,
                                                     nameInvalid,
                                                     descriptionInvalid,
                                                     dateMissing,
                                                     dateOutOfRange,
                                                     dateInvalid,
                                                     minDateValue,
                                                     maxDateValue,
                                                     onChangeName,
                                                     onChangeDescription,
                                                     onChangeCompletedAt,
                                                     onChangeFinalEvaluation,
                                                     onChangeStudentEvaluation,
                                                     onChangeFounderEmail,
                                                     onChangeStudentEmail,
                                                     onChangePracticeState,
                                                     onSave,
                                                     onCancel,
                                                 }) => {
    const showFounderSection = canEditFounder;
    const showFinalEvaluationSection = canEditFinalEvaluation;
    const showStudentEvaluationSection = canEditStudent;

    return (
        <div>
            {/* Editace údajů zakladatele */}
            {showFounderSection && (
                <>
                    <div style={sectionSpacingStyle}>
                        <label style={labelStyle}>
                            Název <span style={{ color: "#e24b4a" }}>*</span>
                        </label>

                        <input
                            style={getFieldStyle(inputStyle, nameInvalid)}
                            value={name}
                            onChange={(e) => onChangeName(e.target.value)}
                            onFocus={(e) => applyFocusStyle(e.currentTarget)}
                            onBlur={(e) =>
                                clearFocusStyle(e.currentTarget, nameInvalid)
                            }
                        />

                        {nameInvalid && (
                            <div style={errorTextStyle}>Povinné pole.</div>
                        )}
                    </div>

                    <div style={sectionSpacingStyle}>
                        <label style={labelStyle}>
                            Popis <span style={{ color: "#e24b4a" }}>*</span>
                        </label>

                        <textarea
                            style={getFieldStyle(textareaStyle, descriptionInvalid)}
                            rows={4}
                            value={description}
                            onChange={(e) => onChangeDescription(e.target.value)}
                            onFocus={(e) => applyFocusStyle(e.currentTarget)}
                            onBlur={(e) =>
                                clearFocusStyle(e.currentTarget, descriptionInvalid)
                            }
                        />

                        {descriptionInvalid && (
                            <div style={errorTextStyle}>Povinné pole.</div>
                        )}
                    </div>

                    <div style={sectionSpacingStyle}>
                        <label style={labelStyle}>
                            Datum dokončení <span style={{ color: "#e24b4a" }}>*</span>
                        </label>

                        <input
                            type="date"
                            style={getFieldStyle(inputStyle, dateInvalid)}
                            value={completedAtValue}
                            onChange={(e) => onChangeCompletedAt(e.target.value)}
                            onFocus={(e) => applyFocusStyle(e.currentTarget)}
                            onBlur={(e) =>
                                clearFocusStyle(e.currentTarget, dateInvalid)
                            }
                            min={minDateValue}
                            max={maxDateValue}
                        />

                        {dateMissing && (
                            <div style={errorTextStyle}>Povinné pole.</div>
                        )}

                        {dateOutOfRange && (
                            <div style={errorTextStyle}>Neplatné datum.</div>
                        )}
                    </div>
                </>
            )}

            {/* Editace finálního hodnocení */}
            {showFinalEvaluationSection && (
                <div style={sectionSpacingStyle}>
                    <label style={labelStyle}>Finální hodnocení</label>

                    <textarea
                        style={getFieldStyle(textareaStyle, false, {
                            minHeight: 110,
                        })}
                        rows={5}
                        value={finalEvaluation}
                        onChange={(e) => onChangeFinalEvaluation(e.target.value)}
                        onFocus={(e) => applyFocusStyle(e.currentTarget)}
                        onBlur={(e) => clearFocusStyle(e.currentTarget)}
                    />
                </div>
            )}

            {/* Editace studentského hodnocení */}
            {showStudentEvaluationSection && (
                <div style={sectionSpacingStyle}>
                    <label style={labelStyle}>Hodnocení studenta</label>

                    <textarea
                        style={textareaStyle}
                        rows={4}
                        value={studentEvaluation}
                        onChange={(e) => onChangeStudentEvaluation(e.target.value)}
                        onFocus={(e) => applyFocusStyle(e.currentTarget)}
                        onBlur={(e) => clearFocusStyle(e.currentTarget)}
                    />
                </div>
            )}

            {/* Editace přiřazení a stavu praxe pro admina */}
            {isAdmin && (
                <PracticeAdminFields
                    founderEmail={founderEmail}
                    studentEmail={studentEmail}
                    practiceState={practiceState}
                    onChangeFounderEmail={onChangeFounderEmail}
                    onChangeStudentEmail={onChangeStudentEmail}
                    onChangePracticeState={onChangePracticeState}
                />
            )}

            {/* Akce formuláře */}
            <div
                style={{
                    borderTop: "1px solid #e8f5e9",
                    paddingTop: 18,
                    display: "flex",
                    gap: 10,
                }}
            >
                <PrimaryButton onClick={onSave} width="auto" height={40}>
                    <span style={actionContentStyle}>
                        <Save size={14} />
                        Uložit
                    </span>
                </PrimaryButton>

                <SecondaryButton onClick={onCancel}>
                    <span style={actionContentStyle}>
                        <X size={14} />
                        Zrušit
                    </span>
                </SecondaryButton>
            </div>
        </div>
    );
};

export default PracticeDetailEditForm;