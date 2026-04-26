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

interface Props {
    practiceId: number;
    allowCreate: boolean;
}

const Task: React.FC<Props> = ({ practiceId, allowCreate }) => {
    const [tasks, setTasks] = useState<TaskType[]>([]);
    const [show, setShow] = useState(false);

    useEffect(() => {
        getTasks(practiceId).then((res) => setTasks(res || []));
    }, [practiceId]);

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
            // Refresh tasks to get the ones with updated files after upload completes in TaskView
            // Actually TaskView calls uploadTaskAttachment AFTER onCreate returns.
            // So we need to return the task but might need another refresh.
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

    const handleDelete = (id: number) => {
        deleteTask(id)
            .then(() => {
                setTasks((prev) => prev.filter((t) => t.id !== id));
            })
            .catch(showError);
    };

    const refreshTasks = () => {
        getTasks(practiceId).then((res) => setTasks(res || []));
    };

    return (
        <TaskView
            practiceId={practiceId}
            tasks={tasks}
            show={show}
            setShow={setShow}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onRefresh={refreshTasks}
            allowCreate={allowCreate}
            error={null}
        />
    );
};

export default Task;