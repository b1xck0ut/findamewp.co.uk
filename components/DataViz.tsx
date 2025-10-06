import React, { useState, useMemo } from 'react';
import { MEWP } from '../types';

interface DataVizProps {
  mewps: MEWP[];
}

const DataViz: React.FC<DataVizProps> = ({ mewps }) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const mewpTypes = useMemo(() => [...new Set(mewps.map(m => m.mewp_type))].sort(), [mewps]);

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const filteredMewps = useMemo(() => {
    return selectedTypes.length > 0
      ? mewps.filter(m => selectedTypes.includes(m.mewp_type))
      : mewps;
  }, [mewps, selectedTypes]);
  
  // Chart dimensions and scales
  const chartWidth = 800;
  const chartHeight = 500;
  const margin = { top: 20, right: 150, bottom: 60, left: 60 };
  const innerWidth = chartWidth - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;

  const maxHeight = Math.max(...mewps.map(m => m.working_height_m), 0);
  const maxOutreach = Math.max(...mewps.map(m => m.horizontal_outreach_m), 0);

  const xScale = (value: number) => (value / maxOutreach) * innerWidth;
  const yScale = (value: number) => innerHeight - (value / maxHeight) * innerHeight;
  
  const typeColors: Record<string, string> = {
    'Spider': '#34d399', // emerald-400
    'Truck': '#22d3ee', // cyan-400
    'Van Mount': '#f472b6', // pink-400
    'Underbridge': '#f59e0b', // amber-500
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-300">
      <h1 className="text-3xl font-bold text-slate-100 mb-2">MEWP Data Visualization</h1>
      <p className="text-slate-400 mb-8">Working Height vs. Horizontal Outreach</p>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <h3 className="font-semibold text-slate-100 mb-3">Filter by MEWP Type</h3>
          <div className="space-y-2">
            {mewpTypes.map(type => (
              <label key={type} className="flex items-center space-x-3 text-sm text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() => handleTypeToggle(type)}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-teal-500 focus:ring-teal-500"
                  style={{ accentColor: typeColors[type] || '#64748b' }}
                />
                <span style={{ color: typeColors[type] || 'inherit' }}>{type}</span>
              </label>
            ))}
             <button
              onClick={() => setSelectedTypes([])}
              className="text-xs text-slate-400 hover:text-white pt-2"
             >
              Clear selection
            </button>
          </div>
        </div>

        <div className="flex-grow">
          <svg width="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="bg-slate-800 rounded-lg">
            <g transform={`translate(${margin.left}, ${margin.top})`}>
              {/* Y Axis */}
              <line x1="0" y1="0" x2="0" y2={innerHeight} stroke="#475569" />
              <text x="-40" y={innerHeight / 2} transform={`rotate(-90, -40, ${innerHeight / 2})`} fill="#94a3b8" textAnchor="middle" fontSize="12">Working Height (m)</text>
              {[...Array(6)].map((_, i) => {
                  const y = (i / 5) * innerHeight;
                  const value = maxHeight * (1 - (i / 5));
                  return (
                      <g key={i}>
                          <line x1="-5" y1={y} x2="0" y2={y} stroke="#475569" />
                          <text x="-10" y={y + 4} fill="#94a3b8" textAnchor="end" fontSize="10">{value.toFixed(0)}</text>
                      </g>
                  );
              })}
              
              {/* X Axis */}
              <line x1="0" y1={innerHeight} x2={innerWidth} y2={innerHeight} stroke="#475569" />
              <text x={innerWidth/2} y={innerHeight + 40} fill="#94a3b8" textAnchor="middle" fontSize="12">Horizontal Outreach (m)</text>
              {[...Array(6)].map((_, i) => {
                  const x = (i / 5) * innerWidth;
                  const value = maxOutreach * (i / 5);
                   return (
                      <g key={i}>
                          <line x1={x} y1={innerHeight} x2={x} y2={innerHeight + 5} stroke="#475569" />
                          <text x={x} y={innerHeight + 20} fill="#94a3b8" textAnchor="middle" fontSize="10">{value.toFixed(0)}</text>
                      </g>
                  );
              })}

              {/* Data Points */}
              {filteredMewps.map((mewp, i) => (
                <circle
                  key={`${mewp.manufacturer}-${mewp.model}-${i}`}
                  cx={xScale(mewp.horizontal_outreach_m)}
                  cy={yScale(mewp.working_height_m)}
                  r="4"
                  fill={typeColors[mewp.mewp_type] || '#64748b'}
                  fillOpacity="0.7"
                  stroke={typeColors[mewp.mewp_type] || '#64748b'}
                  strokeWidth="1"
                  strokeOpacity="1"
                >
                  <title>{`${mewp.manufacturer} ${mewp.model}\nHeight: ${mewp.working_height_m}m\nOutreach: ${mewp.horizontal_outreach_m}m`}</title>
                </circle>
              ))}
            </g>
             {/* Legend */}
            <g transform={`translate(${innerWidth + margin.left + 20}, ${margin.top})`}>
                <text fill="#cbd5e1" fontSize="12" fontWeight="bold">MEWP Type</text>
                {Object.entries(typeColors).map(([type, color], i) => (
                    <g key={type} transform={`translate(0, ${20 * (i + 1)})`}>
                        <rect width="12" height="12" fill={color} rx="2" />
                        <text x="20" y="10" fill="#cbd5e1" fontSize="12">{type}</text>
                    </g>
                ))}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DataViz;
