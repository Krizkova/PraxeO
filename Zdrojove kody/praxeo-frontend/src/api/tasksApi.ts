import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

axios.defaults.withCredentials = true;

const api = axios.create({
    baseURL: API,
    withCredentials: true,
});

export const getTasks = async (practiceId: number | string) => {
    const res = await api.get(`/tasks/practice/${practiceId}`);
    return res.data;
};

export const createTask = async (
    practiceId: number,
    data: {
        title: string;
        description: string;
    }
) => {
    const res = await api.post(`/tasks/practice/${practiceId}`, data);
    return res.data;
};

export const deleteTask = async (id: number) => {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
};