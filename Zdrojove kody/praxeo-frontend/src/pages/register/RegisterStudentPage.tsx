import React from "react";
import { UserPlus } from "lucide-react";
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
                background: "linear-gradient(135deg, #f8faf8 0%, #eef5ee 100%)",
                minHeight: "calc(100vh - 56px)",
            }}>
                {/* Záhlaví stránky: ikona + název */}
                <div style={{
                    background: "white",
                    borderBottom: "1px solid #e0ede0",
                    boxShadow: "0 2px 8px rgba(34,85,34,0.06)",
                    padding: "20px 32px",
                }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            {/* Ikona registrace studenta */}
                            <div style={{
                                width: 44, height: 44,
                                background: "linear-gradient(135deg, #2d7a2d, #4caf50)",
                                borderRadius: 11,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 4px 12px rgba(45,122,45,0.3)",
                                flexShrink: 0,
                            }}>
                                <UserPlus size={22} color="white" strokeWidth={1.8} />
                            </div>
                            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1a3d1a", letterSpacing: "-0.3px" }}>
                                Registrace
                            </h1>
                        </div>

                        {/* Tlačítko zpět */}
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
                    </div>
                </div>

                {/* Obsah: registrační formulář pro studenta */}
                <div style={{ padding: "40px 32px" }}>
                    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                        <RegisterUser role="STUDENT" isAdminOrTeacher={false} />
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default RegisterStudentPage;