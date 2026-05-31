import { useState, useEffect, useCallback } from "react";
import { DayLog, Habit } from "../types";
import { daysApi } from "../services";
import toast from "react-hot-toast";

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function useDayLog(dateKey: string) {
  const [day, setDay] = useState<DayLog | null>(null);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadDay = useCallback(async () => {
    setLoading(true);
    try {
      const [dayData, streakCount] = await Promise.all([
        daysApi.getDay(dateKey),
        daysApi.getStreak(),
      ]);
      setDay(dayData);
      setStreak(streakCount);
    } catch {
      toast.error("Failed to load tracker data");
    } finally {
      setLoading(false);
    }
  }, [dateKey]);

  useEffect(() => {
    loadDay();
  }, [loadDay]);

  const toggleHabit = useCallback(
    async (habit: Habit) => {
      if (!day) return;
      // Cycle: null → true → false → null
      const next: boolean | null =
        habit.done === null ? true : habit.done === true ? false : null;

      // Optimistic update
      setDay((prev) =>
        prev
          ? {
              ...prev,
              habits: prev.habits.map((h) =>
                h.id === habit.id ? { ...h, done: next } : h
              ),
            }
          : prev
      );

      try {
        const updated = await daysApi.updateHabit(day.dateKey, habit.id, {
          done: next,
        });
        setDay(updated);
        // Refresh streak
        const s = await daysApi.getStreak();
        setStreak(s);
      } catch {
        // Revert on failure
        setDay((prev) =>
          prev
            ? {
                ...prev,
                habits: prev.habits.map((h) =>
                  h.id === habit.id ? { ...h, done: habit.done } : h
                ),
              }
            : prev
        );
        toast.error("Could not save habit");
      }
    },
    [day]
  );

  const updateNote = useCallback(
    async (habit: Habit, note: string) => {
      if (!day) return;
      setDay((prev) =>
        prev
          ? {
              ...prev,
              habits: prev.habits.map((h) =>
                h.id === habit.id ? { ...h, note } : h
              ),
            }
          : prev
      );
      try {
        const updated = await daysApi.updateHabit(day.dateKey, habit.id, {
          note,
        });
        setDay(updated);
      } catch {
        toast.error("Could not save note");
      }
    },
    [day]
  );

  const updateHabitName = useCallback(
    async (habit: Habit, name: string) => {
      if (!day) return;
      setDay((prev) =>
        prev
          ? {
              ...prev,
              habits: prev.habits.map((h) =>
                h.id === habit.id ? { ...h, name } : h
              ),
            }
          : prev
      );
      try {
        setSaving(true);
        const updated = await daysApi.updateHabit(day.dateKey, habit.id, {
          name,
        });
        setDay(updated);
      } catch {
        toast.error("Could not save habit name");
      } finally {
        setSaving(false);
      }
    },
    [day]
  );

  const addHabit = useCallback(async () => {
    if (!day) return;
    if (day.habits.length >= 30) {
      toast.error("Maximum 30 habits per day");
      return;
    }
    try {
      const updated = await daysApi.addHabit(day.dateKey, "");
      setDay(updated);
    } catch {
      toast.error("Could not add habit");
    }
  }, [day]);

  const deleteHabit = useCallback(
    async (habitId: string) => {
      if (!day) return;
      const prev = day;
      setDay((d) =>
        d ? { ...d, habits: d.habits.filter((h) => h.id !== habitId) } : d
      );
      try {
        const updated = await daysApi.deleteHabit(day.dateKey, habitId);
        setDay(updated);
      } catch {
        setDay(prev);
        toast.error("Could not delete habit");
      }
    },
    [day]
  );

  const updateReflection = useCallback(
    async (reflection: string) => {
      if (!day) return;
      setDay((prev) => (prev ? { ...prev, reflection } : prev));
      try {
        const updated = await daysApi.updateDay(day.dateKey, { reflection });
        setDay(updated);
      } catch {
        toast.error("Could not save reflection");
      }
    },
    [day]
  );

  const updateRating = useCallback(
    async (rating: number) => {
      if (!day) return;
      setDay((prev) => (prev ? { ...prev, rating } : prev));
      try {
        const updated = await daysApi.updateDay(day.dateKey, { rating });
        setDay(updated);
      } catch {
        toast.error("Could not save rating");
      }
    },
    [day]
  );

  return {
    day,
    streak,
    loading,
    saving,
    toggleHabit,
    updateNote,
    updateHabitName,
    addHabit,
    deleteHabit,
    updateReflection,
    updateRating,
    reload: loadDay,
  };
}

export { getTodayKey };
