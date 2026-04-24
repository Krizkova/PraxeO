import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCog } from "lucide-react";
import Header from "../../components/header/Header";
import RegisterUser from "../../components/register/RegisterUser";
import { getCurrentUser } from "../../api/userApi";
import LayoutPage from "../../pages/layouts/LayoutPage";
import HeaderPage from "../../pages/common/HeaderPage";
import IconBadgePage from "../../pages/common/IconBadgePage";
import ActionButtonPage from "../../pages/common/ActionButtonPage";
import ContentWrapperPage from "../../pages/common/ContentWrapperPage";
import SpinnerPage from "../../pages/common/SpinnerPage";

interface UserResponse {
    id: number;
    email: string;
    role?: string | null;
    firstName?: string | null;
    lastName?: string | null;
}

// Stránka pro přidání nového uživatele: přístupná pouze pro admina a učitele
const RegisterUserPage: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Ověření, zda má přihlášený uživatel oprávnění přistupovat na tuto stránku
    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const u = await getCurrentUser();
                if (!mounted) return;

                const role = (u.role || "").toUpperCase();

                // Přesměrování nepřihlášených nebo neoprávněných uživatelů
                if (role !== "ADMIN" && role !== "TEACHER") {
                    navigate("/", { replace: true });
                    return;
                }

                setUser(u);
            } catch {
                if (mounted) {
                    setError(true);
                }

                navigate("/", { replace: true });
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            mounted = false;
        };
    }, [navigate]);

    // Loading stav ponecháváme téměř beze změny, aby se nezměnilo chování obrazovky
    if (loading) {
        return (
            <>
                <Header />
                <div
                    style={{
                        background: "linear-gradient(135deg, #f8faf8 0%, #eef5ee 100%)",
                    }}
                >
                    <SpinnerPage />
                </div>
            </>
        );
    }

    if (!user || error) {
        return null;
    }

    const isAdminOrTeacher = ["ADMIN", "TEACHER"].includes(
        (user.role || "").toUpperCase()
    );

    return (
        <LayoutPage>
            <HeaderPage
                icon={
                    <IconBadgePage>
                        <UserCog size={22} color="white" strokeWidth={1.8} />
                    </IconBadgePage>
                }
                title="Přidat uživatele"
                action={
                    <ActionButtonPage onClick={() => navigate(-1)}>
                        ← Zpět
                    </ActionButtonPage>
                }
            />

            {/* Obsah stránky zůstává beze změny: formulář pro přidání uživatele */}
            <ContentWrapperPage>
                <RegisterUser isAdminOrTeacher={isAdminOrTeacher} />
            </ContentWrapperPage>
        </LayoutPage>
    );
};

export default RegisterUserPage;