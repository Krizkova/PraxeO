import React from "react";
import RegisterUser from "../../components/register/RegisterUser";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

const RegisterStudentPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <Header />
            <div style={{
                background: "#F0F4F0",
                minHeight: "calc(100vh - 56px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                padding: "52px 24px",
            }}>
                <div style={{ width: "100%", maxWidth: 1000 }}>
                    <span
                        onClick={() => navigate(-1)}
                        style={{
                            fontSize: 13,
                            color: "#1F8A4D",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            marginBottom: 24,
                        }}
                    >
                        ← Zpět
                    </span>
                    <RegisterUser role="STUDENT" isAdminOrTeacher={false} />
                </div>
            </div>
            <Footer />
        </>
    );
};

export default RegisterStudentPage;