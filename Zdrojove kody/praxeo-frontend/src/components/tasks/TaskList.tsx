import React from "react";
import TaskCard from "./TaskCard";
import type { Task } from "../../api/tasksApi";

interface Props {
    tasks: Task[];
    allowCreate: boolean;
    currentUserEmail: string;
    onEdit: (task: Task) => void;
    onDelete: (id: number) => void;
}

const TaskList: React.FC<Props> = ({
                                       tasks,
                                       allowCreate,
                                       currentUserEmail,
                                       onEdit,
                                       onDelete,
                                   }) => {
    // Prázdný stav
    if (tasks.length === 0) {
        return (
            <div
                style={{
                    textAlign: "center",
                    padding: "28px 20px",
                    background: "#f6faf6",
                    borderRadius: 12,
                    border: "1.5px dashed #c8e6c9",
                    color: "#8aaa8a",
                    fontSize: 14,
                }}
            >
                <div
                    style={{
                        fontWeight: 600,
                        marginBottom: 4,
                        color: "#5a7a5a",
                    }}
                >
                    Žádné tasky
                </div>
                <div style={{ fontSize: 13 }}>Přidejte první task.</div>
            </div>
        );
    }

    // Seznam tasků
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    allowCreate={allowCreate}
                    currentUserEmail={currentUserEmail}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default TaskList;