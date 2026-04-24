import React from "react";
import { Lock } from "lucide-react";
import ResetPassword from "../../components/login/ResetPassword";
import LayoutPage from "../../pages/layouts/LayoutPage";
import HeaderPage from "../../pages/common/HeaderPage";
import IconBadgePage from "../../pages/common/IconBadgePage";

const ResetPasswordPage: React.FC = () => {
    return (
        <LayoutPage>
            {/* Sdílená horní hlavička stránky pro obnovu hesla */}
            <HeaderPage
                icon={
                    <IconBadgePage>
                        <Lock size={20} color="white" strokeWidth={1.8} />
                    </IconBadgePage>
                }
                title="Obnova hesla"
            />

            {/* Obsah stránky zůstává beze změny: formulář pro zadání nového hesla */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "48px 32px",
                }}
            >
                <ResetPassword />
            </div>
        </LayoutPage>
    );
};

export default ResetPasswordPage;