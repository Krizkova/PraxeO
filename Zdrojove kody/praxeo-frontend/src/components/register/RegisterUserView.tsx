import React from "react";
import { useNavigate } from "react-router-dom";
import { Mail, CircleAlert } from "lucide-react";

interface Props {
    formData: { email: string; role: string };
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    isAdminOrTeacher: boolean;
    roleSelect: string;
    onRoleChange: (role: string) => void;
    emailError: string;
    generalError: string;
    successMessage: string;
    loading: boolean;
}

const RegisterUserView: React.FC<Props> = ({
                                               formData,
                                               onChange,
                                               onSubmit,
                                               isAdminOrTeacher,
                                               roleSelect,
                                               onRoleChange,
                                               emailError,
                                               generalError,
                                               successMessage,
                                               loading,
                                           }) => {
    const navigate = useNavigate();

    // Validace e-mailu pro studentskou registraci
    const emailInvalid =
        !isAdminOrTeacher &&
        formData.email.length > 0 &&
        !formData.email.endsWith("@osu.cz");

    const hasEmailError = !!emailError || emailInvalid;
    const isFormValid = formData.email.trim().length > 0 && !emailInvalid && !loading;

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

    const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.target.style.border = "1.5px solid #2d7a2d";
        e.target.style.boxShadow = "0 0 0 3px rgba(45,122,45,0.1)";
        (e.target as any).style.background = "#fcfffc";
    };

    const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.target.style.border = hasEmailError ? "1.5px solid #e24b4a" : "1.5px solid #d0e8d0";
        e.target.style.boxShadow = "none";
        (e.target as any).style.background = "white";
    };

    const gradientBtn: React.CSSProperties = {
        width: "100%",
        height: 48,
        background: isFormValid
            ? "linear-gradient(135deg, #2d7a2d, #4caf50)"
            : "#c8dfc8",
        color: "white",
        border: "none",
        borderRadius: 12,
        fontSize: 15,
        fontWeight: 700,
        cursor: isFormValid ? "pointer" : "not-allowed",
        marginTop: 8,
        boxShadow: isFormValid ? "0 4px 14px rgba(45,122,45,0.3)" : "none",
        transition: "opacity 0.2s",
    };

    const steps = [
        { n: 1, title: "Zadejte e-mail", sub: "Použijte svou adresu @osu.cz", active: true },
        { n: 2, title: "Zkontrolujte e-mail", sub: "Pošleme vám odkaz pro dokončení", active: false },
        { n: 3, title: "Nastavte heslo a přihlaste se", sub: "Po kliknutí na odkaz si zvolíte heslo", active: false },
    ];

    const adminSteps = [
        { n: 1, title: "Zadejte e-mail a roli", sub: "Vyberte roli a zadejte e-mail nového uživatele", active: true },
        { n: 2, title: "Odeslat pozvánku", sub: "Pošleme odkaz pro dokončení registrace", active: false },
        { n: 3, title: "Uživatel si nastaví heslo", sub: "Po kliknutí na odkaz si zvolí jméno a heslo", active: false },
    ];

    const StepList = ({ items }: { items: typeof steps }) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {items.map((step) => (
                <div key={step.n} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            background: step.active ? "linear-gradient(135deg, #2d7a2d, #4caf50)" : "white",
                            border: step.active ? "none" : "1.5px solid #d0e8d0",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            boxShadow: step.active ? "0 3px 8px rgba(45,122,45,0.25)" : "none",
                        }}
                    >
                        <span style={{ fontSize: 13, fontWeight: 700, color: step.active ? "white" : "#8aaa8a" }}>
                            {step.n}
                        </span>
                    </div>
                    <div style={{ paddingTop: 4 }}>
                        <div
                            style={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: step.active ? "#1a3d1a" : "#6b8f6b",
                                marginBottom: 3,
                            }}
                        >
                            {step.title}
                        </div>
                        <div style={{ fontSize: 13, color: "#8aaa8a", lineHeight: 1.5 }}>{step.sub}</div>
                    </div>
                </div>
            ))}
        </div>
    );

    // Pravá karta s formulářem nebo potvrzením odeslání
    const formCard = (
        <div
            style={{
                background: "white",
                borderRadius: 18,
                border: "1px solid #e0ede0",
                padding: 32,
                boxShadow: "0 4px 24px rgba(34,85,34,0.08)",
            }}
        >
            {successMessage ? (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                    <div
                        style={{
                            width: 64,
                            height: 64,
                            background: "#D6EDDF",
                            borderRadius: 16,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 20px",
                        }}
                    >
                        <Mail size={28} color="#2d7a2d" strokeWidth={1.8} />
                    </div>

                    <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a3d1a", margin: "0 0 10px" }}>
                        {isAdminOrTeacher ? "Pozvánka odeslána" : "Zkontrolujte e-mail"}
                    </h2>

                    <p style={{ fontSize: 14, color: "#5a7a5a", lineHeight: 1.6, margin: "0 0 24px" }}>
                        {successMessage}
                    </p>

                    <div style={{ display: "flex", gap: 10, flexDirection: isAdminOrTeacher ? "row" : "column" }}>
                        {isAdminOrTeacher && (
                            <button
                                onClick={() => window.location.reload()}
                                style={{
                                    flex: 1,
                                    height: 44,
                                    background: "linear-gradient(135deg, #2d7a2d, #4caf50)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 12,
                                    fontSize: 14,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    boxShadow: "0 4px 14px rgba(45,122,45,0.25)",
                                }}
                            >
                                Přidat dalšího
                            </button>
                        )}

                        <button
                            onClick={() => navigate("/")}
                            style={{
                                flex: 1,
                                height: 44,
                                background: "none",
                                color: "#2d7a2d",
                                border: "1.5px solid #2d7a2d",
                                borderRadius: 12,
                                fontSize: 14,
                                fontWeight: 700,
                                cursor: "pointer",
                            }}
                        >
                            Zpět na hlavní stránku
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a3d1a", margin: "0 0 24px" }}>
                        {isAdminOrTeacher ? "Přidat uživatele" : "Vytvořit účet"}
                    </h2>

                    {/* Obecná chyba */}
                    {generalError && (
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
                            <CircleAlert size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                            <span>{generalError}</span>
                        </div>
                    )}

                    <form onSubmit={onSubmit}>
                        {isAdminOrTeacher && (
                            <div style={{ marginBottom: 16 }}>
                                <label style={labelStyle}>Role uživatele</label>
                                <select
                                    style={{ ...inputStyle, appearance: "none" as any }}
                                    value={roleSelect}
                                    onChange={(e) => onRoleChange(e.target.value)}
                                    onFocus={onFocus as any}
                                    onBlur={onBlur as any}
                                >
                                    <option value="TEACHER">Učitel</option>
                                    <option value="EXTERNAL_WORKER">Externista</option>
                                </select>
                            </div>
                        )}

                        {/* E-mail s inline validací */}
                        <div style={{ marginBottom: 6 }}>
                            <label style={labelStyle}>E-mail</label>
                            <input
                                type="email"
                                name="email"
                                style={{ ...inputStyle, ...(hasEmailError ? { border: "1.5px solid #e24b4a" } : {}) }}
                                placeholder="jan.pavel@osu.cz"
                                value={formData.email}
                                onChange={onChange}
                                onFocus={onFocus as any}
                                onBlur={onBlur as any}
                                required
                            />

                            {emailError ? (
                                <p style={{ fontSize: 11, color: "#e24b4a", marginTop: 5 }}>{emailError}</p>
                            ) : emailInvalid ? (
                                <p style={{ fontSize: 11, color: "#e24b4a", marginTop: 5 }}>
                                    Použijte svou univerzitní adresu @osu.cz
                                </p>
                            ) : (
                                <p style={{ fontSize: 11, color: "#a0baa0", marginTop: 5 }}>
                                    {isAdminOrTeacher
                                        ? "Zadejte e-mail nového uživatele"
                                        : "Použijte svou univerzitní adresu @osu.cz"}
                                </p>
                            )}
                        </div>

                        <button
                            style={gradientBtn}
                            type="submit"
                            disabled={!isFormValid}
                            onMouseEnter={(e) => {
                                if (isFormValid) e.currentTarget.style.opacity = "0.9";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.opacity = "1";
                            }}
                        >
                            {loading ? "Odesílám..." : "Odeslat odkaz"}
                        </button>

                        {!isAdminOrTeacher && (
                            <div style={{ textAlign: "center", marginTop: 16 }}>
                                <span style={{ fontSize: 13, color: "#6b8f6b" }}>Máte účet? </span>
                                <span
                                    onClick={() => navigate("/")}
                                    style={{ fontSize: 13, color: "#2d7a2d", cursor: "pointer", fontWeight: 600 }}
                                >
                                    Přihlásit se
                                </span>
                            </div>
                        )}
                    </form>
                </>
            )}
        </div>
    );

    if (isAdminOrTeacher) {
        return (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 56, alignItems: "start" }}>
                <div style={{ paddingTop: 8 }}>
                    <p style={{ fontSize: 15, color: "#5a7a5a", lineHeight: 1.7, margin: "0 0 36px" }}>
                        Zadejte e-mail a roli nového uživatele. Pošleme mu odkaz pro dokončení registrace.
                    </p>
                    <StepList items={adminSteps} />
                </div>
                {formCard}
            </div>
        );
    }

    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 56, alignItems: "start" }}>
            <div style={{ paddingTop: 8 }}>
                <p style={{ fontSize: 15, color: "#5a7a5a", lineHeight: 1.7, margin: "0 0 36px" }}>
                    Zadejte svůj univerzitní e-mail. Pošleme vám odkaz pro dokončení registrace.
                </p>
                <StepList items={steps} />
            </div>
            {formCard}
        </div>
    );
};

export default RegisterUserView;