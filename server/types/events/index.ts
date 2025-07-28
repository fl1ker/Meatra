export interface CreateEventRequest {
    title: string;
    description: string;
    image?: string;
}

export interface UpdateEventRequest {
    title?: string;
    description?: string;
    image?: string;
}