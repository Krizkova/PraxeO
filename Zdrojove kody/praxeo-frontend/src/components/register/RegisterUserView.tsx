import React from "react";
import { MailCheck, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FormCard from "../common/FormCard";
import PrimaryButton from "../common/PrimaryButton";
import ErrorAlert from "../common/ErrorAlert";
import StepList from "./StepList";
import SuccessState from "./SuccessState";
import {
    FormHeader,
    FormField,
    inputStyle,
    errorFieldStyle,
    applyFocusStyle,
    clearFocusStyle,
} from "../../components/form";

interface RegisterUserViewProps {
    formData: {
        email: string;
        role: string;
    };
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    isAdminOrTeacher: boolean;
    roleSelect: string;
    onRoleChange: (role: string) => void;
    emailError?: string;
    generalError?: string;
    successMessage?: string;
    loading?: boolean;
    sent: boolean;
    onAddAnotherUser: () => void;
}

const RegisterUserView: React.FC<RegisterUserViewProps> = ({
                                                               formData,
                                                               onChange,
                                                               onSubmit,
                                                               isAdminOrTeacher,
                                                               roleSelect,
                                                               onRoleChange,
                                                               emailError,
                                                               generalError,
                                                               successMessage,
                                                               loading = false,
                                                               sent,
                                                               onAddAnotherUser,
                                                           }) => {
    const navigate = useNavigate();

    const emailValue = formData.email.trim();
    const normalizedEmail = emailValue.toLowerCase();

    // Pro admina/učitele kontrolujeme doménu jen při vytváření učitele.
    // Pro běžnou registraci studenta zůstává @osu.cz povinné.
    const requiresOsuEmail = isAdminOrTeacher
        ? roleSelect === "TEACHER"
        : true;

    const emailInvalid =
        !!emailValue &&
        requiresOsuEmail &&
        !/^[a-zA-Z0-9._%+-]+@osu\.cz$/.test(normalizedEmail);

    const hasEmailError = !!emailError || emailInvalid;
    const isFormValid = !!emailValue && !hasEmailError && !loading;

    // Texty podle typu registrace
    const steps = isAdminOrTeacher
        ? [
            "Vyplníte e-mail nového uživatele",
            "Zvolíte roli uživatele",
            "Odešleme mu odkaz pro dokončení registrace",
        ]
        : [
            "Zadejte svůj univerzitní e-mail",
            "Odešleme vám registrační odkaz",
            "Dokončíte registraci a nastavíte heslo",
        ];

    const introText = isAdminOrTeacher
        ? "Zadejte e-mail a roli nového uživatele. Pošleme mu odkaz pro dokončení registrace."
        : "Zadejte svůj univerzitní e-mail. Pošleme vám odkaz pro dokončení registrace.";

    const formTitle = isAdminOrTeacher ? "Pozvat uživatele" : "Registrace účtu";

    const formSubtitle = isAdminOrTeacher
        ? "Vyplňte údaje pro nového uživatele"
        : "Použijte svůj univerzitní e-mail";

    const emailHelpText = isAdminOrTeacher
        ? roleSelect === "TEACHER"
            ? "U učitele použijte univerzitní adresu @osu.cz"
            : "Zadejte e-mail nového uživatele"
        : "Použijte svou univerzitní adresu @osu.cz";

    const emailFieldError = emailError
        ? emailError
        : emailInvalid
            ? isAdminOrTeacher && roleSelect === "TEACHER"
                ? "Učitel musí mít univerzitní adresu @osu.cz"
                : "Použijte svou univerzitní adresu @osu.cz"
            : undefined;

    // Styl pro select pole
    const selectStyle: React.CSSProperties = {
        ...inputStyle,
        appearance: "none",
    };

    // Styl e-mailového pole s podporou chybového stavu
    const emailFieldStyle: React.CSSProperties = {
        ...inputStyle,
        ...(hasEmailError ? errorFieldStyle : {}),
    };

    // Styl tlačítka pro přechod na přihlášení
    const loginButtonStyle: React.CSSProperties = {
        background: "none",
        border: "none",
        padding: 0,
        margin: 0,
        fontSize: 13,
        color: "#2d7a2d",
        cursor: "pointer",
        fontWeight: 600,
        fontFamily: "inherit",
    };

    // Zvýraznění pole při focusu
    const handleFocus = (
        e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const target = e.currentTarget;
        const isEmailInput =
            target instanceof HTMLInputElement && target.name === "email";

        if (isEmailInput && hasEmailError) {
            target.style.border = "1.5px solid #e24b4a";
            target.style.boxShadow = "0 0 0 3px rgba(226,75,74,0.12)";
            target.style.background = "#fff8f8";
            return;
        }

        applyFocusStyle(target);
    };

    // Návrat pole do výchozího stavu při blur
    const handleBlur = (
        e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const target = e.currentTarget;
        const isEmailInput =
            target instanceof HTMLInputElement && target.name === "email";

        clearFocusStyle(target, isEmailInput && hasEmailError);
    };

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "1fr 420px",
                gap: 56,
                alignItems: "start",
            }}
        >
            {/* Levý informační sloupec */}
            <div style={{ paddingTop: 8 }}>
                <p
                    style={{
                        fontSize: 15,
                        color: "#5a7a5a",
                        lineHeight: 1.7,
                        margin: "0 0 36px",
                    }}
                >
                    {introText}
                </p>

                <StepList items={steps} />
            </div>

            {/* Pravý sloupec s formulářem */}
            <FormCard maxWidth={420} padding={32}>
                {sent ? (
                    <SuccessState
                        message={successMessage}
                        buttonText={isAdminOrTeacher ? "Přidat dalšího uživatele" : "Pokračovat na přihlášení"}
                        onContinue={isAdminOrTeacher ? onAddAnotherUser : () => navigate("/", { replace: true })}
                    />
                ) : (
                    <>
                        {/* Záhlaví formuláře */}
                        <FormHeader
                            icon={
                                isAdminOrTeacher ? (
                                    <UserPlus size={14} color="#1F8A4D" strokeWidth={2.2} />
                                ) : (
                                    <MailCheck size={14} color="#1F8A4D" strokeWidth={2.2} />
                                )
                            }
                            title={formTitle}
                            subtitle={formSubtitle}
                        />

                        {/* Obecná chyba z backendu */}
                        {generalError && (
                            <ErrorAlert message={generalError} marginBottom={16} />
                        )}

                        <form onSubmit={onSubmit}>
                            {/* Výběr role pro admina nebo učitele */}
                            {isAdminOrTeacher && (
                                <FormField label="Role uživatele" marginBottom={16}>
                                    <select
                                        style={selectStyle}
                                        value={roleSelect}
                                        onChange={(e) => onRoleChange(e.target.value)}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                    >
                                        <option value="TEACHER">Učitel</option>
                                        <option value="EXTERNAL_WORKER">Externista</option>
                                    </select>
                                </FormField>
                            )}

                            {/* E-mail s validací a helper textem */}
                            <FormField
                                label="E-mail"
                                htmlFor="email"
                                required
                                marginBottom={6}
                                error={emailFieldError}
                                hint={!hasEmailError ? emailHelpText : undefined}
                                hintVariant="muted"
                            >
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    style={emailFieldStyle}
                                    placeholder={
                                        requiresOsuEmail
                                            ? "jan.pavel@osu.cz"
                                            : "jan.novak@example.com"
                                    }
                                    value={formData.email}
                                    onChange={onChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    required
                                />
                            </FormField>

                            <PrimaryButton type="submit" disabled={!isFormValid}>
                                {loading ? "Odesílám..." : "Odeslat odkaz"}
                            </PrimaryButton>

                            {/* Odkaz na přihlášení pro běžného uživatele */}
                            {!isAdminOrTeacher && (
                                <div style={{ textAlign: "center", marginTop: 16 }}>
                                    <span style={{ fontSize: 13, color: "#6b8f6b" }}>
                                        Máte účet?{" "}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() => navigate("/")}
                                        style={loginButtonStyle}
                                    >
                                        Přihlásit se
                                    </button>
                                </div>
                            )}
                        </form>
                    </>
                )}
            </FormCard>
        </div>
    );
};

export default RegisterUserView;