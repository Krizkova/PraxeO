const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/users`;

export async function registerUser(userData) {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            jmeno: userData.jmeno,
            prijmeni: userData.prijmeni,
            email: userData.email,
            heslo: userData.heslo,
            role: "STUDENT", // nebo uprav dle DTO, pokud máš v BE výchozí hodnotu
            studijniCislo: userData.studijniCislo,
        }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Chyba při registraci uživatele");
    }

    return await response.json();
}
