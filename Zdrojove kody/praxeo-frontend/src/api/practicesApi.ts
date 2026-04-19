import axios from "axios";
import Cookies from "js-cookie";

const API = import.meta.env.VITE_API_BASE_URL;

axios.defaults.withCredentials = true;

const api = axios.create({
    baseURL: API,
    withCredentials: true,
});

// Přidání Bearer tokenu do každého požadavku
api.interceptors.request.use((config) => {
    const token = Cookies.get("token");

    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export const getPracticesByRole = async () => {
    const res = await api.post("/practices/practices-by-role");
    return res.data;
};

export const getPractice = async (id: number | string) => {
    const res = await api.get(`/practices/${id}`);
    return res.data;
};

export const updatePractice = async (id: number, data: any) => {
    const res = await api.put(`/practices/${id}`, data);
    return res.data;
};

export const changePracticeState = async (
    id: number,
    state: "CANCELED" | "COMPLETED"
) => {
    const res = await api.put(`/practices/${id}/state`, null, {
        params: { state },
    });
    return res.data;
};

export const getAttachmentsForPractice = async (practiceId: string | number) => {
    const res = await api.get(`/attachments/by-practice/${practiceId}`);
    return res.data;
};

export const uploadAttachment = async (practiceId: string | number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post(`/attachments/upload/${practiceId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return res.data;
};

export const deleteAttachment = async (id: number) => {
    const res = await api.delete(`/attachments/${id}`);
    return res.data;
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
}) => {
    const res = await api.post("/practices/create", data);
    return res.data;
};

export const assignStudent = async (id: number, assign: boolean) => {
    const res = await api.put(`/practices/${id}/assign-student`, null, {
        params: { assign },
    });
    return res.data;
};

export const changeStudentState = async (
    id: number,
    state: "ACTIVE" | "SUBMITTED"
) => {
    const res = await api.put(`/practices/${id}/student-state`, null, {
        params: { state },
    });
    return res.data;
};