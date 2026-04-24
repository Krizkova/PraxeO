import React from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, ArrowRight } from "lucide-react";
import { useLogin } from "./useLogin";
import FormCard from "../common/FormCard";
import PrimaryButton from "../common/PrimaryButton";
import ErrorAlert from "../common/ErrorAlert";
import {
    FormHeader,
    inputStyle,
    labelStyle,
    applyFocusStyle,
    clearFocusStyle,
} from "../../components/form";

const LoginView: React.FC = () => {
    const { email, setEmail, password, setPassword, error, setError, handleLogin } =
        useLogin();
    const navigate = useNavigate();

    const linkButtonStyle: React.CSSProperties = {
        background: "none",
        border: "none",
        padding: 0,
        margin: 0,
        color: "#2d7a2d",
        cursor: "pointer",
        fontWeight: 500,
        fontSize: 12,
        fontFamily: "inherit",
    };

    const registerButtonStyle: React.CSSProperties = {
        background: "none",
        border: "none",
        padding: 0,
        margin: 0,
        color: "#2d7a2d",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: 13,
        fontFamily: "inherit",
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
    };

    const fieldWithIconStyle: React.CSSProperties = {
        ...inputStyle,
        paddingLeft: 42,
    };

    const fieldIconStyle: React.CSSProperties = {
        position: "absolute",
        left: 12,
        top: "50%",
        transform: "translateY(-50%)",
        color: "#7FA487",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        applyFocusStyle(e.currentTarget);
        setError("");
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        clearFocusStyle(e.currentTarget);
    };

    return (
        <FormCard padding={28}>
            <FormHeader
                icon={<LogIn size={14} color="#1F8A4D" strokeWidth={2.2} />}
                title="Přihlášení"
                subtitle="Přihlaste se do systému PraxeO"
            />

            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>E-mail</label>

                    <div style={{ position: "relative" }}>
                        <div style={fieldIconStyle}>
                            <Mail size={15} />
                        </div>

                        <input
                            type="email"
                            style={fieldWithIconStyle}
                            placeholder="jan.pavel@osu.cz"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError("");
                            }}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            required
                        />
                    </div>
                </div>

                <div style={{ marginBottom: 4 }}>
                    <label style={labelStyle}>Heslo</label>

                    <div style={{ position: "relative" }}>
                        <div style={fieldIconStyle}>
                            <Lock size={15} />
                        </div>

                        <input
                            type="password"
                            style={fieldWithIconStyle}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError("");
                            }}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            required
                        />
                    </div>
                </div>

                {error && (
                    <p style={{ color: "#e24b4a", fontSize: 13, margin: "6px 0 0", lineHeight: 1.5 }}>
                        {error}
                    </p>
                )}

                <div style={{ textAlign: "right", margin: "12px 0 20px" }}>
                    <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        style={linkButtonStyle}
                    >
                        Zapomenuté heslo?
                    </button>
                </div>

                <PrimaryButton type="submit" marginBottom={16}>
                    <span
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                        }}
                    >
                        <LogIn size={16} />
                        Přihlásit se
                    </span>
                </PrimaryButton>

                <div style={{ textAlign: "center" }}>
                    <span style={{ fontSize: 13, color: "#6b8f6b" }}>
                        Nemáte účet?{" "}
                    </span>

                    <button
                        type="button"
                        onClick={() => navigate("/registerStudent")}
                        style={registerButtonStyle}
                    >
                        Registrovat se
                        <ArrowRight size={13} />
                    </button>
                </div>
            </form>
        </FormCard>
    );
};

export default LoginView;