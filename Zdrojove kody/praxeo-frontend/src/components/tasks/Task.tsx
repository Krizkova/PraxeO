import React, { useEffect, useState } from "react";
import { getTasks, createTask, deleteTask, updateTask } from "../../api/tasksApi";
import TaskView from "./TaskView";

interface Props {
    practiceId: number;
    allowCreate: boolean;
}

const Task: React.FC<Props> = ({ practiceId, allowCreate }) => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [show, setShow] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Načtení tasků pro konkrétní praxi
    useEffect(() => {
        setError(null);

        getTasks(practiceId)
            .then((res) => setTasks(res || []))
            .catch((err: any) => {
                setError(
                    err?.response?.data?.message || "Nepodařilo se načíst tasky."
                );
            });
    }, [practiceId]);

    const handleCreate = (data: any) => {
        setError(null);

        createTask(practiceId, data)
            .then((res) => {
                setTasks((prev) => [...prev, res]);
                setShow(false);
            })
            .catch((err: any) => {
                setError(
                    err?.response?.data?.message || "Nepodařilo se vytvořit task."
                );
            });
    };

    const handleDelete = (id: number) => {
        setError(null);

        deleteTask(id)
            .then(() => {
                setTasks((prev) => prev.filter((t) => t.id !== id));
            })
            .catch((err: any) => {
                setError(
                    err?.response?.data?.message || "Nepodařilo se smazat task."
                );
            });
    };

    // Aktualizace existujícího tasku
    const handleUpdate = (id: number, data: any) => {
        setError(null);

        updateTask(id, data)
            .then((res) => {
                setTasks((prev) => prev.map((t) => t.id === id ? res : t));
                setShow(false);
            })
            .catch((err: any) => {
                setError(
                    err?.response?.data?.message || "Nepodařilo se upravit task."
                );
            });
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
            error={error}
        />
    );
};

export default Task;