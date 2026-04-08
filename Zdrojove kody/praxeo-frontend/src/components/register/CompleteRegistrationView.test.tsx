import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import CompleteRegistrationView from "./CompleteRegistrationView";

describe("CompleteRegistrationView", () => {
    it("shows student number field for STUDENT role", () => {
        render(
            <CompleteRegistrationView
                role="STUDENT"
                firstName=""
                lastName=""
                studentNumber=""
                companyName=""
                password=""
                agreedToTerms={false}
                loading={false}
                setFirstName={vi.fn()}
                setLastName={vi.fn()}
                setStudentNumber={vi.fn()}
                setCompanyName={vi.fn()}
                setPassword={vi.fn()}
                setAgreedToTerms={vi.fn()}
                handleSubmit={vi.fn()}
            />
        );

        expect(screen.getByPlaceholderText(/a24b0001p/i)).toBeInTheDocument();
        expect(screen.queryByPlaceholderText(/název firmy/i)).not.toBeInTheDocument();
    });

    it("disables submit when terms are not agreed and enables with valid data", () => {
        const baseProps = {
            role: "EXTERNAL_WORKER",
            firstName: "Jan",
            lastName: "Novák",
            studentNumber: "",
            companyName: "ACME",
            password: "Strong123",
            loading: false,
            setFirstName: vi.fn(),
            setLastName: vi.fn(),
            setStudentNumber: vi.fn(),
            setCompanyName: vi.fn(),
            setPassword: vi.fn(),
            setAgreedToTerms: vi.fn(),
            handleSubmit: vi.fn(),
        };

        const { rerender, container } = render(
            <CompleteRegistrationView
                {...baseProps}
                agreedToTerms={false}
            />
        );

        const passwordInputs = container.querySelectorAll('input[type="password"]');
        fireEvent.change(passwordInputs[1], { target: { value: "Strong123" } });

        expect(screen.getByRole("button")).toBeDisabled();

        rerender(
            <CompleteRegistrationView
                {...baseProps}
                agreedToTerms={true}
            />
        );

        const updatedPasswordInputs = container.querySelectorAll('input[type="password"]');
        fireEvent.change(updatedPasswordInputs[1], {
            target: { value: "Strong123" },
        });

        expect(screen.getByRole("button")).not.toBeDisabled();
    });

    it("shows company field for EXTERNAL_WORKER and hides student number", () => {
        render(
            <CompleteRegistrationView
                role="EXTERNAL_WORKER"
                firstName=""
                lastName=""
                studentNumber=""
                companyName=""
                password=""
                agreedToTerms={false}
                loading={false}
                setFirstName={vi.fn()}
                setLastName={vi.fn()}
                setStudentNumber={vi.fn()}
                setCompanyName={vi.fn()}
                setPassword={vi.fn()}
                setAgreedToTerms={vi.fn()}
                handleSubmit={vi.fn()}
            />
        );

        expect(screen.getByPlaceholderText(/firma/i)).toBeInTheDocument();
        expect(screen.queryByPlaceholderText(/a24b0001p/i)).not.toBeInTheDocument();
    });

    it("shows password validation and mismatch messages", () => {
        render(
            <CompleteRegistrationView
                role="STUDENT"
                firstName="Jan"
                lastName="Novák"
                studentNumber="S12345"
                companyName=""
                password="abc"
                agreedToTerms={true}
                loading={false}
                setFirstName={vi.fn()}
                setLastName={vi.fn()}
                setStudentNumber={vi.fn()}
                setCompanyName={vi.fn()}
                setPassword={vi.fn()}
                setAgreedToTerms={vi.fn()}
                handleSubmit={vi.fn()}
            />
        );

        const passwordInputs = screen.getAllByPlaceholderText("••••••••");
        fireEvent.change(passwordInputs[1], { target: { value: "different123" } });

        expect(screen.getByText(/8 znak/i)).toBeInTheDocument();
        expect(screen.getByText(/jedno/i)).toBeInTheDocument();
        expect(screen.getByText(/neshod/i)).toBeInTheDocument();
        expect(screen.getByRole("button")).toBeDisabled();
    });
});
