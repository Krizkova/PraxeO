import React, { ReactNode } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

type LayoutPageProps = {
    children: ReactNode;
};

const LayoutPage: React.FC<LayoutPageProps> = ({ children }) => {
    return (
        <>
            <Header />

            {/* Společný obal pro jednoduché stránky se stejným pozadím */}
            <div
                style={{
                    background: "linear-gradient(135deg, #f8faf8 0%, #eef5ee 100%)",
                    minHeight: "calc(100vh - 56px)",
                }}
            >
                {children}
            </div>

            <Footer />
        </>
    );
};

export default LayoutPage;