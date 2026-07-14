import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowDownUp,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Copy,
  Info,
  RefreshCw,
  Search,
  ShieldCheck,
  WifiOff,
  X,
} from 'lucide-react';
import { fetchRate, getAvailableRate, getStoredRate } from './services/exchangeRates';
import { copyText } from './utils/clipboard';

const CURRENCY_META = {
  MAD: { symbol: 'DH', name: 'Moroccan Dirham' },
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  JPY: { symbol: '¥', name: 'Japanese Yen' },
  INR: { symbol: '₹', name: 'Indian Rupee' },
  AED: { symbol: 'AED', name: 'UAE Dirham' },
  SAR: { symbol: 'SR', name: 'Saudi Riyal' },
  BHD: { symbol: 'BD', name: 'Bahraini Dinar' },
  EGP: { symbol: 'E£', name: 'Egyptian Pound' },
  TND: { symbol: 'DT', name: 'Tunisian Dinar' },
};

const FOREIGN_CURRENCIES = Object.keys(CURRENCY_META).filter(code => code !== 'MAD');
const QUICK_AMOUNTS = [10, 50, 100, 1000];
const PREFERENCES_KEY = 'serf_conversion_preferences_v1';
const RECENT_CURRENCIES_KEY = 'serf_recent_currencies_v1';

const getStoredPreferences = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(PREFERENCES_KEY));
    const fromSupported = Object.hasOwn(CURRENCY_META, stored?.fromCurrency);
    const toSupported = Object.hasOwn(CURRENCY_META, stored?.toCurrency);
    const hasMad = stored?.fromCurrency === 'MAD' || stored?.toCurrency === 'MAD';
    const isMixedPair = stored?.fromCurrency !== stored?.toCurrency;
    if (fromSupported && toSupported && hasMad && isMixedPair) return stored;
  } catch (_) {}
  return { fromCurrency: 'USD', toCurrency: 'MAD' };
};

const getRecentCurrencies = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(RECENT_CURRENCIES_KEY));
    if (Array.isArray(stored)) {
      return stored.filter(code => FOREIGN_CURRENCIES.includes(code)).slice(0, 3);
    }
  } catch (_) {}
  return [];
};

const sanitizeAmount = value => {
  const normalized = value.replace(',', '.').replace(/[^\d.]/g, '');
  const [whole = '', ...decimals] = normalized.split('.');
  return decimals.length ? `${whole}.${decimals.join('')}` : whole;
};

const formatValue = (value, currency) => {
  if (!Number.isFinite(value)) return '—';
  return value.toLocaleString('en-MA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: currency === 'JPY' ? 0 : 2,
  });
};

const formatRate = value => value.toLocaleString('en-MA', {
  minimumFractionDigits: 2,
  maximumFractionDigits: value < 1 ? 4 : 3,
});

