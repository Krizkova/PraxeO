import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

axios.defaults.withCredentials = true;

const api = axios.create({
    baseURL: API,
    withCredentials: true,
});

export const getPracticesByRole = async () => {
    const res = await api.post("/practices/practices-by-role");
    return res.data;
};

export const getPractice = async (id: number | string) => {
    const res = await api.get(`/practices/${id}`);
    return res.data;
};

export const getAttachmentsForPractice = async (practiceId: string | number) => {
    const res = await api.get(`/attachments/by-practice/${practiceId}`);
    return res.data;
};

export const uploadAttachment = async (practiceId: string | number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post(
        `/attachments/upload/${practiceId}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return res.data;
};

export const deleteAttachment = async (id: number) => {
    const res = await api.delete(`/attachments/${id}`);
    return res.data;
};

export const downloadAttachment = async (id: number) => {
    return api.get(`/attachments/${id}/download`, {
        responseType: "blob"
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