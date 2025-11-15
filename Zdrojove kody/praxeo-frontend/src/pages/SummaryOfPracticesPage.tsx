import React from "react";
import SummaryOfPractices from "../components/mainPages/SummaryOfPractices";
import {useNavigate} from "react-router-dom";
import Header from "../components/header/Header";

const SummaryOfPracticesPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <Header />
            <div className="container mt-4">
                <button
                    className="btn btn-outline-success mb-4"
                    onClick={() => navigate("/", { replace: true })}
                >
                    ← Zpět
                </button>
                <h2 className="mb-4">Přehled praxí</h2>
                <SummaryOfPractices />
            </div>
        </>
    );
};

export default SummaryOfPracticesPage;
