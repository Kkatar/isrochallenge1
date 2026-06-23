import { Satellite, Zap, Bell, Settings, Wifi, ChevronDown } from 'lucide-react'

const LAYER_OPTS = [
  { id: 'optical', label: 'Optical',        color: 'neon-green', dot: '#00ff88' },
  { id: 'sar',     label: 'SAR Radar',      color: 'sar-blue',   dot: '#00c6ff' },
  { id: 'fused',   label: 'AI Fused',       color: 'neon-amber', dot: '#ffb300' },
]

/**
 * Top navigation bar with logo, layer switcher, live status, and controls.
 */
export default function Header({ activeLayer, onLayerChange, drawMode, onToggleDrawMode, user, onLogout }) {
  return (
    <header
      id="app-header"
      className="absolute top-0 left-0 right-0 z-50 h-14 glass flex items-center px-4 gap-4"
      style={{ borderBottom: '1px solid rgba(0,255,136,0.12)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 min-w-max">
        <div className="relative">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, rgba(0,255,136,0.2), rgba(0,198,255,0.2))',
                        border: '1px solid rgba(0,255,136,0.4)' }}>
            <Satellite size={16} className="text-neon" />
          </div>
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-400 pulse-dot" />
        </div>
        <div>
          <span className="font-bold text-white text-sm tracking-wide">AgroSense</span>
          <span className="text-neon font-bold text-sm"> AI</span>
        </div>
        <span className="hidden md:block text-xs text-gray-500 ml-1">Precision Agriculture Platform</span>
      </div>

      {/* Layer switcher */}
      <div className="flex-1 flex justify-center">
        <div className="flex items-center gap-1 p-1 rounded-xl"
             style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {LAYER_OPTS.map(l => (
            <button
              key={l.id}
              id={`layer-btn-${l.id}`}
              onClick={() => onLayerChange(l.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeLayer === l.id
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              style={activeLayer === l.id ? {
                background: `rgba(${l.dot === '#00ff88' ? '0,255,136' : l.dot === '#00c6ff' ? '0,198,255' : '255,179,0'},0.18)`,
                border: `1px solid ${l.dot}40`,
              } : {}}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: l.dot, opacity: activeLayer === l.id ? 1 : 0.3 }} />
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 min-w-max">
        {/* Draw polygon tool */}
        <button
          id="btn-draw-polygon"
          onClick={onToggleDrawMode}
          title="Draw farm boundary"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
            drawMode
              ? 'text-amber-300 border border-amber-500/40 bg-amber-500/10'
              : 'text-gray-400 hover:text-white border border-white/5 bg-white/3'
          }`}
        >
          <Zap size={13} />
          <span className="hidden sm:block">{drawMode ? 'Drawing…' : 'Draw Plot'}</span>
        </button>

        {/* Live status */}
        <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-lg"
             style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.18)' }}>
          <Wifi size={12} className="text-neon-green animate-pulse" />
          <span className="text-xs text-neon-green font-mono">LIVE</span>
        </div>

        {/* Alert badge */}
        <button id="btn-alerts" className="relative p-2 rounded-lg glass-hover">
          <Bell size={15} className="text-gray-300" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>

        {/* Settings */}
        <button id="btn-settings" className="p-2 rounded-lg glass-hover">
          <Settings size={15} className="text-gray-300" />
        </button>

        {/* Time stamp */}
        <div className="hidden lg:block text-right">
          <div className="text-xs font-mono text-gray-400">23 Jun 2026</div>
          <div className="text-xs font-mono text-neon leading-none">11:09 IST</div>
        </div>

        {/* User profile dropdown */}
        {user && (
          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="w-8 h-8 rounded-full bg-neon-green/20 border border-neon-green/40 flex items-center justify-center text-xs font-bold text-neon-green select-none">
              {user.username ? user.username.substring(0, 2).toUpperCase() : 'US'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-white leading-tight">{user.username}</div>
              <button 
                onClick={onLogout} 
                className="text-[10px] text-red-400 hover:text-red-300 font-medium hover:underline block leading-tight text-left transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
