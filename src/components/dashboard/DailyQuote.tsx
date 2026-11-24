import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

const QUOTES = [
  { text: "Simplicity is prerequisite for reliability.", author: "Edsger Dijkstra" },
  { text: "Where your attention goes, your energy flows.", author: "Mindfulness" },
  { text: "Deep work is the superpower of the 21st century.", author: "Cal Newport" },
  { text: "Stillness is where creativity is born.", author: "Eckhart Tolle" },
  { text: "Focus is a muscle. Train it in quiet environments.", author: "Zen Wisdom" },
];

export const DailyQuote: React.FC = () => {
  const [index, setIndex] = useState(0);

  const nextQuote = () => {
    setIndex((prev) => (prev + 1) % QUOTES.length);
  };

  const quote = QUOTES[index];

  return (
    <div
      onClick={nextQuote}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') nextQuote(); }}
      title="Click for next thought"
      className="group relative cursor-pointer text-left py-2 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-all duration-200 max-w-sm"
    >
      <div className="flex items-start gap-2.5">
        <Sparkles className="w-3.5 h-3.5 text-sky-400 mt-0.5 flex-shrink-0 group-hover:rotate-12 transition-transform duration-300" />
        <div>
          <p className="text-xs text-zinc-300 font-light leading-relaxed">
            "{quote.text}"
          </p>
          <p className="text-[10px] text-zinc-500 font-mono tracking-wide mt-0.5">
            — {quote.author}
          </p>
        </div>
      </div>
    </div>
  );
};
