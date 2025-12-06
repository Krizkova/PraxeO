import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    getPracticeDetail,
    getAttachmentsForPractice,
    uploadAttachment,
    deleteAttachment,
    downloadAttachment
} from "../../api/practicesApi";
import PracticeDetailView from "./PracticeDetailView";

const PracticeDetail: React.FC = () => {
    const { id } = useParams();

    const [practice, setPractice] = useState<any>(null);
    const [detail, setDetail] = useState<any>(null);
    const [attachments, setAttachments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);

        getPracticeDetail(id)
            .then((detailDto) => {
                setDetail(detailDto);
                setPractice(detailDto.practice);

                return getAttachmentsForPractice(detailDto.id);
            })
            .then((files) => {
                setAttachments(files || []);
            })
            .catch(() => setError("Nepodařilo se načíst detail praxe."))
            .finally(() => setLoading(false));
    }, [id]);

    const handleFileUpload = (file: File) => {
        if (!detail) return;

        uploadAttachment(detail.id, file)
            .then((newFile) => {
                setAttachments(prev => [...prev, newFile]);
            })
            .catch(() => alert("Nepodařilo se nahrát soubor."));
    };

    const handleDeleteAttachment = (attachmentId: number) => {
        deleteAttachment(attachmentId)
            .then(() => {
                setAttachments(prev => prev.filter(a => a.id !== attachmentId));
            })
            .catch(() => alert("Nepodařilo se odstranit soubor."));
    };

    const handleDownloadAttachment = (attachmentId: number, title: string) => {
        downloadAttachment(attachmentId).then(res => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.download = title;
            document.body.appendChild(link);
            link.click();
            link.remove();
        });
    };

    return (
        <PracticeDetailView
            practice={practice}
            detail={detail}
            loading={loading}
            error={error}
            attachments={attachments}
            onFileUpload={handleFileUpload}
            onDeleteAttachment={handleDeleteAttachment}
            onDownloadAttachment={handleDownloadAttachment}
        />
    );
};

export default PracticeDetail;
