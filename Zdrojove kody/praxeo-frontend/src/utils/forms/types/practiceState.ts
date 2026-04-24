import type { PracticeState } from "./practice";

export const stateLabels: Record<PracticeState, string> = {
    NEW: "Nový",
    ACTIVE: "Aktivní",
    SUBMITTED: "Odevzdaný",
    CANCELED: "Zrušený",
    COMPLETED: "Dokončený",
};

export const translatePracticeState = (
    state?: PracticeState | null
): string => {
    if (!state) return "—";
    return stateLabels[state];
};