import React from "react";
import { translatePracticeState } from "../../../utils/forms/types/practiceState";
import { practiceStateColors } from "../../../utils/forms/constants/practiceStateColors";
import type { Practice } from "../../../utils/forms/types/practice";

interface PracticeSummaryRowProps {
    practice: Practice;
    isHovered: boolean;
    onHover: (id: number | null) => void;
    onOpenDetail: (id: number) => void;
}

const formatDate = (value: string | null) => {
    if (!value) return "—";
    const d = new Date(value);
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
};

// Sdílený řádek tabulky se souhrnem praxí
const PracticeSummaryRow: React.FC<PracticeSummaryRowProps> = ({
                                                                   practice,
                                                                   isHovered,
                                                                   onHover,
                                                                   onOpenDetail,
                                                               }) => {
    const stateBadge = practiceStateColors[practice.state];

    const tdStyle: React.CSSProperties = {
        padding: "13px 16px",
        fontSize: 14,
        color: "#2c4a2c",
        borderBottom: "1px solid #f0f5f0",
        verticalAlign: "middle",
    };

    const mutedTdStyle: React.CSSProperties = {
        ...tdStyle,
        color: "#5a7a5a",
        fontSize: 13,
    };

    return (
        <tr
            onDoubleClick={() => onOpenDetail(practice.id)}
            onMouseEnter={() => onHover(practice.id)}
            onMouseLeave={() => onHover(null)}
            style={{
                cursor: "pointer",
                background: isHovered ? "#f6faf6" : "white",
                transition: "background 0.15s",
            }}
        >
            <td style={tdStyle}>
                <span
                    style={{
                        background: "#e8f5e9",
                        color: "#2d7a2d",
                        fontSize: 12,
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: 6,
                    }}
                >
                    #{practice.id}
                </span>
            </td>

            <td style={{ ...tdStyle, fontWeight: 600 }}>{practice.name}</td>

            <td style={tdStyle}>
                <span
                    style={{
                        background: stateBadge.bg,
                        color: stateBadge.color,
                        padding: "3px 10px",
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                    }}
                >
                    {translatePracticeState(practice.state)}
                </span>
            </td>

            <td style={mutedTdStyle}>{practice.founderEmail ?? "—"}</td>
            <td style={mutedTdStyle}>{practice.studentEmail ?? "—"}</td>
            <td style={mutedTdStyle}>{formatDate(practice.selectedAt)}</td>
            <td style={mutedTdStyle}>{formatDate(practice.completedAt)}</td>
        </tr>
    );
};

export default PracticeSummaryRow;