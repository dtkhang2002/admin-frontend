import { TrainFile } from "./trainFile";

export interface UserData {
  items: User[];
  total: number;
  page: number;
  size: number;
  pages: number;
  pageContent: User;
}

export interface User {
  id: number;
  full_name: string;
  email: string;
  role_id: number;
  created_at: string;
  updated_at: string;
  files: TrainFile[];
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserCreate {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  role_id: number;
}

export interface UserUpdate {
  current_password: string;
  new_password: string;
  confirm_password: string;
}
