export interface HistoryData {
  items: History[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface History {
  id: number;
  question: string;
  answer: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface HistoryCreate {
  question: string;
  answer: string;
  user_id: string;
}
