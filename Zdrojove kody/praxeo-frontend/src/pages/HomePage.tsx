import React, { useEffect, useState } from "react";
import Header from "../components/header/Header";
import LoginView from "../components/login/LoginView";
import Footer from "../components/footer/Footer";
import Cookies from "js-cookie";

const HomePage: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("token"));

    useEffect(() => {
        const interval = setInterval(() => {
            setIsLoggedIn(!!Cookies.get("token"));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Header />
            <div style={{
                background: "#F0F4F0",
                minHeight: "calc(100vh - 56px)",
                padding: "60px 32px",
            }}>
                <div style={{
                    maxWidth: 1100,
                    margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: isLoggedIn ? "1fr" : "1fr 440px",
                    gap: 64,
                    alignItems: "start",
                }}>
                    {/* Левая часть */}
                    <div style={{ paddingTop: 8 }}>
                        <div style={{
                            display: "inline-block",
                            background: "#D6EDDF",
                            color: "#1F8A4D",
                            fontSize: 12,
                            fontWeight: 500,
                            padding: "4px 12px",
                            borderRadius: 20,
                            marginBottom: 20,
                        }}>
                            Systém pro studentské praxe
                        </div>

                        <h1 style={{
                            fontSize: 34,
                            fontWeight: 500,
                            color: "#1E2430",
                            lineHeight: 1.25,
                            margin: "0 0 16px",
                        }}>
                            O projektu PraxeO
                        </h1>

                        <p style={{ fontSize: 15, color: "#667085", lineHeight: 1.7, margin: "0 0 16px" }}>
                            PraxeO propojuje studenty, vyučující a mentory na jednom místě.
                            Umožňuje evidenci praxí, správu úkolů i průběžné hodnocení.
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                            {[
                                "Přehled dostupných praxí a jejich správa",
                                "Jednoduchá komunikace mezi studenty a mentory",
                                "Sledování průběhu a hodnocení na jednom místě",

                            ].map((text) => (
                                <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <div style={{
                                        width: 22, height: 22,
                                        background: "#D6EDDF",
                                        borderRadius: "50%",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        flexShrink: 0,
                                    }}>
                                        <svg width="11" height="11" viewBox="0 0 11 11">
                                            <polyline points="2,5.5 4.5,8 9,3" stroke="#1F8A4D" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                    <span style={{ fontSize: 14, color: "#1E2430" }}>{text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Заметка внизу */}
                        <div style={{
                            borderTop: "0.5px solid #D9E2D9",
                            paddingTop: 16,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                        }}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                                <circle cx="7" cy="7" r="6" stroke="#A0A9A0" strokeWidth="1.2"/>
                                <line x1="7" y1="6" x2="7" y2="10" stroke="#A0A9A0" strokeWidth="1.2" strokeLinecap="round"/>
                                <circle cx="7" cy="4.5" r="0.6" fill="#A0A9A0"/>
                            </svg>
                            <p style={{ fontSize: 12, color: "#A0A9A0", margin: 0, lineHeight: 1.6 }}>
                                Projekt je tvořen moderní architekturou{" "}
                                <span style={{ color: "#667085", fontWeight: 500 }}>Spring Boot (backend)</span>
                                {" "}a{" "}
                                <span style={{ color: "#667085", fontWeight: 500 }}>React (frontend)</span>
                                , napojenou na databázi{" "}
                                <span style={{ color: "#667085", fontWeight: 500 }}>PostgreSQL</span>.
                            </p>
                        </div>
                    </div>

                    {/* Правая часть — только если не залогинен */}
                    {!isLoggedIn && <LoginView />}
                </div>
            </div>

            <Footer />
        </>
    );
};

export default HomePage;