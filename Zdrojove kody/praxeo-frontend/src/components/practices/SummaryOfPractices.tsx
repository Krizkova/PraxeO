import React, { useEffect, useState } from "react";
import { getPracticesByRole } from "../../api/practicesApi";
import SummaryOfPracticesView from "./SummaryOfPracticesView";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../api/userApi";

const SummaryOfPractices: React.FC = () => {
    const [practices, setPractices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleOpenDetail = (id: number) => navigate(`/practices/${id}`);
    const handleCreate = () => navigate("/practices/create");

    useEffect(() => {
        let mounted = true;

        // Načtení role a seznamu praxí po otevření stránky
        (async () => {
            try {
                const u = await getCurrentUser();
                if (!mounted) return;

                const resolvedRole = (u.role || "").toUpperCase();
                setRole(resolvedRole);
            } catch (err: any) {
                console.log("Role ERROR:", err.response?.status);
            }

            try {
                const data = await getPracticesByRole();
                if (!mounted) return;

                // Ponecháme pořadí z backendu: dokončené nahoře, nové dole
                setPractices(data);
                setError(null);
            } catch (err: any) {
                setError(
                    err?.response?.data?.message || "Nepodařilo se načíst praxe."
                );
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    const canCreate =
        role === "ADMIN" ||
        role === "EXTERNAL_WORKER" ||
        role === "TEACHER";

    return (
        <SummaryOfPracticesView
            practices={practices}
            loading={loading}
            error={error}
            onOpenDetail={handleOpenDetail}
            onCreate={handleCreate}
            canCreate={canCreate}
        />
    );
};

export default SummaryOfPractices;