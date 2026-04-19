import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    getPractice,
    getAttachmentsForPractice,
    uploadAttachment,
    deleteAttachment,
    downloadAttachment,
    updatePractice,
    changePracticeState,
    assignStudent,
    changeStudentState,
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
    // Samostatná chyba pro přihlášení k praxi — zobrazí se inline pod tlačítkem
    const [assignError, setAssignError] = useState<string | null>(null);


    // Načtení detailu praxe a jejích příloh
    useEffect(() => {
        if (!id) return;

        setLoading(true);
        setError(null);

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

    const role = document.cookie
        .split("; ")
        .find((row) => row.startsWith("userRole="))
        ?.split("=")[1];

    const canEdit =
        role === "ADMIN" ||
        practice?.canEditFounderFields ||
        practice?.canEditStudentFields ||
        practice?.canEditFinalEvaluation;

    const canUpload = practice?.canUploadAttachments;

    // Existuje alespoň jeden dokončený task: student se nemůže odhlásit
    const hasCompletedTask = (practice?.tasks || []).some((t: any) => t.status === "COMPLETED");

    const handleUpdate = (data: any) => {
        if (!practice) return;
        setError(null);
        updatePractice(practice.id, data)
            .then((updated) => {
                setPractice(updated);
                setEditMode(false);
            })
            .catch((err: any) => {
                setError(err?.response?.data?.message || "Nepodařilo se uložit změny.");
            });
    };

    const handleFileUpload = (file: File) => {
        if (!practice || !canUpload) return;
        setError(null);
        uploadAttachment(practice.id, file)
            .then((newFile) => {
                setAttachments((prev) => [...prev, newFile]);
            })
            .catch((err: any) => {
                setError(err?.response?.data?.message || "Nepodařilo se nahrát přílohu.");
            });
    };

    const handleDeleteAttachment = (attachmentId: number) => {
        setError(null);
        deleteAttachment(attachmentId)
            .then(() => {
                setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
            })
            .catch((err: any) => {
                setError(err?.response?.data?.message || "Nepodařilo se smazat přílohu.");
            });
    };

    // Stažení souboru do zařízení uživatele
    const handleDownloadAttachment = (attachmentId: number, title: string) => {
        downloadAttachment(attachmentId)
            .then((res) => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement("a");
                link.href = url;
                link.download = title;
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            })
            .catch((err: any) => {
                setError(err?.response?.data?.message || "Nepodařilo se stáhnout přílohu.");
            });
    };

    const handleChangeState = (state: "CANCELED" | "COMPLETED") => {
        if (!practice) return;
        setError(null);
        changePracticeState(practice.id, state)
            .then((updated) => {
                setPractice(updated);
                setEditMode(false);
            })
            .catch((err: any) => {
                setError(err?.response?.data?.message || "Nepodařilo se změnit stav praxe.");
            });
    };

    // Přihlášení/odhlášení studenta: chyba 409 = student má jinou aktivní praxi
    const handleAssignStudent = (assign: boolean) => {
        if (!practice) return;
        setAssignError(null);
        assignStudent(practice.id, assign)
            .then((updated) => {
                setPractice(updated);
            })
            .catch((err: any) => {
                const status = err?.response?.status;
                const msg = err?.response?.data?.message || "";
                if (status === 409) {
                    setAssignError("Nelze se přihlásit — již máte jinou aktivní praxi.");
                } else {
                    setAssignError(msg || "Nepodařilo se změnit přiřazení studenta.");
                }
            });
    };

    const handleStudentState = (state: "ACTIVE" | "SUBMITTED") => {
        if (!practice) return;
        setError(null);
        changeStudentState(practice.id, state)
            .then((updated) => {
                setPractice(updated);
            })
            .catch((err: any) => {
                setError(err?.response?.data?.message || "Nepodařilo se změnit stav studenta.");
            });
    };

    return (
        <PracticeDetailView
            practice={practice}
            loading={loading}
            error={error}
            assignError={assignError}
            attachments={attachments}
            editMode={editMode}
            setEditMode={setEditMode}
            canEdit={!!canEdit}
            canEditFounder={!!practice?.canEditFounderFields}
            canEditStudent={!!practice?.canEditStudentFields}
            canEditFinalEvaluation={!!practice?.canEditFinalEvaluation}
            canChangeState={!!practice?.canChangeState && !practice?.closed}
            canUpload={!!canUpload}
            hasCompletedTask={hasCompletedTask}
            onUpdate={handleUpdate}
            onFileUpload={handleFileUpload}
            onDeleteAttachment={handleDeleteAttachment}
            onDownloadAttachment={handleDownloadAttachment}
            onChangeState={handleChangeState}
            onAssignStudent={handleAssignStudent}
            onChangeStudentState={handleStudentState}
        />
    );
};

export default PracticeDetail;