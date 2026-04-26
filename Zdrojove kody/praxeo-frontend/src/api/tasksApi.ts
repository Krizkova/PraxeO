import axios from "axios";
import Cookies from "js-cookie";

import type { Attachment } from "../utils/forms/types/practice";

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
    files?: Attachment[];
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
    files: File[];
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

export const getAttachmentsForTask = async (
    taskId: string | number
): Promise<Attachment[]> => {
    const response = await api.get<Attachment[]>(
        `/attachments/by-task/${taskId}`
    );

    return response.data;
};

export const uploadTaskAttachment = async (
    practiceId: string | number,
    taskId: string | number,
    file: File
): Promise<Attachment> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<Attachment>(
        `/attachments/upload/${practiceId}`,
        formData,
        {
            params: { taskId },
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};