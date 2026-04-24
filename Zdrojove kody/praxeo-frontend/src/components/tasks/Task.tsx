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

    const handleCreate = (data: TaskFormData) => {
        createTask(practiceId, data)
            .then((res) => {
                setTasks((prev) => [...prev, res]);
                setShow(false);
            })
            .catch(showError);
    };

    const handleDelete = (id: number) => {
        deleteTask(id)
            .then(() => {
                setTasks((prev) => prev.filter((t) => t.id !== id));
            })
            .catch(showError);
    };

    const handleUpdate = (id: number, data: TaskFormData) => {
        updateTask(id, data)
            .then((res) => {
                setTasks((prev) => prev.map((t) => (t.id === id ? res : t)));
                setShow(false);
            })
            .catch(showError);
    };

    return (
        <TaskView
            tasks={tasks}
            show={show}
            setShow={setShow}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            allowCreate={allowCreate}
            error={null}
        />
    );
};

export default Task;