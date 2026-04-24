import React from "react";
import { UserPlus } from "lucide-react";
import RegisterUser from "../../components/register/RegisterUser";
import { useNavigate } from "react-router-dom";
import LayoutPage from "../../pages/layouts/LayoutPage";
import HeaderPage from "../../pages/common/HeaderPage";
import IconBadgePage from "../../pages/common/IconBadgePage";

const RegisterStudentPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <LayoutPage>
            <HeaderPage
                icon={
                    <IconBadgePage>
                        <UserPlus size={22} color="white" strokeWidth={1.8} />
                    </IconBadgePage>
                }
                title="Registrace"
                /* Akční tlačítko zůstává funkčně stejné jako původně */
                action={
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: "none",
                            border: "1.5px solid #2d7a2d",
                            color: "#2d7a2d",
                            borderRadius: 8,
                            padding: "7px 18px",
                            fontSize: 14,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            fontWeight: 500,
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = "#2d7a2d";
                            e.currentTarget.style.color = "white";
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = "none";
                            e.currentTarget.style.color = "#2d7a2d";
                        }}
                    >
                        ← Zpět
                    </button>
                }
            />

            {/* Obsah stránky zůstává beze změny: formulář registrace studenta */}
            <div style={{ padding: "40px 32px" }}>
                <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                    <RegisterUser role="STUDENT" isAdminOrTeacher={false} />
                </div>
            </div>
        </LayoutPage>
    );
};

export default RegisterStudentPage;