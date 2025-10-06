
import React, { useState, useMemo } from 'react';
import { mewpData } from '../data/mewpData';
import { uspData } from '../data/uspData';
import { MEWP } from '../types';
import FilterSidebar from './FilterSidebar';
import ComparisonModal from './ComparisonModal';
import MewpDetailsModal from './MewpDetailsModal';
import MewpCard from './MewpCard';
import { FilterIcon, CompareIcon, XCircleIcon } from './icons';

type MewpWithId = MEWP & { id: string; usps: string[] };

type RangeFilter = { min: number | undefined; max: number | undefined };
interface Filters {
    mewp_type: string[];
    boom_type: string[];
    working_height_m: RangeFilter;
    horizontal_outreach_m: RangeFilter;
    weight_kg: RangeFilter;
    stowed_width_m: RangeFilter;
}

const initialFilters: Filters = {
    mewp_type: [],
    boom_type: [],
    working_height_m: { min: undefined, max: undefined },
    horizontal_outreach_m: { min: undefined, max: undefined },
    weight_kg: { min: undefined, max: undefined },
    stowed_width_m: { min: undefined, max: undefined },
};

const MewpFinder: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState<Filters>(initialFilters);
    const [comparisonList, setComparisonList] = useState<MewpWithId[]>([]);
    const [selectedMewp, setSelectedMewp] = useState<MewpWithId | null>(null);
    const [isFilterSidebarOpen, setFilterSidebarOpen] = useState(false);
    const [isComparisonModalOpen, setComparisonModalOpen] = useState(false);

    const combinedMewpData: MewpWithId[] = useMemo(() => {
        return mewpData.map((mewp, index) => {
            const key = `${mewp.manufacturer.toUpperCase()}_${mewp.model.toUpperCase().replace(/[\s/.-]/g, '')}`;
            const id = `${mewp.manufacturer}-${mewp.model}-${index}`;
            return {
                ...mewp,
                id,
                usps: uspData[key] || [],
            };
        });
    }, []);

    const filteredMewps = useMemo(() => {
        return combinedMewpData.filter(mewp => {
            const searchMatch = searchTerm.toLowerCase() === '' ||
                mewp.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                mewp.model.toLowerCase().includes(searchTerm.toLowerCase());

            const mewpTypeMatch = filters.mewp_type.length === 0 || filters.mewp_type.includes(mewp.mewp_type);
            const boomTypeMatch = filters.boom_type.length === 0 || filters.boom_type.includes(mewp.boom_type);

            const checkRange = (value: number | null | undefined, range: { min?: number, max?: number }) => {
                if (value === null || value === undefined) return true;
                const min = range.min ?? -Infinity;
                const max = range.max ?? Infinity;
                return value >= min && value <= max;
            };

            const workingHeightMatch = checkRange(mewp.working_height_m, filters.working_height_m);
            const outreachMatch = checkRange(mewp.horizontal_outreach_m, filters.horizontal_outreach_m);
            const weightMatch = checkRange(mewp.weight_kg, filters.weight_kg);
            const stowedWidthMatch = checkRange(mewp.stowed_width_m, filters.stowed_width_m);

            return searchMatch && mewpTypeMatch && boomTypeMatch && workingHeightMatch && outreachMatch && weightMatch && stowedWidthMatch;
        });
    }, [searchTerm, filters, combinedMewpData]);

    const resetFilters = () => {
        setFilters(initialFilters);
        setSearchTerm('');
    };
    
    const handleCompare = (mewp: MewpWithId) => {
        setComparisonList(prev =>
            prev.some(item => item.id === mewp.id)
                ? prev.filter(item => item.id !== mewp.id)
                : [...prev, mewp]
        );
    };
    
    const handleClearComparison = () => {
        setComparisonList([]);
    };

    return (
        <div className="flex h-full">
            <FilterSidebar 
                mewps={combinedMewpData} 
                filters={filters}
                setFilters={setFilters}
                resetFilters={resetFilters}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                isOpen={isFilterSidebarOpen}
                onClose={() => setFilterSidebarOpen(false)}
            />
            <div className={`flex-grow transition-all duration-300 ease-in-out ${isFilterSidebarOpen ? 'ml-80' : 'ml-0'}`}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <button 
                        onClick={() => setFilterSidebarOpen(true)}
                        className="fixed top-4 left-4 z-30 inline-flex items-center p-3 bg-slate-800 border border-slate-700 rounded-full text-slate-300 shadow-lg hover:bg-slate-700 transition-colors"
                        aria-label="Open filters"
                    >
                        <FilterIcon className="w-5 h-5" />
                    </button>
                    
                    <div className="mb-6 grid grid-cols-3 items-center pt-8">
                        <div></div> {/* Spacer */}
                        <div className="text-center">
                            <h2 className="text-3xl font-extrabold tracking-tight inline-block bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500">
                                MEWP Finder
                            </h2>
                        </div>
                        <div className="text-right">
                            <span className="text-sm font-medium text-slate-400">{filteredMewps.length} machines found</span>
                        </div>
                    </div>
                    
                    {filteredMewps.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredMewps.map(mewp => (
                                <MewpCard
                                    key={mewp.id}
                                    mewp={mewp}
                                    onCompare={handleCompare}
                                    onDetails={setSelectedMewp}
                                    isComparing={comparisonList.some(item => item.id === mewp.id)}
                                />
                            ))}
                        </div>
                    ) : (
                         <div className="text-center py-16">
                            <h3 className="text-xl font-semibold text-slate-200">No Machines Found</h3>
                            <p className="text-slate-400 mt-2">Try adjusting your search or filters.</p>
                            <button onClick={resetFilters} className="mt-4 px-4 py-2 bg-teal-500/20 text-teal-300 rounded-md text-sm font-semibold hover:bg-teal-500/30">
                                Reset Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {isComparisonModalOpen && (
                <ComparisonModal
                    mewps={comparisonList}
                    onClose={() => setComparisonModalOpen(false)}
                    onRemove={handleCompare}
                    onClear={handleClearComparison}
                />
            )}
            {selectedMewp && (
                <MewpDetailsModal
                    mewp={selectedMewp}
                    onClose={() => setSelectedMewp(null)}
                />
            )}

            {comparisonList.length > 0 && (
                <div className="fixed bottom-8 right-8 z-30 flex items-center gap-3">
                    <button
                        onClick={() => setComparisonModalOpen(true)}
                        className="flex items-center justify-center px-6 py-3 bg-teal-400 text-white rounded-full font-bold shadow-lg shadow-teal-400/40 hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-teal-400 transform hover:scale-105 transition-all duration-300"
                    >
                        <CompareIcon className="w-5 h-5 mr-2" />
                        Compare ({comparisonList.length})
                    </button>
                    <button
                        onClick={handleClearComparison}
                        className="p-3 bg-slate-700/80 backdrop-blur-sm border border-slate-600 text-slate-300 rounded-full shadow-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500"
                        aria-label="Clear comparison list"
                    >
                        <XCircleIcon className="w-6 h-6" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default MewpFinder;