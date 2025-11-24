import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { loginUser } from "../../api/userApi";

export const useLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const userData = await loginUser(email, password);

            Cookies.set("token", userData.token);
            Cookies.set("userEmail", userData.email);
            Cookies.set("userRole", userData.role);
            Cookies.set("userName", userData.firstName || "");

            navigate("/summary");
        } catch (err: any) {
            alert(err.message || "Chyba při přihlášení.");
        }
    };

    return {
        email, setEmail,
        password, setPassword,
        handleLogin,
    };
};
