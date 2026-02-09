import React, { useState } from 'react';

const GrandmaCounter = () => {
  const [inputs, setInputs] = useState({
    mad: '',
    ryal: '',
    franc: '',
    doro: '',
  });

  // Conversion rates to MAD
  const rates = {
    mad: 1,      // 1 MAD = 1 MAD
    ryal: 20,    // 1 MAD = 20 Ryals
    franc: 100,  // 1 MAD = 100 Francs
    doro: 2,     // 1 MAD = 2 Doros
  };

  const currencySymbols = {
    mad: 'د.م.',
    ryal: 'ر',
    franc: 'ف',
    doro: '₽',
  };

  const currencyNames = {
    mad: 'Moroccan Dirham',
    ryal: 'Moroccan Ryal',
    franc: 'Moroccan Franc',
    doro: 'Doro',
  };

  // Format number with thousands delimiter
  const formatNumber = (num, currency) => {
    if (!num || isNaN(num)) return '';
    
    const number = parseFloat(num);
    
    // MAD can have decimals
    if (currency === 'mad') {
      return number.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    }
    
    // All others as integers
    return Math.round(number).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // Handle input change and convert to all currencies
  const handleInputChange = (currency, value) => {
    // Allow only numbers and decimal point
    const cleanValue = value.replace(/[^\d.]/g, '');
    
    if (!cleanValue || cleanValue === '' || isNaN(cleanValue)) {
      setInputs({
        mad: '',
        ryal: '',
        franc: '',
        doro: '',
      });
      return;
    }

    const numValue = parseFloat(cleanValue);
    const madValue = numValue / rates[currency];

    setInputs({
      mad: formatNumber(madValue, 'mad'),
      ryal: formatNumber(madValue * rates.ryal, 'ryal'),
      franc: formatNumber(madValue * rates.franc, 'franc'),
      doro: formatNumber(madValue * rates.doro, 'doro'),
    });
  };

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

      <div className="relative z-10 w-full max-w-2xl pt-20">
        {/* Card Container */}
        <div className="backdrop-blur-xl bg-slate-900/40 border border-amber-700/30 rounded-2xl shadow-2xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="text-amber-700 text-sm font-semibold uppercase tracking-widest mb-3 opacity-75">
              Heritage Currency
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-100 mb-2">
              Count with Grandma
            </h1>
            <p className="text-slate-400 text-base font-light">Traditional Moroccan currency conversion</p>
            <div className="h-0.5 w-16 bg-gradient-to-r from-amber-700 to-transparent mx-auto mt-6"></div>
          </div>

          {/* Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {['mad', 'ryal', 'franc', 'doro'].map((currency) => (
              <div key={currency}>
                <label className="block text-amber-700 text-xs font-semibold mb-3 uppercase tracking-widest">
                  {currencyNames[currency]}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-amber-600 text-lg font-light">
                    {currencySymbols[currency]}
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={inputs[currency]}
                    onChange={(e) => handleInputChange(currency, e.target.value)}
                    placeholder="0"
                    className="input-premium w-full pl-12 pr-4 py-4 rounded-lg text-slate-100 placeholder-slate-500 text-lg font-light focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Conversion Info */}
          <div className="bg-amber-900/10 border border-amber-700/20 rounded-lg p-6 backdrop-blur-sm">
            <p className="text-amber-700 text-xs font-semibold mb-4 uppercase tracking-widest">Conversion Rates</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs text-slate-400">
              <div className="hover:text-amber-700/70 transition-colors">
                <p className="font-medium text-slate-300">1 MAD</p>
                <p className="text-slate-500 text-xs mt-1">=  20 Ryals</p>
              </div>
              <div className="hover:text-amber-700/70 transition-colors">
                <p className="font-medium text-slate-300">1 MAD</p>
                <p className="text-slate-500 text-xs mt-1">= 100 Francs</p>
              </div>
              <div className="hover:text-amber-700/70 transition-colors">
                <p className="font-medium text-slate-300">1 MAD</p>
                <p className="text-slate-500 text-xs mt-1">= 2 Doros</p>
              </div>
              <div className="hover:text-amber-700/70 transition-colors">
                <p className="font-medium text-slate-300">1 Doro</p>
                <p className="text-slate-500 text-xs mt-1">= 0.5 MAD</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-slate-500 text-xs mt-8 font-light">
          Traditional Moroccan heritage currencies
        </p>
      </div>
    </div>
  );
};

export default GrandmaCounter;
