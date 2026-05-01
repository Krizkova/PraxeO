import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    getTasks,
    createTask,
    deleteTask,
    updateTask,
} from "../../api/tasksApi";
import type { Task as TaskType, TaskFormData } from "../../api/tasksApi";
import TaskView from "./TaskView";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import { getCookie } from "../../utils/forms/cookies";

interface Props {
    practiceId: number;
    allowCreate: boolean;
    refreshKey: number;
}

const Task: React.FC<Props> = ({ practiceId, allowCreate, refreshKey }) => {
    const [tasks, setTasks] = useState<TaskType[]>([]);
    const [show, setShow] = useState(false);

    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const [confirmDeleteTitle, setConfirmDeleteTitle] = useState<string>("");

    const currentUserEmail = getCookie("userEmail") || "";

    useEffect(() => {
        getTasks(practiceId).then((res) => setTasks(res || []));
    }, [practiceId, refreshKey]);

    const showError = (err: unknown) => {
        const message = axios.isAxiosError(err)
            ? err.response?.data?.message || err.message
            : err instanceof Error
                ? err.message
                : "Nastala neočekávaná chyba.";

        alert("Chyba: " + message);
    };

    const handleCreate = async (data: TaskFormData) => {
        try {
            const res = await createTask(practiceId, data);
            setTasks((prev) => [...prev, res]);
            setShow(false);
            return res;
        } catch (err) {
            showError(err);
            throw err;
        }
    };

    const handleUpdate = async (id: number, data: TaskFormData) => {
        try {
            const res = await updateTask(id, data);
            setTasks((prev) => prev.map((t) => (t.id === id ? res : t)));
            setShow(false);
            return res;
        } catch (err) {
            showError(err);
            throw err;
        }
    };

    const handleDeleteRequest = (id: number) => {
        const task = tasks.find((t) => t.id === id);
        setConfirmDeleteId(id);
        setConfirmDeleteTitle(task?.title || "");
    };

    const handleConfirmDelete = () => {
        if (confirmDeleteId === null) return;

        deleteTask(confirmDeleteId)
            .then(() => {
                setTasks((prev) => prev.filter((t) => t.id !== confirmDeleteId));
            })
            .catch(showError)
            .finally(() => {
                setConfirmDeleteId(null);
                setConfirmDeleteTitle("");
            });
    };

    const refreshTasks = () => {
        getTasks(practiceId).then((res) => setTasks(res || []));
    };

    return (
        <>
            {confirmDeleteId !== null && (
                <ConfirmDeleteDialog
                    title="Smazat task?"
                    fileName={confirmDeleteTitle}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => {
                        setConfirmDeleteId(null);
                        setConfirmDeleteTitle("");
                    }}
                />
            )}

            <TaskView
                practiceId={practiceId}
                tasks={tasks}
                show={show}
                setShow={setShow}
                onCreate={handleCreate}
                onUpdate={handleUpdate}
                onDelete={handleDeleteRequest}
                onRefresh={refreshTasks}
                allowCreate={allowCreate}
                currentUserEmail={currentUserEmail}
                error={null}
            />
        </>
    );
};

export default Task;