import React from 'react';
import { GameSettings, Team, Player, TeamColor } from '../types';
import { COLORS_MAP } from '../constants';
import { TRANSLATIONS } from '../translations';
import { TeamMascot } from '../components/Mascots';

interface Props {
  settings: GameSettings;
  teams: Team[];
  players: Player[];
  onConfirm: () => void;
  onBack: () => void;
  onOpenHelp: () => void;
}

const SeatingConfirmScreen: React.FC<Props> = ({
  settings,
  teams,
  players,
  onConfirm,
  onBack,
  onOpenHelp
}) => {
  const t = TRANSLATIONS[settings.language];
  const isRTL = settings.language === 'fa' || settings.language === 'ar';
  const radius = 105;
  const centerX = 140;
  const centerY = 140;
  const teamCount = settings.playerCount / 2;

  return (
    <div className="flex-1 flex flex-col p-5 select-none overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-3 bg-black text-white p-3 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_#43D9FF]">
        <div className="flex items-center gap-2">
          <span className="text-xl">🪑</span>
          <h2 className="text-base font-bold uppercase tracking-wider">
            {settings.language === 'fa' ? 'چیدمان دور میز' : 'Table Seating Guide'}
          </h2>
        </div>
        <button 
          onClick={onOpenHelp} 
          className="px-3 py-1 bg-[#43D9FF] text-black border-2 border-black font-bold text-xs rounded hover:bg-cyan-300 transition-colors"
        >
          {t.guide}
        </button>
      </div>

      {/* Seating Tip */}
      <div className="text-[11px] font-bold text-slate-800 bg-white/90 p-2.5 border-2 border-black rounded-xl text-center mb-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]">
        {settings.language === 'fa' 
          ? '🎯 هم‌تیمی‌ها دقیقاً روبروی هم می‌نشینند! چرخش بازی ساعت‌گرد است.' 
          : '🎯 Teammates sit directly opposite each other! Rotation is clockwise.'}
      </div>

      {/* Interactive Seating Circle SVG */}
      <div className="relative w-72 h-72 mx-auto select-none bg-white p-2 border-4 border-black rounded-3xl shadow-[4px_4px_0px_0px_#000000] my-auto flex items-center justify-center">
        <svg width="280" height="280" viewBox="0 0 280 280" className="mx-auto">
          {/* Table Center */}
          <circle cx={centerX} cy={centerY} r="45" fill="#241B3D" stroke="#181425" strokeWidth="4" />
          <circle cx={centerX} cy={centerY} r="40" fill="#17142C" />
          <text 
            x={centerX} 
            y={centerY + 4} 
            textAnchor="middle" 
            fill="#FFD447" 
            className="text-[11px] font-black font-display uppercase tracking-widest"
          >
            TABLE
          </text>

          {/* Dotted Seating Circle */}
          <circle 
            cx={centerX} 
            cy={centerY} 
            r={radius} 
            fill="none" 
            stroke="#181425" 
            strokeWidth="3" 
            strokeDasharray="6,6" 
            className="opacity-50"
          />

          {/* Opposite Partner Lines */}
          {Array.from({ length: teamCount }).map((_, i) => {
            const angle1 = (i * 360 / settings.playerCount - 90) * (Math.PI / 180);
            const angle2 = ((i + teamCount) * 360 / settings.playerCount - 90) * (Math.PI / 180);
            const x1 = centerX + radius * Math.cos(angle1);
            const y1 = centerY + radius * Math.sin(angle1);
            const x2 = centerX + radius * Math.cos(angle2);
            const y2 = centerY + radius * Math.sin(angle2);
            const team = teams[i];
            const colorConfig = team ? COLORS_MAP[team.color] : { hex: '#4AA8FF' };

            return (
              <line 
                key={i} 
                x1={x1} 
                y1={y1} 
                x2={x2} 
                y2={y2} 
                stroke={colorConfig.hex} 
                strokeWidth="3.5" 
                strokeDasharray="4,4"
                className="opacity-75"
              />
            );
          })}

          {/* Player Seats */}
          {players.map((p, i) => {
            const angle = (i * 360 / players.length - 90) * (Math.PI / 180);
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            const config = COLORS_MAP[p.teamColor] || { hex: '#4AA8FF' };

            return (
              <g key={p.id}>
                {/* Seat circle */}
                <circle 
                  cx={x} 
                  cy={y} 
                  r="22" 
                  fill={config.hex} 
                  stroke="#181425" 
                  strokeWidth="3.5" 
                  className="shadow-md"
                />
                {/* Player Number */}
                <text 
                  x={x} 
                  y={y - 2} 
                  textAnchor="middle" 
                  fill="#181425" 
                  className="text-[10px] font-black"
                >
                  P{i + 1}
                </text>
                {/* Name Label */}
                <text 
                  x={x} 
                  y={y + 11} 
                  textAnchor="middle" 
                  fill="#181425" 
                  className="text-[9px] font-black"
                  style={{ fontFamily: 'Vazirmatn, sans-serif' }}
                >
                  {p.name.slice(0, 7)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Teams Roster Bar */}
      <div className="grid grid-cols-2 gap-2 my-2">
        {teams.map(team => {
          const config = COLORS_MAP[team.color];
          const teamPlayers = players.filter(p => p.teamId === team.id);
          return (
            <div 
              key={team.id}
              className="bg-white p-2 rounded-xl border-3 border-black flex items-center gap-2 shadow-[2px_2px_0px_0px_#000000]"
              style={{ borderColor: config.hex }}
            >
              <TeamMascot color={team.color} size={30} animate={false} />
              <div className="min-w-0 flex-1">
                <div className="text-[9px] font-black text-slate-500 uppercase truncate">
                  {t.teamNames[team.color]}
                </div>
                <div className="text-[10px] font-black text-slate-800 truncate">
                  {teamPlayers.map(p => p.name).join(' ⚔️ ')}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-2">
        <button 
          onClick={onBack} 
          className="pixel-btn pixel-btn-dark flex-1 py-3 text-sm font-bold uppercase tracking-wider"
        >
          {t.back}
        </button>
        <button 
          onClick={onConfirm} 
          className="pixel-btn pixel-btn-lime flex-[2] py-3 text-base font-black uppercase tracking-wider text-black"
        >
          🚀 {settings.language === 'fa' ? 'شروع بازی' : 'Start Round 1'}
        </button>
      </div>
    </div>
  );
};

export default SeatingConfirmScreen;
