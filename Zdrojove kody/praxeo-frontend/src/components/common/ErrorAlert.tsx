import React from "react";
import { CircleAlert } from "lucide-react";

interface ErrorAlertProps {
    message: string;
    marginBottom?: number | string;
}

// Sdílená chybová hláška pro formuláře a seznamy
const ErrorAlert: React.FC<ErrorAlertProps> = ({
                                                   message,
                                                   marginBottom,
                                               }) => {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                background: "#FFF4F4",
                border: "1px solid #F1C7C7",
                borderRadius: 12,
                padding: "12px 16px",
                fontSize: 13,
                color: "#C75B5B",
                lineHeight: 1.5,
                marginBottom,
            }}
        >
            <CircleAlert size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{message}</span>
        </div>
    );
};

export default ErrorAlert;