import React from "react";
import { useNavigate } from "react-router-dom";
import HeaderView from "./HeaderView";
import { useAuth } from "../../context/AuthContext";

const Header: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
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