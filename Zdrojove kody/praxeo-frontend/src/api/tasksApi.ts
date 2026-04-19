import axios from "axios";
import Cookies from "js-cookie";

const API = import.meta.env.VITE_API_BASE_URL;

axios.defaults.withCredentials = true;

const api = axios.create({
    baseURL: API,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = Cookies.get("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export const getTasks = async (practiceId: number | string) => {
    const res = await api.get(`/tasks/practice/${practiceId}`);
    return res.data;
};

export interface TaskDto {
    id?: number;
    title: string;
    description: string;
    authorId?: number;
    founder?: any; // User object
    links?: string[];
    files?: string[];
    creationDate?: string;
    expectedEndDate?: string | null;
    actualEndDate?: string | null;
    closed: boolean;
    finalEvaluation?: string;
    evaluationAuthorName?: string;
    status: 'ACTIVE' | 'COMPLETED';
    reportFlag: boolean;
}

export const createTask = async (practiceId: number, data: Partial<TaskDto>) => {
    const res = await api.post(`/tasks/practice/${practiceId}`, data);
    return res.data;
};

export const deleteTask = async (id: number) => {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
};

export const updateTask = async (id: number, data: Partial<TaskDto>) => {
    const res = await api.put(`/tasks/${id}`, data);
    return res.data;
};