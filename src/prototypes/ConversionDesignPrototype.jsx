// PROTOTYPE: Compare three warm Moroccan-modern compositions on the real Global Conversion route.
// This file is intentionally isolated and is only rendered in development through ?variant=A|B|C.
import React, { useEffect, useState } from 'react';
import {
  ArrowDownUp,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Copy,
  Info,
  RefreshCw,
  WifiOff,
  X,
} from 'lucide-react';
import './conversion-design-prototype.css';

const VARIANTS = ['A', 'B', 'C'];
const VARIANT_NAMES = {
  A: 'Calm Instrument',
  B: 'Living Ledger',
  C: 'Pocket Receipt',
};

const readVariant = () => {
  const requested = new URLSearchParams(window.location.search).get('variant')?.toUpperCase();
  return VARIANTS.includes(requested) ? requested : 'A';
};

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

export default function ConversionDesignPrototype({ model }) {
  const [variant, setVariant] = useState(readVariant);

  useEffect(() => {
    document.body.classList.add('design-prototype-body');
    const syncFromHistory = () => setVariant(readVariant());
    window.addEventListener('popstate', syncFromHistory);
    return () => {
      document.body.classList.remove('design-prototype-body');
      window.removeEventListener('popstate', syncFromHistory);
    };
  }, []);

  const selectVariant = nextVariant => {
    const url = new URL(window.location.href);
    url.searchParams.set('variant', nextVariant);
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
    setVariant(nextVariant);
  };

  const moveVariant = direction => {
    const currentIndex = VARIANTS.indexOf(variant);
    selectVariant(VARIANTS[(currentIndex + direction + VARIANTS.length) % VARIANTS.length]);
  };

  useEffect(() => {
    const handleKeyDown = event => {
      const target = event.target;
      const isEditing = target instanceof HTMLElement
        && (target.matches('input, textarea, select') || target.isContentEditable);
      if (isEditing || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        moveVariant(-1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        moveVariant(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <section className={`conversion-prototype prototype-${variant.toLowerCase()}`} aria-labelledby={`prototype-${variant}-title`}>
      {variant === 'A' && <CalmInstrument model={model} />}
      {variant === 'B' && <LivingLedger model={model} />}
      {variant === 'C' && <PocketReceipt model={model} />}
      <PrototypeSwitcher variant={variant} onPrevious={() => moveVariant(-1)} onNext={() => moveVariant(1)} />
      <span className="sr-only" aria-live="polite">{model.copiedKey ? 'Value copied to clipboard' : ''}</span>
    </section>
  );
}

function PrototypeSwitcher({ variant, onPrevious, onNext }) {
  return (
    <div className="prototype-switcher" role="group" aria-label="Design prototype switcher">
      <button type="button" onClick={onPrevious} aria-label="Previous design variant" aria-keyshortcuts="ArrowLeft">
        <ArrowLeft size={17} />
      </button>
      <div aria-live="polite">
        <small>Prototype {variant} of 3</small>
        <strong>{VARIANT_NAMES[variant]}</strong>
      </div>
      <button type="button" onClick={onNext} aria-label="Next design variant" aria-keyshortcuts="ArrowRight">
        <ArrowRight size={17} />
      </button>
    </div>
  );
}

function CalmInstrument({ model }) {
  return (
    <div className="prototype-layout calm-layout">
      <header className="prototype-intro calm-intro">
        <p className="prototype-eyebrow">Everyday exchange, made clear</p>
        <h1 id="prototype-A-title">Convert with confidence.</h1>
        <p>Live currency guidance built for Morocco, without the market-screen noise.</p>
      </header>

      <div className="calm-instrument">
        <div className="calm-field calm-source">
          <FieldLabel label="You send" currency={model.fromName} />
          <div className="calm-control-row">
            <AmountInput model={model} />
            {model.renderCurrencyControl(model.fromCurrency)}
          </div>
          <QuickAmounts model={model} />
        </div>

        <div className="calm-divider" aria-hidden="true" />
        <button className="prototype-swap calm-swap" type="button" onClick={model.onSwap} aria-label="Swap conversion direction">
          <ArrowDownUp size={19} />
        </button>

        <div className="calm-field calm-result">
          <FieldLabel label="You receive" currency={model.toName} />
          <div className="calm-control-row">
            <ResultValue model={model} />
            {model.renderCurrencyControl(model.toCurrency)}
          </div>
          <CopyResult model={model} label="Copy amount" />
        </div>

        <RateTrust model={model} compact />
      </div>

      <details className="calm-unit-summary">
        <summary>
          <span><strong>See it in Moroccan units</strong><small>Dirham, ryal, and franc at a glance</small></span>
          <ChevronDown size={18} />
        </summary>
        <UnitList model={model} />
      </details>

      <LegalNote />
    </div>
  );
}

function LivingLedger({ model }) {
  return (
    <div className="prototype-layout ledger-layout">
      <header className="prototype-intro ledger-intro">
        <div>
          <p className="prototype-eyebrow">A practical money ledger</p>
          <h1 id="prototype-B-title">Know what your money becomes.</h1>
        </div>
        <p>One useful view for the global rate and the Moroccan units people actually say.</p>
      </header>

      <div className="ledger-board">
        <section className="ledger-converter" aria-label="Currency conversion">
          <div className="ledger-source">
            <FieldLabel label="Amount to convert" currency={model.fromName} />
            <div className="ledger-amount-row">
              <AmountInput model={model} />
              {model.renderCurrencyControl(model.fromCurrency)}
            </div>
            <QuickAmounts model={model} label="Common amounts" />
          </div>

          <div className="ledger-result-band">
            <div className="ledger-result-heading">
              <FieldLabel label="Converted amount" currency={model.toName} />
              {model.renderCurrencyControl(model.toCurrency)}
            </div>
            <ResultValue model={model} />
            <div className="ledger-result-actions">
              <button className="prototype-swap ledger-swap" type="button" onClick={model.onSwap}>
                <ArrowDownUp size={17} /> Swap direction
              </button>
              <CopyResult model={model} label="Copy result" />
            </div>
          </div>
          <RateTrust model={model} compact />
        </section>

        <aside className="ledger-units" aria-labelledby="ledger-units-title">
          <div className="ledger-units-heading">
            <div>
              <p className="prototype-eyebrow">Local ledger</p>
              <h2 id="ledger-units-title">Moroccan units</h2>
            </div>
            <span>Tap a row to copy</span>
          </div>
          <UnitList model={model} />
          <p className="ledger-note">Ryal and franc are spoken units. The legal currency remains the Moroccan dirham.</p>
        </aside>
      </div>

      <LegalNote />
    </div>
  );
}

function PocketReceipt({ model }) {
  return (
    <div className="prototype-layout receipt-layout">
      <aside className="receipt-story" aria-hidden="true">
        <p className="prototype-eyebrow">Pocket-sized clarity</p>
        <h1 id="prototype-C-title">A conversion you can read like a receipt.</h1>
        <p>Fast enough for the counter. Clear enough to check twice.</p>
        <div className="receipt-story-mark">DS</div>
      </aside>

      <article className="receipt-sheet" aria-labelledby="receipt-title">
        <header className="receipt-heading">
          <div className="receipt-mini-mark">DS</div>
          <div>
            <p>Dirham o Sserf</p>
            <h2 id="receipt-title">Conversion receipt</h2>
          </div>
          <span>Live</span>
        </header>

        <div className="receipt-dash" />

        <section className="receipt-entry">
          <FieldLabel label="From" currency={model.fromName} />
          <div className="receipt-input-row">
            <AmountInput model={model} />
            {model.renderCurrencyControl(model.fromCurrency)}
          </div>
          <QuickAmounts model={model} />
        </section>

        <button className="prototype-swap receipt-swap" type="button" onClick={model.onSwap}>
          <ArrowDownUp size={17} />
          <span>Reverse receipt</span>
        </button>

        <section className="receipt-total">
          <div className="receipt-total-label">
            <FieldLabel label="Total" currency={model.toName} />
            {model.renderCurrencyControl(model.toCurrency)}
          </div>
          <ResultValue model={model} />
          <CopyResult model={model} label="Copy total" />
        </section>

        <div className="receipt-dash" />
        <RateTrust model={model} />

        <details className="receipt-units">
          <summary>
            <span>Moroccan unit breakdown</span>
            <ChevronDown size={17} />
          </summary>
          <UnitList model={model} />
        </details>

        <footer>
          <span>Informational rate</span>
          <span aria-hidden="true">•</span>
          <span>Made for everyday Morocco</span>
        </footer>
      </article>
    </div>
  );
}

function FieldLabel({ label, currency }) {
  return (
    <div className="prototype-field-label">
      <span>{label}</span>
      <small>{currency}</small>
    </div>
  );
}

function AmountInput({ model }) {
  return (
    <div className="prototype-amount-input">
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
  const valueClass = model.resultText.length > 18
    ? 'prototype-value-compact'
    : model.resultText.length > 12
      ? 'prototype-value-long'
      : '';
  return (
    <output
      key={`${model.fromCurrency}-${model.toCurrency}-${model.resultText}`}
      className={`prototype-result-value ${valueClass}`}
      aria-live="polite"
      aria-atomic="true"
      aria-label={`Result in ${model.toName}`}
    >
      {model.resultText}
    </output>
  );
}

function QuickAmounts({ model, label = 'Quick amounts' }) {
  return (
    <div className="prototype-quick-row">
      <span>{label}</span>
      <div aria-label="Quick amounts">
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

function CopyResult({ model, label }) {
  return (
    <button
      className="prototype-copy"
      type="button"
      disabled={model.result === null}
      onClick={model.onCopyResult}
    >
      {model.copiedKey === 'result' ? <Check size={15} /> : <Copy size={15} />}
      {model.copiedKey === 'result' ? 'Copied' : label}
    </button>
  );
}

function RateTrust({ model, compact = false }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const status = model.rate?.status || 'estimated';
  const statusLabel = status === 'fresh' ? 'Fresh rate' : status === 'stale' ? 'Stale rate' : 'Estimated rate';
  const StatusIcon = status === 'fresh' ? CheckCircle2 : status === 'stale' ? Clock3 : WifiOff;
  const canRefresh = status !== 'fresh' || Boolean(model.rateError);

  return (
    <div className={`prototype-rate ${status} ${compact ? 'compact' : ''}`}>
      <div className="prototype-rate-summary" role="status" aria-live="polite" aria-atomic="true">
        <StatusIcon size={16} />
        <div>
          <strong>{statusLabel}</strong>
          <span>{model.isRefreshing ? 'Checking for a newer rate…' : formatRelativeTime(model.rate?.fetchedAt)}</span>
        </div>
      </div>
      <div className="prototype-rate-quote">
        <span>1 {model.foreignCurrency}</span>
        <strong>{formatRate(model.rate?.value)} MAD</strong>
      </div>
      <div className="prototype-rate-controls">
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
        <div className="prototype-rate-details">
          <div><span>Provider</span><strong>{model.rate?.source || 'Bundled estimate'}</strong></div>
          <div><span>Last update</span><strong>{formatTime(model.rate?.fetchedAt)}</strong></div>
          <p>Informational rate only. Banks and cash offices may quote a different amount.</p>
        </div>
      )}
      {model.rateError && <p className="prototype-rate-error" role="alert">{model.rateError}</p>}
    </div>
  );
}

function UnitList({ model }) {
  return (
    <div className="prototype-unit-list">
      {model.unitValues.map(unit => (
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

function LegalNote() {
  return <p className="prototype-legal">Rates are informational and may differ from bank or cash-exchange quotes.</p>;
}
