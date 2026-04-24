import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FilePlus } from "lucide-react";
import CreatePractice from "../../components/practices/create-practice/CreatePractice";
import LayoutPage from "../../pages/layouts/LayoutPage";
import HeaderPage from "../../pages/common/HeaderPage";
import IconBadgePage from "../../pages/common/IconBadgePage";
import ActionButtonPage from "../../pages/common/ActionButtonPage";
import ContentWrapperPage from "../../pages/common/ContentWrapperPage";

const CreatePracticePage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Spolehlivý návrat zpět: pokud chybí historie, přejdeme na přehled praxí
    const handleBack = () => {
        if (location.key === "default") {
            navigate("/summary", { replace: true });
            return;
        }

        navigate(-1);
    };

    // Kroky procesu vytvoření praxe
    const steps = [
        {
            n: 1,
            title: "Vyplníte základní údaje",
            sub: "Název, popis a datum dokončení praxe",
            active: true,
        },
        {
            n: 2,
            title: "Praxe bude připravena",
            sub: "Systém praxe uloží a zobrazí v přehledu",
            active: false,
        },
        {
            n: 3,
            title: "Vše spravujete na jednom místě",
            sub: "Přidávejte tasky a přiřazujte studenty",
            active: false,
        },
    ];

    return (
        <LayoutPage>
            <HeaderPage
                icon={
                    <IconBadgePage>
                        <FilePlus size={22} color="white" strokeWidth={1.8} />
                    </IconBadgePage>
                }
                title="Vytvořit praxi"
                action={
                    <ActionButtonPage onClick={handleBack}>
                        ← Zpět
                    </ActionButtonPage>
                }
            />

            <ContentWrapperPage>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 480px",
                        gap: 56,
                        alignItems: "start",
                    }}
                >
                    {/* Levý sloupec: popis a kroky bez karty */}
                    <div style={{ paddingTop: 8 }}>
                        <p
                            style={{
                                fontSize: 15,
                                color: "#5a7a5a",
                                lineHeight: 1.7,
                                margin: "0 0 36px",
                            }}
                        >
                            Po vytvoření nové praxe ji můžete dál spravovat v přehledu.
                        </p>

                        {/* Kroky s číslovanými kruhy */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 22,
                            }}
                        >
                            {steps.map((step) => (
                                <div
                                    key={step.n}
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 16,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 32,
                                            height: 32,
                                            background: step.active
                                                ? "linear-gradient(135deg, #2d7a2d, #4caf50)"
                                                : "white",
                                            border: step.active
                                                ? "none"
                                                : "1.5px solid #d0e8d0",
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                            boxShadow: step.active
                                                ? "0 3px 8px rgba(45,122,45,0.25)"
                                                : "none",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: 13,
                                                fontWeight: 700,
                                                color: step.active ? "white" : "#8aaa8a",
                                            }}
                                        >
                                            {step.n}
                                        </span>
                                    </div>

                                    <div style={{ paddingTop: 4 }}>
                                        <div
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 600,
                                                color: step.active ? "#1a3d1a" : "#6b8f6b",
                                                marginBottom: 3,
                                            }}
                                        >
                                            {step.title}
                                        </div>

                                        <div
                                            style={{
                                                fontSize: 13,
                                                color: "#8aaa8a",
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            {step.sub}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pravý sloupec: formulář */}
                    <div>
                        <CreatePractice />
                    </div>
                </div>
            </ContentWrapperPage>
        </LayoutPage>
    );
};

export default CreatePracticePage;