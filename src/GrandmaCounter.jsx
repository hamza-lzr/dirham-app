import React, { useState } from 'react';
import { Repeat, History, Heart } from 'lucide-react';

/* ── Conversion rates and metadata ── */
const rates = {
  mad:   1,
  ryal:  20,
  franc: 100,
  doro:  2,
};

const currencyMeta = {
  mad:   { symbol: 'DH',  name: 'Moroccan Dirham', abbr: 'MAD' },
  ryal:  { symbol: 'Ry',  name: 'Moroccan Ryal',   abbr: 'RYL' },
  franc: { symbol: 'Fr',  name: 'Moroccan Franc',  abbr: 'FRN' },
  doro:  { symbol: '½',   name: 'Doro',            abbr: 'DRO' },
};

const formatNumber = (num, currency) => {
  if (!num || isNaN(num)) return '';
  const number = parseFloat(num);
  if (currency === 'mad') {
    return number.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }
  return Math.round(number).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const GrandmaCounter = () => {
  const [inputs, setInputs] = useState({ mad: '', ryal: '', franc: '', doro: '' });

  const handleInputChange = (currency, value) => {
    const cleanValue = value.replace(/[^\d.]/g, '');
    if (!cleanValue || isNaN(cleanValue)) {
      setInputs({ mad: '', ryal: '', franc: '', doro: '' });
      return;
    }
    const numValue = parseFloat(cleanValue);
    const madValue = numValue / rates[currency];
    setInputs({
      mad:   formatNumber(madValue,                 'mad'),
      ryal:  formatNumber(madValue * rates.ryal,    'ryal'),
      franc: formatNumber(madValue * rates.franc,   'franc'),
      doro:  formatNumber(madValue * rates.doro,    'doro'),
    });
  };

  return (
    <div className="min-h-screen flex items-start justify-center p-4 pt-10 pb-16">
      <div className="w-full max-w-2xl">

        {/* ── Header ── */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-amber-600/70 text-xs font-semibold uppercase tracking-widest mb-4">
            <History size={12} />
            <span>Heritage Currency</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-100 mb-3 leading-tight">
            Count with Grandma
          </h1>
          <p className="text-slate-500 text-sm font-light">
            Traditional Moroccan currency conversion
          </p>
          <div className="h-px w-12 bg-gradient-to-r from-amber-700 to-transparent mx-auto mt-6" />
        </div>

        {/* ── Main Card ── */}
        <div className="backdrop-blur-xl bg-slate-900/50 border border-amber-700/20 rounded-2xl shadow-2xl shadow-slate-950/60 overflow-hidden">

          {/* Top accent line */}
          <div className="h-px bg-gradient-to-r from-transparent via-amber-700/40 to-transparent" />

          <div className="p-8 md:p-10">

            {/* Input Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              {Object.entries(currencyMeta).map(([key, { symbol, name, abbr }]) => (
                <CurrencyInput
                  key={key}
                  currencyKey={key}
                  symbol={symbol}
                  name={name}
                  abbr={abbr}
                  value={inputs[key]}
                  onChange={handleInputChange}
                />
              ))}
            </div>

            {/* ── Conversion Rates Reference ── */}
            <div className="bg-amber-900/10 border border-amber-700/15 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Repeat size={12} className="text-amber-700/60" />
                <p className="text-amber-600/80 text-xs font-semibold uppercase tracking-widest">Conversion Rates</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <RatePill top="1 MAD" bottom="20 Ryals" />
                <RatePill top="1 MAD" bottom="100 Francs" />
                <RatePill top="1 MAD" bottom="2 Doros" />
                <RatePill top="1 Doro" bottom="0.5 MAD" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-6 font-light">
          Traditional Moroccan heritage currencies
        </p>
        <p className="flex items-center justify-center gap-1.5 text-slate-700 text-xs mt-2 font-light">
          Made with <Heart size={10} className="text-amber-700/60 fill-amber-700/40" /> by Hamza
        </p>
      </div>
    </div>
  );
};

/* ── Sub-components ── */

function CurrencyInput({ currencyKey, symbol, name, abbr, value, onChange }) {
  return (
    <div className="premium-card rounded-xl p-4">
      {/* Card header */}
      <div className="flex items-center justify-between mb-3">
        <label
          className="text-amber-600 text-xs font-semibold uppercase tracking-widest"
          htmlFor={`input-${currencyKey}`}
        >
          {name}
        </label>
        <span className="text-slate-600 text-xs font-mono bg-slate-800/60 px-1.5 py-0.5 rounded border border-slate-700/40">
          {abbr}
        </span>
      </div>

      {/* Input field */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-600/70 text-base font-light select-none pointer-events-none">
          {symbol}
        </span>
        <input
          id={`input-${currencyKey}`}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={e => onChange(currencyKey, e.target.value)}
          placeholder="0"
          className="input-premium w-full pl-10 pr-3 py-3 rounded-lg text-slate-100 placeholder-slate-600 text-base font-light"
        />
      </div>
    </div>
  );
}

function RatePill({ top, bottom }) {
  return (
    <div className="text-center px-3 py-2.5 rounded-lg bg-slate-800/30 border border-slate-700/20 hover:border-amber-700/20 transition-colors duration-300">
      <p className="text-slate-400 text-xs font-medium">{top}</p>
      <p className="text-slate-600 text-xs mt-0.5">= {bottom}</p>
    </div>
  );
}

export default GrandmaCounter;
