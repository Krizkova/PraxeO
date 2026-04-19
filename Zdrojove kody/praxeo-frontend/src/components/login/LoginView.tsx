import React from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, ArrowRight } from "lucide-react";
import { useLogin } from "./useLogin";

const LoginView: React.FC = () => {
    const { email, setEmail, password, setPassword, error, setError, handleLogin } = useLogin();
    const navigate = useNavigate();

    const inputStyle: React.CSSProperties = {
        width: "100%",
        height: 48,
        background: "white",
        border: "1.5px solid #d0e8d0",
        borderRadius: 12,
        padding: "0 14px 0 42px",
        fontSize: 14,
        color: "#1a3d1a",
        outline: "none",
        boxSizing: "border-box",
        transition: "all 0.15s",
        fontFamily: "inherit",
    };

    const labelStyle: React.CSSProperties = {
        fontSize: 12,
        fontWeight: 600,
        color: "#3a5a3a",
        display: "block",
        marginBottom: 6,
    };

    const iconBoxStyle: React.CSSProperties = {
        width: 24,
        height: 24,
        background: "#D6EDDF",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    };

    const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.border = "1.5px solid #2d7a2d";
        e.target.style.boxShadow = "0 0 0 3px rgba(45,122,45,0.1)";
        e.target.style.background = "#fcfffc";
        setError("");
    };

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.border = "1.5px solid #d0e8d0";
        e.target.style.boxShadow = "none";
        e.target.style.background = "white";
    };

    return (
        <div style={{
            background: "white",
            borderRadius: 18,
            border: "1px solid #e0ede0",
            padding: 28,
            width: "100%",
            boxShadow: "0 4px 24px rgba(34,85,34,0.08)",
        }}>
            {/* Nadpis formuláře */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div style={iconBoxStyle}>
                    <LogIn size={14} color="#1F8A4D" strokeWidth={2.2} />
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1a3d1a", margin: 0, letterSpacing: "-0.2px" }}>
                    Přihlášení
                </h2>
            </div>
            <p style={{ fontSize: 13, color: "#6b8f6b", margin: "0 0 24px" }}>
                Přihlaste se do systému PraxeO
            </p>

            <form onSubmit={handleLogin}>
                {/* Pole e-mailu */}
                <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>E-mail</label>
                    <div style={{ position: "relative" }}>
                        <div style={{
                            position: "absolute", left: 12, top: "50%",
                            transform: "translateY(-50%)",
                            color: "#7FA487", pointerEvents: "none",
                            display: "flex", alignItems: "center",
                        }}>
                            <Mail size={15} />
                        </div>
                        <input
                            type="email"
                            style={inputStyle}
                            placeholder="jan.pavel@osu.cz"
                            value={email}
                            onChange={e => { setEmail(e.target.value); setError(""); }}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            required
                        />
                    </div>
                </div>

                {/* Pole hesla */}
                <div style={{ marginBottom: 4 }}>
                    <label style={labelStyle}>Heslo</label>
                    <div style={{ position: "relative" }}>
                        <div style={{
                            position: "absolute", left: 12, top: "50%",
                            transform: "translateY(-50%)",
                            color: "#7FA487", pointerEvents: "none",
                            display: "flex", alignItems: "center",
                        }}>
                            <Lock size={15} />
                        </div>
                        <input
                            type="password"
                            style={inputStyle}
                            placeholder="••••••••"
                            value={password}
                            onChange={e => { setPassword(e.target.value); setError(""); }}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            required
                        />
                    </div>
                </div>

                {/* Chybová zpráva: červený text pod polem hesla */}
                {error && (
                    <p style={{ fontSize: 11, color: "#e24b4a", margin: "6px 0 0", lineHeight: 1.5 }}>
                        {error}
                    </p>
                )}

                {/* Odkaz na obnovu hesla */}
                <div style={{ textAlign: "right", margin: "12px 0 20px" }}>
                    <span
                        onClick={() => navigate("/forgot-password")}
                        style={{ fontSize: 12, color: "#2d7a2d", cursor: "pointer", fontWeight: 500 }}
                    >
                        Zapomenuté heslo?
                    </span>
                </div>

                {/* Tlačítko přihlášení */}
                <button
                    type="submit"
                    style={{
                        width: "100%",
                        height: 48,
                        background: "linear-gradient(135deg, #2d7a2d, #4caf50)",
                        color: "white",
                        border: "none",
                        borderRadius: 12,
                        fontSize: 15,
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: "0 4px 14px rgba(45,122,45,0.3)",
                        transition: "opacity 0.2s, transform 0.15s",
                        marginBottom: 16,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.opacity = "0.9";
                        e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.opacity = "1";
                        e.currentTarget.style.transform = "translateY(0)";
                    }}
                >
                    <LogIn size={16} />
                    Přihlásit se
                </button>

                {/* Odkaz na registraci */}
                <div style={{ textAlign: "center" }}>
                    <span style={{ fontSize: 13, color: "#6b8f6b" }}>Nemáte účet? </span>
                    <span
                        onClick={() => navigate("/registerStudent")}
                        style={{
                            fontSize: 13, color: "#2d7a2d",
                            cursor: "pointer", fontWeight: 600,
                            display: "inline-flex", alignItems: "center", gap: 4,
                        }}
                    >
                        Registrovat se
                        <ArrowRight size={13} />
                    </span>
                </div>
            </form>
        </div>
    );
};

export default LoginView;