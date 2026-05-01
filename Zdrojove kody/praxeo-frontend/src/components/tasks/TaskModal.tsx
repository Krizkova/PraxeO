import React, { useEffect, useState } from "react";
import { CheckSquare, X } from "lucide-react";
import {
    inputStyle,
    textareaStyle,
    labelStyle,
    iconBoxStyle,
    errorTextStyle,
} from "../../utils/forms/formStyles";
import {
    getFieldStyle,
    applyFocusStyle,
    clearFocusStyle,
} from "../../utils/forms/formHelpers";
import type { Task } from "../../api/tasksApi";
import TaskModalFileList from "./TaskModalFileList";

interface Props {
    show: boolean;
    editingTask: Task | null;
    title: string;
    description: string;
    linkItems: string[];
    selectedFiles: File[];
    expectedEndDate: string;
    reportFlag: boolean;
    finalEvaluation: string;
    minDateValue: string;
    maxDateValue: string;
    dateInvalid: boolean;
    setTitle: (value: string) => void;
    setDescription: (value: string) => void;
    setExpectedEndDate: (value: string) => void;
    setReportFlag: (value: boolean) => void;
    setFinalEvaluation: (value: string) => void;
    addLink: () => void;
    updateLink: (index: number, value: string) => void;
    removeLink: (index: number) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeFile: (index: number) => void;
    handleSubmit: () => void;
    resetForm: () => void;
}

