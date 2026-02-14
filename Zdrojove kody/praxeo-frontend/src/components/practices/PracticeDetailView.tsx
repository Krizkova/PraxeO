import React from "react";
import { Spinner, Alert, Button } from "react-bootstrap";
import {translatePracticeState} from "../../utils/practiceState";

interface PracticeDto {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    selectedAt: string | null;
    completedAt: string | null;
    state: string;
    founderEmail: string | null;
    studentEmail: string | null;
    finalEvaluation: string | null;
    closed: boolean;
    markedForExport: boolean;
}

interface Props {
    practice: PracticeDto;
    loading: boolean;
    error: string | null;
    attachments: any[];
    onFileUpload: (file: File) => void;
    onDeleteAttachment: (id: number) => void;
    onDownloadAttachment: (id: number, title: string) => void;
}

const formatDate = (value: string | null) => {
    if (!value) return "—";
    const d = new Date(value);
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
};

const PracticeDetailView: React.FC<Props> = ({
                                                 practice,
                                                 loading,
                                                 error,
                                                 attachments,
                                                 onFileUpload,
                                                 onDeleteAttachment,
                                                 onDownloadAttachment
                                             }) => {
    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!practice) return null;

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
                    <p><strong>Zakladatel:</strong> {practice.founderEmail ?? "—"}</p>
                    <p><strong>Student:</strong> {practice.studentEmail ?? "—"}</p>
                    <p><strong>Vytvořeno:</strong> {formatDate(practice.createdAt)}</p>
                    <p><strong>Vybráno:</strong> {formatDate(practice.selectedAt)}</p>
                    <p><strong>Ukončeno:</strong> {formatDate(practice.completedAt)}</p>
                    <p><strong>Stav:</strong> {translatePracticeState(practice.state)}</p>
                    <p><strong>Hodnocení:</strong> {practice.finalEvaluation ?? "—"}</p>
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
                        Přidat soubor
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
