import React from 'react';
import MewpFinder from './components/MewpFinder';

const App: React.FC = () => {
  return (
    <div className="bg-slate-900 min-h-screen flex flex-col h-screen">
      <main className="flex-grow flex flex-col overflow-hidden">
        <MewpFinder />
      </main>
    </div>
  );
};

export default App;
