import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import RegisterUserView from "./RegisterUserView";
import { registerUser } from "../../api/userApi";

interface Props {
    isAdminOrTeacher: boolean;
    role?: string | null;
}

const RegisterUser: React.FC<Props> = ({ isAdminOrTeacher }) => {
    const navigate = useNavigate();

    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const savedRole = Cookies.get("userRole");
        setUserRole(savedRole ?? null);
        console.log("roleSelect:", roleSelect);
    }, []);

    const [formData, setFormData] = useState({
        email: ""
    });

    const [roleSelect, setRoleSelect] = useState(
        isAdminOrTeacher ? "TEACHER" : "STUDENT"
    );

    const handleRoleChange = (newRole: string) => {
        setRoleSelect(newRole);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const finalRole = isAdminOrTeacher ? roleSelect : "STUDENT";

        try {
            await registerUser({
                email: formData.email,
                role: finalRole
            });

            alert("Registrační e-mail byl odeslán.");
            navigate("/");
        } catch (err: any) {
            alert("Registrace se nezdařila: " + err.message);
        }
    };

    return (
        <RegisterUserView
            formData={{ ...formData, role: roleSelect }}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isAdminOrTeacher={isAdminOrTeacher}
            roleSelect={roleSelect}
            onRoleChange={handleRoleChange}
        />
    );
};

export default RegisterUser;
