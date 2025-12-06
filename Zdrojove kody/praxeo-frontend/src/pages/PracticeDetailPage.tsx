import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header/Header";
import PracticeDetail from "../components/practices/PracticeDetail";

const PracticeDetailPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <Header />
            <div className="container mt-4">
                <button
                    className="btn btn-outline-success mb-4"
                    onClick={() => navigate(-1)}
                >
                    ← Zpět
                </button>
                <h2 className="mb-4">Detail praxe</h2>
                <PracticeDetail />
            </div>
        </>
    );
};

export default PracticeDetailPage;
