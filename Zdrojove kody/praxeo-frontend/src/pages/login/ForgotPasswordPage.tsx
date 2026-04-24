import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { KeyRound, Mail } from "lucide-react";
import { forgotPassword } from "../../api/userApi";
import LayoutPage from "../../pages/layouts/LayoutPage";
import HeaderPage from "../../pages/common/HeaderPage";
import IconBadgePage from "../../pages/common/IconBadgePage";
import ActionButtonPage from "../../pages/common/ActionButtonPage";
import ContentWrapperPage from "../../pages/common/ContentWrapperPage";

// Kroky procesu obnovy hesla slouží jen jako vizuální orientace pro uživatele.
const steps = [
    {
        n: 1,
        title: "Zadejte e-mail",
        sub: "Použijte e-mail, se kterým jste registrováni",
        active: true,
    },
    {
        n: 2,
        title: "Zkontrolujte e-mail",
        sub: "Pošleme vám odkaz pro obnovení hesla",
        active: false,
    },
    {
        n: 3,
        title: "Nastavte nové heslo",
        sub: "Po kliknutí na odkaz si zvolíte nové heslo",
        active: false,
    },
];

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

const pageGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 420px",
    gap: 56,
    alignItems: "start",
};

const cardStyle: React.CSSProperties = {
    background: "white",
    borderRadius: 18,
    border: "1px solid #e0ede0",
    padding: 32,
    boxShadow: "0 4px 24px rgba(34,85,34,0.08)",
};

const primaryButtonStyle: React.CSSProperties = {
    width: "100%",
    height: 48,
    color: "white",
    border: "none",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 700,
};

const StepItem: React.FC<{
    n: number;
    title: string;
    sub: string;
    active: boolean;
}> = ({ n, title, sub, active }) => (
    <div
        style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 16,
        }}
    >
        <div
            style={{
                width: 32,
                height: 32,
                background: active
                    ? "linear-gradient(135deg, #2d7a2d, #4caf50)"
                    : "white",
                border: active ? "none" : "1.5px solid #d0e8d0",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: active ? "0 3px 8px rgba(45,122,45,0.25)" : "none",
            }}
        >
            <span
                style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: active ? "white" : "#8aaa8a",
                }}
            >
                {n}
            </span>
        </div>

        <div style={{ paddingTop: 4 }}>
            <div
                style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: active ? "#1a3d1a" : "#6b8f6b",
                    marginBottom: 3,
                }}
            >
                {title}
            </div>

            <div
                style={{
                    fontSize: 13,
                    color: "#8aaa8a",
                    lineHeight: 1.5,
                }}
            >
                {sub}
            </div>
        </div>
    </div>
);

const ForgotPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    // Pokud uživatel přišel přímo na stránku bez historie v routeru,
    // vracíme ho bezpečně na přihlášení místo navigate(-1).
    const handleBack = () => {
        if (location.key === "default") {
            navigate("/", { replace: true });
            return;
        }

        navigate(-1);
    };

    // Používáme currentTarget, protože handler visí přímo na inputu
    // a v React + TypeScript je to spolehlivější než target.
    const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.currentTarget.style.border = "1.5px solid #2d7a2d";
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(45,122,45,0.1)";
        e.currentTarget.style.background = "#fcfffc";
        setError("");
    };

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        e.currentTarget.style.border = error
            ? "1.5px solid #e24b4a"
            : "1.5px solid #d0e8d0";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.background = "white";
    };

    // Z bezpečnostních důvodů neprozrazujeme detaily u většiny chyb:
    // jen při jasném "účet neexistuje" ukážeme hlášku, jinak simulujeme úspěšné odeslání.
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await forgotPassword({ email });
            setSent(true);
        } catch (err: any) {
            const status = err.response?.status;
            const msg = (err.response?.data?.message || err.message || "").toLowerCase();

            if (
                status === 404 ||
                msg.includes("neexistuje") ||
                msg.includes("nenalezen") ||
                msg.includes("not found")
            ) {
                setError(
                    "Účet s tímto e-mailem nebyl nalezen. Zkontrolujte adresu nebo se zaregistrujte."
                );
            } else {
                setSent(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const submitButtonStyle: React.CSSProperties = {
        ...primaryButtonStyle,
        background: email
            ? "linear-gradient(135deg, #2d7a2d, #4caf50)"
            : "#c8dfc8",
        cursor: email ? "pointer" : "not-allowed",
        marginTop: 20,
        boxShadow: email ? "0 4px 14px rgba(45,122,45,0.3)" : "none",
        transition: "opacity 0.2s",
    };

    const backToLoginButtonStyle: React.CSSProperties = {
        ...primaryButtonStyle,
        background: "linear-gradient(135deg, #2d7a2d, #4caf50)",
        cursor: "pointer",
        boxShadow: "0 4px 14px rgba(45,122,45,0.3)",
    };

    return (
        <LayoutPage>
            <HeaderPage
                icon={
                    <IconBadgePage>
                        <KeyRound size={20} color="white" strokeWidth={1.8} />
                    </IconBadgePage>
                }
                title="Obnovení hesla"
                action={
                    <ActionButtonPage onClick={handleBack}>
                        ← Zpět
                    </ActionButtonPage>
                }
            />

            <ContentWrapperPage>
                <div style={pageGridStyle}>
                    <div style={{ paddingTop: 8 }}>
                        <p
                            style={{
                                fontSize: 15,
                                color: "#5a7a5a",
                                lineHeight: 1.7,
                                margin: "0 0 36px",
                            }}
                        >
                            Zapomněli jste heslo? Zadejte svůj e-mail a pošleme vám odkaz pro obnovení.
                        </p>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 22,
                            }}
                        >
                            {steps.map((step) => (
                                <StepItem key={step.n} {...step} />
                            ))}
                        </div>
                    </div>

                    <div style={cardStyle}>
                        {!sent ? (
                            <>
                                <h2
                                    style={{
                                        fontSize: 20,
                                        fontWeight: 700,
                                        color: "#1a3d1a",
                                        margin: "0 0 24px",
                                    }}
                                >
                                    Obnovení hesla
                                </h2>

                                <form onSubmit={handleSubmit}>
                                    <div style={{ marginBottom: 6 }}>
                                        <label
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 600,
                                                color: "#3a5a3a",
                                                display: "block",
                                                marginBottom: 6,
                                            }}
                                        >
                                            E-mail <span style={{ color: "#e24b4a" }}>*</span>
                                        </label>

                                        <input
                                            type="email"
                                            style={{
                                                ...inputStyle,
                                                ...(error ? { border: "1.5px solid #e24b4a" } : {}),
                                            }}
                                            placeholder="jan.pavel@osu.cz"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                setError("");
                                            }}
                                            onFocus={onFocus}
                                            onBlur={onBlur}
                                            required
                                        />

                                        {error && (
                                            <p
                                                style={{
                                                    fontSize: 11,
                                                    color: "#e24b4a",
                                                    margin: "6px 0 0",
                                                    lineHeight: 1.5,
                                                }}
                                            >
                                                {error}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || !email}
                                        style={submitButtonStyle}
                                        onMouseEnter={(e) => {
                                            if (email) e.currentTarget.style.opacity = "0.9";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.opacity = "1";
                                        }}
                                    >
                                        {loading ? "Odesílám..." : "Odeslat odkaz"}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div style={{ textAlign: "center", padding: "16px 0" }}>
                                <div
                                    style={{
                                        width: 64,
                                        height: 64,
                                        background: "#D6EDDF",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "0 auto 20px",
                                    }}
                                >
                                    <Mail size={28} color="#2d7a2d" strokeWidth={1.5} />
                                </div>

                                <h2
                                    style={{
                                        fontSize: 20,
                                        fontWeight: 700,
                                        color: "#1a3d1a",
                                        margin: "0 0 10px",
                                    }}
                                >
                                    Zkontrolujte e-mail
                                </h2>

                                <p
                                    style={{
                                        fontSize: 14,
                                        color: "#5a7a5a",
                                        lineHeight: 1.6,
                                        margin: "0 0 8px",
                                    }}
                                >
                                    Pokud účet s adresou{" "}
                                    <strong style={{ color: "#1a3d1a" }}>{email}</strong> existuje,
                                    poslali jsme vám odkaz pro obnovení hesla.
                                </p>

                                <p
                                    style={{
                                        fontSize: 13,
                                        color: "#8aaa8a",
                                        lineHeight: 1.5,
                                        margin: "0 0 28px",
                                    }}
                                >
                                    Zkontrolujte také složku se spamem.
                                </p>

                                <button
                                    style={backToLoginButtonStyle}
                                    onClick={() => navigate("/")}
                                >
                                    Zpět na přihlášení
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </ContentWrapperPage>
        </LayoutPage>
    );
};

export default ForgotPasswordPage;