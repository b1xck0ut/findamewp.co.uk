import React from 'react';
import { MEWP } from '../types';
import { SearchIcon, CloseIcon, ResetIcon } from './icons';
import FilterControls from './FilterControls';

interface FilterSidebarProps {
  mewps: MEWP[];
  filters: any;
  setFilters: (filters: any) => void;
  resetFilters: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = (props) => {
  const { searchTerm, setSearchTerm, isOpen, onClose, filters, resetFilters, ...filterProps } = props;
  
  const hasActiveFilters = searchTerm || 
  Object.values(props.filters).some(value => {
      if (Array.isArray(value)) {
          return value.length > 0;
      }
      if (typeof value === 'object' && value !== null) {
          return Object.values(value).some(v => v !== undefined && v !== '');
      }
      return value !== undefined && value !== '';
  });

  return (
    <aside className={`w-80 flex-shrink-0 bg-slate-800 border-r border-slate-700 flex flex-col h-screen fixed top-0 left-0 z-40 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-4 border-b border-slate-700 flex flex-col gap-4 flex-shrink-0">
        <div className="relative flex justify-center items-center">
            <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500">
                MEWP Finder
            </h1>
            <button onClick={onClose} className="absolute right-0 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700 transition-colors" aria-label="Close filters">
                <CloseIcon className="w-6 h-6" />
            </button>
        </div>
        
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input 
                type="text"
                placeholder="Search by model or brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full text-sm bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 pl-11 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-teal-500 transition-shadow text-slate-200 placeholder-slate-400"
            />
        </div>
      </div>

      <div className="flex-grow p-6 flex flex-col overflow-hidden">
          <h2 className="text-xl font-bold text-slate-100 mb-4 flex-shrink-0">Filters</h2>
          
          <div className="flex-grow overflow-y-auto -mr-6 pr-6">
              <FilterControls {...filterProps} filters={filters} setFilters={props.setFilters} />
          </div>

          {hasActiveFilters && (
              <div className="pt-6 border-t border-slate-700 flex-shrink-0">
                  <button 
                      onClick={resetFilters} 
                      className="w-full flex items-center justify-center text-sm font-semibold text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 rounded-lg px-4 py-2.5 transition-colors"
                  >
                      <ResetIcon className="w-4 h-4 mr-2" />
                      Reset All Filters
                  </button>
              </div>
          )}
      </div>
    </aside>
  );
};

export default FilterSidebar;