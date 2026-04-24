import type { CSSProperties } from "react";

// Základní styl pro textová pole
export const inputStyle: CSSProperties = {
    width: "100%",
    height: 48,
    background: "white",
    border: "1.5px solid #d0e8d0",
    borderRadius: 12,
    padding: "0 14px",
    fontSize: 14,
    color: "#1a3d1a",
    outline: "none",
    boxSizing: "border-box",
    transition: "all 0.15s",
    fontFamily: "inherit",
};

// Styl pro textarea pole
export const textareaStyle: CSSProperties = {
    ...inputStyle,
    minHeight: 110,
    height: "auto",
    padding: "12px 14px",
    resize: "vertical",
};

// Styl popisku pole
export const labelStyle: CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: "#3a5a3a",
    display: "block",
    marginBottom: 6,
};

// Styl boxu s ikonou v hlavičce formuláře
export const iconBoxStyle: CSSProperties = {
    width: 24,
    height: 24,
    background: "#D6EDDF",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
};

// Styl pro pole v chybovém stavu
export const errorFieldStyle: CSSProperties = {
    border: "1.5px solid #e24b4a",
    boxShadow: "0 0 0 3px rgba(226,75,74,0.12)",
    background: "#fff8f8",
};

// Základní helper text pod polem
export const helperTextStyle: CSSProperties = {
    marginTop: 4,
    fontSize: 11,
    color: "#6f8f6f",
    lineHeight: 1.5,
};

// Tlumený helper text
export const mutedHelpTextStyle: CSSProperties = {
    ...helperTextStyle,
    color: "#a0baa0",
};

// Chybová zpráva pod polem
export const errorTextStyle: CSSProperties = {
    ...helperTextStyle,
    color: "#e24b4a",
};