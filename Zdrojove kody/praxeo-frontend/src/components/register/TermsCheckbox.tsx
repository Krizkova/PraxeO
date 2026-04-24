import React from "react";

interface TermsCheckboxProps {
    checked: boolean;
    onChange: (value: boolean) => void;
}

const TermsCheckbox: React.FC<TermsCheckboxProps> = ({
                                                         checked,
                                                         onChange,
                                                     }) => {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                marginBottom: 24,
            }}
        >
            <input
                type="checkbox"
                id="terms"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                required
                style={{
                    marginTop: 3,
                    accentColor: "#2d7a2d",
                    width: 15,
                    height: 15,
                    flexShrink: 0,
                }}
            />

            <label
                htmlFor="terms"
                style={{
                    fontSize: 12,
                    color: "#6b8f6b",
                    lineHeight: 1.5,
                }}
            >
                Souhlasím se zpracováním osobních údajů (GDPR)
            </label>
        </div>
    );
};

export default TermsCheckbox;