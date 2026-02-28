import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import CreatePractice from "../../components/practices/CreatePractice";

const CreatePracticePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <Header />
            <div className="container mt-4">
                <button
                    className="btn btn-outline-success mb-4"
                    onClick={() => navigate("/summary")}
                >
                    ← Zpět
                </button>
                <h2 className="mb-4">Vytvořit praxi</h2>
                <CreatePractice />
            </div>
        </>
    );
};

export default CreatePracticePage;
