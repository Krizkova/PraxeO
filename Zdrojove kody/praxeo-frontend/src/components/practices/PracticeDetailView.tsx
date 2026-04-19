import React, { useState, useEffect } from "react";
import {
    PencilLine,
    Pin,
    FileText,
    User,
    GraduationCap,
    CalendarDays,
    BadgeCheck,
    RefreshCw,
    MessageSquare,
    Paperclip,
    FolderOpen,
    Download,
    Trash2,
    CircleAlert,
    Save,
    X,
} from "lucide-react";
import { translatePracticeState } from "../../utils/practiceState";
import Task from "../tasks/Task";

interface Props {
    practice: any;
    loading: boolean;
    error: string | null;
    // Chyba při přihlášení k praxi: zobrazuje se inline pod tlačítkem
    assignError?: string | null;
    attachments: any[];
    editMode: boolean;
    setEditMode: (value: boolean) => void;
    canEdit: boolean;
    canEditFounder: boolean;
    canEditStudent: boolean;
    canEditFinalEvaluation: boolean;
    canChangeState: boolean;
    canUpload: boolean;
    onUpdate: (data: any) => void;
    onFileUpload: (file: File) => void;
    onDeleteAttachment: (id: number) => void;
    onDownloadAttachment: (id: number, title: string) => void;
    onChangeState: (state: "CANCELED" | "COMPLETED") => void;
    onAssignStudent: (assign: boolean) => void;
    onChangeStudentState: (state: "ACTIVE" | "SUBMITTED") => void;
}

const formatDate = (value: string | null) => {
    if (!value) return "—";
    const d = new Date(value);
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
};

const stateColors: Record<string, { bg: string; color: string }> = {
    NEW: { bg: "#D6EDDF", color: "#1F8A4D" },
    ACTIVE: { bg: "#E3F2FD", color: "#1565C0" },
    SUBMITTED: { bg: "#FFF8E1", color: "#F57F17" },
    CANCELED: { bg: "#FCE4EC", color: "#C62828" },
    COMPLETED: { bg: "#F3E5F5", color: "#6A1B9A" },
};

