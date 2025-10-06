import React, { useEffect } from 'react';
import { MEWP } from '../types';
import { CloseIcon, ResetIcon } from './icons';

type MewpWithOptionalId = MEWP & { id?: any };

interface ComparisonModalProps {
  mewps: MewpWithOptionalId[];
  onClose: () => void;
  onRemove: (mewp: MewpWithOptionalId) => void;
  onClear: () => void;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ mewps, onClose, onRemove, onClear }) => {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
        document.body.style.overflow = originalStyle;
    };
  }, []);
  
  if (mewps.length === 0) {
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
    if (key.endsWith('_m')) label += ' M';
    if (key.endsWith('_kg')) label += ' Kg';
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
    if (mewps.length === 0) return false;
    const firstValue = mewps.find(m => m[prop] !== null && m[prop] !== undefined)?.[prop];
    return typeof firstValue === 'number';
  };
  
  const getComparisonStats = (prop: keyof MEWP) => {
    const values = mewps
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
    <div className="fixed inset-0 bg-slate-900/95 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl w-full max-w-7xl h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-slate-100">Specification Comparison</h2>
            <span className="ml-4 bg-slate-700 text-slate-300 text-xs font-medium px-2.5 py-0.5 rounded-full">Preview</span>
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
            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700 transition-colors"
              aria-label="Close comparison modal"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="flex-grow overflow-y-auto p-6">
          <div className="space-y-8">
            {properties.map(prop => {
              const isNum = isNumeric(prop);
              const { max, min } = isNum ? getComparisonStats(prop) : { max: null, min: null };
              const isHigherBetter = higherIsBetter[prop] !== false;
              
              const bestValue = (min === null || max === null) ? null : isHigherBetter ? max : min;
              const worstValue = (min === null || max === null) ? null : isHigherBetter ? min : max;

              if (mewps.every(m => m[prop] === null || m[prop] === undefined)) {
                return null;
              }

              return (
                <div key={prop}>
                  <h3 className="text-xl font-bold text-slate-200 mb-4">{formatLabel(prop)}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {mewps.map((mewp, index) => {
                      const rawValue = mewp[prop];
                      const valueForCalc = (prop === 'negative_reach' && typeof rawValue === 'number') ? Math.abs(rawValue) : rawValue;
                      
                      let borderColor = 'border-slate-700';
                      let valueColor = 'text-slate-100';
                      
                      if (isNum && typeof valueForCalc === 'number' && bestValue !== null) {
                        if (max === min) {
                           borderColor = 'border-green-500';
                           valueColor = 'text-green-500';
                        } else if (valueForCalc === bestValue) {
                           borderColor = 'border-green-500';
                           valueColor = 'text-green-500';
                        } else if (valueForCalc === worstValue) {
                           borderColor = 'border-red-500';
                           valueColor = 'text-red-500';
                        }
                      }
                      
                      const displayValue = rawValue === null || rawValue === undefined ? 'N/A' : String(rawValue);

                      return (
                        <div key={mewp.id ?? index} className={`bg-slate-800 border-2 rounded-lg p-4 flex flex-col justify-between relative ${borderColor} transition-colors min-h-[140px]`}>
                           <button onClick={() => onRemove(mewp)} className="absolute top-2 right-2 text-slate-500 hover:text-red-500 z-10" aria-label={`Remove ${mewp.model}`}>
                                <CloseIcon className="w-4 h-4" />
                           </button>
                           <div>
                               <p className="text-sm text-slate-400">{mewp.manufacturer}</p>
                               <p className="text-base font-bold text-slate-100">{mewp.model}</p>
                           </div>
                           <p className={`font-bold ${isNum ? 'text-5xl' : 'text-xl'} ${valueColor}`}>
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
    </div>
  );
};

export default ComparisonModal;