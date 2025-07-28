export interface CreateJobApplicationRequest {
    fullName: string;
    phone: string;
    positionId: number;
    experience: string;
}

export interface CreateJobPositionRequest {
    name: string;
    description: string;
}