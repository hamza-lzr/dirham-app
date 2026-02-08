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
        dirham: amountInDirham.toFixed(2),
        franc: (amountInDirham * 100).toFixed(2),
        ryal: (amountInDirham * 20).toFixed(2),
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Inter', sans-serif; }
        h1, h2, h3, h4, h5, h6 { font-family: 'Sora', sans-serif; }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-slideInUp {
          animation: slideInUp 0.5s ease-out;
        }
      `}</style>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-xl">
        {/* Card Container */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl mb-4 shadow-lg hover:shadow-blue-500/50 transition-shadow duration-300 animate-slideInUp">
              <span className="text-2xl font-bold text-white">C</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-200 via-blue-100 to-cyan-200 bg-clip-text text-transparent mb-2 animate-slideInUp" style={{animationDelay: '0.1s'}}>
              Currency Converter
            </h1>
            <p className="text-purple-200 text-lg font-light animate-slideInUp" style={{animationDelay: '0.2s'}}>Real-time conversion to Moroccan Currency</p>
          </div>

          {/* Input Section */}
          <div className="mb-8 animate-slideInUp" style={{animationDelay: '0.3s'}}>
            <label className="block text-white/80 text-sm font-semibold mb-3 uppercase tracking-wider">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-4 text-blue-300 text-xl font-bold transition-all duration-300">
                {currencySymbols[currency]}
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-12 pr-4 py-4 bg-white/10 border-2 border-white/20 rounded-xl focus:border-blue-400 focus:outline-none transition-all duration-300 text-white placeholder-white/40 text-lg font-semibold hover:bg-white/15 focus:bg-white/20 focus:ring-4 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Currency Selection */}
          <div className="mb-10 animate-slideInUp" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-white/80 text-sm font-semibold uppercase tracking-wider">
                From Currency
              </label>
              {isLoading && (
                <span className="text-xs text-blue-300 animate-pulse flex items-center gap-1">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                  Fetching...
                </span>
              )}
            </div>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-4 bg-white/10 border-2 border-white/20 rounded-xl focus:border-blue-400 focus:outline-none transition-all duration-300 text-white text-lg font-semibold hover:bg-white/15 focus:bg-white/20 focus:ring-4 focus:ring-blue-500/20 cursor-pointer appearance-none disabled:opacity-70"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2393c5fd' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem',
              }}
            >
              {Object.keys(exchangeRates).map((curr) => (
                <option key={curr} value={curr} className="bg-slate-900">
                  {curr} - {currencySymbols[curr]}
                </option>
              ))}
            </select>
          </div>

          {/* Results Section */}
          <div className="space-y-4 mb-10">
            <h2 className="text-white/80 text-sm font-semibold mb-6 uppercase tracking-wider animate-slideInUp" style={{animationDelay: '0.5s'}}>
              Conversion Results
            </h2>

            {/* Dirham */}
            <div className="group relative bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 hover:border-emerald-400/60 rounded-2xl p-6 transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-105 cursor-pointer animate-slideInUp animate-fadeInScale" style={{animationDelay: '0.6s'}}>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/0 to-teal-600/0 group-hover:from-emerald-600/10 group-hover:to-teal-600/10 rounded-2xl transition-all duration-500"></div>
              <div className="relative flex justify-between items-center">
                <div>
                  <p className="text-emerald-200/80 text-sm font-semibold mb-2">Moroccan Dirham</p>
                  <p className="text-4xl font-black bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent transition-all duration-300">
                    {conversions.dirham}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-bold text-emerald-300 transition-transform duration-300 group-hover:scale-110">د.م.</span>
                </div>
              </div>
            </div>

            {/* Franc */}
            <div className="group relative bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 hover:border-blue-400/60 rounded-2xl p-6 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 cursor-pointer animate-slideInUp animate-fadeInScale" style={{animationDelay: '0.7s'}}>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-cyan-600/0 group-hover:from-blue-600/10 group-hover:to-cyan-600/10 rounded-2xl transition-all duration-500"></div>
              <div className="relative flex justify-between items-center">
                <div>
                  <p className="text-blue-200/80 text-sm font-semibold mb-2">Moroccan Franc</p>
                  <p className="text-4xl font-black bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent transition-all duration-300">
                    {conversions.franc}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-bold text-blue-300 transition-transform duration-300 group-hover:scale-110">ف</span>
                </div>
              </div>
            </div>

            {/* Ryal */}
            <div className="group relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 hover:border-purple-400/60 rounded-2xl p-6 transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105 cursor-pointer animate-slideInUp animate-fadeInScale" style={{animationDelay: '0.8s'}}>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/10 group-hover:to-pink-600/10 rounded-2xl transition-all duration-500"></div>
              <div className="relative flex justify-between items-center">
                <div>
                  <p className="text-purple-200/80 text-sm font-semibold mb-2">Moroccan Ryal</p>
                  <p className="text-4xl font-black bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent transition-all duration-300">
                    {conversions.ryal}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-bold text-purple-300 transition-transform duration-300 group-hover:scale-110">ر</span>
                </div>
              </div>
            </div>
          </div>

          {/* Exchange Rate Info */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 animate-slideInUp" style={{animationDelay: '0.9s'}}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/60 text-sm font-semibold">Exchange Rate</p>
              <span className="text-lg font-bold text-transparent bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text transition-all duration-300">
                1 {currency} = {rates[currency]?.toFixed(2)} MAD
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center text-xs text-white/50 pt-4 border-t border-white/10">
              <div className="hover:text-white/70 transition-colors duration-300">
                <p className="font-semibold text-white/70">1 Dirham</p>
                <p className="text-white/60">100 Francs</p>
              </div>
              <div className="hover:text-white/70 transition-colors duration-300">
                <p className="font-semibold text-white/70">1 Dirham</p>
                <p className="text-white/60">20 Ryals</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-white/30 text-xs mt-8 font-light animate-slideInUp" style={{animationDelay: '1s'}}>
          {isLoading ? 'Fetching live rates...' : 'Live conversion • Exchange rates from open.er-api.com'}
        </p>
      </div>
    </div>
  );
};

export default CurrencyConverter;
