import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Pencil } from "lucide-react";
import Header from "../../components/header/Header";
import PracticeDetail from "../../components/practices/PracticeDetail";
import Footer from "../../components/footer/Footer";

const PracticeDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);

    // Tlačítko zpět: při editaci zruší úpravy, jinak přejde na přehled
    const handleBack = () => {
        if (editMode) setEditMode(false);
        else navigate("/summary");
    };

    return (
        <>
            <Header />

            <div style={{
                background: "linear-gradient(135deg, #f8faf8 0%, #eef5ee 100%)",
                minHeight: "calc(100vh - 56px)",
            }}>
                {/* Záhlaví stránky: mění se podle režimu zobrazení/úpravy */}
                <div style={{
                    background: "white",
                    borderBottom: "1px solid #e0ede0",
                    boxShadow: "0 2px 8px rgba(34,85,34,0.06)",
                    padding: "20px 32px",
                }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>

                        {/* Ikona + název: mění se při přepnutí do režimu úpravy */}
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <div style={{
                                width: 44, height: 44,
                                background: editMode
                                    ? "linear-gradient(135deg, #e67e22, #f39c12)"
                                    : "linear-gradient(135deg, #2d7a2d, #4caf50)",
                                borderRadius: 11,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: editMode
                                    ? "0 4px 12px rgba(230,126,34,0.3)"
                                    : "0 4px 12px rgba(45,122,45,0.3)",
                                flexShrink: 0,
                                transition: "all 0.3s",
                            }}>
                                {editMode
                                    ? <Pencil size={20} color="white" strokeWidth={1.8} />
                                    : <FileText size={20} color="white" strokeWidth={1.8} />
                                }
                            </div>
                            <div>
                                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1a3d1a", letterSpacing: "-0.3px" }}>
                                    Detail praxe
                                </h1>
                            </div>
                        </div>

                        {/* Tlačítko zpět / zrušit úpravy */}
                        <button
                            onClick={handleBack}
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
                            {editMode ? "← Zrušit úpravy" : "← Zpět"}
                        </button>
                    </div>
                </div>

                {/* Obsah: detail praxe */}
                <div style={{ padding: "24px 32px" }}>
                    <PracticeDetail editMode={editMode} setEditMode={setEditMode} />
                </div>
            </div>

            <Footer />
        </>
    );
};

export default PracticeDetailPage;