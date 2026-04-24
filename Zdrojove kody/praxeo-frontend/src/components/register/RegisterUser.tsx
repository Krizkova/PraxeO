import React, { useState } from "react";
import RegisterUserView from "./RegisterUserView";
import { registerUser } from "../../api/userApi";

type RegisterRole = "STUDENT" | "TEACHER" | "EXTERNAL_WORKER" | "ADMIN";

interface RegisterUserProps {
    isAdminOrTeacher: boolean;
    role?: string;
}

interface RegisterUserFormData {
    email: string;
    role: RegisterRole;
}

const RegisterUser: React.FC<RegisterUserProps> = ({ isAdminOrTeacher, role }) => {
    const initialRole: RegisterRole = isAdminOrTeacher
        ? ((role as RegisterRole) || "TEACHER")
        : "STUDENT";

    const [formData, setFormData] = useState<RegisterUserFormData>({
        email: "",
        role: initialRole,
    });

    const [emailError, setEmailError] = useState("");
    const [generalError, setGeneralError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

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
            role: newRole as RegisterRole,
        }));

        setGeneralError("");
        setSuccessMessage("");
        setEmailError("");
    };

    const handleAddAnotherUser = () => {
        setSent(false);
        setSuccessMessage("");
        setEmailError("");
        setGeneralError("");
        setFormData({
            email: "",
            role: initialRole,
        });
    };

    // Odeslání registračního odkazu
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailError("");
        setGeneralError("");
        setSuccessMessage("");
        setLoading(true);

        try {
            const normalizedEmail = formData.email.trim().toLowerCase();
            const targetRole = isAdminOrTeacher ? formData.role : "STUDENT";

            // U role TEACHER musí e-mail končit na @osu.cz
            if (
                targetRole === "TEACHER" &&
                !normalizedEmail.endsWith("@osu.cz")
            ) {
                setEmailError("Učitel musí mít univerzitní e-mail @osu.cz.");
                setLoading(false);
                return;
            }

            const payload = {
                email: formData.email.trim(),
                role: targetRole,
            };

            const response = await registerUser(payload);

            setSuccessMessage(
                "Odkaz pro dokončení registrace byl odeslán na zadaný e-mail. Zkontrolujte prosím svou schránku."
            );
            setSent(true);

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
            sent={sent}
            onAddAnotherUser={handleAddAnotherUser}
        />
    );
};

export default RegisterUser;