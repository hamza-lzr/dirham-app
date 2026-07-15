// PROTOTYPE: Three logo directions, switchable with ?variant=A|B|C on the real Global route.
import React, { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import './logo-prototype.css';

export const LOGO_VARIANTS = ['A', 'B', 'C'];

export const LOGO_VARIANT_META = {
  A: {
    name: 'Zellige Ligature',
    idea: 'Compact, ownable, and closest to the selected Moroccan-modern system.',
    traits: ['Distinct at 16px', 'Strong app icon', 'Quietly Moroccan'],
  },
  B: {
    name: 'Open Arch',
    idea: 'A more architectural signature inspired by Moroccan doorways and passage.',
    traits: ['Premium character', 'Open and welcoming', 'Editorial lockup'],
  },
  C: {
    name: 'Dirham Compass',
    idea: 'A letter-free seal built around an exchange knot: two directions, one clear pivot.',
    traits: ['No initials', 'Exchange at the core', 'Recognizable silhouette'],
  },
};

export function LogoMark({ variant = 'A', className = '', title }) {
  const label = title || `${LOGO_VARIANT_META[variant].name} logo`;

  if (variant === 'B') {
    return (
      <svg className={`logo-mark-svg logo-mark-b ${className}`} viewBox="0 0 64 64" role="img" aria-label={label}>
        <path className="logo-arch-fill" d="M10 58V30C10 14.5 19.6 5 32 5s22 9.5 22 25v28H10Z" />
        <path className="logo-arch-line" d="M18 55V30c0-10.3 5.7-17 14-17s14 6.7 14 17v25" />
        <path className="logo-b-d" d="M24 23v20h6.2c6.8 0 10.8-3.9 10.8-10s-4-10-10.8-10H24Zm6 5h.5c3.5 0 5.4 1.8 5.4 5s-1.9 5-5.4 5H30V28Z" />
        <path className="logo-b-s" d="M39.5 22.5c-2.1-1.1-4.5-1.7-7-1.7-4.9 0-8 2.4-8 6.1 0 3.2 2.2 4.8 6.6 6.1 2.4.7 3.2 1.2 3.2 2.2 0 1.1-1.1 1.8-3 1.8-2.2 0-4.6-.7-6.8-2v5.7c2.1 1.1 4.6 1.7 7.3 1.7 5.1 0 8.3-2.5 8.3-6.5 0-3.1-2-4.8-6.5-6.2-2.5-.8-3.4-1.2-3.4-2.1 0-1 .9-1.5 2.7-1.5 2.1 0 4.4.7 6.6 2v-5.6Z" />
      </svg>
    );
  }

  if (variant === 'C') {
    return (
      <svg className={`logo-mark-svg logo-mark-c ${className}`} viewBox="0 0 64 64" role="img" aria-label={label}>
        <circle className="logo-compass-ring" cx="32" cy="32" r="27" />
        <path className="logo-compass-star" d="m32 8 5.8 10.2L49 15l-3.2 11.2L56 32l-10.2 5.8L49 49l-11.2-3.2L32 56l-5.8-10.2L15 49l3.2-11.2L8 32l10.2-5.8L15 15l11.2 3.2L32 8Z" />
        <circle className="logo-compass-core" cx="32" cy="32" r="14" />
        <path className="logo-c-exchange" d="M21.5 28c4.8-4 11.6-4.3 19-1m-4.4-4.2 4.4 4.2-5.2 3.2M42.5 36c-4.8 4-11.6 4.3-19 1m5.2 4-5.2-4 4.4-4.2" />
        <path className="logo-c-pivot" d="m32 29.2 2.8 2.8-2.8 2.8-2.8-2.8 2.8-2.8Z" />
      </svg>
    );
  }

  return (
    <svg className={`logo-mark-svg logo-mark-a ${className}`} viewBox="0 0 64 64" role="img" aria-label={label}>
      <path className="logo-tile" d="M18 3h28l15 15v28L46 61H18L3 46V18L18 3Z" />
      <path className="logo-tile-inset" d="M20.5 10h23L54 20.5v23L43.5 54h-23L10 43.5v-23L20.5 10Z" />
      <path className="logo-a-d" d="M18 21v22h8.2c7.8 0 12.6-4.2 12.6-11s-4.8-11-12.6-11H18Zm7.1 5.4h1c3.5 0 5.5 2 5.5 5.6s-2 5.6-5.5 5.6h-1V26.4Z" />
      <path className="logo-a-s" d="M45.8 21.4c-2.2-1-4.6-1.5-7.1-1.5-4.7 0-7.8 2.3-7.8 5.9 0 3 2 4.6 6.3 5.9 2.3.7 3.1 1.1 3.1 2.1 0 1.1-1 1.7-2.9 1.7-2.2 0-4.5-.7-6.7-1.9V39c2.1 1.1 4.6 1.7 7.2 1.7 5 0 8.1-2.5 8.1-6.3 0-3-2-4.6-6.4-6-2.4-.7-3.2-1.1-3.2-2 0-.9.9-1.4 2.6-1.4 2 0 4.3.6 6.8 1.8v-5.4Z" />
    </svg>
  );
}

export default function LogoPrototype({ variant, onSelect }) {
  const meta = LOGO_VARIANT_META[variant];
  const variantRef = useRef(variant);
  const selectRef = useRef(onSelect);
  variantRef.current = variant;
  selectRef.current = onSelect;

  const move = direction => {
    const index = LOGO_VARIANTS.indexOf(variant);
    onSelect(LOGO_VARIANTS[(index + direction + LOGO_VARIANTS.length) % LOGO_VARIANTS.length]);
  };

  useEffect(() => {
    const onKeyDown = event => {
      const target = event.target;
      const isEditing = target instanceof HTMLElement
        && (target.matches('input, textarea, select') || target.isContentEditable);
      if (isEditing || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        const index = LOGO_VARIANTS.indexOf(variantRef.current);
        selectRef.current(LOGO_VARIANTS[(index - 1 + LOGO_VARIANTS.length) % LOGO_VARIANTS.length]);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        const index = LOGO_VARIANTS.indexOf(variantRef.current);
        selectRef.current(LOGO_VARIANTS[(index + 1) % LOGO_VARIANTS.length]);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <section className="logo-prototype" aria-labelledby="logo-prototype-title">
      <div className="logo-prototype-heading">
        <div>
          <p>Brand exploration · {variant} of 3</p>
          <h1 id="logo-prototype-title">{meta.name}</h1>
        </div>
        <p>{meta.idea}</p>
      </div>

      <div className="logo-prototype-board">
        <div className="logo-hero-swatch">
          <LogoMark variant={variant} className="logo-size-hero" />
          <span>Primary mark</span>
        </div>

        <div className="logo-context-stack">
          <div className="logo-lockup-preview">
            <LogoMark variant={variant} className="logo-size-lockup" />
            <div><strong>Dirham o Sserf</strong><small>Morocco-first money guide</small></div>
          </div>
          <div className="logo-scale-preview" aria-label="Logo size comparison">
            <div><LogoMark variant={variant} className="logo-size-16" /><span>16</span></div>
            <div><LogoMark variant={variant} className="logo-size-32" /><span>32</span></div>
            <div><LogoMark variant={variant} className="logo-size-64" /><span>64</span></div>
          </div>
        </div>

        <div className="logo-browser-preview">
          <div className="logo-browser-top"><i /><i /><i /><span>dirham-sserf.ma</span></div>
          <div className="logo-browser-tab"><LogoMark variant={variant} className="logo-size-16" /><strong>Dirham o Sserf</strong></div>
          <ul>{meta.traits.map(trait => <li key={trait}>{trait}</li>)}</ul>
        </div>
      </div>

      <div className="logo-prototype-switcher" role="group" aria-label="Logo prototype switcher">
        <button type="button" onClick={() => move(-1)} aria-label="Previous logo variant" aria-keyshortcuts="ArrowLeft">
          <ArrowLeft size={17} />
        </button>
        <div aria-live="polite"><small>Direction {variant}</small><strong>{meta.name}</strong></div>
        <button type="button" onClick={() => move(1)} aria-label="Next logo variant" aria-keyshortcuts="ArrowRight">
          <ArrowRight size={17} />
        </button>
      </div>
    </section>
  );
}
