import React from "react";

interface Props {
    formData: {
        email: string;
        role: string;
    };
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    isAdminOrTeacher: boolean;
    roleSelect: string;
    onRoleChange: (role: string) => void;
}

const RegisterUserView: React.FC<Props> = ({
                                               formData,
                                               onChange,
                                               onSubmit,
                                               isAdminOrTeacher,
                                               roleSelect,
                                               onRoleChange
                                           }) => {
    return (
        <form onSubmit={onSubmit} style={{ maxWidth: 500 }}>
            {isAdminOrTeacher && (
                <div className="mb-3">
                    <select
                        className="form-select"
                        name="roleSelect"
                        value={roleSelect}
                        onChange={(e) => onRoleChange(e.target.value)}
                    >
                        <option value="TEACHER">Učitel</option>
                        <option value="EXTERNAL_WORKER">Externista</option>
                    </select>
                </div>
            )}

            <div className="mb-3">
                <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Zadejte email"
                    value={formData.email}
                    onChange={onChange}
                    required
                />
            </div>

            <button className="btn btn-success w-100" type="submit">
                Registrovat se
            </button>
        </form>
    );
};

export default RegisterUserView;
