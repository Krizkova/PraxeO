import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import HeaderView from "./HeaderView";

describe("HeaderView", () => {
    it("shows user email and logout button for logged user", () => {
        render(
            <MemoryRouter>
                <HeaderView email="uzivatel@osu.cz" role="STUDENT" />
            </MemoryRouter>
        );

        expect(screen.getByText("uzivatel@osu.cz")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /odhl/i })).toBeInTheDocument();
        expect(screen.getAllByRole("button")).toHaveLength(2);
    });

    it("renders add-user button for admin", () => {
        render(
            <MemoryRouter>
                <HeaderView email="admin@osu.cz" role="ADMIN" />
            </MemoryRouter>
        );

        expect(screen.getAllByRole("button")).toHaveLength(3);
    });

    it("calls onLogout when logout is clicked", async () => {
        const user = userEvent.setup();
        const onLogout = vi.fn();

        render(
            <MemoryRouter>
                <HeaderView email="uzivatel@osu.cz" role="STUDENT" onLogout={onLogout} />
            </MemoryRouter>
        );

        await user.click(screen.getByRole("button", { name: /odhl/i }));
        expect(onLogout).toHaveBeenCalledTimes(1);
    });
});