const formatTime = timestamp => {
  if (!timestamp) return null;
  return new Intl.DateTimeFormat('en-MA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(timestamp);
};

const formatRelativeTime = timestamp => {
  if (!timestamp) return 'Using a bundled estimate';
  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
  if (elapsedMinutes < 1) return 'Updated just now';
  if (elapsedMinutes < 60) return `Updated ${elapsedMinutes}m ago`;
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `Updated ${elapsedHours}h ago`;
  const elapsedDays = Math.floor(elapsedHours / 24);
  return `Updated ${elapsedDays}d ago`;
};

export default function CurrencyConverter() {
  const [initialPreferences] = useState(getStoredPreferences);
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState(initialPreferences.fromCurrency);
  const [toCurrency, setToCurrency] = useState(initialPreferences.toCurrency);
  const foreignCurrency = fromCurrency === 'MAD' ? toCurrency : fromCurrency;
  const [rate, setRate] = useState(() => getAvailableRate(foreignCurrency));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [rateError, setRateError] = useState('');
  const [copiedKey, setCopiedKey] = useState('');

  const refreshRate = async currency => {
    const available = getAvailableRate(currency);
    setRate(available);
    setRateError('');
    setIsRefreshing(true);
    try {
      setRate(await fetchRate(currency));
    } catch (error) {
      setRateError('Could not refresh. The displayed rate is still available.');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const available = getAvailableRate(foreignCurrency);
    setRate(available);
    setRateError('');
    if (getStoredRate(foreignCurrency)?.status === 'fresh') {
      setIsRefreshing(false);
      return undefined;
    }

    const controller = new AbortController();
    setIsRefreshing(true);
    fetchRate(foreignCurrency, { signal: controller.signal })
      .then(setRate)
      .catch(error => {
        if (error.name !== 'AbortError') {
          setRateError('Could not refresh. The displayed rate is still available.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsRefreshing(false);
      });
    return () => controller.abort();
  }, [foreignCurrency]);

  useEffect(() => {
    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify({ fromCurrency, toCurrency }));
    } catch (_) {}
  }, [fromCurrency, toCurrency]);

  const numericAmount = Number.parseFloat(amount);
  const result = useMemo(() => {
    if (!Number.isFinite(numericAmount) || !rate?.value) return null;
    return fromCurrency === 'MAD'
      ? numericAmount / rate.value
      : numericAmount * rate.value;
  }, [fromCurrency, numericAmount, rate]);

  const madValue = fromCurrency === 'MAD' ? numericAmount : result;
  const resultText = result === null ? '—' : formatValue(result, toCurrency);
  const resultSizeClass = resultText.length > 18
    ? 'value-compact'
    : resultText.length > 12
      ? 'value-long'
      : '';

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setCopiedKey('');
  };

  const handleForeignChange = code => {
    if (fromCurrency === 'MAD') setToCurrency(code);
    else setFromCurrency(code);
    setCopiedKey('');
  };

  const copyValue = async (key, value, suffix) => {
    if (!value || value === '—') return;
    try {
      await copyText(`${value} ${suffix}`);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(''), 1800);
    } catch (_) {
      setCopiedKey('');
    }
  };

  return (
    <section className="page-shell" aria-labelledby="global-conversion-title">
      <div className="page-heading">
        <div className="eyebrow"><ShieldCheck size={13} /> Morocco-first rates</div>
        <h1 id="global-conversion-title">Global Conversion</h1>
        <p>MAD and the currencies that matter to you, with transparent rate freshness.</p>
      </div>

      <div className="conversion-panel">
        <div className="conversion-grid">
          <div className="money-field source-field">
            <div className="field-kicker">From</div>
            <div className="money-control">
              <div className="amount-entry">
                <input
                  aria-label={`Amount in ${CURRENCY_META[fromCurrency].name}`}
                  inputMode="decimal"
                  autoComplete="off"
                  value={amount}
                  onChange={event => setAmount(sanitizeAmount(event.target.value))}
                  placeholder="0"
                />
                {amount && (
                  <button type="button" onClick={() => setAmount('')} aria-label="Clear amount">
                    <X size={15} />
                  </button>
                )}
              </div>
              {fromCurrency === 'MAD' ? (
                <LockedCurrency code="MAD" />
              ) : (
                <CurrencyPicker value={foreignCurrency} onChange={handleForeignChange} />
              )}
            </div>
          </div>

          <div className="swap-wrap">
            <button className="swap-button" type="button" onClick={handleSwap} aria-label="Swap conversion direction">
              <ArrowDownUp size={18} />
            </button>
          </div>

          <div className="money-field result-field">
            <div className="field-kicker">To</div>
            <div className="money-control result-control">
              <output
                className={resultSizeClass}
                aria-live="polite"
                aria-label={`Result in ${CURRENCY_META[toCurrency].name}`}
              >
                {resultText}
              </output>
              {toCurrency === 'MAD' ? (
                <LockedCurrency code="MAD" />
              ) : (
                <CurrencyPicker value={foreignCurrency} onChange={handleForeignChange} />
              )}
            </div>
            <button
              className="copy-result"
              type="button"
              disabled={result === null}
              onClick={() => copyValue('result', resultText, toCurrency)}
            >
              {copiedKey === 'result' ? <Check size={14} /> : <Copy size={14} />}
              {copiedKey === 'result' ? 'Copied' : 'Copy result'}
            </button>
          </div>
        </div>

        <div className="conversion-actions">
          <span>Quick amount</span>
          <div className="quick-amounts" aria-label="Quick amounts">
            {QUICK_AMOUNTS.map(value => (
              <button
                key={value}
                type="button"
                aria-pressed={amount === String(value)}
                onClick={() => setAmount(String(value))}
              >
                {value.toLocaleString('en-MA')}
              </button>
            ))}
          </div>
        </div>

        <RateStatus
          currency={foreignCurrency}
          rate={rate}
          isRefreshing={isRefreshing}
          error={rateError}
          onRefresh={() => refreshRate(foreignCurrency)}
        />

        <div className="unit-breakdown" aria-label="Moroccan unit breakdown">
          <div className="breakdown-heading">
            <span>Moroccan units</span>
            <small>Based on the MAD side of this conversion</small>
          </div>
          <UnitResult
            label="Dirham"
            value={Number.isFinite(madValue) ? formatValue(madValue, 'MAD') : '—'}
            suffix="MAD"
            copied={copiedKey === 'mad'}
            onCopy={() => copyValue('mad', formatValue(madValue, 'MAD'), 'MAD')}
          />
          <UnitResult
            label="Ryal"
            value={Number.isFinite(madValue) ? Math.round(madValue * 20).toLocaleString('en-MA') : '—'}
            suffix="Ryal"
            copied={copiedKey === 'ryal'}
            onCopy={() => copyValue('ryal', Math.round(madValue * 20).toLocaleString('en-MA'), 'Ryal')}
          />
          <UnitResult
            label="Franc"
            value={Number.isFinite(madValue) ? Math.round(madValue * 100).toLocaleString('en-MA') : '—'}
            suffix="Franc"
            copied={copiedKey === 'franc'}
            onCopy={() => copyValue('franc', Math.round(madValue * 100).toLocaleString('en-MA'), 'Franc')}
          />
        </div>
      </div>

      <p className="page-footnote">Rates are informational and may differ from bank or cash-exchange quotes.</p>
      <span className="sr-only" aria-live="polite">{copiedKey ? 'Value copied to clipboard' : ''}</span>
    </section>
  );
}

function CurrencyPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [recentCurrencies, setRecentCurrencies] = useState(getRecentCurrencies);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const rootRef = useRef(null);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const triggerRef = useRef(null);

  const filtered = FOREIGN_CURRENCIES.filter(code => {
    const search = `${code} ${CURRENCY_META[code].name}`.toLowerCase();
    return search.includes(query.trim().toLowerCase());
  });

  useEffect(() => {
    const closeOnOutsideClick = event => {
      if (
        !rootRef.current?.contains(event.target)
        && !menuRef.current?.contains(event.target)
      ) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    const lockBackground = window.matchMedia('(max-width: 600px)').matches;
    if (lockBackground) document.body.style.overflow = 'hidden';
    searchRef.current?.focus({ preventScroll: true });
    return () => {
      if (lockBackground) document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const choose = code => {
    const nextRecent = [code, ...recentCurrencies.filter(item => item !== code)].slice(0, 3);
    setRecentCurrencies(nextRecent);
    try { localStorage.setItem(RECENT_CURRENCIES_KEY, JSON.stringify(nextRecent)); } catch (_) {}
    onChange(code);
    setOpen(false);
    setQuery('');
    window.requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }));
  };

  const closeMenu = (returnFocus = false) => {
    setOpen(false);
    setQuery('');
    if (returnFocus) {
      window.requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }));
    }
  };

  const toggleMenu = () => {
    if (open) {
      closeMenu(false);
      return;
    }
    if (!open && rootRef.current) {
      const rect = rootRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 10,
        left: Math.max(12, Math.min(rect.left, window.innerWidth - 302)),
      });
    }
    setOpen(true);
  };

  const handleMenuKeyDown = event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu(true);
      return;
    }
    if (event.key !== 'Tab' || !menuRef.current) return;
    const focusable = Array.from(menuRef.current.querySelectorAll('button:not([disabled]), input:not([disabled])'));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const visibleRecent = query ? [] : recentCurrencies.filter(code => filtered.includes(code));
  const visibleAll = query ? filtered : filtered.filter(code => !visibleRecent.includes(code));

  const renderOption = code => (
    <button
      key={code}
      type="button"
      role="option"
      aria-selected={code === value}
      onClick={() => choose(code)}
    >
      <span className="currency-symbol">{CURRENCY_META[code].symbol}</span>
      <span><strong>{code}</strong><small>{CURRENCY_META[code].name}</small></span>
      {code === value && <CheckCircle2 size={16} />}
    </button>
  );

  const menu = (
    <div
      className="currency-popover-layer"
      onMouseDown={event => event.target === event.currentTarget && closeMenu(false)}
    >
      <div
        className="currency-menu"
        ref={menuRef}
        style={{ top: menuPosition.top, left: menuPosition.left }}
        onKeyDown={handleMenuKeyDown}
      >
        <div className="currency-menu-header">
          <div>
            <strong>Choose currency</strong>
            <span>MAD stays on the other side</span>
          </div>
          <button type="button" onClick={() => closeMenu(true)} aria-label="Close currency picker">
            <X size={16} />
          </button>
        </div>
        <div className="currency-search">
          <Search size={15} />
          <input
            ref={searchRef}
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search currency"
            aria-label="Search currencies"
          />
          {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search"><X size={14} /></button>}
        </div>
        <div className="currency-options" role="listbox" aria-label="Foreign currencies">
          {visibleRecent.length > 0 && <div className="currency-group-label">Recent</div>}
          {visibleRecent.map(renderOption)}
          {visibleRecent.length > 0 && visibleAll.length > 0 && <div className="currency-group-label">All currencies</div>}
          {visibleAll.map(renderOption)}
          {!filtered.length && <p>No matching currency</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="currency-picker" ref={rootRef}>
      <button
        className="currency-trigger"
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggleMenu}
      >
        <span className="currency-symbol">{CURRENCY_META[value].symbol}</span>
        <span><strong>{value}</strong><small>{CURRENCY_META[value].name}</small></span>
        <ChevronDown size={16} />
      </button>

      {open && createPortal(menu, document.body)}
    </div>
  );
}

