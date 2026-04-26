import axios from "axios";
import Cookies from "js-cookie";
import type { Attachment, Practice, UpdatePracticePayload, PracticeState } from "../utils/forms/types/practice";

const API = import.meta.env.VITE_API_BASE_URL;

axios.defaults.withCredentials = true;

const api = axios.create({
    baseURL: API,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = Cookies.get("token");

    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export const getPracticesByRole = async (): Promise<Practice[]> => {
    const response = await api.post<Practice[]>("/practices/practices-by-role");
    return response.data;
};

export const getPractice = async (id: number | string): Promise<Practice> => {
    const response = await api.get<Practice>(`/practices/${id}`);
    return response.data;
};

export const updatePractice = async (
    id: number,
    data: UpdatePracticePayload
): Promise<Practice> => {
    const response = await api.put<Practice>(`/practices/${id}`, data);
    return response.data;
};

// Admin může měnit stav na jakýkoliv, ostatní jen na CANCELED nebo COMPLETED
export const changePracticeState = async (
    id: number,
    state: PracticeState
): Promise<Practice> => {
    const response = await api.put<Practice>(`/practices/${id}/state`, null, {
        params: { state },
    });

    return response.data;
};

export const getAttachmentsForPractice = async (
    practiceId: string | number
): Promise<Attachment[]> => {
    const response = await api.get<Attachment[]>(
        `/attachments/by-practice/${practiceId}`
    );

    return response.data;
};

export const uploadAttachment = async (
    practiceId: string | number,
    file: File,
    taskId?: string | number
): Promise<Attachment> => {
    const formData = new FormData();
    formData.append("file", file);

    const url = new URL(`${API}/attachments/upload/${practiceId}`);
    if (taskId) {
        url.searchParams.append("taskId", taskId.toString());
    }

    const response = await api.post<Attachment>(
        url.toString(),
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const deleteAttachment = async (id: number): Promise<void> => {
    await api.delete(`/attachments/${id}`);
};

export const downloadAttachment = async (id: number) => {
    return api.get(`/attachments/${id}/download`, {
        responseType: "blob",
    });
};

export const createPractice = async (data: {
    name: string;
    description: string;
    completedAt: string;
}): Promise<Practice> => {
    const response = await api.post<Practice>("/practices/create", data);
    return response.data;
};

export const assignStudent = async (
    id: number,
    assign: boolean
): Promise<Practice> => {
    const response = await api.put<Practice>(
        `/practices/${id}/assign-student`,
        null,
        {
            params: { assign },
        }
    );

    return response.data;
};

export const changeStudentState = async (
    id: number,
    state: Extract<PracticeState, "ACTIVE" | "SUBMITTED">
): Promise<Practice> => {
    const response = await api.put<Practice>(
        `/practices/${id}/student-state`,
        null,
        {
            params: { state },
        }
    );

    return response.data;
};