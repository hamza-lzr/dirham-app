import React, { useState, useEffect, useMemo } from 'react';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [rates, setRates] = useState({});
  const [conversions, setConversions] = useState({
    dirham: 0,
    franc: 0,
    ryal: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Exchange rates to Moroccan Dirham (MAD) - using approximate real rates
  const exchangeRates = useMemo(() => ({
    MAD: 1,
    USD: 10.5,
    EUR: 11.5,
    GBP: 13.2,
    JPY: 0.072,
    INR: 0.126,
    AED: 2.86,
    SAR: 2.8,
    EGP: 0.34,
    TND: 3.4,
  }), []);

  const currencySymbols = {
    MAD: 'د.م.',
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    INR: '₹',
    AED: 'د.إ',
    SAR: '﷼',
    EGP: '£',
    TND: 'د.ت',
  };

  useEffect(() => {
    // initialize with hardcoded rates
    setRates(exchangeRates);

    // don't fetch when base is already MAD
    if (currency === 'MAD') {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // try restoring cached rate for this currency
    try {
      const cached = localStorage.getItem(`rate_${currency}`);
      if (cached) {
        console.log('CurrencyConverter: restoring cached rate for', currency, cached);
        setRates(prev => ({ ...prev, [currency]: parseFloat(cached) }));
        setIsLoading(false);
      }
    } catch (e) {
      // ignore localStorage errors (e.g., SSR or disabled)
    }

    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      try {
        const res = await fetch(
          `https://open.er-api.com/v6/latest/${currency}`,
          { signal }
        );
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        const mad = data?.rates?.MAD;
        if (mad && !isNaN(mad)) {
          console.log('CurrencyConverter: fetched MAD rate for', currency, mad);
          setRates(prev => ({ ...prev, [currency]: mad }));
          try { localStorage.setItem(`rate_${currency}`, mad.toString()); } catch (e) {}
        }
      } catch (err) {
        console.error('Failed to fetch MAD rate for', currency, err);
      } finally {
        setIsLoading(false);
      }
    })();

    return () => controller.abort();
  }, [exchangeRates, currency]);

  useEffect(() => {
    if (amount && currency && rates[currency]) {
      const amountInDirham = parseFloat(amount) * rates[currency];
      
      setConversions({
        dirham: parseFloat(amountInDirham.toFixed(2)).toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }),
        franc: Math.round(amountInDirham * 100).toLocaleString('en-US'),
        ryal: Math.round(amountInDirham * 20).toLocaleString('en-US'),
      });
    } else {
      setConversions({
        dirham: 0,
        franc: 0,
        ryal: 0,
      });
    }
  }, [amount, currency, rates]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Lato:wght@300;400;700&display=swap');
        * { font-family: 'Lato', sans-serif; }
        h1, h2, h3, h4, h5, h6 { font-family: 'Playfair Display', serif; }
        
        .premium-card {
          background: linear-gradient(135deg, rgba(30, 27, 22, 0.8) 0%, rgba(24, 23, 23, 0.8) 100%);
          border: 1px solid rgba(217, 119, 6, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .premium-card:hover {
          border-color: rgba(217, 119, 6, 0.6);
          box-shadow: 0 20px 40px rgba(217, 119, 6, 0.1);
          transform: translateY(-2px);
        }
        
        .input-premium {
          background: linear-gradient(135deg, rgba(30, 27, 22, 0.6) 0%, rgba(24, 23, 23, 0.6) 100%);
          border: 1px solid rgba(217, 119, 6, 0.2);
        }
        
        .input-premium:focus {
          border-color: rgba(217, 119, 6, 0.6);
          box-shadow: 0 0 20px rgba(217, 119, 6, 0.15);
        }
      `}</style>

      <div className="relative z-10 w-full max-w-6xl pt-20">
        {/* Card Container */}
        <div className="backdrop-blur-xl bg-slate-900/40 border border-amber-700/30 rounded-2xl shadow-2xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="text-amber-700 text-sm font-semibold uppercase tracking-widest mb-3 opacity-75">
              Global Markets
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-100 mb-2">
              Currency Exchange
            </h1>
            <p className="text-slate-400 text-base font-light">Convert to Moroccan currency in real-time</p>
            <div className="h-0.5 w-16 bg-gradient-to-r from-amber-700 to-transparent mx-auto mt-6"></div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
            {/* Left Column - Inputs */}
            <div>
              {/* Input Section */}
              <div className="mb-8">
                <label className="block text-amber-700 text-xs font-semibold uppercase tracking-widest mb-4">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-amber-600 text-xl font-light">
                    {currencySymbols[currency]}
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="input-premium w-full pl-12 pr-4 py-4 rounded-lg text-slate-100 placeholder-slate-500 text-lg font-light focus:outline-none"
                  />
                </div>
              </div>

              {/* Currency Selection */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-amber-700 text-xs font-semibold uppercase tracking-widest">
                    From Currency
                  </label>
                  {isLoading && (
                    <span className="text-xs text-amber-600/70 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-pulse"></span>
                      Updating rates
                    </span>
                  )}
                </div>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  disabled={isLoading}
                  className="input-premium w-full px-4 py-4 rounded-lg text-slate-100 text-lg font-light focus:outline-none cursor-pointer appearance-none bg-no-repeat disabled:opacity-50"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23d97706' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 12px center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.2em',
                    paddingRight: '2.5rem',
                  }}
                >
                  {Object.keys(exchangeRates).map((curr) => (
                    <option key={curr} value={curr} className="bg-slate-800">
                      {curr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right Column - Results */}
            <div className="space-y-4">
              <div className="text-amber-700 text-xs font-semibold uppercase tracking-widest mb-4">
                Conversion Results
              </div>

              {/* Dirham */}
              <div className="premium-card rounded-lg p-5 backdrop-blur-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-3 font-medium">Moroccan Dirham</p>
                    <p className="text-3xl font-light text-amber-100">
                      {conversions.dirham}
                    </p>
                  </div>
                  <span className="text-amber-700 text-lg font-light">د.م.</span>
                </div>
              </div>

              {/* Franc */}
              <div className="premium-card rounded-lg p-5 backdrop-blur-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-3 font-medium">Moroccan Franc</p>
                    <p className="text-3xl font-light text-amber-100">
                      {conversions.franc}
                    </p>
                  </div>
                  <span className="text-amber-700 text-lg font-light">ف</span>
                </div>
              </div>

              {/* Ryal */}
              <div className="premium-card rounded-lg p-5 backdrop-blur-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-3 font-medium">Moroccan Ryal</p>
                    <p className="text-3xl font-light text-amber-100">
                      {conversions.ryal}
                    </p>
                  </div>
                  <span className="text-amber-700 text-lg font-light">ر</span>
                </div>
              </div>
            </div>
          </div>

          {/* Exchange Rate Info */}
          <div className="bg-amber-900/10 border border-amber-700/20 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-400 text-sm font-medium">Exchange Rate</p>
              <span className="text-lg font-light text-amber-300">
                1 {currency} = {rates[currency]?.toFixed(2)} MAD
              </span>
            </div>
            <div className="grid grid-cols-2 gap-6 text-center text-xs text-slate-400 mt-4 pt-4 border-t border-amber-700/20">
              <div className="hover:text-amber-700/70 transition-colors">
                <p className="font-medium text-slate-300">1 Dirham</p>
                <p className="text-slate-500 text-xs mt-1">100 Francs</p>
              </div>
              <div className="hover:text-amber-700/70 transition-colors">
                <p className="font-medium text-slate-300">1 Dirham</p>
                <p className="text-slate-500 text-xs mt-1">20 Ryals</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-slate-500 text-xs mt-8 font-light">
          {isLoading ? 'Updating live rates...' : 'Real-time exchange rates • Powered by open.er-api.com'}
        </p>
      </div>
    </div>
  );
};

export default CurrencyConverter;