function LockedCurrency({ code }) {
  return (
    <div className="locked-currency" aria-label={CURRENCY_META[code].name}>
      <span className="currency-symbol">{CURRENCY_META[code].symbol}</span>
      <span><strong>{code}</strong><small>{CURRENCY_META[code].name}</small></span>
    </div>
  );
}

function RateStatus({ currency, rate, isRefreshing, error, onRefresh }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const status = rate?.status || 'estimated';
  const statusLabel = status === 'fresh' ? 'Fresh rate' : status === 'stale' ? 'Stale rate' : 'Estimated rate';
  const StatusIcon = status === 'fresh' ? CheckCircle2 : status === 'stale' ? Clock3 : WifiOff;
  const canRefresh = status !== 'fresh' || Boolean(error);

  return (
    <div className={`rate-status ${status}`} role="status">
      <div className="rate-state">
        <StatusIcon size={16} />
        <div>
          <strong>{statusLabel}</strong>
          <span>{isRefreshing ? 'Checking for a newer rate…' : formatRelativeTime(rate?.fetchedAt)}</span>
        </div>
      </div>
      <div className="rate-quote">
        <span>1 {currency}</span>
        <strong>{formatRate(rate.value)} MAD</strong>
      </div>
      <div className="rate-controls">
        <button
          type="button"
          className="rate-info-button"
          aria-label="Show rate details"
          aria-expanded={detailsOpen}
          onClick={() => setDetailsOpen(current => !current)}
        >
          <Info size={15} />
        </button>
        {canRefresh && (
          <button type="button" className="rate-refresh-button" onClick={onRefresh} disabled={isRefreshing}>
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{error ? 'Retry' : isRefreshing ? 'Updating' : 'Update'}</span>
          </button>
        )}
      </div>
      {detailsOpen && (
        <div className="rate-details">
          <div><span>Provider</span><strong>{rate?.source}</strong></div>
          <div><span>Last update</span><strong>{rate?.fetchedAt ? formatTime(rate.fetchedAt) : 'Bundled estimate'}</strong></div>
          <p>Informational rate only. Banks and cash offices may quote a different amount.</p>
        </div>
      )}
      {error && <p className="rate-error">{error}</p>}
    </div>
  );
}

function UnitResult({ label, value, suffix, copied, onCopy }) {
  return (
    <button className="unit-result" type="button" onClick={onCopy} disabled={value === '—'} aria-label={`Copy ${label} value`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{suffix}</small>
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}
