export type PracticeState =
    | "NEW"
    | "ACTIVE"
    | "SUBMITTED"
    | "CANCELED"
    | "COMPLETED";

export interface Attachment {
    id: number;
    title: string;
    name?: string;
    originalName?: string;
    uploadedAt?: string | null;
}

export interface Practice {
    id: number;
    name: string;
    description: string;
    state: PracticeState;
    createdAt: string | null;
    selectedAt: string | null;
    completedAt: string | null;
    founderEmail: string | null;
    studentEmail: string | null;
    studentEvaluation: string | null;
    finalEvaluation: string | null;
    canEditFounderFields: boolean;
    canEditStudentFields: boolean;
    canEditFinalEvaluation: boolean;
    canChangeState: boolean;
    canUploadAttachments: boolean;
    closed: boolean;
}

export interface UpdatePracticePayload {
    name?: string;
    description?: string;
    completedAt?: string | null;
    finalEvaluation?: string;
    studentEvaluation?: string;
    founderEmail?: string;
    studentEmail?: string;
}
