import React, { useState } from "react";
import { CheckSquare, Plus, Trash2, X, CircleAlert, Pencil, Link, Calendar, Star } from "lucide-react";

interface Props {
    tasks: any[];
    show: boolean;
    setShow: (v: boolean) => void;
    onCreate: (data: any) => void;
    onUpdate: (id: number, data: any) => void;
    onDelete: (id: number) => void;
    allowCreate: boolean;
    error: string | null;
}

const formatDate = (value: string | null) => {
    if (!value) return "—";
    const d = new Date(value);
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
};

// Komponenta pro zobrazení a správu tasků praxe
const TaskView: React.FC<Props> = ({
                                       tasks,
                                       show,
                                       setShow,
                                       onCreate,
                                       onUpdate,
                                       onDelete,
                                       allowCreate,
                                       error,
                                   }) => {
    const [editingTask, setEditingTask] = useState<any>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    // Pole odkazů: každý odkaz je samostatný řádek
    const [linkItems, setLinkItems] = useState<string[]>([""]);

    const addLink = () => setLinkItems(prev => [...prev, ""]);
    const updateLink = (i: number, val: string) => setLinkItems(prev => prev.map((l, idx) => idx === i ? val : l));
    const removeLink = (i: number) => setLinkItems(prev => prev.filter((_, idx) => idx !== i));
    const [expectedEndDate, setExpectedEndDate] = useState("");
    const [reportFlag, setReportFlag] = useState(false);
    const [finalEvaluation, setFinalEvaluation] = useState("");

    // Task je platný pouze pokud má vyplněný název i popis
    const isValid = title.trim() !== "" && description.trim() !== "";

    // Zjištění role aktuálního uživatele z cookie
    const getCookie = (n: string) => {
        const v = `; ${document.cookie}`;
        const parts = v.split(`; ${n}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift();
    };
    const role = getCookie("userRole");
    const canEditFinalEvaluation = role === "TEACHER" || role === "EXTERNAL_WORKER" || role === "ADMIN";

    const handleSubmit = () => {
        if (!isValid) return;
        const data = {
            title,
            description,
            // Převod řetězců na pole odkazů
            links: linkItems.map(l => l.trim()).filter(l => l !== ""),
            expectedEndDate: expectedEndDate === "" ? null : expectedEndDate,
            reportFlag,
            finalEvaluation: editingTask ? finalEvaluation : undefined,
        };

        if (editingTask) {
            onUpdate(editingTask.id, data);
        } else {
            onCreate(data);
        }
        resetForm();
    };

    // Otevření formuláře pro editaci existujícího tasku
    const handleEdit = (task: any) => {
        setEditingTask(task);
        setTitle(task.title);
        setDescription(task.description);
        setLinkItems(task.links?.length ? task.links : [""]);
        setExpectedEndDate(task.expectedEndDate ? task.expectedEndDate.split("T")[0] : "");
        setReportFlag(task.reportFlag || false);
        setFinalEvaluation(task.finalEvaluation || "");
        setShow(true);
    };

    // Reset formuláře po odeslání nebo zrušení
    const resetForm = () => {
        setEditingTask(null);
        setTitle("");
        setDescription("");
        setLinkItems([""]);
        setExpectedEndDate("");
        setReportFlag(false);
        setFinalEvaluation("");
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
                        <CheckSquare size={14} color="#1F8A4D" strokeWidth={2.2} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 16, color: "#1a3d1a" }}>Tasky</span>
                    {/* Počet tasků */}
                    {tasks.length > 0 && (
                        <span style={{
                            background: "linear-gradient(135deg, #2d7a2d, #4caf50)",
                            color: "white", borderRadius: 12,
                            padding: "1px 8px", fontSize: 11, fontWeight: 700,
                        }}>
                            {tasks.length}
                        </span>
                    )}
                </div>

                {/* Tlačítko pro přidání nového tasku */}
                {allowCreate && (
                    <button
                        onClick={() => { resetForm(); setShow(true); }}
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
                    display: "flex", alignItems: "flex-start", gap: 8,
                    background: "#FFF4F4", border: "1px solid #F1C7C7",
                    borderRadius: 12, padding: "12px 14px",
                    marginBottom: 14, color: "#C75B5B", fontSize: 13,
                }}>
                    <CircleAlert size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>{error}</span>
                </div>
            )}

            {/* Prázdný stav */}
            {tasks.length === 0 ? (
                <div style={{
                    textAlign: "center", padding: "28px 20px",
                    background: "#f6faf6", borderRadius: 12,
                    border: "1.5px dashed #c8e6c9",
                    color: "#8aaa8a", fontSize: 14,
                }}>
                    <div style={{ fontWeight: 600, marginBottom: 4, color: "#5a7a5a" }}>Žádné tasky</div>
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
                                boxShadow: "0 1px 4px rgba(34,85,34,0.05)",
                                transition: "box-shadow 0.15s",
                            }}
                            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 3px 10px rgba(34,85,34,0.1)")}
                            onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 1px 4px rgba(34,85,34,0.05)")}
                        >
                            {/* Záhlaví tasku: název + tlačítka */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 6 }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                        <span style={{ fontWeight: 600, fontSize: 14, color: "#1a3d1a" }}>{t.title}</span>
                                        {/* Badge stavu: Ukončený pouze pokud má finální hodnocení */}
                                        {t.status === "COMPLETED" ? (
                                            <span style={{ background: "#e8f5e9", color: "#2d7a2d", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 10 }}>Ukončený</span>
                                        ) : (
                                            <span style={{ background: "#E3F2FD", color: "#1565C0", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 10 }}>Aktivní</span>
                                        )}
                                        {/* Badge reportování */}
                                        {t.reportFlag && (
                                            <span style={{ background: "#FFF8E1", color: "#F57F17", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 10 }}>
                                                Reportuje se
                                            </span>
                                        )}
                                    </div>
                                    {/* Autor a datum vytvoření */}
                                    <div style={{ fontSize: 12, color: "#8aaa8a", marginTop: 2 }}>
                                        Autor: {t.founder?.name || t.founder?.email || "—"} · Vytvořeno: {formatDate(t.creationDate)}
                                    </div>
                                </div>

                                {/* Tlačítka editace a smazání: skryty pokud je task ukončený */}
                                {allowCreate && !t.status === "COMPLETED" && (
                                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                                        <button
                                            onClick={() => handleEdit(t)}
                                            title="Upravit task"
                                            style={{
                                                background: "#e3f2fd", border: "none", borderRadius: 8,
                                                width: 30, height: 30, cursor: "pointer", color: "#1565c0",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                transition: "background 0.15s",
                                            }}
                                            onMouseEnter={e => (e.currentTarget.style.background = "#bbdefb")}
                                            onMouseLeave={e => (e.currentTarget.style.background = "#e3f2fd")}
                                        >
                                            <Pencil size={14} strokeWidth={1.8} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(t.id)}
                                            title="Smazat task"
                                            style={{
                                                background: "#fce4ec", border: "none", borderRadius: 8,
                                                width: 30, height: 30, cursor: "pointer", color: "#c62828",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                transition: "background 0.15s",
                                            }}
                                            onMouseEnter={e => (e.currentTarget.style.background = "#f8bbd0")}
                                            onMouseLeave={e => (e.currentTarget.style.background = "#fce4ec")}
                                        >
                                            <Trash2 size={14} strokeWidth={1.8} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Popis tasku */}
                            {t.description && (
                                <div style={{ fontSize: 13, color: "#6b8f6b", lineHeight: 1.5, marginBottom: 8, whiteSpace: "pre-wrap" }}>
                                    {t.description}
                                </div>
                            )}

                            {/* Termíny */}
                            {(t.expectedEndDate || t.actualEndDate) && (
                                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12, marginBottom: 6 }}>
                                    {t.expectedEndDate && (
                                        <span style={{ color: "#c62828", display: "inline-flex", alignItems: "center", gap: 4 }}>
                                            <Calendar size={12} />
                                            Předpoklad: {formatDate(t.expectedEndDate)}
                                        </span>
                                    )}
                                    {t.actualEndDate && (
                                        <span style={{ color: "#2d7a2d" }}>
                                            Skutečnost: {formatDate(t.actualEndDate)}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Odkazy */}
                            {t.links && t.links.length > 0 && (
                                <div style={{ fontSize: 12, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                                    <Link size={12} color="#1565c0" />
                                    {t.links.map((link: string, i: number) => (
                                        <a
                                            key={i}
                                            href={link.startsWith("http") ? link : `https://${link}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: "#1565c0", textDecoration: "none" }}
                                        >
                                            [{i + 1}]
                                        </a>
                                    ))}
                                </div>
                            )}

                            {/* Finální hodnocení tasku */}
                            {t.finalEvaluation && (
                                <div style={{
                                    marginTop: 10, padding: "10px 12px",
                                    background: "#f6faf6", borderRadius: 8,
                                    borderLeft: "3px solid #2d7a2d",
                                }}>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: "#6b8f6b", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
                                        <Star size={11} />
                                        Hodnocení (vložil: {t.evaluationAuthorName || "—"}):
                                    </div>
                                    <div style={{ fontSize: 13, color: "#1a3d1a" }}>{t.finalEvaluation}</div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Modální okno pro přidání nebo editaci tasku */}
            {show && (
                <div
                    onClick={resetForm}
                    style={{
                        position: "fixed", inset: 0,
                        background: "rgba(0,0,0,0.4)", zIndex: 1000,
                        display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: "white", borderRadius: 18,
                            width: "100%", maxWidth: 520,
                            border: "1px solid #e0ede0", overflow: "hidden",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                        }}
                    >
                        {/* Záhlaví modálního okna */}
                        <div style={{
                            padding: "20px 24px 16px",
                            borderBottom: "1px solid #e8f5e9",
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            background: "linear-gradient(135deg, #f8faf8, #eef5ee)",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={iconBoxStyle}>
                                    <CheckSquare size={14} color="#1F8A4D" strokeWidth={2.2} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1a3d1a" }}>
                                        {editingTask ? "Upravit task" : "Nový task"}
                                    </h3>
                                    <p style={{ margin: 0, fontSize: 12, color: "#8aaa8a" }}>
                                        {editingTask ? "Upravte úkol pro studenta" : "Přidejte úkol pro studenta"}
                                    </p>
                                </div>
                            </div>
                            {/* Zavření modálního okna */}
                            <button
                                onClick={resetForm}
                                style={{ background: "none", border: "none", cursor: "pointer", color: "#8aaa8a", display: "flex", alignItems: "center" }}
                            >
                                <X size={20} strokeWidth={1.8} />
                            </button>
                        </div>

                        {/* Formulář */}
                        <div style={{ padding: 24, maxHeight: "60vh", overflowY: "auto" }}>
                            {/* Název */}
                            <div style={{ marginBottom: 16 }}>
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
                            <div style={{ marginBottom: 16 }}>
                                <label style={labelStyle}>
                                    Popis <span style={{ color: "#e24b4a" }}>*</span>
                                </label>
                                <textarea
                                    rows={4}
                                    required
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="Popis tasku..."
                                    style={{ ...inputStyle, height: "auto", padding: "12px 14px", resize: "vertical", minHeight: 90 }}
                                    onFocus={onFocus as any}
                                    onBlur={onBlur as any}
                                />
                            </div>

                            {/* Odkazy: každý odkaz samostatně */}
                            <div style={{ marginBottom: 16 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                    <label style={{ ...labelStyle, marginBottom: 0 }}>Odkazy</label>
                                    <button
                                        type="button"
                                        onClick={addLink}
                                        style={{
                                            background: "none", border: "1.5px solid #2d7a2d",
                                            color: "#2d7a2d", borderRadius: 8, padding: "3px 10px",
                                            fontSize: 12, cursor: "pointer", fontWeight: 600,
                                            display: "inline-flex", alignItems: "center", gap: 4,
                                        }}
                                    >
                                        + Přidat odkaz
                                    </button>
                                </div>
                                {linkItems.map((link, i) => (
                                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                                        <input
                                            type="text"
                                            value={link}
                                            onChange={e => updateLink(i, e.target.value)}
                                            placeholder="https://odkaz.cz"
                                            style={{ ...inputStyle, flex: 1 }}
                                            onFocus={onFocus}
                                            onBlur={onBlur}
                                        />
                                        {linkItems.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeLink(i)}
                                                style={{
                                                    background: "#fce4ec", border: "none", borderRadius: 8,
                                                    width: 48, height: 48, cursor: "pointer", color: "#c62828",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Předpokládané datum ukončení: pouze pro učitele/extrnisty */}
                            {canEditFinalEvaluation && (
                                <div style={{ marginBottom: 16 }}>
                                    <label style={labelStyle}>Předpokládané datum ukončení</label>
                                    <input
                                        type="date"
                                        value={expectedEndDate}
                                        onChange={e => setExpectedEndDate(e.target.value)}
                                        style={inputStyle}
                                        onFocus={onFocus}
                                        onBlur={onBlur}
                                    />
                                </div>
                            )}

                            {/* Reportovat: pouze pro učitele/extrnisty */}
                            {canEditFinalEvaluation && (
                                <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
                                    <input
                                        type="checkbox"
                                        id="reportFlag"
                                        checked={reportFlag}
                                        onChange={e => setReportFlag(e.target.checked)}
                                        style={{ width: 16, height: 16, cursor: "pointer" }}
                                    />
                                    <label htmlFor="reportFlag" style={{ ...labelStyle, marginBottom: 0, cursor: "pointer" }}>
                                        Reportovat
                                    </label>
                                </div>
                            )}

                            {/* Finální hodnocení: pouze pro učitele/extrnisty při editaci */}
                            {editingTask && canEditFinalEvaluation && (
                                <div style={{ marginBottom: 16 }}>
                                    <label style={labelStyle}>Finální hodnocení</label>
                                    <textarea
                                        rows={3}
                                        value={finalEvaluation}
                                        onChange={e => setFinalEvaluation(e.target.value)}
                                        placeholder="Zadejte finální hodnocení úkolu"
                                        style={{ ...inputStyle, height: "auto", padding: "12px 14px", resize: "vertical", minHeight: 80 }}
                                        onFocus={onFocus as any}
                                        onBlur={onBlur as any}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Patička modálního okna */}
                        <div style={{
                            padding: "14px 24px",
                            borderTop: "1px solid #e8f5e9",
                            display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10,
                            background: "#fafcfa",
                        }}>
                            <span style={{ fontSize: 12, color: "#a0baa0" }}>
                                {isValid ? "Vše vyplněno" : "Vyplňte povinná pole Název a Popis"}
                            </span>
                            <div style={{ display: "flex", gap: 10 }}>
                                <button
                                    onClick={resetForm}
                                    style={{
                                        background: "none", border: "1.5px solid #d0e8d0",
                                        borderRadius: 10, padding: "8px 20px",
                                        color: "#5a7a5a", fontWeight: 500, fontSize: 14, cursor: "pointer",
                                    }}
                                >
                                    Zrušit
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!isValid}
                                    style={{
                                        background: isValid ? "linear-gradient(135deg, #2d7a2d, #4caf50)" : "#c8dfc8",
                                        border: "none", borderRadius: 10, padding: "8px 24px",
                                        color: "white", fontWeight: 700, fontSize: 14,
                                        cursor: isValid ? "pointer" : "not-allowed",
                                        boxShadow: isValid ? "0 3px 10px rgba(45,122,45,0.3)" : "none",
                                    }}
                                    onMouseEnter={e => { if (!isValid) return; e.currentTarget.style.opacity = "0.9"; }}
                                    onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                                >
                                    {editingTask ? "Uložit změny" : "Přidat"}
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