import React from "react";

interface PracticeInfoRowProps {
    label: string;
    children: React.ReactNode;
    marginBottom?: number | string;
}

// Sdílený řádek detailu praxe pro zobrazení názvu pole a jeho hodnoty
const PracticeInfoRow: React.FC<PracticeInfoRowProps> = ({
                                                             label,
                                                             children,
                                                             marginBottom = 10,
                                                         }) => {
    return (
        <div
            style={{
                marginBottom,
                fontSize: 15,
                color: "#1a3d1a",
                display: "flex",
                alignItems: "center",
                gap: 6,
            }}
        >
            <span
                style={{
                    fontWeight: 700,
                    minWidth: 200,
                    flexShrink: 0,
                }}
            >
                {label}
            </span>
            {children}
        </div>
    );
};

export default PracticeInfoRow;