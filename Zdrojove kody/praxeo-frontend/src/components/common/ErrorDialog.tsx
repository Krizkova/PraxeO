import React, { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
    title?: string;
    message: string;
    onClose: () => void;
}

// Sdílený dialog pro zobrazení chybové hlášky
const ErrorDialog: React.FC<Props> = ({
                                          title = "Změnu se nepodařilo uložit",
                                          message,
                                          onClose,
                                      }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.4)",
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-live="polite"
                style={{
                    background: "white",
                    borderRadius: 16,
                    padding: 28,
                    maxWidth: 400,
                    width: "100%",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                    border: "1px solid #e0ede0",
                }}
            >
                {/* Ikona upozornění */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                    <div
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            background: "#fce4ec",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <AlertTriangle size={24} color="#c62828" strokeWidth={2} />
                    </div>
                </div>

                {/* Text */}
                <h3
                    style={{
                        margin: "0 0 8px",
                        fontSize: 17,
                        fontWeight: 700,
                        color: "#1a3d1a",
                        textAlign: "center",
                    }}
                >
                    {title}
                </h3>

                <p
                    style={{
                        margin: "0 0 24px",
                        fontSize: 14,
                        color: "#5a7a5a",
                        textAlign: "center",
                        lineHeight: 1.5,
                        whiteSpace: "pre-line",
                    }}
                >
                    {message}
                </p>

                {/* Tlačítko */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <button
                        onClick={onClose}
                        style={{
                            minWidth: 140,
                            height: 40,
                            background: "#2d7a2d",
                            border: "none",
                            borderRadius: 10,
                            color: "white",
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            padding: "0 18px",
                            boxShadow: "0 4px 12px rgba(45,122,45,0.22)",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#256625";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#2d7a2d";
                        }}
                    >
                        Rozumím
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorDialog;