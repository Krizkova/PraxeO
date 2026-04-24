import React from "react";

export const inputStyle: React.CSSProperties = {
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

export const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: 110,
    height: "auto",
    padding: "12px 14px",
    resize: "vertical",
};

export const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: "#3a5a3a",
    display: "block",
    marginBottom: 6,
};

export const iconBoxStyle: React.CSSProperties = {
    width: 24,
    height: 24,
    background: "#D6EDDF",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
};

export const errorFieldStyle: React.CSSProperties = {
    border: "1.5px solid #e24b4a",
    boxShadow: "0 0 0 3px rgba(226,75,74,0.12)",
    background: "#fff8f8",
};

export const errorTextStyle: React.CSSProperties = {
    marginTop: 6,
    fontSize: 12,
    color: "#d85a5a",
    fontWeight: 300,
};