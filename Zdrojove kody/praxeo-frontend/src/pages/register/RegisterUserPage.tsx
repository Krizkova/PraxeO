import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import RegisterUser from "../../components/register/RegisterUser";
import { getCurrentUser } from "../../api/userApi";

interface UserResponse {
    id: number;
    email: string;
    role?: string | null;
    firstName?: string | null;
    lastName?: string | null;
}

const RegisterUserPage: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const u = await getCurrentUser();
                if (!mounted) return;

                const role = (u.role || "").toUpperCase();
                const isAdminOrTeacher = role === "ADMIN" || role === "TEACHER";

                if (!isAdminOrTeacher) {
                    navigate("/", { replace: true });
                    return;
                }

                setUser(u);
            } catch (err) {
                navigate("/", { replace: true });
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => { mounted = false };
    }, [navigate]);

    if (loading || !user) return null;

    const roleUpper = (user.role || "").toUpperCase();
    const isAdminOrTeacher = roleUpper === "ADMIN" || roleUpper === "TEACHER";

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

                <RegisterUser
                    isAdminOrTeacher={isAdminOrTeacher}
                />
            </div>
        </>
    );
};

export default RegisterUserPage;
