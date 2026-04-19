import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCog } from "lucide-react";
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

// Stránka pro přidání nového uživatele: přístupná pouze pro admina a učitele
const RegisterUserPage: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Ověření, zda má přihlášený uživatel oprávnění přistupovat na tuto stránku
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const u = await getCurrentUser();
                if (!mounted) return;
                const role = (u.role || "").toUpperCase();
                // Přesměrování nepřihlášených nebo neoprávněných uživatelů
                if (role !== "ADMIN" && role !== "TEACHER") {
                    navigate("/", { replace: true });
                    return;
                }
                setUser(u);
            } catch {
                if (mounted) setError(true);
                navigate("/", { replace: true });
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [navigate]);

    // Zobrazení načítání
    if (loading) return (
        <>
            <Header />
            <div style={{
                background: "linear-gradient(135deg, #f8faf8 0%, #eef5ee 100%)",
                minHeight: "calc(100vh - 56px)",
                display: "flex", alignItems: "center", justifyContent: "center",
            }}>
                <div style={{ width: 28, height: 28, border: "2px solid #D6EDDF", borderTopColor: "#2d7a2d", borderRadius: "50%" }} />
            </div>
        </>
    );

    if (!user || error) return null;

    const isAdminOrTeacher = ["ADMIN", "TEACHER"].includes((user.role || "").toUpperCase());

    return (
        <>
            <Header />

            <div style={{
                background: "linear-gradient(135deg, #f8faf8 0%, #eef5ee 100%)",
                minHeight: "calc(100vh - 56px)",
            }}>
                {/* Záhlaví stránky */}
                <div style={{
                    background: "white",
                    borderBottom: "1px solid #e0ede0",
                    boxShadow: "0 2px 8px rgba(34,85,34,0.06)",
                    padding: "20px 32px",
                }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            {/* Ikona správy uživatelů */}
                            <div style={{
                                width: 44, height: 44,
                                background: "linear-gradient(135deg, #2d7a2d, #4caf50)",
                                borderRadius: 11,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 4px 12px rgba(45,122,45,0.3)",
                                flexShrink: 0,
                            }}>
                                <UserCog size={22} color="white" strokeWidth={1.8} />
                            </div>
                            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1a3d1a", letterSpacing: "-0.3px" }}>
                                Přidat uživatele
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

                {/* Obsah: formulář pro přidání uživatele */}
                <div style={{ padding: "40px 32px" }}>
                    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                        <RegisterUser isAdminOrTeacher={isAdminOrTeacher} />
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default RegisterUserPage;