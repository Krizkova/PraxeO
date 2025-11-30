import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ResetPasswordView from "./ResetPasswordView";
import {loginUser, resetPassword} from "../../api/userApi";
import Cookies from "js-cookie";

const ResetPassword: React.FC = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const token = params.get("token") || "";

    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await resetPassword({ token, password });

            if (!res.success) {
                alert(res.message);
                setLoading(false);
                return;
            }

            const email = res.email;

            const loginResult = await loginUser(email, password);

            if (!loginResult) {
                alert("Heslo bylo změněno, ale přihlášení se nezdařilo.");
                setLoading(false);
                return;
            }
            Cookies.set("token", loginResult.token);
            Cookies.set("userEmail", loginResult.email);
            Cookies.set("userRole", loginResult.role);

            navigate("/summary");
        } catch (err: any) {
            alert("Chyba: " + (err.response?.data?.message || "Nastala neočekávaná chyba."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <ResetPasswordView
            password={password}
            password2={password2}
            loading={loading}
            setPassword={setPassword}
            setPassword2={setPassword2}
            handleSubmit={handleSubmit}
        />
    );
};

export default ResetPassword;
