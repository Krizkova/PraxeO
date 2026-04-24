import type { CSSProperties } from "react";
import { errorFieldStyle } from "./formStyles";

type FieldElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export const getFieldStyle = (
    baseStyle: CSSProperties,
    isInvalid: boolean,
    extraStyle: CSSProperties = {}
): CSSProperties => ({
    ...baseStyle,
    ...extraStyle,
    ...(isInvalid ? errorFieldStyle : {}),
});

export const applyFocusStyle = (el: FieldElement) => {
    el.style.border = "1.5px solid #2d7a2d";
    el.style.boxShadow = "0 0 0 3px rgba(45,122,45,0.1)";
    el.style.background = "#fcfffc";
};

export const clearFocusStyle = (el: FieldElement, isInvalid = false) => {
    if (isInvalid) {
        el.style.border = "1.5px solid #e24b4a";
        el.style.boxShadow = "0 0 0 3px rgba(226,75,74,0.12)";
        el.style.background = "#fff8f8";
        return;
    }

    el.style.border = "1.5px solid #d0e8d0";
    el.style.boxShadow = "none";
    el.style.background = "white";
};