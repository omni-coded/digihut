/**
 * DigiHut mark: a shop-front inside a location pin, with a signal above it.
 * tone="light" for light backgrounds, tone="dark" for the green brand surfaces.
 */
export function LogoMark({ tone = 'light', className = 'h-10 w-auto' }) {
  const c =
    tone === 'dark'
      ? { pin: '#F5D547', signal: '#F5D547', awning: '#123D2B', body: '#FFFFFF', door: '#123D2B' }
      : { pin: '#123D2B', signal: '#1F6041', awning: '#F5D547', body: '#FFFFFF', door: '#123D2B' };
  return (
    <svg viewBox="8 4 32 55" className={className} aria-hidden="true" focusable="false">
      <circle cx="24" cy="16" r="2" fill={c.signal} />
      <path d="M20.5 12.5a5 5 0 0 1 7 0" fill="none" stroke={c.signal} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M17 9a10 10 0 0 1 14 0" fill="none" stroke={c.signal} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M24 57S9 44 9 35.5a15 15 0 0 1 30 0C39 44 24 57 24 57Z" fill={c.pin} />
      <rect x="16.5" y="33" width="15" height="9" fill={c.body} />
      <path d="M15.5 29h17v4h-17z" fill={c.awning} />
      <path d="M15.5 33a2.83 2.83 0 0 0 5.67 0a2.83 2.83 0 0 0 5.66 0a2.83 2.83 0 0 0 5.67 0z" fill={c.awning} />
      <rect x="21.75" y="36" width="4.5" height="6" rx="0.6" fill={c.door} />
    </svg>
  );
}

export default function Logo({ tone = 'light', className = '', markClass = 'h-10 w-auto', wordClass = 'text-[1.6rem]' }) {
  const word = tone === 'dark' ? 'text-white' : 'text-forest';
  const accent = tone === 'dark' ? 'text-sun' : 'text-leaf';
  return (
    <span className={`inline-flex items-center gap-[8px] ${className}`}>
      <LogoMark tone={tone} className={markClass} />
      <span className={`font-display ${wordClass} font-extrabold leading-none tracking-tight ${word}`} style={{ fontStretch: '115%' }} lang="en">
        Digi<span className={accent}>Hut</span>
      </span>
    </span>
  );
}
