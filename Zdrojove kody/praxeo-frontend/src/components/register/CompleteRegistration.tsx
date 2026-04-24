import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CompleteRegistrationView from "./CompleteRegistrationView";
import {
    completeRegistration,
    loginUser,
    getRoleByToken,
} from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";

type CompleteRegistrationPayload = {
    token: string;
    password: string;
    firstName: string;
    lastName: string;
    studentNumber?: string;
    companyName?: string;
};

const CompleteRegistration: React.FC = () => {
    const [params] = useSearchParams();
    const token = params.get("token") || "";
    const navigate = useNavigate();
    const { login } = useAuth();

    const [role, setRole] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [studentNumber, setStudentNumber] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [password, setPassword] = useState("");
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [tokenInvalid, setTokenInvalid] = useState(false);

    // Načtení role podle tokenu z pozvánky
    useEffect(() => {
        let isActive = true;

        const fetchRole = async () => {
            if (!token) {
                return;
            }

            try {
                const data = await getRoleByToken(token);

                if (!isActive) {
                    return;
                }

                setRole(data.role);
            } catch (error: any) {
                if (!isActive) {
                    return;
                }

                console.error("Chyba získání role:", error);
                setTokenInvalid(true);
                setErrorMessage(
                    error?.response?.data?.message ||
                    "Tento odkaz již není platný nebo byl použit."
                );
            }
        };

        fetchRole();

        return () => {
            isActive = false;
        };
    }, [token]);

    // Sestavení payloadu podle role dokončovaného účtu
    const buildPayload = (): CompleteRegistrationPayload => {
        const payload: CompleteRegistrationPayload = {
            token,
            password,
            firstName,
            lastName,
        };

        if (role === "STUDENT") {
            payload.studentNumber = studentNumber;
        }

        if (role === "EXTERNAL_WORKER") {
            payload.companyName = companyName;
        }

        return payload;
    };

    // Odeslání formuláře a automatické přihlášení po dokončení registrace
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        setLoading(true);

        try {
            const result = await completeRegistration(buildPayload());

            if (!result.success) {
                setErrorMessage(result.message || "Chyba při dokončení registrace.");
                return;
            }

            const auth = await loginUser(result.email, password);

            // Přihlášení přes AuthContext, aby se header aktualizoval hned
            login(auth.token, {
                email: auth.email,
                role: auth.role,
                firstName: auth.firstName,
                lastName: auth.lastName,
            });

            navigate("/summary", {
                replace: true,
                state: { fromRegistration: true },
            });
        } catch (err: any) {
            setErrorMessage(
                err?.response?.data?.message ||
                "Tento odkaz již není platný nebo byl použit."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <CompleteRegistrationView
            role={role}
            firstName={firstName}
            lastName={lastName}
            studentNumber={studentNumber}
            companyName={companyName}
            password={password}
            loading={loading}
            errorMessage={errorMessage}
            tokenInvalid={tokenInvalid}
            setFirstName={setFirstName}
            setLastName={setLastName}
            setStudentNumber={setStudentNumber}
            setCompanyName={setCompanyName}
            setPassword={setPassword}
            handleSubmit={handleSubmit}
            agreedToTerms={agreedToTerms}
            setAgreedToTerms={setAgreedToTerms}
        />
    );
};

export default CompleteRegistration;
