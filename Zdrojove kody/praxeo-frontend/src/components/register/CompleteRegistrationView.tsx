import React, { useState } from "react";
import { UserCheck } from "lucide-react";
import FormCard from "../common/FormCard";
import PrimaryButton from "../common/PrimaryButton";
import ErrorAlert from "../common/ErrorAlert";
import NameFields from "./NameFields";
import TermsCheckbox from "./TermsCheckbox";
import {
    FormHeader,
    FormHint,
    inputStyle,
    labelStyle,
    errorFieldStyle,
    applyFocusStyle,
    clearFocusStyle,
} from "../../components/form";

interface CompleteRegistrationViewProps {
    role?: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
    companyName: string;
    password: string;
    agreedToTerms: boolean;
    loading: boolean;
    errorMessage?: string;
    tokenInvalid?: boolean;
    setFirstName: (value: string) => void;
    setLastName: (value: string) => void;
    setStudentNumber: (value: string) => void;
    setCompanyName: (value: string) => void;
    setPassword: (value: string) => void;
    setAgreedToTerms: (value: boolean) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

const CompleteRegistrationView: React.FC<CompleteRegistrationViewProps> = ({
                                                                               role,
                                                                               firstName,
                                                                               lastName,
                                                                               studentNumber,
                                                                               companyName,
                                                                               password,
                                                                               agreedToTerms,
                                                                               loading,
                                                                               errorMessage,
                                                                               tokenInvalid,
                                                                               setFirstName,
                                                                               setLastName,
                                                                               setStudentNumber,
                                                                               setCompanyName,
                                                                               setPassword,
                                                                               setAgreedToTerms,
                                                                               handleSubmit,
                                                                           }) => {
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const normalizedRole = role?.toUpperCase() ?? "";
    const isStudent = normalizedRole.includes("STUDENT");
    const isExternalWorker = normalizedRole.includes("EXTERNAL_WORKER");

    const roleLabel = isStudent
        ? "Student"
        : isExternalWorker
            ? "Externista"
            : role ?? "";

    // Validace hesla
    const passwordTooShort = password.length > 0 && password.length < 8;
    const passwordMissingNumber = password.length > 0 && !/\d/.test(password);
    const passwordInvalid = passwordTooShort || passwordMissingNumber;

    // Kontrola shody hesel
    const passwordMismatch =
        passwordConfirmation.length > 0 && password !== passwordConfirmation;

    // Stav tlačítka odeslání
    const isSubmitDisabled =
        loading ||
        !agreedToTerms ||
        password.length < 8 ||
        !/\d/.test(password) ||
        password !== passwordConfirmation;

    // Styl badge podle role
    const roleBadgeStyle: React.CSSProperties = {
        background: isStudent ? "#D6EDDF" : "#e3f2fd",
        color: isStudent ? "#2d7a2d" : "#1565c0",
        fontSize: 12,
        fontWeight: 600,
        padding: "3px 10px",
        borderRadius: 20,
        display: "inline-block",
    };

    // Styl pole hesla s chybovým stavem
    const passwordFieldStyle: React.CSSProperties = {
        ...inputStyle,
        ...(passwordInvalid ? errorFieldStyle : {}),
    };

    // Styl pole potvrzení hesla
    const passwordConfirmationStyle: React.CSSProperties = {
        ...inputStyle,
        ...(passwordMismatch ? errorFieldStyle : {}),
    };

    // Zvýraznění pole při focusu
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        const target = e.currentTarget;

        const isInvalidField =
            (target.name === "password" && passwordInvalid) ||
            (target.name === "passwordConfirmation" && passwordMismatch);

        if (isInvalidField) {
            target.style.border = "1.5px solid #e24b4a";
            target.style.boxShadow = "0 0 0 3px rgba(226,75,74,0.12)";
            target.style.background = "#fff8f8";
            return;
        }

        applyFocusStyle(target);
    };

    // Návrat pole do výchozího stavu po blur
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const target = e.currentTarget;

        const isInvalidField =
            (target.name === "password" && passwordInvalid) ||
            (target.name === "passwordConfirmation" && passwordMismatch);

        clearFocusStyle(target, isInvalidField);
    };

    // Zobrazení chyby při neplatném nebo již použitém tokenu
    if (tokenInvalid) {
        return (
            <FormCard maxWidth={520} padding={32}>
                <p style={{ textAlign: "center", color: "#e24b4a", fontSize: 15, fontWeight: 600 }}>
                    Tento odkaz již není platný nebo byl použit.
                </p>
            </FormCard>
        );
    }

    return (
        <FormCard maxWidth={520} padding={32}>
            <FormHeader
                icon={<UserCheck size={14} color="#1F8A4D" strokeWidth={2.2} />}
                title="Dokončení registrace"
                subtitle="Nastavte své jméno a heslo pro přihlášení"
                marginBottom={24}
            />

            {/* Role uživatele */}
            {roleLabel && (
                <div style={{ marginBottom: 16 }}>
                    <span style={roleBadgeStyle}>{roleLabel}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} autoComplete="off">
                <NameFields
                    firstName={firstName}
                    lastName={lastName}
                    setFirstName={setFirstName}
                    setLastName={setLastName}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />

                {/* Pole podle role */}
                {isStudent && (
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Číslo studenta</label>
                        <input
                            style={inputStyle}
                            placeholder="A24B0001P"
                            value={studentNumber}
                            onChange={(e) => setStudentNumber(e.target.value)}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            autoComplete="off"
                            required
                        />
                    </div>
                )}

                {isExternalWorker && (
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Název firmy / organizace</label>
                        <input
                            style={inputStyle}
                            placeholder="Firma s.r.o."
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            autoComplete="off"
                            required
                        />
                    </div>
                )}

                {/* Heslo */}
                <div style={{ marginBottom: 6 }}>
                    <label style={labelStyle}>Heslo</label>
                    <input
                        type="password"
                        name="password"
                        autoComplete="new-password"
                        style={passwordFieldStyle}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        required
                    />
                </div>

                {passwordTooShort && (
                    <FormHint variant="error">
                        Heslo musí mít alespoň 8 znaků.
                    </FormHint>
                )}

                {passwordMissingNumber && (
                    <FormHint variant="error">
                        Heslo musí obsahovat alespoň jedno číslo.
                    </FormHint>
                )}

                {!passwordInvalid && (
                    <FormHint variant="muted">
                        Minimálně 8 znaků a jedno číslo
                    </FormHint>
                )}

                {/* Potvrzení hesla */}
                <div style={{ marginBottom: 20, marginTop: 12 }}>
                    <label style={labelStyle}>Potvrzení hesla</label>
                    <input
                        type="password"
                        name="passwordConfirmation"
                        autoComplete="new-password"
                        style={passwordConfirmationStyle}
                        placeholder="••••••••"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        required
                    />

                    {passwordMismatch && (
                        <FormHint variant="error">
                            Hesla se neshodují.
                        </FormHint>
                    )}
                </div>

                {/* Chyba z backendu */}
                {errorMessage && (
                    <ErrorAlert message={errorMessage} marginBottom={16} />
                )}

                <TermsCheckbox
                    checked={agreedToTerms}
                    onChange={setAgreedToTerms}
                />

                <PrimaryButton type="submit" disabled={isSubmitDisabled}>
                    {loading ? "Ukládám..." : "Dokončit registraci"}
                </PrimaryButton>
            </form>
        </FormCard>
    );
};

export default CompleteRegistrationView;