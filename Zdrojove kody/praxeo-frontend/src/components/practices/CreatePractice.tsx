import React, { useState } from "react";
import { createPractice } from "../../api/practicesApi";
import CreatePracticeView from "./CreatePracticeView";
import { useNavigate } from "react-router-dom";

const CreatePractice: React.FC = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [completedAt, setCompletedAt] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const created = await createPractice({
                name,
                description,
                completedAt
            });
            navigate(`/practices/${created.id}`);
        } catch (err: any) {
            alert("Chyba: " + (err.response?.data?.message || "Nastala neočekávaná chyba."));
            setError("Nepodařilo se vytvořit praxi.");
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
