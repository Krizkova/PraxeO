import React, {useState} from "react";
import RegisterUser from "../../components/register/RegisterUser";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";

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

                <RegisterUser
                    role="STUDENT"
                    isAdminOrTeacher={false} />
            </div>
        </>
    );
};

export default RegisterStudentPage;
