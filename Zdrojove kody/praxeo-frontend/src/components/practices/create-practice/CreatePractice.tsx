import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPractice } from "../../../api/practicesApi";
import CreatePracticeView from "./CreatePracticeView";

const CreatePractice: React.FC = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [completedAt, setCompletedAt] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    // Vrátí zprávu z API nebo obecnou chybu
    const getErrorMessage = (err: unknown) => {
        if (
            err &&
            typeof err === "object" &&
            "response" in err &&
            err.response &&
            typeof err.response === "object" &&
            "data" in err.response &&
            err.response.data &&
            typeof err.response.data === "object" &&
            "message" in err.response.data &&
            typeof err.response.data.message === "string"
        ) {
            return err.response.data.message;
        }

        return "Nepodařilo se vytvořit praxi.";
    };

    // Odeslání formuláře pro vytvoření nové praxe
    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError(null);

            const created = await createPractice({
                name,
                description,
                completedAt,
            });

            navigate(`/practices/${created.id}`);
        } catch (err: unknown) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <CreatePracticeView
            name={name}
            description={description}
            completedAt={completedAt}
            loading={loading}
            error={error}
            onChangeName={setName}
            onChangeDescription={setDescription}
            onChangeDate={setCompletedAt}
            onSubmit={handleSubmit}
        />
    );
};

export default CreatePractice;