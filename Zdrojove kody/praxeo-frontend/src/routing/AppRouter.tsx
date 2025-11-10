// src/routing/AppRouter.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import RegisterStudentPage from "../pages/RegisterStudentPage";

const AppRouter: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/registerStudent" element={<RegisterStudentPage />} />
        </Routes>
    );
};

export default AppRouter;
