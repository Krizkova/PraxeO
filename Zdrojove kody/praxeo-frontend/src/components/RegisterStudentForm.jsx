import { useState } from "react";
import api from "../utils/api";

export default function RegisterStudentForm() {
    const [formData, setFormData] = useState({
        jmeno: "",
        prijmeni: "",
        email: "",
        studijniCislo: "",
        heslo: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/users/registerStudent", formData);
            alert("Registrace proběhla úspěšně!");
        } catch (error) {
            console.error("Chyba při registraci:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Registrace studenta</h2>
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
        </div>
    );
}
