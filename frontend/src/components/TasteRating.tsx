import React from 'react';
import { Star } from 'lucide-react';

export interface TasteLevel {
  rating: number;
  emoji: string;
  label: string;
  headline: string;
  bgLight: string;
  textColor: string;
  borderColor: string;
  glowColor: string;
}

export const TASTE_LEVELS: Record<number, TasteLevel> = {
  5: {
    rating: 5,
    emoji: '🤤',
    label: 'Mind-Blowing',
    headline: 'Chef\'s Masterpiece (Heavenly Taste)',
    bgLight: 'bg-amber-500/10',
    textColor: 'text-amber-500',
    borderColor: 'border-amber-500/30',
    glowColor: 'shadow-amber-500/20',
  },
  4: {
    rating: 4,
    emoji: '😋',
    label: 'Super Tasty',
    headline: 'Delicious & Aromatic',
    bgLight: 'bg-orange-500/10',
    textColor: 'text-orange-500',
    borderColor: 'border-orange-500/30',
    glowColor: 'shadow-orange-500/20',
  },
  3: {
    rating: 3,
    emoji: '😊',
    label: 'Good Flavor',
    headline: 'Pleasant & Satisfying',
    bgLight: 'bg-emerald-500/10',
    textColor: 'text-emerald-500',
    borderColor: 'border-emerald-500/30',
    glowColor: 'shadow-emerald-500/20',
  },
  2: {
    rating: 2,
    emoji: '😐',
    label: 'Just Okay',
    headline: 'Average Taste',
    bgLight: 'bg-yellow-500/10',
    textColor: 'text-yellow-600',
    borderColor: 'border-yellow-500/30',
    glowColor: 'shadow-yellow-500/20',
  },
  1: {
    rating: 1,
    emoji: '😕',
    label: 'Needs Work',
    headline: 'Needs More Spice & Flavor',
    bgLight: 'bg-rose-500/10',
    textColor: 'text-rose-500',
    borderColor: 'border-rose-500/30',
    glowColor: 'shadow-rose-500/20',
  },
};

/**
 * Returns the corresponding TasteLevel metadata based on a numerical rating (1.0 to 5.0)
 */
export const getTasteLevel = (rating: number): TasteLevel => {
  const rounded = Math.round(rating);
  const clamped = Math.max(1, Math.min(5, rounded));
  return TASTE_LEVELS[clamped] || TASTE_LEVELS[5];
};

interface TasteRatingBadgeProps {
  rating: number;
  showScore?: boolean;
  showLabel?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export const TasteRatingBadge: React.FC<TasteRatingBadgeProps> = ({
  rating,
  showScore = true,
  showLabel = false,
  size = 'sm',
  className = '',
  onClick,
}) => {
  const level = getTasteLevel(rating);

  const sizeStyles = {
    xs: {
      container: 'px-1.5 py-0.5 text-[10px] gap-1 rounded-md',
      emoji: 'text-xs',
      star: 'w-2.5 h-2.5',
    },
    sm: {
      container: 'px-2 py-0.5 text-xs gap-1.5 rounded-lg',
      emoji: 'text-sm',
      star: 'w-3 h-3',
    },
    md: {
      container: 'px-3 py-1 text-xs gap-2 rounded-xl',
      emoji: 'text-base',
      star: 'w-3.5 h-3.5',
    },
    lg: {
      container: 'px-4 py-2 text-sm gap-2.5 rounded-2xl',
      emoji: 'text-xl',
      star: 'w-4 h-4',
    },
  }[size];

  return (
    <div
      onClick={onClick}
      title={`${level.emoji} Taste Rating: ${rating.toFixed(1)}/5.0 (${level.label})`}
      className={`inline-flex items-center font-extrabold border transition-all ${level.bgLight} ${level.textColor} ${level.borderColor} ${level.glowColor} ${sizeStyles.container} ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95 shadow-sm' : ''
      } ${className}`}
    >
      <span className={`leading-none select-none transition-transform hover:scale-125 ${sizeStyles.emoji}`}>
        {level.emoji}
      </span>
      {showScore && (
        <span className="flex items-center gap-0.5 font-black tracking-tight">
          <Star className={`${sizeStyles.star} fill-current`} />
          <span>{Number(rating).toFixed(1)}</span>
        </span>
      )}
      {showLabel && (
        <span className="opacity-90 font-bold border-l pl-1.5 border-current/20 hidden sm:inline">
          {level.label}
        </span>
      )}
    </div>
  );
};

interface TasteEmojiSelectorProps {
  value: number;
  onChange: (rating: number) => void;
}

export const TasteEmojiSelector: React.FC<TasteEmojiSelectorProps> = ({ value, onChange }) => {
  const currentLevel = getTasteLevel(value);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          How did it taste? Select your Taste Emoji:
        </label>
        <span className={`text-xs font-black flex items-center gap-1 ${currentLevel.textColor}`}>
          <span>{currentLevel.emoji}</span>
          <span>{currentLevel.label} ({value}.0/5)</span>
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
        {[1, 2, 3, 4, 5].map((star) => {
          const item = TASTE_LEVELS[star];
          const isSelected = value === star;

          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all group cursor-pointer ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 shadow-md scale-105 ring-2 ring-orange-500 border border-orange-200'
                  : 'hover:bg-white/60 dark:hover:bg-slate-700/50 opacity-70 hover:opacity-100'
              }`}
            >
              <span className={`text-2xl sm:text-3xl transition-transform group-hover:scale-125 ${
                isSelected ? 'scale-110 animate-bounce' : ''
              }`}>
                {item.emoji}
              </span>
              <span className={`text-[10px] font-bold mt-1 text-center line-clamp-1 ${
                isSelected ? 'text-orange-600 dark:text-orange-400 font-extrabold' : 'text-slate-500'
              }`}>
                {item.label}
              </span>
              <div className="flex items-center gap-0.5 mt-0.5">
                {[...Array(star)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-2 h-2 ${isSelected ? 'fill-amber-400 text-amber-400' : 'fill-slate-300 text-slate-300'}`}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-500 italic text-center">
        "{currentLevel.headline}"
      </p>
    </div>
  );
};

