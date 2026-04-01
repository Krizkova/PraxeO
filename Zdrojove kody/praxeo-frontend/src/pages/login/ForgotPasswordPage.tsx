import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../api/userApi";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

const ForgotPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const s = {
        page: { background: "#F0F4F0", minHeight: "calc(100vh - 56px)", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "52px 24px" } as React.CSSProperties,
        card: { width: "100%", background: "white", borderRadius: 18, border: "0.5px solid #D9E2D9", padding: 36 } as React.CSSProperties,
        label: { fontSize: 12, fontWeight: 500, color: "#1E2430", display: "block", marginBottom: 6 } as React.CSSProperties,
        input: { width: "100%", height: 48, background: "white", border: "1px solid #D9E2D9", borderRadius: 12, padding: "0 14px", fontSize: 14, color: "#1E2430", outline: "none", boxSizing: "border-box" as const },
        inputError: { border: "1px solid #e24b4a" } as React.CSSProperties,
        btn: { width: "100%", height: 48, background: "#1F8A4D", color: "white", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 500, cursor: "pointer" } as React.CSSProperties,
        btnDisabled: { opacity: 0.5, cursor: "not-allowed" } as React.CSSProperties,
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.border = "1px solid #1F8A4D";
        e.target.style.boxShadow = "0 0 0 3px rgba(31,138,77,0.1)";
        setError("");
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.border = error ? "1px solid #e24b4a" : "1px solid #D9E2D9";
        e.target.style.boxShadow = "none";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await forgotPassword({ email });
            setSent(true);
        } catch (err: any) {
            const msg = err.response?.data?.message || "";
            if (msg.includes("neexistuje") || msg.includes("nenalezen")) {
                setError("Účet s tímto e-mailem nebyl nalezen. Zkontrolujte adresu nebo se zaregistrujte.");
            } else {
                setError("Nastala neočekávaná chyba. Zkuste to prosím znovu.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div style={{ background: "#F0F4F0", minHeight: "calc(100vh - 56px)", padding: "52px 32px" }}>
                <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                <span
                    onClick={() => navigate(-1)}
                    style={{ fontSize: 13, color: "#1F8A4D", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 24 }}
                >
                    ← Zpět
                </span>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 48, alignItems: "start" }}>
                        {/* Левая часть */}
                        <div style={{ paddingTop: 8 }}>
                            <h2 style={{ fontSize: 26, fontWeight: 500, color: "#1E2430", margin: "0 0 12px" }}>Obnovení hesla</h2>
                            <p style={{ fontSize: 15, color: "#667085", lineHeight: 1.7, margin: "0 0 32px" }}>
                                Zapomněli jste heslo? Zadejte svůj e-mail a pošleme vám odkaz pro obnovení.
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                {[
                                    { n: 1, title: "Zadejte e-mail", sub: "Použijte e-mail, se kterým jste registrováni", active: true },
                                    { n: 2, title: "Zkontrolujte e-mail", sub: "Pošleme vám odkaz pro obnovení hesla", active: false },
                                    { n: 3, title: "Nastavte nové heslo", sub: "Po kliknutí na odkaz si zvolíte nové heslo", active: false },
                                ].map(step => (
                                    <div key={step.n} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                                        <div style={{ width: 28, height: 28, background: step.active ? "#1F8A4D" : "#D6EDDF", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                                            <span style={{ color: step.active ? "white" : "#1F8A4D", fontSize: 12, fontWeight: 500 }}>{step.n}</span>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: 14, fontWeight: 500, color: "#1E2430", margin: "0 0 2px" }}>{step.title}</p>
                                            <p style={{ fontSize: 13, color: "#667085", margin: 0 }}>{step.sub}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Правая часть — карточка */}
                        <div style={{ background: "white", borderRadius: 18, border: "0.5px solid #D9E2D9", padding: 32 }}>
                            {!sent ? (
                                <>
                                    <div style={{ width: 48, height: 48, background: "#D6EDDF", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <rect x="3" y="6" width="14" height="10" rx="2" stroke="#1F8A4D" strokeWidth="1.5"/>
                                            <polyline points="3,6 10,12 17,6" stroke="#1F8A4D" strokeWidth="1.5" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                    <h2 style={{ fontSize: 18, fontWeight: 500, color: "#1E2430", margin: "0 0 4px" }}>Obnovení hesla</h2>
                                    <p style={{ fontSize: 13, color: "#667085", margin: "0 0 24px" }}>Zadejte svůj e-mail pro obnovení přístupu</p>
                                    <form onSubmit={handleSubmit}>
                                        <div style={{ marginBottom: 6 }}>
                                            <label style={{ fontSize: 12, fontWeight: 500, color: "#1E2430", display: "block", marginBottom: 6 }}>E-mail</label>
                                            <input
                                                type="email"
                                                style={{ ...s.input, ...(error ? s.inputError : {}) }}
                                                placeholder="jan.pavel@osu.cz"
                                                value={email}
                                                onChange={e => { setEmail(e.target.value); setError(""); }}
                                                onFocus={handleFocus}
                                                onBlur={handleBlur}
                                                required
                                            />
                                            {error && (
                                                <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginTop: 6 }}>
                                                    <span style={{ color: "#e24b4a", fontSize: 14, flexShrink: 0 }}>!</span>
                                                    <p style={{ fontSize: 11, color: "#e24b4a", margin: 0, lineHeight: 1.5 }}>{error}</p>
                                                </div>
                                            )}
                                        </div>
                                        <button type="submit" style={{ ...s.btn, ...(loading ? s.btnDisabled : {}), marginTop: 20 }} disabled={loading}>
                                            {loading ? "Odesílám..." : "Odeslat odkaz"}
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ width: 64, height: 64, background: "#D6EDDF", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                            <rect x="4" y="8" width="20" height="14" rx="2" stroke="#1F8A4D" strokeWidth="1.8"/>
                                            <polyline points="4,8 14,17 24,8" stroke="#1F8A4D" strokeWidth="1.8" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                    <h2 style={{ fontSize: 20, fontWeight: 500, color: "#1E2430", margin: "0 0 10px" }}>Zkontrolujte e-mail</h2>
                                    <p style={{ fontSize: 14, color: "#667085", lineHeight: 1.6, margin: "0 0 28px" }}>
                                        Poslali jsme instrukce na <strong style={{ color: "#1E2430" }}>{email}</strong>
                                    </p>
                                    <button style={s.btn} onClick={() => navigate("/")}>Zpět na přihlášení</button>
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