import React from 'react';

interface NeonIconProps {
  size?: number | string;
  className?: string;
  color?: string;
  glow?: boolean;
}

export const NeonLightning: React.FC<NeonIconProps> = ({ size = 24, className = '', color = '#FFE600', glow = true }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={`${className} ${glow ? 'drop-shadow-[0_0_6px_rgba(255,230,0,0.8)]' : ''}`}
  >
    <path 
      d="M13 2L3 14H12L11 22L21 10H12L13 2Z" 
      stroke={color} 
      strokeWidth="2.2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      fill={`${color}33`}
    />
  </svg>
);

export const NeonTrophy: React.FC<NeonIconProps> = ({ size = 24, className = '', color = '#FFE600', glow = true }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={`${className} ${glow ? 'drop-shadow-[0_0_6px_rgba(255,230,0,0.8)]' : ''}`}
  >
    <path d="M6 9H4C2.89543 9 2 8.10457 2 7V5C2 3.89543 2.89543 3 4 3H6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M18 9H20C21.1046 9 22 8.10457 22 7V5C22 3.89543 21.1046 3 20 3H18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M6 3H18V10C18 13.3137 15.3137 16 12 16C8.68629 16 6 13.3137 6 10V3Z" stroke={color} strokeWidth="2" fill={`${color}22`} />
    <path d="M12 16V20M8 21H16" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const NeonGamepad: React.FC<NeonIconProps> = ({ size = 24, className = '', color = '#FF007F', glow = true }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={`${className} ${glow ? 'drop-shadow-[0_0_6px_rgba(255,0,127,0.8)]' : ''}`}
  >
    <rect x="2" y="6" width="20" height="12" rx="6" stroke={color} strokeWidth="2" fill={`${color}22`} />
    <path d="M6 12H10M8 10V14" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="15" cy="11" r="1" fill={color} />
    <circle cx="17" cy="13" r="1" fill={color} />
  </svg>
);

export const NeonBook: React.FC<NeonIconProps> = ({ size = 24, className = '', color = '#00F0FF', glow = true }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={`${className} ${glow ? 'drop-shadow-[0_0_6px_rgba(0,240,255,0.8)]' : ''}`}
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M6.5 2H20V22H6.5A2.5 2.5 0 0 1 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2Z" stroke={color} strokeWidth="2" fill={`${color}22`} />
    <line x1="8" y1="6" x2="16" y2="6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <line x1="8" y1="10" x2="14" y2="10" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const NeonSparkle: React.FC<NeonIconProps> = ({ size = 24, className = '', color = '#00F0FF', glow = true }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={`${className} ${glow ? 'drop-shadow-[0_0_6px_rgba(0,240,255,0.8)]' : ''}`}
  >
    <path d="M12 2L14 8L20 10L14 12L12 18L10 12L4 10L10 8L12 2Z" stroke={color} strokeWidth="2" fill={`${color}33`} />
    <circle cx="19" cy="5" r="1.5" fill={color} />
    <circle cx="5" cy="18" r="1.5" fill={color} />
  </svg>
);

export const NeonCrown: React.FC<NeonIconProps> = ({ size = 24, className = '', color = '#FFE600', glow = true }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={`${className} ${glow ? 'drop-shadow-[0_0_6px_rgba(255,230,0,0.8)]' : ''}`}
  >
    <path d="M2 18L5 6L10 11L12 4L14 11L19 6L22 18H2Z" stroke={color} strokeWidth="2" strokeLinejoin="round" fill={`${color}22`} />
    <circle cx="5" cy="5" r="1" fill={color} />
    <circle cx="12" cy="3" r="1" fill={color} />
    <circle cx="19" cy="5" r="1" fill={color} />
  </svg>
);

export const NeonPartyHat: React.FC<NeonIconProps> = ({ size = 24, className = '', color = '#FF007F', glow = true }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={`${className} ${glow ? 'drop-shadow-[0_0_6px_rgba(255,0,127,0.8)]' : ''}`}
  >
    <polygon points="12,3 4,20 20,20" stroke={color} strokeWidth="2" strokeLinejoin="round" fill={`${color}22`} />
    <circle cx="12" cy="3" r="2" fill="#FFE600" stroke="#FFE600" />
    <path d="M7 16C9 14 15 14 17 16" stroke="#00F0FF" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M9 12C11 10 13 10 15 12" stroke="#FFE600" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const NeonClock: React.FC<NeonIconProps> = ({ size = 24, className = '', color = '#00F0FF', glow = true }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={`${className} ${glow ? 'drop-shadow-[0_0_6px_rgba(0,240,255,0.8)]' : ''}`}
  >
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" fill={`${color}15`} />
    <path d="M12 7V12L15 14" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

export const NeonVolume: React.FC<NeonIconProps & { muted?: boolean }> = ({ size = 24, className = '', color = '#39FF14', glow = true, muted = false }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={`${className} ${glow ? `drop-shadow-[0_0_6px_${muted ? 'rgba(255,100,100,0.8)' : 'rgba(57,255,20,0.8)'}]` : ''}`}
  >
    <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke={muted ? '#FF4A6E' : color} strokeWidth="2" strokeLinejoin="round" fill={muted ? '#FF4A6E22' : `${color}22`} />
    {!muted ? (
      <>
        <path d="M15.54 8.46C16.48 9.4 17 10.65 17 12C17 13.35 16.48 14.6 15.54 15.54" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M19.07 4.93C20.95 6.8 22 9.3 22 12C22 14.7 20.95 17.2 19.07 19.07" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </>
    ) : (
      <path d="M22 9L16 15M16 9L22 15" stroke="#FF4A6E" strokeWidth="2" strokeLinecap="round" />
    )}
  </svg>
);

export const NeonCategoryIcon: React.FC<{ catKey: string; size?: number; className?: string }> = ({ catKey, size = 26, className = '' }) => {
  switch (catKey) {
    case 'CAT_OBJECTS':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`drop-shadow-[0_0_5px_rgba(255,230,0,0.7)] ${className}`}>
          <rect x="3" y="3" width="18" height="18" rx="4" stroke="#FFE600" strokeWidth="2" fill="#FFE60015" />
          <circle cx="8" cy="8" r="1.5" fill="#FFE600" />
          <circle cx="16" cy="8" r="1.5" fill="#FFE600" />
          <circle cx="12" cy="12" r="1.5" fill="#FFE600" />
          <circle cx="8" cy="16" r="1.5" fill="#FFE600" />
          <circle cx="16" cy="16" r="1.5" fill="#FFE600" />
        </svg>
      );
    case 'CAT_FOOD':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`drop-shadow-[0_0_5px_rgba(255,0,127,0.7)] ${className}`}>
          <path d="M12 2L2 20C7 22 17 22 22 20L12 2Z" stroke="#FF007F" strokeWidth="2" strokeLinejoin="round" fill="#FF007F18" />
          <circle cx="10" cy="13" r="1.5" fill="#FFE600" />
          <circle cx="14" cy="15" r="1.5" fill="#39FF14" />
          <circle cx="12" cy="9" r="1.2" fill="#00F0FF" />
        </svg>
      );
    case 'CAT_ANIMALS':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`drop-shadow-[0_0_5px_rgba(57,255,20,0.7)] ${className}`}>
          <path d="M12 6C7 6 4 10 4 15C4 18 7 20 12 20C17 20 20 18 20 15C20 10 17 6 12 6Z" stroke="#39FF14" strokeWidth="2" fill="#39FF1415" />
          <path d="M6 8L3 3L8 6" stroke="#39FF14" strokeWidth="2" strokeLinejoin="round" />
          <path d="M18 8L21 3L16 6" stroke="#39FF14" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="9" cy="13" r="1.5" fill="#39FF14" />
          <circle cx="15" cy="13" r="1.5" fill="#39FF14" />
          <path d="M10 16Q12 18 14 16" stroke="#39FF14" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'CAT_JOBS':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`drop-shadow-[0_0_5px_rgba(0,240,255,0.7)] ${className}`}>
          <rect x="3" y="7" width="18" height="14" rx="3" stroke="#00F0FF" strokeWidth="2" fill="#00F0FF15" />
          <path d="M8 7V4C8 3.4 8.4 3 9 3H15C15.6 3 16 3.4 16 4V7" stroke="#00F0FF" strokeWidth="2" />
          <line x1="3" y1="12" x2="21" y2="12" stroke="#00F0FF" strokeWidth="1.8" />
          <rect x="10.5" y="11" width="3" height="3" rx="0.5" fill="#FFE600" />
        </svg>
      );
    case 'CAT_PLACES':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`drop-shadow-[0_0_5px_rgba(255,100,200,0.7)] ${className}`}>
          <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke="#FF4A9E" strokeWidth="2" fill="#FF4A9E15" />
          <circle cx="12" cy="9" r="3" stroke="#FFE600" strokeWidth="2" />
        </svg>
      );
    case 'CAT_VEHICLES':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`drop-shadow-[0_0_5px_rgba(0,240,255,0.7)] ${className}`}>
          <path d="M5 14L7 7H17L19 14M5 14H19M5 14V17H19V14" stroke="#00F0FF" strokeWidth="2" strokeLinejoin="round" fill="#00F0FF15" />
          <circle cx="7.5" cy="17.5" r="2" stroke="#FFE600" strokeWidth="2" />
          <circle cx="16.5" cy="17.5" r="2" stroke="#FFE600" strokeWidth="2" />
        </svg>
      );
    case 'CAT_FEELINGS':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`drop-shadow-[0_0_5px_rgba(255,230,0,0.7)] ${className}`}>
          <circle cx="12" cy="12" r="9" stroke="#FFE600" strokeWidth="2" fill="#FFE60015" />
          <circle cx="9" cy="10" r="1.5" fill="#FFE600" />
          <circle cx="15" cy="10" r="1.5" fill="#FFE600" />
          <path d="M8 14C9.5 16.5 14.5 16.5 16 14" stroke="#FFE600" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'CAT_SPORTS':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`drop-shadow-[0_0_5px_rgba(57,255,20,0.7)] ${className}`}>
          <circle cx="12" cy="12" r="9" stroke="#39FF14" strokeWidth="2" fill="#39FF1415" />
          <path d="M12 7L14.5 9.5L13.5 13L10.5 13L9.5 9.5L12 7Z" stroke="#FFE600" strokeWidth="1.8" />
          <line x1="12" y1="3" x2="12" y2="7" stroke="#39FF14" strokeWidth="1.8" />
          <line x1="3" y1="12" x2="9.5" y2="12" stroke="#39FF14" strokeWidth="1.8" />
          <line x1="21" y1="12" x2="14.5" y2="12" stroke="#39FF14" strokeWidth="1.8" />
        </svg>
      );
    case 'CAT_TECH':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`drop-shadow-[0_0_5px_rgba(0,240,255,0.7)] ${className}`}>
          <rect x="4" y="4" width="16" height="11" rx="2" stroke="#00F0FF" strokeWidth="2" fill="#00F0FF15" />
          <path d="M2 19H22" stroke="#00F0FF" strokeWidth="2" strokeLinecap="round" />
          <path d="M9 19L10 15H14L15 19" stroke="#00F0FF" strokeWidth="1.8" />
        </svg>
      );
    case 'CAT_ENTERTAINMENT':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`drop-shadow-[0_0_5px_rgba(255,0,127,0.7)] ${className}`}>
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="#FF007F" strokeWidth="2" fill="#FF007F15" />
          <path d="M10 9L15 12L10 15V9Z" stroke="#FFE600" strokeWidth="2" strokeLinejoin="round" fill="#FFE60033" />
        </svg>
      );
    case 'CAT_ADJECTIVES':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`drop-shadow-[0_0_5px_rgba(255,230,0,0.7)] ${className}`}>
          <path d="M20.59 13.41L13.42 20.58C12.64 21.36 11.37 21.36 10.59 20.58L3.41 13.41C2.63 12.63 2.63 11.36 3.41 10.58L10.58 3.41C11.36 2.63 12.63 2.63 13.41 3.41L20.59 10.58C21.37 11.36 21.37 12.64 20.59 13.41Z" stroke="#FFE600" strokeWidth="2" fill="#FFE60015" />
          <circle cx="12" cy="12" r="2" fill="#FF007F" />
        </svg>
      );
    default:
      return <NeonSparkle size={size} color="#00F0FF" className={className} />;
  }
};
