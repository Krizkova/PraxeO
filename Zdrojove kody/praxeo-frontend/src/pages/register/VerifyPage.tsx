import React from "react";
import { CheckCircle } from "lucide-react";
import Header from "../../components/header/Header";
import CompleteRegistration from "../../components/register/CompleteRegistration";
import Footer from "../../components/footer/Footer";

const VerifyPage: React.FC = () => {
    return (
        <>
            <Header />

            <div style={{
                background: "linear-gradient(135deg, #f8faf8 0%, #eef5ee 100%)",
                minHeight: "calc(100vh - 56px)",
            }}>
                {/* Záhlaví stránky: ikona + název */}
                <div style={{
                    background: "white",
                    borderBottom: "1px solid #e0ede0",
                    boxShadow: "0 2px 8px rgba(34,85,34,0.06)",
                    padding: "20px 32px",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        {/* Ikona dokončení registrace */}
                        <div style={{
                            width: 44, height: 44,
                            background: "linear-gradient(135deg, #2d7a2d, #4caf50)",
                            borderRadius: 11,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: "0 4px 12px rgba(45,122,45,0.3)",
                            flexShrink: 0,
                        }}>
                            <CheckCircle size={22} color="white" strokeWidth={1.8} />
                        </div>
                        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1a3d1a", letterSpacing: "-0.3px" }}>
                            Dokončení registrace
                        </h1>
                    </div>
                </div>

                {/* Obsah: formulář pro dokončení registrace */}
                <div style={{ display: "flex", justifyContent: "center", padding: "48px 32px" }}>
                    <CompleteRegistration />
                </div>
            </div>

            <Footer />
        </>
    );
};

export default VerifyPage;