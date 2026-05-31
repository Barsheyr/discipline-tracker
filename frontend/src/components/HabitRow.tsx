import React, { useRef, useState } from 'react';
import { Habit } from '../types';

interface Props {
  habit: Habit;
  index: number;
  onToggle: (h: Habit) => void;
  onNoteChange: (h: Habit, note: string) => void;
  onNameChange: (h: Habit, name: string) => void;
  onDelete: (id: string) => void;
}

export const HabitRow: React.FC<Props> = ({
  habit,
  index,
  onToggle,
  onNoteChange,
  onNameChange,
  onDelete,
}) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const noteRef = useRef<HTMLInputElement>(null);
  const [localNote, setLocalNote] = useState(habit.note);
  const [localName, setLocalName] = useState(habit.name);

  const doneClass =
    habit.done === true
      ? 'bg-black border-black text-[#faf8f3]'
      : habit.done === false
      ? 'border-zinc-400 text-zinc-400'
      : 'border-zinc-300 text-transparent';

  const doneSymbol =
    habit.done === true ? '✓' : habit.done === false ? '✗' : '·';

  return (
    <tr className="border-b border-zinc-200 group hover:bg-zinc-50 transition-colors">
      {/* Number */}
      <td className="py-2 pl-0 pr-1 text-zinc-400 text-[11px] w-5 select-none align-middle">
        {index + 1}.
      </td>

      {/* Habit name */}
      <td className="py-2 pr-2 align-middle">
        <div className="flex items-center gap-2">
          <input
            ref={nameRef}
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            onBlur={() => {
              if (localName !== habit.name) onNameChange(habit, localName);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') nameRef.current?.blur();
            }}
            placeholder="Add habit..."
            className="bg-transparent border-none outline-none font-mono text-[13px] text-black w-full placeholder-zinc-300"
          />
          <button
            onClick={() => onDelete(habit.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-300 hover:text-black text-xs flex-shrink-0 px-1"
            title="Remove habit"
          >
            ✕
          </button>
        </div>
      </td>

      {/* Toggle button */}
      <td className="py-2 text-center align-middle w-12">
        <button
          onClick={() => onToggle(habit)}
          className={`w-7 h-7 border-[1.5px] inline-flex items-center justify-center text-sm font-mono transition-all duration-100 ${doneClass}`}
          title="Toggle habit"
        >
          {doneSymbol}
        </button>
      </td>

      {/* Note */}
      <td className="py-2 pl-2 align-middle w-36">
        <input
          ref={noteRef}
          value={localNote}
          onChange={(e) => setLocalNote(e.target.value)}
          onBlur={() => {
            if (localNote !== habit.note) onNoteChange(habit, localNote);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') noteRef.current?.blur();
          }}
          placeholder="—"
          className="bg-transparent border-none border-b border-dotted border-zinc-200 outline-none font-mono text-[12px] text-zinc-500 w-full placeholder-zinc-200"
        />
      </td>
    </tr>
  );
};
