import React, { useMemo } from "react";
import { KeyRound, LockKeyhole, CircleAlert } from "lucide-react";

interface Props {
    password: string;
    password2: string;
    loading: boolean;
    errorMessage?: string;
    setPassword: (v: string) => void;
    setPassword2: (v: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

const ResetPasswordView: React.FC<Props> = ({
                                                password,
                                                password2,
                                                loading,
                                                errorMessage,
                                                setPassword,
                                                setPassword2,
                                                handleSubmit,
                                            }) => {
    const validation = useMemo(() => {
        const errors: string[] = [];
        if (password.length < 8) errors.push("min8");
        if (!/\d/.test(password)) errors.push("digit");
        if (password !== password2) errors.push("match");
        return { isValid: errors.length === 0 };
    }, [password, password2]);

    const passwordInvalid =
        password.length > 0 && (password.length < 8 || !/\d/.test(password));

    const matchInvalid = password2.length > 0 && password !== password2;
    const isDisabled = !validation.isValid || loading;

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
    };

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.border = "1.5px solid #d0e8d0";
        e.target.style.boxShadow = "none";
        e.target.style.background = "white";
    };

    return (
        <div
            style={{
                width: "100%",
                maxWidth: 460,
                background: "white",
                borderRadius: 18,
                border: "1px solid #e0ede0",
                padding: 32,
                boxShadow: "0 4px 24px rgba(34,85,34,0.08)",
            }}
        >
            {/* Nadpis formuláře */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={iconBoxStyle}>
                    <KeyRound size={14} color="#1F8A4D" strokeWidth={2.2} />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a3d1a", margin: 0 }}>
                    Nastavte nové heslo
                </h2>
            </div>

            <p style={{ fontSize: 13, color: "#6b8f6b", margin: "0 0 28px" }}>
                Zvolte si bezpečné heslo pro váš účet
            </p>

            <form onSubmit={handleSubmit}>
                {/* Nové heslo */}
                <div style={{ marginBottom: 6 }}>
                    <label style={labelStyle}>Nové heslo</label>
                    <div style={{ position: "relative" }}>
                        <div
                            style={{
                                position: "absolute",
                                left: 12,
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: passwordInvalid ? "#e24b4a" : "#7FA487",
                                pointerEvents: "none",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <LockKeyhole size={15} />
                        </div>

                        <input
                            type="password"
                            autoComplete="new-password"
                            style={{
                                ...inputStyle,
                                ...(passwordInvalid ? { border: "1.5px solid #e24b4a" } : {}),
                            }}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            required
                            aria-invalid={passwordInvalid}
                            aria-describedby={
                                passwordInvalid ? "password-rules-error" : "password-rules-help"
                            }
                        />
                    </div>
                </div>

                {password.length > 0 && password.length < 8 && (
                    <p id="password-rules-error" style={{ fontSize: 11, color: "#e24b4a", marginTop: 4 }}>
                        Heslo musí mít alespoň 8 znaků.
                    </p>
                )}

                {password.length > 0 && !/\d/.test(password) && (
                    <p style={{ fontSize: 11, color: "#e24b4a", marginTop: 4 }}>
                        Heslo musí obsahovat alespoň jedno číslo.
                    </p>
                )}

                {!passwordInvalid && (
                    <p id="password-rules-help" style={{ fontSize: 11, color: "#a0baa0", marginTop: 4 }}>
                        Minimálně 8 znaků a jedno číslo
                    </p>
                )}

                {/* Potvrzení hesla */}
                <div style={{ marginBottom: 20, marginTop: 12 }}>
                    <label style={labelStyle}>Potvrzení hesla</label>
                    <div style={{ position: "relative" }}>
                        <div
                            style={{
                                position: "absolute",
                                left: 12,
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: matchInvalid ? "#e24b4a" : "#7FA487",
                                pointerEvents: "none",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <LockKeyhole size={15} />
                        </div>

                        <input
                            type="password"
                            autoComplete="new-password"
                            style={{
                                ...inputStyle,
                                ...(matchInvalid ? { border: "1.5px solid #e24b4a" } : {}),
                            }}
                            placeholder="••••••••"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            required
                            aria-invalid={matchInvalid}
                            aria-describedby={matchInvalid ? "password-match-error" : undefined}
                        />
                    </div>

                    {matchInvalid && (
                        <p id="password-match-error" style={{ fontSize: 11, color: "#e24b4a", marginTop: 4 }}>
                            Hesla se neshodují.
                        </p>
                    )}
                </div>

                {/* Chyba z backendu */}
                {errorMessage && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 8,
                            marginTop: 6,
                            marginBottom: 16,
                            background: "#FFF4F4",
                            border: "1px solid #F1C7C7",
                            borderRadius: 12,
                            padding: "12px 14px",
                            color: "#C75B5B",
                            fontSize: 13,
                            lineHeight: 1.5,
                        }}
                    >
                        <CircleAlert size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                        <span>{errorMessage}</span>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isDisabled}
                    style={{
                        width: "100%",
                        height: 48,
                        background: isDisabled
                            ? "#c8dfc8"
                            : "linear-gradient(135deg, #2d7a2d, #4caf50)",
                        color: "white",
                        border: "none",
                        borderRadius: 12,
                        fontSize: 15,
                        fontWeight: 700,
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        boxShadow: isDisabled ? "none" : "0 4px 14px rgba(45,122,45,0.3)",
                        transition: "opacity 0.2s",
                    }}
                    onMouseEnter={(e) => {
                        if (!isDisabled) e.currentTarget.style.opacity = "0.9";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "1";
                    }}
                >
                    {loading ? "Ukládám..." : "Nastavit nové heslo"}
                </button>
            </form>
        </div>
    );
};

export default ResetPasswordView;