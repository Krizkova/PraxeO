import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPracticesByRole } from "../../../api/practicesApi";
import { getCurrentUser } from "../../../api/userApi";
import SummaryOfPracticesView from "./SummaryOfPracticesView";
import type { Practice } from "../../../utils/forms/types/practice";

const SummaryOfPractices: React.FC = () => {
    const [practices, setPractices] = useState<Practice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleOpenDetail = (id: number) => navigate(`/practices/${id}`);
    const handleCreate = () => navigate("/practices/create");

    // Vrátí chybovou zprávu z API nebo obecný text
    const getErrorMessage = (err: unknown) => {
        if (
            err &&
            typeof err === "object" &&
            "response" in err &&
            err.response &&
            typeof err.response === "object" &&
            "data" in err.response &&
            err.response.data &&
            typeof err.response.data === "object" &&
            "message" in err.response.data &&
            typeof err.response.data.message === "string"
        ) {
            return err.response.data.message;
        }

        return "Nepodařilo se načíst praxe.";
    };

    useEffect(() => {
        let mounted = true;

        // Načtení role a seznamu praxí po otevření stránky
        (async () => {
            try {
                const user = await getCurrentUser();
                if (!mounted) return;

                setRole((user.role || "").toUpperCase());
            } catch (err) {
                console.log("Role ERROR:", err);
            }

            try {
                const data = await getPracticesByRole();
                if (!mounted) return;

                // Ponecháme pořadí z backendu: dokončené nahoře, nové dole
                setPractices(data);
                setError(null);
            } catch (err) {
                setError(getErrorMessage(err));
            } finally {
                if (mounted) {
                    setLoading(false);
                }
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