/**
 * All-American hero banner with stars top-left behind text
 * and flowing flag stripes diagonal bottom-right.
 */
export default function PageHeroBanner({ icon, eyebrow, title, subtitle, tags = [], children }) {
  return (
    <div className="mb-8 relative overflow-hidden rounded-2xl shadow-lg min-h-[180px]"
      style={{ background: 'linear-gradient(135deg, #0A3161 0%, #0d3d7a 40%, #0A3161 100%)' }}>

      {/* ── Stars field: fills top area behind text and above stripes ── */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none select-none" style={{ height: '100%' }}>
        <div className="absolute inset-0 opacity-[0.18]">
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

      {/* ── Flowing flag stripes: diagonal bottom-right ── */}
      <div className="absolute bottom-0 right-0 pointer-events-none select-none overflow-hidden"
        style={{ width: '55%', height: '100%' }}>
        <div className="absolute inset-0"
          style={{
            transform: 'rotate(-18deg) translateX(5%) translateY(15%)',
            transformOrigin: 'bottom right',
          }}>
          {[...Array(15)].map((_, i) => (
            <div key={i}
              style={{
                height: '20px',
                width: '250%',
                marginLeft: '-30%',
                background: i % 2 === 0 ? '#B22234' : '#FFFFFF',
              }}
            />
          ))}
        </div>
        {/* Fade-out gradient so stripes blend into navy on the left/top edges */}
        <div className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, #0A3161 0%, #0A3161 10%, transparent 45%), linear-gradient(to bottom, #0A3161 0%, transparent 30%)',
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