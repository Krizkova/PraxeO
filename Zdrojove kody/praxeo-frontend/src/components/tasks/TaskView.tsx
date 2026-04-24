import React, { useEffect, useState } from "react";
import { CheckSquare, Plus, CircleAlert } from "lucide-react";
import TaskList from "./TaskList";
import TaskModal from "./TaskModal";
import type { Task, TaskFormData } from "../../api/tasksApi";

interface Props {
    tasks: Task[];
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    onCreate: (data: TaskFormData) => void;
    onUpdate: (id: number, data: TaskFormData) => void;
    onDelete: (id: number) => void;
    allowCreate: boolean;
    error: string | null;
}

const TaskView: React.FC<Props> = ({
                                       tasks,
                                       show,
                                       setShow,
                                       onCreate,
                                       onUpdate,
                                       onDelete,
                                       allowCreate,
                                       error,
                                   }) => {
    // Stav formuláře
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [linkItems, setLinkItems] = useState<string[]>([""]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [expectedEndDate, setExpectedEndDate] = useState("");
    const [reportFlag, setReportFlag] = useState(false);
    const [finalEvaluation, setFinalEvaluation] = useState("");
    const [showErrors, setShowErrors] = useState(false);

    // Odkazy
    const addLink = () => setLinkItems((prev) => [...prev, ""]);
    const updateLink = (index: number, value: string) =>
        setLinkItems((prev) => prev.map((item, i) => (i === index ? value : item)));
    const removeLink = (index: number) =>
        setLinkItems((prev) => prev.filter((_, i) => i !== index));

    // Limity pro datum
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() - 1);

    const maxDate = new Date(today);
    maxDate.setFullYear(today.getFullYear() + 5);

    const toDateInputValue = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const minDateValue = toDateInputValue(minDate);
    const maxDateValue = toDateInputValue(maxDate);

    // Validace
    const dateOutOfRange =
        !!expectedEndDate &&
        (expectedEndDate < minDateValue || expectedEndDate > maxDateValue);
    const dateInvalid = showErrors && dateOutOfRange;
    const canSubmit =
        !!title.trim() && !!description.trim() && !dateOutOfRange;

    // Editace tasku
    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setTitle(task.title || "");
        setDescription(task.description || "");
        setLinkItems(task.links?.length ? task.links : [""]);
        setSelectedFiles(task.files?.map((name) => ({ name } as File)) || []);
        setExpectedEndDate(task.expectedEndDate ? task.expectedEndDate.split("T")[0] : "");
        setReportFlag(!!task.reportFlag);
        setFinalEvaluation(task.finalEvaluation || "");
        setShowErrors(false);
        setShow(true);
    };

    // Reset formuláře
    const resetForm = () => {
        setEditingTask(null);
        setTitle("");
        setDescription("");
        setLinkItems([""]);
        setSelectedFiles([]);
        setExpectedEndDate("");
        setReportFlag(false);
        setFinalEvaluation("");
        setShowErrors(false);
        setShow(false);
    };

    // Reset při zavření modalu
    useEffect(() => {
        if (!show) {
            setEditingTask(null);
            setTitle("");
            setDescription("");
            setLinkItems([""]);
            setSelectedFiles([]);
            setExpectedEndDate("");
            setReportFlag(false);
            setFinalEvaluation("");
            setShowErrors(false);
        }
    }, [show]);

    // Soubory
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFiles((prev) => [...prev, file]);
    };

    const removeFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    // Uložení
    const handleSubmit = () => {
        setShowErrors(true);
        if (!canSubmit) return;

        const data: TaskFormData = {
            title,
            description,
            links: linkItems.map((link) => link.trim()).filter((link) => link !== ""),
            files: selectedFiles.map((file) => file.name),
            expectedEndDate: expectedEndDate === "" ? null : expectedEndDate,
            reportFlag,
            finalEvaluation:
                editingTask && finalEvaluation.trim() ? finalEvaluation : undefined,
        };

        if (editingTask) {
            onUpdate(editingTask.id, data);
            resetForm();
        } else {
            onCreate(data);
            resetForm();
        }
    };

    const iconBoxStyle: React.CSSProperties = {
        width: 24,
        height: 24,
        background: "#D6EDDF",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    };

    return (
        <div style={{ marginTop: 28 }}>
            {/* Záhlaví sekce */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 16,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={iconBoxStyle}>
                        <CheckSquare size={14} color="#1F8A4D" strokeWidth={2.2} />
                    </div>
                    <span
                        style={{
                            fontWeight: 700,
                            fontSize: 16,
                            color: "#1a3d1a",
                        }}
                    >
                        Tasky
                    </span>

                    {tasks.length > 0 && (
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
                            {tasks.length}
                        </span>
                    )}
                </div>

                {allowCreate && (
                    <button
                        onClick={() => {
                            resetForm();
                            setShow(true);
                        }}
                        style={{
                            background: "none",
                            border: "1.5px solid #2d7a2d",
                            color: "#2d7a2d",
                            borderRadius: 8,
                            padding: "6px 14px",
                            fontSize: 13,
                            cursor: "pointer",
                            fontWeight: 500,
                            fontFamily: "inherit",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#2d7a2d";
                            e.currentTarget.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "none";
                            e.currentTarget.style.color = "#2d7a2d";
                        }}
                    >
                        <Plus size={14} strokeWidth={2.5} />
                        Přidat task
                    </button>
                )}
            </div>

            {/* Error zpráva */}
            {error && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        background: "#FFF4F4",
                        border: "1px solid #F1C7C7",
                        borderRadius: 12,
                        padding: "12px 14px",
                        marginBottom: 14,
                        color: "#C75B5B",
                        fontSize: 13,
                    }}
                >
                    <CircleAlert size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>{error}</span>
                </div>
            )}

            {/* Seznam tasků */}
            <TaskList
                tasks={tasks}
                allowCreate={allowCreate}
                onEdit={handleEdit}
                onDelete={onDelete}
            />

            {/* Modal */}
            <TaskModal
                show={show}
                editingTask={editingTask}
                title={title}
                description={description}
                linkItems={linkItems}
                selectedFiles={selectedFiles}
                expectedEndDate={expectedEndDate}
                reportFlag={reportFlag}
                finalEvaluation={finalEvaluation}
                minDateValue={minDateValue}
                maxDateValue={maxDateValue}
                dateInvalid={dateInvalid}
                setTitle={setTitle}
                setDescription={setDescription}
                setExpectedEndDate={setExpectedEndDate}
                setReportFlag={setReportFlag}
                setFinalEvaluation={setFinalEvaluation}
                addLink={addLink}
                updateLink={updateLink}
                removeLink={removeLink}
                handleFileChange={handleFileChange}
                removeFile={removeFile}
                handleSubmit={handleSubmit}
                resetForm={resetForm}
            />
        </div>
    );
};

export default TaskView;