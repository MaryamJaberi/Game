import React from 'react';

interface Action {
  label: string;
  onClick: () => void;
  primary?: boolean;
  danger?: boolean;
}

interface Props {
  title: string;
  body: string;
  actions: Action[];
}

const Modal: React.FC<Props> = ({ title, body, actions }) => {
  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[100] flex items-center justify-center p-6 select-none">
      {/* 3D Pixel Double Border Card */}
      <div className="pixel-card bg-white w-full max-w-sm overflow-hidden animate-wiggle rounded-2xl" style={{ animationDuration: '4s' }}>
        
        {/* Colorful Festive Garland Header */}
        <div className="h-5 bg-repeat-x bg-[#ff007f] border-b-4 border-black relative">
          {/* Mock Garland triangles */}
          <div className="absolute inset-0 flex justify-around items-start">
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-yellow-300"></div>
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#39ff14]"></div>
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-cyan-300"></div>
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-yellow-300"></div>
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#39ff14]"></div>
          </div>
        </div>

        {/* Modal Info */}
        <div className="p-6 text-center">
          <h3 className="text-2xl font-black text-black mb-3 border-b-2 border-black pb-2 tracking-tight">
            🚨 {title} 🚨
          </h3>
          <p className="text-slate-700 text-sm font-bold bg-slate-50 p-3 border-2 border-slate-200 rounded-xl">
            {body}
          </p>
        </div>

        {/* Modal Controls with high-contrast pixel buttons */}
        <div className="p-4 bg-slate-100 border-t-4 border-black flex flex-col gap-3">
          {actions.map((action, i) => {
            let btnClass = 'pixel-btn-purple';
            if (action.primary) btnClass = 'pixel-btn-pink';
            if (action.danger) btnClass = 'pixel-btn-dark';

            return (
              <button
                key={i}
                type="button"
                onClick={action.onClick}
                className={`pixel-btn ${btnClass} w-full py-3.5 font-black text-sm uppercase tracking-wider`}
              >
                {action.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Modal;
