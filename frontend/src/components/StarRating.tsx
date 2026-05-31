import React from 'react';

interface Props {
  rating: number;
  onRate: (r: number) => void;
}

export const StarRating: React.FC<Props> = ({ rating, onRate }) => {
  return (
    <div className="flex items-center gap-2 px-6 py-2">
      <span className="text-[11px] tracking-widest uppercase text-zinc-400 mr-1">Day rating</span>
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          onClick={() => onRate(s === rating ? 0 : s)}
          className={`text-xl transition-colors duration-100 px-0.5 ${
            s <= rating ? 'text-black' : 'text-zinc-200 hover:text-zinc-400'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
};
