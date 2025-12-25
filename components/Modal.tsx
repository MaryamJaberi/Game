
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-8 animate-in fade-in duration-300">
      <div className="bg-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-8 text-center">
          <h3 className="text-2xl font-black text-slate-800 mb-4">{title}</h3>
          <p className="text-slate-500 leading-relaxed">{body}</p>
        </div>
        <div className="p-4 bg-slate-50 flex flex-col gap-2">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-95 ${
                action.primary 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : action.danger 
                ? 'bg-red-50 text-red-600' 
                : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modal;
