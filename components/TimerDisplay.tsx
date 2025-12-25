
import React from 'react';

interface Props {
  ms: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  colorClass?: string;
}

const TimerDisplay: React.FC<Props> = ({ ms, label, size = 'md', active = false, colorClass = 'text-slate-800' }) => {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-5xl'
  };

  // Ensure numerals stay LTR even in RTL Persian layouts
  return (
    <div className={`flex flex-col items-center transition-all ${active ? 'scale-105' : 'opacity-80'}`}>
      {label && <span className="text-[10px] uppercase tracking-wider text-slate-400 mb-1 font-bold">{label}</span>}
      <div className={`font-mono font-bold ${sizeClasses[size]} ${colorClass} tabular-nums flex items-baseline`} dir="ltr">
        <span>{minutes.toString().padStart(2, '0')}</span>
        <span className="mx-0.5 opacity-50 text-sm">:</span>
        <span>{remainingSeconds.toString().padStart(2, '0')}</span>
        {size !== 'sm' && (
          <>
            <span className="mx-0.5 opacity-30 text-xs">.</span>
            <span className="text-sm opacity-60 w-6">{centiseconds.toString().padStart(2, '0')}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default TimerDisplay;
