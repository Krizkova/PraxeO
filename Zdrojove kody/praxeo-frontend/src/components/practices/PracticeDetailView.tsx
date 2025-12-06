import React from "react";
import { Spinner, Alert } from "react-bootstrap";

interface Props {
    practice: any;
    loading: boolean;
    error: string | null;
}

const formatDate = (value: string | null) => {
    if (!value) return "";
    const d = new Date(value);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
};

const PracticeDetailView: React.FC<Props> = ({ practice, loading, error }) => {
    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!practice) return null;

    return (
        <div>
            <p><strong>Název praxe:</strong> {practice.name}</p>
            <p><strong>Popis:</strong> {practice.description}</p>
            <p><strong>Název firmy:</strong> {practice.companyName}</p>
            <p>
                <strong>Trvání:</strong>{" "}
                {formatDate(practice.validFrom)} – {formatDate(practice.validTo)}
            </p>
        </div>
    );
};

export default PracticeDetailView;
