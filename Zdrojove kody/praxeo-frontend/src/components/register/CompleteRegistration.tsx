import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import CompleteRegistrationView from "./CompleteRegistrationView";
import Cookies from "js-cookie";
import {
    completeRegistration,
    loginUser,
    getRoleByToken
} from "../../api/userApi";

const CompleteRegistration: React.FC = () => {
    const [params] = useSearchParams();
    const token = params.get("token") || "";
    const navigate = useNavigate();

    const [role, setRole] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [studentNumber, setStudentNumber] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    // --- DŮLEŽITÉ: zde se načte role z tokenu ---
    useEffect(() => {
        const fetchRole = async () => {
            if (!token) return;

            try {
                const data = await getRoleByToken(token);
                setRole(data.role);
            } catch (e) {
                console.error("Chyba získání role:", e);
            }
        };

        fetchRole();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // generické payload
        const payload: any = {
            token,
            password,
            firstName,
            lastName
        };

        // pouze, co odpovídá roli
        if (role === "STUDENT") payload.studentNumber = studentNumber;
        if (role === "EXTERNAL_WORKER") payload.companyName = companyName;

        try {
            const result = await completeRegistration(payload);

            if (!result.success) {
                alert(result.message || "Chyba při dokončení registrace.");
                setLoading(false);
                return;
            }

            const login = await loginUser(result.email, password);

            Cookies.set("token", login.token);
            Cookies.set("userEmail", login.email);
            Cookies.set("userRole", login.role);

            navigate("/summary");

        } catch (err) {
            alert("Chyba komunikace se serverem.");
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
            setFirstName={setFirstName}
            setLastName={setLastName}
            setStudentNumber={setStudentNumber}
            setCompanyName={setCompanyName}
            setPassword={setPassword}
            handleSubmit={handleSubmit}
        />
    );
};

export default CompleteRegistration;
