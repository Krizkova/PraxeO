import React, { useMemo, useState } from "react";
import {
    Search,
    FilePlus,
    FolderOpen,
    ChevronsUpDown,
    ArrowUp,
    ArrowDown,
} from "lucide-react";
import PrimaryButton from "../../common/PrimaryButton";
import ErrorAlert from "../../common/ErrorAlert";
import PracticeSummaryRow from "./PracticeSummaryRow";
import type { Practice } from "../../../utils/forms/types/practice";

interface SummaryOfPracticesViewProps {
    practices: Practice[];
    loading: boolean;
    error: string | null;
    onOpenDetail: (id: number) => void;
    onCreate: () => void;
    canCreate: boolean;
}

type SortKey =
    | "id"
    | "name"
    | "state"
    | "founderEmail"
    | "studentEmail"
    | "selectedAt"
    | "completedAt"
    | null;

// Přehled praxí s vyhledáváním, řazením a otevřením detailu
const SummaryOfPracticesView: React.FC<SummaryOfPracticesViewProps> = ({
                                                                           practices = [],
                                                                           loading,
                                                                           error,
                                                                           onOpenDetail,
                                                                           onCreate,
                                                                           canCreate,
                                                                       }) => {
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>(null);
    const [isAscending, setIsAscending] = useState(true);
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);

    const normalizedSearch = search.toLowerCase();

    // Přepnutí řazení podle vybraného sloupce
    const handleSort = (key: NonNullable<SortKey>) => {
        if (sortKey === key) {
            setIsAscending((prev) => !prev);
            return;
        }

        setSortKey(key);
        setIsAscending(true);
    };

    // Ikona směru řazení v hlavičce tabulky
    const renderArrow = (key: NonNullable<SortKey>) => {
        if (sortKey !== key) {
            return (
                <ChevronsUpDown
                    size={11}
                    style={{ color: "#C5D5C5", marginLeft: 4 }}
                />
            );
        }

        return isAscending ? (
            <ArrowUp size={11} style={{ color: "#2d7a2d", marginLeft: 4 }} />
        ) : (
            <ArrowDown size={11} style={{ color: "#2d7a2d", marginLeft: 4 }} />
        );
    };

    // Filtrování a případné řazení seznamu praxí
    const filteredPractices = useMemo(() => {
        const result = practices.filter(
            (practice) =>
                practice.name?.toLowerCase().includes(normalizedSearch) ||
                practice.founderEmail?.toLowerCase().includes(normalizedSearch) ||
                practice.studentEmail?.toLowerCase().includes(normalizedSearch)
        );

        if (!sortKey) return result;

        return [...result].sort((a, b) => {
            const aValue = a[sortKey] ?? "";
            const bValue = b[sortKey] ?? "";

            if (aValue < bValue) return isAscending ? -1 : 1;
            if (aValue > bValue) return isAscending ? 1 : -1;
            return 0;
        });
    }, [practices, normalizedSearch, sortKey, isAscending]);

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

    const columns: { key: NonNullable<SortKey>; label: string }[] = [
        { key: "id", label: "ID" },
        { key: "name", label: "Název" },
        { key: "state", label: "Stav" },
        { key: "founderEmail", label: "Zadavatel" },
        { key: "studentEmail", label: "Student" },
        { key: "selectedAt", label: "Datum vybrání" },
        { key: "completedAt", label: "Datum ukončení" },
    ];

    // Stav načítání seznamu praxí
    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
                <div
                    style={{
                        width: 24,
                        height: 24,
                        border: "2px solid #D6EDDF",
                        borderTopColor: "#2d7a2d",
                        borderRadius: "50%",
                    }}
                />
            </div>
        );
    }

    // Chybový stav při načítání seznamu praxí
    if (error) {
        return <ErrorAlert message={error} />;
    }

    return (
        <div>
            {/* Vyhledávání a tlačítko pro vytvoření nové praxe */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ position: "relative", flex: 1 }}>
                    <div
                        style={{
                            position: "absolute",
                            left: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#8aaa8a",
                            pointerEvents: "none",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Search size={15} />
                    </div>

                    <input
                        type="text"
                        placeholder="Vyhledávání..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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
                        onFocus={(e) => {
                            e.target.style.borderColor = "#2d7a2d";
                            e.target.style.boxShadow = "0 0 0 3px rgba(45,122,45,0.1)";
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = "#d0e8d0";
                            e.target.style.boxShadow = "none";
                        }}
                    />
                </div>

                {canCreate && (
                    <PrimaryButton
                        type="button"
                        onClick={onCreate}
                        width="auto"
                        height={40}
                    >
                        <span
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                whiteSpace: "nowrap",
                                padding: "0 2px",
                            }}
                        >
                            <FilePlus size={14} />
                            Přidat praxi
                        </span>
                    </PrimaryButton>
                )}
            </div>

            {/* Informace o počtu zobrazených praxí */}
            {filteredPractices.length > 0 && (
                <p style={{ fontSize: 13, color: "#6b8f6b", marginBottom: 12 }}>
                    Zobrazeno{" "}
                    <strong style={{ color: "#2d7a2d" }}>{filteredPractices.length}</strong> z{" "}
                    <strong>{practices.length}</strong> praxí
                    {search && " · filtrováno"}
                </p>
            )}

            {/* Tabulka nebo prázdný stav */}
            <div
                style={{
                    background: "white",
                    borderRadius: 14,
                    border: "1px solid #e0ede0",
                    overflow: "hidden",
                    boxShadow: "0 2px 12px rgba(34,85,34,0.06)",
                }}
            >
                {filteredPractices.length === 0 ? (
                    <div style={{ padding: 48, textAlign: "center", color: "#8aaa8a" }}>
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                            <FolderOpen size={32} color="#8aaa8a" />
                        </div>
                        <div
                            style={{
                                fontWeight: 600,
                                fontSize: 16,
                                marginBottom: 4,
                                color: "#5a7a5a",
                            }}
                        >
                            Žádné praxe
                        </div>
                        <div style={{ fontSize: 13 }}>
                            {search
                                ? "Zkuste jiný vyhledávací dotaz"
                                : "Zatím nebyly vytvořeny žádné praxe"}
                        </div>
                    </div>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    style={thStyle}
                                    onClick={() => handleSort(col.key)}
                                >
                                        <span
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            {col.label}
                                            {renderArrow(col.key)}
                                        </span>
                                </th>
                            ))}
                        </tr>
                        </thead>

                        <tbody>
                        {filteredPractices.map((practice) => (
                            <PracticeSummaryRow
                                key={practice.id}
                                practice={practice}
                                isHovered={hoveredRow === practice.id}
                                onHover={setHoveredRow}
                                onOpenDetail={onOpenDetail}
                            />
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Nápověda pro otevření detailu */}
            <p style={{ fontSize: 12, color: "#a0baa0", textAlign: "right", marginTop: 10 }}>
                Dvojitý klik pro otevření detailu praxe
            </p>
        </div>
    );
};

export default SummaryOfPracticesView;