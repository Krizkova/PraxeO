import React, { useEffect, useState } from "react";
import { getPracticesByRole } from "../../api/practicesApi";
import SummaryOfPracticesView from "./SummaryOfPracticesView";
import { useNavigate } from "react-router-dom";
import {getCurrentUser} from "../../api/userApi";

const SummaryOfPractices: React.FC = () => {
    const [practices, setPractices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    let [role, setRole] = useState<string | null>(null);


    const navigate = useNavigate();

    const handleOpenDetail = (id: number) => {
        navigate(`/practices/${id}`);
    };

    const handleCreate = () => {
        navigate("/practices/create");
    };

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const u = await getCurrentUser();
                if (!mounted) return;

                const roleValue = (u.role || "").toUpperCase();
                setRole(roleValue);
                role = roleValue;
                console.log("ROLE:", role);

            } catch (err: any) {
                console.log("Role ERROR:", err.response?.status);
            }

            try {
                const data = await getPracticesByRole();
                if (!mounted) return;

                setPractices(data);
                setError(null);

            } catch (err: any) {
                alert("Chyba: " + (err.response?.data?.message || "Nastala neočekávaná chyba."));
                setError("Nepodařilo se načíst praxe.");
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <SummaryOfPracticesView
            practices={practices}
            loading={loading}
            error={error}
            onOpenDetail={handleOpenDetail}
            onCreate={handleCreate}
            canCreate={
                role === "ADMIN" ||
                role === "EXTERNAL_WORKER" ||
                role === "TEACHER"
            }
        />
    );
};

export default SummaryOfPractices;
