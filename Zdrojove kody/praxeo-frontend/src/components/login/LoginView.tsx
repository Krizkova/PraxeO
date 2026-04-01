import React from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "./Login";

const LoginView: React.FC = () => {
    const { email, setEmail, password, setPassword, handleLogin } = useLogin();
    const navigate = useNavigate();

    const s = {
        card: {
            background: "white",
            borderRadius: 18,
            border: "0.5px solid #D9E2D9",
            padding: 32,
            width: "100%",
        } as React.CSSProperties,
        label: {
            fontSize: 12,
            fontWeight: 500,
            color: "#1E2430",
            display: "block",
            marginBottom: 6,
        } as React.CSSProperties,
        input: {
            width: "100%",
            height: 48,
            background: "white",
            border: "1px solid #D9E2D9",
            borderRadius: 12,
            padding: "0 14px",
            fontSize: 14,
            color: "#1E2430",
            outline: "none",
            boxSizing: "border-box",
            transition: "border 0.15s, box-shadow 0.15s",
        } as React.CSSProperties,
        hint: {
            fontSize: 11,
            color: "#A0A9A0",
            marginTop: 5,
        } as React.CSSProperties,
        btnPrimary: {
            width: "100%",
            height: 48,
            background: "#1F8A4D",
            color: "white",
            border: "none",
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 500,
            cursor: "pointer",
            marginBottom: 16,
        } as React.CSSProperties,
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.border = "1px solid #1F8A4D";
        e.target.style.boxShadow = "0 0 0 3px rgba(31,138,77,0.1)";
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.border = "1px solid #D9E2D9";
        e.target.style.boxShadow = "none";
    };

    return (
        <div style={s.card}>
            <h2 style={{ fontSize: 20, fontWeight: 500, color: "#1E2430", margin: "0 0 4px" }}>
                Přihlášení
            </h2>
            <p style={{ fontSize: 13, color: "#667085", margin: "0 0 24px" }}>
                Přihlaste se do systému PraxeO
            </p>

            <form onSubmit={handleLogin}>
                {/* Email */}
                <div style={{ marginBottom: 16 }}>
                    <label style={s.label}>Email</label>
                    <input
                        type="email"
                        style={s.input}
                        placeholder="jan.pavel@osu.cz"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        required
                    />
                </div>

                {/* Heslo */}
                <div style={{ marginBottom: 8 }}>
                    <label style={s.label}>Heslo</label>
                    <input
                        type="password"
                        style={s.input}
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        required
                    />
                </div>

                {/* Forgot password */}
                <div style={{ textAlign: "right", marginBottom: 20 }}>
                    <span
                        onClick={() => navigate("/forgot-password")}
                        style={{ fontSize: 12, color: "#1F8A4D", cursor: "pointer" }}
                    >
                        Zapomenuté heslo?
                    </span>
                </div>

                <button type="submit" style={s.btnPrimary}>
                    Přihlásit se
                </button>

                <div style={{ textAlign: "center" }}>
                    <span style={{ fontSize: 13, color: "#667085" }}>Nemáte účet? </span>
                    <span
                        onClick={() => navigate("/registerStudent")}
                        style={{ fontSize: 13, color: "#1F8A4D", cursor: "pointer", fontWeight: 500 }}
                    >
                        Registrovat se
                    </span>
                </div>
            </form>
        </div>
    );
};

export default LoginView;