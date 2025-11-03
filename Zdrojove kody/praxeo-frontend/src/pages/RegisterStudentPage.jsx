import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterStudentForm from "../components/RegisterStudentForm";
import api from "../utils/api";

export default function RegisterStudentPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        studyNumber: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/users/register", formData);
            alert("✅ Registrace proběhla úspěšně!");
            navigate("/");
        } catch (err) {
            console.error("❌ Chyba při registraci:", err);
            alert("❌ Registrace selhala!");
        }
    };

    return (
        <>
            {/* Header */}
            <header className="bg-success text-white py-3 px-4 d-flex align-items-center">
                <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTenJ6soGRThFsEiLSHM3ljqVMSQdUWkYsY_Q&s"
                    alt="logo"
                    height="40"
                    className="me-3"
                />
                <h4 className="m-0">PraxeO</h4>
            </header>

            {/* Main content */}
            <div className="container mt-4">
                <button className="btn btn-outline-success mb-3" onClick={() => navigate("/")}>
                    ← Zpět
                </button>
                <h5 className="fw-bold mb-3">Registrace studenta</h5>
                <RegisterStudentForm
                    formData={formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                />
            </div>
        </>
    );
}
