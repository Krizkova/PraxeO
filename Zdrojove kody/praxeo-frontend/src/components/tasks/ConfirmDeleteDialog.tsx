import React from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
    title: string;
    fileName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

// Sdílený potvrzovací dialog pro mazání souboru
const ConfirmDeleteDialog: React.FC<Props> = ({ title, fileName, onConfirm, onCancel }) => {
    return (
        <div
            onClick={onCancel}
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
                style={{
                    background: "white",
                    borderRadius: 16,
                    padding: 28,
                    maxWidth: 380,
                    width: "100%",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                    border: "1px solid #e0ede0",
                }}
            >
                {/* Ikona upozornění */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                    <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background: "#fce4ec",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <AlertTriangle size={24} color="#c62828" strokeWidth={2} />
                    </div>
                </div>

                {/* Text */}
                <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 700, color: "#1a3d1a", textAlign: "center" }}>
                    {title}
                </h3>
                <p style={{ margin: "0 0 24px", fontSize: 14, color: "#5a7a5a", textAlign: "center", lineHeight: 1.5 }}>
                    <strong>{fileName}</strong> bude trvale odstraněn.
                </p>

                {/* Tlačítka */}
                <div style={{ display: "flex", gap: 10 }}>
                    <button
                        onClick={onCancel}
                        style={{
                            flex: 1,
                            height: 40,
                            background: "none",
                            border: "1.5px solid #d0e8d0",
                            borderRadius: 10,
                            color: "#5a7a5a",
                            fontSize: 14,
                            fontWeight: 500,
                            cursor: "pointer",
                            fontFamily: "inherit",
                        }}
                    >
                        Zrušit
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            flex: 1,
                            height: 40,
                            background: "#c62828",
                            border: "none",
                            borderRadius: 10,
                            color: "white",
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "inherit",
                        }}
                    >
                        Smazat
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteDialog;