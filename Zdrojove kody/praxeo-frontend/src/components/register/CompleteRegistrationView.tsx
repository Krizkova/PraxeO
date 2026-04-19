import React, { useMemo, useState } from "react";
import { UserCheck, CircleAlert } from "lucide-react";

interface Props {
    role?: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
    companyName: string;
    password: string;
    agreedToTerms: boolean;
    loading: boolean;
    errorMessage?: string;
    setFirstName: (v: string) => void;
    setLastName: (v: string) => void;
    setStudentNumber: (v: string) => void;
    setCompanyName: (v: string) => void;
    setPassword: (v: string) => void;
    setAgreedToTerms: (v: boolean) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

const CompleteRegistrationView: React.FC<Props> = ({
                                                       role,
                                                       firstName,
                                                       lastName,
                                                       studentNumber,
                                                       companyName,
                                                       password,
                                                       agreedToTerms,
                                                       loading,
                                                       errorMessage,
                                                       setFirstName,
                                                       setLastName,
                                                       setStudentNumber,
                                                       setCompanyName,
                                                       setPassword,
                                                       setAgreedToTerms,
                                                       handleSubmit,
                                                   }) => {
    const [password2, setPassword2] = useState("");

    const isStudent = role?.toUpperCase().includes("STUDENT");
    const isExternal = role?.toUpperCase().includes("EXTERNAL_WORKER");
    const roleLabel = isStudent ? "Student" : isExternal ? "Externista" : role ?? "";

    // Validace hesla a potvrzení hesla
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
    const isDisabled = loading || !agreedToTerms || !validation.isValid;

    const inputStyle: React.CSSProperties = {
        width: "100%",
        height: 48,
        background: "white",
        border: "1.5px solid #d0e8d0",
        borderRadius: 12,
        padding: "0 14px",
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
                maxWidth: 520,
                background: "white",
                borderRadius: 18,
                border: "1px solid #e0ede0",
                padding: 32,
                boxShadow: "0 4px 24px rgba(34,85,34,0.08)",
            }}
        >
            {/* Záhlaví formuláře */}
            <div
                style={{
                    marginBottom: 24,
                    paddingBottom: 18,
                    borderBottom: "1px solid #e8f5e9",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 8,
                    }}
                >
                    <div style={iconBoxStyle}>
                        <UserCheck size={14} color="#1F8A4D" strokeWidth={2.2} />
                    </div>
                    <h2
                        style={{
                            fontSize: 20,
                            fontWeight: 700,
                            color: "#1a3d1a",
                            margin: 0,
                        }}
                    >
                        Dokončení registrace
                    </h2>
                </div>

                <p style={{ fontSize: 13, color: "#6b8f6b", margin: "0 0 8px" }}>
                    Nastavte své jméno a heslo pro přihlášení
                </p>

                {roleLabel && (
                    <span
                        style={{
                            background: isStudent ? "#D6EDDF" : "#e3f2fd",
                            color: isStudent ? "#2d7a2d" : "#1565c0",
                            fontSize: 12,
                            fontWeight: 600,
                            padding: "3px 10px",
                            borderRadius: 20,
                            display: "inline-block",
                        }}
                    >
                        {roleLabel}
                    </span>
                )}
            </div>

            <form onSubmit={handleSubmit} autoComplete="off">
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                        marginBottom: 16,
                    }}
                >
                    <div>
                        <label style={labelStyle}>Jméno</label>
                        <input
                            style={inputStyle}
                            placeholder="Jan"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            autoComplete="off"
                            required
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Příjmení</label>
                        <input
                            style={inputStyle}
                            placeholder="Pavel"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            autoComplete="off"
                            required
                        />
                    </div>
                </div>

                {isStudent && (
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Číslo studenta</label>
                        <input
                            style={inputStyle}
                            placeholder="A24B0001P"
                            value={studentNumber}
                            onChange={(e) => setStudentNumber(e.target.value)}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            autoComplete="off"
                            required
                        />
                    </div>
                )}

                {isExternal && (
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Název firmy / organizace</label>
                        <input
                            style={inputStyle}
                            placeholder="Firma s.r.o."
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            autoComplete="off"
                            required
                        />
                    </div>
                )}

                {/* Heslo s inline validací */}
                <div style={{ marginBottom: 6 }}>
                    <label style={labelStyle}>Heslo</label>
                    <input
                        type="password"
                        autoComplete="new-password"
                        style={{
                            ...inputStyle,
                            ...(passwordInvalid
                                ? { border: "1.5px solid #e24b4a" }
                                : {}),
                        }}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        required
                    />
                </div>

                {password.length > 0 && password.length < 8 && (
                    <p style={{ fontSize: 11, color: "#e24b4a", marginTop: 4 }}>
                        Heslo musí mít alespoň 8 znaků.
                    </p>
                )}

                {password.length > 0 && !/\d/.test(password) && (
                    <p style={{ fontSize: 11, color: "#e24b4a", marginTop: 4 }}>
                        Heslo musí obsahovat alespoň jedno číslo.
                    </p>
                )}

                {!passwordInvalid && (
                    <p style={{ fontSize: 11, color: "#a0baa0", marginTop: 4 }}>
                        Minimálně 8 znaků a jedno číslo
                    </p>
                )}

                <div style={{ marginBottom: 20, marginTop: 12 }}>
                    <label style={labelStyle}>Potvrzení hesla</label>
                    <input
                        type="password"
                        autoComplete="new-password"
                        style={{
                            ...inputStyle,
                            ...(matchInvalid
                                ? { border: "1.5px solid #e24b4a" }
                                : {}),
                        }}
                        placeholder="••••••••"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        required
                    />

                    {matchInvalid && (
                        <p style={{ fontSize: 11, color: "#e24b4a", marginTop: 4 }}>
                            Hesla se neshodují.
                        </p>
                    )}
                </div>

                {errorMessage && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 8,
                            background: "#FFF4F4",
                            border: "1px solid #F1C7C7",
                            borderRadius: 10,
                            padding: "10px 14px",
                            fontSize: 13,
                            color: "#C75B5B",
                            marginBottom: 16,
                        }}
                    >
                        <CircleAlert
                            size={16}
                            style={{ flexShrink: 0, marginTop: 1 }}
                        />
                        <span>{errorMessage}</span>
                    </div>
                )}

                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        marginBottom: 24,
                    }}
                >
                    <input
                        type="checkbox"
                        id="terms"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        required
                        style={{
                            marginTop: 3,
                            accentColor: "#2d7a2d",
                            width: 15,
                            height: 15,
                            flexShrink: 0,
                        }}
                    />
                    <label
                        htmlFor="terms"
                        style={{
                            fontSize: 12,
                            color: "#6b8f6b",
                            lineHeight: 1.5,
                        }}
                    >
                        Souhlasím se zpracováním osobních údajů (GDPR)
                    </label>
                </div>

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
                        boxShadow: isDisabled
                            ? "none"
                            : "0 4px 14px rgba(45,122,45,0.3)",
                        transition: "opacity 0.2s",
                    }}
                    onMouseEnter={(e) => {
                        if (!isDisabled) e.currentTarget.style.opacity = "0.9";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "1";
                    }}
                >
                    {loading ? "Ukládám..." : "Dokončit registraci"}
                </button>
            </form>
        </div>
    );
};

export default CompleteRegistrationView;