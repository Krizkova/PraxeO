import React, { useRef } from "react";
import { Paperclip, FolderOpen } from "lucide-react";
import FormCard from "../../common/FormCard";
import PrimaryButton from "../../common/PrimaryButton";
import AttachmentItem from "./AttachmentItem";
import { iconBoxStyle } from "../../../utils/forms/formStyles";
import {Attachment} from "../../../utils/forms/types/practice";

interface Props {
    attachments: Attachment[];
    canUpload: boolean;
    canDeleteAttachment: boolean;
    isClosed: boolean;
    onFileUpload: (file: File) => void;
    onDeleteAttachment: (id: number) => void;
    onDownloadAttachment: (id: number, title: string) => void;
}

// Postranní karta se seznamem příloh a možností nahrání souboru
const PracticeAttachmentsCard: React.FC<Props> = ({
                                                      attachments,
                                                      canUpload,
                                                      canDeleteAttachment,
                                                      isClosed,
                                                      onFileUpload,
                                                      onDeleteAttachment,
                                                      onDownloadAttachment,
                                                  }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Zpracování vybraného souboru a vyčištění inputu
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        onFileUpload(file);
        e.target.value = "";
    };

    return (
        <FormCard padding={20}>
            {/* Hlavička karty příloh */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={iconBoxStyle}>
                    <Paperclip size={14} color="#1F8A4D" strokeWidth={2.2} />
                </div>

                <span style={{ fontWeight: 700, fontSize: 15, color: "#1a3d1a" }}>
                    Přílohy
                </span>

                {attachments.length > 0 && (
                    <span
                        style={{
                            background: "linear-gradient(135deg, #2d7a2d, #4caf50)",
                            color: "white",
                            borderRadius: 12,
                            padding: "1px 8px",
                            fontSize: 11,
                            fontWeight: 700,
                        }}
                    >
                        {attachments.length}
                    </span>
                )}
            </div>

            {/* Tlačítko pro nahrání souboru */}
            {canUpload && (
                <>
                    <input
                        ref={fileInputRef}
                        type="file"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />

                    <PrimaryButton
                        width="100%"
                        height={40}
                        marginBottom={14}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Přidat soubor
                    </PrimaryButton>
                </>
            )}

            {/* Prázdný stav nebo seznam příloh */}
            {attachments.length === 0 ? (
                <div
                    style={{
                        textAlign: "center",
                        padding: "20px 8px",
                        background: "#f6faf6",
                        border: "1.5px dashed #c8e6c9",
                        borderRadius: 12,
                        color: "#8aaa8a",
                        fontSize: 13,
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                        <FolderOpen size={24} color="#8aaa8a" />
                    </div>
                    Žádné přílohy
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {attachments.map((attachment) => (
                        <AttachmentItem
                            key={attachment.id}
                            attachment={attachment}
                            canDelete={canDeleteAttachment}
                            onDownload={onDownloadAttachment}
                            onDelete={onDeleteAttachment}
                        />
                    ))}
                </div>
            )}

            {isClosed && !canUpload && (
                <div
                    style={{
                        marginTop: 12,
                        fontSize: 12,
                        color: "#7b8f7b",
                        lineHeight: 1.5,
                    }}
                >
                </div>
            )}
        </FormCard>
    );
};

export default PracticeAttachmentsCard;