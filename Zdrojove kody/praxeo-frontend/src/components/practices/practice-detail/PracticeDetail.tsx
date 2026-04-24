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
} from "../../../api/practicesApi";
import { getCookie } from "../../../utils/forms/cookies";
import type {
    Practice,
    Attachment,
    UpdatePracticePayload,
    PracticeState,
} from "../../../utils/forms/types/practice";
import PracticeDetailView from "./PracticeDetailView";

interface Props {
    editMode: boolean;
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

// Kontejner detailu praxe zajišťující načítání dat a obsluhu akcí
const PracticeDetail: React.FC<Props> = ({ editMode, setEditMode }) => {
    const { id } = useParams();

    const [practice, setPractice] = useState<Practice | null>(null);
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const userRole = getCookie("userRole");
    const isAdmin = userRole === "ADMIN";

    // Sdílené zobrazení chybové hlášky z API
    const showApiError = (err: unknown) => {
        const message =
            err instanceof Error
                ? err.message
                : "Nastala neočekávaná chyba.";

        alert("Chyba: " + message);
    };

    // Uloží novou verzi praxe a případně ukončí režim editace
    const applyUpdatedPractice = (updated: Practice, closeEditMode = false) => {
        setPractice(updated);

        if (closeEditMode) {
            setEditMode(false);
        }
    };

    // Načtení detailu praxe a jejích příloh podle ID z URL
    useEffect(() => {
        if (!id) {
            setLoading(false);
            setError("Chybí identifikátor praxe.");
            return;
        }

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
            .catch(() => {
                setError("Nepodařilo se načíst detail praxe.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    // Bez načtených dat nelze zobrazit detail
    if (!practice) {
        return null;
    }

    const canEditFounder = isAdmin || practice.canEditFounderFields;
    const canEditStudent = isAdmin || practice.canEditStudentFields;
    const canEditFinalEvaluation = isAdmin || practice.canEditFinalEvaluation;
    const canChangeState = isAdmin || (practice.canChangeState && !practice.closed);

    // Admin nemá automaticky právo nahrávat soubory
    const canUpload = practice.canUploadAttachments;

    // Mazání souborů: admin všude, ostatní pokud jde o jejich práci
    const canDeleteAttachment =
        isAdmin ||
        practice.canEditFounderFields ||
        practice.canEditStudentFields ||
        practice.canEditFinalEvaluation;

    // Uložení změn v detailu praxe
    const handleUpdate = (data: UpdatePracticePayload) => {
        if (
            !canEditFounder &&
            !canEditStudent &&
            !canEditFinalEvaluation &&
            !isAdmin
        ) {
            return;
        }

        updatePractice(practice.id, data)
            .then((updated) => {
                applyUpdatedPractice(updated, true);
            })
            .catch(showApiError);
    };

    // Nahrání nové přílohy k praxi
    const handleFileUpload = (file: File) => {
        if (!canUpload) {
            return;
        }

        uploadAttachment(practice.id, file)
            .then((newAttachment) => {
                setAttachments((prev) => [...prev, newAttachment]);
            })
            .catch(showApiError);
    };

    // Smazání přílohy z praxe
    const handleDeleteAttachment = (attachmentId: number) => {
        if (!canDeleteAttachment) {
            return;
        }

        deleteAttachment(attachmentId)
            .then(() => {
                setAttachments((prev) =>
                    prev.filter((attachment) => attachment.id !== attachmentId)
                );
            })
            .catch(showApiError);
    };

    // Stažení přílohy do zařízení uživatele
    const handleDownloadAttachment = (attachmentId: number, title: string) => {
        downloadAttachment(attachmentId)
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");

                link.href = url;
                link.download = title;

                document.body.appendChild(link);
                link.click();
                link.remove();

                window.URL.revokeObjectURL(url);
            })
            .catch(showApiError);
    };

    // Změna hlavního stavu praxe — admin může měnit na jakýkoliv stav
    const handleChangeState = (state: PracticeState) => {
        if (!canChangeState) {
            return;
        }

        changePracticeState(practice.id, state)
            .then((updated) => {
                applyUpdatedPractice(updated, true);
            })
            .catch(showApiError);
    };

    // Přihlášení nebo odhlášení studenta z praxe
    const handleAssignStudent = (assign: boolean) => {
        assignStudent(practice.id, assign)
            .then((updated) => {
                applyUpdatedPractice(updated);
            })
            .catch(showApiError);
    };

    // Změna studentského stavu praxe
    const handleStudentState = (state: "ACTIVE" | "SUBMITTED") => {
        changeStudentState(practice.id, state)
            .then((updated) => {
                applyUpdatedPractice(updated);
            })
            .catch(showApiError);
    };

    return (
        <PracticeDetailView
            practice={practice}
            loading={loading}
            error={error}
            attachments={attachments}
            editMode={editMode}
            setEditMode={setEditMode}
            canEditFounder={canEditFounder}
            canEditStudent={canEditStudent}
            canEditFinalEvaluation={canEditFinalEvaluation}
            canChangeState={canChangeState}
            canUpload={canUpload}
            canDeleteAttachment={canDeleteAttachment}
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