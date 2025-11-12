import React from "react";
import Header from "../../components/header/Header";
import RegisterStudent from "../../components/register/RegisterStudent";
import { useNavigate } from "react-router-dom";

const RegisterStudentPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <Header />

            <div className="container mt-4">
                <button
                    className="btn btn-outline-success mb-3"
                    onClick={() => navigate(-1)}
                >
                    ← Zpět
                </button>

                <h2 className="mb-4">Registrace studenta</h2>

                <RegisterStudent />
            </div>
        </>
    );
};

export default RegisterStudentPage;
