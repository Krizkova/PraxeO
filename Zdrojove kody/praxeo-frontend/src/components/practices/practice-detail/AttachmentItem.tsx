import React from "react";
import { Download, Trash2, FileText } from "lucide-react";
import PracticeIconButton from "./PracticeIconButton";
import type { Attachment } from "../../../types/practice";

interface AttachmentItemProps {
    attachment: Attachment;
    canDelete: boolean;
    onDownload: (id: number, title: string) => void;
    onDelete: (id: number) => void;
}

// Sdílená položka přílohy pro seznam souborů v detailu praxe
const AttachmentItem: React.FC<AttachmentItemProps> = ({
                                                           attachment,
                                                           canDelete,
                                                           onDownload,
                                                           onDelete,
                                                       }) => {
    return (
        <div
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
            <span
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 13,
                    color: "#2c4a2c",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                }}
            >
                <FileText size={14} style={{ flexShrink: 0 }} />
                {attachment.title}
            </span>

            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <PracticeIconButton
                    onClick={() => onDownload(attachment.id, attachment.title)}
                    title="Stáhnout soubor"
                    color="#1565c0"
                    background="#e3f2fd"
                    size={28}
                >
                    <Download size={14} />
                </PracticeIconButton>

                {canDelete && (
                    <PracticeIconButton
                        onClick={() => onDelete(attachment.id)}
                        title="Smazat soubor"
                        color="#c62828"
                        background="#fce4ec"
                        size={28}
                    >
                        <Trash2 size={14} />
                    </PracticeIconButton>
                )}
            </div>
        </div>
    );
};

export default AttachmentItem;