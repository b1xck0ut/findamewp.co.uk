import React, { useState } from 'react';
import { BotIcon } from './icons';

interface AiAssistantProps {
    onSearch: (query: string) => void;
    isLoading: boolean;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ onSearch, isLoading }) => {
    const [query, setQuery] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8 shadow-lg">
            <h2 className="text-xl font-bold text-slate-100 flex items-center mb-3">
                <BotIcon className="w-6 h-6 mr-3 text-teal-400" />
                AI Job Assistant
            </h2>
            <p className="text-sm text-slate-400 mb-4">
                Describe your job requirements in plain English, and our assistant will find the best machines for you.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-start gap-3">
                <textarea 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., 'I need to inspect roof trusses at 15m inside a warehouse with narrow aisles.'"
                    className="flex-grow w-full text-sm bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-teal-500 transition-shadow text-slate-200 placeholder-slate-400 resize-none"
                    rows={3}
                    disabled={isLoading}
                    aria-label="Job description for AI assistant"
                />
                <button 
                    type="submit"
                    disabled={isLoading || !query.trim()}
                    className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 bg-teal-500 text-white rounded-lg font-semibold shadow-md shadow-teal-500/20 hover:bg-teal-600 disabled:bg-slate-500 disabled:cursor-not-allowed disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-teal-500 transition-all"
                >
                    {isLoading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : <BotIcon className="w-5 h-5 mr-2" />}
                    {isLoading ? 'Analyzing...' : 'Ask Assistant'}
                </button>
            </form>
        </div>
    );
};

export default AiAssistant;