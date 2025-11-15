import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { registerUser, RegisterUserRequest } from "../../api/userApi";
import RegisterUserView from "./RegisterUserView";

const RegisterUser: React.FC = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState("STUDENT");
    const [isAdminOrTeacher, setIsAdminOrTeacher] = useState(false);

    const [formData, setFormData] = useState<RegisterUserRequest>({
        firstName: "",
        lastName: "",
        email: "",
        studentNumber: "",
        companyName: "",
        role: "STUDENT",
    });

    useEffect(() => {
        const storedRole = Cookies.get("userRole");
        if (storedRole === "ADMIN" || storedRole === "TEACHER") {
            setIsAdminOrTeacher(true);
            setRole("TEACHER");
        } else {
            setIsAdminOrTeacher(false);
            setRole("STUDENT");
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (newRole: string) => {
        setRole(newRole);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = { ...formData, role };
            const user = await registerUser(payload);
            alert(`Registrace proběhla úspěšně pro: ${user.email}`);
            navigate(isAdminOrTeacher ? "/summary" : "/");
        } catch (error: any) {
            alert(`Registrace se nezdařila: ${error.message}`);
        }
    };

    return (
        <RegisterUserView
            formData={formData}
            role={role}
            isAdminOrTeacher={isAdminOrTeacher}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onRoleChange={handleRoleChange}
        />
    );
};

export default RegisterUser;
