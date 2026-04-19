import React, { useState } from "react";
import RegisterUserView from "./RegisterUserView";
import { registerUser } from "../../api/userApi";

interface RegisterUserProps {
    isAdminOrTeacher: boolean;
    role?: string;
}

const RegisterUser: React.FC<RegisterUserProps> = ({ isAdminOrTeacher, role }) => {
    const initialRole = isAdminOrTeacher ? role || "TEACHER" : "STUDENT";

    const [formData, setFormData] = useState({
        email: "",
        role: initialRole,
    });

    const [emailError, setEmailError] = useState("");
    const [generalError, setGeneralError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === "email") {
            setEmailError("");
            setGeneralError("");
            setSuccessMessage("");
        }
    };

    const handleRoleChange = (newRole: string) => {
        if (!isAdminOrTeacher) return;

        setFormData((prev) => ({
            ...prev,
            role: newRole,
        }));

        setGeneralError("");
        setSuccessMessage("");
    };

    // Odeslání registračního odkazu
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailError("");
        setGeneralError("");
        setSuccessMessage("");
        setLoading(true);

        try {
            const payload = {
                email: formData.email.trim(),
                role: isAdminOrTeacher ? formData.role : "STUDENT",
            };

            const response = await registerUser(payload);

            setSuccessMessage(
                response?.message || "Pozvánka byla úspěšně odeslána."
            );

            setFormData({
                email: "",
                role: initialRole,
            });
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Nepodařilo se vytvořit uživatele.";

            const normalized = String(message).toLowerCase();

            // Speciální hláška pro již existující e-mail
            if (
                normalized.includes("email") &&
                (normalized.includes("exist") ||
                    normalized.includes("už") ||
                    normalized.includes("already"))
            ) {
                setEmailError("Uživatel s tímto e-mailem už existuje.");
            } else {
                setGeneralError(message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <RegisterUserView
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isAdminOrTeacher={isAdminOrTeacher}
            roleSelect={formData.role}
            onRoleChange={handleRoleChange}
            emailError={emailError}
            generalError={generalError}
            successMessage={successMessage}
            loading={loading}
        />
    );
};

export default RegisterUser;