import axios from 'axios';
import { DayLog, StreakResponse } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const daysApi = {
  getDay: (dateKey: string) =>
    api.get<DayLog>(`/days/${dateKey}`).then((r) => r.data),

  getStreak: () =>
    api.get<StreakResponse>('/days/streak').then((r) => r.data.streak),

  getAllDays: () =>
    api.get<DayLog[]>('/days').then((r) => r.data),

  updateDay: (dateKey: string, payload: Partial<Pick<DayLog, 'reflection' | 'rating' | 'displayDate'>>) =>
    api.patch<DayLog>(`/days/${dateKey}`, payload).then((r) => r.data),

  addHabit: (dateKey: string, name: string) =>
    api.post<DayLog>(`/days/${dateKey}/habits`, { name }).then((r) => r.data),

  updateHabit: (
    dateKey: string,
    habitId: string,
    payload: Partial<{ name: string; done: boolean | null; note: string }>
  ) =>
    api.patch<DayLog>(`/days/${dateKey}/habits/${habitId}`, payload).then((r) => r.data),

  deleteHabit: (dateKey: string, habitId: string) =>
    api.delete<DayLog>(`/days/${dateKey}/habits/${habitId}`).then((r) => r.data),
};

export default api;
