import axios from "axios";
import Cookies from "js-cookie";

const API = import.meta.env.VITE_API_BASE_URL;

axios.defaults.withCredentials = true;

const api = axios.create({
    baseURL: API,
    withCredentials: true,
});

// Přidání Bearer tokenu do každého requestu
api.interceptors.request.use((config) => {
    const token = Cookies.get("token");

    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export type TaskStatus = "ACTIVE" | "COMPLETED";

export interface TaskFounder {
    name?: string;
    email?: string;
}

export interface TaskDto {
    id?: number;
    title: string;
    description: string;
    authorId?: number;
    founder?: TaskFounder; // User object
    links?: string[];
    files?: string[];
    creationDate?: string;
    expectedEndDate?: string | null;
    actualEndDate?: string | null;
    closed: boolean;
    finalEvaluation?: string;
    evaluationAuthorName?: string;
    status: TaskStatus;
    reportFlag: boolean;
}

export interface Task extends TaskDto {
    id: number;
}

export interface TaskFormData {
    title: string;
    description: string;
    links: string[];
    files: string[];
    expectedEndDate: string | null;
    reportFlag: boolean;
    finalEvaluation?: string;
}

export const getTasks = async (
    practiceId: number | string
): Promise<Task[]> => {
    const res = await api.get<Task[]>(`/tasks/practice/${practiceId}`);
    return res.data;
};

export const createTask = async (
    practiceId: number,
    data: TaskFormData
): Promise<Task> => {
    const res = await api.post<Task>(`/tasks/practice/${practiceId}`, data);
    return res.data;
};

export const deleteTask = async (id: number): Promise<unknown> => {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
};

export const updateTask = async (
    id: number,
    data: TaskFormData
): Promise<Task> => {
    const res = await api.put<Task>(`/tasks/${id}`, data);
    return res.data;
};