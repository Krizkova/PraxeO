import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

axios.defaults.withCredentials = true;

const api = axios.create({
    baseURL: API,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

export const getPracticesByRole = async () => {
    const res = await api.post("/practices/practices-by-role");
    return res.data;
};

export const getPracticeDetail = async (id: number | string) => {
    const res = await api.get(`/practices/${id}`);
    return res.data;
};