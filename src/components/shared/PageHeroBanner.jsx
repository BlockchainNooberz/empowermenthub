/**
 * All-American hero banner with stars top-left behind text
 * and flowing flag stripes diagonal bottom-right.
 */
export default function PageHeroBanner({ icon, eyebrow, title, subtitle, tags = [], children }) {
  return (
    <div className="mb-8 relative overflow-hidden rounded-2xl shadow-lg min-h-[180px]"
      style={{ background: 'linear-gradient(135deg, #0A3161 0%, #0d3d7a 40%, #0A3161 100%)' }}>

      {/* ── Stars field: top-left, behind text ── */}
      <div className="absolute top-0 left-0 pointer-events-none select-none" style={{ width: '260px', height: '160px' }}>
        <div className="absolute inset-0 opacity-[0.12]">
          {[...Array(7)].map((_, row) => (
            <div key={row} className="flex gap-[14px] ml-3" style={{ marginTop: row === 0 ? '10px' : '4px' }}>
              {[...Array(row % 2 === 0 ? 6 : 5)].map((_, col) => (
                <span key={col} className="text-white text-[15px] leading-none"
                  style={{ marginLeft: row % 2 === 0 ? 0 : '7px' }}>★</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Flowing flag stripes: diagonal bottom-right ── */}
      <div className="absolute bottom-0 right-0 pointer-events-none select-none overflow-hidden"
        style={{ width: '55%', height: '100%' }}>
        <div className="absolute inset-0"
          style={{
            transform: 'rotate(-15deg) translateX(10%) translateY(25%)',
            transformOrigin: 'center center',
          }}>
          {[...Array(9)].map((_, i) => (
            <div key={i}
              style={{
                height: '18px',
                width: '200%',
                marginLeft: '-20%',
                background: i % 2 === 0
                  ? 'rgba(178, 34, 52, 0.35)'
                  : 'rgba(255, 255, 255, 0.08)',
                borderRadius: '2px',
              }}
            />
          ))}
        </div>
        {/* Fade-out gradient so stripes blend into navy */}
        <div className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, #0A3161 0%, transparent 40%), linear-gradient(to top, transparent 0%, #0A3161 95%)',
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="pl-7 pr-6 py-7 relative z-10">
        {eyebrow && (
          <div className="flex items-center gap-2 mb-2">
            {icon && <span className="text-accent text-lg">{icon}</span>}
            <span className="text-xs font-semibold text-accent uppercase tracking-widest">{eyebrow}</span>
          </div>
        )}
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white tracking-tight leading-tight mb-2 drop-shadow-sm">
          {title}
        </h1>
        {subtitle && (
          <p className="text-white/75 text-sm max-w-2xl mb-3">{subtitle}</p>
        )}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map(tag => (
              <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/15 text-white border border-white/30">
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