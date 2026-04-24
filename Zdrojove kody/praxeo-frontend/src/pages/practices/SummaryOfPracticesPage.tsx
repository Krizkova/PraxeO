import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FolderOpen } from "lucide-react";
import SummaryOfPractices from "../../components/practices/summary-of-practices/SummaryOfPractices";
import LayoutPage from "../../pages/layouts/LayoutPage";
import HeaderPage from "../../pages/common/HeaderPage";
import IconBadgePage from "../../pages/common/IconBadgePage";
import ActionButtonPage from "../../pages/common/ActionButtonPage";
import ContentWrapperPage from "../../pages/common/ContentWrapperPage";

// Stránka s přehledem praxí využívá sdílené page komponenty
const SummaryOfPracticesPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleBack = () => {
        if (location.state?.fromRegistration || location.state?.fromPasswordReset) {
            navigate("/", { replace: true });
            return;
        }

        if (location.key === "default") {
            navigate("/", { replace: true });
            return;
        }

        navigate(-1);
    };

    return (
        <LayoutPage>
            <HeaderPage
                icon={
                    <IconBadgePage>
                        <FolderOpen size={20} color="white" strokeWidth={1.8} />
                    </IconBadgePage>
                }
                title="Přehled praxí"
                action={
                    <ActionButtonPage onClick={handleBack}>
                        ← Zpět
                    </ActionButtonPage>
                }
            />

            {/* Hlavní obsah stránky zůstává v původní komponentě */}
            <ContentWrapperPage>
                <SummaryOfPractices />
            </ContentWrapperPage>
        </LayoutPage>
    );
};

export default SummaryOfPracticesPage;