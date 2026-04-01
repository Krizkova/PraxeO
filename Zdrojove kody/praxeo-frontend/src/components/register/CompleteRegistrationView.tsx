import React, { useMemo, useState } from "react";

interface Props {
    role?: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
    companyName: string;
    password: string;
    agreedToTerms: boolean;
    loading: boolean;
    setFirstName: (v: string) => void;
    setLastName: (v: string) => void;
    setStudentNumber: (v: string) => void;
    setCompanyName: (v: string) => void;
    setPassword: (v: string) => void;
    setAgreedToTerms: (v: boolean) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

const CompleteRegistrationView: React.FC<Props> = (props) => {
    const {
        role, firstName, lastName, studentNumber, companyName,
        password, agreedToTerms, loading,
        setFirstName, setLastName, setStudentNumber,
        setCompanyName, setPassword, setAgreedToTerms, handleSubmit
    } = props;

    const [password2, setPassword2] = useState("");

    const isStudent = role?.toUpperCase().includes("STUDENT");
    const isExternal = role?.toUpperCase().includes("EXTERNAL_WORKER");

    const roleLabel = isStudent ? "Student" : isExternal ? "Externista" : role ?? "";
    const roleBadgeStyle: React.CSSProperties = isStudent
        ? { background: "#D6EDDF", color: "#1F8A4D" }
        : { background: "#EBF3FF", color: "#185FA5" };

    const validation = useMemo(() => {
        const errors: string[] = [];
        if (password.length < 8) errors.push("min8");
        if (!/\d/.test(password)) errors.push("digit");
        if (password !== password2) errors.push("match");
        return { isValid: errors.length === 0, errors };
    }, [password, password2]);

    const s = {
        page: { background: "#F0F4F0", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "52px 24px", fontFamily: "inherit" } as React.CSSProperties,
        card: { width: "100%", maxWidth: 460, background: "white", borderRadius: 18, border: "0.5px solid #D9E2D9", padding: 36 } as React.CSSProperties,
        label: { fontSize: 12, fontWeight: 500, color: "#1E2430", display: "block", marginBottom: 6 } as React.CSSProperties,
        input: { width: "100%", height: 48, background: "white", border: "1px solid #D9E2D9", borderRadius: 12, padding: "0 14px", fontSize: 14, color: "#1E2430", outline: "none", boxSizing: "border-box" } as React.CSSProperties,
        inputFocus: { border: "1px solid #1F8A4D", boxShadow: "0 0 0 3px rgba(31,138,77,0.1)" } as React.CSSProperties,
        inputError: { border: "1px solid #e24b4a" } as React.CSSProperties,
        hint: { fontSize: 11, color: "#A0A9A0", marginTop: 5 } as React.CSSProperties,
        error: { fontSize: 11, color: "#e24b4a", marginTop: 5 } as React.CSSProperties,
        btn: { width: "100%", height: 48, background: "#1F8A4D", color: "white", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 500, cursor: "pointer" } as React.CSSProperties,
        btnDisabled: { opacity: 0.5, cursor: "not-allowed" } as React.CSSProperties,
    };

    const passwordInvalid = password.length > 0 && (password.length < 8 || !/\d/.test(password));
    const matchInvalid = password2.length > 0 && password !== password2;

    return (
        <div style={s.page}>
            <div style={s.card}>

                {/* Email + role badge */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, paddingBottom: 20, borderBottom: "0.5px solid #E8EEE8" }}>
                    <div style={{ width: 36, height: 36, background: "#D6EDDF", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 8c-3.3 0-5 1.5-5 2.5V14h10v-1.5C13 11.5 11.3 10 8 10z" fill="#1F8A4D"/>
                        </svg>
                    </div>
                    <div>
                        <p style={{ fontSize: 11, color: "#A0A9A0", margin: 0 }}>Registrujete se jako</p>
                        <p style={{ fontSize: 13, fontWeight: 500, color: "#1E2430", margin: 0 }}>
                            {roleLabel && (
                                <span style={{ ...roleBadgeStyle, fontSize: 11, padding: "2px 8px", borderRadius: 10, marginLeft: 6 }}>
                                    {roleLabel}
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                <h2 style={{ fontSize: 20, fontWeight: 500, color: "#1E2430", margin: "0 0 4px" }}>Dokončení registrace</h2>
                <p style={{ fontSize: 13, color: "#667085", margin: "0 0 24px" }}>Nastavte své jméno a heslo pro přihlášení</p>

                <form onSubmit={handleSubmit} autoComplete="off">
                    {/* Jméno + Příjmení */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                        <div>
                            <label style={s.label}>Jméno</label>
                            <input style={s.input} placeholder="Jan" value={firstName}
                                   onChange={e => setFirstName(e.target.value)}
                                   autoComplete="off" required />
                        </div>
                        <div>
                            <label style={s.label}>Příjmení</label>
                            <input style={s.input} placeholder="Pavel" value={lastName}
                                   onChange={e => setLastName(e.target.value)}
                                   autoComplete="off" required />
                        </div>
                    </div>

                    {/* Studijní číslo */}
                    {isStudent && (
                        <div style={{ marginBottom: 16 }}>
                            <label style={s.label}>Číslo studenta</label>
                            <input style={s.input} placeholder="A24B0001P" value={studentNumber}
                                   onChange={e => setStudentNumber(e.target.value)}
                                   autoComplete="off" required />
                        </div>
                    )}

                    {/* Název firmy */}
                    {isExternal && (
                        <div style={{ marginBottom: 16 }}>
                            <label style={s.label}>Název firmy / organizace</label>
                            <input style={s.input} placeholder="Firma s.r.o." value={companyName}
                                   onChange={e => setCompanyName(e.target.value)}
                                   autoComplete="off" required />
                        </div>
                    )}

                    {/* Heslo */}
                    <div style={{ marginBottom: 6 }}>
                        <label style={s.label}>Heslo</label>
                        <input type="password" autoComplete="new-password"
                               style={{ ...s.input, ...(passwordInvalid ? s.inputError : {}) }}
                               placeholder="••••••••" value={password}
                               onChange={e => setPassword(e.target.value)} required />
                    </div>
                    {password.length > 0 && password.length < 8 && <p style={s.error}>Heslo musí mít alespoň 8 znaků.</p>}
                    {password.length > 0 && !/\d/.test(password) && <p style={s.error}>Heslo musí obsahovat alespoň jedno číslo.</p>}
                    {!passwordInvalid && <p style={s.hint}>Minimálně 8 znaků a jedno číslo</p>}

                    {/* Potvrzení hesla */}
                    <div style={{ marginBottom: 20, marginTop: 12 }}>
                        <label style={s.label}>Potvrzení hesla</label>
                        <input type="password" autoComplete="new-password"
                               style={{ ...s.input, ...(matchInvalid ? s.inputError : {}) }}
                               placeholder="••••••••" value={password2}
                               onChange={e => setPassword2(e.target.value)} required />
                        {matchInvalid && <p style={s.error}>Hesla se neshodují.</p>}
                    </div>

                    {/* GDPR checkbox */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 24 }}>
                        <input
                            type="checkbox"
                            id="terms"
                            checked={agreedToTerms}
                            onChange={e => setAgreedToTerms(e.target.checked)}
                            required
                            style={{ marginTop: 3, accentColor: "#1F8A4D", width: 15, height: 15, flexShrink: 0 }}
                        />
                        <label htmlFor="terms" style={{ fontSize: 12, color: "#667085", lineHeight: 1.5 }}>
                            Souhlasím se zpracováním osobních údajů (GDPR)
                        </label>
                    </div>

                    <button
                        type="submit"
                        style={{ ...s.btn, ...(!agreedToTerms || !validation.isValid || loading ? s.btnDisabled : {}) }}
                        disabled={loading || !agreedToTerms || !validation.isValid}
                    >
                        {loading ? "Ukládám..." : "Dokončit registraci"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CompleteRegistrationView;