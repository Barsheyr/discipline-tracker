export interface Habit {
  id: string;
  name: string;
  done: boolean | null;
  note: string;
  order: number;
}

export interface DayLog {
  _id: string;
  dateKey: string;
  displayDate: string;
  habits: Habit[];
  reflection: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface StreakResponse {
  streak: number;
}
