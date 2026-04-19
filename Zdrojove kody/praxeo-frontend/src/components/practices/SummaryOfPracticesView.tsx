import React, { useMemo, useState } from "react";
import {
    Search,
    FilePlus,
    FolderOpen,
    CircleAlert,
    ChevronsUpDown,
    ArrowUp,
    ArrowDown,
} from "lucide-react";
import { translatePracticeState } from "../../utils/practiceState";

interface Props {
    practices: any[];
    loading: boolean;
    error: string | null;
    onOpenDetail: (id: number) => void;
    onCreate: () => void;
    canCreate: boolean;
}

const formatDate = (value: string | null) => {
    if (!value) return "—";
    const d = new Date(value);
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
};

type SortKey =
    | "id"
    | "name"
    | "state"
    | "founderEmail"
    | "studentEmail"
    | "selectedAt"
    | "completedAt"
    | null;

const stateColors: Record<string, { bg: string; color: string }> = {
    NEW: { bg: "#D6EDDF", color: "#1F8A4D" },
    ACTIVE: { bg: "#E3F2FD", color: "#1565C0" },
    SUBMITTED: { bg: "#FFF8E1", color: "#F57F17" },
    CANCELED: { bg: "#FCE4EC", color: "#C62828" },
    COMPLETED: { bg: "#F3E5F5", color: "#6A1B9A" },
};

