import { CheckCircle2 } from "lucide-react";
import React from "react";
import PrimaryButton from "../common/PrimaryButton";

interface SuccessStateProps {
    message: React.ReactNode;
    buttonText?: string;
    onContinue: () => void;
}

const SuccessState: React.FC<SuccessStateProps> = ({
                                                       message,
                                                       buttonText = "Pokračovat na přihlášení",
                                                       onContinue,
                                                   }) => {
    return (
        <div style={{ textAlign: "center", padding: "12px 4px" }}>
            {/* Ikona úspěšného stavu */}
            <div
                style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "#D6EDDF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 14px",
                }}
            >
                <CheckCircle2 size={24} color="#1F8A4D" strokeWidth={2.2} />
            </div>

            {/* Nadpis úspěchu */}
            <h2
                style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#1a3d1a",
                    margin: "0 0 8px",
                }}
            >
                Odesláno
            </h2>

            {/* Potvrzovací text */}
            <p
                style={{
                    fontSize: 14,
                    color: "#5a7a5a",
                    lineHeight: 1.6,
                    margin: "0 0 20px",
                }}
            >
                {message}
            </p>

            <PrimaryButton type="button" onClick={onContinue}>
                {buttonText}
            </PrimaryButton>
        </div>
    );
};

export default SuccessState;