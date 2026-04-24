import React from "react";

interface SpinnerPageProps {
    minHeight?: string;
}

// Jednoduchý sdílený spinner pro načítání obsahu stránky
const SpinnerPage: React.FC<SpinnerPageProps> = ({
                                                     minHeight = "calc(100vh - 56px)",
                                                 }) => {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight,
            }}
        >
            <div
                style={{
                    width: 28,
                    height: 28,
                    border: "2px solid #D6EDDF",
                    borderTopColor: "#2d7a2d",
                    borderRadius: "50%",
                }}
            />
        </div>
    );
};

export default SpinnerPage;