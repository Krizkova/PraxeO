import React from "react";
import { CheckCircle } from "lucide-react";
import CompleteRegistration from "../../components/register/CompleteRegistration";
import LayoutPage from "../../pages/layouts/LayoutPage";
import HeaderPage from "../../pages/common/HeaderPage";
import IconBadgePage from "../../pages/common/IconBadgePage";

const VerifyPage: React.FC = () => {
    return (
        <LayoutPage>
            {/* Sdílená horní hlavička stránky pro jednoduché formulářové obrazovky */}
            <HeaderPage
                icon={
                    <IconBadgePage>
                        <CheckCircle size={22} color="white" strokeWidth={1.8} />
                    </IconBadgePage>
                }
                title="Dokončení registrace"
            />

            {/* Obsah stránky zůstává beze změny: formulář pro dokončení registrace */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "48px 32px",
                }}
            >
                <CompleteRegistration />
            </div>
        </LayoutPage>
    );
};

export default VerifyPage;