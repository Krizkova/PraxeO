import React, { useRef, useState } from "react";
import { Download, Trash2, FileText } from "lucide-react";
import { downloadAttachment, deleteAttachment } from "../../api/practicesApi";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import type { Attachment } from "../../utils/forms/types/practice";

interface Props {
    // Existující přílohy uložené na serveru
    existingFiles: Attachment[];
    // Nově vybrané soubory k nahrání
    selectedFiles: File[];
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveFile: (index: number) => void;
}

const TaskModalFileList: React.FC<Props> = ({
                                                existingFiles,
                                                selectedFiles,
                                                onFileChange,
                                                onRemoveFile,
                                            }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Stav pro potvrzovací dialog mazání přílohy
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const [confirmDeleteTitle, setConfirmDeleteTitle] = useState<string>("");

    const handleDownload = async (id: number, title: string) => {
        try {
            const response = await downloadAttachment(id);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", title);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Chyba při stahování souboru:", error);
            alert("Soubor se nepodařilo stáhnout.");
        }
    };

    const handleConfirmDelete = async () => {
        if (confirmDeleteId === null) return;
        try {
            await deleteAttachment(confirmDeleteId);
            window.location.reload();
        } catch (error) {
            console.error("Chyba při mazání souboru:", error);
            alert("Soubor se nepodařilo smazat.");
        } finally {
            setConfirmDeleteId(null);
            setConfirmDeleteTitle("");
        }
    };

    return (
        <>
            {/* Potvrzovací dialog pro smazání přílohy */}
            {confirmDeleteId !== null && (
                <ConfirmDeleteDialog
                    title="Smazat soubor?"
                    fileName={confirmDeleteTitle}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => {
                        setConfirmDeleteId(null);
                        setConfirmDeleteTitle("");
                    }}
                />
            )}

            {/* Existující přílohy ze serveru */}
            {existingFiles.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                    {existingFiles.map((attachment) => (
                        <div
                            key={attachment.id}
                            style={{
                                background: "#f6faf6",
                                border: "1px solid #e0ede0",
                                borderRadius: 10,
                                padding: "9px 12px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <span style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                fontSize: 13,
                                color: "#2c4a2c",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                flex: 1,
                            }}>
                                <FileText size={14} style={{ flexShrink: 0 }} />
                                {attachment.title}
                            </span>

                            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                                <button
                                    type="button"
                                    onClick={() => handleDownload(attachment.id, attachment.title)}
                                    style={{ background: "#e3f2fd", border: "none", borderRadius: 8, width: 28, height: 28, cursor: "pointer", color: "#1565c0", display: "flex", alignItems: "center", justifyContent: "center" }}
                                    title="Stáhnout"
                                >
                                    <Download size={14} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => { setConfirmDeleteId(attachment.id); setConfirmDeleteTitle(attachment.title); }}
                                    style={{ background: "#fce4ec", border: "none", borderRadius: 8, width: 28, height: 28, cursor: "pointer", color: "#c62828", display: "flex", alignItems: "center", justifyContent: "center" }}
                                    title="Smazat"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Nově vybrané soubory k nahrání */}
            {selectedFiles.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                    {selectedFiles.map((file, index) => (
                        <div key={index} style={{ display: "flex", gap: 8 }}>
                            <div style={{ height: 48, display: "flex", alignItems: "center", padding: "0 14px", color: "#6b8f6b", fontSize: 13, border: "1.5px solid #d0e8d0", borderRadius: 10 }}>
                                {file.name}
                            </div>
                            <button
                                type="button"
                                onClick={() => onRemoveFile(index)}
                                style={{ background: "#fce4ec", border: "none", borderRadius: 8, width: 48, height: 48, cursor: "pointer", color: "#c62828", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "inherit" }}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Tlačítko pro přidání souboru */}
            <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={onFileChange} />
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{ background: "none", border: "1.5px solid #2d7a2d", color: "#2d7a2d", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer", fontWeight: 500, fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 6 }}
            >
                + Přidat soubor
            </button>
        </>
    );
};

export default TaskModalFileList;