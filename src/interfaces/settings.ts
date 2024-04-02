export interface SettingsData {
    id: number;
    threshold_score: number;
    number_references: number;
    temperature: number;
    maximum_number_questions: number;
    prompt_question: string;
    prompt_answer: string;
    created_at: string;
    updated_at: string;
}

export interface SettingResponse {
    pageContent: SettingsData
}

export interface SettingCreate {
    threshold_score: number;
    number_references: number;
    temperature: number;
    maximum_number_questions: number;
    prompt_question: string;
    prompt_answer: string;
}