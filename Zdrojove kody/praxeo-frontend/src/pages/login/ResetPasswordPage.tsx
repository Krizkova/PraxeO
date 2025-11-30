import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import ResetPassword from "../../components/login/ResetPassword";

const ResetPasswordPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <Header />

            <div className="container mt-4" style={{ maxWidth: 600 }}>
                <button
                    className="btn btn-outline-success mb-3"
                    onClick={() => navigate(-1)}
                >
                    ← Zpět
                </button>

                <h2 className="mb-4">Obnova hesla</h2>

                <ResetPassword />
            </div>
        </>
    );
};

export default ResetPasswordPage;
