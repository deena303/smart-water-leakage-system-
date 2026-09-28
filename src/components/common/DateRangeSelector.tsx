import React from 'react';

interface DateRangeSelectorProps {
  activeRange: 'Today' | '7 Days' | '30 Days';
  onChange: (range: 'Today' | '7 Days' | '30 Days') => void;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ activeRange, onChange }) => {
  const ranges: ('Today' | '7 Days' | '30 Days')[] = ['Today', '7 Days', '30 Days'];

  return (
    <div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-100/90 p-1 text-xs font-medium text-slate-600 shadow-2xs">
      {ranges.map((range) => {
        const isActive = activeRange === range;
        return (
          <button
            key={range}
            type="button"
            onClick={() => onChange(range)}
            className={`rounded-md px-3 py-1.5 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-cyan-600 ${
              isActive
                ? 'bg-white font-semibold text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {range}
          </button>
        );
      })}
    </div>
  );
};
