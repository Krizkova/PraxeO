import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Pencil } from "lucide-react";
import PracticeDetail from "../../components/practices/practice-detail/PracticeDetail";
import LayoutPage from "../../pages/layouts/LayoutPage";
import HeaderPage from "../../pages/common/HeaderPage";
import IconBadgePage from "../../pages/common/IconBadgePage";
import ActionButtonPage from "../../pages/common/ActionButtonPage";

const PracticeDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);

    // Původní chování zůstává stejné:
    // v režimu úprav se změny pouze zruší, jinak se přejde zpět na přehled
    const handleBack = () => {
        if (editMode) {
            setEditMode(false);
            return;
        }

        navigate("/summary");
    };

    // Hodnoty pro hlavičku stránky držíme mimo JSX, aby byl render přehlednější
    const badgeVariant = editMode ? "orange" : "green";
    const actionLabel = editMode ? "← Zrušit úpravy" : "← Zpět";
    const headerIcon = editMode ? (
        <Pencil size={20} color="white" strokeWidth={1.8} />
    ) : (
        <FileText size={20} color="white" strokeWidth={1.8} />
    );

    return (
        <LayoutPage>
            <HeaderPage
                icon={
                    <IconBadgePage variant={badgeVariant}>
                        {headerIcon}
                    </IconBadgePage>
                }
                title="Detail praxe"
                action={
                    <ActionButtonPage onClick={handleBack}>
                        {actionLabel}
                    </ActionButtonPage>
                }
            />

            {/* Vnitřní obsah stránky i práce s editMode zůstávají beze změny */}
            <div style={{ padding: "24px 32px" }}>
                <PracticeDetail editMode={editMode} setEditMode={setEditMode} />
            </div>
        </LayoutPage>
    );
};

export default PracticeDetailPage;