const TaskModal: React.FC<Props> = ({
                                        show,
                                        editingTask,
                                        title,
                                        description,
                                        linkItems,
                                        selectedFiles,
                                        expectedEndDate,
                                        reportFlag,
                                        finalEvaluation,
                                        minDateValue,
                                        maxDateValue,
                                        dateInvalid,
                                        setTitle,
                                        setDescription,
                                        setExpectedEndDate,
                                        setReportFlag,
                                        setFinalEvaluation,
                                        addLink,
                                        updateLink,
                                        removeLink,
                                        handleFileChange,
                                        removeFile,
                                        handleSubmit,
                                        resetForm,
                                    }) => {
    const [showErrors, setShowErrors] = useState(false);

    // Reset lokálních chyb při otevření nebo změně režimu
    useEffect(() => {
        if (show) setShowErrors(false);
    }, [show, editingTask]);

    if (!show) return null;

    const localTitleInvalid = showErrors && !title.trim();
    const localDescriptionInvalid = showErrors && !description.trim();
    const localDateInvalid = showErrors && !!expectedEndDate.trim() && dateInvalid;

    // Zavření modalu vyčistí formulář i lokální chyby
    const handleClose = () => {
        setShowErrors(false);
        resetForm();
    };

    // Kliknutí na uložení vždy spustí validaci
    const handleSubmitClick = () => {
        setShowErrors(true);
        if (!title.trim() || !description.trim()) return;
        if (expectedEndDate.trim() && dateInvalid) return;
        handleSubmit();
        setShowErrors(false);
    };

    return (
        <div
            onClick={handleClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{ background: "white", borderRadius: 18, width: "100%", maxWidth: 520, border: "1px solid #e0ede0", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}
            >
                {/* Hlavička modalu */}
                <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #e8f5e9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(135deg, #f8faf8, #eef5ee)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={iconBoxStyle}>
                            <CheckSquare size={14} color="#1F8A4D" strokeWidth={2.2} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1a3d1a" }}>
                            {editingTask ? "Upravit task" : "Nový task"}
                        </h3>
                    </div>
                    <button type="button" onClick={handleClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#8aaa8a", display: "flex", alignItems: "center", fontFamily: "inherit" }}>
                        <X size={20} strokeWidth={1.8} />
                    </button>
                </div>

                {/* Obsah formuláře */}
                <div style={{ padding: 24, maxHeight: "60vh", overflowY: "auto" }}>

                    {/* Název */}
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Název <span style={{ color: "#e24b4a" }}>*</span></label>
                        <input
                            type="text" value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Název tasku"
                            style={getFieldStyle(inputStyle, localTitleInvalid)}
                            onFocus={(e) => applyFocusStyle(e.currentTarget)}
                            onBlur={(e) => clearFocusStyle(e.currentTarget, localTitleInvalid)}
                        />
                        {localTitleInvalid && <div style={errorTextStyle}>Povinné pole.</div>}
                    </div>

                    {/* Popis */}
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Popis <span style={{ color: "#e24b4a" }}>*</span></label>
                        <textarea
                            rows={4} value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Popis tasku..."
                            style={getFieldStyle(textareaStyle, localDescriptionInvalid)}
                            onFocus={(e) => applyFocusStyle(e.currentTarget)}
                            onBlur={(e) => clearFocusStyle(e.currentTarget, localDescriptionInvalid)}
                        />
                        {localDescriptionInvalid && <div style={errorTextStyle}>Povinné pole.</div>}
                    </div>

                    {/* Odkazy */}
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <label style={{ ...labelStyle, marginBottom: 0 }}>Odkazy</label>
                            <button type="button" onClick={addLink} style={{ background: "none", border: "1.5px solid #2d7a2d", color: "#2d7a2d", borderRadius: 8, padding: "3px 10px", fontSize: 12, cursor: "pointer", fontWeight: 500, fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 4 }}>
                                + Přidat odkaz
                            </button>
                        </div>
                        {linkItems.map((link, index) => (
                            <div key={index} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                                <input
                                    type="text" value={link}
                                    onChange={(e) => updateLink(index, e.target.value)}
                                    placeholder="https://odkaz.cz"
                                    style={{ ...inputStyle, flex: 1 }}
                                    onFocus={(e) => applyFocusStyle(e.currentTarget)}
                                    onBlur={(e) => clearFocusStyle(e.currentTarget)}
                                />
                                {linkItems.length > 1 && (
                                    <button type="button" onClick={() => removeLink(index)} style={{ background: "#fce4ec", border: "none", borderRadius: 8, width: 48, height: 48, cursor: "pointer", color: "#c62828", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "inherit" }}>
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Soubory — delegováno do TaskModalFileList */}
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Soubory</label>
                        <TaskModalFileList
                            existingFiles={editingTask?.files ?? []}
                            selectedFiles={selectedFiles}
                            onFileChange={handleFileChange}
                            onRemoveFile={removeFile}
                        />
                    </div>

                    {/* Datum */}
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Předpokládané datum ukončení</label>
                        <input
                            type="date" value={expectedEndDate}
                            onChange={(e) => setExpectedEndDate(e.target.value)}
                            min={minDateValue} max={maxDateValue}
                            style={getFieldStyle(inputStyle, localDateInvalid)}
                            onFocus={(e) => applyFocusStyle(e.currentTarget)}
                            onBlur={(e) => clearFocusStyle(e.currentTarget, localDateInvalid)}
                        />
                        {localDateInvalid && <div style={errorTextStyle}>Datum musí být v povoleném rozmezí.</div>}
                    </div>

                    {/* Reportování */}
                    <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
                        <input type="checkbox" id="reportFlag" checked={reportFlag} onChange={(e) => setReportFlag(e.target.checked)} style={{ width: 16, height: 16, cursor: "pointer" }} />
                        <label htmlFor="reportFlag" style={{ ...labelStyle, marginBottom: 0, cursor: "pointer" }}>Reportovat</label>
                    </div>

                    {/* Hodnocení — pouze při editaci */}
                    {editingTask && (
                        <div style={{ marginBottom: 16 }}>
                            <label style={labelStyle}>Hodnocení</label>
                            <textarea
                                rows={3} value={finalEvaluation}
                                onChange={(e) => setFinalEvaluation(e.target.value)}
                                placeholder="Zadejte hodnocení úkolu"
                                style={getFieldStyle(textareaStyle, false, { minHeight: 80 })}
                                onFocus={(e) => applyFocusStyle(e.currentTarget)}
                                onBlur={(e) => clearFocusStyle(e.currentTarget, false)}
                            />
                        </div>
                    )}
                </div>

                {/* Patička modalu */}
                <div style={{ padding: "14px 24px", borderTop: "1px solid #e8f5e9", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, background: "#fafcfa" }}>
                    <span style={{ fontSize: 12, color: "#c62828" }}>
                        {showErrors && (!title.trim() || !description.trim())
                            ? "Vyplňte povinná pole označená *"
                            : showErrors && expectedEndDate.trim() && dateInvalid
                                ? "Zadejte platné datum v povoleném rozmezí"
                                : ""}
                    </span>
                    <div style={{ display: "flex", gap: 10 }}>
                        <button type="button" onClick={handleClose} style={{ background: "none", border: "1.5px solid #d0e8d0", borderRadius: 10, padding: "8px 20px", color: "#5a7a5a", fontWeight: 500, fontFamily: "inherit", fontSize: 14, cursor: "pointer" }}>
                            Zrušit
                        </button>
                        <button type="button" onClick={handleSubmitClick} style={{ background: "linear-gradient(135deg, #2d7a2d, #4caf50)", border: "none", borderRadius: 10, padding: "8px 24px", color: "white", fontWeight: 500, fontFamily: "inherit", fontSize: 14, cursor: "pointer", boxShadow: "0 3px 10px rgba(45,122,45,0.3)" }}>
                            {editingTask ? "Uložit změny" : "Přidat"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;