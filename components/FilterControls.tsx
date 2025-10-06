import React from 'react';
import { MEWP } from '../types';

interface FilterControlsProps {
  mewps: MEWP[];
  filters: any;
  setFilters: (filters: any) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ 
    mewps, 
    filters, 
    setFilters,
}) => {
  const mewpTypes = [...new Set(mewps.map(m => m.mewp_type))].sort();
  const boomTypes = [...new Set(mewps.map(m => m.boom_type))].sort();

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    const currentValues = filters[name] || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((item: string) => item !== value);
    setFilters({ ...filters, [name]: newValues });
  };
  
  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name.substring(0, name.lastIndexOf('_'));
    const boundaryName = name.substring(name.lastIndexOf('_') + 1);

    setFilters({
      ...filters,
      [fieldName]: {
        ...filters[fieldName],
        [boundaryName]: value ? Number(value) : undefined,
      },
    });
  };
  
  const commonInputStyles = "block w-full text-sm bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-teal-500 transition-shadow text-slate-200 placeholder-slate-400";

  return (
    <div className="space-y-6">
        {/* MEWP Type Filters */}
        <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-3">MEWP Type</h3>
            <div className="space-y-2">
                {mewpTypes.map(type => (
                    <label key={type} className="flex items-center space-x-3 text-sm text-slate-300 cursor-pointer">
                        <input 
                            type="checkbox" 
                            name="mewp_type" 
                            value={type} 
                            checked={filters.mewp_type?.includes(type) || false}
                            onChange={handleCheckboxChange}
                            className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-teal-500 focus:ring-teal-500"
                        />
                        <span>{type}</span>
                    </label>
                ))}
            </div>
        </div>

        {/* Boom Type Filters */}
        <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Boom Type</h3>
            <div className="space-y-2">
                {boomTypes.map(type => (
                    <label key={type} className="flex items-center space-x-3 text-sm text-slate-300 cursor-pointer">
                        <input 
                            type="checkbox" 
                            name="boom_type" 
                            value={type} 
                            checked={filters.boom_type?.includes(type) || false}
                            onChange={handleCheckboxChange}
                            className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-teal-500 focus:ring-teal-500"
                        />
                        <span>{type}</span>
                    </label>
                ))}
            </div>
        </div>

        {/* Specification Filters */}
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-semibold text-slate-200 mb-3">Working Height (m)</label>
                <div className="flex space-x-2">
                    <input type="number" name="working_height_m_min" value={filters.working_height_m?.min || ''} onChange={handleRangeChange} placeholder="Min" className={commonInputStyles} />
                    <input type="number" name="working_height_m_max" value={filters.working_height_m?.max || ''} onChange={handleRangeChange} placeholder="Max" className={commonInputStyles} />
                </div>
            </div>
            <div>
                <label className="block text-sm font-semibold text-slate-200 mb-3">Horizontal Outreach (m)</label>
                <div className="flex space-x-2">
                    <input type="number" name="horizontal_outreach_m_min" value={filters.horizontal_outreach_m?.min || ''} onChange={handleRangeChange} placeholder="Min" className={commonInputStyles} />
                    <input type="number" name="horizontal_outreach_m_max" value={filters.horizontal_outreach_m?.max || ''} onChange={handleRangeChange} placeholder="Max" className={commonInputStyles} />
                </div>
            </div>
            <div>
                <label className="block text-sm font-semibold text-slate-200 mb-3">Weight (kg)</label>
                <div className="flex space-x-2">
                    <input type="number" name="weight_kg_min" value={filters.weight_kg?.min || ''} onChange={handleRangeChange} placeholder="Min" className={commonInputStyles} />
                    <input type="number" name="weight_kg_max" value={filters.weight_kg?.max || ''} onChange={handleRangeChange} placeholder="Max" className={commonInputStyles} />
                </div>
            </div>
            <div>
                <label className="block text-sm font-semibold text-slate-200 mb-3">Stowed Width (m)</label>
                <div className="flex space-x-2">
                    <input type="number" name="stowed_width_m_min" value={filters.stowed_width_m?.min || ''} onChange={handleRangeChange} placeholder="Min" className={commonInputStyles} />
                    <input type="number" name="stowed_width_m_max" value={filters.stowed_width_m?.max || ''} onChange={handleRangeChange} placeholder="Max" className={commonInputStyles} />
                </div>
            </div>
        </div>
    </div>
  );
};

export default FilterControls;