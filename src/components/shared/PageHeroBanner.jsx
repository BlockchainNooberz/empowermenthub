/**
 * Reusable All-American hero banner for page headers.
 * Replaces plain PageHeader on pages that want the patriotic navy/red/white design.
 */
export default function PageHeroBanner({ icon, eyebrow, title, subtitle, tags = [], children }) {
  return (
    <div className="mb-8 relative overflow-hidden rounded-2xl shadow-lg" style={{ background: 'linear-gradient(135deg, #0A3161 0%, #0d3d7a 50%, #0A3161 100%)' }}>
      {/* Red left stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-b from-red-500 via-red-600 to-red-700 rounded-l-2xl" />
      {/* White thin stripe */}
      <div className="absolute left-3 top-0 bottom-0 w-1 bg-white/20" />
      {/* Stars field */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute right-4 top-0 bottom-0 flex flex-col justify-center gap-3 opacity-20">
          {[0,1,2,3,4].map(row => (
            <div key={row} className="flex gap-4">
              {[0,1,2,3,4,5].map(col => (
                <span key={col} className="text-white text-xl leading-none">★</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="pl-7 pr-6 py-7 relative z-10">
        {eyebrow && (
          <div className="flex items-center gap-2 mb-2">
            {icon && <span className="text-accent">{icon}</span>}
            <span className="text-xs font-semibold text-accent uppercase tracking-widest">{eyebrow}</span>
          </div>
        )}
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white tracking-tight leading-tight mb-2">
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