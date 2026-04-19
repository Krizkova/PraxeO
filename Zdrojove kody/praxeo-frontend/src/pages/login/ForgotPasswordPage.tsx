import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, Mail } from "lucide-react";
import { forgotPassword } from "../../api/userApi";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

const ForgotPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

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

    const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.border = "1.5px solid #2d7a2d";
        e.target.style.boxShadow = "0 0 0 3px rgba(45,122,45,0.1)";
        e.target.style.background = "#fcfffc";
        setError("");
    };
    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.border = error ? "1.5px solid #e24b4a" : "1.5px solid #d0e8d0";
        e.target.style.boxShadow = "none";
        e.target.style.background = "white";
    };

    // Odeslání žádosti o obnovení hesla
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
            // Účet nenalezen: zobrazíme chybovou zprávu
            if (status === 404 || msg.includes("neexistuje") || msg.includes("nenalezen") || msg.includes("not found")) {
                setError("Účet s tímto e-mailem nebyl nalezen. Zkontrolujte adresu nebo se zaregistrujte.");
            } else {
                // Pro ostatní chyby zobrazíme úspěch z bezpečnostních důvodů
                setSent(true);
            }
        } finally {
            setLoading(false);
        }
    };

    // Kroky procesu obnovy hesla
    const steps = [
        { n: 1, title: "Zadejte e-mail", sub: "Použijte e-mail, se kterým jste registrováni", active: true },
        { n: 2, title: "Zkontrolujte e-mail", sub: "Pošleme vám odkaz pro obnovení hesla", active: false },
        { n: 3, title: "Nastavte nové heslo", sub: "Po kliknutí na odkaz si zvolíte nové heslo", active: false },
    ];

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
                            {/* Ikona obnovení hesla */}
                            <div style={{
                                width: 44, height: 44,
                                background: "linear-gradient(135deg, #2d7a2d, #4caf50)",
                                borderRadius: 11,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 4px 12px rgba(45,122,45,0.3)",
                                flexShrink: 0,
                            }}>
                                <KeyRound size={20} color="white" strokeWidth={1.8} />
                            </div>
                            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1a3d1a", letterSpacing: "-0.3px" }}>
                                Obnovení hesla
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

                {/* Obsah stránky */}
                <div style={{ padding: "40px 32px" }}>
                    <div style={{
                        maxWidth: 1000,
                        margin: "0 auto",
                        display: "grid",
                        gridTemplateColumns: "1fr 420px",
                        gap: 56,
                        alignItems: "start",
                    }}>
                        {/* Levý sloupec: popis a kroky */}
                        <div style={{ paddingTop: 8 }}>
                            <p style={{ fontSize: 15, color: "#5a7a5a", lineHeight: 1.7, margin: "0 0 36px" }}>
                                Zapomněli jste heslo? Zadejte svůj e-mail a pošleme vám odkaz pro obnovení.
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                                {steps.map(step => (
                                    <div key={step.n} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                                        <div style={{
                                            width: 32, height: 32,
                                            background: step.active ? "linear-gradient(135deg, #2d7a2d, #4caf50)" : "white",
                                            border: step.active ? "none" : "1.5px solid #d0e8d0",
                                            borderRadius: "50%",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            flexShrink: 0,
                                            boxShadow: step.active ? "0 3px 8px rgba(45,122,45,0.25)" : "none",
                                        }}>
                                            <span style={{ fontSize: 13, fontWeight: 700, color: step.active ? "white" : "#8aaa8a" }}>
                                                {step.n}
                                            </span>
                                        </div>
                                        <div style={{ paddingTop: 4 }}>
                                            <div style={{ fontSize: 14, fontWeight: 600, color: step.active ? "#1a3d1a" : "#6b8f6b", marginBottom: 3 }}>
                                                {step.title}
                                            </div>
                                            <div style={{ fontSize: 13, color: "#8aaa8a", lineHeight: 1.5 }}>
                                                {step.sub}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pravý sloupec: formulář nebo potvrzení odeslání */}
                        <div style={{
                            background: "white",
                            borderRadius: 18,
                            border: "1px solid #e0ede0",
                            padding: 32,
                            boxShadow: "0 4px 24px rgba(34,85,34,0.08)",
                        }}>
                            {!sent ? (
                                <>
                                    <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a3d1a", margin: "0 0 24px" }}>
                                        Obnovení hesla
                                    </h2>

                                    <form onSubmit={handleSubmit}>
                                        <div style={{ marginBottom: 6 }}>
                                            <label style={{ fontSize: 12, fontWeight: 600, color: "#3a5a3a", display: "block", marginBottom: 6 }}>
                                                E-mail
                                            </label>
                                            <input
                                                type="email"
                                                style={{ ...inputStyle, ...(error ? { border: "1.5px solid #e24b4a" } : {}) }}
                                                placeholder="jan.pavel@osu.cz"
                                                value={email}
                                                onChange={e => { setEmail(e.target.value); setError(""); }}
                                                onFocus={onFocus}
                                                onBlur={onBlur}
                                                required
                                            />
                                            {/* Chybová zpráva při nenalezení účtu */}
                                            {error && (
                                                <p style={{ fontSize: 11, color: "#e24b4a", margin: "6px 0 0", lineHeight: 1.5 }}>
                                                    {error}
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading || !email}
                                            style={{
                                                width: "100%", height: 48,
                                                background: email ? "linear-gradient(135deg, #2d7a2d, #4caf50)" : "#c8dfc8",
                                                color: "white", border: "none", borderRadius: 12,
                                                fontSize: 15, fontWeight: 700,
                                                cursor: email ? "pointer" : "not-allowed",
                                                marginTop: 20,
                                                boxShadow: email ? "0 4px 14px rgba(45,122,45,0.3)" : "none",
                                                transition: "opacity 0.2s",
                                            }}
                                            onMouseEnter={e => { if (email) e.currentTarget.style.opacity = "0.9"; }}
                                            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                                        >
                                            {loading ? "Odesílám..." : "Odeslat odkaz"}
                                        </button>
                                    </form>
                                </>
                            ) : (
                                // Potvrzení: e-mail byl odeslán
                                <div style={{ textAlign: "center", padding: "16px 0" }}>
                                    <div style={{
                                        width: 64, height: 64,
                                        background: "#D6EDDF",
                                        borderRadius: "50%",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        margin: "0 auto 20px",
                                    }}>
                                        <Mail size={28} color="#2d7a2d" strokeWidth={1.5} />
                                    </div>
                                    <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a3d1a", margin: "0 0 10px" }}>
                                        Zkontrolujte e-mail
                                    </h2>
                                    <p style={{ fontSize: 14, color: "#5a7a5a", lineHeight: 1.6, margin: "0 0 8px" }}>
                                        Pokud účet s adresou <strong style={{ color: "#1a3d1a" }}>{email}</strong> existuje, poslali jsme vám odkaz pro obnovení hesla.
                                    </p>
                                    <p style={{ fontSize: 13, color: "#8aaa8a", lineHeight: 1.5, margin: "0 0 28px" }}>
                                        Zkontrolujte také složku se spamem.
                                    </p>
                                    <button
                                        style={{
                                            width: "100%", height: 48,
                                            background: "linear-gradient(135deg, #2d7a2d, #4caf50)",
                                            color: "white", border: "none", borderRadius: 12,
                                            fontSize: 15, fontWeight: 700, cursor: "pointer",
                                            boxShadow: "0 4px 14px rgba(45,122,45,0.3)",
                                        }}
                                        onClick={() => navigate("/")}
                                    >
                                        Zpět na přihlášení
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default ForgotPasswordPage;