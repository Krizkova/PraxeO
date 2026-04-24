import React from "react";

interface ContentWrapperPageProps {
    children: React.ReactNode;
    maxWidth?: number | string;
    padding?: string;
}

// Sdílený obal pro hlavní obsah stránky se stejným odsazením a šířkou
const ContentWrapperPage: React.FC<ContentWrapperPageProps> = ({
                                                                   children,
                                                                   maxWidth = 1000,
                                                                   padding = "40px 32px",
                                                               }) => {
    return (
        <div style={{ padding }}>
            <div style={{ maxWidth, margin: "0 auto" }}>
                {children}
            </div>
        </div>
    );
};

export default ContentWrapperPage;