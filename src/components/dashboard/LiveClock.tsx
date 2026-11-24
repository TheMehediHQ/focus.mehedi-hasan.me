import React, { useState, useEffect } from 'react';

export const LiveClock: React.FC = () => {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return (
      <div className="h-12 flex items-center">
        <div className="w-36 h-7 rounded-lg bg-white/5 animate-pulse" />
      </div>
    );
  }

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const dateStr = time.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col items-start select-none">
      <div className="flex items-baseline font-mono tracking-tight text-white drop-shadow-sm">
        <span className="text-3xl sm:text-4xl font-light text-zinc-100">{hours}</span>
        <span className="text-3xl sm:text-4xl font-extralight text-sky-400 mx-0.5 animate-pulse">:</span>
        <span className="text-3xl sm:text-4xl font-light text-zinc-100">{minutes}</span>
        <span className="text-base sm:text-lg font-light text-zinc-500 ml-1.5">:{seconds}</span>
      </div>
      <div className="text-[11px] font-medium tracking-wider uppercase text-zinc-400 mt-0.5">
        {dateStr}
      </div>
    </div>
  );
};
