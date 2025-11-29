import React from "react";

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

    console.log("CompleteRegistrationView role:", role);

    const isStudent = role?.toUpperCase().includes("STUDENT");
    const isExternal = role?.toUpperCase().includes("EXTERNAL_WORKER");

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
                    className="form-control"
                    placeholder="Heslo"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
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

            <button className="btn btn-success w-100" disabled={loading || !agreedToTerms}>
                {loading ? "Ukládám..." : "Dokončit registraci"}
            </button>
        </form>
    );
};

export default CompleteRegistrationView;
