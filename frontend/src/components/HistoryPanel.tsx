import React, { useEffect, useState } from 'react';
import { DayLog } from '../types';
import { daysApi } from '../api';

interface Props {
  currentKey: string;
  onSelectDay: (key: string) => void;
  onClose: () => void;
}

export const HistoryPanel: React.FC<Props> = ({ currentKey, onSelectDay, onClose }) => {
  const [days, setDays] = useState<DayLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    daysApi.getAllDays().then((d) => {
      setDays(d);
      setLoading(false);
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-end" onClick={onClose}>
      <div
        className="w-80 bg-[#faf8f3] h-full overflow-y-auto shadow-2xl border-l border-zinc-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[#faf8f3] border-b border-zinc-200 px-5 py-4 flex items-center justify-between">
          <span className="font-display text-lg tracking-wide">History</span>
          <button onClick={onClose} className="text-zinc-400 hover:text-black text-lg">✕</button>
        </div>

        {loading ? (
          <div className="p-5 text-zinc-400 font-mono text-sm">Loading...</div>
        ) : days.length === 0 ? (
          <div className="p-5 text-zinc-400 font-mono text-sm">No past days yet.</div>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {days.map((d) => {
              const total = d.habits.length;
              const done = d.habits.filter((h) => h.done === true).length;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              const isActive = d.dateKey === currentKey;

              return (
                <li key={d.dateKey}>
                  <button
                    onClick={() => { onSelectDay(d.dateKey); onClose(); }}
                    className={`w-full text-left px-5 py-3 hover:bg-zinc-50 transition-colors ${isActive ? 'bg-black text-[#faf8f3]' : ''}`}
                  >
                    <div className={`font-mono text-sm ${isActive ? 'text-[#faf8f3]' : 'text-black'}`}>
                      {d.displayDate}
                    </div>
                    <div className={`font-mono text-xs mt-0.5 ${isActive ? 'text-zinc-300' : 'text-zinc-400'}`}>
                      {done}/{total} habits · {pct}%
                      {d.rating > 0 && ` · ${'★'.repeat(d.rating)}`}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
