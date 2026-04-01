import React from "react";
import Header from "../../components/header/Header";
import ResetPassword from "../../components/login/ResetPassword";
import Footer from "../../components/footer/Footer";

const ResetPasswordPage: React.FC = () => {
    return (
        <>
            <Header />
            <ResetPassword />
            <Footer />
        </>
    );
};

export default ResetPasswordPage;