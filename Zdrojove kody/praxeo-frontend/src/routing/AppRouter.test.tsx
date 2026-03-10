import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import AppRouter from "./AppRouter";

vi.mock("../pages/HomePage", () => ({
    default: () => <div>HomePage</div>,
}));
vi.mock("../pages/register/RegisterStudentPage", () => ({
    default: () => <div>RegisterStudentPage</div>,
}));
vi.mock("../pages/register/RegisterUserPage", () => ({
    default: () => <div>RegisterUserPage</div>,
}));
vi.mock("../pages/register/VerifyPage", () => ({
    default: () => <div>VerifyPage</div>,
}));
vi.mock("../pages/login/ForgotPasswordPage", () => ({
    default: () => <div>ForgotPasswordPage</div>,
}));
vi.mock("../pages/login/ResetPasswordPage", () => ({
    default: () => <div>ResetPasswordPage</div>,
}));
vi.mock("../pages/practices/SummaryOfPracticesPage", () => ({
    default: () => <div>SummaryOfPracticesPage</div>,
}));
vi.mock("../pages/practices/PracticeDetailPage", () => ({
    default: () => <div>PracticeDetailPage</div>,
}));
vi.mock("../pages/practices/CreatePracticePage", () => ({
    default: () => <div>CreatePracticePage</div>,
}));

const renderRoute = (path: string) => {
    render(
        <MemoryRouter initialEntries={[path]}>
            <AppRouter />
        </MemoryRouter>
    );
};

describe("AppRouter", () => {
    it("renders home page for root route", () => {
        renderRoute("/");

        expect(screen.getByText("HomePage")).toBeInTheDocument();
    });

    it("renders summary page for summary route", () => {
        renderRoute("/summary");

        expect(screen.getByText("SummaryOfPracticesPage")).toBeInTheDocument();
    });

    it("renders practice detail page for dynamic practice route", () => {
        renderRoute("/practices/123");

        expect(screen.getByText("PracticeDetailPage")).toBeInTheDocument();
    });

    it("renders create practice page", () => {
        renderRoute("/practices/create");

        expect(screen.getByText("CreatePracticePage")).toBeInTheDocument();
    });

    it("renders register user page", () => {
        renderRoute("/add-user");

        expect(screen.getByText("RegisterUserPage")).toBeInTheDocument();
    });

    it("renders forgot password page", () => {
        renderRoute("/forgot-password");

        expect(screen.getByText("ForgotPasswordPage")).toBeInTheDocument();
    });
});
