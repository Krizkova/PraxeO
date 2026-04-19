import React from "react";
import { GraduationCap, CheckSquare, CircleAlert } from "lucide-react";
import Header from "../components/header/Header";
import LoginView from "../components/login/LoginView";
import Footer from "../components/footer/Footer";
import { useAuth } from "../context/AuthContext";

const HomePage: React.FC = () => {
    const { isLoggedIn, loading } = useAuth();

    // Hlavní výhody systému PraxeO
    const points = [
        "Přehled dostupných praxí a jejich správa",
        "Jednoduchá komunikace mezi studenty a mentory",
        "Sledování průběhu a hodnocení na jednom místě",
    ];

    // Jednotný styl pro zelený čtverec s Lucide ikonou
    const iconBoxStyle: React.CSSProperties = {
        width: 24,
        height: 24,
        background: "#D6EDDF",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    };

    // Zobrazení načítání
    if (loading) {
        return (
            <>
                <Header />
                <div style={{
                    background: "linear-gradient(135deg, #f8faf8 0%, #eef5ee 100%)",
                    minHeight: "calc(100vh - 56px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <div style={{
                        width: 28,
                        height: 28,
                        border: "2px solid #D6EDDF",
                        borderTopColor: "#2d7a2d",
                        borderRadius: "50%",
                    }} />
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            <div style={{
                background: "linear-gradient(135deg, #f8faf8 0%, #eef5ee 100%)",
                minHeight: "calc(100vh - 56px)",
            }}>
                <div style={{ padding: "48px 32px" }}>
                    <div style={{
                        maxWidth: 1100,
                        margin: "0 auto",
                        display: "grid",
                        gridTemplateColumns: isLoggedIn ? "1fr" : "1fr 400px",
                        gap: 56,
                        alignItems: "start",
                    }}>

                        {/* Levý sloupec: popis projektu */}
                        <div style={{ paddingTop: 8 }}>

                            {/* Štítek systému */}
                            <div style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                background: "#D6EDDF",
                                color: "#1F8A4D",
                                fontSize: 12,
                                fontWeight: 600,
                                padding: "6px 12px",
                                borderRadius: 20,
                                marginBottom: 20,
                            }}>
                                <div style={iconBoxStyle}>
                                    <GraduationCap size={14} color="#1F8A4D" strokeWidth={2.2} />
                                </div>
                                <span>Systém pro studentské praxe</span>
                            </div>

                            {/* Nadpis */}
                            <h1 style={{
                                fontSize: 34,
                                fontWeight: 700,
                                color: "#1a3d1a",
                                lineHeight: 1.2,
                                margin: "0 0 16px",
                                letterSpacing: "-0.4px",
                                maxWidth: 560,
                            }}>
                                O projektu PraxeO
                            </h1>

                            {/* Krátký popis */}
                            <p style={{
                                fontSize: 15,
                                color: "#5a7a5a",
                                lineHeight: 1.75,
                                margin: "0 0 28px",
                                maxWidth: 580,
                            }}>
                                PraxeO propojuje studenty, vyučující a mentory na jednom místě.
                                Umožňuje evidenci praxí, správu úkolů i průběžné hodnocení.
                            </p>

                            {/* Seznam výhod s ikonami */}
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 14,
                                marginBottom: 32,
                            }}>
                                {points.map((text) => (
                                    <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div style={iconBoxStyle}>
                                            <CheckSquare size={14} color="#1F8A4D" strokeWidth={2.2} />
                                        </div>
                                        <span style={{ fontSize: 14, color: "#1a3d1a" }}>{text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Technická poznámka */}
                            <div style={{
                                borderTop: "1px solid #d0e8d0",
                                paddingTop: 16,
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 8,
                                maxWidth: 600,
                            }}>
                                <div style={{ ...iconBoxStyle, width: 22, height: 22, marginTop: 1 }}>
                                    <CircleAlert size={13} color="#7FA487" strokeWidth={2.1} />
                                </div>
                                <p style={{ fontSize: 12, color: "#a0baa0", margin: 0, lineHeight: 1.7 }}>
                                    Projekt je tvořen moderní architekturou{" "}
                                    <span style={{ color: "#6b8f6b", fontWeight: 600 }}>Spring Boot (backend)</span>
                                    {" "}a{" "}
                                    <span style={{ color: "#6b8f6b", fontWeight: 600 }}>React (frontend)</span>
                                    , napojenou na databázi{" "}
                                    <span style={{ color: "#6b8f6b", fontWeight: 600 }}>PostgreSQL</span>.
                                </p>
                            </div>
                        </div>

                        {/* Pravý sloupec: přihlašovací formulář (pouze pro nepřihlášené) */}
                        {!isLoggedIn && (
                            <div>
                                <LoginView />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default HomePage;