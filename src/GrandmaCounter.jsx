import React, { useState } from 'react';
import { Check, Copy, Heart, Info, RotateCcw, Sparkles } from 'lucide-react';
import { copyText } from './utils/clipboard';

const UNITS = {
  mad: { symbol: 'DH', name: 'Moroccan Dirham', short: 'MAD', perMad: 1, decimals: 2 },
  ryal: { symbol: 'Ry', name: 'Ryal', short: 'Ryal', perMad: 20, decimals: 0 },
  franc: { symbol: 'Fr', name: 'Franc', short: 'Franc', perMad: 100, decimals: 0 },
};

const EMPTY_VALUES = { mad: '', ryal: '', franc: '' };

const sanitizeAmount = value => {
  const normalized = value.replace(',', '.').replace(/[^\d.]/g, '');
  const [whole = '', ...decimals] = normalized.split('.');
  return decimals.length ? `${whole}.${decimals.join('')}` : whole;
};

const formatUnit = (value, unit) => value.toLocaleString('en-MA', {
  maximumFractionDigits: UNITS[unit].decimals,
});

export default function GrandmaCounter() {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [activeUnit, setActiveUnit] = useState(null);
  const [copiedUnit, setCopiedUnit] = useState('');

  const updateFrom = (unit, rawValue) => {
    const cleanValue = sanitizeAmount(rawValue);
    setActiveUnit(unit);
    setCopiedUnit('');

    if (cleanValue === '') {
      setValues(EMPTY_VALUES);
      return;
    }

    const amount = Number.parseFloat(cleanValue);
    if (!Number.isFinite(amount)) return;
    const madValue = amount / UNITS[unit].perMad;

    setValues(Object.fromEntries(
      Object.keys(UNITS).map(key => [key, key === unit ? cleanValue : formatUnit(madValue * UNITS[key].perMad, key)])
    ));
  };

  const copyUnit = async unit => {
    if (!values[unit]) return;
    try {
      await copyText(`${values[unit]} ${UNITS[unit].short}`);
      setCopiedUnit(unit);
      window.setTimeout(() => setCopiedUnit(''), 1800);
    } catch (_) {
      setCopiedUnit('');
    }
  };

  return (
    <section className="page-shell units-page" aria-labelledby="moroccan-units-title">
      <div className="page-heading">
        <div className="eyebrow"><Sparkles size={13} /> Count with Grandma</div>
        <h1 id="moroccan-units-title">Moroccan Units</h1>
        <p>Move naturally between Dirham, Ryal, and Franc.</p>
      </div>

      <div className="units-panel">
        <div className="units-panel-heading">
          <div>
            <span className="section-label">Enter any value</span>
            <h2>Every unit updates instantly</h2>
          </div>
          <button
            type="button"
            className="clear-button"
            onClick={() => {
              setValues(EMPTY_VALUES);
              setActiveUnit(null);
            }}
            disabled={!Object.values(values).some(Boolean)}
          >
            <RotateCcw size={14} /> Clear
          </button>
        </div>

        <div className="unit-input-grid">
          {Object.entries(UNITS).map(([key, unit]) => (
            <div className={activeUnit === key ? 'unit-input-card active' : 'unit-input-card'} key={key}>
              <div className="unit-input-heading">
                <label htmlFor={`unit-${key}`}>
                  <span>{unit.name}</span>
                  <small>{unit.short}</small>
                </label>
                <button type="button" onClick={() => copyUnit(key)} disabled={!values[key]} aria-label={`Copy ${unit.name} value`}>
                  {copiedUnit === key ? <Check size={15} /> : <Copy size={15} />}
                </button>
              </div>
              <div className="unit-input-control">
                <span>{unit.symbol}</span>
                <input
                  id={`unit-${key}`}
                  aria-label={unit.name}
                  inputMode="decimal"
                  autoComplete="off"
                  value={values[key]}
                  onFocus={() => setActiveUnit(key)}
                  onBlur={() => setActiveUnit(null)}
                  onChange={event => updateFrom(key, event.target.value)}
                  placeholder="0"
                />
              </div>
              {activeUnit === key && <div className="driving-value">Editing this unit</div>}
            </div>
          ))}
        </div>

        <div className="unit-convention">
          <Info size={17} />
          <div>
            <strong>Convention used by this tool</strong>
            <p>1 MAD = 20 Ryal = 100 Franc. Colloquial usage can vary by region.</p>
          </div>
        </div>
      </div>

      <p className="made-by">Made with <Heart size={11} /> by Hamza</p>
      <span className="sr-only" aria-live="polite">{copiedUnit ? 'Value copied to clipboard' : ''}</span>
    </section>
  );
}
