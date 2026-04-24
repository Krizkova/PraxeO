import React from "react";
import {
    errorTextStyle,
    helperTextStyle,
    mutedHelpTextStyle,
} from "./formStyles";

interface Props {
    children?: React.ReactNode;
    variant?: "error" | "default" | "muted";
    id?: string;
    style?: React.CSSProperties;
}

const FormHint: React.FC<Props> = ({
                                       children,
                                       variant = "default",
                                       id,
                                       style,
                                   }) => {
    // Pokud není žádný obsah, nic se nevykreslí
    if (!children) return null;

    // Výběr stylu podle typu zprávy
    const baseStyle =
        variant === "error"
            ? errorTextStyle
            : variant === "muted"
                ? mutedHelpTextStyle
                : helperTextStyle;

    return (
        <p id={id} style={{ ...baseStyle, ...style }}>
            {children}
        </p>
    );
};

export default FormHint;