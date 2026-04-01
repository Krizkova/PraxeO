import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
    formData: { email: string; role: string; };
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    isAdminOrTeacher: boolean;
    roleSelect: string;
    onRoleChange: (role: string) => void;
}

const RegisterUserView: React.FC<Props> = ({
                                               formData, onChange, onSubmit, isAdminOrTeacher, roleSelect, onRoleChange
                                           }) => {
    const navigate = useNavigate();

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.border = "1px solid #1F8A4D";
        e.target.style.boxShadow = "0 0 0 3px rgba(31,138,77,0.1)";
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.border = "1px solid #D9E2D9";
        e.target.style.boxShadow = "none";
    };

    const s = {
        input: { width: "100%", height: 48, background: "white", border: "1px solid #D9E2D9", borderRadius: 12, padding: "0 14px", fontSize: 14, color: "#1E2430", outline: "none", boxSizing: "border-box" as const },
        select: { width: "100%", height: 48, background: "white", border: "1px solid #D9E2D9", borderRadius: 12, padding: "0 14px", fontSize: 14, color: "#1E2430", outline: "none", boxSizing: "border-box" as const } as React.CSSProperties,
        label: { fontSize: 12, fontWeight: 500, color: "#1E2430", display: "block", marginBottom: 6 } as React.CSSProperties,
        btn: { width: "100%", height: 48, background: "#1F8A4D", color: "white", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 500, cursor: "pointer" } as React.CSSProperties,
        hint: { fontSize: 11, color: "#A0A9A0", marginTop: 5 } as React.CSSProperties,
        card: { background: "white", borderRadius: 18, border: "0.5px solid #D9E2D9", padding: 32 } as React.CSSProperties,
    };

    const emailInvalid = !isAdminOrTeacher && formData.email.length > 0 && !formData.email.endsWith("@osu.cz");

    if (isAdminOrTeacher) {
        return (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 48, alignItems: "start" }}>
                <div style={{ paddingTop: 8 }}>
                    <h2 style={{ fontSize: 26, fontWeight: 500, color: "#1E2430", margin: "0 0 12px" }}>Registrace uživatelů</h2>
                    <p style={{ fontSize: 15, color: "#667085", lineHeight: 1.7, margin: "0 0 16px" }}>
                        Zadejte e-mail a roli nového uživatele. Pošleme mu odkaz pro dokončení registrace.
                    </p>
                    <p style={{ fontSize: 14, color: "#667085", lineHeight: 1.7, margin: 0 }}>
                        Uživatel obdrží e-mail s odkazem, kde si nastaví své jméno a heslo.
                    </p>
                </div>
                <div style={s.card}>
                    <h2 style={{ fontSize: 18, fontWeight: 500, color: "#1E2430", margin: "0 0 20px" }}>Přidat uživatele</h2>
                    <form onSubmit={onSubmit}>
                        <div style={{ marginBottom: 16 }}>
                            <label style={s.label}>Role uživatele</label>
                            <select style={s.select} value={roleSelect} onChange={e => onRoleChange(e.target.value)}>
                                <option value="TEACHER">Učitel</option>
                                <option value="EXTERNAL_WORKER">Externista</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: 6 }}>
                            <label style={s.label}>E-mail</label>
                            <input
                                type="email"
                                name="email"
                                style={s.input}
                                placeholder="jan.pavel@osu.cz"
                                value={formData.email}
                                onChange={onChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                required
                            />
                            <p style={s.hint}>Zadejte e-mail nového uživatele</p>
                        </div>
                        <button style={{ ...s.btn, marginTop: 8 }} type="submit">Odeslat odkaz</button>
                    </form>
                </div>
            </div>
        );
    }

    const steps = [
        { n: 1, title: "Zadejte e-mail", sub: "Použijte svou adresu @osu.cz", active: true },
        { n: 2, title: "Zkontrolujte e-mail", sub: "Pošleme vám odkaz pro dokončení", active: false },
        { n: 3, title: "Nastavte heslo a přihlaste se", sub: "Po kliknutí na odkaz si zvolíte heslo", active: false },
    ];

    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 48, alignItems: "start" }}>
            <div style={{ paddingTop: 8 }}>
                <h2 style={{ fontSize: 26, fontWeight: 500, color: "#1E2430", margin: "0 0 12px" }}>Registrace</h2>
                <p style={{ fontSize: 15, color: "#667085", lineHeight: 1.7, margin: "0 0 32px" }}>
                    Zadejte svůj univerzitní e-mail. Pošleme vám odkaz pro dokončení registrace.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {steps.map(step => (
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
            <div style={s.card}>
                <h2 style={{ fontSize: 18, fontWeight: 500, color: "#1E2430", margin: "0 0 4px" }}>Vytvořit účet</h2>
                <p style={{ fontSize: 13, color: "#667085", margin: "0 0 24px" }}>Zadejte e-mail pro zahájení registrace</p>
                <form onSubmit={onSubmit}>
                    <div style={{ marginBottom: 6 }}>
                        <label style={s.label}>E-mail</label>
                        <input
                            type="email"
                            name="email"
                            style={{ ...s.input, ...(emailInvalid ? { border: "1px solid #e24b4a" } : {}) }}
                            placeholder="jan.pavel@osu.cz"
                            value={formData.email}
                            onChange={onChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            required
                        />
                        {emailInvalid ? (
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginTop: 6 }}>
                                <span style={{ color: "#e24b4a", fontSize: 14, flexShrink: 0 }}>!</span>
                                <p style={{ fontSize: 11, color: "#e24b4a", margin: 0, lineHeight: 1.5 }}>
                                    Použijte svou univerzitní adresu končící na @osu.cz
                                </p>
                            </div>
                        ) : (
                            <p style={s.hint}>Použijte svou univerzitní adresu @osu.cz</p>
                        )}
                    </div>
                    <button style={{ ...s.btn, marginTop: 8 }} type="submit">Odeslat odkaz</button>
                    <div style={{ textAlign: "center", marginTop: 16 }}>
                        <span style={{ fontSize: 13, color: "#667085" }}>Máte účet? </span>
                        <span onClick={() => navigate("/")} style={{ fontSize: 13, color: "#1F8A4D", cursor: "pointer", fontWeight: 500 }}>
                            Přihlásit se
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterUserView;