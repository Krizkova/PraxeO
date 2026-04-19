import React, { useState } from "react"
import { Button, Modal, Form } from "react-bootstrap"

interface Props {
    tasks: any[]
    show: boolean
    setShow: (v: boolean) => void
    onCreate: (data: any) => void
    onUpdate: (id: number, data: any) => void
    onDelete: (id: number) => void
    allowCreate: boolean
}

const formatDate = (value: string | null) => {
    if (!value) return "—";
    const d = new Date(value);
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
};

const TaskView: React.FC<Props> = ({ tasks, show, setShow, onCreate, onUpdate, onDelete, allowCreate }) => {

    const [editingTask, setEditingTask] = useState<any>(null)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [links, setLinks] = useState("") // Čárkou oddělené odkazy
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]) // Pole vybraných souborů
    const [expectedEndDate, setExpectedEndDate] = useState("")
    const [reportFlag, setReportFlag] = useState(false)
    const [finalEvaluation, setFinalEvaluation] = useState("")

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFiles(prev => [...prev, file])
        }
    }

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = () => {
        const data = {
            title,
            description,
            links: links.split(",").map(l => l.trim()).filter(l => l !== ""),
            files: selectedFiles.map(f => f.name),
            expectedEndDate: expectedEndDate === "" ? null : expectedEndDate,
            reportFlag,
            finalEvaluation: editingTask ? finalEvaluation : undefined
        }

        if (editingTask) {
            onUpdate(editingTask.id, data)
        } else {
            onCreate(data)
        }
        resetForm()
    }

    const handleEdit = (task: any) => {
        setEditingTask(task)
        setTitle(task.title)
        setDescription(task.description)
        setLinks(task.links?.join(", ") || "")
        // Note: selectedFiles is File[], but existing files are string[]. 
        // We'll treat them as names for now if we can't reconstruct File objects.
        setSelectedFiles(task.files?.map((name: string) => ({ name })) || [])
        setExpectedEndDate(task.expectedEndDate ? task.expectedEndDate.split("T")[0] : "")
        setReportFlag(task.reportFlag)
        setFinalEvaluation(task.finalEvaluation || "")
        setShow(true)
    }

    const resetForm = () => {
        setEditingTask(null)
        setTitle("")
        setDescription("")
        setLinks("")
        setSelectedFiles([])
        setExpectedEndDate("")
        setReportFlag(false)
        setFinalEvaluation("")
        setShow(false)
    }

    return (
        <div className="mt-4">
            {allowCreate && (
                <Button
                    variant="outline-primary"
                    className="mb-3"
                    onClick={() => setShow(true)}
                >
                    Přidat task
                </Button>
            )}

            {(tasks || []).map(t => (
                <div key={t.id} className="border rounded p-3 mb-3 bg-white">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <h5 className="mb-0">{t.title}</h5>
                            <div className="text-muted small">
                                {t.status === 'COMPLETED' ? (
                                    <span className="badge bg-success me-2">Ukončený</span>
                                ) : (
                                    <span className="badge bg-primary me-2">Aktivní</span>
                                )}
                                {t.reportFlag && <span className="badge bg-info me-2">Reportuje se</span>}
                                <span>Autor: {t.founder?.name || t.founder?.email || "—"}</span>
                                <span className="ms-3">Vytvořeno: {formatDate(t.creationDate)}</span>
                            </div>
                        </div>
                        {allowCreate && (
                            <div className="d-flex gap-2">
                                <span
                                    style={{ cursor: "pointer", fontSize: "1.2rem" }}
                                    onClick={() => handleEdit(t)}
                                    title="Upravit task"
                                >
                                    ✏️
                                </span>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => onDelete(t.id)}
                                >
                                    ×
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="mb-2" style={{ whiteSpace: "pre-wrap" }}>{t.description}</div>

                    <div className="row small">
                        <div className="col-md-6">
                            <strong>Termíny:</strong>
                            <div className="text-danger">Předpoklad: {formatDate(t.expectedEndDate)}</div>
                            {t.actualEndDate && (
                                <div className="text-success">Skutečnost: {formatDate(t.actualEndDate)}</div>
                            )}
                        </div>
                        <div className="col-md-6 text-end">
                            {t.links && t.links.length > 0 && (
                                <div>
                                    <strong>Odkazy:</strong>{" "}
                                    {t.links.map((link: string, i: number) => (
                                        <a key={i} href={link.startsWith('http') ? link : `https://${link}`} target="_blank" rel="noopener noreferrer" className="ms-2">
                                            [{i + 1}]
                                        </a>
                                    ))}
                                </div>
                            )}
                            {t.files && t.files.length > 0 && (
                                <div>
                                    <strong>Soubory:</strong>{" "}
                                    {t.files.map((file: string, i: number) => (
                                        <span key={i} className="badge bg-light text-dark border ms-1">{file}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {t.finalEvaluation && (
                        <div className="mt-3 p-2 bg-light rounded border-start border-4 border-success">
                            <div className="fw-bold small mb-1">Zhodnocení (vložil: {t.evaluationAuthorName || "—"}):</div>
                            <div>{t.finalEvaluation}</div>
                        </div>
                    )}
                </div>
            ))}

            <Modal show={show} onHide={resetForm} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editingTask ? "Upravit task" : "Nový task"}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Název</Form.Label>
                        <Form.Control
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Zadejte název úkolu"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Popis</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Zadejte podrobný popis"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Odkazy (oddělené čárkou)</Form.Label>
                        <Form.Control
                            value={links}
                            onChange={e => setLinks(e.target.value)}
                            placeholder="https://odkaz1.cz, https://odkaz2.cz"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Soubory</Form.Label>
                        <div className="d-flex flex-wrap gap-2 mb-2">
                            {selectedFiles.map((f, idx) => (
                                <div key={idx} className="badge bg-light text-dark border p-2 d-flex align-items-center">
                                    {f.name}
                                    <Button
                                        variant="link"
                                        size="sm"
                                        className="text-danger ms-2 p-0"
                                        onClick={() => removeFile(idx)}
                                    >
                                        ×
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <input
                            type="file"
                            id="taskFileUpload"
                            className="d-none"
                            onChange={handleFileChange}
                        />
                        <Button
                            variant="success"
                            size="sm"
                            onClick={() => document.getElementById("taskFileUpload")?.click()}
                        >
                            Přidat soubor
                        </Button>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Předpokládané datum ukončení</Form.Label>
                        <Form.Control
                            type="date"
                            value={expectedEndDate}
                            onChange={e => setExpectedEndDate(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label='Reportovat'
                            checked={reportFlag}
                            onChange={e => setReportFlag(e.target.checked)}
                        />
                    </Form.Group>

                    {editingTask && (
                        <Form.Group className="mb-3">
                            <Form.Label>Finální hodnocení</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={finalEvaluation}
                                onChange={e => setFinalEvaluation(e.target.value)}
                                placeholder="Zadejte finální hodnocení úkolu"
                            />
                        </Form.Group>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={resetForm}>
                        Zrušit
                    </Button>
                    <Button variant="success" onClick={handleSubmit} disabled={!title}>
                        {editingTask ? "Uložit změny" : "Přidat"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default TaskView