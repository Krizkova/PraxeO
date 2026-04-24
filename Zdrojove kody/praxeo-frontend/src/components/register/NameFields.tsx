import React from "react";
import { inputStyle, labelStyle } from "../../components/form";

interface NameFieldsProps {
    firstName: string;
    lastName: string;
    setFirstName: (value: string) => void;
    setLastName: (value: string) => void;
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const NameFields: React.FC<NameFieldsProps> = ({
                                                   firstName,
                                                   lastName,
                                                   setFirstName,
                                                   setLastName,
                                                   onFocus,
                                                   onBlur,
                                               }) => {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 16,
            }}
        >
            <div>
                <label style={labelStyle}>Jméno</label>
                <input
                    style={inputStyle}
                    placeholder="Jan"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    autoComplete="off"
                    required
                />
            </div>

            <div>
                <label style={labelStyle}>Příjmení</label>
                <input
                    style={inputStyle}
                    placeholder="Novák"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    autoComplete="off"
                    required
                />
            </div>
        </div>
    );
};

export default NameFields;