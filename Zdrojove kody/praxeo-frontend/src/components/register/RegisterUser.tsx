import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import RegisterUserView from "./RegisterUserView";
import { registerUser } from "../../api/userApi";

interface Props {
    isAdminOrTeacher: boolean;
    role?: string | null;
}

const RegisterUser: React.FC<Props> = ({ isAdminOrTeacher }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "" });
    const [roleSelect, setRoleSelect] = useState(isAdminOrTeacher ? "TEACHER" : "STUDENT");
    const [sent, setSent] = useState(false);
    const [sentEmail, setSentEmail] = useState("");

    const handleRoleChange = (newRole: string) => setRoleSelect(newRole);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const finalRole = isAdminOrTeacher ? roleSelect : "STUDENT";
        try {
            await registerUser({ email: formData.email, role: finalRole });
            setSentEmail(formData.email);
            setSent(true);
        } catch (err: any) {
            alert("Registrace se nezdařila: " + err.message);
        }
    };

    if (sent) {
        return (
            <div style={{
                background: "white", borderRadius: 18, border: "0.5px solid #D9E2D9",
                padding: 36, textAlign: "center", maxWidth: isAdminOrTeacher ? "100%" : 420, margin: "0 auto"
            }}>
                <div style={{
                    width: 64, height: 64, background: "#D6EDDF", borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px"
                }}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <rect x="4" y="8" width="20" height="14" rx="2" stroke="#1F8A4D" strokeWidth="1.8"/>
                        <polyline points="4,8 14,17 24,8" stroke="#1F8A4D" strokeWidth="1.8" strokeLinejoin="round"/>
                    </svg>
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 500, color: "#1E2430", margin: "0 0 10px" }}>
                    {isAdminOrTeacher ? "Pozvánka odeslána" : "Zkontrolujte e-mail"}
                </h2>
                <p style={{ fontSize: 14, color: "#667085", lineHeight: 1.6, margin: "0 0 28px" }}>
                    {isAdminOrTeacher
                        ? <>Odkaz pro dokončení registrace byl odeslán na <strong style={{ color: "#1E2430" }}>{sentEmail}</strong></>
                        : <>Poslali jsme instrukce na <strong style={{ color: "#1E2430" }}>{sentEmail}</strong></>
                    }
                </p>
                {isAdminOrTeacher ? (
                    <div style={{ display: "flex", gap: 12 }}>
                        <button
                            onClick={() => { setSent(false); setFormData({ email: "" }); setSentEmail(""); }}
                            style={{ flex: 1, height: 48, background: "#1F8A4D", color: "white", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 500, cursor: "pointer" }}
                        >
                            Přidat dalšího uživatele
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            style={{ flex: 1, height: 48, background: "white", color: "#1F8A4D", border: "1px solid #D9E2D9", borderRadius: 12, fontSize: 15, fontWeight: 500, cursor: "pointer" }}
                        >
                            Zpět na hlavní stránku
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate("/")}
                        style={{ width: "100%", height: 48, background: "#1F8A4D", color: "white", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 500, cursor: "pointer" }}
                    >
                        Zpět na přihlášení
                    </button>
                )}
            </div>
        );
    }

    return (
        <RegisterUserView
            formData={{ ...formData, role: roleSelect }}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isAdminOrTeacher={isAdminOrTeacher}
            roleSelect={roleSelect}
            onRoleChange={handleRoleChange}
        />
    );
};

export default RegisterUser;