export interface CreateReservationRequest {
    name: string;
    phone: string;
    date: string;
    time_start: string;
    time_end: string;
    tableId: number;
}

export interface UpdateReservationRequest {
    name?: string;
    phone?: string;
    date?: string;
    time_start?: string;
    time_end?: string;
    tableId?: number;
}