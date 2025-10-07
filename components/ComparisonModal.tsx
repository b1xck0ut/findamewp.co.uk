
import React, { useMemo } from 'react';
import { MEWP } from '../types';
import { CloseIcon, ResetIcon, ArrowLeftIcon } from './icons';

type MewpWithOptionalId = MEWP & { id?: any };

interface ComparisonViewProps {
  mewps: MewpWithOptionalId[];
  onClose: () => void; // Becomes onBack
  onRemove: (mewp: MewpWithOptionalId) => void;
  onClear: () => void;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ mewps, onClose, onRemove, onClear }) => {
  const sortedMewps = useMemo(() =>
    [...mewps].sort((a, b) => a.working_height_m - b.working_height_m),
    [mewps]
  );

  if (sortedMewps.length === 0) {
    onClose();
    return null;
  }

  const properties: (keyof MEWP)[] = [
    'working_height_m', 'horizontal_outreach_m', 'lifting_capacity_kg', 
    'weight_kg', 'negative_reach', 'stowed_height_m', 'stowed_width_m',
    'stowed_length_with_basket_m', 
    'fully_jacked_width_m', 'one_side_narrow_jacked_m', 'narrow_jacked_width_m',
    'mewp_type', 'boom_type', 'fuel_type', 
  ];

  const formatLabel = (key: string) => {
    let label = key.replace(/_m$/, '').replace(/_kg$/, '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    if (key.endsWith('_m')) label += ' (m)';
    if (key.endsWith('_kg')) label += ' (kg)';
    return label;
  };
  
  const higherIsBetter: Record<string, boolean> = {
    'working_height_m': true,
    'horizontal_outreach_m': true,
    'lifting_capacity_kg': true,
    'negative_reach': true, 
    'weight_kg': false,
    'stowed_height_m': false,
    'stowed_width_m': false,
    'stowed_length_with_basket_m': false,
    'fully_jacked_width_m': false,
    'one_side_narrow_jacked_m': false,
    'narrow_jacked_width_m': false,
  };

  const isNumeric = (prop: keyof MEWP) => {
    if (sortedMewps.length === 0) return false;
    const firstValue = sortedMewps.find(m => m[prop] !== null && m[prop] !== undefined)?.[prop];
    return typeof firstValue === 'number';
  };
  
  const getComparisonStats = (prop: keyof MEWP) => {
    const values = sortedMewps
      .map(m => {
        let val = m[prop];
        if (prop === 'negative_reach' && typeof val === 'number') {
            val = Math.abs(val);
        }
        return typeof val === 'number' ? val : null;
      })
      .filter((v): v is number => v !== null && !isNaN(v));

    if (values.length < 2) return { max: null, min: null };

    const max = Math.max(...values);
    const min = Math.min(...values);
    return { max, min };
  };

  return (
    <div className="bg-slate-900 w-full h-full flex flex-col">
      <header className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0 sticky top-0 bg-slate-900/80 backdrop-blur-sm z-10">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onClose} 
            className="flex items-center text-sm font-medium text-slate-300 hover:text-white transition-colors p-2 rounded-md hover:bg-slate-700"
            aria-label="Back to list"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back
          </button>
          <h2 className="text-xl font-bold text-slate-100">Specification Comparison</h2>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={onClear} 
            className="flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors"
            aria-label="Clear all items from comparison"
          >
            <ResetIcon className="w-4 h-4 mr-2" />
            Clear All
          </button>
        </div>
      </header>
      
      <div className="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-8">
          {properties.map(prop => {
            const isNum = isNumeric(prop);
            const { max, min } = isNum ? getComparisonStats(prop) : { max: null, min: null };
            const isHigherBetter = higherIsBetter[prop] !== false;
            
            const bestValue = (min === null || max === null) ? null : isHigherBetter ? max : min;
            const worstValue = (min === null || max === null) ? null : isHigherBetter ? min : max;

            if (sortedMewps.every(m => m[prop] === null || m[prop] === undefined)) {
              return null;
            }

            return (
              <div key={prop}>
                <h3 className="text-xl font-bold text-slate-200 mb-4">{formatLabel(prop)}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {sortedMewps.map((mewp, index) => {
                    const rawValue = mewp[prop];
                    const valueForCalc = (prop === 'negative_reach' && typeof rawValue === 'number') ? Math.abs(rawValue) : rawValue;
                    
                    let borderColor = 'border-slate-700';
                    let valueColor = 'text-slate-100';
                    
                    if (isNum && typeof valueForCalc === 'number' && bestValue !== null) {
                      if (max === min) {
                         borderColor = 'border-teal-500/50';
                         valueColor = 'text-teal-400';
                      } else if (valueForCalc === bestValue) {
                         borderColor = 'border-green-500/50';
                         valueColor = 'text-green-400';
                      } else if (valueForCalc === worstValue) {
                         borderColor = 'border-red-500/50';
                         valueColor = 'text-red-400';
                      }
                    }
                    
                    const displayValue = rawValue === null || rawValue === undefined ? 'N/A' : String(rawValue);

                    return (
                      <div key={mewp.id ?? index} className={`bg-slate-800 border rounded-lg p-4 flex flex-col justify-between relative ${borderColor} transition-colors min-h-[140px] shadow-lg`}>
                         <button onClick={() => onRemove(mewp)} className="absolute top-2 right-2 text-slate-500 hover:text-red-500 z-10 p-1 hover:bg-slate-700 rounded-full" aria-label={`Remove ${mewp.model}`}>
                              <CloseIcon className="w-4 h-4" />
                         </button>
                         <div>
                             <p className="text-sm text-slate-400">{mewp.manufacturer}</p>
                             <p className="text-base font-bold text-slate-100">{mewp.model}</p>
                         </div>
                         <p className={`font-bold ${isNum ? 'text-4xl md:text-5xl' : 'text-xl'} ${valueColor}`}>
                           {displayValue}
                         </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;