const SummaryOfPracticesView: React.FC<Props> = ({
                                                     practices = [],
                                                     loading,
                                                     error,
                                                     onOpenDetail,
                                                     onCreate,
                                                     canCreate,
                                                 }) => {
    const [search, setSearch] = useState("");
    // Výchozí řazení null = zachováváme pořadí z backendu
    const [sortKey, setSortKey] = useState<SortKey>(null);
    const [asc, setAsc] = useState(true);
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);

    const handleSort = (key: NonNullable<SortKey>) => {
        if (sortKey === key) setAsc(!asc);
        else {
            setSortKey(key);
            setAsc(true);
        }
    };

    const renderArrow = (key: NonNullable<SortKey>) => {
        if (sortKey !== key) {
            return <ChevronsUpDown size={11} style={{ color: "#C5D5C5", marginLeft: 4 }} />;
        }
        return asc
            ? <ArrowUp size={11} style={{ color: "#2d7a2d", marginLeft: 4 }} />
            : <ArrowDown size={11} style={{ color: "#2d7a2d", marginLeft: 4 }} />;
    };

    const filtered = useMemo(() => {
        const lower = search.toLowerCase();
        const result = practices.filter(
            (p) =>
                p.name?.toLowerCase().includes(lower) ||
                p.founderEmail?.toLowerCase().includes(lower) ||
                p.studentEmail?.toLowerCase().includes(lower)
        );

        // Pokud uživatel neklikl na žádný sloupec: zachováme pořadí z backendu
        if (!sortKey) return result;

        return [...result].sort((a, b) => {
            const aVal = a[sortKey] ?? "";
            const bVal = b[sortKey] ?? "";
            if (aVal < bVal) return asc ? -1 : 1;
            if (aVal > bVal) return asc ? 1 : -1;
            return 0;
        });
    }, [practices, search, sortKey, asc]);

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
                <div style={{
                    width: 24, height: 24,
                    border: "2px solid #D6EDDF",
                    borderTopColor: "#2d7a2d",
                    borderRadius: "50%",
                }} />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                display: "flex", alignItems: "flex-start", gap: 8,
                background: "#FFF4F4", border: "1px solid #F1C7C7",
                borderRadius: 12, padding: "12px 16px",
                fontSize: 13, color: "#C75B5B",
            }}>
                <CircleAlert size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{error}</span>
            </div>
        );
    }

    const thStyle: React.CSSProperties = {
        padding: "12px 16px",
        fontWeight: 600,
        fontSize: 13,
        color: "#1a3d1a",
        cursor: "pointer",
        userSelect: "none",
        whiteSpace: "nowrap",
        background: "#f6faf6",
        borderBottom: "2px solid #e0ede0",
        textAlign: "left",
    };

    const tdStyle: React.CSSProperties = {
        padding: "13px 16px",
        fontSize: 14,
        color: "#2c4a2c",
        borderBottom: "1px solid #f0f5f0",
        verticalAlign: "middle",
    };

    const columns: { key: NonNullable<SortKey>; label: string }[] = [
        { key: "id", label: "ID" },
        { key: "name", label: "Název" },
        { key: "state", label: "Stav" },
        { key: "founderEmail", label: "Zadavatel" },
        { key: "studentEmail", label: "Student" },
        { key: "selectedAt", label: "Datum vybrání" },
        { key: "completedAt", label: "Datum ukončení" },
    ];

    return (
        <div>
            {/* Vyhledávání a tlačítko přidat */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ position: "relative", flex: 1 }}>
                    <div style={{
                        position: "absolute", left: 12, top: "50%",
                        transform: "translateY(-50%)",
                        color: "#8aaa8a", pointerEvents: "none",
                        display: "flex", alignItems: "center",
                    }}>
                        <Search size={15} />
                    </div>
                    <input
                        type="text"
                        placeholder="Vyhledávání..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "9px 12px 9px 36px",
                            border: "1.5px solid #d0e8d0",
                            borderRadius: 10,
                            fontSize: 14,
                            color: "#1a3d1a",
                            background: "white",
                            outline: "none",
                            boxSizing: "border-box",
                        }}
                        onFocus={e => {
                            e.target.style.borderColor = "#2d7a2d";
                            e.target.style.boxShadow = "0 0 0 3px rgba(45,122,45,0.1)";
                        }}
                        onBlur={e => {
                            e.target.style.borderColor = "#d0e8d0";
                            e.target.style.boxShadow = "none";
                        }}
                    />
                </div>

                {canCreate && (
                    <button
                        onClick={onCreate}
                        style={{
                            background: "linear-gradient(135deg, #2d7a2d, #4caf50)",
                            border: "none",
                            borderRadius: 10,
                            padding: "9px 20px",
                            color: "white",
                            fontWeight: 600,
                            fontSize: 14,
                            cursor: "pointer",
                            boxShadow: "0 3px 10px rgba(45,122,45,0.3)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                        }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
                        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                    >
                        <FilePlus size={14} />
                        Přidat praxi
                    </button>
                )}
            </div>

            {filtered.length > 0 && (
                <p style={{ fontSize: 13, color: "#6b8f6b", marginBottom: 12 }}>
                    Zobrazeno <strong style={{ color: "#2d7a2d" }}>{filtered.length}</strong> z{" "}
                    <strong>{practices.length}</strong> praxí{search && " · filtrováno"}
                </p>
            )}

            <div style={{
                background: "white",
                borderRadius: 14,
                border: "1px solid #e0ede0",
                overflow: "hidden",
                boxShadow: "0 2px 12px rgba(34,85,34,0.06)",
            }}>
                {filtered.length === 0 ? (
                    <div style={{ padding: 48, textAlign: "center", color: "#8aaa8a" }}>
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                            <FolderOpen size={32} color="#8aaa8a" />
                        </div>
                        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4, color: "#5a7a5a" }}>
                            Žádné praxe
                        </div>
                        <div style={{ fontSize: 13 }}>
                            {search ? "Zkuste jiný vyhledávací dotaz" : "Zatím nebyly vytvořeny žádné praxe"}
                        </div>
                    </div>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                        <tr>
                            {columns.map(col => (
                                <th key={col.key} style={thStyle} onClick={() => handleSort(col.key)}>
                                    {col.label}
                                    {renderArrow(col.key)}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map(p => {
                            const sc = stateColors[p.state] || { bg: "#f0f4f0", color: "#667085" };
                            return (
                                <tr
                                    key={p.id}
                                    onDoubleClick={() => onOpenDetail(p.id)}
                                    onMouseEnter={() => setHoveredRow(p.id)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    style={{
                                        cursor: "pointer",
                                        background: hoveredRow === p.id ? "#f6faf6" : "white",
                                        transition: "background 0.15s",
                                    }}
                                >
                                    <td style={tdStyle}>
                                            <span style={{
                                                background: "#e8f5e9", color: "#2d7a2d",
                                                fontSize: 12, fontWeight: 600,
                                                padding: "2px 8px", borderRadius: 6,
                                            }}>
                                                #{p.id}
                                            </span>
                                    </td>
                                    <td style={{ ...tdStyle, fontWeight: 600 }}>{p.name}</td>
                                    <td style={tdStyle}>
                                            <span style={{
                                                background: sc.bg, color: sc.color,
                                                padding: "3px 10px", borderRadius: 20,
                                                fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
                                            }}>
                                                {translatePracticeState(p.state)}
                                            </span>
                                    </td>
                                    <td style={{ ...tdStyle, color: "#5a7a5a", fontSize: 13 }}>
                                        {p.founderEmail ?? "—"}
                                    </td>
                                    <td style={{ ...tdStyle, color: "#5a7a5a", fontSize: 13 }}>
                                        {p.studentEmail ?? "—"}
                                    </td>
                                    <td style={{ ...tdStyle, color: "#5a7a5a", fontSize: 13 }}>
                                        {formatDate(p.selectedAt)}
                                    </td>
                                    <td style={{ ...tdStyle, color: "#5a7a5a", fontSize: 13 }}>
                                        {formatDate(p.completedAt)}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                )}
            </div>

            <p style={{ fontSize: 12, color: "#a0baa0", textAlign: "right", marginTop: 10 }}>
                Dvojitý klik pro otevření detailu praxe
            </p>
        </div>
    );
};

export default SummaryOfPracticesView;