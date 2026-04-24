import React from "react";

interface StepListProps {
    items: string[];
}

const StepList: React.FC<StepListProps> = ({ items }) => {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {items.map((item, idx) => (
                <div
                    key={`${idx}-${item}`}
                    style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
                >
                    {/* Číslo kroku */}
                    <div
                        style={{
                            width: 26,
                            height: 26,
                            borderRadius: "50%",
                            background: "#D6EDDF",
                            color: "#2d7a2d",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 13,
                            fontWeight: 700,
                            flexShrink: 0,
                            marginTop: 1,
                        }}
                    >
                        {idx + 1}
                    </div>

                    {/* Text kroku */}
                    <p
                        style={{
                            margin: 0,
                            fontSize: 14,
                            color: "#416141",
                            lineHeight: 1.6,
                        }}
                    >
                        {item}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default StepList;