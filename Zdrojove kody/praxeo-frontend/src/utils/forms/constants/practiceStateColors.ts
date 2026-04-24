import type { PracticeState } from "../types/practice";

export const practiceStateColors: Record<
    PracticeState,
    { bg: string; color: string }
> = {
    NEW: { bg: "#D6EDDF", color: "#1F8A4D" },
    ACTIVE: { bg: "#E3F2FD", color: "#1565C0" },
    SUBMITTED: { bg: "#FFF8E1", color: "#F57F17" },
    CANCELED: { bg: "#FCE4EC", color: "#C62828" },
    COMPLETED: { bg: "#F3E5F5", color: "#6A1B9A" },
};