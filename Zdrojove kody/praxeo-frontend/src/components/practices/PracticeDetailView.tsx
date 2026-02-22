import React, { useState, useEffect } from "react";
import { Spinner, Alert, Button, Form } from "react-bootstrap";
import { translatePracticeState } from "../../utils/practiceState";

interface Props {
    practice: any;
    loading: boolean;
    error: string | null;
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
                                                 onChangeState
                                             }) => {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [completedAt, setCompletedAt] = useState<string | null>(null);
    const [studentEvaluation, setStudentEvaluation] = useState("");
    const [finalEvaluation, setFinalEvaluation] = useState("");

    useEffect(() => {
        if (!practice) return;
        setName(practice.name);
        setDescription(practice.description);
        setCompletedAt(practice.completedAt);
        setStudentEvaluation(practice.studentEvaluation || "");
        setFinalEvaluation(practice.finalEvaluation || "");
    }, [practice]);

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    const handleSave = () => {
        const payload: any = {};

        if (canEditFounder) {
            payload.name = name;
            payload.description = description;
            payload.completedAt = completedAt;
        }

        if (canEditFinalEvaluation) {
            payload.finalEvaluation = finalEvaluation;
        }

        if (canEditStudent) {
            payload.studentEvaluation = studentEvaluation;
        }

        onUpdate(payload);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        onFileUpload(file);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-start mb-4">

                <div style={{ width: "60%" }}>
                    {editMode ? (
                        <>
                            {canEditFounder && (
                                <>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Název</Form.Label>
                                        <Form.Control value={name} onChange={e => setName(e.target.value)} />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Popis</Form.Label>
                                        <Form.Control as="textarea" rows={4} value={description} onChange={e => setDescription(e.target.value)} />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Datum dokončení</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={completedAt ? completedAt.substring(0, 10) : ""}
                                            onChange={e => setCompletedAt(e.target.value)}
                                        />
                                    </Form.Group>
                                </>
                            )}

                            {canEditFinalEvaluation && (
                                <Form.Group className="mb-3">
                                    <Form.Label>Finální hodnocení</Form.Label>
                                    <Form.Control as="textarea" rows={5} value={finalEvaluation} onChange={e => setFinalEvaluation(e.target.value)} />
                                </Form.Group>
                            )}

                            {canEditStudent && (
                                <Form.Group className="mb-3">
                                    <Form.Label>Moje hodnocení</Form.Label>
                                    <Form.Control as="textarea" rows={4} value={studentEvaluation} onChange={e => setStudentEvaluation(e.target.value)} />
                                </Form.Group>
                            )}

                            <Button variant="success" onClick={handleSave}>
                                Uložit
                            </Button>
                        </>
                    ) : (
                        <>
                            <p><strong>Název:</strong> {practice.name}</p>
                            <p><strong>Popis:</strong> {practice.description}</p>
                            <p><strong>Zakladatel:</strong> {practice.founderEmail ?? "—"}</p>
                            <p><strong>Student:</strong> {practice.studentEmail ?? "—"}</p>
                            <p><strong>Vytvořeno:</strong> {formatDate(practice.createdAt)}</p>
                            <p><strong>Vybráno:</strong> {formatDate(practice.selectedAt)}</p>
                            <p><strong>Datum dokončení:</strong> {formatDate(practice.completedAt)}</p>
                            <p><strong>Stav:</strong> {translatePracticeState(practice.state)}</p>
                            <p><strong>Finální hodnocení:</strong> {practice.finalEvaluation ?? "—"}</p>
                            <p><strong>Hodnocení studenta:</strong> {practice.studentEvaluation ?? "—"}</p>

                            {canEdit && (
                                <Button variant="outline-success" className="mt-2 me-2" onClick={() => setEditMode(true)}>
                                    Upravit
                                </Button>
                            )}

                            {canChangeState && (
                                <div className="mt-3">
                                    <Button variant="danger" className="me-2" onClick={() => onChangeState("CANCELED")}>
                                        Zrušit praxi
                                    </Button>
                                    <Button variant="success" onClick={() => onChangeState("COMPLETED")}>
                                        Praxe dokončena
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div style={{ width: "35%" }}>

                    {canUpload && !practice.closed && (
                        <>
                            <input type="file" id="uploadInput" className="d-none" onChange={handleFileChange} />
                            <Button variant="success" className="mb-3" onClick={() => document.getElementById("uploadInput")?.click()}>
                                Přidat soubor
                            </Button>
                        </>
                    )}

                    {attachments.length > 0 && (
                        <div>
                            {attachments.map(a => (
                                <div key={a.id} className="d-flex justify-content-between align-items-center border-bottom py-2">
                                    <span>{a.title}</span>
                                    <div>
                                        <Button size="sm" variant="outline-primary" className="me-2"
                                                onClick={() => onDownloadAttachment(a.id, a.title)}>
                                            ↓
                                        </Button>
                                        {!practice.closed && (
                                            <Button size="sm" variant="outline-danger"
                                                    onClick={() => onDeleteAttachment(a.id)}>
                                                ×
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default PracticeDetailView;