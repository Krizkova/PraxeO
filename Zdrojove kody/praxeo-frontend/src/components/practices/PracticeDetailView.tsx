import React, { useState, useEffect } from "react";
import { Spinner, Alert, Button, Form } from "react-bootstrap";
import { translatePracticeState } from "../../utils/practiceState";
import Task from "../tasks/Task";


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
    onAssignStudent: (assign: boolean) => void;
    onChangeStudentState: (state: "ACTIVE" | "SUBMITTED") => void;
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
                                                 onChangeState,
                                                 onAssignStudent,
                                                 onChangeStudentState
                                             }) => {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [completedAt, setCompletedAt] = useState<string | null>(null);
    const [studentEvaluation, setStudentEvaluation] = useState("");
    const [finalEvaluation, setFinalEvaluation] = useState("");
    const [founderEmail, setFounderEmail] = useState("");
    const [studentEmail, setStudentEmail] = useState("");
    const [state, setState] = useState("");

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

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    const handleSave = () => {
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
        if (!file) return;
        onFileUpload(file);
    };

    const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift();
    };
    const role = getCookie("userRole");

    return (
        <div>
            <div className="d-flex justify-content-between align-items-start mb-4">

                <div style={{ width: "60%" }}>
                    {editMode ? (
                        <>
                            {(canEditFounder  || role === "ADMIN") &&(
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

                            {(canEditFinalEvaluation || role === "ADMIN") && (
                                <Form.Group className="mb-3">
                                    <Form.Label>Finální hodnocení</Form.Label>
                                    <Form.Control as="textarea" rows={5} value={finalEvaluation} onChange={e => setFinalEvaluation(e.target.value)} />
                                </Form.Group>
                            )}

                            {(canEditStudent || role === "ADMIN") && (
                                <Form.Group className="mb-3">
                                    <Form.Label>Moje hodnocení</Form.Label>
                                    <Form.Control as="textarea" rows={4} value={studentEvaluation} onChange={e => setStudentEvaluation(e.target.value)} />
                                </Form.Group>
                            )}

                            {role === "ADMIN" && (
                                <>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Zakladatel praxe</Form.Label>
                                        <Form.Control
                                            value={founderEmail}
                                            onChange={e => setFounderEmail(e.target.value)}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Student praxe</Form.Label>
                                        <Form.Control
                                            value={studentEmail}
                                            onChange={e => setStudentEmail(e.target.value)}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Stav praxe</Form.Label>
                                        <Form.Select
                                            value={state}
                                            onChange={e => setState(e.target.value)}
                                        >
                                            <option value="NEW">{translatePracticeState("NEW")}</option>
                                            <option value="ACTIVE">{translatePracticeState("ACTIVE")}</option>
                                            <option value="SUBMITTED">{translatePracticeState("SUBMITTED")}</option>
                                            <option value="CANCELED">{translatePracticeState("CANCELED")}</option>
                                            <option value="COMPLETED">{translatePracticeState("COMPLETED")}</option>
                                        </Form.Select>
                                    </Form.Group>
                                </>
                            )}

                            <Button variant="success" onClick={handleSave}>
                                Uložit
                            </Button>
                        </>
                    ) : (
                        <>
                            <div className="d-flex mb-3">

                                {role === "STUDENT" &&
                                    !practice.studentEmail &&
                                    practice.state === "NEW" && (
                                        <Button
                                            variant="primary"
                                            className="me-2"
                                            onClick={() => onAssignStudent(true)}
                                        >
                                            Přihlásit se k praxi
                                        </Button>
                                    )}

                                {canEditStudent && practice.state === "ACTIVE" && (
                                    <>
                                        <Button
                                            variant="warning"
                                            className="me-2"
                                            onClick={() => onAssignStudent(false)}
                                        >
                                            Odhlásit se z praxe
                                        </Button>

                                        <Button
                                            variant="success"
                                            className="me-2"
                                            disabled={!practice.studentEvaluation || practice.studentEvaluation.trim() === ""}
                                            onClick={() => onChangeStudentState("SUBMITTED")}
                                        >
                                            Odevzdat praxi
                                        </Button>
                                    </>
                                )}

                                {role === "STUDENT" &&
                                    practice.state === "SUBMITTED" &&
                                    (!practice.finalEvaluation || practice.finalEvaluation.trim() === "") && (
                                        <Button
                                            variant="secondary"
                                            className="me-2"
                                            disabled={practice.finalEvaluation && practice.finalEvaluation.trim() !== ""}
                                            onClick={() => onChangeStudentState("ACTIVE")}
                                        >
                                            Vrátit do aktivního stavu
                                        </Button>
                                    )}

                            </div>



                            {(canEditFounder || role === "ADMIN") && practice.state !== "SUBMITTED" && (
                                <div className="mb-2">
                                    <span
                                        style={{ cursor: "pointer", fontSize: "1.5rem" }}
                                        onClick={() => setEditMode(true)}
                                        title="Upravit praxi"
                                    >
                                        ✏️
                                    </span>
                                </div>
                            )}

                            <p><strong>Název:</strong> {practice.name}</p>
                            <p><strong>Popis:</strong> {practice.description}</p>
                            <p><strong>Zakladatel:</strong> {practice.founderEmail ?? "—"}</p>
                            <p><strong>Student:</strong> {practice.studentEmail ?? "—"}</p>
                            <p><strong>Vytvořeno:</strong> {formatDate(practice.createdAt)}</p>
                            <p><strong>Vybráno:</strong> {formatDate(practice.selectedAt)}</p>
                            <p><strong>Datum dokončení:</strong> {formatDate(practice.completedAt)}</p>
                            <p><strong>Stav:</strong> {translatePracticeState(practice.state)}</p>
                            <p>
                                <strong>Finální hodnocení:</strong> {practice.finalEvaluation ?? "—"}
                                {(canEditFinalEvaluation || role === "ADMIN") && (
                                    <span
                                        style={{ cursor: "pointer", marginLeft: "8px" }}
                                        onClick={() => setEditMode(true)}
                                        title={practice.finalEvaluation ? "Upravit" : "Přidat hodnocení"}
                                    >
                                        ✏️
                                    </span>
                                )}
                            </p>
                            <p>
                                <strong>Hodnocení studenta:</strong> {practice.studentEvaluation ?? "—"}
                                {(canEditStudent || role === "ADMIN") && (
                                    <span
                                        style={{ cursor: "pointer", marginLeft: "8px" }}
                                        onClick={() => setEditMode(true)}
                                        title={practice.studentEvaluation ? "Upravit" : "Přidat hodnocení"}
                                    >
                                        ✏️
                                    </span>
                                )}
                            </p>


                            <div className="mt-3">
                                <Task
                                    practiceId={practice.id}
                                    allowCreate={practice.state === "NEW" || practice.state === "ACTIVE"}
                                />
                            </div>

                            {canChangeState && (
                                <div className="mt-3">
                                    <Button
                                        variant="danger"
                                        className="me-2"
                                        onClick={() => onChangeState("CANCELED")}
                                    >
                                        Zrušit praxi
                                    </Button>

                                    <Button
                                        variant="success"
                                        disabled={!practice.finalEvaluation || practice.finalEvaluation.trim() === ""}
                                        onClick={() => onChangeState("COMPLETED")}
                                    >
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