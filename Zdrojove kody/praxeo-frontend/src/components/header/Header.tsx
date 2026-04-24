import React from "react";
import { useNavigate } from "react-router-dom";
import HeaderView from "./HeaderView";
import { useAuth } from "../../context/AuthContext";

const Header: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // Odhlášení uživatele
    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    };

    // Přechod na přidání uživatele
    const handleAddUser = () => {
        navigate("/add-user");
    };

    // Klik na logo: přechod na domovskou stránku
    const handleLogoClick = () => {
        navigate("/");
    };

    // Přechod na přehled praxí
    const handleSummaryClick = () => {
        navigate("/summary");
    };

    return (
        <HeaderView
            email={user?.email}
            role={user?.role}
            onLogout={handleLogout}
            onAddUser={handleAddUser}
            onLogoClick={handleLogoClick}
            onSummaryClick={handleSummaryClick}
        />
    );
};

export default Header;