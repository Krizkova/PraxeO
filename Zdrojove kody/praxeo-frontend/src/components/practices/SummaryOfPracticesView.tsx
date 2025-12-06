import React from "react";
import { Table, Spinner, Alert } from "react-bootstrap";

interface Props {
    practices: any[];
    loading: boolean;
    error: string | null;
    onOpenDetail: (id: number) => void;
}


const formatDate = (value: string | null) => {
    if (!value) return "";
    const d = new Date(value);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
};


const SummaryOfPracticesView: React.FC<Props> = ({ practices, loading, error, onOpenDetail }) => {
    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>ID</th>
                <th>Název firmy</th>
                <th>Název praxe</th>
                <th>Popis</th>
                <th>Trvání od</th>
                <th>Trvání do</th>
                <th>Student</th>
                <th>Zakladatel</th>
            </tr>
            </thead>
            <tbody>
            {practices.map((p) => (
                <tr key={p.id} onDoubleClick={() => onOpenDetail(p.id)} style={{ cursor: "pointer" }}>
                    <td>{p.id}</td>
                    <td>{p.companyName}</td>
                    <td>{p.name}</td>
                    <td>{p.description}</td>
                    <td>{formatDate(p.validFrom)}</td>
                    <td>{formatDate(p.validTo)}</td>
                    <td>{p.studentEmail}</td>
                    <td>{p.founderEmail}</td>
                </tr>
            ))}
            </tbody>
        </Table>
    );
};

export default SummaryOfPracticesView;
