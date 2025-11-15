import React from "react";

interface RegisterUserViewProps {
    formData: any;
    role: string;
    isAdminOrTeacher: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onRoleChange: (role: string) => void;
}

const RegisterUserView: React.FC<RegisterUserViewProps> = ({
                                                               formData,
                                                               role,
                                                               isAdminOrTeacher,
                                                               onChange,
                                                               onSubmit,
                                                               onRoleChange
                                                           }) => {
    return (
        <form onSubmit={onSubmit}>
            <div className="row mb-3">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        name="firstName"
                        placeholder="Jméno"
                        value={formData.firstName}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        name="lastName"
                        placeholder="Příjmení"
                        value={formData.lastName}
                        onChange={onChange}
                        required
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
                        onChange={onChange}
                        required
                    />
                </div>

                {role === "STUDENT" && (
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            name="studentNumber"
                            placeholder="Studijní číslo"
                            value={formData.studentNumber}
                            onChange={onChange}
                            required
                        />
                    </div>
                )}

                {role === "EXTERNAL_WORKER" && (
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            name="companyName"
                            placeholder="Název firmy"
                            value={formData.companyName}
                            onChange={onChange}
                            required
                        />
                    </div>
                )}
            </div>

            {isAdminOrTeacher && (
                <div className="row mb-3">
                    <div className="col-md-2">
                        <select
                            className="form-select"
                            name="role"
                            value={role}
                            onChange={(e) => onRoleChange(e.target.value)}
                            required
                        >
                            <option value="TEACHER">Učitel</option>
                            <option value="EXTERNAL_WORKER">Externista</option>
                        </select>
                    </div>
                </div>
            )}

            <button type="submit" className="btn btn-success">
                {isAdminOrTeacher ? "Přidat uživatele" : "Registrovat se"}
            </button>
        </form>
    );
};

export default RegisterUserView;
