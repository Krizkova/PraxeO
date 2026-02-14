import React, { useMemo, useState } from "react";
import { Table, Spinner, Alert, Form, Button } from "react-bootstrap";
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
    | "completedAt";

const SummaryOfPracticesView: React.FC<Props> = ({
                                                     practices,
                                                     loading,
                                                     error,
                                                     onOpenDetail,
                                                     onCreate,
                                                     canCreate
                                                 }) => {
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>("id");
    const [asc, setAsc] = useState(true);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setAsc(!asc);
        } else {
            setSortKey(key);
            setAsc(true);
        }
    };

    const renderArrow = (key: SortKey) => {
        if (sortKey !== key) return " ⇅";
        return asc ? " ▲" : " ▼";
    };

    const filtered = useMemo(() => {
        const lower = search.toLowerCase();
        return practices
            .filter(
                (p) =>
                    p.name?.toLowerCase().includes(lower) ||
                    p.founderEmail?.toLowerCase().includes(lower) ||
                    p.studentEmail?.toLowerCase().includes(lower)
            )
            .sort((a, b) => {
                const aVal = a[sortKey] ?? "";
                const bVal = b[sortKey] ?? "";
                if (aVal < bVal) return asc ? -1 : 1;
                if (aVal > bVal) return asc ? 1 : -1;
                return 0;
            });
    }, [practices, search, sortKey, asc]);

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Control
                    style={{ maxWidth: 300 }}
                    placeholder="Vyhledávání..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {canCreate && (
                    <Button variant="success" onClick={onCreate}>
                        Přidat praxi
                    </Button>
                )}
            </div>

            <Table striped bordered hover>
                <thead>
                <tr>
                    <th style={{ cursor: "pointer" }} onClick={() => handleSort("id")}>
                        ID{renderArrow("id")}
                    </th>
                    <th style={{ cursor: "pointer" }} onClick={() => handleSort("name")}>
                        Název{renderArrow("name")}
                    </th>
                    <th style={{ cursor: "pointer" }} onClick={() => handleSort("state")}>
                        Stav{renderArrow("state")}
                    </th>
                    <th style={{ cursor: "pointer" }} onClick={() => handleSort("founderEmail")}>
                        Zadavatel{renderArrow("founderEmail")}
                    </th>
                    <th style={{ cursor: "pointer" }} onClick={() => handleSort("studentEmail")}>
                        Student{renderArrow("studentEmail")}
                    </th>
                    <th style={{ cursor: "pointer" }} onClick={() => handleSort("selectedAt")}>
                        Datum vybrání{renderArrow("selectedAt")}
                    </th>
                    <th style={{ cursor: "pointer" }} onClick={() => handleSort("completedAt")}>
                        Datum ukončení{renderArrow("completedAt")}
                    </th>
                </tr>
                </thead>
                <tbody>
                {filtered.map((p) => (
                    <tr
                        key={p.id}
                        onDoubleClick={() => onOpenDetail(p.id)}
                        style={{ cursor: "pointer" }}
                    >
                        <td>{p.id}</td>
                        <td>{p.name}</td>
                        <td>{translatePracticeState(p.state)}</td>
                        <td>{p.founderEmail ?? "—"}</td>
                        <td>{p.studentEmail ?? "—"}</td>
                        <td>{formatDate(p.selectedAt)}</td>
                        <td>{formatDate(p.completedAt)}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </>
    );
};

export default SummaryOfPracticesView;
