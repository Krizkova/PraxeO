import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ResetPasswordView from "./ResetPasswordView";

describe("ResetPasswordView", () => {
    it("disables submit button for invalid passwords and enables it when valid", () => {
        const setPassword = vi.fn();
        const setPassword2 = vi.fn();

        const { rerender } = render(
            <ResetPasswordView
                password=""
                password2=""
                loading={false}
                setPassword={setPassword}
                setPassword2={setPassword2}
                handleSubmit={vi.fn()}
            />
        );

        expect(screen.getByRole("button")).toBeDisabled();

        rerender(
            <ResetPasswordView
                password="Strong123"
                password2="Strong123"
                loading={false}
                setPassword={setPassword}
                setPassword2={setPassword2}
                handleSubmit={vi.fn()}
            />
        );

        expect(screen.getByRole("button")).not.toBeDisabled();
    });

    it("calls setters on input change", () => {
        const setPassword = vi.fn();
        const setPassword2 = vi.fn();

        render(
            <ResetPasswordView
                password=""
                password2=""
                loading={false}
                setPassword={setPassword}
                setPassword2={setPassword2}
                handleSubmit={vi.fn()}
            />
        );

        const passwordInputs = screen.getAllByDisplayValue("");
        fireEvent.change(passwordInputs[0], { target: { value: "Strong123" } });
        fireEvent.change(passwordInputs[1], { target: { value: "Strong124" } });

        expect(setPassword).toHaveBeenCalledWith("Strong123");
        expect(setPassword2).toHaveBeenCalledWith("Strong124");
    });
});
