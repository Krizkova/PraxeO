import React from "react";

interface PrimaryButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    width?: number | string;
    height?: number | string;
    marginTop?: number | string;
    marginBottom?: number | string;
}

// Sdílené hlavní zelené tlačítko pro akce ve formulářích
const PrimaryButton: React.FC<PrimaryButtonProps> = ({
                                                         children,
                                                         type = "button",
                                                         disabled = false,
                                                         width = "100%",
                                                         height = 48,
                                                         marginTop,
                                                         marginBottom,
                                                         style,
                                                         ...rest
                                                     }) => {
    return (
        <button
            type={type}
            disabled={disabled}
            style={{
                width,
                height,
                background: disabled
                    ? "#c8dfc8"
                    : "linear-gradient(135deg, #2d7a2d, #4caf50)",
                color: "white",
                border: "none",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 500,
                cursor: disabled ? "not-allowed" : "pointer",
                boxShadow: disabled ? "none" : "0 4px 14px rgba(45,122,45,0.3)",
                transition: "opacity 0.2s",
                marginTop,
                marginBottom,
                ...style,
            }}
            onMouseEnter={(e) => {
                if (!disabled) e.currentTarget.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
            }}
            {...rest}
        >
            {children}
        </button>
    );
};

export default PrimaryButton;