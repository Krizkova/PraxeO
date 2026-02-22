import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    getPractice,
    getAttachmentsForPractice,
    uploadAttachment,
    deleteAttachment,
    downloadAttachment,
    updatePractice,
    changePracticeState
} from "../../api/practicesApi";
import PracticeDetailView from "./PracticeDetailView";

interface Props {
    editMode: boolean;
    setEditMode: (value: boolean) => void;
}

const PracticeDetail: React.FC<Props> = ({ editMode, setEditMode }) => {
    const { id } = useParams();

    const [practice, setPractice] = useState<any>(null);
    const [attachments, setAttachments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);

        getPractice(id)
            .then((practiceDto) => {
                setPractice(practiceDto);
                return getAttachmentsForPractice(practiceDto.id);
            })
            .then((files) => {
                setAttachments(files || []);
            })
            .catch(() => setError("Nepodařilo se načíst detail praxe."))
            .finally(() => setLoading(false));
    }, [id]);

    if (!practice) return null;

    const canEdit =
        practice.canEditFounderFields ||
        practice.canEditStudentFields ||
        practice.canEditFinalEvaluation;

    const canUpload = practice.canUploadAttachments;

    const handleUpdate = (data: any) => {
        updatePractice(practice.id, data)
            .then(updated => {
                setPractice(updated);
                setEditMode(false);
            })
            .catch((err: any) => {
                alert("Chyba: " + (err.response?.data?.message || "Nastala neočekávaná chyba."));
            });
    };

    const handleFileUpload = (file: File) => {
        if (!canUpload) return;

        uploadAttachment(practice.id, file)
            .then((newFile) => {
                setAttachments(prev => [...prev, newFile]);
            })
            .catch((err: any) => {
                alert("Chyba: " + (err.response?.data?.message || "Nastala neočekávaná chyba."));
            });
    };

    const handleDeleteAttachment = (attachmentId: number) => {
        deleteAttachment(attachmentId)
            .then(() => {
                setAttachments(prev => prev.filter(a => a.id !== attachmentId));
            })
            .catch((err: any) => {
                alert("Chyba: " + (err.response?.data?.message || "Nastala neočekávaná chyba."));
            });
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

    const handleChangeState = (state: "CANCELED" | "COMPLETED") => {
        changePracticeState(practice.id, state)
            .then(updated => {
                setPractice(updated);
                setEditMode(false);
            })
            .catch((err: any) => {
                alert("Chyba: " + (err.response?.data?.message || "Nastala neočekávaná chyba."));
            });
    };

    return (
        <PracticeDetailView
            practice={practice}
            loading={loading}
            error={error}
            attachments={attachments}
            editMode={editMode}
            setEditMode={setEditMode}
            canEdit={canEdit}
            canEditFounder={practice.canEditFounderFields}
            canEditStudent={practice.canEditStudentFields}
            canEditFinalEvaluation={practice.canEditFinalEvaluation}
            canChangeState={practice.canChangeState && !practice.closed}
            canUpload={canUpload}
            onUpdate={handleUpdate}
            onFileUpload={handleFileUpload}
            onDeleteAttachment={handleDeleteAttachment}
            onDownloadAttachment={handleDownloadAttachment}
            onChangeState={handleChangeState}
        />
    );
};

export default PracticeDetail;