import React from "react";
import {
    inputStyle,
    labelStyle,
} from "../../../utils/forms/formStyles";
import {
    applyFocusStyle,
    clearFocusStyle,
} from "../../../utils/forms/formHelpers";
import type { PracticeState } from "../../../utils/forms/types/practice";

interface Props {
    founderEmail: string;
    studentEmail: string;
    practiceState: PracticeState;
    availableStates?: PracticeState[];
    stateHelpText?: string;
    onChangeFounderEmail: (value: string) => void;
    onChangeStudentEmail: (value: string) => void;
    onChangePracticeState: (value: PracticeState) => void;
}

const sectionSpacingStyle: React.CSSProperties = {
    marginBottom: 16,
};

const helperTextStyle: React.CSSProperties = {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 1.45,
    color: "#5f7a5f",
    fontWeight: 300,
};

const disabledOptionStyle: React.CSSProperties = {
    color: "#94a394",
};

// Pole pro admina: přiřazení uživatelů a změna stavu praxe
const PracticeAdminFields: React.FC<Props> = ({
                                                  founderEmail,
                                                  studentEmail,
                                                  practiceState,
                                                  availableStates,
                                                  stateHelpText,
                                                  onChangeFounderEmail,
                                                  onChangeStudentEmail,
                                                  onChangePracticeState,
                                              }) => {
    // Kompletní seznam stavů pro zobrazení v selectu
    const allStates: PracticeState[] = [
        "NEW",
        "ACTIVE",
        "SUBMITTED",
        "CANCELED",
        "COMPLETED",
    ];

    // Převod enum hodnot na české popisky
    const stateLabels: Record<PracticeState, string> = {
        NEW: "Nový",
        ACTIVE: "Aktivní",
        SUBMITTED: "Odevzdaný",
        CANCELED: "Zrušený",
        COMPLETED: "Dokončený",
    };

    return (
        <>
            <div style={sectionSpacingStyle}>
                <label style={labelStyle}>Zakladatel praxe</label>
                <input
                    style={inputStyle}
                    value={founderEmail}
                    onChange={(e) => onChangeFounderEmail(e.target.value)}
                    onFocus={(e) => applyFocusStyle(e.currentTarget)}
                    onBlur={(e) => clearFocusStyle(e.currentTarget)}
                />
            </div>

            <div style={sectionSpacingStyle}>
                <label style={labelStyle}>Student praxe</label>
                <input
                    style={inputStyle}
                    value={studentEmail}
                    onChange={(e) => onChangeStudentEmail(e.target.value)}
                    onFocus={(e) => applyFocusStyle(e.currentTarget)}
                    onBlur={(e) => clearFocusStyle(e.currentTarget)}
                />
            </div>

            <div style={sectionSpacingStyle}>
                <label style={labelStyle}>Stav praxe</label>
                <select
                    style={{ ...inputStyle, appearance: "none" }}
                    value={practiceState}
                    onChange={(e) => onChangePracticeState(e.target.value as PracticeState)}
                    onFocus={(e) => applyFocusStyle(e.currentTarget)}
                    onBlur={(e) => clearFocusStyle(e.currentTarget)}
                >
                    {allStates.map((state) => {
                        const isDisabled = availableStates
                            ? !availableStates.includes(state)
                            : false;

                        return (
                            <option
                                key={state}
                                value={state}
                                disabled={isDisabled}
                                style={isDisabled ? disabledOptionStyle : undefined}
                            >
                                {stateLabels[state]}
                            </option>
                        );
                    })}
                </select>

                {stateHelpText && (
                    <div style={helperTextStyle}>
                        {stateHelpText}
                    </div>
                )}
            </div>
        </>
    );
};

export default PracticeAdminFields;