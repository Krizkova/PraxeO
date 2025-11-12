import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import Header from "../header/Header";
import SummaryOfPractices from "../mainPages/SummaryOfPractices";
import {getCurrentUser, UserResponse} from "../../api/userApi";

const SummaryOfPracticesPage: React.FC = () => {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            setError("Uživatel není přihlášen.");
            setLoading(false);
            return;
        }

        getCurrentUser()
            .then((u) => {
                setUser(u);
                setError(null);
            })
            .catch(() => setError("Uživatel není přihlášen."))
            .finally(() => setLoading(false));
    }, []);

    return (
        <>

        </>
    );
};

export default SummaryOfPracticesPage;
