import React from "react";
import { Spinner, Alert, Button } from "react-bootstrap";

interface PracticeDto {
    id: number;
    name: string;
    description: string;
    companyName: string;
    validFrom: string;
    validTo: string;
}

interface PracticeDetailDto {
    id: number;
    practice: PracticeDto;
    finalEvaluation: string | null;
    closed: boolean;
    markedForExport: boolean;
}

interface Props {
    practice: PracticeDto;
    detail: PracticeDetailDto;
    loading: boolean;
    error: string | null;
    attachments: any[];
    onFileUpload: (file: File) => void;
    onDeleteAttachment: (id: number) => void;
    onDownloadAttachment: (id: number, title: string) => void;
}

const formatDate = (value: string | null) => {
    if (!value) return "";
    const d = new Date(value);
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
};

const PracticeDetailView: React.FC<Props> = ({
                                                 practice,
                                                 detail,
                                                 loading,
                                                 error,
                                                 attachments,
                                                 onFileUpload,
                                                 onDeleteAttachment,
                                                 onDownloadAttachment
                                             }) => {
    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!practice || !detail) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        onFileUpload(file);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-start mb-4">

                <div>
                    <p><strong>Název praxe:</strong> {practice.name}</p>
                    <p><strong>Popis:</strong> {practice.description}</p>
                    <p><strong>Název firmy:</strong> {practice.companyName}</p>
                    <p>
                        <strong>Trvání:</strong>{" "}
                        {formatDate(practice.validFrom)} – {formatDate(practice.validTo)}
                    </p>
                    <p>
                        <strong>Hodnocení praxe:</strong>{" "}
                        {detail.finalEvaluation ? detail.finalEvaluation : "—"}
                    </p>
                    <p>
                        <strong>Stav:</strong>{" "}
                        {detail.closed ? "Uzavřená" : "Otevřená"}
                    </p>
                </div>

                <div className="text-end">
                    <input
                        type="file"
                        id="uploadInput"
                        className="d-none"
                        accept=".doc,.docx,.pdf,.txt,.jpg,.png"
                        onChange={handleFileChange}
                    />

                    <Button
                        variant="success"
                        onClick={() => document.getElementById("uploadInput")?.click()}
                    >
                        Přidat soubory
                    </Button>

                    {attachments.length > 0 && (
                        <div className="mt-3">
                            <h5>Nahrané soubory:</h5>
                            <ul className="list-unstyled">
                                {attachments.map(a => (
                                    <li
                                        key={a.id}
                                        className="d-flex justify-content-between align-items-center border-bottom py-1"
                                    >
                                        <span className="me-3">{a.title}</span>

                                        <div className="d-flex align-items-center" style={{ gap: "8px" }}>
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => onDownloadAttachment(a.id, a.title)}
                                            >
                                                ⬇
                                            </button>

                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => onDeleteAttachment(a.id)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </li>

                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PracticeDetailView;
