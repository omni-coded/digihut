/** Consistent section heading block. `tone="dark"` for green sections. */
export default function SectionHeading({ id, title, intro, tone = 'light', align = 'left', className = '', children }) {
  const titleColor = tone === 'dark' ? 'text-white' : 'text-forest';
  const introColor = tone === 'dark' ? 'text-on-dark' : 'text-muted';
  const alignment = align === 'center' ? 'mx-auto text-center' : '';
  return (
    <div className={`reveal max-w-[44rem] ${alignment} ${className}`}>
      <h2 id={id} className={`h-section ${titleColor}`}>
        {title}
      </h2>
      {intro && <p className={`mt-4 text-[1.125rem] leading-relaxed ${introColor}`}>{intro}</p>}
      {children}
    </div>
  );
}
