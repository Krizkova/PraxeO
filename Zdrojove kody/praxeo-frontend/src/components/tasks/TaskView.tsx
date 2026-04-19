import React, { useState } from "react"
import { Button, Modal, Form } from "react-bootstrap"

interface Props {
    tasks: any[]
    show: boolean
    setShow: (v: boolean) => void
    onCreate: (data: any) => void
    onDelete: (id: number) => void
    allowCreate: boolean
}

const TaskView: React.FC<Props> = ({ tasks, show, setShow, onCreate, onDelete, allowCreate }) => {

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [links, setLinks] = useState("") // Čárkou oddělené odkazy
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]) // Pole vybraných souborů
    const [expectedEndDate, setExpectedEndDate] = useState("")
    const [reportFlag, setReportFlag] = useState(false)

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
        onCreate({
            title,
            description,
            // Převod řetězců na pole
            links: links.split(",").map(l => l.trim()).filter(l => l !== ""),
            files: selectedFiles.map(f => f.name), // Posíláme názvy souborů
            expectedEndDate: expectedEndDate === "" ? null : expectedEndDate,
            reportFlag
        })
        resetForm()
    }

    const resetForm = () => {
        setTitle("")
        setDescription("")
        setLinks("")
        setSelectedFiles([])
        setExpectedEndDate("")
        setReportFlag(false)
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
                <div key={t.id} className="border rounded p-3 mb-2 d-flex justify-content-between align-items-center">
                    <div>
                        <strong>{t.title}</strong> {t.reportFlag && <span className="badge bg-info ms-2">Reporting</span>}
                        <div className="text-muted small">{t.description}</div>
                        {t.expectedEndDate && (
                            <div className="small text-danger">Termín: {new Date(t.expectedEndDate).toLocaleDateString()}</div>
                        )}
                    </div>

                    {allowCreate && (
                        <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => onDelete(t.id)}
                        >
                            ×
                        </Button>
                    )}
                </div>
            ))}

            <Modal show={show} onHide={() => setShow(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Nový task</Modal.Title>
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
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Zrušit
                    </Button>
                    <Button variant="success" onClick={handleSubmit} disabled={!title}>
                        Přidat
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default TaskView