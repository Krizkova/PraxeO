import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, RegisterUserRequest } from "../../api/userApi.js";

const RegisterStudent: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<RegisterUserRequest>({
        firstName: "",
        lastName: "",
        email: "",
        studentNumber: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const user = await registerUser(formData);
            alert(`Registrace proběhla úspěšně pro: ${user.email}`);
            navigate("/");
        } catch (error: any) {
            console.error("Chyba při registraci:", error);
            alert(`Registrace se nezdařila: ${error.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row mb-3">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        name="firstName"
                        placeholder="Jméno"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                </div>
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        name="lastName"
                        placeholder="Příjmení"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-md-6">
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        name="studentNumber"
                        placeholder="Studijní číslo"
                        value={formData.studentNumber}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <button type="submit" className="btn btn-success">
                Registrovat se
            </button>
        </form>
    );
};

export default RegisterStudent;
