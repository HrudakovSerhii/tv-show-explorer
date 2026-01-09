'use client';

import React, { useState } from 'react';

interface RatingControlProps {
  initialRating?: number;
  label?: string;
  onChange?: (rating: number) => void;
}

const RatingControl: React.FC<RatingControlProps> = ({
  initialRating = 0,
  label = 'Rate this',
  onChange,
}) => {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-100">
      <span className="font-weight-semibold text-text-subtlest text-xs tracking-wider uppercase">
        {label}
      </span>
      <div className="flex items-center gap-50">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <button
            key={star}
            type="button"
            className="transition-transform hover:scale-125 focus:outline-none"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onChange?.(star)}
          >
            <span
              className={`material-symbols-outlined !text-mb ${
                star <= (hover || initialRating)
                  ? '!fill-1 text-icon-accent-yellow'
                  : 'text-icon-disabled'
              }`}
            >
              star
            </span>
          </button>
        ))}
        {initialRating > 0 && (
          <span className="font-weight-bold text-text ml-100 text-sm">{initialRating}/10</span>
        )}
      </div>
    </div>
  );
};

export function RatingControlSkeleton({ label = 'Rate this' }: { label?: string }) {
  return (
    <div id="RatingControlSkeleton" className="flex flex-col gap-100">
      <span className="font-weight-semibold text-text-subtlest text-xs tracking-wider uppercase">
        {label}
      </span>
      <div className="flex items-center gap-50 pb-100">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <div key={star} className="flex items-center justify-center">
            <span className="material-symbols-outlined text-icon-disabled !text-mb animate-pulse">
              star
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RatingControl;
