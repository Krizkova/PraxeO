import React, { useEffect, useState } from "react"
import { getTasks, createTask, deleteTask } from "../../api/tasksApi"
import TaskView from "./TaskView"

interface Props {
    practiceId: number,
    allowCreate: boolean
}

const Task: React.FC<Props> = ({ practiceId, allowCreate }) => {

    const [tasks, setTasks] = useState<any[]>([])
    const [show, setShow] = useState(false)

    useEffect(() => {
        getTasks(practiceId)
            .then(res => setTasks(res || []))
    }, [practiceId])

    const handleCreate = (data: any) => {
        createTask(practiceId, data)
            .then(res => {
                setTasks(prev => [...prev, res])
                setShow(false)
            })
            .catch((err: any) => {
                alert("Chyba: " + (err.response?.data?.message || "Nastala neočekávaná chyba."));
            })
    }

    const handleDelete = (id: number) => {
        deleteTask(id)
            .then(() => {
                setTasks(prev => prev.filter(t => t.id !== id))
            })
            .catch((err: any) => {
                alert("Chyba: " + (err.response?.data?.message || "Nastala neočekávaná chyba."));
            })
    }

    return (
        <TaskView
            tasks={tasks}
            show={show}
            setShow={setShow}
            onCreate={handleCreate}
            onDelete={handleDelete}
            allowCreate={allowCreate}
        />
    )
}

export default Task