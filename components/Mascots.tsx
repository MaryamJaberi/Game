import React from 'react';
import { TeamColor } from '../types';

interface MascotProps {
  color?: TeamColor | 'PARTY';
  className?: string;
  size?: number | string;
  animate?: boolean;
}

export const TeamMascot: React.FC<MascotProps> = ({ color = TeamColor.Blue, className = '', size = 64, animate = true }: MascotProps) => {
  const isPartyAnimate = animate ? 'animate-party-float' : '';

  switch (color) {
    case TeamColor.Blue:
      /* BLUE TEAM: Nervous Blue Whale */
      return (
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 100 100" 
          className={`${isPartyAnimate} ${className}`}
          style={{ imageRendering: 'pixelated' }}
        >
          {/* Water Spout */}
          <path d="M48,15 Q50,6 45,3 Q52,9 50,15" fill="none" stroke="#43D9FF" strokeWidth="3" strokeLinecap="round" />
          <path d="M52,15 Q55,7 60,4 Q54,10 52,15" fill="none" stroke="#43D9FF" strokeWidth="3" strokeLinecap="round" />
          <circle cx="44" cy="3" r="2" fill="#43D9FF" />
          <circle cx="61" cy="4" r="2" fill="#43D9FF" />

          {/* Whale Body */}
          <path 
            d="M16,55 C16,32 35,22 62,22 C78,22 86,30 86,45 C86,60 76,75 55,75 C30,75 16,70 16,55 Z" 
            fill="#4AA8FF" 
            stroke="#181425" 
            strokeWidth="4" 
          />
          {/* Whale Belly */}
          <path 
            d="M26,62 C34,70 54,72 68,64 C64,72 50,75 35,74 C28,73 25,68 26,62 Z" 
            fill="#BEE3FF" 
            stroke="#181425" 
            strokeWidth="2.5" 
          />
          {/* Tail Fin */}
          <path d="M16,52 L6,42 Q4,50 9,56 L5,64 Q12,62 18,58 Z" fill="#4AA8FF" stroke="#181425" strokeWidth="3.5" />
          {/* Side Flipper */}
          <path d="M48,56 C44,66 38,68 34,64 C32,60 38,54 44,53 Z" fill="#3290EA" stroke="#181425" strokeWidth="3" />

          {/* Nervous Big Eyes */}
          <circle cx="58" cy="40" r="7" fill="#FFFFFF" stroke="#181425" strokeWidth="3" />
          <circle cx="57" cy="40" r="3" fill="#181425" />
          <circle cx="55" cy="38" r="1.5" fill="#FFFFFF" />

          <circle cx="74" cy="40" r="7" fill="#FFFFFF" stroke="#181425" strokeWidth="3" />
          <circle cx="73" cy="40" r="3" fill="#181425" />
          <circle cx="71" cy="38" r="1.5" fill="#FFFFFF" />

          {/* Nervous Squiggle Eyebrows */}
          <path d="M53,30 Q58,33 63,30" fill="none" stroke="#181425" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M69,30 Q74,33 79,30" fill="none" stroke="#181425" strokeWidth="2.5" strokeLinecap="round" />

          {/* Nervous Wavy Mouth */}
          <path d="M62,54 Q67,50 72,55 Q77,50 82,54" fill="none" stroke="#181425" strokeWidth="3" strokeLinecap="round" />

          {/* Cute Sweatdrop */}
          <path d="M84,32 Q88,24 90,32 A3,3 0 0,1 84,32" fill="#43D9FF" stroke="#181425" strokeWidth="1.5" />
          {/* Rosy Cheeks */}
          <ellipse cx="50" cy="48" rx="4" ry="2.5" fill="#FF6B6B" opacity="0.6" />
          <ellipse cx="82" cy="48" rx="4" ry="2.5" fill="#FF6B6B" opacity="0.6" />
        </svg>
      );

    case TeamColor.Red:
      /* RED TEAM: Hyper Red Mushroom */
      return (
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 100 100" 
          className={`${isPartyAnimate} ${className}`}
          style={{ imageRendering: 'pixelated' }}
        >
          {/* Mushroom Stem */}
          <path d="M36,54 C34,74 38,82 50,82 C62,82 66,74 64,54 Z" fill="#FFF5E6" stroke="#181425" strokeWidth="4" />
          
          {/* Mushroom Cap */}
          <path 
            d="M12,56 C12,28 30,16 50,16 C70,16 88,28 88,56 C88,60 12,60 12,56 Z" 
            fill="#FF6363" 
            stroke="#181425" 
            strokeWidth="4" 
          />
          {/* Cap Underbelly Rim */}
          <ellipse cx="50" cy="56" rx="38" ry="6" fill="#E64444" stroke="#181425" strokeWidth="3" />

          {/* White Polka Dots */}
          <circle cx="50" cy="28" r="8" fill="#FFFFFF" stroke="#181425" strokeWidth="2.5" />
          <circle cx="28" cy="40" r="6" fill="#FFFFFF" stroke="#181425" strokeWidth="2.5" />
          <circle cx="72" cy="40" r="6" fill="#FFFFFF" stroke="#181425" strokeWidth="2.5" />
          <circle cx="50" cy="46" r="4.5" fill="#FFFFFF" stroke="#181425" strokeWidth="2" />

          {/* Hyper Slanted Eyes */}
          <path d="M38,62 L48,65" stroke="#181425" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="44" cy="67" r="4" fill="#181425" />
          <circle cx="43" cy="65" r="1.5" fill="#FFFFFF" />

          <path d="M62,62 L52,65" stroke="#181425" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="56" cy="67" r="4" fill="#181425" />
          <circle cx="55" cy="65" r="1.5" fill="#FFFFFF" />

          {/* Hyper Open Mouth with Tongue */}
          <path d="M44,74 C44,80 56,80 56,74 Z" fill="#181425" />
          <path d="M47,77 C48,79 52,79 53,77 Z" fill="#FFD447" />

          {/* Tiny Cute Arms */}
          <path d="M32,66 L24,60" stroke="#181425" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M68,66 L76,60" stroke="#181425" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );

    case TeamColor.Green:
      /* GREEN TEAM: Happy Green Frog */
      return (
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 100 100" 
          className={`${isPartyAnimate} ${className}`}
          style={{ imageRendering: 'pixelated' }}
        >
          {/* Big Frog Eyes Spheres */}
          <circle cx="30" cy="32" r="15" fill="#6CFF7D" stroke="#181425" strokeWidth="4" />
          <circle cx="70" cy="32" r="15" fill="#6CFF7D" stroke="#181425" strokeWidth="4" />

          {/* Frog Head/Body */}
          <ellipse cx="50" cy="58" rx="38" ry="26" fill="#6CFF7D" stroke="#181425" strokeWidth="4" />
          {/* Light Green Belly */}
          <ellipse cx="50" cy="66" rx="22" ry="14" fill="#B9FFC1" stroke="#181425" strokeWidth="2.5" />

          {/* Eye Pupils */}
          <circle cx="30" cy="32" r="9" fill="#FFFFFF" stroke="#181425" strokeWidth="2.5" />
          <circle cx="31" cy="32" r="4.5" fill="#181425" />
          <circle cx="29" cy="30" r="1.8" fill="#FFFFFF" />

          <circle cx="70" cy="32" r="9" fill="#FFFFFF" stroke="#181425" strokeWidth="2.5" />
          <circle cx="69" cy="32" r="4.5" fill="#181425" />
          <circle cx="67" cy="30" r="1.8" fill="#FFFFFF" />

          {/* Cheerful Frog Cheeks */}
          <ellipse cx="24" cy="56" rx="5" ry="3" fill="#FF6B6B" opacity="0.6" />
          <ellipse cx="76" cy="56" rx="5" ry="3" fill="#FF6B6B" opacity="0.6" />

          {/* Huge Happy Frog Smile */}
          <path d="M25,52 Q50,75 75,52" fill="none" stroke="#181425" strokeWidth="4" strokeLinecap="round" />
          
          {/* Frog Nostril Dots */}
          <circle cx="46" cy="46" r="1.5" fill="#181425" />
          <circle cx="54" cy="46" r="1.5" fill="#181425" />

          {/* Tiny Leaf Crown on head */}
          <path d="M50,22 C46,12 50,8 50,8 C50,8 54,12 50,22 Z" fill="#9CFF57" stroke="#181425" strokeWidth="2" />
        </svg>
      );

    case TeamColor.Yellow:
      /* YELLOW TEAM: Chill Yellow Banana */
      return (
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 100 100" 
          className={`${isPartyAnimate} ${className}`}
          style={{ imageRendering: 'pixelated' }}
        >
          {/* Banana Stem Top */}
          <path d="M68,14 L74,18 L68,26 L62,22 Z" fill="#8FA31E" stroke="#181425" strokeWidth="3" />
          
          {/* Banana Curved Body */}
          <path 
            d="M68,20 C82,45 76,75 42,88 C32,92 24,88 20,84 C26,80 34,70 42,54 C50,38 58,24 68,20 Z" 
            fill="#FFD447" 
            stroke="#181425" 
            strokeWidth="4" 
          />
          {/* Banana Bottom Tip */}
          <circle cx="21" cy="85" r="3" fill="#6B4B1B" stroke="#181425" strokeWidth="1.5" />

          {/* Banana Inner Highlight */}
          <path 
            d="M62,28 C72,48 68,70 42,80" 
            fill="none" 
            stroke="#FFF2A3" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
          />

          {/* Cool Sunglasses for Chill Banana */}
          <g transform="translate(40, 38) rotate(15)">
            <rect x="0" y="0" width="16" height="10" rx="3" fill="#181425" stroke="#181425" strokeWidth="2" />
            <rect x="18" y="0" width="16" height="10" rx="3" fill="#181425" stroke="#181425" strokeWidth="2" />
            <line x1="14" y1="4" x2="20" y2="4" stroke="#181425" strokeWidth="3" />
            {/* White Reflection Bars */}
            <line x1="3" y1="2" x2="10" y2="8" stroke="#FFFFFF" strokeWidth="1.5" />
            <line x1="21" y1="2" x2="28" y2="8" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>

          {/* Smug / Chill Smile */}
          <path d="M48,58 Q55,64 62,56" fill="none" stroke="#181425" strokeWidth="3" strokeLinecap="round" />
          {/* Chill Thumbs Up Arm */}
          <path d="M38,58 Q30,58 26,52 Q28,48 32,50" fill="none" stroke="#181425" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'PARTY':
      /* MEGA PARTY MASCOT - Vibrant Neon Cyber Creature */
      return (
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 120 120" 
          className={`${isPartyAnimate} ${className}`}
          style={{ imageRendering: 'pixelated' }}
        >
          {/* Party Cone Hat */}
          <polygon points="60,6 44,40 76,40" fill="#FFD447" stroke="#181425" strokeWidth="4" />
          <circle cx="60" cy="6" r="5" fill="#FF007F" stroke="#181425" strokeWidth="2.5" />
          <line x1="48" y1="28" x2="72" y2="28" stroke="#FF007F" strokeWidth="3" />
          <line x1="53" y1="18" x2="67" y2="18" stroke="#43D9FF" strokeWidth="3" />

          {/* Main Neon Pink Body */}
          <path d="M25,85 C25,55 40,40 60,40 C80,40 95,55 95,85 C95,100 87,105 60,105 C33,105 25,100 25,85 Z" fill="#FF007F" stroke="#181425" strokeWidth="4" />
          <path d="M32,92 C42,101 78,101 88,92 C86,98 75,101 60,101 C45,101 34,98 32,92 Z" fill="#C3005D" />

          {/* Neon Visor Glasses */}
          <rect x="35" y="52" width="50" height="15" rx="5" fill="#181425" stroke="#FFD447" strokeWidth="4" />
          <line x1="40" y1="58" x2="52" y2="58" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          <line x1="57" y1="58" x2="70" y2="58" stroke="#43D9FF" strokeWidth="3" strokeLinecap="round" />
          
          {/* Big Smile with Lime Tongue */}
          <path d="M45,74 C45,86 75,86 75,74 Z" fill="#181425" stroke="#181425" strokeWidth="2" />
          <path d="M52,80 C54,82 66,82 68,80 Z" fill="#9CFF57" />
          <polygon points="49,74 52,77 55,74" fill="#FFFFFF" />
          <polygon points="65,74 68,77 71,74" fill="#FFFFFF" />
        </svg>
      );
  }
};

