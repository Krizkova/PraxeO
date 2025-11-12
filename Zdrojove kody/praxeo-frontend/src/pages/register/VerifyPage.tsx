import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import PasswordReset from "../../components/register/PasswordReset";

const VerifyPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <Header />
            <div className="container mt-5" style={{ maxWidth: 600 }}>
                <button
                    className="btn btn-outline-success mb-4"
                    onClick={() => navigate("/", { replace: true })}
                >
                    ← Zpět
                </button>

                <h3 className="mb-3">Dokončení registrace</h3>
                <p className="text-muted mb-4">
                    Zadejte své nové heslo pro dokončení registrace do systému{" "}
                    <strong>PraxeO</strong>.
                </p>

                <PasswordReset />
            </div>
        </>
    );
};


export default VerifyPage;
