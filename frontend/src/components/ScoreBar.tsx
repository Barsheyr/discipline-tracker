import React from 'react';
import { Habit } from '../types';

interface Props {
  habits: Habit[];
}

function getProductiveTag(pct: number): string {
  if (pct >= 90) return 'This was an exceptional day.';
  if (pct >= 75) return 'This was a productive day. Could have done more.';
  if (pct >= 50) return 'Good effort. Keep pushing.';
  if (pct > 0) return 'Tomorrow is a fresh start. ↗';
  return 'Start your first habit for today.';
}

export const ScoreBar: React.FC<Props> = ({ habits }) => {
  const total = habits.length;
  const done = habits.filter((h) => h.done === true).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="border-t-2 border-black mt-1 pt-3 px-6 pb-2">
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-2xl text-black">{done}/{total}</span>
          <span className="text-[11px] tracking-widest uppercase text-zinc-400">completed</span>
        </div>
        <span className="font-display text-[32px] text-black">= {pct}%</span>
      </div>

      {/* Thin progress line */}
      <div className="mt-2 h-px bg-zinc-200 relative overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-black transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="text-[11px] font-mono text-zinc-500 mt-2 italic text-center tracking-wide">
        {getProductiveTag(pct)}
      </p>
    </div>
  );
};
