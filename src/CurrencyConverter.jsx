import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeftRight,
  RefreshCw,
  TrendingUp,
  ChevronDown,
  Info,
  Heart,
} from 'lucide-react';

/* ── Currency metadata ── */
const CURRENCY_META = {
  MAD: { symbol: 'DH',  flag: 'MA', name: 'Moroccan Dirham' },
  USD: { symbol: '$',   flag: 'US', name: 'US Dollar' },
  EUR: { symbol: '€',   flag: 'EU', name: 'Euro' },
  GBP: { symbol: '£',   flag: 'GB', name: 'British Pound' },
  JPY: { symbol: '¥',   flag: 'JP', name: 'Japanese Yen' },
  INR: { symbol: '₹',   flag: 'IN', name: 'Indian Rupee' },
  AED: { symbol: 'AED', flag: 'AE', name: 'UAE Dirham' },
  SAR: { symbol: 'SR',  flag: 'SA', name: 'Saudi Riyal' },
  BHD: { symbol: 'BD',  flag: 'BH', name: 'Bahraini Dinar' },
  EGP: { symbol: 'E£',  flag: 'EG', name: 'Egyptian Pound' },
  TND: { symbol: 'DT',  flag: 'TN', name: 'Tunisian Dinar' },
};

const CurrencyConverter = () => {
  const [amount, setAmount]       = useState('');
  const [currency, setCurrency]   = useState('USD');
  const [rates, setRates]         = useState({});
  const [conversions, setConversions] = useState({ dirham: 0, franc: 0, ryal: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const exchangeRates = useMemo(() => ({
    MAD: 1, USD: 10.5, EUR: 11.5, GBP: 13.2, JPY: 0.072,
    INR: 0.126, AED: 2.86, SAR: 2.8, BHD: 27.9, EGP: 0.34, TND: 3.4,
  }), []);

  /* ── Live rate fetching ── */
  useEffect(() => {
    setRates(exchangeRates);
    if (currency === 'MAD') { setIsLoading(false); return; }
    setIsLoading(true);

    try {
      const cached = localStorage.getItem(`rate_${currency}`);
      if (cached) {
        setRates(prev => ({ ...prev, [currency]: parseFloat(cached) }));
        setIsLoading(false);
      }
    } catch (_) {}

    const controller = new AbortController();
    (async () => {
      try {
        const res  = await fetch(`https://open.er-api.com/v6/latest/${currency}`, { signal: controller.signal });
        if (!res.ok) throw new Error('fetch failed');
        const data = await res.json();
        const mad  = data?.rates?.MAD;
        if (mad && !isNaN(mad)) {
          setRates(prev => ({ ...prev, [currency]: mad }));
          try { localStorage.setItem(`rate_${currency}`, mad.toString()); } catch (_) {}
        }
      } catch (_) {
      } finally {
        setIsLoading(false);
      }
    })();
    return () => controller.abort();
  }, [exchangeRates, currency]);

  /* ── Conversion logic ── */
  useEffect(() => {
    if (amount && currency && rates[currency]) {
      const mad = parseFloat(amount) * rates[currency];
      setConversions({
        dirham: parseFloat(mad.toFixed(2)).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }),
        franc:  Math.round(mad * 100).toLocaleString('en-US'),
        ryal:   Math.round(mad * 20).toLocaleString('en-US'),
      });
    } else {
      setConversions({ dirham: 0, franc: 0, ryal: 0 });
    }
  }, [amount, currency, rates]);

  // meta accessible via CURRENCY_META[currency] inline where needed

  return (
    <div className="min-h-screen flex items-start justify-center p-4 pt-10 pb-16">
      <div className="w-full max-w-5xl">

        {/* ── Header ── */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-amber-600/70 text-xs font-semibold uppercase tracking-widest mb-4">
            <TrendingUp size={12} />
            <span>Global Markets</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-100 mb-3 leading-tight">
            Currency Exchange
          </h1>
          <p className="text-slate-500 text-sm font-light">
            Real-time conversion to Moroccan currency
          </p>
          <div className="h-px w-12 bg-gradient-to-r from-amber-700 to-transparent mx-auto mt-6" />
        </div>

        {/* ── Main Card ── */}
        <div className="backdrop-blur-xl bg-slate-900/50 border border-amber-700/20 rounded-2xl shadow-2xl shadow-slate-950/60 overflow-hidden">

          {/* Top accent line */}
          <div className="h-px bg-gradient-to-r from-transparent via-amber-700/40 to-transparent" />

          <div className="p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

              {/* ── Left: Inputs ── */}
              <div className="space-y-7">

                {/* Amount input */}
                <div>
                  <label className="flex items-center gap-1.5 text-amber-600 text-xs font-semibold uppercase tracking-widest mb-3">
                    <span>Amount</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600/80 text-lg font-light select-none pointer-events-none">
                      {CURRENCY_META[currency]?.symbol || currency}
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="input-premium w-full pl-12 pr-4 py-4 rounded-xl text-slate-100 text-lg font-light"
                    />
                  </div>
                </div>

                {/* Currency selector */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-1.5 text-amber-600 text-xs font-semibold uppercase tracking-widest">
                      <ArrowLeftRight size={11} />
                      <span>From Currency</span>
                    </label>
                    {isLoading && (
                      <span className="flex items-center gap-1.5 text-xs text-amber-600/60">
                        <RefreshCw size={11} className="animate-spin" />
                        <span>Fetching live rate</span>
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <select
                      value={currency}
                      onChange={e => setCurrency(e.target.value)}
                      disabled={isLoading}
                      className="input-premium w-full px-4 py-4 rounded-xl text-slate-100 text-base font-light
                        focus:outline-none cursor-pointer appearance-none disabled:opacity-50 pr-10"
                    >
                      {Object.entries(CURRENCY_META).map(([code, { name }]) => (
                        <option key={code} value={code} className="bg-slate-900 text-slate-100">
                          {code} — {name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={15}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-700/60 pointer-events-none"
                    />
                  </div>
                </div>

                {/* Live rate info pill */}
                <div className="flex items-center justify-between bg-amber-900/10 border border-amber-700/20 rounded-xl px-5 py-3.5 glow-pulse">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Info size={13} className="text-amber-700/60" />
                    <span>Exchange Rate</span>
                  </div>
                  <span className="text-amber-300 font-medium text-sm tabular-nums">
                    1 {currency} = {rates[currency]?.toFixed(3)} MAD
                  </span>
                </div>
              </div>

              {/* ── Right: Results ── */}
              <div>
                <p className="text-amber-600 text-xs font-semibold uppercase tracking-widest mb-4">
                  Conversion Results
                </p>
                <div className="space-y-3">
                  <ResultCard
                    label="Moroccan Dirham"
                    symbol="DH"
                    value={conversions.dirham}
                    accent="amber"
                  />
                  <ResultCard
                    label="Moroccan Franc"
                    symbol="Fr"
                    value={conversions.franc}
                    accent="orange"
                  />
                  <ResultCard
                    label="Moroccan Ryal"
                    symbol="Ry"
                    value={conversions.ryal}
                    accent="yellow"
                  />
                </div>
              </div>
            </div>

            {/* ── Rate Reference Footer ── */}
            <div className="mt-8 pt-6 border-t border-amber-700/10">
              <div className="grid grid-cols-2 gap-4">
                <RateBlock primary="1 Dirham" secondary="= 100 Francs" />
                <RateBlock primary="1 Dirham" secondary="= 20 Ryals" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-6 font-light">
          {isLoading
            ? 'Updating live exchange rates...'
            : 'Real-time rates powered by open.er-api.com'}
        </p>
        <p className="flex items-center justify-center gap-1.5 text-slate-700 text-xs mt-2 font-light">
          Made with <Heart size={10} className="text-amber-700/60 fill-amber-700/40" /> by Hamza
        </p>
      </div>
    </div>
  );
};

/* ── Sub-components ── */

function ResultCard({ label, symbol, value }) {
  return (
    <div className="premium-card rounded-xl px-5 py-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-2 font-medium">{label}</p>
          <p className="result-value text-2xl font-light text-amber-100 tabular-nums">
            {value || <span className="text-slate-700">—</span>}
          </p>
        </div>
        <span className="text-amber-700/60 text-base font-light ml-4 shrink-0">{symbol}</span>
      </div>
    </div>
  );
}

function RateBlock({ primary, secondary }) {
  return (
    <div className="text-center px-4 py-3 rounded-lg bg-slate-800/30 border border-slate-700/20 hover:border-amber-700/20 transition-colors duration-300">
      <p className="text-slate-400 text-xs font-medium">{primary}</p>
      <p className="text-slate-600 text-xs mt-0.5">{secondary}</p>
    </div>
  );
}

export default CurrencyConverter;
