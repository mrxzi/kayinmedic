import React from 'react';

interface BristolStoolVisualProps {
  type: number;
  isSelected?: boolean;
}

export const BristolStoolVisual: React.FC<BristolStoolVisualProps> = ({ type, isSelected }) => {
  // Clear, distinct color contrast
  // If selected: crisp pure white (#FFFFFF)
  // If unselected:
  // - Types 1-2 (Konstipasi): Amber/Brown (#92400E)
  // - Types 3-4 (Ideal/Normal): Emerald (#059669)
  // - Types 5-7 (Diare): Alert Red (#DC2626)
  const getColors = () => {
    if (isSelected) {
      return {
        fill: '#FFFFFF',
        stroke: '#FFFFFF',
        accent: 'rgba(255, 255, 255, 0.45)',
      };
    }
    if (type <= 2) {
      return {
        fill: '#854D0E', // Amber-800
        stroke: '#713F12',
        accent: '#CA8A04',
      };
    }
    if (type <= 4) {
      return {
        fill: '#059669', // Emerald-600
        stroke: '#047857',
        accent: '#34D399',
      };
    }
    return {
      fill: '#DC2626', // Red-600
        stroke: '#B91C1C',
        accent: '#F87171',
    };
  };

  const { fill, stroke, accent } = getColors();
  
  return (
    <div className="w-12 h-12 flex items-center justify-center shrink-0">
      {type === 1 && (
        <svg viewBox="0 0 48 48" className="w-9 h-9">
          <circle cx="14" cy="16" r="5.5" fill={fill} stroke={stroke} strokeWidth="1" />
          <circle cx="32" cy="14" r="4.5" fill={fill} stroke={stroke} strokeWidth="1" />
          <circle cx="18" cy="32" r="5" fill={fill} stroke={stroke} strokeWidth="1" />
          <circle cx="34" cy="30" r="6" fill={fill} stroke={stroke} strokeWidth="1" />
          <circle cx="24" cy="22" r="3.5" fill={fill} stroke={stroke} strokeWidth="1" />
        </svg>
      )}

      {type === 2 && (
        <svg viewBox="0 0 48 48" className="w-9 h-9">
          <path
            d="M8,24 C8,18 14,16 18,17 C22,15 26,17 30,16 C36,15 40,20 40,24 C40,28 35,32 30,31 C25,33 21,31 17,32 C12,33 8,30 8,24 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.2"
          />
          <circle cx="16" cy="23" r="2.5" fill={accent} />
          <circle cx="26" cy="22" r="3" fill={accent} />
          <circle cx="34" cy="24" r="2" fill={accent} />
        </svg>
      )}

      {type === 3 && (
        <svg viewBox="0 0 48 48" className="w-9 h-9">
          <path
            d="M6,24 C6,18 12,17 24,17 C36,17 42,18 42,24 C42,30 36,31 24,31 C12,31 6,30 6,24 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.2"
          />
          <path d="M16 19 L18 29" stroke={accent} strokeWidth="2" strokeLinecap="round" />
          <path d="M26 18 L24 30" stroke={accent} strokeWidth="2" strokeLinecap="round" />
          <path d="M34 19 L33 28" stroke={accent} strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}

      {type === 4 && (
        <svg viewBox="0 0 48 48" className="w-9 h-9">
          <path
            d="M6,25 C6,18 14,18 20,22 C26,26 32,26 38,22 C42,19 44,24 41,27 C35,33 29,29 23,25 C17,21 11,23 7,27 C6,26 6,25 6,25 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.2"
          />
        </svg>
      )}

      {type === 5 && (
        <svg viewBox="0 0 48 48" className="w-9 h-9">
          <path d="M10,18 C13,14 18,15 19,19 C20,23 15,25 11,23 C9,22 8,20 10,18 Z" fill={fill} stroke={stroke} strokeWidth="1" />
          <path d="M25,14 C29,11 34,13 36,17 C37,21 33,24 29,22 C26,21 24,17 25,14 Z" fill={fill} stroke={stroke} strokeWidth="1" />
          <path d="M17,28 C21,25 27,27 28,31 C29,35 23,38 19,36 C15,35 15,31 17,28 Z" fill={fill} stroke={stroke} strokeWidth="1" />
          <path d="M32,27 C35,25 39,26 40,30 C41,33 37,36 34,34 C31,33 31,29 32,27 Z" fill={fill} stroke={stroke} strokeWidth="1" />
        </svg>
      )}

      {type === 6 && (
        <svg viewBox="0 0 48 48" className="w-9 h-9">
          <path
            d="M8,26 C6,22 10,18 15,19 C18,17 23,17 25,20 C28,18 34,19 36,22 C39,21 42,24 41,28 C40,32 35,33 32,32 C29,35 24,35 20,33 C16,36 11,34 9,30 C7,29 7,27 8,26 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.2"
          />
          <circle cx="12" cy="14" r="2.5" fill={fill} />
          <circle cx="38" cy="15" r="3" fill={fill} />
          <circle cx="25" cy="38" r="2" fill={fill} />
        </svg>
      )}

      {type === 7 && (
        <svg viewBox="0 0 48 48" className="w-9 h-9">
          <ellipse cx="24" cy="32" rx="17" ry="7.5" fill={fill} stroke={stroke} strokeWidth="1.2" />
          <circle cx="14" cy="18" r="3" fill={fill} />
          <circle cx="24" cy="12" r="3.5" fill={fill} />
          <circle cx="33" cy="17" r="3" fill={fill} />
          <path d="M24 16 L24 24" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
};