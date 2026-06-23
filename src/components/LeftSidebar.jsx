import { ChevronLeft, ChevronRight, Layers, Radio, Eye, EyeOff, Satellite } from 'lucide-react'
import { SAT_SOURCES, FARM_ZONES } from '../data/mockData'

const LAYER_INFO = {
  optical: {
    title: 'Optical Imagery',
    desc: 'Vegetation vigor via NDVI/EVI indices from multispectral sensors',
    metrics: [
      { label: 'NDVI Range',  value: '0.10 – 0.72', color: '#00ff88' },
      { label: 'EVI Mean',    value: '0.58',          color: '#00ff88' },
      { label: 'Cloud Cover', value: '12%',            color: '#ffb300' },
      { label: 'Resolution',  value: '5.8 – 30m',     color: '#9ca3af' },
    ],
  },
  sar: {
    title: 'Microwave SAR',
    desc: 'Cloud-penetrating radar revealing soil moisture & crop structure',
    metrics: [
      { label: 'σ⁰ backscatter', value: '−12.4 dB',  color: '#00c6ff' },
      { label: 'Moisture Index', value: '0.42',        color: '#00c6ff' },
      { label: 'Penetration',    value: 'Full canopy', color: '#9ca3af' },
      { label: 'Frequency',      value: 'C + L + S',  color: '#9ca3af' },
    ],
  },
  fused: {
    title: 'AI Fused Data',
    desc: 'Deep-learning fusion of optical + SAR for maximum accuracy',
    metrics: [
      { label: 'Fusion Score',    value: '96.4%',  color: '#ffb300' },
      { label: 'Accuracy',        value: '94.1%',  color: '#ffb300' },
      { label: 'Temporal Res.',   value: '3 days', color: '#9ca3af' },
      { label: 'Sources Active',  value: '5 / 5',  color: '#9ca3af' },
    ],
  },
}

/**
 * Collapsible left sidebar: data layers, satellite sensors, zone summary.
 */
export default function LeftSidebar({
  open, onToggle, activeLayer, activeSensors, onSensorToggle, timeIndex,
}) {
  const layerInfo = LAYER_INFO[activeLayer]

  return (
    <aside
      id="left-sidebar"
      className={`relative flex-shrink-0 h-full transition-all duration-300 ease-in-out ${open ? 'w-72' : 'w-0'}`}
    >
      {/* Collapse toggle button */}
      <button
        id="btn-left-toggle"
        onClick={onToggle}
        className="absolute -right-3 top-1/2 -translate-y-1/2 z-50 w-6 h-12 glass rounded-r-lg flex items-center justify-center hover:bg-white/10 transition-colors"
        style={{ border: '1px solid rgba(0,255,136,0.15)', borderLeft: 'none' }}
      >
        {open ? <ChevronLeft size={12} className="text-neon-green" /> : <ChevronRight size={12} className="text-neon-green" />}
      </button>

      {open && (
        <div className="h-full glass border-r border-white/5 flex flex-col animate-slide-left overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2">
              <Layers size={15} className="text-neon-green" />
              <span className="text-sm font-semibold text-white">Data Layers</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
            {/* Active layer card */}
            <div className="glass-hover rounded-xl p-3 space-y-2"
                 style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">{layerInfo.title}</span>
                <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(0,255,136,0.12)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.25)' }}>
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{layerInfo.desc}</p>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {layerInfo.metrics.map(m => (
                  <div key={m.label} className="p-2 rounded-lg"
                       style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="text-xs text-gray-500">{m.label}</div>
                    <div className="text-xs font-mono font-medium mt-0.5" style={{ color: m.color }}>{m.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Satellite sensors */}
            <div>
              <div className="flex items-center gap-2 mb-2 px-1">
                <Satellite size={12} className="text-gray-400" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Satellites</span>
              </div>
              <div className="space-y-1.5">
                {SAT_SOURCES.map(s => {
                  const active = activeSensors.includes(s.id)
                  const isSAR = s.type === 'sar'
                  return (
                    <button
                      key={s.id}
                      id={`sensor-btn-${s.id}`}
                      onClick={() => onSensorToggle(s.id)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 glass-hover"
                      style={{
                        background: active ? (isSAR ? 'rgba(0,198,255,0.08)' : 'rgba(0,255,136,0.08)') : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${active ? (isSAR ? 'rgba(0,198,255,0.25)' : 'rgba(0,255,136,0.25)') : 'rgba(255,255,255,0.06)'}`,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {active ? <Eye size={12} style={{ color: isSAR ? '#00c6ff' : '#00ff88' }} />
                                : <EyeOff size={12} className="text-gray-500" />}
                        <div className="text-left">
                          <div className={`text-xs font-medium ${active ? 'text-white' : 'text-gray-500'}`}>{s.label}</div>
                          <div className="text-xs text-gray-600">{s.band}</div>
                        </div>
                      </div>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${
                        isSAR ? 'text-sar bg-sar-blue/10' : 'text-neon-green bg-neon-green/10'
                      }`}>
                        {s.type.toUpperCase()}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Farm zone list */}
            <div>
              <div className="flex items-center gap-2 mb-2 px-1">
                <Radio size={12} className="text-gray-400" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Farm Zones</span>
              </div>
              <div className="space-y-1.5">
                {FARM_ZONES.features.map(f => {
                  const p = f.properties
                  const stressColor = {
                    'Optimal':       '#00ff88',
                    'Mild Stress':   '#ffb300',
                    'Severe Drought':'#ff4444',
                  }[p.stressLevel]
                  return (
                    <div key={f.id}
                         className="px-3 py-2 rounded-lg"
                         style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-200">{p.cropType}</span>
                        <span className="text-xs font-mono" style={{ color: stressColor }}>
                          {p.stressLevel === 'Optimal' ? '●' : p.stressLevel === 'Mild Stress' ? '◐' : '○'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">{p.area_ha} ha</span>
                        <span className="text-xs font-mono text-gray-400">NDVI {p.ndvi}</span>
                      </div>
                      {/* NDVI bar */}
                      <div className="mt-1.5 h-1 rounded-full bg-white/5">
                        <div className="h-1 rounded-full transition-all duration-500"
                             style={{ width: `${p.ndvi * 100}%`, background: `linear-gradient(90deg, #00ff88, #00c6ff)` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Date range display */}
            <div className="p-3 rounded-xl"
                 style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="text-xs text-gray-400 mb-2">Analysis Period</div>
              <div className="text-xs font-mono text-white">Jan 01, 2026 → Jun 23, 2026</div>
              <div className="text-xs text-gray-500 mt-1">Revisit: Every 3–5 days</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
