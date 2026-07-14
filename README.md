# Dirham o Sserf

A Morocco-first money converter for global currencies, Moroccan Dirham, Ryal, and Franc.

## Release 1 features

- Bidirectional conversion between MAD and ten supported foreign currencies
- Searchable currency selection
- Fresh, stale, and estimated rate states with timestamps and source labels
- Six-hour local rate cache with an explicit refresh action
- Offline-safe bundled estimates when no fetched rate is available
- Quick amounts and copyable results
- Moroccan Unit Conversion using `1 MAD = 20 Ryal = 100 Franc`
- Responsive dark Moroccan-inspired interface
- Accessible labels, navigation state, keyboard focus, and live feedback

MAD is always one side of a Global Conversion. Arbitrary foreign-to-foreign pairs are intentionally outside the product scope.

## Supported foreign currencies

USD, EUR, GBP, JPY, INR, AED, SAR, BHD, EGP, and TND.

Live rates are provided by [open.er-api.com](https://open.er-api.com/). When a live rate cannot be fetched, the app clearly identifies whether it is using a cached stale rate or a bundled estimate.

## Local development

```bash
npm install
npm start
```

The development app runs at `http://localhost:3000`.

## Production build

```bash
npm run build
```

## Project structure

```text
src/
├── App.js
├── CurrencyConverter.jsx
├── GrandmaCounter.jsx
├── services/
│   └── exchangeRates.js
├── utils/
│   └── clipboard.js
└── index.css
```

Canonical product language and conversion concepts are documented in [`CONTEXT.md`](./CONTEXT.md).
