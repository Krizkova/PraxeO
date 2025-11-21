import Cookies from "js-cookie";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const USERS_BASE_URL = `${API_BASE_URL}/users`;

export interface RegisterUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    studentNumber?: string;
    companyName?: string;
    role?: string;
}

export interface UserResponse {
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    studentNumber?: string;
    companyName?: string;
    message?: string;
}

async function authorizedFetch(url: string, options: RequestInit = {}) {
    const token = Cookies.get("token");

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    console.log("➡️ Fetch:", url, "Authorization:", token ? "Bearer ..." : "missing");

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        const text = await response.text();
        console.error("❌ Chyba z BE:", text);
        throw new Error(text || "Chyba komunikace se serverem");
    }

    return response;
}

export async function registerUser(userData: RegisterUserRequest): Promise<UserResponse> {
    const response = await fetch(`${USERS_BASE_URL}/registerUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Chyba při registraci uživatele");
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return (await response.json()) as UserResponse;
    } else {
        const text = await response.text();
        return { message: text } as unknown as UserResponse;
    }
}

export async function getCurrentUser(): Promise<UserResponse> {
    const response = await authorizedFetch(`${USERS_BASE_URL}/me`, { method: "GET" });
    return (await response.json()) as UserResponse;
}

export async function getAllUsers(): Promise<UserResponse[]> {
    const response = await authorizedFetch(`${USERS_BASE_URL}`, { method: "GET" });
    return (await response.json()) as UserResponse[];
}
