import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../components/HomePage";
import RegisterStudentPage from "../pages/RegisterStudentPage.jsx";

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/registerStudent" element={<RegisterStudentPage />} />
            </Routes>
        </Router>
    );
}
