
import React from 'react';
import { MEWP } from '../types';
import { InfoIcon, WorkingHeightIcon, OutreachIcon, CapacityIcon, WeightIcon, NegativeReachIcon, StowedWidthIcon, CheckIcon, CompareIcon } from './icons';

type MewpWithId = MEWP & { id: string; usps: string[] };

const MewpCard: React.FC<{
  mewp: MewpWithId;
  onCompare: (mewp: MewpWithId) => void;
  onDetails: (mewp: MewpWithId) => void;
  isComparing: boolean;
}> = ({ mewp, onCompare, onDetails, isComparing }) => {
  const StatItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number; unit: string }> = ({ icon, label, value, unit }) => (
    <div>
      <div className="flex items-center text-xs text-slate-400">
        {icon}
        <span className="ml-1.5">{label}</span>
      </div>
      <p className="text-slate-100 font-semibold mt-0.5">{value}{unit}</p>
    </div>
  );

  return (
    <div
      className={`bg-slate-800 border rounded-lg shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-cyan-500/10 hover:border-slate-600 ${isComparing ? 'border-teal-400' : 'border-slate-700'}`}
    >
      <div className="p-5 flex-grow">
        <p className="text-xs font-semibold text-teal-400 uppercase tracking-wider">{mewp.manufacturer}</p>
        <h3 className="text-lg font-bold text-slate-100 mt-1">{mewp.model}</h3>
        <p className="text-sm text-slate-400">{mewp.mewp_type} &bull; {mewp.boom_type}</p>

        <div className="mt-4 grid grid-cols-2 gap-y-4 gap-x-2">
            <StatItem icon={<WorkingHeightIcon className="w-4 h-4" />} label="Working Height" value={mewp.working_height_m} unit="m" />
            <StatItem icon={<OutreachIcon className="w-4 h-4" />} label="Outreach" value={mewp.horizontal_outreach_m} unit="m" />
            <StatItem icon={<CapacityIcon className="w-4 h-4" />} label="Capacity" value={mewp.lifting_capacity_kg} unit="kg" />
            <StatItem icon={<WeightIcon className="w-4 h-4" />} label="Weight" value={mewp.weight_kg} unit="kg" />
            {mewp.stowed_width_m != null && <StatItem icon={<StowedWidthIcon className="w-4 h-4" />} label="Stowed Width" value={mewp.stowed_width_m} unit="m" />}
            {mewp.negative_reach !== 0 && <StatItem icon={<NegativeReachIcon className="w-4 h-4" />} label="Negative Reach" value={Math.abs(mewp.negative_reach)} unit="m" />}
        </div>
      </div>
      <div className="p-4 bg-slate-800/50 border-t border-slate-700/50 flex items-center space-x-2">
          <button onClick={() => onDetails(mewp)} className="flex-1 flex items-center justify-center text-xs font-semibold text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-md px-3 py-2 transition-colors">
              <InfoIcon className="w-4 h-4 mr-2" /> Details
          </button>
          <button 
              onClick={() => onCompare(mewp)}
              className={`flex-1 flex items-center justify-center text-xs font-semibold rounded-md px-3 py-2 transition-colors ${
                  isComparing 
                      ? 'bg-teal-500/20 text-teal-300 hover:bg-teal-500/30'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
          >
              {isComparing ? (
                  <>
                      <CheckIcon className="w-4 h-4 mr-2" /> Added
                  </>
              ) : (
                  <>
                      <CompareIcon className="w-4 h-4 mr-2" /> Compare
                  </>
              )}
          </button>
      </div>
    </div>
  );
};

export default MewpCard;
