import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const PasswordReset: React.FC = () => {
    const [params] = useSearchParams();
    const token = params.get("token");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const passwordResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/set-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            if (!passwordResponse.ok) {
                const text = await passwordResponse.text();
                alert(text || "Nastavení hesla selhalo.");
                setLoading(false);
                return;
            }

            const result = await passwordResponse.json();
            if (!result.success) {
                alert(result.message || "Nastavení hesla selhalo.");
                setLoading(false);
                return;
            }

            const email = result.email;
            alert("Heslo bylo úspěšně nastaveno.");

            const loginResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!loginResponse.ok) {
                const text = await loginResponse.text();
                alert(`Heslo bylo nastaveno, ale přihlášení selhalo: ${text}`);
                setLoading(false);
                return;
            }

            const userData = await loginResponse.json();

            Cookies.set("token", userData.token, { expires: 1 });
            Cookies.set("userEmail", userData.email, { expires: 1 });
            Cookies.set("userRole", userData.role, { expires: 1 });
            Cookies.set("userName", userData.firstName || "", { expires: 1 });

            alert("Heslo bylo nastaveno a jste přihlášena.");
            navigate("/summary");
        } catch (error) {
            console.error(error);
            alert("Nastala chyba při nastavování hesla.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4" style={{ maxWidth: 400 }}>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">
                    Nové heslo
                </label>
                <input
                    id="password"
                    type="password"
                    className="form-control"
                    placeholder="Zadejte nové heslo"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="btn btn-success w-100" disabled={loading}>
                {loading ? "Ukládám..." : "Potvrdit"}
            </button>
        </form>
    );
};

export default PasswordReset;
