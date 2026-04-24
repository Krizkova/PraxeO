export const toDateInputValue = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

export const formatDate = (value: string | null): string => {
    if (!value) return "—";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";

    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
};

export const getPracticeDateLimits = (): {
    minDateValue: string;
    maxDateValue: string;
} => {
    const today = new Date();

    const minDate = new Date(today);
    minDate.setDate(today.getDate() - 1);

    const maxDate = new Date(today);
    maxDate.setFullYear(today.getFullYear() + 5);

    return {
        minDateValue: toDateInputValue(minDate),
        maxDateValue: toDateInputValue(maxDate),
    };
};