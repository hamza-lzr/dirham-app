import React, { useState } from 'react';
import {
  ArrowDownUp,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  Info,
  RefreshCw,
  WifiOff,
  X,
} from 'lucide-react';

const formatRate = value => {
  if (!Number.isFinite(value)) return '—';
  return value.toLocaleString('en-MA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: value < 1 ? 4 : 3,
  });
};

const formatTime = timestamp => {
  if (!timestamp) return 'Bundled estimate';
  return new Intl.DateTimeFormat('en-MA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(timestamp);
};

const formatRelativeTime = timestamp => {
  if (!timestamp) return 'Bundled estimate';
  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
  if (elapsedMinutes < 1) return 'Updated just now';
  if (elapsedMinutes < 60) return `Updated ${elapsedMinutes}m ago`;
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `Updated ${elapsedHours}h ago`;
  return `Updated ${Math.floor(elapsedHours / 24)}d ago`;
};

export default function ConversionInstrument({ model }) {
  return (
    <section className="conversion-page" aria-labelledby="global-conversion-title">
      <div className="conversion-layout">
        <header className="conversion-intro">
          <p className="eyebrow">Morocco-first money converter</p>
          <h1 id="global-conversion-title">Understand Moroccan money.</h1>
          <p>From the currency you know to the words you’ll hear in Morocco.</p>
        </header>

        <div className="editorial-converter">
          <div className="editorial-line editorial-source">
            <span className="editorial-lead">I have</span>
            <div className="editorial-value-row">
              <AmountInput model={model} />
              {model.renderCurrencyControl(model.fromCurrency)}
            </div>
            <QuickAmounts model={model} />
          </div>

          <button
            className="instrument-swap"
            type="button"
            onClick={model.onSwap}
            aria-label="Swap conversion direction"
          >
            <ArrowDownUp size={19} />
          </button>

          <div className="editorial-line editorial-result">
            <span className="editorial-lead">which is</span>
            <div className="editorial-value-row">
              <ResultValue model={model} />
              {model.renderCurrencyControl(model.toCurrency)}
            </div>
            <CopyResult model={model} />
          </div>

          <RateTrust model={model} />

          <section className="unit-summary" aria-labelledby="spoken-units-title">
            <div className="unit-summary-heading">
              <h2 id="spoken-units-title">Say it locally</h2>
              <p>One value. Three ways to say it.</p>
            </div>
          <UnitList model={model} />
          </section>

          <p className="page-footnote">Ryal and Franc use fixed local conventions. Currency rates are informational.</p>
        </div>
        <span className="sr-only" aria-live="polite">
          {model.copiedKey ? 'Value copied to clipboard' : ''}
        </span>
      </div>
    </section>
  );
}

function AmountInput({ model }) {
  return (
    <div className="instrument-amount">
      <input
        aria-label={`Amount in ${model.fromName}`}
        inputMode="decimal"
        autoComplete="off"
        value={model.amount}
        onChange={event => model.onAmountChange(event.target.value)}
        placeholder="0"
      />
      {model.amount && (
        <button type="button" onClick={model.onClearAmount} aria-label="Clear amount">
          <X size={16} />
        </button>
      )}
    </div>
  );
}

function ResultValue({ model }) {
  const valueClass = model.resultText.length > 14
    ? 'value-compact'
    : model.resultText.length > 7
      ? 'value-long'
      : '';
  return (
    <output
      key={`${model.fromCurrency}-${model.toCurrency}-${model.resultText}`}
      className={`instrument-result-value ${valueClass}`}
      aria-live="polite"
      aria-atomic="true"
      aria-label={`Result in ${model.toName}`}
    >
      {model.resultText}
    </output>
  );
}

function QuickAmounts({ model }) {
  return (
    <div className="quick-row">
      <span>Quick amounts</span>
      <div role="group" aria-label="Quick amounts">
        {model.quickAmounts.map(value => (
          <button
            key={value}
            type="button"
            aria-pressed={model.amount === String(value)}
            onClick={() => model.onQuickAmount(value)}
          >
            {value.toLocaleString('en-MA')}
          </button>
        ))}
      </div>
    </div>
  );
}

function CopyResult({ model }) {
  return (
    <button
      className="copy-result"
      type="button"
      disabled={model.result === null}
      onClick={model.onCopyResult}
    >
      {model.copiedKey === 'result' ? <Check size={15} /> : <Copy size={15} />}
      {model.copiedKey === 'result' ? 'Copied' : 'Copy amount'}
    </button>
  );
}

function RateTrust({ model }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const status = model.rate?.status || 'estimated';
  const statusLabel = status === 'fresh' ? 'Fresh rate' : status === 'stale' ? 'Stale rate' : 'Estimated rate';
  const StatusIcon = status === 'fresh' ? CheckCircle2 : status === 'stale' ? Clock3 : WifiOff;
  const canRefresh = status !== 'fresh' || Boolean(model.rateError);

  return (
    <div className={`rate-trust ${status}`}>
      <div className="rate-summary" role="status" aria-live="polite" aria-atomic="true">
        <StatusIcon size={16} />
        <div>
          <strong>{statusLabel}</strong>
          <span>{model.isRefreshing ? 'Checking for a newer rate…' : formatRelativeTime(model.rate?.fetchedAt)}</span>
        </div>
      </div>
      <div className="rate-quote">
        <span>1 {model.foreignCurrency}</span>
        <strong>{formatRate(model.rate?.value)} MAD</strong>
      </div>
      <div className="rate-controls">
        <button
          type="button"
          aria-label={detailsOpen ? 'Hide rate details' : 'Show rate details'}
          aria-expanded={detailsOpen}
          onClick={() => setDetailsOpen(current => !current)}
        >
          <Info size={16} />
        </button>
        {canRefresh && (
          <button type="button" onClick={model.onRefreshRate} disabled={model.isRefreshing}>
            <RefreshCw size={15} className={model.isRefreshing ? 'animate-spin' : ''} />
            <span>{model.rateError ? 'Retry' : model.isRefreshing ? 'Updating' : 'Update'}</span>
          </button>
        )}
      </div>
      {detailsOpen && (
        <div className="rate-details">
          <div><span>Provider</span><strong>{model.rate?.source || 'Bundled estimate'}</strong></div>
          <div><span>Last update</span><strong>{formatTime(model.rate?.fetchedAt)}</strong></div>
          <p>Informational rate only. Banks and cash offices may quote a different amount.</p>
        </div>
      )}
      {model.rateError && <p className="rate-error" role="alert">{model.rateError}</p>}
    </div>
  );
}

function UnitList({ model }) {
  const spokenUnits = model.unitValues.filter(unit => unit.key !== 'mad');
  return (
    <div className="unit-list">
      {spokenUnits.map(unit => (
        <button
          key={unit.key}
          type="button"
          disabled={unit.value === '—'}
          onClick={unit.onCopy}
          aria-label={`Copy ${unit.label} value`}
        >
          <span>{unit.label}</span>
          <strong>{unit.value}</strong>
          <small>{unit.suffix}</small>
          {unit.copied ? <Check size={15} /> : <Copy size={15} />}
        </button>
      ))}
    </div>
  );
}
