import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import CompleteRegistrationView from "./CompleteRegistrationView";
import {
    completeRegistration,
    loginUser,
    getRoleByToken,
} from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";

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

    // Načtení role podle tokenu z pozvánky
    useEffect(() => {
        const fetchRole = async () => {
            if (!token) return;

            try {
                const data = await getRoleByToken(token);
                setRole(data.role);
            } catch (e) {
                console.error("Chyba získání role:", e);
                setErrorMessage("Nepodařilo se načíst informace o registraci.");
            }
        };

        fetchRole();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        setLoading(true);

        const payload: any = {
            token,
            password,
            firstName,
            lastName,
        };

        if (role === "STUDENT") payload.studentNumber = studentNumber;
        if (role === "EXTERNAL_WORKER") payload.companyName = companyName;

        try {
            const result = await completeRegistration(payload);

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

            navigate("/summary");
        } catch {
            setErrorMessage("Chyba komunikace se serverem.");
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