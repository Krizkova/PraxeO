import React, { useEffect, useState } from "react";
import { getPracticesByRole } from "../../api/practicesApi";
import SummaryOfPracticesView from "./SummaryOfPracticesView";
import {useNavigate} from "react-router-dom";

const SummaryOfPractices: React.FC = () => {
    const [practices, setPractices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleOpenDetail = (id: number) => {
        navigate(`/practices/${id}`);
    };


    useEffect(() => {
        getPracticesByRole()
            .then((data) => {
                setPractices(data);
                setError(null);
            })
            .catch((err: any) => {
                alert("Chyba: " + (err.response?.data?.message || "Nastala neočekávaná chyba."));
                setError("Nepodařilo se načíst praxe.");
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <SummaryOfPracticesView
            practices={practices}
            loading={loading}
            error={error}
            onOpenDetail={handleOpenDetail}
        />
    );
};

export default SummaryOfPractices;
