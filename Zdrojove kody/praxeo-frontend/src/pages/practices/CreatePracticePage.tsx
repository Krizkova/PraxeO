import React from "react";
import { useNavigate } from "react-router-dom";
import { FilePlus } from "lucide-react";
import Header from "../../components/header/Header";
import CreatePractice from "../../components/practices/CreatePractice";
import Footer from "../../components/footer/Footer";

const CreatePracticePage: React.FC = () => {
    const navigate = useNavigate();

    // Kroky procesu vytvoření praxe
    const steps = [
        { n: 1, title: "Vyplníte základní údaje", sub: "Název, popis a datum dokončení praxe", active: true },
        { n: 2, title: "Praxe bude připravena", sub: "Systém praxe uloží a zobrazí v přehledu", active: false },
        { n: 3, title: "Vše spravujete na jednom místě", sub: "Přidávejte tasky a přiřazujte studenty", active: false },
    ];

    return (
        <>
            <Header />

            <div style={{
                background: "linear-gradient(135deg, #f8faf8 0%, #eef5ee 100%)",
                minHeight: "calc(100vh - 56px)",
            }}>
                {/* Záhlaví stránky */}
                <div style={{
                    background: "white",
                    borderBottom: "1px solid #e0ede0",
                    boxShadow: "0 2px 8px rgba(34,85,34,0.06)",
                    padding: "20px 32px",
                }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        {/* Ikona + název */}
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <div style={{
                                width: 44, height: 44,
                                background: "linear-gradient(135deg, #2d7a2d, #4caf50)",
                                borderRadius: 11,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 4px 12px rgba(45,122,45,0.3)",
                                flexShrink: 0,
                            }}>
                                <FilePlus size={22} color="white" strokeWidth={1.8} />
                            </div>
                            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1a3d1a", letterSpacing: "-0.3px" }}>
                                Vytvořit praxi
                            </h1>
                        </div>

                        {/* Tlačítko zpět */}
                        <button
                            onClick={() => navigate("/summary")}
                            style={{
                                background: "none",
                                border: "1.5px solid #2d7a2d",
                                color: "#2d7a2d",
                                borderRadius: 8,
                                padding: "7px 18px",
                                fontSize: 14,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                fontWeight: 500,
                                transition: "all 0.2s",
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = "#2d7a2d";
                                e.currentTarget.style.color = "white";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = "none";
                                e.currentTarget.style.color = "#2d7a2d";
                            }}
                        >
                            ← Zpět
                        </button>
                    </div>
                </div>

                {/* Obsah: dvousloupcový layout bez karty vlevo */}
                <div style={{ padding: "40px 32px" }}>
                    <div style={{
                        maxWidth: 1000,
                        margin: "0 auto",
                        display: "grid",
                        gridTemplateColumns: "1fr 480px",
                        gap: 56,
                        alignItems: "start",
                    }}>
                        {/* Levý sloupec: popis a kroky bez karty */}
                        <div style={{ paddingTop: 8 }}>
                            <p style={{ fontSize: 15, color: "#5a7a5a", lineHeight: 1.7, margin: "0 0 36px" }}>
                                Po vytvoření nové praxe ji můžete dál spravovat v přehledu.
                            </p>

                            {/* Kroky s číslovanými kruhy */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                                {steps.map(step => (
                                    <div key={step.n} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                                        <div style={{
                                            width: 32, height: 32,
                                            background: step.active ? "linear-gradient(135deg, #2d7a2d, #4caf50)" : "white",
                                            border: step.active ? "none" : "1.5px solid #d0e8d0",
                                            borderRadius: "50%",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            flexShrink: 0,
                                            boxShadow: step.active ? "0 3px 8px rgba(45,122,45,0.25)" : "none",
                                        }}>
                                            <span style={{ fontSize: 13, fontWeight: 700, color: step.active ? "white" : "#8aaa8a" }}>
                                                {step.n}
                                            </span>
                                        </div>
                                        <div style={{ paddingTop: 4 }}>
                                            <div style={{ fontSize: 14, fontWeight: 600, color: step.active ? "#1a3d1a" : "#6b8f6b", marginBottom: 3 }}>
                                                {step.title}
                                            </div>
                                            <div style={{ fontSize: 13, color: "#8aaa8a", lineHeight: 1.5 }}>
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
                </div>
            </div>

            <Footer />
        </>
    );
};

export default CreatePracticePage;