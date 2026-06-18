/**
 * All-American hero banner — subtle flag accents, clear readable text.
 */
export default function PageHeroBanner({ icon, eyebrow, title, subtitle, tags = [], children }) {
  return (
    <div className="mb-8 relative overflow-hidden rounded-2xl shadow-lg min-h-[160px]"
      style={{ background: 'linear-gradient(135deg, #081f3d 0%, #0d2d5e 50%, #0a2448 100%)' }}>

      {/* ── Subtle stars: very faint, full width top ── */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none select-none" style={{ height: '100%' }}>
        <div className="absolute inset-0 opacity-[0.07]">
          {[...Array(6)].map((_, row) => (
            <div key={row} className="flex ml-3" style={{ marginTop: row === 0 ? '6px' : '2px', gap: '12px' }}>
              {[...Array(row % 2 === 0 ? 10 : 9)].map((_, col) => (
                <span key={col} className="text-white leading-none"
                  style={{ fontSize: '44px', marginLeft: row % 2 === 0 ? 0 : '16px' }}>★</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Diagonal stripes: solid on right, fade left to ~45% ── */}
      <div className="absolute top-0 right-0 bottom-0 pointer-events-none select-none overflow-hidden" style={{ width: '60%' }}>
        {/* The stripe block */}
        <div className="absolute inset-0" style={{
          transform: 'rotate(-15deg) translateX(8%) translateY(-5%) scaleY(1.4)',
          transformOrigin: 'right center',
        }}>
          {[...Array(18)].map((_, i) => (
            <div key={i} style={{
              height: '20px',
              width: '120%',
              marginLeft: '-10%',
              background: i % 2 === 0 ? '#B22234' : '#FFFFFF',
            }} />
          ))}
        </div>
        {/* Fade gradient: solid on right, transparent by ~45% from left */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to right, transparent 0%, transparent 40%, rgba(8,24,56,0.15) 55%, rgba(8,24,56,0) 70%)',
        }} />
        {/* Left fade into banner bg */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to left, transparent 40%, #081828 90%)',
        }} />
      </div>

      {/* ── Red accent top border ── */}
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(to right, #B22234, #cc2a3d, #B22234)' }} />

      {/* ── Content ── */}
      <div className="pl-7 pr-10 py-7 relative z-10">
        {eyebrow && (
          <div className="flex items-center gap-2 mb-2">
            {icon && <span className="text-accent text-lg">{icon}</span>}
            <span className="text-xs font-semibold text-accent uppercase tracking-widest">{eyebrow}</span>
          </div>
        )}
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white tracking-tight leading-tight mb-2"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-white/80 text-sm max-w-2xl mb-3">{subtitle}</p>
        )}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map(tag => (
              <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 text-white/90 border border-white/20">
                {tag}
              </span>
            ))}
          </div>
        )}
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
}