import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50 flex-shrink-0">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-slate-100 tracking-tight">
              MEWP<span className="text-teal-400">Spec</span>
            </span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
