import React, { useMemo } from "react";

interface Props {
    password: string;
    password2: string;
    loading: boolean;
    setPassword: (v: string) => void;
    setPassword2: (v: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

const ResetPasswordView: React.FC<Props> = ({
                                                password, password2, loading, setPassword, setPassword2, handleSubmit
                                            }) => {
    const validation = useMemo(() => {
        const errors: string[] = [];
        if (password.length < 8) errors.push("min8");
        if (!/\d/.test(password)) errors.push("digit");
        if (password !== password2) errors.push("match");
        return { isValid: errors.length === 0 };
    }, [password, password2]);

    const s = {
        page: { background: "#F0F4F0", minHeight: "calc(100vh - 56px)", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "52px 24px" } as React.CSSProperties,
        card: { width: "100%", maxWidth: 420, background: "white", borderRadius: 18, border: "0.5px solid #D9E2D9", padding: 36 } as React.CSSProperties,
        label: { fontSize: 12, fontWeight: 500, color: "#1E2430", display: "block", marginBottom: 6 } as React.CSSProperties,
        input: { width: "100%", height: 48, background: "white", border: "1px solid #D9E2D9", borderRadius: 12, padding: "0 14px", fontSize: 14, color: "#1E2430", outline: "none", boxSizing: "border-box" as const },
        inputError: { border: "1px solid #e24b4a" } as React.CSSProperties,
        hint: { fontSize: 11, color: "#A0A9A0", marginTop: 5 } as React.CSSProperties,
        error: { fontSize: 11, color: "#e24b4a", marginTop: 5 } as React.CSSProperties,
        btn: { width: "100%", height: 48, background: "#1F8A4D", color: "white", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 500, cursor: "pointer" } as React.CSSProperties,
        btnDisabled: { opacity: 0.5, cursor: "not-allowed" } as React.CSSProperties,
    };

    const passwordInvalid = password.length > 0 && (password.length < 8 || !/\d/.test(password));
    const matchInvalid = password2.length > 0 && password !== password2;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.border = "1px solid #1F8A4D";
        e.target.style.boxShadow = "0 0 0 3px rgba(31,138,77,0.1)";
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.border = passwordInvalid ? "1px solid #e24b4a" : "1px solid #D9E2D9";
        e.target.style.boxShadow = "none";
    };

    return (
        <div style={s.page}>
            <div style={s.card}>
                <div style={{ width: 48, height: 48, background: "#D6EDDF", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <rect x="4" y="9" width="12" height="9" rx="2" stroke="#1F8A4D" strokeWidth="1.5"/>
                        <path d="M7 9V6a3 3 0 1 1 6 0v3" stroke="#1F8A4D" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                </div>

                <h2 style={{ fontSize: 20, fontWeight: 500, color: "#1E2430", margin: "0 0 4px" }}>Obnovení hesla</h2>
                <p style={{ fontSize: 13, color: "#667085", margin: "0 0 24px" }}>Nastavte nové heslo pro váš účet</p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 6 }}>
                        <label style={s.label}>Nové heslo</label>
                        <input
                            type="password"
                            autoComplete="new-password"
                            style={{ ...s.input, ...(passwordInvalid ? s.inputError : {}) }}
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            required
                        />
                    </div>
                    {password.length > 0 && password.length < 8 && <p style={s.error}>Heslo musí mít alespoň 8 znaků.</p>}
                    {password.length > 0 && !/\d/.test(password) && <p style={s.error}>Heslo musí obsahovat alespoň jedno číslo.</p>}
                    {!passwordInvalid && <p style={s.hint}>Minimálně 8 znaků a jedno číslo</p>}

                    <div style={{ marginBottom: 28, marginTop: 12 }}>
                        <label style={s.label}>Potvrzení hesla</label>
                        <input
                            type="password"
                            autoComplete="new-password"
                            style={{ ...s.input, ...(matchInvalid ? s.inputError : {}) }}
                            placeholder="••••••••"
                            value={password2}
                            onChange={e => setPassword2(e.target.value)}
                            onFocus={(e) => { e.target.style.border = "1px solid #1F8A4D"; e.target.style.boxShadow = "0 0 0 3px rgba(31,138,77,0.1)"; }}
                            onBlur={(e) => { e.target.style.border = matchInvalid ? "1px solid #e24b4a" : "1px solid #D9E2D9"; e.target.style.boxShadow = "none"; }}
                            required
                        />
                        {matchInvalid && <p style={s.error}>Hesla se neshodují.</p>}
                    </div>

                    <button
                        type="submit"
                        style={{ ...s.btn, ...(!validation.isValid || loading ? s.btnDisabled : {}) }}
                        disabled={!validation.isValid || loading}
                    >
                        {loading ? "Ukládám..." : "Nastavit nové heslo"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordView;