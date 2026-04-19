import React from "react";
import { FilePlus, CircleAlert, CalendarDays, FileText } from "lucide-react";

interface Props {
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

const CreatePracticeView: React.FC<Props> = ({
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
    const inputStyle: React.CSSProperties = {
        width: "100%",
        minHeight: 48,
        background: "white",
        border: "1.5px solid #d0e8d0",
        borderRadius: 12,
        padding: "0 14px",
        fontSize: 14,
        color: "#1a3d1a",
        outline: "none",
        boxSizing: "border-box",
        transition: "all 0.15s",
        fontFamily: "inherit",
    };

    const textareaStyle: React.CSSProperties = {
        ...inputStyle,
        minHeight: 120,
        padding: "12px 14px",
        resize: "vertical",
    };

    const labelStyle: React.CSSProperties = {
        fontSize: 12,
        fontWeight: 600,
        color: "#3a5a3a",
        display: "block",
        marginBottom: 6,
    };

    const iconBoxStyle: React.CSSProperties = {
        width: 24,
        height: 24,
        background: "#D6EDDF",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    };

    const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.target.style.border = "1.5px solid #2d7a2d";
        e.target.style.boxShadow = "0 0 0 3px rgba(45,122,45,0.1)";
        e.target.style.background = "#fcfffc";
    };

    const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.target.style.border = "1.5px solid #d0e8d0";
        e.target.style.boxShadow = "none";
        e.target.style.background = "white";
    };

    // Povolený rozsah data: od včerejška do 5 let dopředu
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

    // Tlačítko je neaktivní, pokud formulář není správně vyplněn
    const isDisabled =
        loading ||
        !name.trim() ||
        !description.trim() ||
        !completedAt.trim() ||
        completedAt < minDateValue ||
        completedAt > maxDateValue;

    return (
        <div style={{
            width: "100%",
            maxWidth: 620,
            background: "white",
            borderRadius: 18,
            border: "1px solid #e0ede0",
            padding: 32,
            boxShadow: "0 4px 24px rgba(34,85,34,0.08)",
        }}>
            {/* Záhlaví karty: bez podtitulku */}
            <div style={{ marginBottom: 24, paddingBottom: 18, borderBottom: "1px solid #e8f5e9" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={iconBoxStyle}>
                        <FilePlus size={14} color="#1F8A4D" strokeWidth={2.2} />
                    </div>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a3d1a", margin: 0 }}>
                        Vytvořit praxi
                    </h2>
                </div>
            </div>

            {/* Chybová zpráva */}
            {error && (
                <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    background: "#FFF4F4",
                    border: "1px solid #F1C7C7",
                    borderRadius: 10,
                    padding: "10px 14px",
                    fontSize: 13,
                    color: "#C75B5B",
                    marginBottom: 16,
                }}>
                    <CircleAlert size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>{error}</span>
                </div>
            )}

            {/* Název praxe */}
            <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>
                    Název praxe <span style={{ color: "#e24b4a" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                    <input
                        style={{ ...inputStyle, paddingLeft: 40 }}
                        placeholder="Např. Letní odborná praxe"
                        value={name}
                        onChange={e => onChangeName(e.target.value)}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        required
                    />
                    <div style={{ position: "absolute", left: 12, top: 12, color: "#7FA487" }}>
                        <FileText size={16} />
                    </div>
                </div>
            </div>

            {/* Popis praxe */}
            <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>
                    Popis <span style={{ color: "#e24b4a" }}>*</span>
                </label>
                <textarea
                    style={textareaStyle}
                    placeholder="Krátký popis zaměření praxe..."
                    value={description}
                    onChange={e => onChangeDescription(e.target.value)}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    required
                />
            </div>

            {/* Datum dokončení s validací rozsahu */}
            <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>
                    Datum dokončení <span style={{ color: "#e24b4a" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                    <input
                        type="date"
                        style={{ ...inputStyle, paddingLeft: 40 }}
                        value={completedAt}
                        onChange={e => onChangeDate(e.target.value)}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        min={minDateValue}
                        max={maxDateValue}
                        required
                    />
                    <div style={{ position: "absolute", left: 12, top: 12, color: "#7FA487" }}>
                        <CalendarDays size={16} />
                    </div>
                </div>
                <p style={{ fontSize: 11, color: "#7FA487", margin: "6px 0 0" }}>
                    Datum lze vybrat od včerejška do 5 let dopředu.
                </p>
            </div>

            {/* Tlačítko pro odeslání formuláře */}
            <button
                type="button"
                onClick={onSubmit}
                disabled={isDisabled}
                style={{
                    width: "100%",
                    height: 48,
                    background: isDisabled
                        ? "#c8dfc8"
                        : "linear-gradient(135deg, #2d7a2d, #4caf50)",
                    color: "white",
                    border: "none",
                    borderRadius: 12,
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    boxShadow: isDisabled ? "none" : "0 4px 14px rgba(45,122,45,0.3)",
                    transition: "opacity 0.2s",
                }}
                onMouseEnter={e => { if (!isDisabled) e.currentTarget.style.opacity = "0.9"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
            >
                {loading ? "Vytvářím..." : "Vytvořit praxi"}
            </button>
        </div>
    );
};

export default CreatePracticeView;