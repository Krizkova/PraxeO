import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../api/userApi";
import Header from "../../components/header/Header";

const ForgotPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await forgotPassword({ email });
            alert("Pokyny k obnovení hesla byly odeslány na váš e-mail.");
            navigate("/");
        } catch (err: any) {
            alert("Chyba: " + (err.response?.data?.message || "Nastala neočekávaná chyba."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />

            <div className="container mt-4" style={{ maxWidth: 500 }}>
                <button
                    className="btn btn-outline-success mb-3"
                    onClick={() => navigate(-1)}
                >
                    ← Zpět
                </button>

                <h2 className="mb-4">Obnovení hesla</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Zadejte email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        className="btn btn-success w-100"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Odesílám..." : "Obnovit heslo"}
                    </button>
                </form>
            </div>
        </>
    );
};

export default ForgotPasswordPage;
