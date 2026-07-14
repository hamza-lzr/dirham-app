import React, { useState } from 'react';
import { ArrowLeftRight, Coins } from 'lucide-react';
import CurrencyConverter from './CurrencyConverter';
import GrandmaCounter from './GrandmaCounter';
import './App.css';

function App() {
  const [activeTool, setActiveTool] = useState('global');

  return (
    <div className="app-frame">
      <div className="moroccan-pattern min-h-screen">
        <header className="app-header">
          <div className="header-inner">
            <button className="wordmark" type="button" onClick={() => setActiveTool('global')} aria-label="Dirham o Sserf home">
              <span className="wordmark-mark"><Coins size={15} strokeWidth={1.8} /></span>
              <span>Dirham o Sserf</span>
            </button>

            <nav className="tool-nav" aria-label="Conversion tools">
              <NavTab
                active={activeTool === 'global'}
                onClick={() => setActiveTool('global')}
                icon={<ArrowLeftRight size={15} />}
                label="Global"
              />
              <NavTab
                active={activeTool === 'units'}
                onClick={() => setActiveTool('units')}
                icon={<Coins size={15} />}
                label="Moroccan Units"
              />
            </nav>
          </div>
        </header>

        <main>
          <div key={activeTool} className="animate-fade-in">
            {activeTool === 'global' ? <CurrencyConverter /> : <GrandmaCounter />}
          </div>
        </main>
      </div>
    </div>
  );
}

function NavTab({ active, onClick, icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={active ? 'tool-tab active' : 'tool-tab'}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export default App;
