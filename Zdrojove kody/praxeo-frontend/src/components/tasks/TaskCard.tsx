import React from "react";
import { Trash2, Pencil, Link, Calendar, Star } from "lucide-react";
import type { Task } from "../../api/tasksApi";

interface Props {
    task: Task;
    allowCreate: boolean;
    onEdit: (task: Task) => void;
    onDelete: (id: number) => void;
}

// Formát data
const formatDate = (value?: string | null) => {
    if (!value) return "—";
    const d = new Date(value);
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
};

const TaskCard: React.FC<Props> = ({ task, allowCreate, onEdit, onDelete }) => {
    return (
        <div
            style={{
                background: "white",
                border: "1px solid #e0ede0",
                borderRadius: 12,
                padding: "13px 16px",
                boxShadow: "0 1px 4px rgba(34,85,34,0.05)",
                transition: "box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 3px 10px rgba(34,85,34,0.1)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 4px rgba(34,85,34,0.05)";
            }}
        >
            {/* Hlavička tasku */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                    marginBottom: 6,
                }}
            >
                <div style={{ flex: 1 }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            flexWrap: "wrap",
                        }}
                    >
                        <span
                            style={{
                                fontWeight: 600,
                                fontSize: 14,
                                color: "#1a3d1a",
                            }}
                        >
                            {task.title}
                        </span>

                        {/* Stav tasku */}
                        {task.status === "COMPLETED" ? (
                            <span
                                style={{
                                    background: "#e8f5e9",
                                    color: "#2d7a2d",
                                    fontSize: 11,
                                    fontWeight: 600,
                                    padding: "2px 8px",
                                    borderRadius: 10,
                                }}
                            >
                                Ukončený
                            </span>
                        ) : (
                            <span
                                style={{
                                    background: "#E3F2FD",
                                    color: "#1565C0",
                                    fontSize: 11,
                                    fontWeight: 600,
                                    padding: "2px 8px",
                                    borderRadius: 10,
                                }}
                            >
                                Aktivní
                            </span>
                        )}

                        {/* Příznak reportování */}
                        {task.reportFlag && (
                            <span
                                style={{
                                    background: "#FFF8E1",
                                    color: "#F57F17",
                                    fontSize: 11,
                                    fontWeight: 600,
                                    padding: "2px 8px",
                                    borderRadius: 10,
                                }}
                            >
                                Reportuje se
                            </span>
                        )}
                    </div>

                    {/* Metadata */}
                    <div
                        style={{
                            fontSize: 12,
                            color: "#8aaa8a",
                            marginTop: 2,
                        }}
                    >
                        Autor: {task.founder?.name || task.founder?.email || "—"} · Vytvořeno:{" "}
                        {formatDate(task.creationDate)}
                    </div>
                </div>

                {/* Akce */}
                {allowCreate && task.status !== "COMPLETED" && (
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <button
                            onClick={() => onEdit(task)}
                            title="Upravit task"
                            style={{
                                background: "#e3f2fd",
                                border: "none",
                                borderRadius: 8,
                                width: 30,
                                height: 30,
                                cursor: "pointer",
                                color: "#1565c0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Pencil size={14} strokeWidth={1.8} />
                        </button>

                        <button
                            onClick={() => onDelete(task.id)}
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
                            }}
                        >
                            <Trash2 size={14} strokeWidth={1.8} />
                        </button>
                    </div>
                )}
            </div>

            {/* Popis */}
            {task.description && (
                <div
                    style={{
                        fontSize: 13,
                        color: "#6b8f6b",
                        lineHeight: 1.5,
                        marginBottom: 8,
                        whiteSpace: "pre-wrap",
                    }}
                >
                    {task.description}
                </div>
            )}

            {/* Data */}
            {(task.expectedEndDate || task.actualEndDate) && (
                <div
                    style={{
                        display: "flex",
                        gap: 16,
                        flexWrap: "wrap",
                        fontSize: 12,
                        marginBottom: 6,
                    }}
                >
                    {task.expectedEndDate && (
                        <span
                            style={{
                                color: "#c62828",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                            }}
                        >
                            <Calendar size={12} />
                            Předpoklad: {formatDate(task.expectedEndDate)}
                        </span>
                    )}

                    {task.actualEndDate && (
                        <span style={{ color: "#2d7a2d" }}>
                            Skutečnost: {formatDate(task.actualEndDate)}
                        </span>
                    )}
                </div>
            )}

            {/* Odkazy a soubory */}
            {(task.links?.length > 0 || task.files?.length > 0) && (
                <div
                    style={{
                        fontSize: 12,
                        marginBottom: 6,
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                        alignItems: "flex-end",
                    }}
                >
                    {task.links && task.links.length > 0 && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <strong style={{ color: "#3a5a3a" }}>Odkazy:</strong>
                            <Link size={12} color="#1565c0" />
                            {task.links.map((link, index) => (
                                <a
                                    key={`${link}-${index}`}
                                    href={link.startsWith("http") ? link : `https://${link}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: "#1565c0", textDecoration: "none" }}
                                >
                                    [{index + 1}]
                                </a>
                            ))}
                        </div>
                    )}

                    {task.files && task.files.length > 0 && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                flexWrap: "wrap",
                            }}
                        >
                            <strong style={{ color: "#3a5a3a" }}>Soubory:</strong>
                            {task.files.map((file, index) => (
                                <span
                                    key={`${file}-${index}`}
                                    style={{
                                        background: "#f6faf6",
                                        border: "1px solid #d0e8d0",
                                        borderRadius: 6,
                                        padding: "2px 8px",
                                        color: "#3a5a3a",
                                    }}
                                >
                                    {file}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Hodnocení */}
            {task.finalEvaluation && (
                <div
                    style={{
                        marginTop: 10,
                        padding: "10px 12px",
                        background: "#f6faf6",
                        borderRadius: 8,
                        borderLeft: "3px solid #2d7a2d",
                    }}
                >
                    <div
                        style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#6b8f6b",
                            marginBottom: 4,
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                        }}
                    >
                        <Star size={11} />
                        Hodnocení (vložil: {task.evaluationAuthorName || "—"}):
                    </div>
                    <div style={{ fontSize: 13, color: "#1a3d1a" }}>
                        {task.finalEvaluation}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskCard;