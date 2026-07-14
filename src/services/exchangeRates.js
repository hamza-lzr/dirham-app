export const RATE_FRESHNESS_MS = 6 * 60 * 60 * 1000;

export const ESTIMATED_MAD_RATES = {
  USD: 10.5,
  EUR: 11.5,
  GBP: 13.2,
  JPY: 0.072,
  INR: 0.126,
  AED: 2.86,
  SAR: 2.8,
  BHD: 27.9,
  EGP: 0.34,
  TND: 3.4,
};

const cacheKey = currency => `serf_rate_v1_${currency}`;

export function getStoredRate(currency, now = Date.now()) {
  try {
    const stored = JSON.parse(localStorage.getItem(cacheKey(currency)));
    if (!stored || !Number.isFinite(stored.value) || !Number.isFinite(stored.fetchedAt)) {
      return null;
    }

    return {
      value: stored.value,
      fetchedAt: stored.fetchedAt,
      status: now - stored.fetchedAt <= RATE_FRESHNESS_MS ? 'fresh' : 'stale',
      source: 'open.er-api.com',
    };
  } catch (_) {
    return null;
  }
}

export function getAvailableRate(currency, now = Date.now()) {
  const stored = getStoredRate(currency, now);
  if (stored) return stored;

  return {
    value: ESTIMATED_MAD_RATES[currency],
    fetchedAt: null,
    status: 'estimated',
    source: 'Bundled estimate',
  };
}

export async function fetchRate(currency, { signal } = {}) {
  const response = await fetch(`https://open.er-api.com/v6/latest/${currency}`, { signal });
  if (!response.ok) throw new Error('The rate provider did not respond.');

  const data = await response.json();
  const value = Number(data?.rates?.MAD);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error('The rate provider returned an invalid rate.');
  }

  const fetchedAt = Date.now();
  const rate = {
    value,
    fetchedAt,
    status: 'fresh',
    source: 'open.er-api.com',
  };

  try {
    localStorage.setItem(cacheKey(currency), JSON.stringify({ value, fetchedAt }));
  } catch (_) {}

  return rate;
}