const PracticeDetailView: React.FC<Props> = ({
                                                 practice,
                                                 loading,
                                                 error,
                                                 assignError,
                                                 attachments,
                                                 editMode,
                                                 setEditMode,
                                                 canEdit,
                                                 canEditFounder,
                                                 canEditStudent,
                                                 canEditFinalEvaluation,
                                                 canChangeState,
                                                 canUpload,
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
    const [state, setState] = useState("");

    // Naplnění formuláře stávajícími daty praxe při otevření editace
    useEffect(() => {
        if (!practice) return;
        setName(practice.name);
        setDescription(practice.description);
        setCompletedAt(practice.completedAt);
        setStudentEvaluation(practice.studentEvaluation || "");
        setFinalEvaluation(practice.finalEvaluation || "");
        setFounderEmail(practice.founderEmail || "");
        setStudentEmail(practice.studentEmail || "");
        setState(practice.state || "");
    }, [practice]);

    const getCookie = (n: string) => {
        const v = `; ${document.cookie}`;
        const parts = v.split(`; ${n}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift();
    };

    const role = getCookie("userRole");

    // Validace: název a popis jsou povinné pro zakladatele/admina
    const canSave = (canEditFounder || role === "ADMIN")
        ? name.trim() !== "" && description.trim() !== ""
        : true;

    const inputStyle: React.CSSProperties = {
        width: "100%",
        height: 48,
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
        height: "auto",
        padding: "12px 14px",
        resize: "vertical",
        minHeight: 96,
        lineHeight: 1.5,
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

    const btnGreen: React.CSSProperties = {
        height: 40,
        background: "linear-gradient(135deg, #2d7a2d, #4caf50)",
        color: "white",
        border: "none",
        borderRadius: 10,
        padding: "0 18px",
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        boxShadow: "0 3px 10px rgba(45,122,45,0.25)",
    };

    const btnOutline: React.CSSProperties = {
        height: 40,
        background: "none",
        color: "#2d7a2d",
        border: "1.5px solid #2d7a2d",
        borderRadius: 10,
        padding: "0 16px",
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
    };

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

    const btnDisabled: React.CSSProperties = {
        opacity: 0.45,
        cursor: "not-allowed",
    };

    const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        e.target.style.border = "1.5px solid #2d7a2d";
        e.target.style.boxShadow = "0 0 0 3px rgba(45,122,45,0.1)";
        (e.target as any).style.background = "#fcfffc";
    };

    const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        e.target.style.border = "1.5px solid #d0e8d0";
        e.target.style.boxShadow = "none";
        (e.target as any).style.background = "white";
    };

    // Sestavení payloadu jen z polí, která může uživatel upravit
    const handleSave = () => {
        if (!canSave) return;
        const payload: any = {};

        if (canEditFounder || role === "ADMIN") {
            payload.name = name;
            payload.description = description;
            payload.completedAt = completedAt;
        }
        if (canEditFinalEvaluation || role === "ADMIN") {
            payload.finalEvaluation = finalEvaluation;
        }
        if (canEditStudent || role === "ADMIN") {
            payload.studentEvaluation = studentEvaluation;
        }
        if (role === "ADMIN") {
            payload.founderEmail = founderEmail;
            payload.studentEmail = studentEmail;
            payload.state = state;
        }

        onUpdate(payload);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onFileUpload(file);
    };

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
                <div style={{
                    width: 26, height: 26,
                    border: "2px solid #D6EDDF",
                    borderTopColor: "#2d7a2d",
                    borderRadius: "50%",
                }} />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                display: "flex", alignItems: "flex-start", gap: 8,
                background: "#FFF4F4", border: "1px solid #F1C7C7",
                borderRadius: 12, padding: "12px 16px",
                fontSize: 13, color: "#C75B5B",
            }}>
                <CircleAlert size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{error}</span>
            </div>
        );
    }

    if (!practice) return null;

    const sc = stateColors[practice.state] || { bg: "#f0f4f0", color: "#667085" };

    const InfoRow = ({ icon, label, value }: {
        icon: React.ReactNode;
        label: string;
        value: React.ReactNode;
    }) => (
        <div style={{
            display: "flex", gap: 10,
            padding: "11px 0",
            borderBottom: "1px solid #f0f5f0",
            alignItems: "flex-start",
        }}>
            <div style={{ ...iconBoxStyle, width: 22, height: 22 }}>{icon}</div>
            <span style={{ fontWeight: 600, color: "#6b8f6b", minWidth: 170, fontSize: 13 }}>
                {label}
            </span>
            <span style={{ color: "#1a3d1a", fontSize: 14, flex: 1, lineHeight: 1.5 }}>
                {value}
            </span>
        </div>
    );

    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 300px",
            gap: 24,
            alignItems: "start",
            maxWidth: 1200,
        }}>
            {/* Hlavní karta detailu */}
            <div style={{
                background: "white",
                borderRadius: 18,
                border: "1px solid #e0ede0",
                padding: 28,
                boxShadow: "0 4px 24px rgba(34,85,34,0.07)",
            }}>
                {editMode ? (
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                            <div style={iconBoxStyle}>
                                <MessageSquare size={14} color="#1F8A4D" strokeWidth={2.2} />
                            </div>
                            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1a3d1a" }}>
                                {role === "STUDENT"
                                    ? (practice.studentEvaluation?.trim()
                                        ? "Upravit hodnocení"
                                        : "Přidat hodnocení")
                                    : (canEditFinalEvaluation
                                        ? (practice.finalEvaluation?.trim()
                                            ? "Upravit finální hodnocení"
                                            : "Přidat finální hodnocení")
                                        : "Upravit praxi")}
                            </h2>
                        </div>

                        {(canEditFounder || role === "ADMIN") && (
                            <>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={labelStyle}>
                                        Název <span style={{ color: "#e24b4a" }}>*</span>
                                    </label>
                                    <input
                                        style={{ ...inputStyle, ...(name.trim() === "" ? { border: "1.5px solid #e24b4a" } : {}) }}
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        onFocus={onFocus}
                                        onBlur={onBlur}
                                        required
                                    />
                                    {name.trim() === "" && (
                                        <p style={{ fontSize: 11, color: "#e24b4a", marginTop: 4 }}>Název je povinný.</p>
                                    )}
                                </div>

                                <div style={{ marginBottom: 16 }}>
                                    <label style={labelStyle}>
                                        Popis <span style={{ color: "#e24b4a" }}>*</span>
                                    </label>
                                    <textarea
                                        style={{ ...textareaStyle, ...(description.trim() === "" ? { border: "1.5px solid #e24b4a" } : {}) }}
                                        rows={4}
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        onFocus={onFocus as any}
                                        onBlur={onBlur as any}
                                        required
                                    />
                                    {description.trim() === "" && (
                                        <p style={{ fontSize: 11, color: "#e24b4a", marginTop: 4 }}>Popis je povinný.</p>
                                    )}
                                </div>

                                <div style={{ marginBottom: 16 }}>
                                    <label style={labelStyle}>Datum dokončení</label>
                                    <input
                                        type="date"
                                        style={inputStyle}
                                        value={completedAt ? completedAt.substring(0, 10) : ""}
                                        onChange={e => setCompletedAt(e.target.value)}
                                        onFocus={onFocus}
                                        onBlur={onBlur}
                                    />
                                </div>
                            </>
                        )}

                        {(canEditFinalEvaluation || role === "ADMIN") && (
                            <div style={{ marginBottom: 16 }}>
                                <label style={labelStyle}>Finální hodnocení</label>
                                <textarea
                                    style={{ ...textareaStyle, minHeight: 110 }}
                                    rows={5}
                                    value={finalEvaluation}
                                    onChange={e => setFinalEvaluation(e.target.value)}
                                    onFocus={onFocus as any}
                                    onBlur={onBlur as any}
                                />
                            </div>
                        )}

                        {(canEditStudent || role === "ADMIN") && (
                            <div style={{ marginBottom: 16 }}>
                                <label style={labelStyle}>Moje hodnocení</label>
                                <textarea
                                    style={textareaStyle}
                                    rows={4}
                                    value={studentEvaluation}
                                    onChange={e => setStudentEvaluation(e.target.value)}
                                    onFocus={onFocus as any}
                                    onBlur={onBlur as any}
                                />
                            </div>
                        )}

                        {role === "ADMIN" && (
                            <>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={labelStyle}>Zakladatel praxe</label>
                                    <input style={inputStyle} value={founderEmail}
                                           onChange={e => setFounderEmail(e.target.value)}
                                           onFocus={onFocus} onBlur={onBlur} />
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={labelStyle}>Student praxe</label>
                                    <input style={inputStyle} value={studentEmail}
                                           onChange={e => setStudentEmail(e.target.value)}
                                           onFocus={onFocus} onBlur={onBlur} />
                                </div>
                                <div style={{ marginBottom: 20 }}>
                                    <label style={labelStyle}>Stav praxe</label>
                                    <select
                                        style={{ ...inputStyle, appearance: "none" as any }}
                                        value={state}
                                        onChange={e => setState(e.target.value)}
                                        onFocus={onFocus as any}
                                        onBlur={onBlur as any}
                                    >
                                        {["NEW", "ACTIVE", "SUBMITTED", "CANCELED", "COMPLETED"].map(st => (
                                            <option key={st} value={st}>{translatePracticeState(st)}</option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}

                        <div style={{
                            borderTop: "1px solid #e8f5e9", paddingTop: 18,
                            display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center",
                        }}>
                            <button
                                style={{ ...btnGreen, ...(!canSave ? btnDisabled : {}) }}
                                disabled={!canSave}
                                onClick={handleSave}
                            >
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                                    <Save size={14} />
                                    Uložit změny
                                </span>
                            </button>
                            <button style={btnOutline} onClick={() => setEditMode(false)}>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                                    <X size={14} />
                                    Zrušit
                                </span>
                            </button>
                            {!canSave && (
                                <span style={{ fontSize: 12, color: "#e24b4a" }}>
                                    Vyplňte povinná pole Název a Popis
                                </span>
                            )}
                        </div>
                    </div>
                ) : (
                    <div>
                        {/* Akce nad detailem */}
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20, alignItems: "flex-start" }}>

                            {/* Přihlášení k praxi — s inline chybou pod tlačítkem */}
                            {role === "STUDENT" && !practice.studentEmail && practice.state === "NEW" && (
                                <div>
                                    <button style={btnBlue} onClick={() => onAssignStudent(true)}>
                                        Přihlásit se k praxi
                                    </button>
                                    {assignError && (
                                        <p style={{ fontSize: 12, color: "#e24b4a", margin: "6px 0 0", lineHeight: 1.5 }}>
                                            {assignError}
                                        </p>
                                    )}
                                </div>
                            )}

                            {canEditStudent && practice.state === "ACTIVE" && (
                                <>
                                    {/* Tlačítko odhlášení: skryto pokud student již přidal hodnocení */}
                                    {!practice.studentEvaluation?.trim() && (
                                        <button style={btnOutline} onClick={() => onAssignStudent(false)}>
                                            Odhlásit se z praxe
                                        </button>
                                    )}
                                    <button
                                        style={{ ...btnGreen, ...(!practice.studentEvaluation?.trim() ? btnDisabled : {}) }}
                                        disabled={!practice.studentEvaluation?.trim()}
                                        onClick={() => onChangeStudentState("SUBMITTED")}
                                    >
                                        Odevzdat praxi
                                    </button>
                                </>
                            )}

                            {role === "STUDENT" && practice.state === "SUBMITTED" && !practice.finalEvaluation?.trim() && (
                                <button style={btnOutline} onClick={() => onChangeStudentState("ACTIVE")}>
                                    Vrátit do aktivního stavu
                                </button>
                            )}

                            {canEdit && role !== "STUDENT" && practice.state !== "SUBMITTED" && (
                                <button style={btnOutline} onClick={() => setEditMode(true)}>
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                                        <PencilLine size={14} />
                                        Upravit
                                    </span>
                                </button>
                            )}

                            {/* Tlačítko hodnocení pro studenta */}
                            {canEdit && role === "STUDENT" && (
                                <button style={btnOutline} onClick={() => setEditMode(true)}>
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                                        <MessageSquare size={14} />
                                        {practice.studentEvaluation?.trim()
                                            ? "Upravit hodnocení"
                                            : "Přidat hodnocení"}
                                    </span>
                                </button>
                            )}

                            {/* Tlačítko finálního hodnocení pro zakladatele (učitel/externista) — při stavu SUBMITTED */}
                            {canEditFinalEvaluation && practice.state === "SUBMITTED" && (
                                <button style={btnOutline} onClick={() => setEditMode(true)}>
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                                        <MessageSquare size={14} />
                                        {practice.finalEvaluation?.trim()
                                            ? "Upravit finální hodnocení"
                                            : "Přidat finální hodnocení"}
                                    </span>
                                </button>
                            )}
                        </div>

                        <InfoRow icon={<Pin size={13} color="#1F8A4D" strokeWidth={2.2} />} label="Název" value={<strong>{practice.name}</strong>} />
                        <InfoRow icon={<FileText size={13} color="#1F8A4D" strokeWidth={2.2} />} label="Popis" value={practice.description} />
                        <InfoRow icon={<User size={13} color="#1F8A4D" strokeWidth={2.2} />} label="Zakladatel" value={practice.founderEmail ?? "—"} />
                        <InfoRow icon={<GraduationCap size={13} color="#1F8A4D" strokeWidth={2.2} />} label="Student" value={practice.studentEmail ?? "—"} />
                        <InfoRow icon={<CalendarDays size={13} color="#1F8A4D" strokeWidth={2.2} />} label="Vytvořeno" value={formatDate(practice.createdAt)} />
                        <InfoRow icon={<BadgeCheck size={13} color="#1F8A4D" strokeWidth={2.2} />} label="Vybráno" value={formatDate(practice.selectedAt)} />
                        <InfoRow icon={<CalendarDays size={13} color="#1F8A4D" strokeWidth={2.2} />} label="Datum dokončení" value={formatDate(practice.completedAt)} />
                        <InfoRow
                            icon={<RefreshCw size={13} color="#1F8A4D" strokeWidth={2.2} />}
                            label="Stav"
                            value={
                                <span style={{
                                    background: sc.bg, color: sc.color,
                                    padding: "3px 10px", borderRadius: 20,
                                    fontSize: 12, fontWeight: 600,
                                }}>
                                    {translatePracticeState(practice.state)}
                                </span>
                            }
                        />
                        <InfoRow icon={<GraduationCap size={13} color="#1F8A4D" strokeWidth={2.2} />} label="Finální hodnocení" value={practice.finalEvaluation ?? "—"} />
                        <InfoRow icon={<MessageSquare size={13} color="#1F8A4D" strokeWidth={2.2} />} label="Hodnocení studenta" value={practice.studentEvaluation ?? "—"} />

                        <div style={{ marginTop: 24 }}>
                            <Task
                                practiceId={practice.id}
                                allowCreate={practice.state === "NEW" || practice.state === "ACTIVE"}
                            />
                        </div>

                        {canChangeState && (
                            <div style={{
                                display: "flex", gap: 10, flexWrap: "wrap",
                                marginTop: 24, paddingTop: 20,
                                borderTop: "1px solid #f0f5f0",
                            }}>
                                <button style={btnDanger} onClick={() => onChangeState("CANCELED")}>
                                    Zrušit praxi
                                </button>
                                <button
                                    style={{ ...btnGreen, ...(!practice.finalEvaluation?.trim() ? btnDisabled : {}) }}
                                    disabled={!practice.finalEvaluation?.trim()}
                                    onClick={() => onChangeState("COMPLETED")}
                                >
                                    Praxe dokončena
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Pravý sloupec: přílohy */}
            <div style={{
                background: "white",
                borderRadius: 18,
                border: "1px solid #e0ede0",
                padding: 20,
                boxShadow: "0 4px 24px rgba(34,85,34,0.07)",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <div style={iconBoxStyle}>
                        <Paperclip size={14} color="#1F8A4D" strokeWidth={2.2} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 15, color: "#1a3d1a" }}>Přílohy</span>
                    {attachments.length > 0 && (
                        <span style={{
                            background: "linear-gradient(135deg, #2d7a2d, #4caf50)",
                            color: "white", borderRadius: 12,
                            padding: "1px 8px", fontSize: 11, fontWeight: 700,
                        }}>
                            {attachments.length}
                        </span>
                    )}
                </div>

                {canUpload && !practice.closed && (
                    <>
                        <input type="file" id="uploadInput" style={{ display: "none" }} onChange={handleFileChange} />
                        <button
                            style={{ ...btnGreen, width: "100%", marginBottom: 14, fontSize: 13 }}
                            onClick={() => document.getElementById("uploadInput")?.click()}
                        >
                            Přidat soubor
                        </button>
                    </>
                )}

                {attachments.length === 0 ? (
                    <div style={{
                        textAlign: "center", padding: "20px 8px",
                        background: "#f6faf6", border: "1.5px dashed #c8e6c9",
                        borderRadius: 12, color: "#8aaa8a", fontSize: 13,
                    }}>
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                            <FolderOpen size={24} color="#8aaa8a" />
                        </div>
                        Žádné přílohy
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {attachments.map(a => (
                            <div key={a.id} style={{
                                background: "#f6faf6", border: "1px solid #e0ede0",
                                borderRadius: 10, padding: "9px 12px",
                                display: "flex", justifyContent: "space-between",
                                alignItems: "center", gap: 8,
                            }}>
                                <span style={{
                                    display: "inline-flex", alignItems: "center", gap: 8,
                                    fontSize: 13, color: "#2c4a2c",
                                    overflow: "hidden", textOverflow: "ellipsis",
                                    whiteSpace: "nowrap", flex: 1,
                                }}>
                                    <FileText size={14} style={{ flexShrink: 0 }} />
                                    {a.title}
                                </span>
                                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                                    <button
                                        onClick={() => onDownloadAttachment(a.id, a.title)}
                                        style={{
                                            background: "#e3f2fd", border: "none", borderRadius: 7,
                                            width: 28, height: 28, cursor: "pointer", color: "#1565c0",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                        }}
                                    >
                                        <Download size={14} />
                                    </button>
                                    {!practice.closed && (
                                        <button
                                            onClick={() => onDeleteAttachment(a.id)}
                                            style={{
                                                background: "#fce4ec", border: "none", borderRadius: 7,
                                                width: 28, height: 28, cursor: "pointer", color: "#c62828",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                            }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PracticeDetailView;