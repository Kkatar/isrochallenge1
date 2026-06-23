import { Calendar, ChevronUp, ChevronDown, Play, Pause } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { TIMELINE_DATES, PHENO_STAGES, FARM_ZONES } from '../data/mockData'

/**
 * Bottom panel — time-series slider for phenological tracking.
 * Shows current date label, animated playback, and mini stage summary.
 */
export default function BottomPanel({ timeIndex, onTimeChange, selectedZone }) {
  const [collapsed, setCollapsed] = useState(false)
  const [playing, setPlaying]     = useState(false)
  const playRef = useRef(null)

  // Auto-play animation through timeline
  useEffect(() => {
    if (playing) {
      playRef.current = setInterval(() => {
        onTimeChange(prev => {
          if (prev >= TIMELINE_DATES.length - 1) {
            setPlaying(false)
            clearInterval(playRef.current)
            return prev
          }
          return prev + 1
        })
      }, 600)
    } else {
      clearInterval(playRef.current)
    }
    return () => clearInterval(playRef.current)
  }, [playing, onTimeChange])

  const currentDate = TIMELINE_DATES[timeIndex]

  // Determine phenological stage based on time index
  const stageIndex = timeIndex < 3 ? 0 : timeIndex < 7 ? 1 : timeIndex < 10 ? 2 : 3
  const currentStage = PHENO_STAGES[stageIndex]

  return (
    <div id="bottom-panel"
         className={`absolute bottom-0 left-0 right-0 z-[400] glass transition-all duration-300 animate-slide-up`}
         style={{ borderTop:'1px solid rgba(255,255,255,0.07)', height: collapsed ? 40 : 'auto' }}>

      {/* Collapse toggle */}
      <button id="btn-bottom-toggle"
              onClick={() => setCollapsed(c => !c)}
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-3.5 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-colors z-10"
              style={{ border:'1px solid rgba(255,255,255,0.1)' }}>
        {collapsed ? <ChevronUp size={10} className="text-gray-400"/> : <ChevronDown size={10} className="text-gray-400"/>}
      </button>

      {/* Collapsed bar */}
      {collapsed && (
        <div className="h-full flex items-center px-4 gap-3">
          <Calendar size={12} className="text-neon-green" style={{ color:'#00ff88' }}/>
          <span className="text-xs font-mono text-white">{currentDate}</span>
          <span className="text-xs text-gray-500">·</span>
          <span className="text-xs text-gray-400">{currentStage.icon} {currentStage.label}</span>
        </div>
      )}

      {/* Expanded panel */}
      {!collapsed && (
        <div className="px-4 py-3 space-y-2">
          {/* Top row */}
          <div className="flex items-center gap-3">
            <Calendar size={13} style={{ color:'#00ff88', flexShrink:0 }}/>
            <span className="text-xs font-semibold text-gray-300">Phenological Timeline</span>
            <div className="flex items-center gap-2 ml-2">
              <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded-lg"
                    style={{ background:'rgba(0,255,136,0.1)', border:'1px solid rgba(0,255,136,0.2)', color:'#00ff88' }}>
                {currentDate}
              </span>
              <span className="text-xs text-gray-500">·</span>
              <span className="text-xs text-gray-300">{currentStage.icon} {currentStage.label}</span>
            </div>

            {/* Play/Pause */}
            <button id="btn-timeline-play"
                    onClick={() => setPlaying(p => !p)}
                    className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all"
                    style={{ background: playing ? 'rgba(255,179,0,0.15)' : 'rgba(0,255,136,0.1)',
                             border: playing ? '1px solid rgba(255,179,0,0.3)' : '1px solid rgba(0,255,136,0.25)',
                             color: playing ? '#ffb300' : '#00ff88' }}>
              {playing ? <><Pause size={11}/>Pause</> : <><Play size={11}/>Play</>}
            </button>
          </div>

          {/* Slider */}
          <div className="relative">
            {/* Date tick labels */}
            <div className="flex justify-between mb-1">
              {TIMELINE_DATES.filter((_,i) => i % 2 === 0).map(d => (
                <span key={d} className="text-xs text-gray-600" style={{ fontSize:9 }}>{d}</span>
              ))}
            </div>

            <input
              id="timeline-slider"
              type="range"
              min={0}
              max={TIMELINE_DATES.length - 1}
              value={timeIndex}
              onChange={e => onTimeChange(Number(e.target.value))}
              className="w-full"
            />

            {/* Stage bands below track */}
            <div className="flex mt-1 rounded overflow-hidden" style={{ height:3 }}>
              <div style={{ flex:3, background:'rgba(0,255,136,0.25)' }}/>
              <div style={{ flex:4, background:'rgba(0,198,255,0.25)' }}/>
              <div style={{ flex:3, background:'rgba(255,179,0,0.25)' }}/>
              <div style={{ flex:3, background:'rgba(168,85,247,0.25)' }}/>
            </div>
            <div className="flex mt-0.5" style={{ fontSize:8 }}>
              {['Emergence','Vegetative','Flowering','Senescence'].map((s,i) => (
                <div key={s} className="text-gray-600" style={{ flex:[3,4,3,3][i] }}>
                  {['🌱','🌿','🌾','🍂'][i]} {s}
                </div>
              ))}
            </div>
          </div>

          {/* Zone mini cards */}
          {selectedZone && (
            <div className="flex gap-2 pt-1 animate-fade-in">
              {(() => {
                const z = FARM_ZONES.features.find(f => f.id === selectedZone.id)
                const p = z?.properties
                if (!p) return null
                return (
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg"
                       style={{ background:'rgba(0,255,136,0.06)', border:'1px solid rgba(0,255,136,0.18)' }}>
                    <span className="text-xs text-gray-400">Selected:</span>
                    <span className="text-xs font-bold text-neon-green" style={{ color:'#00ff88' }}>{p.cropType}</span>
                    <span className="text-xs text-gray-500">{p.name}</span>
                    <span className="text-xs font-mono" style={{ color: p.stressLevel==='Optimal'?'#00ff88':p.stressLevel==='Mild Stress'?'#ffb300':'#ff4444' }}>
                      {p.stressLevel}
                    </span>
                  </div>
                )
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
