import React, { useState } from 'react';
import CurrencyConverter from './CurrencyConverter';
import GrandmaCounter from './GrandmaCounter';
import './App.css';

function App() {
  const [activeWindow, setActiveWindow] = useState('currency');

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Lato:wght@300;400;700&display=swap');
        * { font-family: 'Lato', sans-serif; }
        h1, h2, h3, h4, h5, h6 { font-family: 'Playfair Display', serif; }
        /* Moroccan geometric pattern */
        .moroccan-pattern {
          background-image: 
            repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(217, 119, 6, 0.02) 35px, rgba(217, 119, 6, 0.02) 70px),
            repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(217, 119, 6, 0.02) 35px, rgba(217, 119, 6, 0.02) 70px);
        }
      `}</style>
      
      <div className="moroccan-pattern">
        {/* Navigation */}
        <div className="fixed top-0 left-0 right-0 z-50 border-b border-amber-700/20 backdrop-blur-md bg-slate-950/80">
          <div className="flex justify-center gap-2 px-4 py-6">
            <button
              onClick={() => setActiveWindow('currency')}
              className={`px-8 py-3 rounded-lg transition-all duration-300 border font-medium text-sm tracking-wide ${
                activeWindow === 'currency'
                  ? 'bg-amber-700 text-amber-50 border-amber-600 shadow-lg shadow-amber-700/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-amber-600/30 hover:text-slate-200'
              }`}
            >
              Currency Exchange
            </button>
            <button
              onClick={() => setActiveWindow('grandma')}
              className={`px-8 py-3 rounded-lg transition-all duration-300 border font-medium text-sm tracking-wide ${
                activeWindow === 'grandma'
                  ? 'bg-amber-700 text-amber-50 border-amber-600 shadow-lg shadow-amber-700/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-amber-600/30 hover:text-slate-200'
              }`}
            >
              Count with Grandma
            </button>
          </div>
        </div>

        {/* Windows */}
        <div className="pt-24">
          {activeWindow === 'currency' && <CurrencyConverter />}
          {activeWindow === 'grandma' && <GrandmaCounter />}
        </div>
      </div>
    </div>
  );
}

export default App;
