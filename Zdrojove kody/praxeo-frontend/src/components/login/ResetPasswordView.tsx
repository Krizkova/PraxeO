import React, { useMemo } from "react";

interface Props {
    password: string;
    password2: string;
    loading: boolean;
    setPassword: (v: string) => void;
    setPassword2: (v: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

const ResetPasswordView: React.FC<Props> = ({
                                                password,
                                                password2,
                                                loading,
                                                setPassword,
                                                setPassword2,
                                                handleSubmit
                                            }) => {

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
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <input
                    type="password"
                    className={inputClass(
                        password.length < 8 || !/\d/.test(password)
                    )}
                    placeholder="Nové heslo"
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

            <button
                className="btn btn-success w-100"
                disabled={!validation.isValid || loading}
            >
                {loading ? "Ukládám..." : "Nastavit nové heslo"}
            </button>
        </form>
    );
};

export default ResetPasswordView;
