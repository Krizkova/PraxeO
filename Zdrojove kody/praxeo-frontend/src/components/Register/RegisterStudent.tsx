import React, { useState } from "react";
import { registerUser, RegisterUserRequest } from "../../api/userApi.js";

const RegisterStudent: React.FC = () => {
    const [formData, setFormData] = useState<RegisterUserRequest>({
        jmeno: "",
        prijmeni: "",
        email: "",
        heslo: "",
        studijniCislo: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await registerUser(formData);
            alert("Registrace proběhla úspěšně!");
        } catch (error) {
            console.error(error);
            alert("Registrace se nezdařila.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row mb-3">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        name="jmeno"
                        placeholder="Jméno"
                        value={formData.jmeno}
                        onChange={handleChange}
                    />
                </div>
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        name="prijmeni"
                        placeholder="Příjmení"
                        value={formData.prijmeni}
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
                        name="studijniCislo"
                        placeholder="Studijní číslo"
                        value={formData.studijniCislo}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-6">
                    <input
                        type="password"
                        className="form-control"
                        name="heslo"
                        placeholder="Heslo"
                        value={formData.heslo}
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
