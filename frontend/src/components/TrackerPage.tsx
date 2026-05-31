import React, { useEffect, useRef, useState } from 'react';
import { useDayLog, getTodayKey } from '../hooks/useDayLog';
import { HabitRow } from './HabitRow';
import { ScoreBar } from './ScoreBar';
import { StarRating } from './StarRating';
import { HistoryPanel } from './HistoryPanel';

export const TrackerPage: React.FC = () => {
  const [dateKey, setDateKey] = useState(getTodayKey());
  const [showHistory, setShowHistory] = useState(false);
  const reflectionRef = useRef<HTMLTextAreaElement>(null);
  const reflectionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    day,
    streak,
    loading,
    toggleHabit,
    updateNote,
    updateHabitName,
    addHabit,
    deleteHabit,
    updateReflection,
    updateRating,
  } = useDayLog(dateKey);

  // Auto-resize reflection textarea
  useEffect(() => {
    if (reflectionRef.current) {
      reflectionRef.current.style.height = 'auto';
      reflectionRef.current.style.height = `${reflectionRef.current.scrollHeight}px`;
    }
  }, [day?.reflection]);

  const handleReflectionChange = (value: string) => {
    if (reflectionTimer.current) clearTimeout(reflectionTimer.current);
    reflectionTimer.current = setTimeout(() => {
      updateReflection(value);
    }, 800);
  };

  const isToday = dateKey === getTodayKey();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f2eb] flex items-center justify-center">
        <div className="font-display text-2xl text-zinc-400 tracking-widest animate-pulse">
          loading...
        </div>
      </div>
    );
  }

  if (!day) {
    return (
      <div className="min-h-screen bg-[#f5f2eb] flex items-center justify-center">
        <div className="font-mono text-zinc-500">Could not load tracker. Check your server.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f2eb] py-6 px-4">
      {showHistory && (
        <HistoryPanel
          currentKey={dateKey}
          onSelectDay={setDateKey}
          onClose={() => setShowHistory(false)}
        />
      )}

      <div className="max-w-2xl mx-auto bg-[#faf8f3] border-x border-zinc-200 shadow-sm min-h-screen pb-16">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b-2 border-black">
          <div className="flex items-center gap-4">
            <span className="font-display text-3xl tracking-wide text-black">Day</span>
            <span className="font-mono text-sm text-zinc-500 border-b border-black pb-0.5">
              {day.displayDate}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Streak badge */}
            <div className="flex items-center gap-1.5 bg-black text-[#faf8f3] px-3 py-1 font-mono text-xs tracking-wider">
              <span>🔥</span>
              <span>{streak} day{streak !== 1 ? 's' : ''}</span>
            </div>

            {/* History button */}
            <button
              onClick={() => setShowHistory(true)}
              className="border border-zinc-300 px-3 py-1 font-mono text-xs text-zinc-500 hover:border-black hover:text-black transition-colors"
            >
              history
            </button>

            {/* Today button (only when viewing past) */}
            {!isToday && (
              <button
                onClick={() => setDateKey(getTodayKey())}
                className="border border-black px-3 py-1 font-mono text-xs text-black hover:bg-black hover:text-[#faf8f3] transition-colors"
              >
                → today
              </button>
            )}
          </div>
        </div>

        {/* ── Motto ── */}
        <div className="text-center py-2 border-b border-zinc-200">
          <span className="font-display text-sm text-zinc-500 italic tracking-widest">
            — Discipline today, freedom tomorrow. —
          </span>
        </div>

        {/* ── Table ── */}
        <div className="px-6 pt-2">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-[10px] font-mono tracking-widest uppercase text-zinc-400 py-2 border-b border-black w-5 pr-1" />
                <th className="text-left text-[10px] font-mono tracking-widest uppercase text-zinc-400 py-2 border-b border-black">
                  Habit
                </th>
                <th className="text-center text-[10px] font-mono tracking-widest uppercase text-zinc-400 py-2 border-b border-black w-12">
                  ✓ / ✗
                </th>
                <th className="text-left text-[10px] font-mono tracking-widest uppercase text-zinc-400 py-2 border-b border-black pl-2 w-36">
                  Review / Note
                </th>
              </tr>
            </thead>
            <tbody>
              {day.habits.map((habit, i) => (
                <HabitRow
                  key={habit.id}
                  habit={habit}
                  index={i}
                  onToggle={toggleHabit}
                  onNoteChange={updateNote}
                  onNameChange={updateHabitName}
                  onDelete={deleteHabit}
                />
              ))}

              {/* Add habit row */}
              {day.habits.length < 30 && (
                <tr>
                  <td />
                  <td colSpan={3} className="py-2">
                    <button
                      onClick={addHabit}
                      className="border border-dashed border-zinc-300 text-zinc-400 hover:border-black hover:text-black font-mono text-xs px-3 py-1 transition-colors tracking-wider"
                    >
                      + add habit ({day.habits.length}/30)
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Score ── */}
        <ScoreBar habits={day.habits} />

        {/* ── Star rating ── */}
        <StarRating rating={day.rating} onRate={updateRating} />

        {/* ── Reflection ── */}
        <div className="px-6 pt-2 pb-6">
          <div className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 border-b border-zinc-200 pb-1 mb-3">
            Reflection
          </div>

          {/* Lined paper effect */}
          <div className="relative">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(transparent, transparent 27px, #e8e4db 27px, #e8e4db 28px)',
                backgroundPosition: '0 6px',
              }}
            />
            <textarea
              ref={reflectionRef}
              defaultValue={day.reflection}
              onChange={(e) => handleReflectionChange(e.target.value)}
              placeholder="How was your day? What could have gone better..."
              className="relative z-10 w-full bg-transparent border-none outline-none resize-none font-mono text-[13px] text-black placeholder-zinc-200 leading-7 min-h-[112px] py-1 px-0"
              rows={4}
            />
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="border-t border-zinc-200 pt-4 pb-6 text-center">
          <p className="font-display text-sm text-zinc-400 italic tracking-widest">
            "Discipline today, freedom tomorrow."
          </p>
          <p className="text-black text-lg mt-1">★</p>
        </div>
      </div>
    </div>
  );
};
