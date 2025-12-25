
import React from 'react';
import { Player, TeamColor } from '../types';
import { COLORS_MAP } from '../constants';

interface Props {
  players: Player[];
  activeIndex: number;
  eliminatedTeamIds: number[];
}

const PlayerCircle: React.FC<Props> = ({ players, activeIndex, eliminatedTeamIds }) => {
  const radius = 100;
  const centerX = 125;
  const centerY = 125;

  return (
    <div className="relative w-64 h-64 mx-auto">
      <svg width="250" height="250" viewBox="0 0 250 250">
        {/* Circle Path */}
        <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="5,5" />
        
        {/* Players */}
        {players.map((p, i) => {
          const angle = (i * 360 / players.length - 90) * (Math.PI / 180);
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          const isActive = i === activeIndex;
          const isEliminated = eliminatedTeamIds.includes(p.teamId);
          const config = COLORS_MAP[p.teamColor];

          return (
            <g key={p.id} className="transition-all duration-500">
              <circle 
                cx={x} cy={y} 
                r={isActive ? 22 : 16} 
                fill={isEliminated ? '#cbd5e1' : config.hex} 
                className={`${isActive ? 'filter drop-shadow-lg' : ''} transition-all`}
              />
              <text 
                x={x} y={y + (isActive ? 35 : 28)} 
                textAnchor="middle" 
                className={`text-[10px] font-bold ${isActive ? 'fill-slate-800 scale-110' : 'fill-slate-400'}`}
              >
                {p.name.slice(0, 8)}
              </text>
              {isActive && (
                <circle 
                  cx={x} cy={y} r={28} 
                  fill="none" 
                  stroke={config.hex} 
                  strokeWidth="2" 
                  className="animate-ping opacity-30"
                />
              )}
            </g>
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="w-10 h-10 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>
  );
};

export default PlayerCircle;
