import React, { useState } from "react";
import { SquareCheck, Plus, Trash2, X, CircleAlert } from "lucide-react";

interface Props {
    tasks: any[];
    show: boolean;
    setShow: (v: boolean) => void;
    onCreate: (data: any) => void;
    onDelete: (id: number) => void;
    allowCreate: boolean;
    error: string | null;
}

// Komponenta pro zobrazení a správu tasků praxe
const TaskView: React.FC<Props> = ({
                                       tasks,
                                       show,
                                       setShow,
                                       onCreate,
                                       onDelete,
                                       allowCreate,
                                       error,
                                   }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    // Task je platný pouze pokud má vyplněný název i popis
    const isValid = title.trim() !== "" && description.trim() !== "";

    const handleSubmit = () => {
        if (!isValid) return;
        onCreate({ title, description });
        setTitle("");
        setDescription("");
        setShow(false);
    };

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

    return (
        <div style={{ marginTop: 28 }}>
            {/* Záhlaví sekce tasků */}
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={iconBoxStyle}>
                        <SquareCheck size={14} color="#1F8A4D" strokeWidth={2.2} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 16, color: "#1a3d1a" }}>
                        Tasky
                    </span>
                    {/* Počet tasků */}
                    {tasks.length > 0 && (
                        <span style={{
                            background: "linear-gradient(135deg, #2d7a2d, #4caf50)",
                            color: "white",
                            borderRadius: 12,
                            padding: "1px 8px",
                            fontSize: 11,
                            fontWeight: 700,
                        }}>
                            {tasks.length}
                        </span>
                    )}
                </div>

                {/* Tlačítko pro přidání nového tasku */}
                {allowCreate && (
                    <button
                        onClick={() => setShow(true)}
                        style={{
                            background: "none",
                            border: "1.5px solid #2d7a2d",
                            color: "#2d7a2d",
                            borderRadius: 8,
                            padding: "6px 14px",
                            fontSize: 13,
                            cursor: "pointer",
                            fontWeight: 600,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = "#2d7a2d";
                            e.currentTarget.style.color = "white";
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = "none";
                            e.currentTarget.style.color = "#2d7a2d";
                        }}
                    >
                        <Plus size={14} strokeWidth={2.5} />
                        Přidat task
                    </button>
                )}
            </div>

            {/* Inline chyba */}
            {error && (
                <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    background: "#FFF4F4",
                    border: "1px solid #F1C7C7",
                    borderRadius: 12,
                    padding: "12px 14px",
                    marginBottom: 14,
                    color: "#C75B5B",
                    fontSize: 13,
                }}>
                    <CircleAlert size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>{error}</span>
                </div>
            )}

            {/* Prázdný stav */}
            {tasks.length === 0 ? (
                <div style={{
                    textAlign: "center",
                    padding: "28px 20px",
                    background: "#f6faf6",
                    borderRadius: 12,
                    border: "1.5px dashed #c8e6c9",
                    color: "#8aaa8a",
                    fontSize: 14,
                }}>
                    <div style={{ fontWeight: 600, marginBottom: 4, color: "#5a7a5a" }}>
                        Žádné tasky
                    </div>
                    <div style={{ fontSize: 13 }}>Přidejte první task pro studenta.</div>
                </div>
            ) : (
                // Seznam tasků
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {(tasks || []).map(t => (
                        <div
                            key={t.id}
                            style={{
                                background: "white",
                                border: "1px solid #e0ede0",
                                borderRadius: 12,
                                padding: "13px 16px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                gap: 12,
                                boxShadow: "0 1px 4px rgba(34,85,34,0.05)",
                                transition: "box-shadow 0.15s",
                            }}
                            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 3px 10px rgba(34,85,34,0.1)")}
                            onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 1px 4px rgba(34,85,34,0.05)")}
                        >
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: 14, color: "#1a3d1a", marginBottom: 3 }}>
                                    {t.title}
                                </div>
                                {t.description && (
                                    <div style={{ fontSize: 13, color: "#6b8f6b", lineHeight: 1.5 }}>
                                        {t.description}
                                    </div>
                                )}
                            </div>

                            {/* Tlačítko pro smazání tasku */}
                            {allowCreate && (
                                <button
                                    onClick={() => onDelete(t.id)}
                                    title="Smazat task"
                                    style={{
                                        background: "#fce4ec",
                                        border: "none",
                                        borderRadius: 8,
                                        width: 30,
                                        height: 30,
                                        cursor: "pointer",
                                        color: "#c62828",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                        transition: "background 0.15s",
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.background = "#f8bbd0")}
                                    onMouseLeave={e => (e.currentTarget.style.background = "#fce4ec")}
                                >
                                    <Trash2 size={14} strokeWidth={1.8} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Modální okno pro přidání nového tasku */}
            {show && (
                <div
                    onClick={() => setShow(false)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.4)",
                        zIndex: 1000,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 16,
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: "white",
                            borderRadius: 18,
                            width: "100%",
                            maxWidth: 480,
                            border: "1px solid #e0ede0",
                            overflow: "hidden",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                        }}
                    >
                        {/* Záhlaví modálního okna */}
                        <div style={{
                            padding: "20px 24px 16px",
                            borderBottom: "1px solid #e8f5e9",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background: "linear-gradient(135deg, #f8faf8, #eef5ee)",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={iconBoxStyle}>
                                    <SquareCheck size={14} color="#1F8A4D" strokeWidth={2.2} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1a3d1a" }}>
                                        Nový task
                                    </h3>
                                    <p style={{ margin: 0, fontSize: 12, color: "#8aaa8a" }}>
                                        Přidejte úkol pro studenta
                                    </p>
                                </div>
                            </div>

                            {/* Zavření modalu */}
                            <button
                                onClick={() => setShow(false)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#8aaa8a",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <X size={20} strokeWidth={1.8} />
                            </button>
                        </div>

                        {/* Formulář */}
                        <div style={{ padding: 24 }}>
                            <div style={{ marginBottom: 18 }}>
                                <label style={labelStyle}>
                                    Název <span style={{ color: "#e24b4a" }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="Název tasku"
                                    style={inputStyle}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                />
                            </div>

                            {/* Popis */}
                            <div>
                                <label style={labelStyle}>
                                    Popis <span style={{ color: "#e24b4a" }}>*</span>
                                </label>
                                <textarea
                                    rows={4}
                                    required
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="Popis tasku..."
                                    style={{
                                        ...inputStyle,
                                        height: "auto",
                                        padding: "12px 14px",
                                        resize: "vertical",
                                        minHeight: 90,
                                    }}
                                    onFocus={onFocus as any}
                                    onBlur={onBlur as any}
                                />
                            </div>
                        </div>

                        {/* Patička modálního okna */}
                        <div style={{
                            padding: "14px 24px",
                            borderTop: "1px solid #e8f5e9",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 10,
                            background: "#fafcfa",
                        }}>
                            <span style={{ fontSize: 12, color: "#a0baa0" }}>
                                {isValid ? "Vše vyplněno" : "Vyplňte povinná pole Název a Popis"}
                            </span>

                            <div style={{ display: "flex", gap: 10 }}>
                                <button
                                    onClick={() => setShow(false)}
                                    style={{
                                        background: "none",
                                        border: "1.5px solid #d0e8d0",
                                        borderRadius: 10,
                                        padding: "8px 20px",
                                        color: "#5a7a5a",
                                        fontWeight: 500,
                                        fontSize: 14,
                                        cursor: "pointer",
                                    }}
                                >
                                    Zrušit
                                </button>

                                <button
                                    onClick={handleSubmit}
                                    disabled={!isValid}
                                    style={{
                                        background: isValid
                                            ? "linear-gradient(135deg, #2d7a2d, #4caf50)"
                                            : "#c8dfc8",
                                        border: "none",
                                        borderRadius: 10,
                                        padding: "8px 24px",
                                        color: "white",
                                        fontWeight: 700,
                                        fontSize: 14,
                                        cursor: isValid ? "pointer" : "not-allowed",
                                        boxShadow: isValid ? "0 3px 10px rgba(45,122,45,0.3)" : "none",
                                    }}
                                    onMouseEnter={e => { if (!isValid) return; e.currentTarget.style.opacity = "0.9"; }}
                                    onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                                >
                                    Přidat
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskView;