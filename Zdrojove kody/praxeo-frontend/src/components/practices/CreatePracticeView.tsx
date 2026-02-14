import React from "react";
import { Form, Button, Spinner, Alert } from "react-bootstrap";

interface Props {
    name: string;
    description: string;
    completedAt: string;
    loading: boolean;
    error: string | null;
    onChangeName: (value: string) => void;
    onChangeDescription: (value: string) => void;
    onChangeDate: (value: string) => void;
    onSubmit: () => void;
}

const CreatePracticeView: React.FC<Props> = ({
                                                 name,
                                                 description,
                                                 completedAt,
                                                 loading,
                                                 error,
                                                 onChangeName,
                                                 onChangeDescription,
                                                 onChangeDate,
                                                 onSubmit
                                             }) => {

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    const isValid =
        name.trim() !== "" &&
        description.trim() !== "" &&
        completedAt.trim() !== "";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;
        onSubmit();
    };

    return (
        <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Název</Form.Label>
                <Form.Control
                    required
                    value={name}
                    onChange={(e) => onChangeName(e.target.value)}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Popis</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => onChangeDescription(e.target.value)}
                />
            </Form.Group>

            <Form.Group className="mb-4">
                <Form.Label>Předpokládané datum ukončení</Form.Label>
                <Form.Control
                    type="date"
                    required
                    value={completedAt}
                    onChange={(e) => onChangeDate(e.target.value)}
                />
            </Form.Group>

            <Button
                variant="success"
                type="submit"
                disabled={!isValid}
            >
                Vytvořit praxi
            </Button>
        </Form>
    );
};

export default CreatePracticeView;
