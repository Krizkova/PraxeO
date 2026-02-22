export const stateLabels: Record<string, string> = {
    NEW: "Nový",
    ACTIVE: "Aktivní",
    COMPLETED: "Dokončený",
    SUBMITTED: "Odevzdaný",
    CANCELED: "Zrušený"
};

export const translatePracticeState = (state?: string | null) => {
    if (!state) return "—";
    return stateLabels[state] ?? state;
};
