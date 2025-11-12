// src/routing/AppRouter.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import RegisterStudentPage from "../pages/register/RegisterStudentPage";
import VerifyPage from "../pages/register/VerifyPage";
import SummaryOfPracticesPage from "../pages/SummaryOfPracticesPage";

const AppRouter: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/registerStudent" element={<RegisterStudentPage />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/summary" element={<SummaryOfPracticesPage />} />
        </Routes>
    );
};

export default AppRouter;
