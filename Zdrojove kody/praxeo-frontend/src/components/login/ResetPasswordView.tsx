import React from "react";
import { KeyRound, LockKeyhole } from "lucide-react";
import FormCard from "../common/FormCard";
import PrimaryButton from "../common/PrimaryButton";
import ErrorAlert from "../common/ErrorAlert";
import {
    FormHeader,
    FormHint,
    inputStyle,
    labelStyle,
    errorFieldStyle,
    applyFocusStyle,
    clearFocusStyle,
} from "../../components/form";

interface Props {
    password: string;
    password2: string;
    loading: boolean;
    errorMessage?: string;
    tokenInvalid?: boolean;
    setPassword: (v: string) => void;
    setPassword2: (v: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

const ResetPasswordView: React.FC<Props> = ({
                                                password,
                                                password2,
                                                loading,
                                                errorMessage,
                                                tokenInvalid,
                                                setPassword,
                                                setPassword2,
                                                handleSubmit,
                                            }) => {
    // Validace hesla
    const passwordInvalid =
        password.length > 0 && (password.length < 8 || !/\d/.test(password));

    // Kontrola shody hesel
    const matchInvalid = password2.length > 0 && password !== password2;

    // Stav tlačítka odeslání
    const isDisabled =
        loading ||
        password.length < 8 ||
        !/\d/.test(password) ||
        password !== password2;

    // Společný styl pro pole s ikonou vlevo
    const fieldWithIconStyle: React.CSSProperties = {
        ...inputStyle,
        paddingLeft: 42,
    };

    // Styl pole hesla s podporou chybového stavu
    const passwordFieldStyle: React.CSSProperties = {
        ...fieldWithIconStyle,
        ...(passwordInvalid ? errorFieldStyle : {}),
    };

    // Styl pole pro potvrzení hesla
    const matchFieldStyle: React.CSSProperties = {
        ...fieldWithIconStyle,
        ...(matchInvalid ? errorFieldStyle : {}),
    };

    // Společný styl ikon uvnitř polí
    const fieldIconStyle: React.CSSProperties = {
        position: "absolute",
        left: 12,
        top: "50%",
        transform: "translateY(-50%)",
        color: "#7FA487",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
    };

    // Zvýraznění pole při focusu
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        applyFocusStyle(e.currentTarget);
    };

    // Obnovení stylu pole hesla po blur
    const handlePasswordBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        clearFocusStyle(e.currentTarget, passwordInvalid);
    };

    // Obnovení stylu pole potvrzení hesla po blur
    const handleMatchBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        clearFocusStyle(e.currentTarget, matchInvalid);
    };

    // Zobrazení chyby při neplatném nebo vypršelém tokenu
    if (tokenInvalid) {
        return (
            <FormCard maxWidth={460}>
                <p style={{ textAlign: "center", color: "#e24b4a", fontSize: 15, fontWeight: 600 }}>
                    Tento odkaz již není platný nebo byl použit.
                </p>
            </FormCard>
        );
    }

    return (
        <FormCard maxWidth={460}>
            <FormHeader
                icon={<KeyRound size={14} color="#1F8A4D" strokeWidth={2.2} />}
                title="Nastavte nové heslo"
                subtitle="Zvolte si bezpečné heslo pro váš účet"
                marginBottom={28}
            />

            <form onSubmit={handleSubmit}>
                {/* Pole nového hesla */}
                <div style={{ marginBottom: 6 }}>
                    <label style={labelStyle}>Nové heslo</label>

                    <div style={{ position: "relative" }}>
                        <div
                            style={{
                                ...fieldIconStyle,
                                color: passwordInvalid ? "#e24b4a" : "#7FA487",
                            }}
                        >
                            <LockKeyhole size={15} />
                        </div>

                        <input
                            type="password"
                            autoComplete="new-password"
                            style={passwordFieldStyle}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={handleFocus}
                            onBlur={handlePasswordBlur}
                            required
                            aria-invalid={passwordInvalid}
                            aria-describedby={
                                passwordInvalid
                                    ? "password-rules-error"
                                    : "password-rules-help"
                            }
                        />
                    </div>
                </div>

                {password.length > 0 && password.length < 8 && (
                    <FormHint id="password-rules-error" variant="error">
                        Heslo musí mít alespoň 8 znaků.
                    </FormHint>
                )}

                {password.length > 0 && !/\d/.test(password) && (
                    <FormHint variant="error">
                        Heslo musí obsahovat alespoň jedno číslo.
                    </FormHint>
                )}

                {!passwordInvalid && (
                    <FormHint id="password-rules-help" variant="muted">
                        Minimálně 8 znaků a jedno číslo
                    </FormHint>
                )}

                {/* Pole pro potvrzení hesla */}
                <div style={{ marginBottom: 20, marginTop: 12 }}>
                    <label style={labelStyle}>Potvrzení hesla</label>

                    <div style={{ position: "relative" }}>
                        <div
                            style={{
                                ...fieldIconStyle,
                                color: matchInvalid ? "#e24b4a" : "#7FA487",
                            }}
                        >
                            <LockKeyhole size={15} />
                        </div>

                        <input
                            type="password"
                            autoComplete="new-password"
                            style={matchFieldStyle}
                            placeholder="••••••••"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            onFocus={handleFocus}
                            onBlur={handleMatchBlur}
                            required
                            aria-invalid={matchInvalid}
                            aria-describedby={
                                matchInvalid ? "password-match-error" : undefined
                            }
                        />
                    </div>

                    {matchInvalid && (
                        <FormHint id="password-match-error" variant="error">
                            Hesla se neshodují.
                        </FormHint>
                    )}
                </div>

                {/* Chyba z backendu */}
                {errorMessage && <ErrorAlert message={errorMessage} marginBottom={16} />}

                <PrimaryButton type="submit" disabled={isDisabled}>
                    {loading ? "Ukládám..." : "Nastavit nové heslo"}
                </PrimaryButton>
            </form>
        </FormCard>
    );
};

export default ResetPasswordView;