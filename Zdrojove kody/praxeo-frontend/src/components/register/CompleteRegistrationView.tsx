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
        role,
        firstName,
        lastName,
        studentNumber,
        companyName,
        password,
        agreedToTerms,
        loading,
        setFirstName,
        setLastName,
        setStudentNumber,
        setCompanyName,
        setPassword,
        setAgreedToTerms,
        handleSubmit
    } = props;

    const [password2, setPassword2] = useState("");

    const isStudent = role?.toUpperCase().includes("STUDENT");
    const isExternal = role?.toUpperCase().includes("EXTERNAL_WORKER");

    const validation = useMemo(() => {
        const errors: string[] = [];

        if (password.length < 8) errors.push("Heslo musí mít alespoň 8 znaků.");
        if (!/\d/.test(password)) errors.push("Heslo musí obsahovat alespoň jedno číslo.");
        if (password !== password2) errors.push("Hesla se neshodují.");

        return {
            isValid: errors.length === 0,
            errors
        };
    }, [password, password2]);

    const inputClass = (invalid: boolean) =>
        "form-control" + (invalid ? " is-invalid" : "");

    const showError = (msg: string) =>
        <div className="text-danger small mt-1">{msg}</div>;

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
            <div className="row mb-3">
                <div className="col-md-6">
                    <input
                        className="form-control"
                        placeholder="Jméno"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>
                <div className="col-md-6">
                    <input
                        className="form-control"
                        placeholder="Příjmení"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>
            </div>

            {isStudent && (
                <div className="mb-3">
                    <input
                        className="form-control"
                        placeholder="Studijní číslo"
                        value={studentNumber}
                        onChange={(e) => setStudentNumber(e.target.value)}
                        required
                    />
                </div>
            )}

            {isExternal && (
                <div className="mb-3">
                    <input
                        className="form-control"
                        placeholder="Název firmy"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                    />
                </div>
            )}

            <div className="mb-3">
                <input
                    type="password"
                    className={inputClass(password.length < 8 || !/\d/.test(password))}
                    placeholder="Heslo"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {password.length < 8 &&
                    showError("Heslo musí mít alespoň 8 znaků.")
                }

                {password.length > 0 && !/\d/.test(password) &&
                    showError("Heslo musí obsahovat číslo.")
                }
            </div>

            <div className="mb-3">
                <input
                    type="password"
                    className={inputClass(password !== password2)}
                    placeholder="Potvrzení hesla"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    required
                />

                {password2.length > 0 && password !== password2 &&
                    showError("Hesla se neshodují.")
                }
            </div>

            <div className="form-check mb-3">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    required
                />
                <label className="form-check-label" htmlFor="terms">
                    Souhlasím se zpracováním osobních údajů (GDPR)
                </label>
            </div>

            <button
                className="btn btn-success w-100"
                disabled={loading || !agreedToTerms || !validation.isValid}
            >
                {loading ? "Ukládám..." : "Dokončit registraci"}
            </button>
        </form>
    );
};

export default CompleteRegistrationView;
