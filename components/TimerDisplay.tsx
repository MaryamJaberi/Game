import React from 'react';

interface Props {
  ms: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  colorClass?: string;
}

const TimerDisplay: React.FC<Props> = ({ ms, label, size = 'md', active = false, colorClass = 'text-black' }) => {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);

  // Pick vibrant pixel colors based on warnings
  const isPanic = seconds <= 15;
  const digitColor = isPanic ? 'text-[#ff007f]' : (active ? 'text-[#39ff14]' : 'text-[#00d2ff]');

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <div className={`flex flex-col items-center transition-all ${active ? 'scale-105' : 'opacity-85'}`}>
      {/* Label */}
      {label && (
        <span className="text-[9px] uppercase tracking-wider text-black bg-[#ffd200] border border-black px-1.5 py-0.5 rounded font-black mb-1.5 shadow-[1px_1px_0px_0px_#000000]">
          {label}
        </span>
      )}

      {/* Clock Plate Capsule wrapper */}
      <div className={`px-4 py-2 bg-black border-4 border-black rounded-xl shadow-[3px_3px_0px_0px_#000000] flex items-center justify-center`}>
        {/* Stopwatch Icon */}
        <span className="mr-2.5 text-base text-white">⏱️</span>

        <div className={`font-pixel ${sizeClasses[size]} ${digitColor} tabular-nums flex items-baseline`} dir="ltr">
          <span>{minutes.toString().padStart(2, '0')}</span>
          <span className="mx-1 animate-pulse opacity-85">:</span>
          <span>{remainingSeconds.toString().padStart(2, '0')}</span>
          {size !== 'sm' && (
            <>
              <span className="mx-0.5 text-xs opacity-65">.</span>
              <span className="text-xs opacity-80 w-6">{centiseconds.toString().padStart(2, '0')}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay;
