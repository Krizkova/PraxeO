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
    const res = await api.post("/users/registerUser", data);
    return res.data;
}

export async function getRoleByToken(token: string) {
    const res = await api.get("/users/role-by-token", {
        params: { token }
    });
    return res.data;
}

export async function completeRegistration(payload: any) {
    const res = await api.post("/users/set-password", payload);
    return res.data;
}

export async function forgotPassword(data: any) {
    const res = await api.post("/users/forgotPassword", data);
    return res.data;
}


export async function getCurrentUser() {
    const res = await api.get("/users/me");
    return res.data;
}










/*
import Cookies from "js-cookie";

const API = import.meta.env.VITE_API_BASE_URL;

function authorizedHeaders() {
    const token = Cookies.get("token");
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
}

export async function loginUser(email: string, password: string) {
    const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function registerUser(data: any) {
    const res = await fetch(`${API}/users/registerUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function getRoleByToken(token: string) {
    const res = await axios.get(`${API_URL}/users/role-by-token`, {
        params: { token }
    });
    return res.data;
}

export async function completeRegistration(payload: any) {
    const res = await fetch(`${API}/users/set-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function getCurrentUser() {
    const res = await fetch(`${API}/users/me`, {
        headers: authorizedHeaders()
    });

    if (!res.ok) throw new Error(await res.text());
    return res.json();
}
*/
