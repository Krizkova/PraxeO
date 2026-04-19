import React from "react";
import { useNavigate } from "react-router-dom";

interface HeaderViewProps {
    email?: string;
    role?: string;
    onLogout?: () => void;
    onAddUser?: () => void;
}

const HeaderView: React.FC<HeaderViewProps> = ({ email, role, onLogout, onAddUser }) => {
    const navigate = useNavigate();
    const canAddUser = role === "ADMIN" || role === "TEACHER";

    const btnOutline: React.CSSProperties = {
        background: "transparent",
        color: "white",
        border: "1px solid rgba(255,255,255,0.5)",
        borderRadius: 8,
        padding: "5px 14px",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
    };

    const btnLight: React.CSSProperties = {
        background: "rgba(255,255,255,0.15)",
        color: "white",
        border: "1px solid rgba(255,255,255,0.3)",
        borderRadius: 8,
        padding: "5px 14px",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
    };

    // Klik na logo: vždy přechod na domovskou stránku
    const handleLogoClick = () => {
        navigate("/");
    };

    return (
        <nav style={{
            background: "#1F8A4D",
            height: 56,
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            justifyContent: "space-between",
        }}>
            {/* Logo: stejný vzhled jako originál, ale s opravou navigace */}
            <button
                onClick={handleLogoClick}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                }}
            >
                <div style={{
                    width: 32,
                    height: 32,
                    background: "rgba(255,255,255,0.15)",
                    borderRadius: 8,
                    border: "1.5px solid rgba(255,255,255,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <rect x="2" y="2" width="6" height="6" rx="1.5" fill="white" />
                        <rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.6" />
                        <rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.6" />
                        <rect x="10" y="10" width="6" height="6" rx="1.5" fill="white" />
                    </svg>
                </div>
                <span style={{ color: "white", fontSize: 18, fontWeight: 500 }}>PraxeO</span>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Ostravská univerzita</span>
            </button>

            {/* Akce: zobrazují se pouze přihlášeným */}
            {email && (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button style={btnOutline} onClick={() => navigate("/summary")}>
                        Přehled praxí
                    </button>
                    {canAddUser && (
                        <button style={btnLight} onClick={onAddUser}>
                            Přidat uživatele
                        </button>
                    )}
                    <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>{email}</span>
                    <button style={btnOutline} onClick={onLogout}>
                        Odhlásit
                    </button>
                </div>
            )}
        </nav>
    );
};

export default HeaderView;