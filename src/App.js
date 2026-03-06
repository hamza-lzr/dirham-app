import React, { useState } from "react";
import { ArrowLeftRight, Coins } from "lucide-react";
import CurrencyConverter from "./CurrencyConverter";
import GrandmaCounter from "./GrandmaCounter";
import "./App.css";

function App() {
  const [activeWindow, setActiveWindow] = useState("currency");

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="moroccan-pattern min-h-screen">
        {/* ── Navigation ── */}
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-amber-700/15 backdrop-blur-xl bg-slate-950/75">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
            {/* Wordmark */}
            <div className="flex items-center gap-2.5 select-none">
              <div className="w-7 h-7 rounded-full border border-amber-700/50 flex items-center justify-center bg-amber-900/20">
                <Coins size={14} className="text-amber-500" strokeWidth={1.75} />
              </div>
              <span
                className="text-slate-200 font-semibold tracking-wide text-sm hidden sm:block"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Dirham o Sserf
              </span>
            </div>

            {/* Tab buttons */}
            <nav className="flex items-center gap-1.5">
              <NavTab
                active={activeWindow === "currency"}
                onClick={() => setActiveWindow("currency")}
                icon={<ArrowLeftRight size={14} strokeWidth={2} />}
                label="Currency Exchange"
              />
              <NavTab
                active={activeWindow === "grandma"}
                onClick={() => setActiveWindow("grandma")}
                icon={<Coins size={14} strokeWidth={2} />}
                label="Count with Grandma"
              />
            </nav>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main className="pt-16 min-h-screen">
          {activeWindow === "currency" && (
            <div key="currency" className="animate-fade-in">
              <CurrencyConverter />
            </div>
          )}
          {activeWindow === "grandma" && (
            <div key="grandma" className="animate-fade-in">
              <GrandmaCounter />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function NavTab({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-medium tracking-wide
        transition-all duration-250 border
        ${
          active
            ? "bg-amber-700/20 text-amber-400 border-amber-700/40 shadow-sm shadow-amber-700/10 nav-tab-active"
            : "bg-transparent text-slate-500 border-transparent hover:text-slate-300 hover:border-slate-700/50"
        }
      `}
    >
      <span
        className={`transition-colors duration-250 ${active ? "text-amber-500" : "text-slate-600"}`}
      >
        {icon}
      </span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export default App;
