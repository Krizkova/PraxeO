import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            if (!response.ok) {
                const errorText = await response.text();
                alert(`Přihlášení selhalo: ${errorText}`);
                return;
            }

            const userData = await response.json();
            console.log("✅ Přihlášení úspěšné:", userData);

            // 🔒 Uložení tokenu a uživatele do cookies
            Cookies.set("token", userData.token, { expires: 1 });
            Cookies.set("userEmail", userData.email, { expires: 1 });
            Cookies.set("userRole", userData.role, { expires: 1 });
            Cookies.set("userName", userData.firstName || "", { expires: 1 });

            // 🔀 Přesměrování
            if (userData.role === "ADMIN") {
                navigate("/summary");
            } else {
                navigate("/summary");
            }
        } catch (error) {
            console.error("Chyba při přihlášení:", error);
            alert("Nastala chyba při připojení k serveru.");
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        handleLogin,
    };
};
