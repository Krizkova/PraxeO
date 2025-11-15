import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import HeaderView from "./HeaderView";
import { getCurrentUser, UserResponse } from "../../api/userApi";

const Header: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserResponse | null>(null);
    const [token, setToken] = useState<string | undefined>(Cookies.get("token"));

    useEffect(() => {
        const interval = setInterval(() => {
            const current = Cookies.get("token");
            if (current !== token) {
                setToken(current);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [token]);

    useEffect(() => {
        if (!token) {
            setUser(null);
            return;
        }

        getCurrentUser()
            .then((u) => setUser(u))
            .catch(() => setUser(null));
    }, [token]);

    const handleLogout = () => {
        document.cookie.split(";").forEach((c) => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        localStorage.clear();
        sessionStorage.clear();
        setUser(null);
        setToken(undefined);
        navigate("/", { replace: true });
    };

    const handleAddUser = () => {
        navigate("/add-user");
    };

    return (
        <HeaderView
            email={user?.email}
            role={user?.role}
            onLogout={handleLogout}
            onAddUser={handleAddUser}
        />
    );
};

export default Header;
