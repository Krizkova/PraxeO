import React from "react";
import FormField from "./FormField";
import {
    inputStyle,
    errorFieldStyle,
} from "./formStyles";
import {
    applyFocusStyle,
    clearFocusStyle,
} from "./formHelpers";

interface Props {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    invalid?: boolean;
    error?: React.ReactNode;
    hint?: React.ReactNode;
    name?: string;
    autoComplete?: string;
}

const PasswordField: React.FC<Props> = ({
                                            label,
                                            value,
                                            onChange,
                                            placeholder = "••••••••",
                                            invalid = false,
                                            error,
                                            hint,
                                            name,
                                            autoComplete = "new-password",
                                        }) => {
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        applyFocusStyle(e.currentTarget);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        clearFocusStyle(e.currentTarget, invalid);
    };

    return (
        <FormField label={label} error={error} hint={hint} marginBottom={12}>
            <input
                type="password"
                name={name}
                autoComplete={autoComplete}
                style={{
                    ...inputStyle,
                    ...(invalid ? errorFieldStyle : {}),
                }}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
            />
        </FormField>
    );
};

export default PasswordField;