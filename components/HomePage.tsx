import React from 'react';
import { ShieldCheckIcon, SlidersIcon } from './icons';
import { CompareIcon } from './icons';

const HomePage: React.FC = () => {
  return (
    <div className="flex-grow flex items-center justify-center text-center p-8 bg-slate-900 text-slate-300 h-full">
      <div className="max-w-4xl">
        <h2 className="text-5xl md:text-6xl font-extrabold text-slate-100 tracking-tight">
          Your Definitive{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500">
            MEWP
          </span>{' '}
          Specification Hub
        </h2>
        <p className="mt-6 text-lg text-slate-400 max-w-3xl mx-auto">
          Stop wasting time with unreliable data. Our tool provides powered access professionals with instant access to a vast database of MEWP specifications, sourced directly from the manufacturer. No custom or doctored data sheets—just the accurate, trustworthy information you need to plan jobs, ensure compliance, and select the right machine with confidence.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="flex items-start space-x-4">
                <ShieldCheckIcon className="w-8 h-8 text-teal-400 flex-shrink-0 mt-1" />
                <div>
                    <h3 className="font-semibold text-slate-100">Verified Manufacturer Data</h3>
                    <p className="text-slate-400 text-sm mt-1">All specs are from official data sheets, ensuring you work with information you can trust.</p>
                </div>
            </div>
            <div className="flex items-start space-x-4">
                <SlidersIcon className="w-8 h-8 text-teal-400 flex-shrink-0 mt-1" />
                <div>
                    <h3 className="font-semibold text-slate-100">Powerful Filtering</h3>
                    <p className="text-slate-400 text-sm mt-1">Quickly narrow down hundreds of options by height, outreach, weight, and more critical specs.</p>
                </div>
            </div>
            <div className="flex items-start space-x-4">
                <CompareIcon className="w-8 h-8 text-teal-400 flex-shrink-0 mt-1" />
                <div>
                    <h3 className="font-semibold text-slate-100">Detailed Comparison</h3>
                    <p className="text-slate-400 text-sm mt-1">Analyze up to 10 machines side-by-side to make the most informed decision for your job.</p>
                </div>
            </div>
        </div>

        <div className="mt-12">
          <a
            href="#/finder"
            className="inline-block px-8 py-3 bg-teal-500 text-white rounded-lg font-semibold shadow-lg shadow-teal-500/20 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-teal-500 transform hover:scale-105 transition-all duration-300"
          >
            Launch MEWP Hub
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;