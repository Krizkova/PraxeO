import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";

export const useLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { login } = useAuth();

    // Odeslání přihlášení a zpracování odpovědi backendu
    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const userData = await loginUser(email, password);

            login(userData.token, {
                email: userData.email,
                role: userData.role,
                firstName: userData.firstName,
                lastName: userData.lastName,
            });

            navigate("/summary");
        } catch (err: any) {
            const status = err?.response?.status;

            if (status === 401) {
                setError("Nesprávný e-mail nebo heslo. Zkuste to znovu.");
            } else if (status === 403) {
                setError("Přístup odepřen. Kontaktujte správce.");
            } else {
                setError("Nastala chyba při přihlášení. Zkuste to znovu.");
            }
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        error,
        setError,
        handleLogin,
    };
};