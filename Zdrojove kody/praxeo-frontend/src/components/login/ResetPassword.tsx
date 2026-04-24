import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ResetPasswordView from "./ResetPasswordView";
import { loginUser, resetPassword, getRoleByToken } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";

const ResetPassword: React.FC = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    // Token z URL pro obnovu hesla
    const token = params.get("token") || "";

    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [tokenInvalid, setTokenInvalid] = useState(false);

    // Ověření platnosti tokenu při načtení stránky
    useEffect(() => {
        let isActive = true;

        const checkToken = async () => {
            if (!token) {
                setTokenInvalid(true);
                setErrorMessage("Tento odkaz již není platný nebo byl použit.");
                return;
            }

            try {
                await getRoleByToken(token);
            } catch (err: any) {
                if (!isActive) return;
                setTokenInvalid(true);
                setErrorMessage("Tento odkaz již není platný nebo byl použit.");
            }
        };

        checkToken();

        return () => {
            isActive = false;
        };
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");

        // Kontrola shody hesel před odesláním na backend
        if (password !== password2) {
            setErrorMessage("Hesla se neshodují.");
            return;
        }

        setLoading(true);

        try {
            const res = await resetPassword({ token, password });

            if (!res.success) {
                setErrorMessage(res.message || "Heslo se nepodařilo změnit.");
                return;
            }

            const email = res.email;
            const loginResult = await loginUser(email, password);

            if (!loginResult) {
                setErrorMessage("Heslo bylo změněno, ale přihlášení se nezdařilo.");
                return;
            }

            // Přihlášení přes AuthContext, aby se layout aktualizoval hned
            login(loginResult.token, {
                email: loginResult.email,
                role: loginResult.role,
                firstName: loginResult.firstName,
                lastName: loginResult.lastName,
            });

            navigate("/summary", { replace: true, state: { fromPasswordReset: true } });
        } catch (err: any) {
            setTokenInvalid(true);
            setErrorMessage(
                err?.response?.data?.message ||
                "Tento odkaz již není platný nebo byl použit."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ResetPasswordView
            password={password}
            password2={password2}
            loading={loading}
            errorMessage={errorMessage}
            tokenInvalid={tokenInvalid}
            setPassword={setPassword}
            setPassword2={setPassword2}
            handleSubmit={handleSubmit}
        />
    );
};

export default ResetPassword;