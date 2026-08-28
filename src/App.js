import React, { useEffect, useState } from 'react';
import { ArrowLeftRight, Coins, Moon, Sun } from 'lucide-react';
import CurrencyConverter from './CurrencyConverter';
import GrandmaCounter from './GrandmaCounter';
import './App.css';

const TOOL_ROUTES = {
  global: '#/global',
  units: '#/local-units',
};

const THEME_KEY = 'serf_theme_v1';

const getInitialTheme = () => {
  const documentTheme = document.documentElement.dataset.theme;
  if (documentTheme === 'light' || documentTheme === 'dark') return documentTheme;
  try {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
  } catch (_) {}
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getToolFromUrl = () => (
  window.location.hash === TOOL_ROUTES.units ? 'units' : 'global'
);

function App() {
  const [activeTool, setActiveTool] = useState(getToolFromUrl);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const knownRoute = Object.values(TOOL_ROUTES).includes(window.location.hash);
    if (!knownRoute) window.history.replaceState(null, '', TOOL_ROUTES.global);

    const syncToolWithUrl = () => setActiveTool(getToolFromUrl());
    window.addEventListener('hashchange', syncToolWithUrl);
    return () => window.removeEventListener('hashchange', syncToolWithUrl);
  }, []);

  useEffect(() => {
    document.title = activeTool === 'global'
      ? 'Global Conversion · Dirham o Sserf'
      : 'Moroccan Units · Dirham o Sserf';
  }, [activeTool]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      theme === 'dark' ? '#0d211b' : '#f3eee3'
    );
    try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}
  }, [theme]);

  return (
    <div className="app-frame">
      <div className="moroccan-pattern">
        <a
          className="skip-link"
          href="#main-content"
          onClick={event => {
            event.preventDefault();
            document.getElementById('main-content')?.focus({ preventScroll: true });
          }}
        >
          Skip to content
        </a>
        <header className="app-header">
          <div className="header-inner">
            <a className="wordmark" href={TOOL_ROUTES.global} aria-label="Dirham o Sserf home">
              <span className="wordmark-copy">
                <strong>Dirham o Sserf</strong>
                <small>Morocco-first money converter</small>
              </span>
            </a>

            <div className="header-actions">
              <nav className="tool-nav" aria-label="Conversion tools">
                <NavTab
                  active={activeTool === 'global'}
                  href={TOOL_ROUTES.global}
                  icon={<ArrowLeftRight size={15} />}
                  label="Convert"
                  compactLabel="Convert"
                />
                <NavTab
                  active={activeTool === 'units'}
                  href={TOOL_ROUTES.units}
                  icon={<Coins size={15} />}
                  label="Local units"
                  compactLabel="Units"
                />
              </nav>
              <button
                className="theme-toggle"
                type="button"
                onClick={() => setTheme(current => current === 'dark' ? 'light' : 'dark')}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
              </button>
            </div>
          </div>
        </header>

        <main id="main-content" tabIndex={-1}>
          <div key={activeTool} className="animate-fade-in">
            {activeTool === 'global' ? <CurrencyConverter /> : <GrandmaCounter />}
          </div>
        </main>
      </div>
    </div>
  );
}

function NavTab({ active, href, icon, label, compactLabel = label }) {
  return (
    <a
      href={href}
      aria-current={active ? 'page' : undefined}
      className={active ? 'tool-tab active' : 'tool-tab'}
    >
      {icon}
      <span className="tool-tab-label-full">{label}</span>
      <span className="tool-tab-label-compact">{compactLabel}</span>
    </a>
  );
}

export default App;
