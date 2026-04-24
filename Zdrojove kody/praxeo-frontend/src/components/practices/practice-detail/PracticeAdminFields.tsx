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
    onChangeFounderEmail: (value: string) => void;
    onChangeStudentEmail: (value: string) => void;
    onChangePracticeState: (value: PracticeState) => void;
}

const sectionSpacingStyle: React.CSSProperties = { marginBottom: 16 };

// Pole pro admina: přiřazení uživatelů a změna stavu praxe
const PracticeAdminFields: React.FC<Props> = ({
                                                  founderEmail,
                                                  studentEmail,
                                                  practiceState,
                                                  onChangeFounderEmail,
                                                  onChangeStudentEmail,
                                                  onChangePracticeState,
                                              }) => (
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
                <option value="NEW">Nový</option>
                <option value="ACTIVE">Aktivní</option>
                <option value="SUBMITTED">Odevzdaný</option>
                <option value="CANCELED">Zrušený</option>
                <option value="COMPLETED">Dokončený</option>
            </select>
        </div>
    </>
);

export default PracticeAdminFields;