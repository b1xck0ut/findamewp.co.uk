
import React, { useState } from 'react';
import { MEWP } from '../types';
import { ArrowLeftIcon, FileTextIcon, WorkingHeightIcon, TruckIcon, ShieldCheckIcon, WindIcon, StowedHeightIcon } from './icons';

interface MewpDetailsViewProps {
  mewp: MEWP & { usps?: string[] };
  onClose: () => void;
}

const MewpDetailsView: React.FC<MewpDetailsViewProps> = ({ mewp, onClose }) => {
  const [isPdfVisible, setPdfVisible] = useState(false);

  const detailSections: Record<string, { icon: React.ReactNode, items: Partial<Record<keyof MEWP, string>> }> = {
    "Performance": {
      icon: <WorkingHeightIcon className="w-5 h-5" />,
      items: {
        working_height_m: "Working Height",
        horizontal_outreach_m: "Horizontal Outreach",
        lifting_capacity_kg: "Lifting Capacity",
        negative_reach: "Negative Reach",
      }
    },
    "Stowed Dimensions": {
      icon: <StowedHeightIcon className="w-5 h-5" />,
      items: {
        stowed_height_m: "Height",
        stowed_width_m: "Width",
        stowed_length_with_basket_m: "Length (w/ Basket)",
        stowed_length_without_basket_m: "Length (no Basket)",
      }
    },
    "Operational & General": {
      icon: <TruckIcon className="w-5 h-5" />,
      items: {
        fully_jacked_width_m: "Fully Jacked Width",
        one_side_narrow_jacked_m: "One-Side Jacked",
        narrow_jacked_width_m: "Narrow Jacked Width",
        weight_kg: "Total Weight",
        fuel_type: "Fuel Type",
      }
    },
  };
  
  const getUnit = (key: string): string => {
    if (key.endsWith('_m')) return ' m';
    if (key.endsWith('_kg')) return ' kg';
    return '';
  }

  const SpecItem: React.FC<{ label: string, value: any, unit?: string }> = ({ label, value, unit }) => {
    const displayValue = value === null || value === undefined || value === '' ? 'N/A' : `${value}`;
    return (
      <div className="bg-slate-800 rounded-lg py-3 px-4 flex justify-between items-baseline">
        <span className="text-sm text-slate-400">{label}</span>
        <span className="text-lg font-bold text-slate-100">
          {displayValue}
          <span className="text-sm font-normal ml-1">{unit}</span>
        </span>
      </div>
    );
  };
  
  const SafetyItem: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="flex items-start">
        <div className="flex-shrink-0 text-teal-400 mt-0.5">{icon}</div>
        <div className="ml-4">
            <h4 className="font-semibold text-slate-200">{title}</h4>
            <p className="text-slate-400 text-sm mt-1">{children}</p>
        </div>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col bg-slate-900">
      <header className="p-4 border-b border-slate-800 flex items-center space-x-4 flex-shrink-0 sticky top-0 bg-slate-900/80 backdrop-blur-sm z-20">
        <button 
          onClick={onClose} 
          className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          aria-label="Back to list"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-teal-400 leading-tight">{mewp.manufacturer}</h2>
          <p className="text-4xl font-extrabold text-slate-100 leading-tight">{mewp.model}</p>
        </div>
      </header>
      
      <main className="flex-grow flex flex-row overflow-hidden">
        {/* Left Column: Specs */}
        <div className="w-full lg:w-7/12 flex-shrink-0 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
            {Object.entries(detailSections).map(([sectionTitle, { icon, items }]) => {
                const hasContent = Object.keys(items).some(key => {
                    const value = mewp[key as keyof MEWP];
                    if (key === 'negative_reach') return value !== 0 && value !== null && value !== undefined;
                    return value !== null && value !== undefined && value !== '';
                });

                if (!hasContent) return null;

                return (
                    <section key={sectionTitle}>
                        <div className="flex items-center pb-3 border-b border-slate-700/50">
                            <span className="text-slate-400">{icon}</span>
                            <h3 className="text-lg font-semibold text-slate-200 ml-3">{sectionTitle}</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                            {Object.entries(items).map(([key, label]) => {
                                const value = mewp[key as keyof MEWP];
                                if (value === null || value === undefined || value === '' || (key === 'negative_reach' && value === 0)) return null;
                                return <SpecItem key={key} label={label || ''} value={value} unit={getUnit(key)} />;
                            })}
                        </div>
                    </section>
                );
            })}
             <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 space-y-5">
                  <h3 className="text-lg font-semibold text-slate-200 flex items-center">
                      <ShieldCheckIcon className="w-5 h-5 mr-3 text-teal-400" />
                      Safety & Compliance
                  </h3>
                  <SafetyItem icon={<WindIcon className="w-5 h-5" />} title="Max Wind Speed">
                      Standard outdoor operation is limited to 12.5 m/s (28 mph). Always verify with the machine-specific manual.
                  </SafetyItem>
                   <SafetyItem icon={<FileTextIcon className="w-5 h-5" />} title="Risk Assessment">
                        A site-specific risk assessment and rescue plan is required before work commences.
                    </SafetyItem>
              </div>
        </div>

        {/* Right Column: PDF Embed (Desktop only) */}
        <div className="hidden lg:flex flex-col w-5/12 border-l border-slate-800">
          {mewp.pdf_link ? (
              <div className="w-full h-full flex flex-col">
                <div className="p-4 bg-slate-800 border-b border-slate-700 flex-shrink-0">
                  <h3 className="text-lg font-semibold text-slate-200 flex items-center">
                    <FileTextIcon className="w-5 h-5 mr-2 text-teal-400" />
                    Spec Sheet
                  </h3>
                </div>
                <div className="flex-grow bg-slate-800/50 flex items-center justify-center">
                  <div className="text-center p-8">
                    <FileTextIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 mb-4">PDF Preview</p>
                    <a
                      href={mewp.pdf_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                    >
                      <FileTextIcon className="w-4 h-4 mr-2" />
                      Open PDF in New Tab
                    </a>
                  </div>
                </div>
              </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-slate-800/50">
              <div className="text-center">
                  <FileTextIcon className="w-16 h-16 text-slate-600 mx-auto" />
                  <p className="mt-4 text-slate-400">Spec Sheet Not Available</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer with button for mobile view */}
      <footer className="p-4 border-t border-slate-800 flex-shrink-0 bg-slate-900/80 backdrop-blur-sm lg:hidden">
          <button
              onClick={() => mewp.pdf_link && setPdfVisible(true)}
              className={`w-full flex items-center justify-center text-sm font-semibold rounded-lg px-4 py-3 transition-colors ${
              mewp.pdf_link
                  ? 'text-white bg-teal-500 hover:bg-teal-600 shadow-md shadow-teal-500/20'
                  : 'text-slate-400 bg-slate-700 cursor-not-allowed'
              }`}
              disabled={!mewp.pdf_link}
              aria-disabled={!mewp.pdf_link}
          >
              <FileTextIcon className="w-5 h-5 mr-2" />
              {mewp.pdf_link ? 'View Spec Sheet (PDF)' : 'Spec Sheet Not Available'}
          </button>
      </footer>

      {/* PDF Viewer Overlay (Mobile only) */}
      {isPdfVisible && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 lg:hidden">
          <div className="bg-slate-800 rounded-lg overflow-hidden flex flex-col w-full h-full max-w-4xl max-h-[90vh]">
            <header className="p-4 bg-slate-900 flex justify-between items-center flex-shrink-0 border-b border-slate-700">
              <h3 className="text-slate-100 font-semibold">{mewp.manufacturer} {mewp.model} - Spec Sheet</h3>
              <button onClick={() => setPdfVisible(false)} className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </header>
            <div className="flex-grow bg-slate-800/50 flex items-center justify-center">
              <div className="text-center p-8">
                <FileTextIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">Open PDF Spec Sheet</p>
                <a
                  href={mewp.pdf_link!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                  onClick={() => setPdfVisible(false)}
                >
                  <FileTextIcon className="w-5 h-5 mr-2" />
                  Open PDF in New Tab
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MewpDetailsView;
