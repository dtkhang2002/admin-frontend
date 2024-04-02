export interface TrainFileData {
    items: TrainFile[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

export interface TrainFile {
    id: number;
    file_name: string;
    file_path: string;
    status: number;
    user_id: number;
    created_at: string;
    updated_at: string;
}

export interface TrainFileCreate {
    file_name: string;
    file_path: string;
    user_id: number;
}

export interface TrainFileUpdate {
    status: number;
}