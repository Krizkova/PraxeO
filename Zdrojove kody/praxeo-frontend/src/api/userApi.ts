const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/users`;

export interface RegisterUserRequest {
    jmeno: string;
    prijmeni: string;
    email: string;
    heslo: string;
    studijniCislo?: string;
}

export interface UserResponse {
    id: number;
    jmeno: string;
    prijmeni: string;
    email: string;
    role: string;
    studijniCislo?: string;
}

export async function registerUser(
    userData: RegisterUserRequest
): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/registerStudent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Chyba při registraci uživatele");
    }

    return await response.json();
}
