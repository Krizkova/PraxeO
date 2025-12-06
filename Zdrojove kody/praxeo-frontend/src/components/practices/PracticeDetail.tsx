import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPracticeDetail } from "../../api/practicesApi";
import PracticeDetailView from "./PracticeDetailView";

const PracticeDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [practice, setPractice] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        getPracticeDetail(id)
            .then((data) => setPractice(data))
            .catch(() => setError("Nepodařilo se načíst detail praxe."))
            .finally(() => setLoading(false));

    }, [id]);

    return (
        <PracticeDetailView
            practice={practice}
            loading={loading}
            error={error}
        />
    );
};

export default PracticeDetail;
