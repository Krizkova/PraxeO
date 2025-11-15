import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Header from "../../components/header/Header";
import RegisterUser from "../../components/register/RegisterUser";
import { getCurrentUser, UserResponse } from "../../api/userApi";

const RegisterUserPage: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserResponse | null>(null);

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            navigate("/", { replace: true });
            return;
        }

        getCurrentUser()
            .then((u) => {
                if (u.role === "ADMIN" || u.role === "TEACHER") {
                    setUser(u);
                } else {
                    navigate("/", { replace: true });
                }
            })
            .catch(() => navigate("/", { replace: true }));
    }, [navigate]);

    if (!user) return null;

    return (
        <>
            <Header />
            <div className="container mt-4">
                <button
                    className="btn btn-outline-success mb-3"
                    onClick={() => navigate(-1)}
                >
                    ← Zpět
                </button>
                <h2 className="mb-4">Registrace uživatele</h2>
                <RegisterUser />
            </div>
        </>
    );
};

export default RegisterUserPage;
