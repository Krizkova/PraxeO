import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import RegisterUser from "../../components/register/RegisterUser";
import { getCurrentUser } from "../../api/userApi";
import Footer from "../../components/footer/Footer";

interface UserResponse {
    id: number;
    email: string;
    role?: string | null;
    firstName?: string | null;
    lastName?: string | null;
}

const RegisterUserPage: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const u = await getCurrentUser();
                if (!mounted) return;
                const role = (u.role || "").toUpperCase();
                if (role !== "ADMIN" && role !== "TEACHER") {
                    navigate("/", { replace: true });
                    return;
                }
                setUser(u);
            } catch {
                navigate("/", { replace: true });
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [navigate]);

    if (loading || !user) return null;

    const isAdminOrTeacher = ["ADMIN", "TEACHER"].includes((user.role || "").toUpperCase());

    return (
        <>
            <Header />
            <div style={{
                background: "#F0F4F0",
                minHeight: "calc(100vh - 56px)",
                padding: "52px 32px",
            }}>
                <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                    <span
                        onClick={() => navigate(-1)}
                        style={{ fontSize: 13, color: "#1F8A4D", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 24 }}
                    >
                        ← Zpět
                    </span>
                    <RegisterUser isAdminOrTeacher={isAdminOrTeacher} />
                </div>
            </div>
            <Footer />
        </>
    );
};

export default RegisterUserPage;