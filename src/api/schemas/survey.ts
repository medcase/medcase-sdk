export interface SurveyRequest {
    title?: string;
    items: Item[]
}

export interface Item {
    question: string,
    answer: string
}

export interface Survey extends SurveyRequest {
    id: string;
}
