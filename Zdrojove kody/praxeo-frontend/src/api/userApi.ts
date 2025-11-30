import axios from "axios";
import Cookies from "js-cookie";

const API = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: API,
    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use((config) => {
    const token = Cookies.get("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export async function loginUser(email: string, password: string) {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
}


export async function registerUser(data: any) {
    const res = await api.post("/users/register-user", data);
    return res.data;
}

export async function getRoleByToken(token: string) {
    const res = await api.get("/users/role-by-token", {
        params: { token }
    });
    return res.data;
}

export async function completeRegistration(payload: any) {
    const res = await api.post("/users/complete-registration", payload);
    return res.data;
}

export async function forgotPassword(data: any) {
    const res = await api.post("/users/forgot-password", data);
    return res.data;
}

export async function resetPassword(data: any) {
    const res = await api.post("/users/reset-password", data);
    return res.data;
}


export async function getCurrentUser() {
    const res = await api.get("/users/me");
    return res.data;
}




