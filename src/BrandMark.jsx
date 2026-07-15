import React from 'react';

export default function BrandMark({ className = '' }) {
  return (
    <svg
      className={`brand-mark ${className}`}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <circle className="brand-mark-ring" cx="32" cy="32" r="27" />
      <path className="brand-mark-star" d="m32 8 5.8 10.2L49 15l-3.2 11.2L56 32l-10.2 5.8L49 49l-11.2-3.2L32 56l-5.8-10.2L15 49l3.2-11.2L8 32l10.2-5.8L15 15l11.2 3.2L32 8Z" />
      <circle className="brand-mark-core" cx="32" cy="32" r="14" />
      <path className="brand-mark-exchange" d="M21.5 28c4.8-4 11.6-4.3 19-1m-4.4-4.2 4.4 4.2-5.2 3.2M42.5 36c-4.8 4-11.6 4.3-19 1m5.2 4-5.2-4 4.4-4.2" />
      <path className="brand-mark-pivot" d="m32 29.2 2.8 2.8-2.8 2.8-2.8-2.8 2.8-2.8Z" />
    </svg>
  );
}
