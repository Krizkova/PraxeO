import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
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
import ErrorDialog from "../../common/ErrorDialog";
import type { EditMode } from "../../../pages/practices/PracticeDetailPage";

interface Props {
    editMode: EditMode;
    setEditMode: React.Dispatch<React.SetStateAction<EditMode>>;
    onPracticeUpdated?: () => void;
    taskRefreshKey: number;
}

// Kontejner detailu praxe zajišťující načítání dat a obsluhu akcí
const PracticeDetail: React.FC<Props> = ({
                                             editMode,
                                             setEditMode,
                                             onPracticeUpdated,
                                             taskRefreshKey,
                                         }) => {
    const { id } = useParams();

    // Načtený detail praxe
    const [practice, setPractice] = useState<Practice | null>(null);

    // Seznam příloh přiřazených k praxi
    const [attachments, setAttachments] = useState<Attachment[]>([]);

    // Stav načítání detailu
    const [loading, setLoading] = useState(true);

    // Chyba při úvodním načítání stránky
    const [error, setError] = useState<string | null>(null);

    // Chyba z API pro zobrazení ve sdíleném dialogu
    const [apiError, setApiError] = useState<string | null>(null);

    // Signál pro formulář, že má obnovit founder pole na původní hodnotu
    // Použije se po zavření ErrorDialogu
    const [founderResetKey, setFounderResetKey] = useState(0);

    const userRole = getCookie("userRole");
    const isAdmin = userRole === "ADMIN";

    // Učitel nebo externista může upravovat pole praxe bez ohledu na autora,
    // ale pouze dokud praxe není dokončena nebo zrušena
    const isTeacherOrExternalWorker =
        userRole === "TEACHER" || userRole === "EXTERNAL_WORKER";

    // Převede chybu z axiosu nebo běžného Error objektu na text pro dialog
    const showApiError = (err: unknown) => {
        if (axios.isAxiosError(err)) {
            const responseData = err.response?.data;

            if (typeof responseData === "string" && responseData.trim()) {
                setApiError(responseData);
                return;
            }

            if (
                responseData &&
                typeof responseData === "object" &&
                "chyba" in responseData &&
                typeof responseData.chyba === "string" &&
                responseData.chyba.trim()
            ) {
                setApiError(responseData.chyba);
                return;
            }

            if (
                responseData &&
                typeof responseData === "object" &&
                "message" in responseData &&
                typeof responseData.message === "string" &&
                responseData.message.trim()
            ) {
                setApiError(responseData.message);
                return;
            }

            if (err.message?.trim()) {
                setApiError(err.message);
                return;
            }
        }

        if (err instanceof Error && err.message.trim()) {
            setApiError(err.message);
            return;
        }

        setApiError("Nastala neočekávaná chyba.");
    };

    // Uloží novou verzi praxe do lokálního stavu
    // a případně ukončí režim editace
    const applyUpdatedPractice = (updated: Practice, closeEditMode = false) => {
        setPractice(updated);

        if (closeEditMode) {
            setEditMode(false);
        }
    };

    // Zavře chybový dialog a vyšle signál formuláři,
    // aby obnovil founder hodnoty na původní stav
    const handleCloseErrorDialog = () => {
        setApiError(null);
        setFounderResetKey((prev) => prev + 1);
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
        setApiError(null);

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

    // Bez načtených dat nelze vykreslit detail
    if (!practice) {
        return null;
    }

    // Práva pro úpravu founder části
    const canEditFounder =
        isAdmin ||
        (isTeacherOrExternalWorker &&
            practice.state !== "COMPLETED" &&
            practice.state !== "CANCELED") ||
        practice.canEditFounderFields;

    // Admin nemůže odevzdávat praxi za studenta,
    // proto se řídíme pouze backendovým oprávněním
    const canEditStudent = practice.canEditStudentFields;

    // Finální hodnocení může admin, učitel nebo externista upravovat,
    // pokud je praxe ve stavu SUBMITTED
    const canEditFinalEvaluation =
        isAdmin || isTeacherOrExternalWorker
            ? practice.state === "SUBMITTED"
            : practice.canEditFinalEvaluation;

    // Změna hlavního stavu praxe je možná pro admina vždy,
    // jinak jen pokud to backend dovolí a praxe není uzavřená
    const canChangeState = isAdmin || (practice.canChangeState && !practice.closed);

    // Nahrávání souborů:
    // - admin vždy
    // - učitel/externista dokud praxe není COMPLETED nebo CANCELED
    // - student pouze dokud praxi neodevzdal
    const canUpload = isAdmin
        ? true
        : isTeacherOrExternalWorker
            ? practice.state !== "COMPLETED" && practice.state !== "CANCELED"
            : practice.canUploadAttachments && practice.state !== "SUBMITTED";

    // Mazání příloh:
    // - admin vždy
    // - ostatní pokud mohou upravovat některou svou část praxe
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

        setApiError(null);

        updatePractice(practice.id, data)
            .then((updated) => {
                applyUpdatedPractice(updated, true);
                onPracticeUpdated?.();
            })
            .catch(showApiError);
    };

    // Nahrání nové přílohy k praxi
    const handleFileUpload = (file: File) => {
        if (!canUpload) {
            return;
        }

        setApiError(null);

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

        setApiError(null);

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
        setApiError(null);

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

    // Změna hlavního stavu praxe
    const handleChangeState = (state: PracticeState) => {
        if (!canChangeState) {
            return;
        }

        setApiError(null);

        changePracticeState(practice.id, state)
            .then((updated) => {
                applyUpdatedPractice(updated, true);
                onPracticeUpdated?.();
            })
            .catch(showApiError);
    };

    // Přihlášení nebo odhlášení studenta z praxe
    const handleAssignStudent = (assign: boolean) => {
        setApiError(null);

        assignStudent(practice.id, assign)
            .then((updated) => {
                applyUpdatedPractice(updated);
                onPracticeUpdated?.();
            })
            .catch(showApiError);
    };

    // Změna studentského stavu praxe
    const handleStudentState = (state: "ACTIVE" | "SUBMITTED") => {
        setApiError(null);

        changeStudentState(practice.id, state)
            .then((updated) => {
                applyUpdatedPractice(updated);
                onPracticeUpdated?.();
            })
            .catch(showApiError);
    };

    return (
        <>
            {apiError && (
                <ErrorDialog
                    message={apiError}
                    onClose={handleCloseErrorDialog}
                />
            )}

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
                taskRefreshKey={taskRefreshKey}
                founderResetKey={founderResetKey}
            />
        </>
    );
};

export default PracticeDetail;