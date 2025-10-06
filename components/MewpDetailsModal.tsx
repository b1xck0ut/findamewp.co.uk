import React, { useEffect } from 'react';
import { MEWP } from '../types';
import { CloseIcon, FileTextIcon, WorkingHeightIcon, TruckIcon, ShieldCheckIcon, WindIcon, CheckIcon, BotIcon, InfoIcon } from './icons';

interface MewpDetailsModalProps {
  mewp: MEWP;
  onClose: () => void;
}

const MewpDetailsModal: React.FC<MewpDetailsModalProps> = ({ mewp, onClose }) => {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
        document.body.style.overflow = originalStyle;
    };
  }, []);

  const detailSections: Record<string, Partial<Record<keyof MEWP, string>>> = {
    "Performance": {
      working_height_m: "Working Height",
      horizontal_outreach_m: "Horizontal Outreach",
      lifting_capacity_kg: "Lifting Capacity",
      negative_reach: "Negative Reach",
    },
    "Dimensions & Logistics": {
      weight_kg: "Total Weight",
      stowed_height_m: "Stowed Height",
      stowed_width_m: "Stowed Width",
      stowed_length_with_basket_m: "Stowed Length",
      fully_jacked_width_m: "Fully Jacked Width",
      narrow_jacked_width_m: "Narrow Jacked Width",
    },
  };
  
  const getUnit = (key: string): string => {
    if (key.endsWith('_m')) return 'm';
    if (key.endsWith('_kg')) return 'kg';
    return '';
  }

  const DetailItem: React.FC<{ label: string, value: any, unit?: string }> = ({ label, value, unit }) => {
    const displayValue = value === null || value === undefined || value === '' ? 'N/A' : `${value}${unit || ''}`;
    return (
      <div className="py-3 px-4 bg-slate-800/50 rounded-lg flex justify-between items-center">
        <dt className="text-sm font-medium text-slate-400">{label}</dt>
        <dd className="text-sm font-semibold text-slate-100">{displayValue}</dd>
      </div>
    );
  };

  const SafetyItem: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="flex items-start">
        <div className="flex-shrink-0 text-teal-400">{icon}</div>
        <div className="ml-4">
            <h4 className="font-semibold text-slate-100">{title}</h4>
            <p className="text-slate-400 text-sm mt-1">{children}</p>
        </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-start p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900/80 border border-slate-700 backdrop-blur-lg rounded-lg shadow-2xl w-full max-w-4xl my-8 flex flex-col">
        <header className="p-6 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
          <div>
            <p className="text-sm font-medium text-teal-300">{mewp.manufacturer}</p>
            <h2 className="text-2xl font-bold text-slate-100">{mewp.model}</h2>
            <p className="text-sm text-slate-400 mt-1">{mewp.mewp_type} &bull; {mewp.boom_type}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700 transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        
        <div className="p-6 flex-grow overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-8">
            {Object.entries(detailSections).map(([sectionTitle, properties]) => (
              <section key={sectionTitle} className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2 mb-4 flex items-center">
                    {sectionTitle === 'Performance' && <WorkingHeightIcon className="w-5 h-5 mr-3" />}
                    {sectionTitle === 'Dimensions & Logistics' && <TruckIcon className="w-5 h-5 mr-3" />}
                    {sectionTitle}
                </h3>
                <dl className="space-y-2">
                  {Object.entries(properties).map(([key, label]) => {
                    const value = mewp[key as keyof MEWP];
                    if (value === null || value === undefined || value === '') return null;
                    return <DetailItem key={key} label={label} value={value} unit={getUnit(key)} />;
                  })}
                </dl>
              </section>
            ))}

            {mewp.usps && mewp.usps.length > 0 && (
              <section className="space-y-3 lg:col-span-2">
                <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2 mb-4 flex items-center">
                    <InfoIcon className="w-5 h-5 mr-3 text-slate-400" />
                    Unique Selling Points
                </h3>
                <ul className="space-y-3">
                  {mewp.usps.map((usp, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="w-4 h-4 text-teal-400 mr-3 mt-1 flex-shrink-0" />
                      <p className="text-slate-300 text-sm">{usp}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="space-y-4 lg:col-span-2">
                <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2 mb-4 flex items-center">
                    <ShieldCheckIcon className="w-5 h-5 mr-3" />
                    Safety & Compliance Advisory
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-800/40 rounded-lg">
                    <SafetyItem icon={<WindIcon className="w-6 h-6" />} title="Max Wind Speed">
                        Standard outdoor operation is limited to a maximum wind speed of 12.5 m/s (28 mph). Always verify with the machine-specific manual.
                    </SafetyItem>
                    <SafetyItem icon={<FileTextIcon className="w-6 h-6" />} title="Risk Assessment">
                        A site-specific risk assessment and rescue plan must be completed before any work at height commences.
                    </SafetyItem>
                    <SafetyItem icon={<CheckIcon className="w-6 h-6" />} title="Pre-Use Checks (PUWER)">
                        Operators must perform daily visual and functional checks to ensure the equipment is safe to use.
                    </SafetyItem>
                     <SafetyItem icon={<ShieldCheckIcon className="w-6 h-6" />} title="Thorough Examination (LOLER)">
                        This machine requires a statutory Thorough Examination by a competent person at least every 6 months. Verify the latest certificate is present.
                    </SafetyItem>
                </div>
            </section>
          </div>
        </div>

        <footer className="p-6 border-t border-slate-700 flex-shrink-0">
          <a
            href={mewp.pdf_link ?? undefined}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full flex items-center justify-center text-sm font-semibold rounded-lg px-4 py-3 transition-colors ${
              mewp.pdf_link
                ? 'text-white bg-teal-500 hover:bg-teal-600 shadow-md shadow-teal-500/20'
                : 'text-slate-400 bg-slate-700 cursor-not-allowed'
            }`}
            aria-disabled={!mewp.pdf_link}
            onClick={(e) => !mewp.pdf_link && e.preventDefault()}
          >
            <FileTextIcon className="w-5 h-5 mr-2" />
            {mewp.pdf_link ? 'View Spec Sheet (PDF)' : 'Spec Sheet Not Available'}
          </a>
        </footer>
      </div>
    </div>
  );
};

export default MewpDetailsModal;