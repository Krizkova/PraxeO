import React,{useState} from "react"
import {Button,Modal,Form} from "react-bootstrap"

interface Props{
    tasks:any[]
    show:boolean
    setShow:(v:boolean)=>void
    onCreate:(data:any)=>void
    onDelete:(id:number)=>void
    allowCreate:boolean
}

const TaskView:React.FC<Props>=({tasks,show,setShow,onCreate,onDelete, allowCreate})=>{

    const [title,setTitle]=useState("")
    const [description,setDescription]=useState("")

    const handleSubmit=()=>{
        onCreate({title,description})
        setTitle("")
        setDescription("")
    }

    return(

        <div className="mt-4">

            {allowCreate && (
                <Button
                    variant="outline-primary"
                    className="mb-3"
                    onClick={()=>setShow(true)}
                >
                    Přidat task
                </Button>
            )}

            {(tasks || []).map(t => (
                <div key={t.id} className="border rounded p-3 mb-2 d-flex justify-content-between">
                    <div>
                        <strong>{t.title}</strong>
                        <div>{t.description}</div>
                    </div>

                    {allowCreate && (
                        <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={()=>onDelete(t.id)}
                        >
                            ×
                        </Button>
                    )}
                </div>
            ))}

            <Modal show={show} onHide={()=>setShow(false)}>

                <Modal.Header closeButton>
                    <Modal.Title>Nový task</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <Form.Group className="mb-3">
                        <Form.Label>Název</Form.Label>
                        <Form.Control
                            value={title}
                            onChange={e=>setTitle(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Popis</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={description}
                            onChange={e=>setDescription(e.target.value)}
                        />
                    </Form.Group>

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={()=>setShow(false)}>
                        Zrušit
                    </Button>
                    <Button variant="success" onClick={handleSubmit}>
                        Přidat
                    </Button>
                </Modal.Footer>

            </Modal>

        </div>
    )
}

export default TaskView