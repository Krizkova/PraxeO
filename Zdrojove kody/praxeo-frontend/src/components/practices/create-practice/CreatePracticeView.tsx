import React from "react";
import { FilePlus, CalendarDays, FileText } from "lucide-react";
import FormCard from "../../common/FormCard";
import PrimaryButton from "../../common/PrimaryButton";
import ErrorAlert from "../../common/ErrorAlert";
import {
    inputStyle,
    textareaStyle,
    labelStyle,
    iconBoxStyle,
    errorTextStyle,
} from "../../../utils/forms/formStyles";
import {
    getFieldStyle,
    applyFocusStyle,
    clearFocusStyle,
} from "../../../utils/forms/formHelpers";

interface CreatePracticeViewProps {
    name: string;
    description: string;
    completedAt: string;
    loading: boolean;
    error: string | null;
    onChangeName: (value: string) => void;
    onChangeDescription: (value: string) => void;
    onChangeDate: (value: string) => void;
    onSubmit: () => void;
}

const CreatePracticeView: React.FC<CreatePracticeViewProps> = ({
                                                                   name,
                                                                   description,
                                                                   completedAt,
                                                                   loading,
                                                                   error,
                                                                   onChangeName,
                                                                   onChangeDescription,
                                                                   onChangeDate,
                                                                   onSubmit,
                                                               }) => {
    const [showErrors, setShowErrors] = React.useState(false);

    const errorMessageStyle: React.CSSProperties = {
        ...errorTextStyle,
        marginTop: 0,
    };

    const today = new Date();

    const minDate = new Date(today);
    minDate.setDate(today.getDate() - 1);

    const maxDate = new Date(today);
    maxDate.setFullYear(today.getFullYear() + 5);

    const toDateInputValue = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const minDateValue = toDateInputValue(minDate);
    const maxDateValue = toDateInputValue(maxDate);

    // Povinná pole zvýrazníme až po kliknutí na uložit
    const nameInvalid = showErrors && !name.trim();
    const descriptionInvalid = showErrors && !description.trim();
    const dateMissing = showErrors && !completedAt.trim();

    const hasDateValue = !!completedAt.trim();
    const isDateOutOfRange =
        hasDateValue &&
        (completedAt < minDateValue || completedAt > maxDateValue);

    const dateOutOfRange = showErrors && isDateOutOfRange;

    const isInvalid =
        !name.trim() ||
        !description.trim() ||
        !completedAt.trim() ||
        isDateOutOfRange;

    const handleSubmitClick = () => {
        setShowErrors(true);

        if (loading || isInvalid) {
            return;
        }

        onSubmit();
    };

    return (
        <FormCard maxWidth={620}>
            <div
                style={{
                    marginBottom: 24,
                    paddingBottom: 18,
                    borderBottom: "1px solid #e8f5e9",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={iconBoxStyle}>
                        <FilePlus size={14} color="#1F8A4D" strokeWidth={2.2} />
                    </div>

                    <h2
                        style={{
                            fontSize: 20,
                            fontWeight: 700,
                            color: "#1a3d1a",
                            margin: 0,
                        }}
                    >
                        Vytvořit praxi
                    </h2>
                </div>
            </div>

            {error && <ErrorAlert message={error} marginBottom={16} />}

            <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>
                    Název praxe <span style={{ color: "#e24b4a" }}>*</span>
                </label>

                <div style={{ position: "relative" }}>
                    <input
                        style={getFieldStyle(inputStyle, nameInvalid, {
                            paddingLeft: 40,
                        })}
                        value={name}
                        onChange={(e) => onChangeName(e.target.value)}
                        onFocus={(e) => applyFocusStyle(e.currentTarget)}
                        onBlur={(e) => clearFocusStyle(e.currentTarget, nameInvalid)}
                    />

                    <div
                        style={{
                            position: "absolute",
                            left: 12,
                            top: 12,
                            color: "#7FA487",
                        }}
                    >
                        <FileText size={16} />
                    </div>
                </div>

                {nameInvalid && <div style={errorMessageStyle}>Povinné pole.</div>}
            </div>

            <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>
                    Popis <span style={{ color: "#e24b4a" }}>*</span>
                </label>

                <textarea
                    style={getFieldStyle(textareaStyle, descriptionInvalid)}
                    placeholder="Krátký popis zaměření praxe..."
                    value={description}
                    onChange={(e) => onChangeDescription(e.target.value)}
                    onFocus={(e) => applyFocusStyle(e.currentTarget)}
                    onBlur={(e) =>
                        clearFocusStyle(e.currentTarget, descriptionInvalid)
                    }
                />

                {descriptionInvalid && (
                    <div style={errorMessageStyle}>Povinné pole.</div>
                )}
            </div>

            <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>
                    Datum dokončení <span style={{ color: "#e24b4a" }}>*</span>
                </label>

                <div style={{ position: "relative" }}>
                    <input
                        type="date"
                        style={getFieldStyle(inputStyle, dateMissing || dateOutOfRange, {
                            paddingLeft: 40,
                        })}
                        value={completedAt}
                        onChange={(e) => onChangeDate(e.target.value)}
                        onFocus={(e) => applyFocusStyle(e.currentTarget)}
                        onBlur={(e) =>
                            clearFocusStyle(
                                e.currentTarget,
                                dateMissing || dateOutOfRange
                            )
                        }
                        min={minDateValue}
                        max={maxDateValue}
                    />

                    <div
                        style={{
                            position: "absolute",
                            left: 12,
                            top: 12,
                            color: "#7FA487",
                        }}
                    >
                        <CalendarDays size={16} />
                    </div>
                </div>

                {dateMissing && <div style={errorMessageStyle}>Povinné pole.</div>}
                {dateOutOfRange && (
                    <div style={errorMessageStyle}>Neplatné datum.</div>
                )}
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    marginTop: 8,
                    flexWrap: "wrap",
                }}
            >
                <span
                    style={{
                        fontSize: 12,
                        color: "#c62828",
                        fontWeight: 500,
                    }}
                >
                    {showErrors && isInvalid ? "Vyplňte povinná pole označená *" : ""}
                </span>

                <PrimaryButton
                    type="button"
                    onClick={handleSubmitClick}
                    disabled={loading}
                >
                    {loading ? "Vytvářím..." : "Vytvořit praxi"}
                </PrimaryButton>
            </div>
        </FormCard>
    );
};

export default CreatePracticeView;