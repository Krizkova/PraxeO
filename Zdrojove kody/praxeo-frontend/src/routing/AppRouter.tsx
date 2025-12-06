// src/routing/AppRouter.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import RegisterStudentPage from "../pages/register/RegisterStudentPage";
import VerifyPage from "../pages/register/VerifyPage";
import SummaryOfPracticesPage from "../pages/SummaryOfPracticesPage";
import RegisterUserPage from "../pages/register/RegisterUserPage";
import ForgotPasswordPage from "../pages/login/ForgotPasswordPage";
import ResetPasswordPage from "../pages/login/ResetPasswordPage";
import PracticeDetailPage from "../pages/PracticeDetailPage";

const AppRouter: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/registerStudent" element={<RegisterStudentPage />} />
            <Route path="/add-user" element={<RegisterUserPage />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/summary" element={<SummaryOfPracticesPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/practices/:id" element={<PracticeDetailPage />} />

        </Routes>
    );
};

export default AppRouter;
