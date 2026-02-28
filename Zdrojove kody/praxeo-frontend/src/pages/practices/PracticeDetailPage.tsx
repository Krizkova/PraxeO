import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import PracticeDetail from "../../components/practices/PracticeDetail";

const PracticeDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);

    const handleBack = () => {
        if (editMode) {
            setEditMode(false);
        } else {
            navigate("/summary");
        }
    };

    return (
        <>
            <Header />
            <div className="container mt-4">
                <button
                    className="btn btn-outline-success mb-4"
                    onClick={handleBack}
                >
                    ← Zpět
                </button>
                <h2 className="mb-4">Detail praxe</h2>
                <PracticeDetail
                    editMode={editMode}
                    setEditMode={setEditMode}
                />
            </div>
        </>
    );
};

export default PracticeDetailPage;